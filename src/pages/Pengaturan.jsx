import { useState } from 'react'
import { useStore, isContoh } from '../store'

export default function Pengaturan() {
  const { menu, isiContoh, hapusContoh } = useStore()
  const [pesan, setPesan] = useState('')

  const isi = () => {
    const n = isiContoh()
    setPesan(n ? `${n} menu contoh ditambahkan.` : 'Semua menu contoh sudah ada.')
  }

  const hapus = () => {
    const n = menu.filter(isContoh).length
    if (!n) return setPesan('Tidak ada menu contoh untuk dihapus.')
    if (!confirm(`Hapus ${n} menu contoh? Menu buatan sendiri tidak ikut terhapus.`)) return
    hapusContoh()
    setPesan(`${n} menu contoh dihapus.`)
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Pengaturan</h1>
      <section className="rounded-2xl bg-white p-4 ring-1 ring-stone-200">
        <h2 className="font-semibold">Data contoh</h2>
        <p className="mt-1 text-sm text-stone-500">
          Isi daftar menu dengan contoh supaya bisa langsung mencoba kasir. Menu yang sudah ada tidak diubah.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={isi} className="btn btn-secondary">
            Isi menu contoh
          </button>
          <button onClick={hapus} className="btn text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50">
            Hapus menu contoh
          </button>
        </div>
        {pesan && (
          <p role="status" className="mt-2 text-sm text-emerald-700">
            {pesan}
          </p>
        )}
      </section>
    </div>
  )
}
