import { useState } from 'react'
import { useStore } from '../store'

export default function Pengaturan() {
  const isiContoh = useStore((s) => s.isiContoh)
  const [pesan, setPesan] = useState('')

  const isi = () => {
    const n = isiContoh()
    setPesan(n ? `${n} menu contoh ditambahkan.` : 'Semua menu contoh sudah ada.')
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Pengaturan</h1>
      <section className="rounded-2xl bg-white p-4 ring-1 ring-stone-200">
        <h2 className="font-semibold">Data contoh</h2>
        <p className="mt-1 text-sm text-stone-500">
          Isi daftar menu dengan contoh supaya bisa langsung mencoba kasir. Menu yang sudah ada tidak diubah.
        </p>
        <button onClick={isi} className="btn btn-secondary mt-3">
          Isi menu contoh
        </button>
        {pesan && (
          <p role="status" className="mt-2 text-sm text-emerald-700">
            {pesan}
          </p>
        )}
      </section>
    </div>
  )
}
