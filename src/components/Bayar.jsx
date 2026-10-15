import { useState } from 'react'
import { X, Check, Plus } from 'lucide-react'
import { useStore, hitungTotal } from '../store'
import { rupiah, nomorTrx } from '../lib/format'
import { TombolStruk } from './Struk'

// HP: layar penuh. sm ke atas: dialog di tengah.
function Modal({ children, onTutup }) {
  return (
    <div onClick={onTutup} className="fixed inset-0 z-50 flex bg-stone-900/40 sm:items-center sm:justify-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full flex-col bg-white sm:h-auto sm:max-h-[90dvh] sm:max-w-md sm:rounded-3xl"
      >
        {children}
      </div>
    </div>
  )
}

export default function Bayar({ onTutup }) {
  const { keranjang, pengaturan, bayar } = useStore()
  const [metode, setMetode] = useState('tunai')
  const [diterima, setDiterima] = useState('')
  const [sukses, setSukses] = useState(null)

  if (sukses) return <Sukses t={sukses} onBaru={onTutup} />

  const total = hitungTotal(keranjang)
  const dibayar = metode === 'qris' ? total : Number(diterima) || 0
  const kurang = dibayar < total

  const proses = () => {
    const t = bayar({ metode, dibayar })
    if (t) {
      navigator.vibrate?.(30)
      setSukses(t)
    }
  }

  return (
    <Modal onTutup={onTutup}>
      <div className="flex items-center justify-between px-4 py-2">
        <h2 className="text-lg font-bold">Pembayaran</h2>
        <button onClick={onTutup} aria-label="Tutup" className="grid size-11 place-items-center rounded-full hover:bg-stone-100">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <div className="mb-4 rounded-2xl bg-stone-100 p-4 text-center">
          <div className="text-sm text-stone-500">Total</div>
          <div className="text-3xl font-bold tabular-nums">{rupiah(total)}</div>
        </div>

        <div role="tablist" className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-stone-200/70 p-1">
          {[
            ['tunai', 'Tunai'],
            ['qris', 'QRIS'],
          ].map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={metode === id}
              onClick={() => setMetode(id)}
              className={`min-h-11 rounded-lg font-semibold ${metode === id ? 'bg-white text-amber-700 shadow-sm' : 'text-stone-500'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {metode === 'tunai' ? (
          <>
            <label className="mb-3 block">
              <span className="mb-1 block text-sm font-semibold">Uang diterima</span>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                value={diterima}
                onChange={(e) => setDiterima(e.target.value)}
                placeholder="0"
                className="input text-lg tabular-nums"
              />
            </label>
            <div className="mb-4 grid grid-cols-4 gap-2">
              {[
                ['Uang pas', total],
                ['20rb', 20000],
                ['50rb', 50000],
                ['100rb', 100000],
              ].map(([label, nilai]) => (
                <button
                  key={label}
                  onClick={() => setDiterima(String(nilai))}
                  className={`min-h-11 rounded-xl text-sm font-semibold ring-1 active:scale-95 ${
                    Number(diterima) === nilai ? 'bg-amber-50 text-amber-800 ring-amber-700' : 'ring-stone-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {diterima !== '' && (
              <div className={`rounded-2xl p-4 text-center ${kurang ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-700'}`}>
                <div className="text-sm font-semibold">{kurang ? 'Uang kurang' : 'Kembalian'}</div>
                <div className="text-4xl font-bold tabular-nums">{rupiah(Math.abs(dibayar - total))}</div>
              </div>
            )}
          </>
        ) : pengaturan.gambarQris ? (
          <img src={pengaturan.gambarQris} alt="QRIS cafe" className="mx-auto max-h-[55dvh] w-full rounded-2xl object-contain" />
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-stone-300 p-8 text-center text-stone-500">
            Gambar QRIS belum diunggah. Nanti bisa diunggah di Pengaturan.
          </div>
        )}
      </div>

      <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <button onClick={proses} disabled={kurang} className="btn btn-primary min-h-14 w-full text-lg">
          {metode === 'qris' ? 'Sudah dibayar' : `Bayar ${rupiah(total)}`}
        </button>
      </div>
    </Modal>
  )
}

function Sukses({ t, onBaru }) {
  return (
    <Modal onTutup={onBaru}>
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto p-6 text-center">
        <div className="mb-4 grid size-20 animate-pop place-items-center rounded-full bg-emerald-600 text-white">
          <Check size={44} strokeWidth={3} />
        </div>
        <h2 className="text-xl font-bold">Pembayaran berhasil</h2>
        <div className="mt-1 text-stone-500">
          Transaksi <span className="font-semibold text-stone-900">{nomorTrx(t.nomor)}</span> · {t.metode === 'qris' ? 'QRIS' : 'Tunai'}
        </div>
        <div className="mt-1 font-semibold tabular-nums">Total {rupiah(t.total)}</div>
        {t.metode === 'tunai' && (
          <div className="mt-4 w-full rounded-2xl bg-emerald-50 p-4 text-emerald-700">
            <div className="text-sm font-semibold">Kembalian</div>
            <div className="text-4xl font-bold tabular-nums">{rupiah(t.kembalian)}</div>
          </div>
        )}
      </div>
      <div className="grid gap-2 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <TombolStruk transaksi={t} />
        <button onClick={onBaru} className="btn btn-primary min-h-14 text-lg">
          <Plus size={20} /> Pesanan baru
        </button>
      </div>
    </Modal>
  )
}
