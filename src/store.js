import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Bukan crypto.randomUUID(): itu tidak ada di http://IP-LAN saat dites dari HP.
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

// Warna gelap supaya inisial putih tetap terbaca.
const WARNA = ['#92400e', '#0e7490', '#c2410c', '#be185d', '#4d7c0f', '#6d28d9', '#1d4ed8', '#0f766e']

const KATEGORI_AWAL = [
  { id: 'kopi', nama: 'Kopi', warna: WARNA[0], urutan: 0 },
  { id: 'non-kopi', nama: 'Non-Kopi', warna: WARNA[1], urutan: 1 },
  { id: 'makanan', nama: 'Makanan', warna: WARNA[2], urutan: 2 },
  { id: 'snack', nama: 'Snack', warna: WARNA[3], urutan: 3 },
]

const MENU_CONTOH = [
  ['Es Kopi Susu', 'kopi', 18000],
  ['Americano', 'kopi', 15000],
  ['Cappuccino', 'kopi', 22000],
  ['Caffe Latte', 'kopi', 22000],
  ['Es Kopi Aren', 'kopi', 20000],
  ['Matcha Latte', 'non-kopi', 23000],
  ['Coklat', 'non-kopi', 20000],
  ['Es Teh Lemon', 'non-kopi', 12000],
  ['Nasi Goreng', 'makanan', 25000],
  ['Mie Goreng', 'makanan', 22000],
  ['Roti Bakar', 'makanan', 15000],
  ['Croissant', 'snack', 21000],
  ['Kentang Goreng', 'snack', 15000],
  ['Pisang Goreng', 'snack', 12000],
]

// Menu contoh ditandai saat diisi; menu lama (sebelum ada tanda) dikenali dari nama+kategori+harga yang persis sama.
export const isContoh = (m) =>
  m.contoh ?? MENU_CONTOH.some(([nama, kategoriId, harga]) => m.nama === nama && m.kategoriId === kategoriId && m.harga === harga)

export const hitungTotal = (items) => items.reduce((n, i) => n + i.harga * i.qty, 0)

const PENGATURAN_AWAL = { namaCafe: '', alamat: '', noWa: '', teksStruk: 'Terima kasih!', gambarQris: null, terakhirBackup: null }

export const useStore = create(
  persist(
    (set, get) => ({
      kategori: KATEGORI_AWAL,
      menu: [],
      keranjang: [], // [{ menuId, nama, harga, qty, catatan }], nama & harga disalin saat ditambah
      transaksi: [],
      pengaturan: PENGATURAN_AWAL,

      simpanPengaturan: (data) => set((s) => ({ pengaturan: { ...s.pengaturan, ...data } })),
      // Transaksi batal tetap tercatat, hanya tidak dihitung di laporan (L6).
      batalkanTransaksi: (id) =>
        set((s) => ({ transaksi: s.transaksi.map((t) => (t.id === id && t.status === 'selesai' ? { ...t, status: 'batal' } : t)) })),

      simpanMenu: (data) =>
        set((s) => ({
          menu: data.id
            ? s.menu.map((m) => (m.id === data.id ? { ...m, ...data } : m))
            : [...s.menu, { ...data, id: uid(), tersedia: true, contoh: false }],
        })),
      hapusMenu: (id) =>
        set((s) => ({ menu: s.menu.filter((m) => m.id !== id), keranjang: s.keranjang.filter((i) => i.menuId !== id) })),
      toggleTersedia: (id) =>
        set((s) => ({ menu: s.menu.map((m) => (m.id === id ? { ...m, tersedia: !m.tersedia } : m)) })),

      tambahKategori: (nama) =>
        set((s) => ({
          kategori: [
            ...s.kategori,
            {
              id: uid(),
              nama,
              warna: WARNA[s.kategori.length % WARNA.length],
              urutan: Math.max(-1, ...s.kategori.map((k) => k.urutan)) + 1,
            },
          ],
        })),
      ubahKategori: (id, nama) =>
        set((s) => ({ kategori: s.kategori.map((k) => (k.id === id ? { ...k, nama } : k)) })),
      // Kategori yang masih dipakai menu tidak boleh dihapus (M3).
      hapusKategori: (id) =>
        set((s) => (s.menu.some((m) => m.kategoriId === id) ? s : { kategori: s.kategori.filter((k) => k.id !== id) })),

      // Menambah kategori & menu contoh yang belum ada (dicek per id/nama), jadi aman ditekan berulang.
      isiContoh: () => {
        const { kategori, menu } = get()
        const menuBaru = MENU_CONTOH.filter(([nama]) => !menu.some((m) => m.nama === nama)).map(
          ([nama, kategoriId, harga]) => ({ id: uid(), nama, kategoriId, harga, tersedia: true, foto: null, contoh: true }),
        )
        set({
          kategori: [...kategori, ...KATEGORI_AWAL.filter((k) => !kategori.some((x) => x.id === k.id))],
          menu: [...menu, ...menuBaru],
        })
        return menuBaru.length
      },
      hapusContoh: () =>
        set((s) => {
          const sisa = s.menu.filter((m) => !isContoh(m))
          return { menu: sisa, keranjang: s.keranjang.filter((i) => sisa.some((m) => m.id === i.menuId)) }
        }),

      tambahKeKeranjang: (m) =>
        set((s) => ({
          keranjang: s.keranjang.some((i) => i.menuId === m.id)
            ? s.keranjang.map((i) => (i.menuId === m.id ? { ...i, qty: i.qty + 1 } : i))
            : [...s.keranjang, { menuId: m.id, nama: m.nama, harga: m.harga, qty: 1, catatan: '' }],
        })),
      // qty 0 = item terhapus (K4).
      ubahQty: (menuId, delta) =>
        set((s) => ({
          keranjang: s.keranjang.map((i) => (i.menuId === menuId ? { ...i, qty: i.qty + delta } : i)).filter((i) => i.qty > 0),
        })),
      ubahCatatan: (menuId, catatan) =>
        set((s) => ({ keranjang: s.keranjang.map((i) => (i.menuId === menuId ? { ...i, catatan } : i)) })),
      kosongkanKeranjang: () => set({ keranjang: [] }),

      // Simpan transaksi dari keranjang. Ditolak (null) kalau keranjang kosong atau uang kurang (K7).
      bayar: ({ metode, dibayar }) => {
        const { keranjang, transaksi } = get()
        const total = hitungTotal(keranjang)
        if (!keranjang.length || !(dibayar >= total)) return null
        const t = {
          id: uid(),
          nomor: transaksi.reduce((n, x) => Math.max(n, x.nomor), 0) + 1,
          waktu: new Date().toISOString(),
          items: keranjang.map((i) => ({ ...i, catatan: i.catatan.trim() })),
          subtotal: total,
          diskon: 0,
          total,
          metode,
          dibayar,
          kembalian: dibayar - total,
          status: 'selesai',
        }
        set({ transaksi: [...transaksi, t], keranjang: [] })
        return t
      },
    }),
    { name: 'kasir-cafe' },
  ),
)

// Pengingat backup tiap 7 hari, dihitung dari backup terakhir (atau transaksi pertama kalau belum pernah backup).
export const perluBackup = (s) => {
  const acuan = s.pengaturan.terakhirBackup ?? s.transaksi[0]?.waktu
  return !!acuan && Date.now() - new Date(acuan) > 7 * 864e5
}

// Isi file backup .json: seluruh data store.
export function buatBackup() {
  useStore.getState().simpanPengaturan({ terakhirBackup: new Date().toISOString() })
  const { kategori, menu, keranjang, transaksi, pengaturan } = useStore.getState()
  return { app: 'kasir-cafe', versi: 1, dibuat: pengaturan.terakhirBackup, data: { kategori, menu, keranjang, transaksi, pengaturan } }
}

// File restore datang dari luar aplikasi: cek bentuknya dulu supaya data rusak tidak membuat halaman error.
export function bacaBackup(json) {
  const d = json?.data
  const str = (v) => typeof v === 'string'
  const num = (v) => typeof v === 'number' && Number.isFinite(v)
  const valid =
    json?.app === 'kasir-cafe' &&
    d &&
    Array.isArray(d.kategori) &&
    d.kategori.every((k) => str(k?.id) && str(k.nama)) &&
    Array.isArray(d.menu) &&
    d.menu.every((m) => str(m?.id) && str(m.nama) && str(m.kategoriId) && num(m.harga)) &&
    Array.isArray(d.transaksi) &&
    d.transaksi.every(
      (t) =>
        str(t?.id) &&
        num(t.nomor) &&
        num(t.total) &&
        !isNaN(new Date(t.waktu)) &&
        Array.isArray(t.items) &&
        t.items.every((i) => str(i?.nama) && num(i.qty) && num(i.harga)),
    ) &&
    d.pengaturan !== null &&
    typeof d.pengaturan === 'object'
  if (!valid) throw new Error('File ini bukan backup Kasir Cafe yang valid.')
  return d
}

export const pulihkan = (d) =>
  useStore.setState({
    kategori: d.kategori,
    menu: d.menu,
    transaksi: d.transaksi,
    keranjang: Array.isArray(d.keranjang) ? d.keranjang : [],
    pengaturan: { ...PENGATURAN_AWAL, ...d.pengaturan },
  })

// Minta browser tidak menghapus data otomatis (perlu HTTPS/localhost).
navigator.storage?.persist?.()
