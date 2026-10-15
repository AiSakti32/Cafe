import { useEffect, useRef } from 'react'

// Untuk sheet/dialog yang sedang terbuka: Esc menutup, dan halaman di belakangnya tidak ikut ter-scroll.
export function useTutup(aktif, onTutup) {
  const tutup = useRef(onTutup)
  tutup.current = onTutup
  useEffect(() => {
    if (!aktif) return
    const esc = (e) => e.key === 'Escape' && tutup.current()
    document.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', esc)
      document.body.style.overflow = ''
    }
  }, [aktif])
}
