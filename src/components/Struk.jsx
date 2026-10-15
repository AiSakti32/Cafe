import { createPortal } from 'react-dom'
import { useStore } from '../store'
import { teksStruk } from '../lib/format'

// Dirender di luar #root; hanya tampil saat window.print() (lihat .struk di index.css).
export default function Struk({ transaksi }) {
  const pengaturan = useStore((s) => s.pengaturan)
  return createPortal(<pre className="struk">{teksStruk(transaksi, pengaturan)}</pre>, document.body)
}
