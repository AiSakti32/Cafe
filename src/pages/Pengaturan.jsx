import { useState } from 'react'
import { Download, Upload, ImagePlus } from 'lucide-react'
import { useStore, isContoh, buatBackup, bacaBackup, pulihkan } from '../store'
import { kompresGambar } from '../lib/gambar'
import { tglKey } from '../lib/laporan'
import { tanggal } from '../lib/format'

function Bagian({ judul, children }) {
  return (
    <section className="mb-4 rounded-2xl bg-white p-4 ring-1 ring-stone-200">
      <h2 className="mb-1 font-semibold">{judul}</h2>
      {children}
    </section>
  )
}

function Pesan({ isi }) {
  if (!isi) return null
  return (
    <p role="status" className={`mt-2 text-sm ${isi.gagal ? 'text-rose-600' : 'text-emerald-700'}`}>
      {isi.teks}
    </p>
  )
}

export default function Pengaturan() {
  const { menu, pengaturan, simpanPengaturan, isiContoh, hapusContoh } = useStore()
  const [pesan, setPesan] = useState({}) // { [bagian]: { teks, gagal } }
  const tulis = (bagian, teks, gagal = false) => setPesan((p) => ({ ...p, [bagian]: { teks, gagal } }))

  // P2: QRIS dikompres ke 1000px (tetap tajam untuk dipindai), kualitas tinggi.
  const unggahQris = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    try {
      simpanPengaturan({ gambarQris: await kompresGambar(file, 1000, 0.92) })
      tulis('qris', 'Gambar QRIS disimpan.')
    } catch {
      tulis('qris', 'Gambar tidak bisa dibaca atau penyimpanan penuh.', true)
    }
  }

  // P3
  const backup = () => {
    const blob = new Blob([JSON.stringify(buatBackup(), null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `kasir-cafe-backup-${tglKey(new Date())}.json`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    tulis('backup', 'File backup diunduh. Simpan di tempat aman (mis. Google Drive).')
  }

  const restore = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    let data
    try {
      data = bacaBackup(JSON.parse(await file.text()))
    } catch (err) {
      return tulis('backup', err instanceof SyntaxError ? 'File tidak bisa dibaca. Pilih file backup .json.' : err.message, true)
    }
    const ringkas = `${data.menu.length} menu dan ${data.transaksi.length} transaksi`
    if (!confirm(`Ganti SEMUA data sekarang dengan isi backup (${ringkas})? Data yang sekarang akan hilang.`)) return
    try {
      pulihkan(data)
      tulis('backup', `Data dipulihkan: ${ringkas}.`)
    } catch {
      tulis('backup', 'Penyimpanan browser penuh, data gagal dipulihkan.', true)
    }
  }

  const isi = () => {
    const n = isiContoh()
    tulis('contoh', n ? `${n} menu contoh ditambahkan.` : 'Semua menu contoh sudah ada.')
  }

  const hapus = () => {
    const n = menu.filter(isContoh).length
    if (!n) return tulis('contoh', 'Tidak ada menu contoh untuk dihapus.')
    if (!confirm(`Hapus ${n} menu contoh? Menu buatan sendiri tidak ikut terhapus.`)) return
    hapusContoh()
    tulis('contoh', `${n} menu contoh dihapus.`)
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Pengaturan</h1>

      <Bagian judul="Identitas cafe">
        <p className="mb-3 text-sm text-stone-500">Tampil di struk. Tersimpan otomatis.</p>
        {[
          ['namaCafe', 'Nama cafe', 'Contoh: Kopi Senja'],
          ['alamat', 'Alamat', 'Contoh: Jl. Merdeka No. 10'],
          ['noWa', 'No. WhatsApp', '08xxxxxxxxxx'],
        ].map(([kunci, label, contoh]) => (
          <label key={kunci} className="mb-3 block">
            <span className="mb-1 block text-sm font-semibold">{label}</span>
            <input
              type={kunci === 'noWa' ? 'tel' : 'text'}
              value={pengaturan[kunci]}
              onChange={(e) => simpanPengaturan({ [kunci]: e.target.value })}
              placeholder={contoh}
              className="input"
            />
          </label>
        ))}
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Teks penutup struk</span>
          <textarea
            value={pengaturan.teksStruk}
            onChange={(e) => simpanPengaturan({ teksStruk: e.target.value })}
            rows={2}
            placeholder="Terima kasih!"
            className="input py-2"
          />
        </label>
      </Bagian>

      <Bagian judul="Gambar QRIS">
        <p className="mb-3 text-sm text-stone-500">Ditampilkan ke pelanggan saat bayar dengan QRIS.</p>
        {pengaturan.gambarQris ? (
          <img src={pengaturan.gambarQris} alt="QRIS cafe" className="mb-3 max-h-64 rounded-xl ring-1 ring-stone-200" />
        ) : (
          <div className="mb-3 rounded-xl border-2 border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">Belum ada gambar QRIS</div>
        )}
        <div className="flex flex-wrap gap-2">
          <label className="btn btn-secondary cursor-pointer">
            <ImagePlus size={18} /> {pengaturan.gambarQris ? 'Ganti gambar' : 'Unggah gambar QRIS'}
            <input type="file" accept="image/*" onChange={unggahQris} className="sr-only" />
          </label>
          {pengaturan.gambarQris && (
            <button
              onClick={() => confirm('Hapus gambar QRIS?') && simpanPengaturan({ gambarQris: null })}
              className="btn text-rose-600 hover:bg-rose-50"
            >
              Hapus
            </button>
          )}
        </div>
        <Pesan isi={pesan.qris} />
      </Bagian>

      <Bagian judul="Backup & restore">
        <p className="mb-3 text-sm text-stone-500">
          Data hanya tersimpan di browser ini. Backup minimal seminggu sekali.
          <br />
          Terakhir backup:{' '}
          <span className="font-semibold text-stone-700">{pengaturan.terakhirBackup ? tanggal(pengaturan.terakhirBackup) : 'belum pernah'}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={backup} className="btn btn-primary">
            <Download size={18} /> Backup
          </button>
          <label className="btn btn-secondary cursor-pointer">
            <Upload size={18} /> Restore
            <input type="file" accept=".json,application/json" onChange={restore} className="sr-only" />
          </label>
        </div>
        <Pesan isi={pesan.backup} />
      </Bagian>

      <Bagian judul="Data contoh">
        <p className="mb-3 text-sm text-stone-500">
          Isi daftar menu dengan contoh supaya bisa langsung mencoba kasir. Menu yang sudah ada tidak diubah.
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={isi} className="btn btn-secondary">
            Isi menu contoh
          </button>
          <button onClick={hapus} className="btn text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50">
            Hapus menu contoh
          </button>
        </div>
        <Pesan isi={pesan.contoh} />
      </Bagian>
    </div>
  )
}
