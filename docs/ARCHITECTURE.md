# Architecture — Refa Optical Frontend

## 1. Tujuan dan Cakupan

Dokumen ini menetapkan arsitektur awal aplikasi web sisi pelanggan Refa Optical. Cakupan mencakup katalog, pencarian dan filter, detail produk, keranjang, checkout, autentikasi pelanggan, serta riwayat dan detail pesanan.

Frontend dibangun dengan React, Vite, dan TypeScript. Adapter API pelanggan menggunakan backend Go/Gin untuk katalog, autentikasi, order, upload resep, dan pembayaran Midtrans. Vite meneruskan `/api` ke backend lokal saat development. Dashboard admin terpisah di `/admin` menggunakan adapter `src/api/admin.ts` untuk ringkasan pesanan, produk, dan stok.

## 2. Prinsip Arsitektur

- **UI tidak mengakses mock data secara langsung.** Semua data domain masuk melalui kontrak repository/API.
- **Pisahkan state lokal dan data jarak jauh.** Zustand menyimpan state interaksi pelanggan; lapisan API bertanggung jawab atas pembacaan dan perubahan data.
- **Struktur mengikuti fitur.** Kode halaman, komponen, validasi, dan API yang terkait dikelompokkan berdasarkan domain fitur.
- **Komponen presentasi dapat digunakan ulang.** Komponen katalog, form, status, dan layout tidak memuat aturan integrasi provider.
- **Mock dapat diganti tanpa menulis ulang UI.** Implementasi mock mengikuti kontrak yang kelak dipakai adapter backend.
- **Desktop dan mobile menjadi target setara.** Setiap alur dan layout dirancang serta diperiksa pada kedua ukuran layar.

## 3. Stack yang Dipilih dan Rekomendasi

### Dipilih

- React
- Vite
- TypeScript
- Zustand untuk client-side state

### Rekomendasi implementasi

- React Router untuk routing sisi pelanggan.
- Zod untuk validasi dan parsing data API/form pada batas aplikasi.
- TanStack Query untuk cache, loading, error, dan invalidasi data jarak jauh ketika integrasi API mulai berjalan. Selama prototipe mock sederhana, repository dapat dipanggil melalui hooks yang sama; TanStack Query bisa dipakai sejak awal agar perilaku data jarak jauh konsisten.
- CSS Modules atau pendekatan styling yang sudah tersedia di repo. Jika belum ada, pilih satu cara styling dan gunakan token dari `DESIGN-SYSTEM.md`; hindari mencampur banyak sistem CSS.

Rekomendasi di bagian ini adalah keputusan implementasi awal dan dapat ditinjau sebelum dependensi ditambahkan.

## 4. Gambaran Lapisan

```text
Browser
  └── Routes / App Shell
        └── Feature Pages
              ├── Feature Components
              ├── Feature Hooks (use cases)
              └── API Repositories
                    ├── Mock Adapter (awal)
                    └── HTTP Adapter (kelak)

Zustand stores: cart, catalog preferences, checkout draft, session/UI state
Design system: shared UI components, tokens, responsive patterns
```

### Tanggung jawab lapisan

- **App shell:** provider global, layout, navigasi, route, serta batas error aplikasi.
- **Pages:** menyusun komponen fitur untuk satu route dan menghubungkan data/state yang diperlukan.
- **Feature components:** menampilkan UI dan meneruskan aksi pengguna; aturan bisnis penting tidak tersebar di komponen presentasi.
- **Hooks/use cases:** mengorkestrasi validasi, repository, dan perubahan state untuk aksi seperti menambah keranjang atau membuat pesanan.
- **Repositories/API:** menyediakan operasi domain bertipe dan menyembunyikan apakah sumbernya mock atau HTTP.
- **Zustand:** menyimpan state interaksi lintas halaman yang perlu bertahan selama sesi atau persistensi lokal yang disetujui.

## 5. Struktur Direktori Berdasarkan Fungsi

Kode dikelompokkan menurut tanggung jawab teknis agar lokasi komponen, halaman, routing, API, custom hooks, dan utilitas konsisten. Pengelompokan per fitur tetap digunakan di dalam folder terkait bila jumlah file bertambah.

```text
src/
  app/
    App.tsx
    providers.tsx
  assets/
    images/
    icons/
  components/
    common/
      Button.tsx
      Input.tsx
      Badge.tsx
      Dialog.tsx
      Skeleton.tsx
    layout/
      SiteHeader.tsx
      SiteFooter.tsx
      PageContainer.tsx
    catalog/
      ProductCard.tsx
      FilterPanel.tsx
    product/
      ProductGallery.tsx
      ProductOptions.tsx
    cart/
      CartItem.tsx
      OrderSummary.tsx
    checkout/
      PrescriptionUpload.tsx
  pages/
    HomePage.tsx
    CatalogPage.tsx
    ProductDetailPage.tsx
    CartPage.tsx
    CheckoutPage.tsx
    LoginPage.tsx
    RegisterPage.tsx
    AccountPage.tsx
    OrderHistoryPage.tsx
    OrderDetailPage.tsx
    NotFoundPage.tsx
  routes/
    index.tsx
    ProtectedRoute.tsx
  api/
    client.ts
    contracts.ts
    catalog.api.ts
    auth.api.ts
    orders.api.ts
    adapters/
      mock/
        catalog.mock.ts
        auth.mock.ts
        orders.mock.ts
      http/
        catalog.http.ts
        auth.http.ts
        orders.http.ts
  hooks/
    useProducts.ts
    useProduct.ts
    useCatalogFilters.ts
    useCart.ts
    useMyOrders.ts
  stores/
    cart.store.ts
    catalogPreferences.store.ts
    checkoutDraft.store.ts
    session.store.ts
  utils/
    currency.ts
    queryParams.ts
    validation.ts
    errors.ts
  types/
    product.ts
    customer.ts
    order.ts
    common.ts
  styles/
    tokens.css
    globals.css
  mocks/
    data/
```

### Tanggung jawab folder

- `components/`: komponen UI yang dapat digunakan ulang. Kelompokkan berdasarkan cakupan, misalnya `common`, `layout`, `catalog`, atau `checkout`.
- `pages/`: komposisi tingkat halaman untuk setiap route. Halaman menghubungkan custom hooks dan komponen, bukan menjalankan request HTTP langsung.
- `routes/`: definisi URL, layout route, guard autentikasi sisi UI, dan fallback route.
- `api/`: kontrak repository/API, konfigurasi client, serta adapter mock dan HTTP. Komponen tidak mengimpor fixture atau adapter langsung.
- `hooks/`: custom hooks React untuk menghubungkan halaman/komponen ke API dan store. Hook menyimpan orkestrasi UI, bukan detail transport HTTP.
- `stores/`: Zustand stores untuk state client yang perlu dibagi lintas komponen/route.
- `utils/`: fungsi murni bersama seperti format Rupiah, parsing query, dan pemetaan error. Jangan letakkan komponen React atau akses jaringan di sini.
- `types/`: model domain TypeScript yang digunakan lintas folder. Tipe yang hanya digunakan satu komponen boleh tetap dekat dengan komponen tersebut.
- `assets/` dan `styles/`: aset lokal dan token/gaya global yang mengikuti `DESIGN-SYSTEM.md`.
- `mocks/`: data contoh. Adapter mock berada di `api/adapters/mock/` agar pemilihan sumber data tetap melalui lapisan API.

### Aturan dependensi

- `pages` boleh menggunakan `components`, `hooks`, `stores`, `types`, dan `utils`.
- `components` boleh menggunakan komponen bersama, tipe, dan utilitas; komponen presentasi tidak memanggil adapter API langsung.
- `hooks` menghubungkan `api`, `stores`, dan kebutuhan UI.
- `api` menggunakan `types` dan adapter yang sesuai, tetapi tidak mengimpor `pages` atau komponen UI.
- `utils` berisi fungsi umum tanpa efek samping dan tidak bergantung pada React.
- Hindari barrel exports atau folder `index.ts` yang membuat dependency saling berputar.

Struktur ini adalah rancangan awal. Tambahkan subfolder hanya ketika jumlah file membutuhkannya; jangan membuat folder kosong sebelum fitur terkait diimplementasikan.
## 6. Routing Pelanggan

Rute berikut disarankan:

| Rute | Halaman | Akses |
|---|---|---|
| `/` | Beranda/koleksi unggulan | Publik |
| `/collections` | Katalog dan filter | Publik |
| `/products/:slug` | Detail produk | Publik |
| `/cart` | Keranjang | Publik |
| `/login` | Masuk | Publik |
| `/register` | Daftar | Publik |
| `/checkout` | Checkout | Perlu login |
| `/account` | Ringkasan akun | Perlu login |
| `/account/orders` | Riwayat pesanan | Perlu login |
| `/account/orders/:orderId` | Detail pesanan | Perlu login |

Jika pengguna belum login saat membuka route terlindungi, simpan tujuan awal secara aman dan arahkan ke login. Setelah login, kembalikan pengguna ke tujuan tersebut. Otorisasi final tetap menjadi tanggung jawab backend saat tersedia; guard frontend hanya untuk pengalaman pengguna.

## 7. Domain dan Kontrak Data

Definisikan model TypeScript untuk setidaknya:

- `Product`: id, slug, name, category (`prescription` atau `fashion`), description, images, price, optional compare-at price, stock status, gender tags, frame shape, face-type tags, dan variants.
- `ProductVariant`: id, label/color, SKU bila tersedia, dan ketersediaan.
- `CatalogFilters`: query, rentang harga, gender, frame shape, face type, sorting, dan pagination.
- `CartItem`: product/variant reference dan quantity; harga akhir divalidasi kembali ketika checkout dibuat.
- `Customer`: id dan informasi profil minimum yang diperlukan UI.
- `Order`: id/number, item snapshot, totals, payment status, order status, dan created-at.
- `PrescriptionAttachment`: metadata unggahan tanpa mengekspos URL publik atau detail sensitif ke area UI yang tidak memerlukannya.

Tipe dasar ditempatkan dekat fitur pemiliknya. Tipe lintas fitur diletakkan di `types/` hanya jika benar-benar digunakan bersama.

## 8. Data Access dan API

Komponen halaman memanggil hooks/use case fitur, bukan mengimpor fixture mock.

Contoh kontrak:

```ts
interface CatalogRepository {
  listProducts(filters: CatalogFilters): Promise<ProductPage>;
  getProductBySlug(slug: string): Promise<Product | null>;
}

interface OrderRepository {
  listMyOrders(): Promise<Order[]>;
  getMyOrder(orderId: string): Promise<Order | null>;
  createOrder(input: CreateOrderInput): Promise<Order>;
}
```

- Implementasi awal memakai `MockCatalogRepository`, `MockAuthRepository`, dan `MockOrderRepository`.
- HTTP client terpusat di `src/api/client.ts`, memakai `/api/v1`, Bearer access token, cookie refresh HttpOnly, serta percobaan refresh ketika access token kedaluwarsa.
- Adapter domain di `src/api/auth.ts`, `src/api/catalog.ts`, `src/api/orders.ts`, dan `src/api/admin.ts` memanggil endpoint backend; hooks menghubungkan data domain ke halaman.
- `VITE_API_BASE_URL` dapat mengatur base URL untuk deployment lain. Development memakai proxy Vite ke `http://localhost:8080`.
- Mock dapat mensimulasikan jeda jaringan, data kosong, validasi gagal, dan error agar state UI dirancang sejak awal.
- Jangan hardcode harga final atau status stok di komponen.
- Bila memakai TanStack Query, cache data produk dan pesanan sebagai server state. Zustand tidak menjadi duplikasi cache server.

## 9. State Management dengan Zustand

Gunakan store kecil berdasarkan domain dan simpan hanya state yang perlu dibagi lintas komponen/route.

### `cartStore`

- Item dan kuantitas keranjang.
- Aksi add/update/remove/clear.
- Subtotal boleh dihitung sebagai selector, tetapi harga/total final dihitung ulang oleh API saat pesanan dibuat.
- Persistensi local storage dapat dipakai untuk cart anonim; jangan menyimpan data resep, token autentikasi, atau data pribadi sensitif di sana.

### `catalogPreferencesStore`

- Filter dan sorting pilihan pelanggan bila harus dipertahankan ketika berpindah route.
- Sinkronkan parameter yang dapat dibagikan (query, filter, sorting, halaman) ke URL; jangan jadikan store sebagai satu-satunya sumber state navigasi katalog.

### `checkoutDraftStore`

- Data sementara checkout yang tidak sensitif dan perlu bertahan saat berpindah langkah.
- Data resep sensitif tidak dipersistenkan ke local storage. Simpan unggahan dalam state memori sementara atau alur upload yang aman, sesuai mekanisme backend kelak.

### `sessionStore`

- Status UI sesi pengguna dan profil minimum yang aman untuk ditampilkan.
- Jangan menyimpan password atau token akses jangka panjang di Zustand/local storage. Mekanisme autentikasi final ditentukan bersama backend.

Gunakan selectors agar perubahan satu bagian store tidak merender ulang seluruh aplikasi.

## 10. Alur Fitur Utama

### Katalog

1. Route membaca query string untuk pencarian, filter, sorting, dan pagination.
2. Hook katalog memanggil repository dengan `CatalogFilters` yang telah divalidasi.
3. UI menampilkan loading/skeleton, hasil, empty state, atau error.
4. Perubahan filter memperbarui URL dan mengambil hasil yang sesuai.

### Detail produk dan keranjang

1. Halaman detail memuat produk berdasarkan slug dari repository.
2. Pelanggan memilih varian dan kuantitas.
3. Use case memeriksa kuantitas yang masuk akal, lalu memperbarui `cartStore`.
4. Harga dan ketersediaan dianggap sementara sampai divalidasi ulang saat checkout.

### Checkout

1. Route checkout memerlukan sesi login.
2. Checkout membaca cart dan meminta server/repository memvalidasi item serta stok.
3. Produk resep meminta unggahan foto resep melalui alur aman; metadata tidak dipublikasikan.
4. UI mengirim `CreateOrderInput` ke `OrderRepository`.
5. Checkout membuat order di backend, mengunggah resep jika dibutuhkan, lalu meminta URL Midtrans dan mengarahkan pelanggan ke gateway. Status pesanan dibaca dari backend; redirect browser tidak dianggap konfirmasi pembayaran.

### Riwayat pesanan

1. Halaman akun meminta pesanan milik pelanggan aktif melalui `OrderRepository`.
2. Detail pesanan meminta data dengan id dan memeriksa kepemilikan melalui API.
3. UI menampilkan status pembayaran dan status pemrosesan dalam badge teks yang konsisten.

## 11. UI States dan Error Handling

Setiap halaman data harus menangani:

- Loading dan skeleton.
- Berhasil dengan data.
- Data kosong.
- Error yang dapat dicoba ulang.
- Error validasi dekat field yang terkait.
- Produk tidak ditemukan atau tidak tersedia.
- Sesi berakhir atau pengguna tidak terautentikasi.

Gunakan satu bentuk error aplikasi yang dapat dipetakan ke pesan ramah pelanggan. Jangan menampilkan stack trace atau detail provider kepada pelanggan.

## 12. Responsif dan Design System

- Ikuti palet, tipografi, spacing, komponen, dan interaksi pada `DESIGN-SYSTEM.md`.
- Desktop: katalog menggunakan panel filter samping dan grid yang lapang.
- Mobile: filter dibuka melalui kontrol yang mudah dijangkau; tombol aksi utama tetap terlihat dan dapat digunakan.
- Breakpoint dijadikan token terpusat dan ditetapkan setelah implementasi diuji pada perangkat nyata; jangan menyebarkan nilai breakpoint berbeda di banyak file.
- Interaksi hover harus memiliki padanan focus dan active untuk keyboard/touch.

## 13. Keamanan dan Privasi Frontend

- Frontend bukan batas otorisasi. Backend harus memvalidasi kepemilikan pesanan, peran, stok, harga, dan status pembayaran.
- Jangan menyimpan foto resep dalam public assets, URL yang dapat ditebak, atau storage browser persisten.
- Jangan memasukkan kredensial payment gateway atau secret ke bundle frontend.
- Tampilkan hanya data pribadi yang dibutuhkan untuk alur pelanggan.
- Validasi input di frontend membantu pengalaman pengguna, tetapi API tetap harus memvalidasi ulang.

## 14. Keputusan yang Belum Ditentukan

- Versi React/TypeScript dan strategi build final mengikuti setup repo ketika implementasi dimulai.
- Router disarankan React Router; perlu dikonfirmasi jika ada preferensi lain.
- TanStack Query disarankan untuk server state, sedangkan Zustand dipakai untuk client state.
- Detail autentikasi, upload foto resep, API backend, payment gateway, dan hosting belum ditetapkan.
- Aturan URL publik, pagination katalog, dan strategi persistensi keranjang perlu diputuskan saat implementasi.
- Tidak ada kode aplikasi di repo saat dokumen ini dibuat; struktur direktori di atas merupakan rancangan awal.

