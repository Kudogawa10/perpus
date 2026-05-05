# 🐧 Panduan Setup MyPerpus di Ubuntu Linux
## Dengan Docker + DBeaver

> Panduan ini ditulis untuk Ubuntu 24.04 LTS (Noble Numbat) / 22.04 LTS (Jammy).
> Cocok juga untuk distro berbasis Debian lainnya.

---

## 📋 Daftar Isi

1. [Persiapan Ubuntu](#1-persiapan-ubuntu)
2. [Install Docker Engine](#2-install-docker-engine)
3. [Install Docker Compose](#3-install-docker-compose)
4. [Konfigurasi Post-Install Docker](#4-konfigurasi-post-install-docker)
5. [Install DBeaver](#5-install-dbeaver)
6. [Siapkan Project MyPerpus](#6-siapkan-project-myperpus)
7. [Jalankan Docker Stack](#7-jalankan-docker-stack)
8. [Koneksi DBeaver ke MySQL](#8-koneksi-dbeaver-ke-mysql)
9. [Workflow Development Sehari-hari](#9-workflow-development-sehari-hari)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Persiapan Ubuntu

### 1.1 — Update sistem

Buka **Terminal** (`Ctrl + Alt + T`) lalu jalankan:

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 — Install tools dasar

```bash
sudo apt install -y \
  curl \
  wget \
  git \
  unzip \
  ca-certificates \
  gnupg \
  lsb-release \
  apt-transport-https \
  software-properties-common \
  make
```

### 1.3 — Verifikasi Git

```bash
git --version
# Output: git version 2.43.x
```

### 1.4 — Konfigurasi Git (opsional tapi disarankan)

```bash
git config --global user.name  "Nama Anda"
git config --global user.email "email@anda.com"
```

---

## 2. Install Docker Engine

> ⚠️ **Penting:** Jangan install Docker dari Snap (`snap install docker`).
> Gunakan repository resmi Docker untuk versi paling stabil dan terbaru.

### 2.1 — Hapus versi lama jika ada

```bash
sudo apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null
sudo apt autoremove -y
```

### 2.2 — Tambah GPG key resmi Docker

```bash
# Buat direktori keyring
sudo install -m 0755 -d /etc/apt/keyrings

# Download dan simpan GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set permission
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

### 2.3 — Tambah repository Docker

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) \
  signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### 2.4 — Install Docker Engine

```bash
sudo apt update

sudo apt install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin
```

### 2.5 — Verifikasi instalasi

```bash
sudo docker --version
# Output: Docker version 27.x.x, build xxxxxxx

sudo docker run hello-world
# Output: Hello from Docker! ...
```

---

## 3. Install Docker Compose

Docker Compose v2 sudah terinstall otomatis melalui `docker-compose-plugin` di langkah 2.4.

### Verifikasi

```bash
docker compose version
# Output: Docker Compose version v2.x.x
```

> **Catatan:** Di versi baru, perintahnya adalah `docker compose` (dengan spasi),
> bukan `docker-compose` (dengan tanda hubung) seperti versi lama.

---

## 4. Konfigurasi Post-Install Docker

### 4.1 — Tambah user ke grup docker

Ini agar kamu bisa menjalankan Docker **tanpa `sudo`** setiap saat:

```bash
# Tambah user ke grup docker
sudo usermod -aG docker $USER

# Terapkan perubahan grup TANPA restart (untuk sesi saat ini)
newgrp docker
```

### 4.2 — Enable Docker otomatis saat boot

```bash
sudo systemctl enable docker
sudo systemctl enable containerd
```

### 4.3 — Verifikasi tanpa sudo

```bash
docker ps
# Output: CONTAINER ID   IMAGE   COMMAND   ...
# (tabel kosong = berhasil, tidak perlu sudo)
```

### 4.4 — (Opsional) Konfigurasi batas resource Docker

Buat/edit file `/etc/docker/daemon.json`:

```bash
sudo nano /etc/docker/daemon.json
```

Isi dengan:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "default-address-pools": [
    { "base": "172.17.0.0/16", "size": 24 }
  ]
}
```

Simpan (`Ctrl+O`, `Enter`, `Ctrl+X`) lalu restart Docker:

```bash
sudo systemctl restart docker
```

---

## 5. Install DBeaver

DBeaver adalah database GUI client gratis yang mendukung MySQL, PostgreSQL, SQLite, dan banyak lagi.

### Opsi A — Install via .deb (Disarankan)

```bash
# Download installer versi terbaru
wget -O /tmp/dbeaver.deb \
  "https://dbeaver.io/files/dbeaver-ce_latest_amd64.deb"

# Install
sudo apt install -y /tmp/dbeaver.deb

# Hapus file installer
rm /tmp/dbeaver.deb
```

### Opsi B — Install via Snap

```bash
sudo snap install dbeaver-ce
```

### Opsi C — Install via Flatpak

```bash
# Install Flatpak jika belum ada
sudo apt install -y flatpak

# Tambah Flathub repository
flatpak remote-add --if-not-exists flathub \
  https://dl.flathub.org/repo/flathub.flatpakrepo

# Install DBeaver
flatpak install -y flathub io.dbeaver.DBeaverCommunity
```

### Buka DBeaver

```bash
# Via terminal
dbeaver &

# Atau cari "DBeaver" di Application Menu
```

---

## 6. Siapkan Project MyPerpus

### 6.1 — Buat folder project

```bash
# Pilih lokasi, misalnya di ~/Projects
mkdir -p ~/Projects
cd ~/Projects
```

### 6.2 — Extract file MyPerpus

```bash
# Jika dari ZIP yang diunduh
unzip ~/Downloads/myperpus_full.zip -d ~/Projects/
mv ~/Projects/myperpus_full ~/Projects/myperpus
cd ~/Projects/myperpus
```

### 6.3 — Salin file Docker ke dalam project

```bash
# Salin semua file Docker (dari package docker yang diunduh)
unzip ~/Downloads/myperpus_docker.zip -d /tmp/
cp -r /tmp/myperpus_docker/docker          ~/Projects/myperpus/
cp    /tmp/myperpus_docker/docker-compose.yml ~/Projects/myperpus/
cp    /tmp/myperpus_docker/Makefile           ~/Projects/myperpus/
cp    /tmp/myperpus_docker/.env.docker        ~/Projects/myperpus/
cp    /tmp/myperpus_docker/vite.config.js     ~/Projects/myperpus/
```

### 6.4 — Verifikasi struktur project

```bash
ls -la ~/Projects/myperpus/
```

Pastikan ada file-file berikut:
```
myperpus/
├── docker/
│   ├── nginx/
│   │   └── default.conf
│   ├── php/
│   │   ├── Dockerfile
│   │   └── php.ini
│   └── mysql/
│       └── my.cnf
├── docker-compose.yml
├── Makefile
├── .env.docker
├── vite.config.js
├── app/
├── resources/
├── routes/
└── ... (file Laravel lainnya)
```

### 6.5 — Siapkan file .env

```bash
cp .env.docker .env
```

---

## 7. Jalankan Docker Stack

### 7.1 — Build image PHP

```bash
cd ~/Projects/myperpus

# Build image (hanya perlu sekali, atau saat Dockerfile berubah)
docker compose build

# Tunggu beberapa menit saat pertama kali...
# Output akhir: => exporting to image  [DONE]
```

### 7.2 — Jalankan semua container

```bash
docker compose up -d
```

Output yang diharapkan:
```
✔ Network myperpus_net          Created
✔ Volume myperpus_mysql_data    Created
✔ Volume myperpus_redis_data    Created
✔ Container myperpus_redis      Started
✔ Container myperpus_mysql      Started
✔ Container myperpus_php        Started
✔ Container myperpus_nginx      Started
✔ Container myperpus_node       Started
```

### 7.3 — Cek status container

```bash
docker compose ps
```

Output yang diharapkan (semua STATUS = running):
```
NAME                STATUS          PORTS
myperpus_mysql      running         127.0.0.1:3306->3306/tcp
myperpus_nginx      running         127.0.0.1:8000->80/tcp
myperpus_node       running         127.0.0.1:5173->5173/tcp
myperpus_php        running
myperpus_redis      running         127.0.0.1:6379->6379/tcp
```

### 7.4 — Setup Laravel (install dependencies + migrate)

```bash
# Install Composer dependencies
docker compose exec php composer install

# Generate application key
docker compose exec php php artisan key:generate

# Jalankan migrasi database
docker compose exec php php artisan migrate

# Jalankan seeder local/staging (data demo)
docker compose exec php php artisan db:seed

# Buat symlink storage
docker compose exec php php artisan storage:link
```

Atau gunakan shortcut Makefile:

```bash
make setup
```

### 7.5 — Buka aplikasi di browser

```
http://localhost:8000
```

Kamu akan melihat halaman login MyPerpus! 🎉

**Akun demo local/staging:**

| Role    | Email                    | Password   |
|---------|--------------------------|------------|
| Admin   | admin@myperpus.id        | password   |
| Petugas | petugas@myperpus.id      | password   |
| Anggota | anggota@myperpus.id      | password   |

> Pada production, ikuti `DEPLOYMENT.md`. Seeder production tidak membuat akun demo dan memakai `ADMIN_EMAIL`/`ADMIN_PASSWORD`.

---

## 8. Koneksi DBeaver ke MySQL

### 8.1 — Buka DBeaver

Cari DBeaver di Application Menu atau jalankan:
```bash
dbeaver &
```

### 8.2 — Buat koneksi baru

1. Klik ikon **"New Database Connection"** (ikon plug + di pojok kiri atas)
2. Atau tekan **Ctrl + Shift + N**
3. Pilih **MySQL** → klik **Next**

### 8.3 — Isi detail koneksi

| Field        | Nilai               |
|--------------|---------------------|
| Server Host  | `localhost`         |
| Port         | `3306`              |
| Database     | `myperpus`          |
| Username     | `myperpus_user`     |
| Password     | `myperpus_pass`     |

> MySQL berjalan di dalam Docker tapi port 3306 sudah di-expose ke host,
> sehingga DBeaver bisa konek via `localhost:3306`.

### 8.4 — Download driver (jika diminta)

Saat pertama kali, DBeaver akan meminta download MySQL JDBC Driver.
Klik **Download** → tunggu selesai → klik **OK**.

### 8.5 — Test koneksi

Klik tombol **"Test Connection"** di bagian bawah dialog.

Jika muncul **"Connected"** → klik **Finish**.

### 8.6 — Eksplorasi database

Di panel kiri DBeaver:
- Expand **myperpus** → **Tables**
- Kamu akan melihat tabel: `users`, `buku`, `kategori`, `peminjaman`, dll.
- Klik kanan tabel → **View Data** untuk melihat isinya.

---

## 9. Workflow Development Sehari-hari

### Mulai kerja (pagi hari)

```bash
cd ~/Projects/myperpus
make up
# Atau: docker compose up -d
```

### Selesai kerja (sore hari)

```bash
make down
# Atau: docker compose down
```

### Edit kode

Kode diedit langsung dari folder `~/Projects/myperpus` menggunakan editor favorit
(VS Code, Neovim, dll). Perubahan langsung terlihat karena folder di-mount ke container.

### Hot Reload Frontend (React/Vite)

Vite HMR berjalan otomatis via container `node`.
Perubahan file `.jsx` / `.css` langsung terlihat di browser tanpa refresh.

```bash
# Jika HMR tidak berjalan, cek log node:
docker compose logs -f node
```

### Menjalankan perintah Artisan

```bash
# Format: docker compose exec php php artisan <perintah>

docker compose exec php php artisan migrate
docker compose exec php php artisan make:model NamaModel -m
docker compose exec php php artisan make:controller NamaController
docker compose exec php php artisan route:list
docker compose exec php php artisan tinker

# Atau gunakan Makefile:
make migrate
make tinker
make routes
make artisan CMD="make:model Buku -m"
```

### Menjalankan Composer

```bash
docker compose exec php composer require nama/package
docker compose exec php composer update

# Via Makefile:
make composer CMD="require nama/package"
```

### Melihat log real-time

```bash
# Semua container
make logs

# Spesifik container
make logs-php
make logs-nginx
make logs-mysql
```

### Reset database (jika perlu)

```bash
make migrate-fresh
# Sama dengan: php artisan migrate:fresh --seed
```

### Cek status & resource

```bash
make ps      # Status container
make stats   # CPU & RAM usage
```

---

## 10. Troubleshooting

### ❌ Port 3306 sudah dipakai

```
Error: Bind for 127.0.0.1:3306 failed: port is already allocated
```

**Solusi:** Hentikan MySQL lokal yang mungkin masih berjalan:

```bash
sudo systemctl stop mysql
sudo systemctl disable mysql
docker compose up -d
```

### ❌ Permission denied pada storage

```
The stream or file ".../storage/logs/laravel.log" could not be opened
```

**Solusi:**

```bash
docker compose exec php chmod -R 775 storage bootstrap/cache
docker compose exec php chown -R www-data:www-data storage bootstrap/cache
```

### ❌ Container mysql tidak sehat (unhealthy)

**Solusi:** Cek log MySQL:

```bash
docker compose logs mysql
```

Jika ada error karena data lama, hapus volume dan mulai ulang:

```bash
docker compose down -v
docker compose up -d
make setup
```

### ❌ Vite/Node HMR tidak bekerja

**Solusi:** Pastikan `vite.config.js` sudah menggunakan konfigurasi Docker (lihat
file `vite.config.js` yang disediakan). Kemudian restart container node:

```bash
docker compose restart node
docker compose logs -f node
```

### ❌ Composer/npm lambat

**Solusi:** Cek koneksi internet container. Jika di belakang proxy perusahaan,
tambahkan konfigurasi proxy di `docker-compose.yml`.

### ❌ `make` tidak ditemukan

```bash
sudo apt install -y make
```

### ❌ DBeaver tidak bisa konek ke MySQL

Pastikan:
1. Container MySQL sedang running: `docker compose ps`
2. Port yang diisi adalah `3306` (bukan `33060`)
3. Host adalah `localhost` (bukan `mysql`)
4. Username & password sesuai dengan yang ada di `.env.docker`

Tes koneksi MySQL dari terminal:

```bash
docker compose exec mysql mysql -u myperpus_user -pmyperpus_pass myperpus -e "SHOW TABLES;"
```

---

## 📌 Referensi Cepat

```bash
# ─── Lifecycle ───────────────────────────────
make up              # Jalankan semua container
make down            # Hentikan semua container
make restart         # Restart semua container
make build           # Build ulang image
make fresh           # Reset total (hapus volume + build ulang)

# ─── Development ─────────────────────────────
make shell           # Masuk shell PHP container
make shell-mysql     # Masuk MySQL CLI
make shell-redis     # Masuk Redis CLI
make logs            # Lihat semua log (Ctrl+C untuk keluar)
make logs-php        # Log PHP saja

# ─── Laravel ─────────────────────────────────
make migrate         # Jalankan migrasi
make migrate-fresh   # Reset + migrasi ulang + seed
make seed            # Seed saja
make tinker          # Laravel Tinker REPL
make cc              # Clear semua cache
make routes          # Lihat daftar route
make test            # Jalankan test

# ─── URL Aplikasi ────────────────────────────
# Web app:   http://localhost:8000
# Vite HMR:  http://localhost:5173
# MySQL:     localhost:3306
# Redis:     localhost:6379
```

---

> 🎉 Setup selesai! MyPerpus siap dikembangkan di Ubuntu dengan Docker.
> Setiap perubahan kode akan langsung terlihat di browser berkat Vite HMR.
