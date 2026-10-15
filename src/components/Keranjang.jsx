import { Minus, Plus, X, ShoppingBag } from 'lucide-react'
import { useStore, hitungTotal } from '../store'
import { rupiah } from '../lib/format'
import { useTutup } from '../lib/useTutup'

// HP/tablet: bottom sheet (saat buka). Desktop (lg): panel tetap di kanan.
export default function Keranjang({ buka, onTutup, onBayar }) {
  const { keranjang, ubahQty, ubahCatatan, kosongkanKeranjang } = useStore()
  const total = hitungTotal(keranjang)
  useTutup(buka, onTutup)

  return (
    <>
      {buka && <div onClick={onTutup} className="fixed inset-0 z-40 animate-pudar bg-stone-900/50 lg:hidden" />}
      <aside
        aria-label="Keranjang"
        className={`${buka ? 'flex' : 'hidden'} fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] animate-naik flex-col rounded-t-3xl bg-white shadow-2xl lg:animate-none lg:shadow-none lg:inset-y-0 lg:right-0 lg:left-auto lg:z-auto lg:flex lg:max-h-none lg:w-[360px] lg:rounded-none lg:border-l lg:border-stone-200`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-stone-100 px-4 py-2">
          <h2 className="text-lg font-bold">Pesanan</h2>
          <div className="flex items-center">
            {keranjang.length > 0 && (
              <button
                onClick={() => confirm('Kosongkan semua pesanan?') && kosongkanKeranjang()}
                className="min-h-11 rounded-xl px-3 text-sm font-semibold text-rose-600 hover:bg-rose-50"
              >
                Kosongkan
              </button>
            )}
            <button onClick={onTutup} aria-label="Tutup" className="grid size-11 place-items-center rounded-full hover:bg-stone-100 lg:hidden">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {!keranjang.length ? (
            <div className="py-12 text-center text-stone-500">
              <ShoppingBag className="mx-auto mb-2 text-primary-200" size={44} aria-hidden="true" />
              Keranjang masih kosong — ketuk menu untuk mulai
            </div>
          ) : (
            <ul className="divide-y divide-stone-100">
              {keranjang.map((i) => (
                <li key={i.menuId} className="py-3">
                  <div className="flex justify-between gap-2">
                    <span className="font-semibold">{i.nama}</span>
                    <span className="font-semibold tabular-nums">{rupiah(i.harga * i.qty)}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => ubahQty(i.menuId, -1)}
                      aria-label={`Kurangi ${i.nama}`}
                      className="grid size-11 shrink-0 place-items-center rounded-xl ring-1 ring-stone-300 active:scale-95"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-8 text-center text-lg font-bold tabular-nums">{i.qty}</span>
                    <button
                      onClick={() => ubahQty(i.menuId, 1)}
                      aria-label={`Tambah ${i.nama}`}
                      className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-800 text-white active:scale-95"
                    >
                      <Plus size={18} />
                    </button>
                    <input
                      value={i.catatan}
                      onChange={(e) => ubahCatatan(i.menuId, e.target.value)}
                      placeholder="Catatan, mis. less sugar"
                      aria-label={`Catatan ${i.nama}`}
                      className="input min-w-0 flex-1 text-sm"
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-stone-100 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-stone-500">Total</span>
            <span className="text-2xl font-bold tabular-nums">{rupiah(total)}</span>
          </div>
          <button onClick={onBayar} disabled={!keranjang.length} className="btn btn-primary min-h-14 w-full text-lg">
            Bayar
          </button>
        </div>
      </aside>
    </>
  )
}
