# Deployment MyPerpus

Checklist singkat untuk production.

## 1. Environment

```bash
cp .env.production.example .env
php artisan key:generate
```

Isi semua secret di `.env`: database, mail, `APP_URL`, `ADMIN_EMAIL`, dan `ADMIN_PASSWORD`.

Wajib untuk production:

```dotenv
APP_ENV=production
APP_DEBUG=false
LOG_LEVEL=warning
SESSION_SECURE_COOKIE=true
SESSION_ENCRYPT=true
FILESYSTEM_DISK=local
```

## 2. Install dependency

```bash
composer install --no-dev --optimize-autoloader
npm ci
npm run build
```

## 3. Database

```bash
php artisan migrate --force
php artisan db:seed --force
```

Seeder production hanya membuat role dan admin dari `ADMIN_EMAIL`/`ADMIN_PASSWORD`. Data demo dan password `password` hanya dibuat pada environment non-production.

## 4. Cache production

```bash
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

## 5. Storage dan permission

```bash
php artisan storage:link
chmod 600 .env
find storage bootstrap/cache -type d -exec chmod 775 {} \;
find storage bootstrap/cache -type f -exec chmod 664 {} \;
```

PDF buku baru disimpan di disk private `local` dan dibuka lewat route terautentikasi `/baca-online/{buku}/pdf`. Konfigurasi Nginx dan Apache di repo juga menolak akses langsung ke `/storage/buku/pdf` dan `/storage/sample-books`.

Jika ada PDF lama di `storage/app/public/buku/pdf`, pindahkan ke `storage/app/private/buku/pdf` dengan path relatif yang sama lalu hapus salinan publiknya memakai user/permission yang benar.

## 6. Worker dan scheduler

Jalankan queue worker lewat supervisor/systemd:

```bash
php artisan queue:work --sleep=3 --tries=3 --max-time=3600
```

Tambahkan scheduler:

```cron
* * * * * cd /path/to/myperpus_full && php artisan schedule:run >> /dev/null 2>&1
```

## 7. Audit sebelum go-live

```bash
composer audit
npm audit --omit=dev
php artisan test
```

Pastikan web server hanya mengarah ke folder `public`, HTTPS aktif, `.env` tidak ikut repository, dan `public/hot` tidak ada di server production.
