# Railway Production Deployment Guide

Panduan lengkap untuk deploy MyPerpus ke Railway dengan PHP, MySQL, Redis, dan konfigurasi production.

## Prerequisite

1. Akun Railway: https://railway.app
2. GitHub repository terpublikasi dengan kode terbaru
3. Credit Railway (untuk MySQL, Redis, dll)

---

## Step 1: Login ke Railway & Buat Project Baru

```bash
# Login Railway CLI
railway login

# Atau buka https://railway.app dan buat project baru
```

**Via Web Dashboard:**
1. Buka https://railway.app/dashboard
2. Klik **"Create New Project"** → **"Empty Project"** atau **"Deploy from GitHub"**
3. Pilih repository `myperpus_full`
4. Railway akan auto-detect dan menawarkan untuk deploy dari Dockerfile ✅

---

## Step 2: Tambahkan Services

Di Railway Dashboard, klik **"+ New"** dan tambahkan:

### A. MySQL Database

```
+ New → Database → MySQL
```

**Konfigurasi:**
- Version: `8.0` atau lebih baru
- Railway menyediakan: `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQL_URL`

### B. Redis Cache

```
+ New → Database → Redis
```

**Konfigurasi:**
- Version: `latest`
- Railway menyediakan: `REDISHOST`, `REDISUSER`, `REDISPORT`, `REDISPASSWORD`, `REDIS_URL`

### C. PHP App (dari Dockerfile)

```
+ New → GitHub Repo
```

**Pilih:**
- Repository: `Kudogawa10/perpus`
- Branch: `main`
- Dockerfile: `Dockerfile` (auto-detect)

---

## Step 3: Link Services & Generate DATABASE_URL

Di Railway Dashboard, untuk setiap service:

1. **MySQL Database** → klik tab "Connect"
2. Di service PHP App, referensikan variable MySQL, misalnya `MYSQLHOST=${{MySQL.MYSQLHOST}}`
3. **Redis** → referensikan `REDIS_URL` atau host+port terpisah dari service Redis

**Nama variable Railway:**
- MySQL: `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQL_URL`
- Redis: `REDISHOST`, `REDISUSER`, `REDISPORT`, `REDISPASSWORD`, `REDIS_URL`

---

## Step 4: Set Environment Variables

Di PHP App service, klik **"Variables"** dan tambahkan:

### Required Variables

```env
# App Config
APP_NAME=MyPerpus
APP_ENV=production
APP_DEBUG=false
APP_TIMEZONE=Asia/Jakarta
APP_URL=https://your-app.up.railway.app

# Log
LOG_CHANNEL=stderr
LOG_LEVEL=warning

# Database (reference dari MySQL service)
DB_CONNECTION=mysql
MYSQLHOST=${{MySQL.MYSQLHOST}}
MYSQLPORT=${{MySQL.MYSQLPORT}}
MYSQLUSER=${{MySQL.MYSQLUSER}}
MYSQLPASSWORD=${{MySQL.MYSQLPASSWORD}}
MYSQLDATABASE=${{MySQL.MYSQLDATABASE}}
MYSQL_URL=${{MySQL.MYSQL_URL}}

# Cache & Session
CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
SESSION_LIFETIME=120
SESSION_ENCRYPT=true
SESSION_SECURE_COOKIE=true

# Redis (reference dari Redis service)
REDIS_CLIENT=predis
REDISHOST=${{Redis.REDISHOST}}
REDISUSER=${{Redis.REDISUSER}}
REDISPORT=${{Redis.REDISPORT}}
REDISPASSWORD=${{Redis.REDISPASSWORD}}
REDIS_URL=${{Redis.REDIS_URL}}

# Mail (gunakan log untuk testing, atau setup SMTP provider)
MAIL_MAILER=log
MAIL_FROM_ADDRESS="noreply@myperpus.id"
MAIL_FROM_NAME="MyPerpus"

# Admin User (dibuat saat seeding)
ADMIN_EMAIL=admin@perpus.com
ADMIN_PASSWORD=YourSecurePasswordHere

# Security
SANCTUM_STATEFUL_DOMAINS=your-app.up.railway.app,localhost
SESSION_DOMAIN=

# Migrations
RUN_MIGRATIONS=true
RUN_SEEDERS=true

# Port
PORT=8080
```

**⚠️ PENTING: Jangan commit `.env` ke repository!**

---

## Step 5: Generate APP_KEY

Railway start script otomatis generate `APP_KEY` jika belum ada. 

Atau generate manual:

```bash
# Lokal dulu
php artisan key:generate --show

# Copy output (format: base64:xxx...)
# Paste ke Railway Variables → APP_KEY
```

---

## Step 6: Deploy

### Via Railway CLI

```bash
railway link              # Link project lokal ke Railway
railway deploy            # Deploy dari Dockerfile
railway logs              # Lihat logs realtime
```

### Via GitHub

```bash
git push origin main      # Push ke GitHub
```

Railway otomatis detect perubahan dan re-deploy.

---

## Step 7: Verify Deployment

Setelah deploy selesai:

```bash
# Via CLI
railway logs --tail 100

# Via Dashboard
# Klik PHP App → Logs → lihat build & runtime logs
```

**Checklist:**

- ✅ Build berhasil (lihat Dockerfile build steps)
- ✅ Container running (status hijau)
- ✅ Database migrations berjalan (`RUN_MIGRATIONS=true`)
- ✅ App accessible di `https://your-app.up.railway.app`
- ✅ Database terisi seed data (user admin, roles, dll)

---

## Step 8: Domain Custom (Opsional)

Di Railway Dashboard, PHP App → Settings → Public Networking:

1. **Default Domain** (auto): `something.up.railway.app`
2. **Custom Domain** (optional): `myperpus.yourdomain.com`
   - Setup DNS CNAME ke Railway domain
   - Railway handle SSL/TLS otomatis

---

## Troubleshooting

### 1. Build Gagal - Docker Build Error

**Error:** `composer install failed`, `npm build failed`

**Solusi:**
- Cek `railway logs` full output
- Pastikan `package.json`, `composer.json`, `Dockerfile` benar
- Cek dependency versi PHP (8.4+)

### 2. App Starts tapi Database Connection Error

**Error:** `SQLSTATE[HY000] [2002] Can't connect to MySQL server`

**Solusi:**
- Pastikan MySQL service sudah running (status hijau di dashboard)
- Pastikan PHP App punya reference variable MySQL (`MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQL_URL`)
- Cek di Variables sudah benar dan sudah di-deploy
- Tunggu MySQL fully start (~30s setelah deploy)

### 3. Migrations Gagal saat Deploy

**Error:** `PDOException: SQLSTATE[HY000]`

**Solusi:**
- Set `RUN_MIGRATIONS=false` dulu, deploy, baru jalankan manual:
  ```bash
  railway console php artisan migrate --force
  ```
- Atau cek DB connection dulu sebelum auto-migrate

### 4. Redis Connection Error

**Error:** `Could not connect to Redis`

**Solusi:**
- Redis service harus running (hijau)
- Pastikan `REDISHOST`, `REDISPORT`, `REDISPASSWORD`, dan `REDIS_URL` benar di Variables
- Atau set `CACHE_STORE=file` temporary untuk testing

### 5. File Upload / Storage Error

**Warning:** Laravel `storage/` adalah ephemeral di Railway.

**Solusi:**
- Untuk persistent storage, setup S3/Spaces:
  ```env
  FILESYSTEM_DISK=s3
  AWS_ACCESS_KEY_ID=xxx
  AWS_SECRET_ACCESS_KEY=xxx
  AWS_DEFAULT_REGION=us-east-1
  AWS_BUCKET=your-bucket
  ```
- Atau gunakan Railway Volume untuk `storage/`

---

## Step 9: Monitoring & Maintenance

### Logs

```bash
railway logs --tail 200           # Last 200 lines
railway logs --follow             # Real-time tail
railway logs --service mysql      # MySQL logs saja
```

### Database Backups

Railway otomatis backup MySQL. Untuk manual:

```bash
railway console mysqldump -u$DB_USERNAME -p$DB_PASSWORD $DB_DATABASE > backup.sql
```

### Queue Worker

Jika ada background jobs, jalankan worker:

```bash
# Di Railway Console
php artisan queue:work --sleep=3 --tries=3 --max-time=3600
```

Atau setup supervisor/cron scheduler.

### Scheduler

Tambah cron job di Railway:

```
0 * * * * cd /var/www/html && php artisan schedule:run >> /dev/null 2>&1
```

---

## Best Practices

1. **Environment Secrets**: Gunakan Railway Variables untuk API keys, passwords. Jangan hardcode.
2. **Backups**: Enable MySQL backup di Railway atau setup manual cron.
3. **Monitoring**: Setup alerts untuk CPU, memory, disk usage.
4. **Staging**: Buat project Railway terpisah untuk staging sebelum production.
5. **Rollback**: Railway otomatis keep deployment history. Bisa rollback ke previous deploy.
6. **SSL**: Railway otomatis provide & renew SSL untuk custom domain.

---

## Next: Production Checklist

Setelah deploy berhasil, lakukan:

```bash
# 1. Verify admin dapat login
# 2. Test create buku, peminjaman, ulasan
# 3. Check storage permissions & file uploads
# 4. Monitor error logs di Sentry/Bugsnag (opsional)
# 5. Setup email notifications (SMTP, not `log`)
# 6. Run security audit
#    composer audit
#    npm audit --omit=dev
# 7. Load testing
```

---

## Rollback Deploy

Jika ada issue, di Railway Dashboard:

```
PHP App → Deployments → klik deployment sebelumnya → "Redeploy"
```

---

**Questions?** Lihat docs Railway: https://docs.railway.app

Selamat deploy! 🚀
