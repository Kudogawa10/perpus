# Railway Deployment Checklist

Quick checklist untuk setup production MyPerpus di Railway.

## Pre-Deployment

- [ ] Semua code sudah di-push ke `main` branch
- [ ] Tidak ada `.env` di repository (cek `.gitignore`)
- [ ] Test lokal dengan `docker-compose up` berhasil
- [ ] Database migrations berjalan: `php artisan migrate`
- [ ] Assets built: `npm run build`
- [ ] No console errors di npm build
- [ ] Composer dependencies resolved: `composer install --no-dev`

## Railway Setup

### 1. Create Project & Link Services

- [ ] Login ke https://railway.app
- [ ] Create new empty project
- [ ] Link GitHub repository (`main` branch)
- [ ] Railway detects Dockerfile ✅

### 2. Add Database Services

- [ ] MySQL Database added (provides `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQL_URL`)
- [ ] Redis added (provides `REDISHOST`, `REDISUSER`, `REDISPORT`, `REDISPASSWORD`, `REDIS_URL`)
- [ ] Both services status: **Running** (hijau)

### 3. Set Environment Variables

- [ ] `APP_NAME=MyPerpus`
- [ ] `APP_ENV=production`
- [ ] `APP_DEBUG=false`
- [ ] `APP_URL=https://your-app.up.railway.app` ← Update dengan domain Anda
- [ ] `APP_KEY=base64:xxx...` (generate atau biarkan script generate)
- [ ] `DB_CONNECTION=mysql`
- [ ] MySQL reference variables added to PHP App (`MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQL_URL`)
- [ ] `CACHE_STORE=redis`
- [ ] `QUEUE_CONNECTION=redis`
- [ ] `SESSION_DRIVER=redis`
- [ ] Redis reference variables added to PHP App (`REDISHOST`, `REDISUSER`, `REDISPORT`, `REDISPASSWORD`, `REDIS_URL`)
- [ ] `REDIS_CLIENT=predis`
- [ ] `MAIL_MAILER=log` (opsional: setup SMTP provider)
- [ ] `ADMIN_EMAIL=admin@perpus.com`
- [ ] `ADMIN_PASSWORD=SecurePass123`
- [ ] `RUN_MIGRATIONS=true`
- [ ] `LOG_LEVEL=warning`
- [ ] `SESSION_ENCRYPT=true`
- [ ] `SESSION_SECURE_COOKIE=true`

### 4. Verify Service References

PHP App Variables:
- [ ] MySQL variables reference the MySQL service, for example `MYSQLHOST=${{MySQL.MYSQLHOST}}`
- [ ] Redis variables reference the Redis service, for example `REDISHOST=${{Redis.REDISHOST}}`

## Deployment

### 1. Deploy Options

**Option A: Via Railway CLI**
```bash
railway link
railway deploy
railway logs --tail 100
```

- [ ] Login Railway CLI: `railway login`
- [ ] Link project: `railway link`
- [ ] Deploy: `railway deploy`
- [ ] Monitor logs: `railway logs --follow`

**Option B: Via GitHub**
```bash
git push origin main
```

- [ ] Push ke GitHub
- [ ] Railway auto-detects & rebuilds
- [ ] Check dashboard for build status

### 2. Build & Deploy Monitoring

- [ ] Dockerfile build dimulai
- [ ] Build stages complete:
  - [ ] Node builder (npm install, npm run build)
  - [ ] Composer builder (composer install --no-dev)
  - [ ] Final PHP image (PHP 8.4, extensions)
- [ ] Image push ke Railway registry
- [ ] Container starts
- [ ] Check logs untuk APP_KEY generation
- [ ] Migrations running (`RUN_MIGRATIONS=true`)
- [ ] App accessible di `https://xxx.up.railway.app`

## Post-Deployment

### 1. Verify Services

- [ ] HTTP GET `https://xxx.up.railway.app` returns HTML
- [ ] No 500 errors di logs
- [ ] MySQL connected (check logs)
- [ ] Redis connected (check logs)
- [ ] Admin account created (seeder ran)

### 2. Test Core Features

- [ ] Can login as admin
- [ ] Dashboard loads (database queries work)
- [ ] Can create/read Buku
- [ ] Can create Peminjaman
- [ ] Can post Ulasan
- [ ] File uploads work (if enabled)
- [ ] Queue/background jobs functional (if enabled)

### 3. Security Checks

- [ ] HTTPS enabled (Railway default)
- [ ] `.env` NOT visible in repository
- [ ] Sensitive variables in Railway Variables (not hardcoded)
- [ ] `APP_DEBUG=false` in production
- [ ] CORS/CSRF properly configured

### 4. Performance & Logs

- [ ] No error spam in logs
- [ ] Database queries performing ok (no timeout)
- [ ] CPU/Memory usage reasonable
- [ ] No 404 errors for assets (public/build, public/asset)

## Ongoing Maintenance

- [ ] Setup error tracking (Sentry, Bugsnag)
- [ ] Setup email notifications (SMTP)
- [ ] Database backups enabled
- [ ] Queue worker running (if needed)
- [ ] Scheduler cron job configured (if needed)
- [ ] Monitor logs daily for errors
- [ ] Plan regular security audits

## Rollback (if needed)

- [ ] Go to Railway Dashboard → Deployments
- [ ] Select previous successful deployment
- [ ] Click "Redeploy"
- [ ] Or push rollback commit to GitHub

## Custom Domain (Optional)

- [ ] Update DNS CNAME to Railway domain
- [ ] Railway auto-provisions SSL
- [ ] Update `APP_URL` in Variables
- [ ] Test HTTPS on custom domain

---

## Quick Commands

```bash
# Check logs
railway logs --tail 100

# Run console command
railway console php artisan tinker

# View all variables
railway variables

# Update variable
railway variables set APP_DEBUG=false

# SSH into container
railway shell

# List Railway projects
railway list

# Switch project
railway link
```

---

**Selamat deploy! 🚀**
