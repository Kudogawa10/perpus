# 📚 MyPerpus — Sistem Manajemen Perpustakaan Digital

> Aplikasi perpustakaan digital modern berbasis Laravel 12 + React + Inertia.js dengan desain hitam-putih yang elegan.

---

## ✨ Fitur Utama

### 👤 Pengguna (Anggota)
- **Dashboard Personal** — sapaan, statistik, peminjaman aktif, rekomendasi buku
- **Katalog Buku** — grid/list view, filter kategori, search real-time, sort
- **Peminjaman Buku** — request, tracking status, batas 3 buku, notifikasi jatuh tempo
- **Baca Online** — PDF viewer built-in, progress tersimpan otomatis, bookmark halaman
- **Kartu Anggota Digital** — KTA interaktif (klik untuk flip), QR code, download
- **Profil Lengkap** — edit data, upload avatar, sistem poin & level

### 👨‍💼 Petugas
- **Dashboard Petugas** — ringkasan harian, notifikasi butuh perhatian
- **Kelola Peminjaman** — setujui, tolak, serahkan, kembalikan, hitung denda otomatis
- **Kelola Buku** — update stok, lihat detail
- **Data Anggota** — lihat profil dan riwayat peminjaman anggota
- **Laporan Bulanan** — grafik dan rekap peminjaman

### ⚙️ Admin
- **Dashboard Admin** — statistik lengkap, chart tren, buku populer
- **Manajemen Buku** — CRUD lengkap, upload cover + PDF, toggle fitur online
- **Manajemen Kategori** — tambah, edit, hapus
- **Manajemen Anggota** — status aktif/nonaktif/ditangguhkan, hapus anggota
- **Manajemen Petugas** — tambah petugas baru, edit, hapus
- **Statistik** — analisis tahunan, per-bulan, ekspor PDF
- **Laporan PDF** — ekspor laporan peminjaman dengan DomPDF

---

## 🛠️ Tech Stack

| Layer       | Teknologi                              |
|-------------|----------------------------------------|
| Backend     | Laravel 12, PHP 8.4                    |
| Frontend    | React 18, JavaScript, Inertia.js v2    |
| Styling     | Tailwind CSS 3.4, custom design system |
| Animasi     | Framer Motion 11                       |
| Charts      | Recharts                               |
| Auth        | Laravel Sanctum + Spatie Permissions   |
| File Upload | Intervention Image (cover) + Storage  |
| PDF Export  | barryvdh/laravel-dompdf               |
| Database    | MySQL 8.0+                             |
| Cache/Queue | Redis                                  |
| DevOps      | Docker Compose, Nginx, PHP-FPM, Mailpit |

---

## 🚀 Instalasi Dengan Docker

Cara ini direkomendasikan untuk pengembangan harian dan pengganti Laragon.

### Prasyarat
- Docker Desktop atau Docker Engine + Docker Compose
- Git

### Langkah Cepat

```bash
cp .env.docker .env
docker compose up -d --build
docker compose exec php php artisan migrate --seed
docker compose exec php php artisan storage:link
```

Buka aplikasi di **http://localhost:8000**.

Layanan lokal:

| Layanan | URL / Port |
|---------|------------|
| Aplikasi | http://localhost:8000 |
| Vite HMR | http://localhost:5173 |
| Mailpit | http://localhost:8025 |
| MySQL | 127.0.0.1:3306 |
| Redis | 127.0.0.1:6379 |

Shortcut Makefile:

```bash
make up
make setup
make logs
make shell
make test
```

Konfigurasi database Docker:

```env
DB_HOST=mysql
DB_DATABASE=myperpus
DB_USERNAME=myperpus_user
DB_PASSWORD=myperpus_pass
```

---

## 🚀 Instalasi Tanpa Docker

### Prasyarat
- PHP >= 8.4
- Composer
- Node.js >= 18
- MySQL 8.0+
- Git

---

### Langkah 1 — Clone & Setup

```bash
# Clone project
git clone https://github.com/your-username/myperpus.git
cd myperpus

# Copy environment file
cp .env.example .env
```

---

### Langkah 2 — Konfigurasi Database

Edit file `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=myperpus
DB_USERNAME=root
DB_PASSWORD=your_password
```

Buat database:
```sql
CREATE DATABASE myperpus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### Langkah 3 — Install Dependencies

```bash
# Install PHP dependencies
composer install

# Generate app key
php artisan key:generate

# Install Node dependencies
npm install
```

---

### Langkah 4 — Migrasi & Seeding

```bash
# Jalankan migrasi
php artisan migrate

# Seed data awal untuk local/staging (roles, demo user, buku, dll)
php artisan db:seed

# Buat symbolic link untuk storage
php artisan storage:link
```

---

### Langkah 5 — Build & Run

```bash
# Development (2 terminal)
php artisan serve          # Terminal 1
npm run dev                # Terminal 2

# Build aset frontend
npm run build
```

Buka: **http://localhost:8000**

Untuk deployment production, gunakan checklist di [DEPLOYMENT.md](DEPLOYMENT.md). Jangan gunakan `php artisan serve` sebagai web server production.

---

## 🔑 Akun Demo Local/Staging

| Role     | Email                   | Password   |
|----------|-------------------------|------------|
| Admin    | admin@myperpus.id       | password   |
| Petugas  | petugas@myperpus.id     | password   |
| Anggota  | anggota@myperpus.id     | password   |

> Akun demo hanya dibuat pada environment non-production. Pada production, seeder hanya menyiapkan role dan admin dari `ADMIN_EMAIL`/`ADMIN_PASSWORD`.

---

## 📁 Struktur Proyek

```
myperpus/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── Auth/          # Login, Register, Reset Password
│   │       ├── Pengguna/      # Dashboard, Katalog, Peminjaman, Profil, BacaOnline
│   │       ├── Petugas/       # Dashboard, Peminjaman, Buku, Anggota
│   │       ├── Admin/         # Dashboard, Buku, Anggota, Petugas, Statistik
│   │       └── Api/           # Reading Progress API
│   └── Models/
│       ├── User.php
│       ├── Buku.php
│       ├── Kategori.php
│       ├── Peminjaman.php
│       ├── Petugas.php
│       └── ReadingProgress.php
├── database/
│   ├── migrations/
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── BukuSeeder.php       # 40+ buku sample
│       └── PeminjamanSeeder.php # Data peminjaman demo
├── resources/
│   ├── css/
│   │   └── app.css              # Design system MyPerpus
│   └── js/
│       ├── app.js
│       ├── Layouts/
│       │   ├── AppLayout.jsx    # Sidebar + topbar (semua role)
│       │   └── AuthLayout.jsx   # Halaman login/register
│       └── Pages/
│           ├── Welcome.jsx      # Landing page
│           ├── Auth/
│           │   ├── Login.jsx
│           │   └── Register.jsx
│           ├── Pengguna/
│           │   ├── Dashboard.jsx
│           │   ├── Katalog.jsx
│           │   ├── BacaOnline.jsx
│           │   ├── Peminjaman.jsx
│           │   ├── Profile.jsx
│           │   └── Petugas.jsx
│           ├── Petugas/
│           │   ├── Dashboard.jsx
│           │   └── Peminjaman.jsx
│           └── Admin/
│               ├── Dashboard.jsx
│               └── ManajemenBuku.jsx
├── routes/
│   └── web.php
├── tailwind.config.js
├── vite.config.js
└── composer.json
```

---

## 🎨 Design System

MyPerpus menggunakan design system hitam-putih yang konsisten:

```css
/* Warna Utama */
--perpus-black: #0a0a0a
--perpus-white: #fafafa
--perpus-gold:  #c9a84c  /* Aksen emas */

/* Font */
Display:  Syne (heading bold)
Sans:     Instrument Sans (body)
Serif:    Playfair Display (kutipan/dekoratif)
Mono:     JetBrains Mono (kode/no. anggota)
```

---

## ⚙️ Konfigurasi Tambahan

### Storage Setup
```bash
php artisan storage:link
```

### Spatie Permission Cache Clear (jika ada masalah role)
```bash
php artisan permission:cache-reset
```

### Jalankan Queue Worker (untuk notifikasi email)
```bash
php artisan queue:work
```

### Optimasi Production
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
npm run build
```

---

## 📋 Alur Peminjaman

```
Anggota Request → [MENUNGGU]
        ↓
Petugas Setujui → [DISETUJUI]
        ↓
Petugas Serahkan Buku → [DIPINJAM]
        ↓
(Jika terlambat) → [TERLAMBAT] → hitung denda otomatis
        ↓
Petugas Konfirmasi Kembali → [DIKEMBALIKAN]
```

---

## 🧪 Testing Cepat

```bash
# Lihat semua route
php artisan route:list

# Reset database + seed ulang
php artisan migrate:fresh --seed

# Buka Tinker untuk testing
php artisan tinker
>>> User::with('roles')->find(1)
>>> Buku::count()
>>> Peminjaman::where('status','menunggu')->count()
```

---

## 📄 Lisensi

MIT License — bebas digunakan dan dimodifikasi.

---

## 👨‍💻 Dikembangkan dengan MyPerpus

Built with ❤️ menggunakan **Laravel 12**, **React**, **Inertia.js**, dan **Tailwind CSS**
