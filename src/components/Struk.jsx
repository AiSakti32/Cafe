import { createPortal } from 'react-dom'
import { MessageCircle, Printer } from 'lucide-react'
import { useStore } from '../store'
import { teksStruk, linkWa } from '../lib/format'

// Dirender di luar #root; hanya tampil saat window.print() (lihat .struk di index.css).
export default function Struk({ transaksi }) {
  const pengaturan = useStore((s) => s.pengaturan)
  return createPortal(<pre className="struk">{teksStruk(transaksi, pengaturan)}</pre>, document.body)
}

// Tombol "Kirim WhatsApp" + "Cetak" (K8, juga kirim ulang di detail transaksi).
export function TombolStruk({ transaksi }) {
  const pengaturan = useStore((s) => s.pengaturan)
  return (
    <div className="grid grid-cols-2 gap-2">
      <button onClick={() => window.open(linkWa(transaksi, pengaturan), '_blank')} className="btn btn-secondary px-2 text-sm whitespace-nowrap">
        <MessageCircle size={18} /> Kirim WhatsApp
      </button>
      <button onClick={() => window.print()} className="btn btn-secondary px-2 text-sm whitespace-nowrap">
        <Printer size={18} /> Cetak
      </button>
      <Struk transaksi={transaksi} />
    </div>
  )
}
