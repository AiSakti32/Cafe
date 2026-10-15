const pad = (n) => String(n).padStart(2, '0')

// Kunci tanggal lokal YYYY-MM-DD (bukan toISOString, itu UTC dan bisa geser hari).
export const tglKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const geserHari = (key, n) => {
  const d = new Date(key + 'T00:00')
  d.setDate(d.getDate() + n)
  return tglKey(d)
}

export const labelTgl = (key, opsi = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) =>
  new Date(key + 'T00:00').toLocaleDateString('id-ID', opsi)

// Laporan rentang [dari, sampai]. Angka hanya dari transaksi selesai;
// `daftar` memuat semua transaksi (termasuk batal) untuk riwayat, terbaru dulu.
export function hitungLaporan(transaksi, dari, sampai) {
  const daftar = transaksi
    .filter((t) => {
      const k = tglKey(new Date(t.waktu))
      return k >= dari && k <= sampai
    })
    .sort((a, b) => b.nomor - a.nomor)
  const selesai = daftar.filter((t) => t.status === 'selesai')
  const omzet = selesai.reduce((n, t) => n + t.total, 0)

  const perMenu = {}
  for (const t of selesai)
    for (const i of t.items) {
      const m = (perMenu[i.menuId] ??= { menuId: i.menuId, nama: i.nama, qty: 0, omzet: 0 })
      m.qty += i.qty
      m.omzet += i.qty * i.harga
    }

  const perMetode = (metode) => {
    const d = selesai.filter((t) => t.metode === metode)
    return { total: d.reduce((n, t) => n + t.total, 0), jumlah: d.length }
  }

  return {
    daftar,
    omzet,
    jumlah: selesai.length,
    rata: selesai.length ? Math.round(omzet / selesai.length) : 0,
    itemTerjual: selesai.reduce((n, t) => n + t.items.reduce((a, i) => a + i.qty, 0), 0),
    terlaris: Object.values(perMenu)
      .sort((a, b) => b.qty - a.qty || b.omzet - a.omzet)
      .slice(0, 5),
    tunai: perMetode('tunai'),
    qris: perMetode('qris'),
  }
}
