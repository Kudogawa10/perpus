@echo off
chcp 65001 > nul
echo.
echo ╔════════════════════════════════════╗
echo ║   MyPerpus Installer (Windows)     ║
echo ╚════════════════════════════════════╝
echo.

:: Check PHP
php -v > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] PHP tidak ditemukan. Install PHP 8.2+ terlebih dahulu.
    pause & exit /b 1
)
echo [OK] PHP tersedia

:: Check Composer
composer -V > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Composer tidak ditemukan. Download dari https://getcomposer.org
    pause & exit /b 1
)
echo [OK] Composer tersedia

:: Check Node
node -v > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js tidak ditemukan. Download dari https://nodejs.org
    pause & exit /b 1
)
echo [OK] Node.js tersedia

echo.
echo [1/6] Menyalin konfigurasi...
if not exist .env copy .env.example .env

echo.
echo [PENTING] Edit file .env sekarang:
echo   - DB_DATABASE=myperpus
echo   - DB_USERNAME=root
echo   - DB_PASSWORD=your_password
echo.
pause

echo.
echo [2/6] Menginstall PHP dependencies...
composer install --no-interaction --prefer-dist --optimize-autoloader

echo.
echo [3/6] Menginstall Node dependencies...
npm install

echo.
echo [4/6] Generate app key...
php artisan key:generate

echo.
echo [5/6] Migrasi database dan seeding...
php artisan migrate --force
php artisan db:seed --force
php artisan storage:link

echo.
echo [6/6] Build frontend assets...
npm run build

echo.
echo ╔════════════════════════════════════╗
echo ║   ✅  Instalasi Selesai!            ║
echo ╚════════════════════════════════════╝
echo.
echo Jalankan: php artisan serve
echo Buka: http://localhost:8000
echo.
echo Akun Demo:
echo   Admin  : admin@myperpus.id / password
echo   Petugas: petugas@myperpus.id / password
echo   Anggota: anggota@myperpus.id / password
echo.
pause
