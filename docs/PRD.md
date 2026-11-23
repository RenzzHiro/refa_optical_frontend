# PRD — Aplikasi Web E-commerce Toko Kacamata

## 1. Ringkasan Produk

Membangun aplikasi web e-commerce untuk toko kacamata yang melayani pembeli umum di Indonesia. Versi MVP mencakup katalog kacamata minus dan kacamata fashion, akun pelanggan wajib untuk bertransaksi, keranjang, checkout, serta proses pembayaran melalui payment gateway. Pengalaman katalog membantu pelanggan menemukan produk berdasarkan gender, bentuk frame, dan tipe wajah.

Dokumen ini memusatkan kebutuhan pada logika bisnis dan perilaku produk. Pilihan teknologi, desain visual, serta integrasi vendor spesifik akan ditentukan kemudian.

## 2. Tujuan

- Memudahkan pelanggan menemukan kacamata yang sesuai preferensi gender, frame, dan tipe wajah.
- Memungkinkan pelanggan membeli kacamata minus atau fashion melalui alur e-commerce yang jelas.
- Mengumpulkan foto resep pelanggan untuk pesanan kacamata minus.
- Memberi admin kemampuan mengelola produk, pesanan, dan stok.
- Mendukung proses pembayaran online melalui payment gateway hingga status pembayaran terkonfirmasi.

## 3. Batasan MVP

### Termasuk

- Katalog produk kacamata minus dan fashion.
- Filter dan pengelompokan katalog berdasarkan gender, bentuk frame, dan tipe wajah.
- Halaman detail produk dan informasi harga, ketersediaan, serta atribut produk.
- Registrasi, login, dan akun pelanggan; login wajib sebelum checkout.
- Keranjang belanja dan checkout.
- Unggah foto resep pada checkout untuk produk kacamata minus.
- Pemilihan metode pembayaran yang tersedia dari payment gateway dan pencatatan status pembayaran.
- Panel admin untuk mengelola produk, pesanan, dan stok.

### Tidak termasuk pada MVP

- Diagnosa atau rekomendasi tipe wajah otomatis; pelanggan memilih tipe wajah sendiri.
- Pembayaran tunai saat barang diterima, pengambilan di toko, atau konfirmasi pembayaran manual.
- Penentuan ongkos kirim, pelacakan kurir, dan integrasi logistik, kecuali diperlukan oleh payment/checkout provider yang dipilih.
- Konsultasi/chat, ulasan produk, program loyalitas, dan fitur pemasaran otomatis.
- Pemilihan resep lensa melalui formulir terstruktur; resep diberikan sebagai foto.
- Penetapan teknologi, desain visual final, dan vendor payment gateway tertentu.

## 4. Pengguna dan Kebutuhan

### Pelanggan

- Sebagai pelanggan, saya ingin menelusuri kacamata minus dan fashion berdasarkan gender, frame, dan tipe wajah agar dapat mempersempit pilihan.
- Sebagai pelanggan, saya ingin melihat detail produk, harga, dan ketersediaan sebelum membeli.
- Sebagai pelanggan, saya ingin membuat akun dan masuk agar dapat menyelesaikan checkout.
- Sebagai pelanggan yang membeli kacamata minus, saya ingin mengunggah foto resep saat checkout agar toko dapat memproses pesanan sesuai resep.
- Sebagai pelanggan, saya ingin membayar melalui payment gateway dan mengetahui apakah pembayaran berhasil.
- Sebagai pelanggan, saya ingin melihat riwayat dan status pesanan melalui akun saya.

### Admin

- Sebagai admin, saya ingin menambah, mengubah, mengaktifkan, atau menonaktifkan produk.
- Sebagai admin, saya ingin mengelola atribut katalog: kategori produk, gender, bentuk frame, dan tipe wajah yang cocok.
- Sebagai admin, saya ingin memperbarui stok agar ketersediaan di katalog akurat.
- Sebagai admin, saya ingin melihat pesanan, rincian item, foto resep terkait, dan status pembayaran.
- Sebagai admin, saya ingin memperbarui status pemrosesan pesanan.

## 5. Alur Utama

### 5.1 Menemukan produk

1. Pelanggan membuka katalog.
2. Pelanggan memilih filter gender, bentuk frame, dan/atau tipe wajah.
3. Sistem menampilkan produk aktif yang cocok dengan filter dan masih dapat dibeli.
4. Pelanggan membuka detail produk untuk melihat informasi dan ketersediaannya.

### 5.2 Checkout

1. Pelanggan menambahkan produk dan jumlah ke keranjang.
2. Jika belum login, sistem meminta pelanggan mendaftar atau login sebelum melanjutkan checkout.
3. Sistem memvalidasi bahwa produk masih aktif dan stok mencukupi.
4. Untuk pesanan yang berisi kacamata minus, pelanggan mengunggah foto resep. Foto menjadi lampiran pesanan dan hanya dapat diakses oleh pihak yang berwenang memproses pesanan.
5. Pelanggan melengkapi informasi yang diperlukan untuk pesanan dan memilih opsi pembayaran yang disediakan payment gateway.
6. Sistem membuat pesanan dengan status menunggu pembayaran, lalu mengarahkan pelanggan ke proses pembayaran gateway.
7. Sistem memperbarui status pembayaran berdasarkan konfirmasi gateway yang tervalidasi.
8. Pelanggan dapat melihat status pesanan dan pembayaran dari akunnya.

### 5.3 Pengelolaan admin

1. Admin masuk ke panel admin.
2. Admin mengelola data produk, atribut katalog, harga, dan stok.
3. Admin meninjau daftar pesanan, rincian produk, lampiran resep (jika ada), serta status pembayaran.
4. Admin memperbarui status pemrosesan pesanan sesuai proses operasional toko.

## 6. Kebutuhan Fungsional

### Katalog dan produk

- Sistem menyediakan daftar produk aktif dengan pencarian dan filter katalog.
- Filter MVP: gender, bentuk frame, dan tipe wajah yang cocok.
- Nilai atribut filter dikelola admin dan konsisten pada produk.
- Detail produk menampilkan nama, foto, deskripsi, harga, kategori (minus/fashion), atribut terkait, dan status ketersediaan.
- Produk yang tidak aktif tidak dapat dibeli.

### Akun

- Pelanggan dapat mendaftar, login, dan logout.
- Checkout hanya dapat dilanjutkan oleh pelanggan yang login.
- Informasi akun dan pesanan hanya dapat diakses pemilik akun yang sesuai.

### Keranjang dan pesanan

- Pelanggan dapat menambah, mengubah jumlah, dan menghapus item keranjang.
- Sistem menghitung subtotal berdasarkan harga dan jumlah produk.
- Sistem memvalidasi stok dan harga terbaru saat pesanan dibuat.
- Sistem menyimpan snapshot nama produk, harga, dan kuantitas pada item pesanan agar riwayat transaksi tetap konsisten jika katalog berubah.
- Pesanan mempunyai nomor unik, waktu dibuat, item, total, informasi pelanggan yang diperlukan, status pesanan, dan status pembayaran.
- Sistem mencegah pemesanan melebihi stok yang tersedia.

### Resep

- Foto resep diminta ketika keranjang berisi setidaknya satu produk kacamata minus.
- Sistem menerima format dan batas ukuran file yang ditetapkan saat implementasi.
- Unggahan harus terkait dengan pesanan dan dapat dilihat admin yang berwenang.
- Jika unggahan gagal atau tidak valid, pelanggan mendapat pesan yang jelas dan dapat mencoba kembali.

### Pembayaran

- Sistem membuat transaksi pembayaran melalui payment gateway yang dipilih.
- Status minimal: belum dibayar/menunggu pembayaran, berhasil, gagal, dan kedaluwarsa atau dibatalkan.
- Konfirmasi perubahan status berasal dari callback/webhook gateway yang diverifikasi, bukan hanya dari halaman redirect browser.
- Sistem menangani callback berulang secara idempoten agar satu pembayaran tidak diproses ganda.
- Pesanan yang gagal atau kedaluwarsa mengikuti aturan pembatalan dan pelepasan stok yang ditentukan saat implementasi.

### Admin dan stok

- Akses panel admin dibatasi untuk akun dengan peran admin.
- Admin dapat membuat, melihat, mengubah, dan menonaktifkan produk.
- Admin dapat mengelola harga, atribut katalog, kategori, foto produk, dan jumlah stok.
- Admin dapat melihat daftar dan detail pesanan beserta status pembayarannya.
- Admin dapat mengubah status pemrosesan pesanan dengan jejak waktu perubahan.
- Perubahan stok dan status pesanan dicatat agar dapat ditelusuri.

## 7. Aturan Bisnis

- Kategori produk MVP adalah kacamata minus dan kacamata fashion.
- Gender, bentuk frame, dan tipe wajah merupakan atribut pencarian/kecocokan katalog, bukan ukuran medis atau jaminan kecocokan.
- Pelanggan menentukan sendiri tipe wajah yang dipakai untuk filter.
- Akun pelanggan wajib sebelum pesanan dapat dibuat.
- Foto resep diwajibkan jika checkout mencakup produk kacamata minus.
- Pesanan baru dianggap dibayar setelah status berhasil terkonfirmasi oleh payment gateway.
- Stok tidak boleh menjadi negatif. Strategi reservasi stok selama menunggu pembayaran harus ditentukan bersama aturan masa berlaku pembayaran gateway.
- Harga yang disimpan pada pesanan adalah harga saat pesanan dibuat.

## 8. Status Awal

### Status pembayaran

- `pending`: menunggu hasil pembayaran.
- `paid`: pembayaran terkonfirmasi berhasil.
- `failed`: pembayaran gagal.
- `expired`: batas waktu pembayaran terlewati.
- `cancelled`: pembayaran/pesanan dibatalkan sesuai aturan bisnis.

### Status pemrosesan pesanan

- `awaiting_payment`: menunggu pembayaran.
- `processing`: pembayaran berhasil dan pesanan sedang diproses.
- `completed`: pesanan selesai diproses.
- `cancelled`: pesanan dibatalkan.

Status akhir dan aturan transisinya perlu disesuaikan dengan alur operasional toko.

## 9. Kebutuhan Nonfungsional

- Tampilan web dapat digunakan pada ponsel dan desktop.
- Data akun, pesanan, dan resep hanya dapat diakses oleh pengguna berwenang.
- Password disimpan dengan mekanisme hashing yang aman; data sensitif dikirim melalui koneksi terenkripsi.
- Validasi file resep mencakup tipe file dan ukuran maksimum, dengan penyimpanan yang tidak dapat diakses publik secara langsung.
- Alur pembayaran harus aman terhadap callback palsu dan callback berulang.
- Sistem menampilkan kondisi kosong, kesalahan, dan status proses dengan pesan yang dapat dipahami.
- Sistem menyimpan waktu perubahan penting untuk audit operasional.

## 10. Kriteria Penerimaan MVP

- Pelanggan dapat menelusuri produk dan menerapkan filter gender, bentuk frame, dan tipe wajah.
- Produk aktif menampilkan harga, detail, serta ketersediaan yang dikelola admin.
- Pelanggan yang belum login tidak dapat membuat pesanan dan diarahkan untuk mendaftar atau login.
- Pelanggan dapat membuat pesanan dari keranjang dengan stok yang tervalidasi.
- Checkout produk minus meminta foto resep dan menyimpan lampiran pada pesanan.
- Checkout produk fashion tidak meminta foto resep.
- Pesanan dibuat dengan status menunggu pembayaran dan menyediakan alur menuju payment gateway.
- Status pembayaran berubah hanya setelah konfirmasi gateway yang valid diproses.
- Pelanggan dapat melihat pesanan dan statusnya dari akunnya.
- Admin dapat mengelola produk, atribut katalog, stok, dan status pesanan.
- Sistem menolak pesanan yang jumlahnya melebihi stok tersedia.

## 11. Metrik Keberhasilan

- Tingkat keberhasilan pelanggan menyelesaikan checkout.
- Rasio keranjang menjadi pesanan dan pesanan menjadi pembayaran berhasil.
- Persentase pesanan yang dibatalkan karena stok tidak tersedia.
- Jumlah kesalahan unggah resep dan pembayaran.
- Waktu rata-rata admin dari pembayaran berhasil hingga pesanan mulai diproses.

Target numerik metrik ditentukan setelah toko memiliki baseline penggunaan.

## 12. Asumsi dan Pertanyaan Terbuka

- Apakah kacamata fashion mencakup sunglasses?
- Apakah pelanggan memilih jenis/bahan lensa dan opsi tambahan untuk kacamata minus, atau toko menentukan konfigurasi setelah memeriksa resep?
- Informasi pengiriman dan ongkos kirim apa yang wajib dikumpulkan di checkout? Integrasi logistik berada di luar batas yang telah ditetapkan, namun alamat penerima mungkin tetap diperlukan untuk pemenuhan pesanan.
- Payment gateway dan metode pembayaran lokal yang akan digunakan belum ditentukan.
- Perlu ditentukan apakah stok dikurangi saat pesanan dibuat atau setelah pembayaran berhasil, serta lama reservasi stok.
- Perlu ditentukan aturan pembatalan, refund, dan kedaluwarsa pembayaran.
- Perlu ditentukan format, ukuran maksimum, retensi, dan akses terhadap foto resep.
- Perlu ditentukan daftar nilai gender, bentuk frame, dan tipe wajah yang digunakan.
- Nama/brand toko, kebijakan privasi, kebijakan retur, dan target peluncuran belum ditentukan.

## 13. Di Luar Cakupan

- Diagnosis mata atau saran medis.
- Penentuan tipe wajah otomatis dan virtual try-on.
- Konsultasi tenaga optik melalui aplikasi.
- Integrasi kurir, pelacakan pengiriman, dan perhitungan ongkir otomatis.
- Program promosi, kupon, ulasan, dan loyalitas.
