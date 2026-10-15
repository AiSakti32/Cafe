// Foto menu, atau warna kategori + inisial kalau tanpa foto (M4).
export default function MenuThumb({ nama, foto, warna, className = '' }) {
  if (foto) return <img src={foto} alt="" className={`object-cover ${className}`} />
  const inisial = nama
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((k) => k[0])
    .join('')
    .toUpperCase()
  const w = warna ?? '#78716c'
  return (
    <div
      // Gradasi lembut dari warna kategori; backgroundColor jadi cadangan di browser lama.
      style={{ backgroundColor: w, backgroundImage: `linear-gradient(140deg, color-mix(in srgb, ${w} 72%, white), ${w})` }}
      className={`grid place-items-center font-bold text-white ${className}`}
    >
      {inisial || '?'}
    </div>
  )
}
