import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useStore } from '../store'
import { rupiah, nomorTrx, tanggal } from '../lib/format'
import { TombolStruk } from '../components/Struk'

export default function DetailTransaksi() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { transaksi, batalkanTransaksi } = useStore()
  const t = transaksi.find((x) => x.id === id)
  // Kembali ke laporan dengan tanggal yang tadi dipilih; kalau dibuka langsung, ke laporan hari ini.
  const kembali = () => (location.key !== 'default' ? navigate(-1) : navigate('/laporan'))

  if (!t)
    return (
      <div className="p-4 text-center">
        <p className="mt-8 font-semibold">Transaksi tidak ditemukan</p>
        <Link to="/laporan" className="btn btn-secondary mt-4">
          Ke Laporan
        </Link>
      </div>
    )

  const batal = t.status === 'batal'
  const batalkan = () => {
    if (confirm(`Batalkan transaksi ${nomorTrx(t.nomor)}? Transaksi tetap tercatat tapi tidak dihitung di omzet.`)) batalkanTransaksi(t.id)
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <button onClick={kembali} className="-ml-2 mb-2 flex min-h-11 items-center gap-1 rounded-xl px-2 font-semibold text-stone-600 hover:bg-stone-100">
        <ChevronLeft size={20} /> Laporan
      </button>

      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">{nomorTrx(t.nomor)}</h1>
          <div className="text-stone-500">{tanggal(t.waktu)}</div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${batal ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-700'}`}
        >
          {batal ? 'Dibatalkan' : 'Selesai'}
        </span>
      </div>

      <section className="rounded-2xl bg-white p-4 ring-1 ring-stone-200">
        <ul className="divide-y divide-stone-100">
          {t.items.map((i) => (
            <li key={i.menuId} className="py-2 first:pt-0">
              <div className="flex justify-between gap-2">
                <span className="font-semibold">{i.nama}</span>
                <span className="tabular-nums">{rupiah(i.qty * i.harga)}</span>
              </div>
              <div className="text-sm text-stone-500 tabular-nums">
                {i.qty} × {rupiah(i.harga)}
              </div>
              {i.catatan && <div className="text-sm text-amber-800">Catatan: {i.catatan}</div>}
            </li>
          ))}
        </ul>
        <dl className="mt-2 space-y-1 border-t border-stone-200 pt-3 tabular-nums">
          {[
            ['Total', rupiah(t.total)],
            ['Metode', t.metode === 'qris' ? 'QRIS' : 'Tunai'],
            ['Dibayar', rupiah(t.dibayar)],
            t.metode === 'tunai' && ['Kembalian', rupiah(t.kembalian)],
          ]
            .filter(Boolean)
            .map(([label, nilai], i) => (
              <div key={label} className={`flex justify-between ${i ? '' : 'text-lg font-bold'} ${batal && !i ? 'text-stone-400 line-through' : ''}`}>
                <dt>{label}</dt>
                <dd>{nilai}</dd>
              </div>
            ))}
        </dl>
      </section>
      {batal && <p className="mt-3 text-sm text-rose-600">Transaksi ini dibatalkan dan tidak dihitung di omzet.</p>}

      <div className="mt-4 grid gap-2">
        <TombolStruk transaksi={t} />
        {!batal && (
          <button onClick={batalkan} className="btn text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50">
            Batalkan transaksi
          </button>
        )}
      </div>
    </div>
  )
}
