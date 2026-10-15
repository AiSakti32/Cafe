import { create } from 'zustand'
import { CircleCheck } from 'lucide-react'

const useToast = create(() => ({ teks: '', id: 0 }))
let timer

// Pesan singkat di atas layar, hilang sendiri setelah ±2 detik. Contoh: toast('Menu disimpan')
export function toast(teks) {
  clearTimeout(timer)
  useToast.setState((s) => ({ teks, id: s.id + 1 }))
  timer = setTimeout(() => useToast.setState({ teks: '' }), 2200)
}

export default function Toast() {
  const { teks, id } = useToast()
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-[calc(0.75rem+env(safe-area-inset-top))] z-[60] flex justify-center px-4"
    >
      {teks && (
        <div key={id} className="flex animate-turun items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg">
          <CircleCheck size={18} className="text-emerald-400" aria-hidden="true" />
          {teks}
        </div>
      )}
    </div>
  )
}
