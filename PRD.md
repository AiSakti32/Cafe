# PRD Aplikasi Kasir Cafe — Tahap 1

Oct 15, 2026 · @Sakti

## Ringkasan

Tahap 1 adalah aplikasi kasir web khusus satu cafe (milik kakak), dibangun **frontend saja** dan di-deploy gratis supaya bisa langsung dicoba dari HP. Isinya tiga fitur: **Kasir**, **Menu**, dan **Laporan Harian**.

Aplikasi sengaja dibuat untuk satu cafe dulu, bukan SaaS. Tujuannya membuktikan aplikasi benar-benar dipakai setiap hari sebelum menambah backend, login, atau multi-cafe. Data disimpan di perangkat (browser), jadi tidak butuh server database selama trial.

## Tujuan dan batasan

Trial dianggap berhasil kalau kakak memakai aplikasi ini untuk **semua transaksi selama 2 minggu** tanpa kembali ke catatan manual.

**Tujuan**

- Satu transaksi selesai di bawah 30 detik (pilih menu sampai bayar).
- Omzet harian dan menu terlaris terlihat tanpa hitung manual.
- Nyaman dipakai di HP, tablet, dan laptop.
- Biaya hosting Rp0 selama trial.

**Bukan tujuan Tahap 1**

- Login dan banyak akun pengguna.
- Sinkron data antar perangkat (butuh backend, masuk Tahap 2).
- Stok bahan baku, pengeluaran, shift kasir.
- Pembayaran QRIS otomatis lewat payment gateway. QRIS hanya dicatat sebagai metode bayar.
- Multi-cafe atau SaaS.

**Metrik yang dicek di akhir trial**

| Metrik | Target |
| --- | --- |
| Hari aplikasi dipakai | ≥ 12 dari 14 hari |
| Transaksi tercatat | 100% transaksi harian |
| Waktu per transaksi | < 30 detik |
| Keluhan yang menghambat jualan | 0 |

## Pengguna dan skenario

Pengguna utama adalah kakak sebagai pemilik sekaligus kasir. Perangkat utamanya HP, dipakai di meja kasir yang sibuk.

| Pengguna | Perangkat | Yang dilakukan |
| --- | --- | --- |
| Pemilik (kakak) | HP, kadang laptop | Atur menu dan harga, lihat laporan harian, juga jadi kasir |
| Kasir/barista (kalau ada) | HP atau tablet di meja kasir | Input pesanan, terima bayaran, kirim/cetak struk |

**Skenario utama**

1. Pelanggan pesan 2 Es Kopi Susu (less sugar) dan 1 Croissant.
2. Kasir mengetuk menu di HP, menambah catatan "less sugar", lalu membuka keranjang.
3. Pelanggan bayar tunai Rp100.000. Aplikasi menampilkan kembalian.
4. Kasir mengirim struk lewat WhatsApp atau mencetaknya.
5. Malam hari, kakak membuka Laporan: omzet hari ini, jumlah transaksi, menu terlaris, dan total tunai vs QRIS.

## Fitur Tahap 1

Tahap 1 punya 4 modul: Kasir, Menu, Laporan, dan Pengaturan. Item **Wajib** harus selesai sebelum trial. Item **Bonus** dikerjakan kalau waktunya cukup.

### Kasir (POS)

| ID | Sebagai kasir, saya ingin… | Kriteria diterima | Prioritas |
| --- | --- | --- | --- |
| K1 | melihat menu per kategori | Tab kategori (Semua, Kopi, Non-Kopi, Makanan, Snack). Menu yang habis tampil abu-abu dan tidak bisa diketuk. | Wajib |
| K2 | mencari menu | Kotak cari menyaring nama menu saat mengetik. | Wajib |
| K3 | menambah menu ke keranjang dengan satu ketukan | Ketuk kartu = qty +1, muncul badge jumlah di kartu dan animasi kecil. | Wajib |
| K4 | mengubah qty dan menambah catatan per item | Tombol − / +, qty 0 = item terhapus. Catatan bebas, misalnya "less sugar". | Wajib |
| K5 | melihat total yang selalu terlihat | Mobile: bar bawah "3 item · Rp57.000" yang membuka keranjang. Desktop: panel keranjang tetap di kanan. | Wajib |
| K6 | memilih metode bayar | Tunai atau QRIS. Tunai: input uang diterima + tombol cepat (Uang pas, 20rb, 50rb, 100rb), kembalian dihitung otomatis. QRIS: tampilkan gambar QRIS cafe, kasir menekan "Sudah dibayar". | Wajib |
| K7 | menyimpan transaksi | Tombol "Bayar" nonaktif kalau uang kurang. Setelah bayar: nomor transaksi (misal #0042), layar sukses, keranjang kosong. | Wajib |
| K8 | memberi struk | Tombol "Kirim WhatsApp" (struk dalam bentuk teks) dan "Cetak" (format kertas 58mm). | Wajib |
| K9 | memberi nama/nomor meja di pesanan | Field opsional "Atas nama / Meja". | Bonus |
| K10 | memberi diskon | Diskon nominal atau persen per transaksi. | Bonus |

### Menu

| ID | Sebagai pemilik, saya ingin… | Kriteria diterima | Prioritas |
| --- | --- | --- | --- |
| M1 | menambah, mengubah, menghapus menu | Field: nama, kategori, harga, foto (opsional). Nama dan harga wajib, harga > 0. | Wajib |
| M2 | menandai menu habis | Toggle Tersedia/Habis langsung dari daftar, tanpa membuka form. | Wajib |
| M3 | mengatur kategori | Tambah, ubah nama, hapus kategori. Kategori yang masih dipakai menu tidak bisa dihapus. | Wajib |
| M4 | melihat menu yang menarik walau tanpa foto | Tanpa foto: kartu menampilkan warna kategori + inisial/emoji. | Wajib |
| M5 | mengubah urutan menu | Menu terlaris bisa ditaruh paling atas. | Bonus |

### Laporan

| ID | Sebagai pemilik, saya ingin… | Kriteria diterima | Prioritas |
| --- | --- | --- | --- |
| L1 | melihat ringkasan hari ini | Kartu: omzet, jumlah transaksi, rata-rata per transaksi, item terjual. | Wajib |
| L2 | memilih tanggal lain | Date picker (bawaan browser). Pilihan cepat: Hari ini, Kemarin, 7 hari. | Wajib |
| L3 | melihat menu terlaris | Daftar 5 teratas: nama, qty, omzet. | Wajib |
| L4 | melihat rekap per metode bayar | Total Tunai vs QRIS, untuk dicocokkan dengan laci kas dan mutasi QRIS. | Wajib |
| L5 | melihat riwayat transaksi | Daftar transaksi per tanggal, ketuk untuk lihat detail, kirim ulang struk. | Wajib |
| L6 | membatalkan transaksi yang salah | Tombol "Batalkan" dengan konfirmasi. Transaksi batal tidak dihitung di omzet tapi tetap tercatat. | Wajib |
| L7 | melihat grafik omzet per jam | Grafik batang jam ramai (07.00 sampai 22.00). | Bonus |
| L8 | ekspor data | Unduh CSV transaksi untuk dibuka di Excel. | Bonus |

### Pengaturan

| ID | Sebagai pemilik, saya ingin… | Kriteria diterima | Prioritas |
| --- | --- | --- | --- |
| P1 | mengatur identitas cafe | Nama cafe, alamat, no. WhatsApp, teks penutup struk. | Wajib |
| P2 | mengunggah gambar QRIS | Gambar disimpan dan tampil saat bayar QRIS. | Wajib |
| P3 | mencadangkan dan memulihkan data | Tombol "Backup" (unduh file .json) dan "Restore" (unggah file). Pengingat backup setiap 7 hari. | Wajib |
| P4 | mengisi data contoh | Tombol "Isi menu contoh" supaya kakak bisa langsung mencoba. | Wajib |

## Halaman dan alur

Aplikasi punya 5 halaman yang diakses lewat 4 tombol navigasi. Kasir adalah halaman pembuka karena paling sering dipakai.

| Halaman | URL | Isi |
| --- | --- | --- |
| Kasir | `#/` | Grid menu, tab kategori, cari, keranjang, bayar |
| Laporan | `#/laporan` | Kartu ringkasan, terlaris, metode bayar, riwayat transaksi |
| Detail transaksi | `#/laporan/:id` | Item, total, metode, kirim ulang struk, batalkan |
| Menu | `#/menu` | Daftar menu + toggle habis, form tambah/ubah, kategori |
| Pengaturan | `#/pengaturan` | Identitas cafe, QRIS, backup/restore, data contoh |

**Alur transaksi**

1. Kasir: ketuk menu → badge qty bertambah, bar total di bawah ter-update.
2. Buka keranjang (bottom sheet di HP, panel kanan di desktop) → ubah qty dan catatan.
3. Tekan "Bayar" → pilih Tunai atau QRIS.
   - Tunai: masukkan uang diterima → kembalian tampil besar.
   - QRIS: gambar QRIS tampil layar penuh → "Sudah dibayar".
4. Layar sukses: nomor transaksi, kembalian, tombol "Kirim WhatsApp", "Cetak", dan "Pesanan baru".
5. "Pesanan baru" → kembali ke Kasir dengan keranjang kosong.

## Desain UI

Gayanya "kopi hangat": latar krem, aksen karamel, kartu menu besar yang enak diketuk jempol. Satu layout untuk semua ukuran layar, yang berubah hanya susunannya.

**Warna (Tailwind)**

| Peran | Warna | Dipakai untuk |
| --- | --- | --- |
| Latar | `stone-50` #FAFAF9 | Background halaman |
| Permukaan | `white` | Kartu, panel, bottom sheet |
| Utama | `amber-700` #B45309 | Tombol Bayar, tab aktif, badge qty |
| Gelap | `stone-900` #1C1917 | Teks utama, header |
| Sukses | `emerald-600` | Layar sukses, status Tersedia |
| Bahaya | `rose-600` | Batalkan, hapus, status Habis |

**Tipografi:** Plus Jakarta Sans (Google Fonts). Angka harga memakai `tabular-nums` supaya rata. Harga ditampilkan dengan `Intl.NumberFormat('id-ID')` → Rp57.000.

**Responsif**

| Layar | Lebar | Navigasi | Grid menu | Keranjang |
| --- | --- | --- | --- | --- |
| HP | < 640px | Bottom nav 4 ikon | 2 kolom | Bar total di bawah, keranjang = bottom sheet |
| Tablet | 640–1023px | Bottom nav | 3 kolom | Bottom sheet |
| Laptop/tablet landscape | ≥ 1024px | Sidebar kiri | 3–4 kolom | Panel tetap di kanan (360px) |

**Aturan biar enak dipakai di HP**

- Area ketuk minimal 44px. Tombol Bayar selalu di bawah, dekat jempol.
- Ketuk kartu menu: efek mengecil sedikit (`active:scale-95`), badge qty memantul, getar halus `navigator.vibrate(10)` di Android.
- Layar sukses dengan animasi centang. Toast kecil untuk aksi seperti "Menu disimpan".
- Empty state yang ramah: "Keranjang masih kosong — ketuk menu untuk mulai".
- Bisa dipasang di layar utama HP ("Add to Home Screen") lewat `manifest.json`, jadi terasa seperti aplikasi.

&#91;embedded content: Mockup halaman Kasir · HP vs laptop\]

Isi halamannya sama di semua layar. Yang berubah hanya letak keranjang dan navigasi, jadi kakak tidak perlu belajar dua kali.

## Arsitektur teknis

Aplikasi ini berupa web statis React tanpa backend. Semua data disimpan di `localStorage` browser, jadi bisa di-host gratis dan tetap jalan walau internet putus-putus.

**Stack**

| Kebutuhan | Pilihan | Alasan |
| --- | --- | --- |
| UI | React + Vite | Sudah dikuasai, build cepat |
| Styling | Tailwind CSS | Desain custom tanpa terlihat "template" |
| Routing | React Router (`HashRouter`) | URL `#/menu` jalan di hosting statis mana pun tanpa konfigurasi redirect |
| State + simpan data | Zustand + middleware `persist` | Satu baris untuk otomatis menyimpan ke localStorage |
| Ikon | lucide-react | Ringan, gaya konsisten |
| Format Rupiah, tanggal, cetak | `Intl`, `<input type="date">`, `window.print()` | Bawaan browser, tanpa library |

**Model data**

| Entitas | Field |
| --- | --- |
| Kategori | id, nama, warna, urutan |
| Menu | id, nama, kategoriId, harga, tersedia, foto (opsional, dikompres ke 300px) |
| Transaksi | id, nomor, waktu, items\[{menuId, nama, harga, qty, catatan}\], subtotal, diskon, total, metode (tunai/qris), dibayar, kembalian, status (selesai/batal) |
| Pengaturan | namaCafe, alamat, noWa, teksStruk, gambarQris, terakhirBackup |

Nama dan harga menu **disalin ke item transaksi**. Dengan begitu, laporan lama tidak ikut berubah saat harga menu diubah.

**Batasan penyimpanan lokal (penting untuk kakak)**

- Data hanya ada di **satu HP/browser itu**. Kalau kasir pakai HP lain, datanya terpisah. Sinkron antar perangkat baru ada di Tahap 2.
- Hapus data browser = data hilang. Karena itu backup .json wajib ada (P3), dan aplikasi memanggil `navigator.storage.persist()` supaya browser tidak menghapus data otomatis.
- Kapasitas localStorage sekitar 5 MB, cukup untuk kurang lebih 10.000 transaksi (sekitar 3 bulan dengan 100 transaksi/hari). Itu lebih dari cukup untuk trial.

**Struktur folder**

```
src/
  main.jsx           # HashRouter + layout
  store.js           # zustand: menu, kategori, transaksi, pengaturan, keranjang
  lib/format.js      # rupiah(), tanggal(), teksStruk()
  pages/
    Kasir.jsx
    Laporan.jsx
    DetailTransaksi.jsx
    Menu.jsx
    Pengaturan.jsx
  components/
    Layout.jsx       # bottom nav (HP) / sidebar (desktop)
    MenuCard.jsx
    Keranjang.jsx    # bottom sheet / panel kanan
    Bayar.jsx
    Struk.jsx        # tampilan cetak 58mm
public/
  manifest.json
  icon-192.png, icon-512.png
```

## Deploy gratis

Rekomendasinya **Cloudflare Pages**: gratis, HTTPS otomatis, bandwidth tidak dibatasi, dan boleh dipakai untuk usaha. Setiap `git push` langsung deploy ulang, dan kakak cukup membuka satu link di HP.

| Hosting | Gratis untuk usaha? | Catatan |
| --- | --- | --- |
| Cloudflare Pages | Ya | Pilihan utama. Domain `nama.pages.dev` |
| Netlify | Ya | Alternatif setara. Domain `nama.netlify.app` |
| Vercel (Hobby) | Tidak, khusus non-komersial | Boleh untuk coba-coba, tapi pindahkan sebelum dipakai jualan sungguhan |
| GitHub Pages | Ya | Perlu atur `base` di Vite, lebih repot |

Ketentuan paket gratis di atas berdasarkan ingatan (perkiraan). Cek ulang halaman harga masing-masing sebelum memilih.

**Langkah (Cloudflare Pages)**

1. Push proyek ke repo GitHub.
2. Buka dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git → pilih repo.
3. Framework preset: **Vite**. Build command: `npm run build`. Output: `dist`.
4. Deploy → dapat link `https://kasir-namacafe.pages.dev`.
5. Kirim link ke kakak → buka di Chrome HP → menu ⋮ → "Tambahkan ke layar utama".

HTTPS dari hosting itu penting: tanpa HTTPS, fitur pasang ke layar utama, `storage.persist()`, dan getar tidak berjalan. Karena memakai `HashRouter`, tidak perlu file `_redirects`.

## Rencana kerja dan risiko

Tahap 1 bisa siap dicoba kakak dalam 5 sprint pendek (sekitar 2 minggu kerja santai), lalu dilanjutkan trial selama 2 minggu.

**Pembagian sprint**

Setiap sprint ditutup dengan demo ke kakak lewat link yang sudah di-deploy. Dengan begitu, masukan dari kakak datang sejak awal, bukan setelah semuanya jadi.

| Sprint | Durasi | Dikerjakan | Demo ke kakak |
| --- | --- | --- | --- |
| Sprint 0 — Fondasi | 1 hari | Setup Vite + Tailwind + router + Zustand, layout responsif (bottom nav/sidebar), deploy kosong ke Cloudflare Pages | Link terbuka di HP kakak, pindah-pindah halaman jalan |
| Sprint 1 — Menu | 3 hari | M1–M4, P4 (data contoh) | Kakak memasukkan menu asli cafe-nya |
| Sprint 2 — Kasir | 4 hari | K1–K8: grid, keranjang, bayar tunai/QRIS, layar sukses, struk WA/cetak | Kakak mencoba transaksi pura-pura |
| Sprint 3 — Laporan & Pengaturan | 3 hari | L1–L6, P1–P3, `manifest.json` | Kakak melihat laporan dari transaksi Sprint 2, mencoba backup/restore, memasang ke layar utama |
| Sprint 4 — Poles & uji bareng | 3 hari | Perbaikan dari masukan demo, animasi, empty state. Item Bonus (K9, K10, M5, L7, L8) kalau sempat | Dicoba bersama di cafe pada jam sepi, lalu trial 2 minggu dimulai |

**Sprint dianggap selesai kalau**

- [ ] Semua item Wajib di sprint itu memenuhi kriteria diterima.
- [ ] `npm run build` tanpa error dan sudah ter-deploy.
- [ ] Sudah dicek di lebar HP (375px) dan laptop.
- [ ] Kakak sudah mencoba, dan masukannya dicatat untuk sprint berikutnya.

Di Claude Code, kerjakan satu sprint per sesi, misalnya: "Baca PRD.md, kerjakan Sprint 1 saja." Commit di akhir setiap sprint.

**Risiko**

| Risiko | Dampak | Antisipasi |
| --- | --- | --- |
| Data hilang karena cache browser dihapus | Laporan hilang | Backup .json + pengingat 7 hari + `storage.persist()` |
| Kasir pakai lebih dari satu HP | Data terpisah | Selama trial, pakai satu perangkat kasir. Kalau ini jadi kebutuhan nyata, itu sinyal masuk Tahap 2 |
| Cetak struk dari HP ke printer thermal Bluetooth tidak langsung jalan | Struk tidak tercetak | Utamakan struk WhatsApp. Printer Bluetooth di Android bisa lewat aplikasi seperti RawBT (diuji saat trial) |
| Fitur kebanyakan, trial molor | Kakak menunggu lama | Kerjakan item Wajib dulu, Bonus belakangan |

**Setelah trial**

Kalau trial berhasil, Tahap 2 menambah backend Laravel (stack yang sudah dikuasai) untuk login, sinkron antar perangkat, stok bahan, dan pengeluaran. Data dari backup .json bisa diimpor ke sana. SaaS baru dipertimbangkan setelah Tahap 2 stabil.

**Pertanyaan untuk kakak sebelum mulai**

- [ ] Berapa kira-kira transaksi per hari?
- [ ] Kasirnya satu orang/satu HP, atau lebih?
- [ ] Sudah punya printer struk? Jenisnya apa (USB/Bluetooth, 58/80mm)?
- [ ] Sudah punya QRIS? Minta gambarnya.
- [ ] Daftar menu + harga + kategori saat ini.
