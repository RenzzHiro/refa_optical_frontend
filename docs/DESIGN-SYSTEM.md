# Design System — Refa Optical

## 1. Tujuan

Dokumen ini menetapkan fondasi visual dan perilaku antarmuka untuk MVP e-commerce Refa Optical. Arah visual mengikuti referensi halaman koleksi yang diberikan: minimal, terang, rapi, dengan foto produk sebagai fokus.

Design system ini mencakup katalog, filter, detail produk, keranjang, checkout, akun, status pesanan, dan kebutuhan visual panel admin. Wishlist, chat WhatsApp, dan virtual try-on belum termasuk.

## 2. Prinsip Desain

1. **Produk menjadi fokus** — gunakan foto kacamata besar dan jelas, dengan dekorasi kartu seminimal mungkin.
2. **Tampilan bersih dan tenang** — latar putih atau netral, teks gelap, garis pembatas tipis, serta aksen warna yang hemat.
3. **Mudah dipindai** — susun nama, harga, diskon, variasi, filter, dan status dalam hierarki yang konsisten.
4. **Kontrol terasa jelas** — filter aktif, pilihan variasi, validasi, dan langkah checkout harus mudah dikenali.
5. **Nyaman di berbagai layar** — layout menyesuaikan desktop dan ponsel; panel filter desktop berubah menjadi kontrol filter yang mudah dibuka di layar kecil.
6. **Aksesibel** — jangan mengandalkan warna saja untuk menyampaikan status; sediakan label, fokus keyboard, dan kontras teks yang memadai.

## 3. Identitas Visual

- **Nama merek:** Refa Optical.
- **Karakter:** modern, sederhana, percaya diri, dan mudah didekati.
- **Logo:** gunakan wordmark “Refa Optical” sampai aset logo resmi tersedia. Hindari membuat simbol baru tanpa aset atau arahan merek.
- **Gaya fotografi:** foto produk besar dengan latar netral terang. Jaga pencahayaan, skala, crop, dan posisi produk agar konsisten antar kartu.
- **Ikon:** gunakan ikon garis sederhana dengan ketebalan dan ukuran yang seragam. Ikon yang berdiri sendiri harus memiliki nama aksesibel atau tooltip.

## 4. Design Tokens

Nilai berikut adalah baseline awal untuk implementasi dan dapat disesuaikan setelah pemeriksaan visual pada layar nyata.

### 4.1 Warna

| Token | Nilai awal | Penggunaan |
|---|---|---|
| `color-ink` | `#171717` | Teks utama, ikon utama, tombol primer |
| `color-ink-muted` | `#666666` | Teks sekunder dan metadata |
| `color-canvas` | `#FFFFFF` | Latar halaman dan permukaan utama |
| `color-surface-soft` | `#F6F5F2` | Latar lembut, placeholder foto, panel sekunder |
| `color-border` | `#DDDDDA` | Border input, kartu, dan pemisah |
| `color-accent` | `#A33B35` | Aksen kecil, diskon, atau perhatian |
| `color-success` | `#24734B` | Status berhasil |
| `color-warning` | `#8A5A13` | Status menunggu atau peringatan |
| `color-danger` | `#B42318` | Error dan status gagal |
| `color-focus` | `#1D4ED8` | Fokus keyboard yang terlihat |

Gunakan hitam dan putih sebagai warna dominan. Aksen merah hanya untuk informasi terbatas seperti diskon atau perhatian dan tidak menggantikan label status.

### 4.2 Tipografi

Gunakan keluarga sans-serif yang bersih dan tersedia luas. Jika font merek belum tersedia, gunakan stack sistem sans-serif. Pertahankan hierarki berikut:

| Gaya | Ukuran awal | Bobot | Penggunaan |
|---|---:|---:|---|
| `display` | 36–48 px | 500–600 | Judul halaman utama pada desktop |
| `heading-1` | 30–36 px | 600 | Judul halaman |
| `heading-2` | 22–28 px | 600 | Judul bagian dan nama produk |
| `heading-3` | 18–20 px | 600 | Subbagian dan label panel |
| `body` | 16 px | 400 | Teks utama |
| `body-small` | 14 px | 400 | Deskripsi sekunder dan metadata |
| `label` | 14 px | 500–600 | Label form dan kontrol |
| `caption` | 12 px | 400–500 | Catatan tambahan dan label kecil |

Gunakan line-height sekitar 1.4–1.6 untuk teks isi. Harga utama dapat memakai bobot 600 agar mudah ditemukan. Hindari terlalu banyak variasi ukuran dan bobot pada satu tampilan.

### 4.3 Spacing dan ukuran

Gunakan skala dasar kelipatan 4 px:

`4, 8, 12, 16, 24, 32, 48, 64 px`

- Jarak antar elemen dalam kontrol: 8–12 px.
- Padding kontrol dan kartu sederhana: 12–16 px.
- Jarak antar bagian: 24–32 px.
- Padding halaman desktop: 32–56 px, mengikuti lebar layar.
- Padding halaman ponsel: 16–20 px.
- Area interaktif minimum: 44 × 44 px.

### 4.4 Border, radius, dan bayangan

- Border standar: 1 px solid `color-border`.
- Radius kontrol: 10–12 px.
- Radius kartu gambar: 4–8 px; gunakan konsisten.
- Radius badge: 4–6 px.
- Bayangan hanya untuk elemen yang mengambang atau perlu tampak terangkat, seperti dropdown dan dialog.
- Hindari bayangan tebal dan dekorasi berlapis.

## 5. Layout dan Responsif

### 5.1 Header

Header memuat wordmark, navigasi kategori, pencarian, akun, dan keranjang. Gunakan latar putih, pemisah bawah tipis, dan tinggi yang cukup untuk navigasi yang nyaman.

Pada ponsel, tampilkan wordmark dan kontrol utama secara ringkas. Navigasi kategori dapat dipindahkan ke menu yang mudah dijangkau.

### 5.2 Halaman katalog

Pada desktop:

- Gunakan layout dua kolom: area filter di kiri dan hasil katalog di kanan.
- Lebar filter sekitar 250–300 px; area hasil mengambil ruang yang tersisa.
- Area hasil diawali jumlah produk dan kontrol pengurutan.
- Grid produk memakai 3 kolom pada viewport lebar; sesuaikan menjadi 2 kolom saat ruang terbatas.
- Beri ruang cukup antar kartu agar halaman terasa lapang.

Pada ponsel:

- Grid memakai 2 kolom jika lebar kartu dan informasi masih terbaca; gunakan 1 kolom jika ruang tidak cukup.
- Filter dibuka melalui tombol yang jelas dan menampilkan status filter aktif.
- Jumlah hasil dan pengurutan tetap mudah ditemukan.

### 5.3 Form checkout dan akun

Gunakan lebar konten yang membatasi panjang baca. Pada desktop, ringkasan pesanan dapat berada di samping form; pada ponsel, tampilkan ringkasan yang mudah dibuka tanpa menghalangi langkah pengisian.

## 6. Komponen dan Pola UI

### 6.1 Tombol

- **Primary:** latar `color-ink`, teks putih; untuk aksi utama seperti “Tambah ke Keranjang” dan “Lanjut ke Pembayaran”.
- **Secondary:** latar putih, border `color-border`, teks gelap; untuk aksi pendamping.
- **Text button:** tanpa latar untuk aksi ringan seperti “Hapus filter”.
- **Disabled:** kontras cukup untuk terbaca, namun tampil jelas tidak aktif.
- Sediakan hover, active, focus-visible, loading, dan disabled state.

Label tombol berupa kata kerja yang spesifik dan konsisten.

### 6.2 Input dan pilihan

- Input memiliki label tetap di atas field; placeholder hanya menjadi contoh, bukan satu-satunya label.
- Tampilkan border fokus dan pesan kesalahan dekat field yang bermasalah.
- Pilihan aktif harus dibedakan dengan border/latar dan indikator selain perubahan warna semata.
- Checkbox cocok untuk filter multi-pilihan; radio cocok untuk satu pilihan; chip pilihan dapat dipakai untuk opsi ringkas seperti gender.

### 6.3 Filter katalog

Kelompok filter mengikuti kebutuhan MVP:

- Pencarian produk.
- Rentang harga.
- Gender.
- Bentuk frame.
- Tipe wajah.

Di desktop, filter dapat tampil dalam panel samping. Di ponsel, gunakan drawer atau panel filter dengan tombol “Terapkan” dan “Reset”. Tampilkan filter aktif sebagai chip yang dapat dilepas dan sediakan aksi untuk menghapus semua filter.

Rentang harga harus menunjukkan nilai minimum dan maksimum dalam format Rupiah. Filter face type adalah preferensi yang dipilih pelanggan sendiri, bukan rekomendasi medis.

### 6.4 Kartu produk

Kartu produk memuat:

- Foto produk dengan rasio konsisten dan latar netral.
- Nama produk.
- Harga saat ini.
- Harga sebelum diskon dan badge diskon jika berlaku.
- Pilihan warna/variasi bila ada.
- Status stok jika diperlukan.

Foto menjadi bagian paling dominan. Batasi dekorasi dan pastikan variasi warna tetap memiliki label atau nama agar tidak hanya dibedakan berdasarkan warna.

### 6.5 Detail produk

Tampilkan galeri foto, nama, harga, diskon bila ada, deskripsi, atribut produk (kategori, gender, frame, tipe wajah yang cocok), status stok, dan pilihan variasi. Aksi utama pembelian harus tampak tanpa mengalahkan informasi penting.

### 6.6 Keranjang dan checkout

Tampilkan nama produk, variasi, kuantitas, harga, subtotal, dan ringkasan total secara konsisten. Gunakan urutan langkah yang jelas dan tampilkan kemajuan jika checkout terdiri dari beberapa tahap.

Untuk pesanan kacamata minus, komponen unggah resep perlu menjelaskan file yang diterima, ukuran maksimum, privasi lampiran, serta status berhasil/gagal. Detail format dan batas ukuran ditetapkan pada implementasi.

### 6.7 Status dan feedback

Gunakan badge teks untuk status seperti “Menunggu pembayaran”, “Dibayar”, “Diproses”, “Selesai”, dan “Dibatalkan”. Kombinasikan warna dengan teks dan bila perlu ikon.

- Berhasil: hijau.
- Menunggu/perlu tindakan: amber.
- Gagal/error: merah.
- Informasi netral: abu-abu.

Berikan feedback untuk aksi penting: item masuk keranjang, perubahan jumlah, unggahan berhasil, pembayaran dimulai, dan kegagalan validasi.

### 6.8 Status kosong dan error

- Katalog kosong: jelaskan bahwa tidak ada hasil dan sediakan aksi menghapus filter.
- Keranjang kosong: jelaskan langkah berikutnya untuk kembali ke katalog.
- Gagal memuat: jelaskan masalah secara ringkas dan sediakan aksi coba lagi bila sesuai.
- Validasi checkout: pertahankan data yang telah diisi dan tandai field yang perlu diperbaiki.

## 7. Aksesibilitas dan Interaksi

- Semua kontrol dapat digunakan dengan keyboard dan memiliki fokus yang terlihat.
- Gunakan label teks untuk ikon yang aksinya tidak jelas.
- Berikan teks alternatif yang menjelaskan produk pada foto katalog.
- Pastikan kontras teks dan kontrol memenuhi pedoman aksesibilitas yang berlaku.
- Jangan memakai warna sebagai satu-satunya pembeda untuk gender, variasi, status, atau kesalahan.
- Urutan fokus mengikuti urutan baca dan aksi utama tersedia pada layar kecil.
- Hentikan atau jelaskan animasi yang berulang; animasi tidak boleh menjadi satu-satunya petunjuk status.

## 8. Konten dan Nada Bahasa

- Gunakan Bahasa Indonesia yang ringkas, ramah, dan langsung.
- Gunakan istilah yang konsisten: “Keranjang”, “Checkout”, “Tipe wajah”, “Bentuk frame”, “Stok”, dan “Menunggu pembayaran”.
- Tampilkan harga dengan format Rupiah, misalnya `Rp 424.150`.
- Hindari klaim bahwa frame pasti cocok untuk tipe wajah tertentu; gunakan frasa “cocok untuk” sebagai panduan katalog.
- Pesan kesalahan menjelaskan tindakan yang dapat dilakukan pelanggan.

## 9. Penerapan dan Tata Kelola

- Implementasi harus menggunakan token warna, tipografi, spacing, radius, dan border yang tercantum agar konsisten.
- Komponen dibuat berdasarkan pola di dokumen ini dan memiliki state normal, hover, focus, active, disabled, loading, serta error jika relevan.
- Perubahan pada token atau pola utama dicatat di dokumen ini sebelum diterapkan luas.
- Aset logo, font merek, dan foto produk resmi dapat menggantikan baseline setelah tersedia.

## 10. Asumsi dan Hal yang Belum Ditentukan

- Belum ada aset logo atau panduan merek resmi; wordmark teks digunakan sementara.
- Font final belum ditentukan; gunakan sans-serif sistem sebagai fallback.
- Nilai warna dan ukuran token adalah baseline awal berdasarkan referensi, bukan hasil pengukuran dari situs sumber.
- Belum ditentukan jumlah kolom dan breakpoint final; angka di bagian layout merupakan pedoman awal.
- Detail variasi frame, lensa, dan informasi pengiriman tetap mengikuti keputusan produk di PRD.
