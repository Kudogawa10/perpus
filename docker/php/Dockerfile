FROM php:8.4-fpm-alpine

LABEL maintainer="MyPerpus Dev Team"
LABEL description="PHP 8.4 FPM runtime for local Laravel development"

ARG UID=1000
ARG GID=1000

RUN apk add --no-cache \
    autoconf \
    gcc \
    g++ \
    make \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    freetype-dev \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    libxml2-dev \
    curl-dev \
    mysql-client \
    git \
    curl \
    unzip \
    bash \
    file \
    nodejs \
    npm \
    shadow

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
        sockets \
        pcntl

RUN yes '' | pecl install redis \
    && docker-php-ext-enable redis

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN addgroup -g "${GID}" -S laravel \
    && adduser -u "${UID}" -S laravel -G laravel \
    && sed -i 's/^user = .*/user = laravel/' /usr/local/etc/php-fpm.d/www.conf \
    && sed -i 's/^group = .*/group = laravel/' /usr/local/etc/php-fpm.d/www.conf

WORKDIR /var/www/html

COPY entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

EXPOSE 9000

ENTRYPOINT ["docker-entrypoint"]
CMD ["php-fpm"]
