# Fix: 500 Error on Railway Deployment

## Root Cause

Aplikasi mengembalikan 500 error karena:
1. **Database connection tidak terkonfigurasi** → DATABASE_URL kosong atau tidak di-set
2. **Cache/Session misconfiguration** → File-based cache di ephemeral container
3. **Queue misconfiguration** → MAIL_MAILER=queue tapi QUEUE_CONNECTION=sync
4. **APP_KEY invalid atau kosong**

## Solution: Configure Railway Environment Variables

### Step 1: Add Environment Variables di Railway Dashboard

1. Buka https://railway.app/dashboard
2. Klik project **myperpus-productions**
3. Klik service **PHP App**
4. Tab **Variables** → klik **Edit**

### Step 2: Set Required Variables

Copy-paste **EXACTLY** ke Railway Variables (ganti placeholder):

```env
# App
APP_NAME=MyPerpus
APP_ENV=production
APP_DEBUG=false
APP_TIMEZONE=Asia/Jakarta
APP_URL=https://myperpus-productions.up.railway.app

# Log
LOG_CHANNEL=stack
LOG_LEVEL=warning

# Database (leave empty — Railway auto-fills via DATABASE_URL from MySQL plugin)
DB_CONNECTION=mysql

# Cache & Session — MUST USE REDIS (not file!)
CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
SESSION_LIFETIME=120
SESSION_ENCRYPT=true
SESSION_SECURE_COOKIE=true

# Mail
MAIL_MAILER=log
MAIL_FROM_ADDRESS=noreply@myperpus.id
MAIL_FROM_NAME=MyPerpus

# Storage
FILESYSTEM_DISK=local

# Frontend
VITE_APP_NAME=MyPerpus

# Railway
RUN_MIGRATIONS=true
PORT=8080

# Admin (for seeding)
ADMIN_EMAIL=admin@perpus.com
ADMIN_PASSWORD=YourSecurePassword123

# Security
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1,::1,myperpus-productions.up.railway.app
SESSION_DOMAIN=railway.app
```

### Step 3: Verify Database Service

1. Di Railway Dashboard, klik **MySQL Database** service
2. Klik **Connect**
3. Copy connection details (Railway akan auto-inject):
   - `DATABASE_URL` → otomatis ke PHP App
   - `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE` → docker/start.sh akan parse

**Jangan perlu manual set DB_HOST, DB_PORT, dll** — Railway auto-fills via DATABASE_URL.

### Step 4: Verify Redis Service

1. Di Railway Dashboard, klik **Redis** service
2. Klik **Connect**
3. Railway auto-injects `REDIS_URL` atau `REDIS_HOST`, `REDIS_PASSWORD`, `REDIS_PORT`

### Step 5: Redeploy

Option A (via Dashboard):
1. Klik PHP App service
2. Tab **Deployments**
3. Klik ⋯ → **Redeploy Latest**
4. Wait ~2 min untuk build & start

Option B (via Git):
```bash
git push origin main  # Railway auto-detects & rebuilds
```

### Step 6: Monitor Logs

```bash
# Via Railway CLI
railway logs -f

# Via Dashboard
# Klik PHP App → Logs → scroll down untuk melihat startup process
```

**Checklist saat deploy:**
- ✅ Build successful (tidak ada Docker error)
- ✅ Container starting
- ✅ "APP_KEY generated" atau "Parsing DATABASE_URL"
- ✅ Database connection successful
- ✅ Migrations running (jika RUN_MIGRATIONS=true)
- ✅ App listening on port 8080
- ✅ GET / returns HTML (tidak 500)

---

## Testing After Deploy

```bash
# Via browser
https://myperpus-productions.up.railway.app

# Checklist
1. Page loads (no 500 error)
2. Can access login page
3. Can login with admin account
4. Dashboard loads (database queries work)
5. Can create/read data (Buku, Peminjaman, etc)
```

---

## Troubleshooting

### Still Getting 500?

#### **Error: "SQLSTATE[HY000]: General error"**
- MySQL service belum running, atau
- DATABASE_URL tidak di-parse dengan benar
- **Fix:** Cek logs untuk "Parsing DATABASE_URL" message
- Manual test: `railway console php artisan tinker` → `DB::connection()->getPdo()`

#### **Error: "Call to undefined function Redis::..."**
- Redis tidak running
- **Fix:** Cek Redis service status (harus hijau)

#### **Error: "Base table or view not found: 'myperpus.users'"**
- Migrations tidak jalan
- **Fix:** Set `RUN_MIGRATIONS=true` di Variables, redeploy

#### **Error: "The APP_KEY is missing or invalid"**
- APP_KEY kosong
- **Fix:** Biarkan docker/start.sh generate, atau set manual:
  ```bash
  php artisan key:generate --show
  # Copy output, paste ke Railway Variables → APP_KEY
  ```

#### **Error: "Connection refused" saat startup**
- Database/Redis belum ready
- **Fix:** Tunggu ~30s, redeploy

---

## Reference Files

- `.env.railway` — Template production variables
- `docker/start.sh` — Auto-configuration & migration logic
- `RAILWAY_SETUP.md` — Complete deployment guide
- `RAILWAY_CHECKLIST.md` — Pre/during/post deployment checklist

---

## Quick Fix Checklist

- [ ] All required variables set in Railway Variables
- [ ] DATABASE_URL auto-populated (MySQL plugin)
- [ ] REDIS_* auto-populated (Redis plugin)
- [ ] CACHE_STORE=redis (not file)
- [ ] QUEUE_CONNECTION=redis (not sync)
- [ ] SESSION_DRIVER=redis (not file)
- [ ] RUN_MIGRATIONS=true (auto-run DB setup)
- [ ] Redeploy PHP App
- [ ] Check logs for errors
- [ ] Test https://myperpus-productions.up.railway.app

---

**Masih error?** Cek logs di Railway Dashboard dan cari error message pertama. Share logs, saya bantu diagnose! 🔍
