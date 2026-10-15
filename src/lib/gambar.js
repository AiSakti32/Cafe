// Perkecil gambar ke sisi terpanjang `maks` px (data URL JPEG) supaya muat di localStorage.
export async function kompresGambar(file, maks, kualitas = 0.8) {
  const img = await createImageBitmap(file)
  const s = Math.min(1, maks / Math.max(img.width, img.height))
  const c = document.createElement('canvas')
  c.width = Math.round(img.width * s)
  c.height = Math.round(img.height * s)
  const g = c.getContext('2d')
  // Latar putih: bagian transparan (mis. PNG QRIS) jadi hitam kalau langsung ke JPEG.
  g.fillStyle = '#fff'
  g.fillRect(0, 0, c.width, c.height)
  g.drawImage(img, 0, 0, c.width, c.height)
  return c.toDataURL('image/jpeg', kualitas)
}
