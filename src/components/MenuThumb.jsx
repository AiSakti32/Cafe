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
  return (
    <div style={{ backgroundColor: warna ?? '#78716c' }} className={`grid place-items-center font-bold text-white ${className}`}>
      {inisial || '?'}
    </div>
  )
}
