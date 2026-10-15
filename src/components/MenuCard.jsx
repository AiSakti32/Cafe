import MenuThumb from './MenuThumb'
import { rupiah } from '../lib/format'

export default function MenuCard({ menu, warna, qty, onTambah }) {
  const habis = !menu.tersedia
  return (
    <button
      onClick={onTambah}
      disabled={habis}
      className="relative flex flex-col overflow-hidden rounded-2xl bg-white text-left ring-1 ring-stone-200 transition active:scale-95 disabled:opacity-50 disabled:grayscale"
    >
      <MenuThumb nama={menu.nama} foto={menu.foto} warna={warna} className="aspect-[4/3] w-full text-3xl" />
      <div className="p-3">
        <div className="line-clamp-2 leading-tight font-semibold">{menu.nama}</div>
        <div className="mt-1 text-sm font-semibold text-amber-700 tabular-nums">{rupiah(menu.harga)}</div>
      </div>
      {habis && (
        <span className="absolute top-2 left-2 rounded-full bg-stone-900/75 px-2.5 py-0.5 text-xs font-semibold text-white">Habis</span>
      )}
      {qty > 0 && (
        // key={qty}: badge dipasang ulang tiap qty berubah supaya animasinya diputar lagi.
        <span
          key={qty}
          className="absolute top-2 right-2 grid size-8 animate-pop place-items-center rounded-full bg-amber-700 text-sm font-bold text-white shadow-md tabular-nums"
        >
          {qty}
        </span>
      )}
    </button>
  )
}
