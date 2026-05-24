#!/usr/bin/env sh
set -eu

cd /var/www/html

if [ ! -f .env ] && [ -f .env.docker ]; then
    cp .env.docker .env
fi

mkdir -p \
    storage/app/public \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/testing \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

chmod -R ug+rwX storage bootstrap/cache 2>/dev/null || true

install_composer_dependencies() {
    if [ -f vendor/autoload.php ]; then
        return
    fi

    lock_dir="/tmp/myperpus-composer-install.lock"

    while ! mkdir "$lock_dir" 2>/dev/null; do
        if [ -f vendor/autoload.php ]; then
            return
        fi
        echo "Waiting for Composer install to finish in another container..."
        sleep 2
    done

    trap 'rmdir "$lock_dir" 2>/dev/null || true' EXIT

    if [ ! -f vendor/autoload.php ]; then
        composer install --no-interaction --prefer-dist
    fi
}

if [ -f composer.json ]; then
    install_composer_dependencies
fi

if [ -f artisan ]; then
    if [ -f .env ] && ! grep -q '^APP_KEY=base64:' .env; then
        php artisan key:generate --force --no-interaction || true
    fi

    php artisan storage:link --force >/dev/null 2>&1 || true
fi

exec "$@"
