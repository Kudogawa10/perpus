# Database Migration ke Railway

## Connection Details Railway MySQL

```
Host: crossover.proxy.rlwy.net
Port: 54947
User: root
Database: railway
Password: [See Railway dashboard]
Connection: mysql://root:password@crossover.proxy.rlwy.net:54947/railway
```

## Step 1: Setup Environment Variables di Railway Dashboard

Pastikan sebelum migrasi, set di Railway Variables:

```env
# Database - Railway otomatis inject DATABASE_URL
DB_CONNECTION=mysql
DB_HOST=
DB_PORT=3306
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

# Cache & Session HARUS gunakan Redis
CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

# Migration
RUN_MIGRATIONS=true
```

## Step 2: Run Migrations

### Option A: Via Railway Console (Recommended - Online)

```bash
railway shell
# Inside container:
php artisan migrate --force
php artisan db:seed --force
```

### Option B: Via Railway CLI

```bash
railway console php artisan migrate --force
railway console php artisan db:seed --force
```

### Option C: Auto-migrate on Deploy

Set `RUN_MIGRATIONS=true` di Railway Variables, redeploy aplikasi. docker/start.sh akan otomatis:
1. Parse DATABASE_URL
2. Wait untuk MySQL ready (~30s)
3. Run migrations
4. Run seeder
5. Cache configs

---

## Step 3: Verify Migrations

```bash
# Via Railway console
railway console php artisan migrate:status

# Atau di Railway dashboard → MySQL → Database tab
# Cek list tables yang sudah ada
```

---

## Database Migrations MyPerpus

Migration files yang akan di-run:

```
database/migrations/
├── 2024_01_01_000001_create_users_table.php
├── 2024_01_01_000002_create_perpus_tables.php
├── 2024_01_01_000003_create_permission_tables.php
├── 2024_01_01_000004_create_jobs_cache_tables.php
└── ... (semua migration files)
```

### Tables yang dibuat:
- `users` - Admin user account
- `buku` - Buku catalog
- `kategori` - Buku categories
- `peminjaman` - Borrowing records
- `ulasan` - Book reviews
- `laporan_buku` - Book reports
- `reading_progress` - Reading progress tracking
- `pengguna` / `petugas` - User roles
- `migrations` - Laravel migration tracking
- `jobs`, `job_batches`, `failed_jobs` - Queue jobs
- `cache`, `cache_locks` - Cache storage
- `sessions` - Session data (if using file driver)
- Banyak tables lain untuk Spatie permissions, Sanctum, dll

### Seeder yang jalan:
- `DatabaseSeeder` membuat:
  - Default roles (admin, staff, member)
  - Admin user dari env `ADMIN_EMAIL` & `ADMIN_PASSWORD`
  - Kategori demo (if not production)
  - Buku demo (if not production)

---

## Troubleshooting

### Error: "Syntax error or access violation"
- Database user tidak punya permission
- Fix: Pastikan `root` user dapat create tables
- Test: `mysql -h host -u root -p -e "CREATE TABLE test_tbl (id INT); DROP TABLE test_tbl;"`

### Error: "Connection refused" atau timeout
- Railway MySQL belum ready
- Fix: Tunggu ~30s, coba lagi
- Check status di Railway dashboard

### Error: "BASE_TABLE_OR_VIEW_NOT_FOUND: ... 'users' doesn't exist"
- Migrations belum jalan
- Fix: Run migrations manually: `railway console php artisan migrate --force`

### Seeder gagal menciptakan admin
- `ADMIN_EMAIL` atau `ADMIN_PASSWORD` tidak di-set
- Fix: Set di Railway Variables, redeploy

---

## Manual Step-by-Step via CLI

```bash
# 1. Test koneksi ke Railway
mysql -h crossover.proxy.rlwy.net -P 54947 -u root -p [password] -e "SHOW DATABASES;"

# 2. Access Railway container
railway shell

# 3. Inside container - check DB config
php artisan config:show database

# 4. Run migrations
php artisan migrate --force --verbose

# 5. Run seeder
php artisan db:seed --force --verbose

# 6. Check hasil
php artisan migrate:status
php artisan tinker
>>> DB::table('users')->count()
>>> exit

# 7. Exit container
exit
```

---

## Verify Hasil Migrasi

Di Railway Dashboard atau via CLI:

```bash
railway console mysql -h [host] -u root -p [pass] -e "USE railway; SHOW TABLES; SELECT COUNT(*) as 'Total Tables' FROM information_schema.TABLES WHERE TABLE_SCHEMA='railway';"
```

Seharusnya ada ~20+ tables yang berhasil dibuat.

---

## Backup & Restore

### Backup dari Railway

```bash
# Via CLI
railway console mysqldump -u root -p [password] railway > /tmp/railway_backup.sql

# Via remote connection
mysqldump -h crossover.proxy.rlwy.net -P 54947 -u root -p[password] railway > ~/railway_backup.sql
```

### Restore ke Railway

```bash
mysql -h crossover.proxy.rlwy.net -P 54947 -u root -p[password] railway < ~/railway_backup.sql
```

---

**Ready to migrate?** Start dengan Step 2 Option B atau C! 🚀
