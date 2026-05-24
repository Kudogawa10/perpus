##############################################################
#  MyPerpus — Makefile
#  Shortcut perintah Docker untuk development sehari-hari
#  Penggunaan: make <perintah>
##############################################################

.PHONY: help up down restart build fresh setup-env logs shell \
        migrate seed migrate-fresh artisan composer npm \
        tinker test cc storage-link logs-queue logs-scheduler logs-node logs-mailpit

# ─── Warna terminal ──────────────────────────────────────────
GREEN  = \033[0;32m
YELLOW = \033[1;33m
CYAN   = \033[0;36m
RESET  = \033[0m

## help        → Tampilkan semua perintah yang tersedia
help:
	@echo ""
	@echo "$(CYAN)╔══════════════════════════════════════╗$(RESET)"
	@echo "$(CYAN)║      MyPerpus — Docker Commands      ║$(RESET)"
	@echo "$(CYAN)╚══════════════════════════════════════╝$(RESET)"
	@echo ""
	@grep -E '^## ' Makefile | sed 's/## /  $(GREEN)make$(RESET) /'
	@echo ""

# ─── Container lifecycle ─────────────────────────────────────
## up          → Jalankan semua container (background)
up:
	@echo "$(GREEN)▶ Menjalankan MyPerpus...$(RESET)"
	@$(MAKE) setup-env
	docker compose up -d
	@echo "$(GREEN)✓ Aplikasi berjalan di http://localhost:8000$(RESET)"
	@echo "$(GREEN)✓ Mailpit tersedia di http://localhost:8025$(RESET)"

## down        → Hentikan semua container
down:
	@echo "$(YELLOW)■ Menghentikan container...$(RESET)"
	docker compose down

## restart     → Restart semua container
restart:
	docker compose restart

## build       → Build ulang semua image
build:
	@echo "$(YELLOW)⚙ Build image...$(RESET)"
	docker compose build --no-cache

## fresh       → Hapus semua container + volume, mulai dari nol
fresh:
	@echo "$(YELLOW)⚠ Menghapus semua data dan container...$(RESET)"
	@$(MAKE) setup-env
	docker compose down -v --remove-orphans
	docker compose up -d --build
	@$(MAKE) setup

# ─── Setup awal ──────────────────────────────────────────────
## setup-env   → Buat .env Docker jika belum ada
setup-env:
	@test -f .env || cp .env.docker .env

## setup       → Setup awal project (install, migrate, seed)
setup:
	@echo "$(CYAN)⚙ Setup awal MyPerpus...$(RESET)"
	@$(MAKE) setup-env
	@$(MAKE) composer-install
	docker compose exec php php artisan key:generate --force
	docker compose exec php php artisan migrate --force
	docker compose exec php php artisan db:seed --force
	docker compose exec php php artisan storage:link
	@echo "$(GREEN)✓ Setup selesai!$(RESET)"

# ─── Logs ────────────────────────────────────────────────────
## logs        → Lihat semua log container (realtime)
logs:
	docker compose logs -f

## logs-php    → Lihat log PHP saja
logs-php:
	docker compose logs -f php

## logs-nginx  → Lihat log Nginx saja
logs-nginx:
	docker compose logs -f nginx

## logs-mysql  → Lihat log MySQL saja
logs-mysql:
	docker compose logs -f mysql

## logs-queue  → Lihat log queue worker
logs-queue:
	docker compose logs -f queue

## logs-scheduler → Lihat log scheduler
logs-scheduler:
	docker compose logs -f scheduler

## logs-node   → Lihat log Vite
logs-node:
	docker compose logs -f node

## logs-mailpit → Lihat log Mailpit
logs-mailpit:
	docker compose logs -f mailpit

# ─── Shell akses ─────────────────────────────────────────────
## shell       → Masuk ke shell container PHP
shell:
	docker compose exec php sh

## shell-mysql → Masuk ke MySQL CLI
shell-mysql:
	docker compose exec mysql mysql -u myperpus_user -pmyperpus_pass myperpus

## shell-redis → Masuk ke Redis CLI
shell-redis:
	docker compose exec redis redis-cli

# ─── Laravel Artisan ─────────────────────────────────────────
## migrate     → Jalankan migrasi database
migrate:
	docker compose exec php php artisan migrate

## migrate-fresh → Reset + migrasi ulang + seed
migrate-fresh:
	docker compose exec php php artisan migrate:fresh --seed

## seed        → Jalankan seeder saja
seed:
	docker compose exec php php artisan db:seed

## tinker      → Buka Laravel Tinker REPL
tinker:
	docker compose exec php php artisan tinker

## cc          → Clear semua cache Laravel
cc:
	docker compose exec php php artisan optimize:clear
	@echo "$(GREEN)✓ Cache dibersihkan$(RESET)"

## storage-link → Buat symlink storage
storage-link:
	docker compose exec php php artisan storage:link

## artisan     → Jalankan perintah artisan custom (make artisan CMD="...")
artisan:
	docker compose exec php php artisan $(CMD)

## routes      → Lihat semua route
routes:
	docker compose exec php php artisan route:list

# ─── Composer & NPM ──────────────────────────────────────────
## composer-install → Install PHP dependencies
composer-install:
	docker compose exec php composer install

## composer    → Jalankan perintah composer (make composer CMD="...")
composer:
	docker compose exec php composer $(CMD)

## npm         → Jalankan perintah npm (make npm CMD="...")
npm:
	docker compose exec node npm $(CMD)

## npm-install → Install Node dependencies
npm-install:
	docker compose exec node npm install

## npm-build   → Build production assets
npm-build:
	docker compose exec node npm run build

# ─── Testing ─────────────────────────────────────────────────
## test        → Jalankan PHPUnit tests
test:
	docker compose exec php php artisan test

# ─── Status ──────────────────────────────────────────────────
## ps          → Lihat status semua container
ps:
	docker compose ps

## stats       → Lihat resource usage (CPU/RAM) container
stats:
	docker stats myperpus_nginx myperpus_php myperpus_mysql myperpus_redis --no-stream
