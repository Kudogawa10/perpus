#!/bin/bash

# ============================================================
# MyPerpus - Auto Install Script
# ============================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

echo ""
echo -e "${BOLD}╔════════════════════════════════════╗${NC}"
echo -e "${BOLD}║   📚  MyPerpus Installer v1.0      ║${NC}"
echo -e "${BOLD}╚════════════════════════════════════╝${NC}"
echo ""

# --- Check requirements ---
check_cmd() {
    if ! command -v "$1" &> /dev/null; then
        echo -e "${RED}✗ $1 tidak ditemukan. Install terlebih dahulu.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ $1 tersedia${NC}"
}

echo -e "${BLUE}Memeriksa prasyarat...${NC}"
check_cmd php
check_cmd composer
check_cmd node
check_cmd npm
check_cmd mysql
echo ""

# --- PHP version check ---
PHP_VER=$(php -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;')
if (( $(echo "$PHP_VER < 8.2" | bc -l) )); then
    echo -e "${RED}✗ PHP 8.2+ diperlukan. Versi saat ini: $PHP_VER${NC}"
    exit 1
fi
echo -e "${GREEN}✓ PHP $PHP_VER${NC}"

# --- Setup .env ---
echo ""
echo -e "${BLUE}Menyiapkan konfigurasi...${NC}"
cp .env.example .env

echo ""
echo -e "${YELLOW}Masukkan konfigurasi database:${NC}"
read -p "DB Host [127.0.0.1]: " db_host
db_host=${db_host:-127.0.0.1}
read -p "DB Port [3306]: " db_port
db_port=${db_port:-3306}
read -p "DB Name [myperpus]: " db_name
db_name=${db_name:-myperpus}
read -p "DB Username [root]: " db_user
db_user=${db_user:-root}
read -s -p "DB Password: " db_pass
echo ""

# Update .env
sed -i "s/DB_HOST=.*/DB_HOST=$db_host/" .env
sed -i "s/DB_PORT=.*/DB_PORT=$db_port/" .env
sed -i "s/DB_DATABASE=.*/DB_DATABASE=$db_name/" .env
sed -i "s/DB_USERNAME=.*/DB_USERNAME=$db_user/" .env
sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$db_pass/" .env

# --- Create database ---
echo ""
echo -e "${BLUE}Membuat database...${NC}"
mysql -h"$db_host" -P"$db_port" -u"$db_user" -p"$db_pass" \
  -e "CREATE DATABASE IF NOT EXISTS \`$db_name\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null && \
  echo -e "${GREEN}✓ Database '$db_name' siap${NC}" || \
  echo -e "${YELLOW}⚠ Tidak bisa membuat database otomatis. Buat manual: CREATE DATABASE $db_name;${NC}"

# --- Install dependencies ---
echo ""
echo -e "${BLUE}Menginstall PHP dependencies...${NC}"
composer install --no-interaction --prefer-dist --optimize-autoloader -q
echo -e "${GREEN}✓ Composer dependencies terinstall${NC}"

echo ""
echo -e "${BLUE}Menginstall Node dependencies...${NC}"
npm install --silent
echo -e "${GREEN}✓ Node dependencies terinstall${NC}"

# --- Laravel setup ---
echo ""
echo -e "${BLUE}Menyiapkan Laravel...${NC}"
php artisan key:generate --ansi
php artisan migrate --force
php artisan db:seed --force
php artisan storage:link
echo -e "${GREEN}✓ Laravel siap${NC}"

# --- Build assets ---
echo ""
echo -e "${BLUE}Build frontend assets...${NC}"
npm run build
echo -e "${GREEN}✓ Assets berhasil di-build${NC}"

# --- Done! ---
echo ""
echo -e "${BOLD}╔════════════════════════════════════╗${NC}"
echo -e "${BOLD}║   ✅  Instalasi Selesai!            ║${NC}"
echo -e "${BOLD}╚════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Jalankan aplikasi:${NC}"
echo -e "  ${BOLD}php artisan serve${NC}"
echo ""
echo -e "${GREEN}Buka browser:${NC}"
echo -e "  ${BOLD}http://localhost:8000${NC}"
echo ""
echo -e "${YELLOW}Akun Demo:${NC}"
echo -e "  Admin  : admin@myperpus.id / password"
echo -e "  Petugas: petugas@myperpus.id / password"
echo -e "  Anggota: anggota@myperpus.id / password"
echo ""
