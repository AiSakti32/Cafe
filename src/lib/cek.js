// Cek cepat logika uang, struk, laporan & backup: npm run cek
import assert from 'node:assert/strict'
import { teksStruk } from './format.js'
import { hitungLaporan, tglKey, geserHari } from './laporan.js'

// window.localStorage tiruan untuk Node (dipakai zustand persist), lalu store diimpor setelahnya.
const data = new Map()
globalThis.window = {
  localStorage: { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v), removeItem: (k) => data.delete(k) },
}
const { useStore, bacaBackup, pulihkan, buatBackup } = await import('../store.js')

const s = useStore.getState
s().isiContoh()
const [kopi, , , , , , , , , , , croissant] = s().menu
s().tambahKeKeranjang(kopi)
s().tambahKeKeranjang(kopi)
s().tambahKeKeranjang(croissant)
s().ubahCatatan(kopi.id, ' less sugar ')
assert.equal(s().bayar({ metode: 'tunai', dibayar: 50000 }), null, 'uang kurang harus ditolak')

const t = s().bayar({ metode: 'tunai', dibayar: 100000 })
assert.equal(t.total, 57000)
assert.equal(t.kembalian, 43000)
assert.equal(t.nomor, 1)
assert.equal(t.items[0].catatan, 'less sugar')
assert.equal(s().keranjang.length, 0, 'keranjang kosong setelah bayar')

s().tambahKeKeranjang(kopi)
s().ubahQty(kopi.id, -1)
assert.equal(s().keranjang.length, 0, 'qty 0 = item terhapus')
assert.equal(s().bayar({ metode: 'qris', dibayar: 0 }), null, 'keranjang kosong harus ditolak')

const struk = teksStruk(t, s().pengaturan)
assert.ok(struk.split('\n').every((b) => b.length <= 32), 'tiap baris struk maks 32 karakter')
assert.match(struk, /Kembalian\s+Rp43\.000/)

s().simpanMenu({ nama: 'Americano', kategoriId: 'kopi', harga: 15000, foto: null })
s().hapusContoh()
assert.deepEqual(s().menu.map((m) => m.nama), ['Americano'], 'hanya menu contoh yang terhapus')
// Laporan: hanya transaksi selesai yang dihitung, rentang tanggal lokal
const hariIni = tglKey(new Date())
const trx = (nomor, hari, metode, items, status = 'selesai') => {
  const total = items.reduce((n, [, q, h]) => n + q * h, 0)
  return {
    id: 't' + nomor,
    nomor,
    waktu: new Date(geserHari(hariIni, hari) + 'T00:30').toISOString(),
    metode,
    total,
    dibayar: total,
    kembalian: 0,
    status,
    items: items.map(([nama, qty, harga]) => ({ menuId: nama, nama, qty, harga, catatan: '' })),
  }
}
const semua = [
  trx(1, 0, 'tunai', [['Es Kopi Susu', 2, 18000], ['Croissant', 1, 21000]]),
  trx(2, 0, 'qris', [['Americano', 1, 15000], ['Es Kopi Susu', 1, 18000]]),
  trx(3, 0, 'tunai', [['Nasi Goreng', 2, 25000]], 'batal'),
  trx(4, -1, 'qris', [['Matcha Latte', 3, 23000]]),
  trx(5, -7, 'tunai', [['Croissant', 2, 21000]]),
]
const L = hitungLaporan(semua, hariIni, hariIni)
assert.deepEqual([L.omzet, L.jumlah, L.rata, L.itemTerjual], [90000, 2, 45000, 5], 'transaksi batal tidak dihitung')
assert.deepEqual([L.tunai, L.qris], [{ total: 57000, jumlah: 1 }, { total: 33000, jumlah: 1 }])
assert.deepEqual(
  L.terlaris.map((m) => [m.nama, m.qty, m.omzet]),
  [['Es Kopi Susu', 3, 54000], ['Croissant', 1, 21000], ['Americano', 1, 15000]],
)
assert.deepEqual(L.daftar.map((t) => t.nomor), [3, 2, 1], 'riwayat memuat transaksi batal, terbaru dulu')
assert.equal(hitungLaporan(semua, geserHari(hariIni, -6), hariIni).omzet, 159000, '7 hari tidak memuat hari ke-8')

// Backup/restore: file asing/rusak ditolak, backup sendiri bisa dipulihkan utuh
assert.throws(() => bacaBackup({ app: 'lain' }), /bukan backup/)
assert.throws(
  () => bacaBackup({ app: 'kasir-cafe', data: { kategori: [], menu: [{ id: 'x', nama: 'X' }], transaksi: [], pengaturan: {} } }),
  /bukan backup/,
)
useStore.setState({ transaksi: semua })
const file = JSON.parse(JSON.stringify(buatBackup()))
useStore.setState({ menu: [], transaksi: [] })
pulihkan(bacaBackup(file))
assert.equal(s().transaksi.length, 5)
assert.equal(s().menu.length, 1)
assert.ok(s().pengaturan.terakhirBackup)

console.log(struk + '\n\nOK: semua cek lulus')
