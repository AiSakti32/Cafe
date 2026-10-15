# Kasir Cafe

Spesifikasi lengkap ada di PRD.md. Selalu ikuti PRD; kalau ada yang tidak jelas, tanya dulu.

## Stack (jangan tambah library lain tanpa izin)
- React + Vite (JavaScript), Tailwind CSS, React Router (HashRouter), Zustand + persist, lucide-react
- Tanpa backend. Data di localStorage.

## Aturan
- Mobile-first: desain untuk HP dulu, lalu breakpoint sm (640) dan lg (1024).
- Area ketuk minimal 44px. Format Rupiah pakai Intl.NumberFormat('id-ID').
- Teks UI dalam Bahasa Indonesia.
- Kerjakan per langkah sesuai "Urutan pengerjaan" di PRD. Selesaikan item Wajib dulu, Bonus belakangan.
- Setelah tiap langkah: jalankan `npm run build` dan pastikan tidak error.