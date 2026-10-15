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

export const useStore = create(
  persist(
    (set, get) => ({
      kategori: KATEGORI_AWAL,
      menu: [],

      simpanMenu: (data) =>
        set((s) => ({
          menu: data.id
            ? s.menu.map((m) => (m.id === data.id ? { ...m, ...data } : m))
            : [...s.menu, { ...data, id: uid(), tersedia: true }],
        })),
      hapusMenu: (id) => set((s) => ({ menu: s.menu.filter((m) => m.id !== id) })),
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
          ([nama, kategoriId, harga]) => ({ id: uid(), nama, kategoriId, harga, tersedia: true, foto: null }),
        )
        set({
          kategori: [...kategori, ...KATEGORI_AWAL.filter((k) => !kategori.some((x) => x.id === k.id))],
          menu: [...menu, ...menuBaru],
        })
        return menuBaru.length
      },
    }),
    { name: 'kasir-cafe' },
  ),
)

// Minta browser tidak menghapus data otomatis (perlu HTTPS/localhost).
navigator.storage?.persist?.()
