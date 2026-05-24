#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html

export APP_ENV="${APP_ENV:-production}"
export APP_DEBUG="${APP_DEBUG:-false}"
export LOG_CHANNEL="${LOG_CHANNEL:-stderr}"
export LOG_LEVEL="${LOG_LEVEL:-warning}"
export DB_CONNECTION="${DB_CONNECTION:-mysql}"
export REDIS_CLIENT="${REDIS_CLIENT:-predis}"

# Railway service references expose MYSQL_URL; Laravel can consume DATABASE_URL.
if [ -z "${DATABASE_URL:-}" ] && [ -n "${MYSQL_URL:-}" ]; then
  export DATABASE_URL="$MYSQL_URL"
fi

# Railway MySQL vars use names without underscores. Map them to Laravel DB_*.
if [ -n "${MYSQLHOST:-}" ]; then export DB_HOST="$MYSQLHOST"; fi
if [ -n "${MYSQLPORT:-}" ]; then export DB_PORT="$MYSQLPORT"; fi
if [ -n "${MYSQLDATABASE:-}" ]; then export DB_DATABASE="$MYSQLDATABASE"; fi
if [ -n "${MYSQLUSER:-}" ]; then export DB_USERNAME="$MYSQLUSER"; fi
if [ -n "${MYSQLPASSWORD:-}" ]; then export DB_PASSWORD="$MYSQLPASSWORD"; fi

# If only DATABASE_URL/MYSQL_URL is provided, parse it into DB_* for readiness checks.
if [ -n "${DATABASE_URL:-}" ] && { [ -z "${DB_HOST:-}" ] || [ -z "${DB_DATABASE:-}" ] || [ -z "${DB_USERNAME:-}" ]; }; then
  echo "Parsing DATABASE_URL into missing DB_* env vars..."
  eval "$(
    php <<'PHP'
<?php
$url = getenv('DATABASE_URL') ?: getenv('MYSQL_URL');
$parts = $url ? parse_url($url) : false;

if (! $parts) {
    exit(0);
}

$values = [
    'DB_HOST' => $parts['host'] ?? null,
    'DB_PORT' => isset($parts['port']) ? (string) $parts['port'] : null,
    'DB_USERNAME' => isset($parts['user']) ? rawurldecode($parts['user']) : null,
    'DB_PASSWORD' => isset($parts['pass']) ? rawurldecode($parts['pass']) : null,
    'DB_DATABASE' => isset($parts['path']) ? ltrim(rawurldecode($parts['path']), '/') : null,
];

foreach ($values as $key => $value) {
    if ($value === null || $value === '') {
        continue;
    }

    $current = getenv($key);
    if ($current !== false && $current !== '') {
        continue;
    }

    echo 'export '.$key.'='.escapeshellarg($value).PHP_EOL;
}
PHP
  )"
fi

export DB_HOST="${DB_HOST:-127.0.0.1}"
export DB_PORT="${DB_PORT:-3306}"
export DB_DATABASE="${DB_DATABASE:-railway}"
export DB_USERNAME="${DB_USERNAME:-root}"
export DB_PASSWORD="${DB_PASSWORD:-}"

# Railway Redis vars also use names without underscores. Map them for Laravel.
if [ -n "${REDISHOST:-}" ]; then export REDIS_HOST="$REDISHOST"; fi
if [ -n "${REDISUSER:-}" ]; then export REDIS_USERNAME="$REDISUSER"; fi
if [ -n "${REDISPORT:-}" ]; then export REDIS_PORT="$REDISPORT"; fi
if [ -n "${REDISPASSWORD:-}" ]; then export REDIS_PASSWORD="$REDISPASSWORD"; fi

# Generate APP_KEY if missing or invalid in production
app_key="${APP_KEY:-}"
if [ "$APP_ENV" = "production" ] && { [ -z "$app_key" ] || [ "${app_key:0:7}" != "base64:" ] || [ ${#app_key} -ne 51 ]; }; then
  echo "APP_KEY invalid or missing, generating new one..."
  export APP_KEY=$(php artisan key:generate --show --no-interaction --quiet)
  echo "APP_KEY generated for this deployment. Set APP_KEY in Railway Variables to persist it."
fi

# Ensure vendor exists (composer install was run in builder, but be resilient)
if [ ! -d vendor ] || [ ! -f vendor/autoload.php ]; then
  composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist
fi

# Ensure directories and permissions
mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache || true

# Optionally run migrations if the environment variable is set
if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
  echo "RUN_MIGRATIONS=true - checking environment..."
  echo "DB: $DB_HOST:$DB_PORT/$DB_DATABASE"

  if ! php -r "exit(extension_loaded('pdo_mysql') ? 0 : 1);" >/dev/null 2>&1; then
    echo "pdo_mysql extension not loaded. Cannot run migrations." >&2
    exit 1
  fi

  DB_RETRIES="${DB_RETRIES:-60}"
  i=0
  echo "Waiting for database ${DB_HOST}:${DB_PORT} (timeout ${DB_RETRIES}s)"
  while ! php -r '
    $host = getenv("DB_HOST");
    $port = getenv("DB_PORT") ?: "3306";
    $database = getenv("DB_DATABASE");
    $username = getenv("DB_USERNAME") ?: null;
    $password = getenv("DB_PASSWORD") ?: null;
    $dsn = sprintf("mysql:host=%s;port=%s;dbname=%s", $host, $port, $database);

    try {
        new PDO($dsn, $username, $password);
        exit(0);
    } catch (Throwable $e) {
        exit(1);
    }
  ' >/dev/null 2>&1; do
    i=$((i+1))
    if [ "$i" -ge "$DB_RETRIES" ]; then
      echo "Timed out waiting for database. Aborting startup." >&2
      exit 1
    fi
    sleep 1
  done

  echo "Database available - running migrations"
  if [ "${MIGRATE_FRESH:-false}" = "true" ]; then
    echo "MIGRATE_FRESH=true - running migrate:fresh (will drop all tables)"
    php artisan migrate:fresh --force
  else
    php artisan migrate --force
  fi

  if [ "${RUN_SEEDERS:-true}" = "true" ]; then
    php artisan db:seed --force
  fi
fi

# Optimize caches for production when APP_ENV=production
if [ "$APP_ENV" = "production" ]; then
  php artisan config:cache
  php artisan route:cache
  php artisan view:cache
fi

# Create storage symlink if not present
if [ ! -L public/storage ]; then
  php artisan storage:link || true
fi

# Start the Laravel development server (bind to $PORT for Railway)
echo "Starting Laravel on 0.0.0.0:${PORT:-8080}"
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8080}"
