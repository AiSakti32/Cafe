const angka = new Intl.NumberFormat('id-ID')

export const rupiah = (n) => 'Rp' + angka.format(n)

export const nomorTrx = (n) => '#' + String(n).padStart(4, '0')

export const tanggal = (iso) =>
  new Date(iso).toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

// 32 karakter = lebar baris printer thermal 58mm.
const LEBAR = 32
const garis = '-'.repeat(LEBAR)
const baris = (kiri, kanan) => kiri + ' '.repeat(Math.max(1, LEBAR - kiri.length - kanan.length)) + kanan
const tengah = (s) => ' '.repeat(Math.max(0, Math.floor((LEBAR - s.length) / 2))) + s

// Teks struk polos, dipakai untuk WhatsApp dan cetak 58mm.
export function teksStruk(t, p) {
  return [
    tengah(p.namaCafe || 'Kasir Cafe'),
    p.alamat && tengah(p.alamat),
    p.noWa && tengah('WA ' + p.noWa),
    garis,
    baris(nomorTrx(t.nomor), tanggal(t.waktu)),
    garis,
    ...t.items.flatMap((i) => [
      i.nama,
      baris(`  ${i.qty} x ${angka.format(i.harga)}`, rupiah(i.qty * i.harga)),
      i.catatan && `  Catatan: ${i.catatan}`,
    ]),
    garis,
    baris('TOTAL', rupiah(t.total)),
    baris(t.metode === 'qris' ? 'QRIS' : 'Tunai', rupiah(t.dibayar)),
    t.metode === 'tunai' && baris('Kembalian', rupiah(t.kembalian)),
    garis,
    p.teksStruk && tengah(p.teksStruk),
  ]
    .filter(Boolean)
    .join('\n')
}
