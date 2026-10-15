import { Link, useSearchParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useStore } from '../store'
import { rupiah, nomorTrx, jam, tanggal } from '../lib/format'
import { hitungLaporan, tglKey, geserHari, labelTgl } from '../lib/laporan'

export default function Laporan() {
  const transaksi = useStore((s) => s.transaksi)
  // Rentang tanggal disimpan di URL supaya tetap sama setelah buka detail lalu kembali.
  const [params, setParams] = useSearchParams()
  const hariIni = tglKey(new Date())
  const dari = params.get('dari') ?? hariIni
  const sampai = params.get('sampai') ?? dari
  const pilih = (d, s = d) => setParams({ dari: d, sampai: s }, { replace: true })
  const satuHari = dari === sampai
  const L = hitungLaporan(transaksi, dari, sampai)

  const kemarin = geserHari(hariIni, -1)
  const cepat = [
    ['Hari ini', hariIni, hariIni],
    ['Kemarin', kemarin, kemarin],
    ['7 hari', geserHari(hariIni, -6), hariIni],
  ]
  const pendek = { day: 'numeric', month: 'short', year: 'numeric' }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Laporan</h1>

      <div className="mb-2 flex flex-wrap items-center gap-2">
        {cepat.map(([label, d, s]) => (
          <button
            key={label}
            onClick={() => pilih(d, s)}
            aria-pressed={dari === d && sampai === s}
            className={`min-h-11 rounded-full px-4 font-semibold transition-colors duration-200 ${
              dari === d && sampai === s ? 'bg-primary-800 text-white' : 'bg-white text-stone-600 ring-1 ring-stone-200'
            }`}
          >
            {label}
          </button>
        ))}
        <input
          type="date"
          value={satuHari ? dari : ''}
          max={hariIni}
          onChange={(e) => e.target.value && pilih(e.target.value)}
          aria-label="Pilih tanggal"
          className="input w-auto"
        />
      </div>
      <p className="mb-4 text-stone-500">{satuHari ? labelTgl(dari) : `${labelTgl(dari, pendek)} – ${labelTgl(sampai, pendek)}`}</p>

      {/* L1 */}
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ['Omzet', rupiah(L.omzet)],
          ['Transaksi', L.jumlah],
          ['Rata-rata', rupiah(L.rata)],
          ['Item terjual', L.itemTerjual],
        ].map(([label, nilai], i) => (
          <div key={label} className={`rounded-2xl p-4 ${i ? 'bg-white ring-1 ring-stone-200' : 'bg-linear-to-br from-primary-700 to-primary-900 text-white shadow-md shadow-primary-900/20'}`}>
            <div className={`text-sm ${i ? 'text-stone-500' : 'text-primary-100'}`}>{label}</div>
            <div className="mt-1 text-xl font-bold tabular-nums sm:text-2xl">{nilai}</div>
          </div>
        ))}
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        {/* L3 */}
        <section className="rounded-2xl bg-white p-4 ring-1 ring-stone-200">
          <h2 className="mb-3 font-semibold">Menu terlaris</h2>
          {L.terlaris.length ? (
            <ol className="space-y-3">
              {L.terlaris.map((m, i) => (
                <li key={m.menuId} className="flex items-center gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary-100 text-sm font-bold text-primary-900">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-medium">{m.nama}</span>
                  <span className="text-sm text-stone-500 tabular-nums">{m.qty}×</span>
                  <span className="w-24 text-right font-semibold tabular-nums">{rupiah(m.omzet)}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-stone-500">Belum ada penjualan.</p>
          )}
        </section>

        {/* L4 */}
        <section className="rounded-2xl bg-white p-4 ring-1 ring-stone-200">
          <h2 className="mb-3 font-semibold">Metode bayar</h2>
          {[
            ['Tunai', L.tunai, 'bg-primary-800'],
            ['QRIS', L.qris, 'bg-stone-500'],
          ].map(([label, d, warna]) => (
            <div key={label} className="mb-4 last:mb-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-medium">
                  {label} <span className="text-sm text-stone-500">· {d.jumlah} transaksi</span>
                </span>
                <span className="font-semibold tabular-nums">{rupiah(d.total)}</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-stone-100">
                <div className={`h-2 rounded-full ${warna}`} style={{ width: `${L.omzet ? (d.total / L.omzet) * 100 : 0}%` }} />
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* L5 */}
      <section>
        <h2 className="mb-2 font-semibold">Riwayat transaksi</h2>
        {L.daftar.length ? (
          <ul className="divide-y divide-stone-100 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200">
            {L.daftar.map((t) => {
              const batal = t.status === 'batal'
              return (
                <li key={t.id}>
                  <Link to={`/laporan/${t.id}`} className="flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-primary-50/50">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{nomorTrx(t.nomor)}</span>
                        <span className="text-sm text-stone-500">{satuHari ? jam(t.waktu) : tanggal(t.waktu)}</span>
                        {batal && <span className="rounded-full bg-rose-50 px-2 text-xs font-semibold text-rose-600">Batal</span>}
                      </div>
                      <div className="truncate text-sm text-stone-500">{t.items.map((i) => `${i.qty}× ${i.nama}`).join(', ')}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold tabular-nums ${batal ? 'text-stone-400 line-through' : ''}`}>{rupiah(t.total)}</div>
                      <div className="text-xs text-stone-500">{t.metode === 'qris' ? 'QRIS' : 'Tunai'}</div>
                    </div>
                    <ChevronRight size={18} className="shrink-0 text-stone-400" />
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="rounded-2xl bg-white p-6 text-center text-stone-500 ring-1 ring-stone-200">Belum ada transaksi di tanggal ini.</p>
        )}
      </section>
    </div>
  )
}
