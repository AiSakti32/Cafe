// Cek cepat logika uang & struk: node src/lib/cek.js
import assert from 'node:assert/strict'
import { teksStruk } from './format.js'

// window.localStorage tiruan untuk Node (dipakai zustand persist), lalu store diimpor setelahnya.
const data = new Map()
globalThis.window = {
  localStorage: { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v), removeItem: (k) => data.delete(k) },
}
const { useStore } = await import('../store.js')

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
console.log(struk + '\n\nOK: semua cek lulus')
