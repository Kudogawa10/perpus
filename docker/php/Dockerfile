###############################################################
#  MyPerpus — PHP 8.4 FPM Image
#  Base: php:8.4-fpm-alpine
###############################################################

FROM php:8.4-fpm-alpine

LABEL maintainer="MyPerpus Dev Team"
LABEL description="PHP 8.4 FPM for MyPerpus Laravel Application"

# ── System dependencies ──────────────────────────────────────
RUN apk add --no-cache \
    # Build tools
    autoconf \
    gcc \
    g++ \
    make \
    # Libraries
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    freetype-dev \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    libxml2-dev \
    curl-dev \
    # Tools
    git \
    curl \
    unzip \
    bash \
    file \
    # Node.js (untuk build jika perlu)
    nodejs \
    npm

# ── PHP Extensions ───────────────────────────────────────────
# Beberapa extension seperti pdo, tokenizer, dan fileinfo sudah tersedia
# di build PHP resmi, jadi tidak perlu di-install ulang.
RUN docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
        --with-webp \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        mysqli \
        gd \
        zip \
        intl \
        bcmath \
        mbstring \
        xml \
        exif \
        opcache \
        pcntl

# ── Redis extension (via PECL) ───────────────────────────────
RUN yes '' | pecl install redis \
    && docker-php-ext-enable redis

# ── Composer 2 ───────────────────────────────────────────────
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ── Create www-data user group ───────────────────────────────
RUN addgroup -g 1000 -S www-data 2>/dev/null || true \
    && adduser -u 1000 -S www-data -G www-data 2>/dev/null || true

# ── Work directory ────────────────────────────────────────────
WORKDIR /var/www/html

# ── Set permissions ───────────────────────────────────────────
RUN chown -R www-data:www-data /var/www/html

# ── Expose FPM port ───────────────────────────────────────────
EXPOSE 9000

CMD ["php-fpm"]
