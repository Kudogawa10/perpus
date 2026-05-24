# Fix Laravel Encryption Error (APP_KEY)

## Steps:

### 1. [COMPLETED] Add APP_KEY fallback to docker/start.sh
- Go to Railway dashboard: https://railway.app/project/[your-project]/variables
- Add variable: `APP_KEY` = output dari `php artisan key:generate --show`
- Ensure other vars (DB_*, etc.) set from .env.production.example
- Redeploy service

### 2. [PENDING] Verify deployment
- Test https://myperpus-production.up.railway.app
- Check logs for errors

### 3. [PENDING] Optional: Local test
```bash
cp .env.production.example .env
php artisan key:generate --show
php artisan config:clear
docker compose up
```

### 4. [PENDING] Enhance docker/start.sh (optional)
Add APP_KEY generation fallback if invalid.

**Status: Generate APP_KEY sekali, lalu simpan hanya di Railway Variables.**
