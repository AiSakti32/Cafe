import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronUp, Coffee } from 'lucide-react'
import { useStore, hitungTotal } from '../store'
import { rupiah } from '../lib/format'
import MenuCard from '../components/MenuCard'
import Keranjang from '../components/Keranjang'
import Bayar from '../components/Bayar'

export default function Kasir() {
  const { menu, kategori, keranjang, tambahKeKeranjang } = useStore()
  const [tab, setTab] = useState('semua')
  const [cari, setCari] = useState('')
  const [bukaKeranjang, setBukaKeranjang] = useState(false)
  const [bayar, setBayar] = useState(false)

  const warna = Object.fromEntries(kategori.map((k) => [k.id, k.warna]))
  const qty = Object.fromEntries(keranjang.map((i) => [i.menuId, i.qty]))
  const q = cari.trim().toLowerCase()
  const tampil = menu.filter((m) => (tab === 'semua' || m.kategoriId === tab) && m.nama.toLowerCase().includes(q))
  const jumlahItem = keranjang.reduce((n, i) => n + i.qty, 0)

  const tambah = (m) => {
    tambahKeKeranjang(m)
    navigator.vibrate?.(10)
  }

  return (
    <div className="px-4 pb-28 lg:mr-[360px] lg:pb-6">
      <div className="sticky top-0 z-10 -mx-4 bg-krem/95 px-4 pt-4 pb-3 backdrop-blur">
        <label className="relative block">
          <Search size={18} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari menu…"
            aria-label="Cari menu"
            className="input pl-10"
          />
        </label>
        <div role="tablist" className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
          {[{ id: 'semua', nama: 'Semua' }, ...kategori].map((k) => (
            <button
              key={k.id}
              role="tab"
              aria-selected={tab === k.id}
              onClick={() => setTab(k.id)}
              className={`min-h-11 shrink-0 rounded-full px-4 font-semibold transition-colors duration-200 ${
                tab === k.id ? 'bg-primary-800 text-white' : 'bg-white text-stone-600 ring-1 ring-stone-200'
              }`}
            >
              {k.nama}
            </button>
          ))}
        </div>
      </div>

      {!menu.length ? (
        <div className="mt-8 rounded-2xl bg-white p-8 text-center ring-1 ring-stone-200">
          <Coffee size={44} className="mx-auto mb-2 text-primary-200" aria-hidden="true" />
          <p className="font-semibold">Belum ada menu</p>
          <p className="mt-1 text-sm text-stone-500">Tambahkan menu dulu supaya bisa mulai berjualan.</p>
          <Link to="/menu" className="btn btn-primary mt-4">
            Buka halaman Menu
          </Link>
        </div>
      ) : !tampil.length ? (
        <p className="mt-8 text-center text-stone-500">Tidak ada menu yang cocok.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-4">
          {tampil.map((m) => (
            <MenuCard key={m.id} menu={m} warna={warna[m.kategoriId]} qty={qty[m.id]} onTambah={() => tambah(m)} />
          ))}
        </div>
      )}

      {/* Bar total, HP & tablet (K5): muncul begitu ada item */}
      {jumlahItem > 0 && (
      <button
        onClick={() => setBukaKeranjang(true)}
        className="fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-20 flex min-h-14 animate-naik items-center justify-between rounded-2xl bg-primary-800 px-4 text-white shadow-lg shadow-primary-900/30 transition active:scale-[0.98] lg:hidden"
      >
        <span className="tabular-nums">
          {jumlahItem} item · <b>{rupiah(hitungTotal(keranjang))}</b>
        </span>
        <span className="flex items-center gap-1 font-semibold">
          Lihat pesanan <ChevronUp size={18} aria-hidden="true" />
        </span>
      </button>
      )}

      <Keranjang
        buka={bukaKeranjang}
        onTutup={() => setBukaKeranjang(false)}
        onBayar={() => {
          setBukaKeranjang(false)
          setBayar(true)
        }}
      />
      {bayar && <Bayar onTutup={() => setBayar(false)} />}
    </div>
  )
}
