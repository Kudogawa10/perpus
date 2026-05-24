# Quick Database Migration Setup untuk Railway

Database sudah siap di Railway! Tinggal run migration. Berikut langkah-langkahnya:

## Koneksi Database Railway

```
Host: [lihat Railway MySQL Variables: MYSQLHOST]
Port: [lihat Railway MySQL Variables: MYSQLPORT]
User: [lihat Railway MySQL Variables: MYSQLUSER]
Password: [lihat Railway MySQL Variables: MYSQLPASSWORD]
Database: [lihat Railway MySQL Variables: MYSQLDATABASE]
URL: [lihat Railway MySQL Variables: MYSQL_URL]
```

## Option 1: Auto-Migrate saat Deploy (Recommended)

### Step 1: Set Environment Variables di Railway Dashboard

1. Buka https://railway.app/project/72652b65-a880-4740-bbfd-423f3d8f088d
2. Klik service **perpus** (PHP App)
3. Tab **Variables**
4. Klik **New Variable**
5. Tambahkan:
   ```
   RUN_MIGRATIONS=true
   ```
6. Klik **Save**
7. Klik **Redeploy** (atau tunggu auto-rebuild dari latest push)

### Step 2: Verify Migrasi Berjalan

1. Klik **Deployments** tab
2. Tunggu deployment selesai (~2-3 min)
3. Klik **Logs**
4. Cari message:
   ```
   "APP_KEY invalid or missing, generating new one..."
   "Parsing DATABASE_URL into missing DB_* env vars..."
   "Waiting for database..."
   "Database available - running migrations"
   "migrated successfully"
   ```

### Step 3: Test

```bash
# Buka app
https://myperpus-productions.up.railway.app

# Login
Email: admin@perpus.com
Password: [ADMIN_PASSWORD dari Variables]
```

---

## Option 2: Manual Migration via Railway Console

```bash
# Via terminal lokal
railway login
railway shell

# Inside Railway container:
php artisan migrate --force --verbose
php artisan db:seed --force --verbose

# Verify
php artisan migrate:status
exit
```

---

## Option 3: Manual Migration via MySQL CLI

```bash
# Dari lokal
mysql -h "$MYSQLHOST" -P "$MYSQLPORT" \
  -u "$MYSQLUSER" -p"$MYSQLPASSWORD" \
  "$MYSQLDATABASE" < dump.sql
```

---

## Verify Hasil

### Via Railway Dashboard - MySQL Service

1. Klik MySQL service
2. Tab **Database**
3. Cek "You have no tables" berubah jadi list tables
4. Seharusnya ada 20+ tables: `users`, `buku`, `kategori`, `peminjaman`, `ulasan`, etc.

### Via MySQL CLI

```bash
mysql -h "$MYSQLHOST" -P "$MYSQLPORT" -u "$MYSQLUSER" \
  -p"$MYSQLPASSWORD" "$MYSQLDATABASE" \
  -e "SHOW TABLES; SELECT COUNT(*) as TotalTables FROM information_schema.TABLES WHERE TABLE_SCHEMA='railway';"
```

Output seharusnya:
```
+-----------+
| Tables_in_railway |
+-----------+
| buku      |
| kategori  |
| migrations |
| peminjaman |
| users     |
| ulasan    |
| ... (20+ tables) |
+-----------+
| TotalTables |
|    20+      |
+-----------+
```

---

## What Gets Created

### Tables (20+)
- `users` - Admin & user accounts
- `buku` - Book catalog
- `kategori` - Book categories
- `peminjaman` - Borrowing records
- `ulasan` - Reviews
- `reading_progress` - Reading progress
- `laporan_buku` - Book reports
- `model_has_roles` - Role assignments (Spatie)
- `migrations` - Migration history
- `jobs` - Queue jobs
- `cache`, `sessions` - Laravel cache/session
- dll...

### Seeded Data
- Roles: admin, staff, member
- Admin user: admin@perpus.com
- Categories: Fiksi, Non-Fiksi, dll
- Demo books & data (if not production)

---

## Troubleshooting

### Error: "SQLSTATE[HY000]: Connection Error"
- Railway MySQL belum ready atau down
- Solusi: Tunggu 30s, coba lagi

### Error: "Base table or view not found"
- Migrations belum jalan
- Solusi: Check logs untuk error message, atau run manual: `railway console php artisan migrate --force`

### Error: "Seeder error creating admin"
- ADMIN_EMAIL atau ADMIN_PASSWORD tidak set
- Solusi: Set di Railway Variables: `ADMIN_EMAIL=admin@perpus.com` & `ADMIN_PASSWORD=SomePassword123`

### Migration status: "still pending"
- Migration process sedang berjalan
- Solusi: Tunggu container fully start, cek logs

---

## Recommended Flow

1. ✅ Database sudah di Railway MySQL
2. ⏳ Set `RUN_MIGRATIONS=true` di Variables
3. ⏳ Redeploy aplikasi
4. ⏳ Tunggu migration complete (check logs)
5. ✅ Test aplikasi login
6. ✅ Verify data di MySQL

**Mulai dari Step 2!** 🚀
