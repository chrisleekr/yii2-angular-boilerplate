# PHP Docker image for Yii 2.0 Framework runtime
# ==============================================

FROM php:7.1.9-fpm-alpine

# Install system packages & PHP extensions required for Yii 2.0 Framework
# virtual pkg names and ENV $PHPIZE_DEPS are definied in base image
# C* and LDFlAGS are also definied in base image, so we use these for our custom pecl builds
# we install (newer) imagick from edge repo due to SEGFAULT bugs
# hopefully this won't break other things...
RUN apk add --no-cache --virtual .phpize-deps $PHPIZE_DEPS && \
    apk add --no-cache --virtual .imagemagick-edge \
            --repository http://dl-3.alpinelinux.org/alpine/v3.6/main/ \
            --allow-untrusted \
        imagemagick \
        imagemagick-dev && \
    apk add --update --virtual .pecl-build-deps \
        icu-dev \
        curl-dev \
        freetype-dev \
        pcre-dev \
        postgresql-dev \
        libtool \
        libmcrypt-dev \
        libjpeg-turbo-dev \
        libpng-dev \
        libxml2-dev && \
    apk add --no-cache --virtual .build-dependencies $PHPIZE_DEPS \
        zlib-dev \
        cyrus-sasl-dev \
        g++ \
        libtool \
        make \
        pcre-dev && \
    apk add \
        git \
        curl \
        bash \
        bash-completion \
        icu \
        pcre \
        freetype \
        libmcrypt \
        libintl \
        libjpeg-turbo \
        imagemagick \
        libpng \
        libltdl \
        libxml2 \
        mysql-client \
        nodejs \
        postgresql-client \
        libmemcached-dev && \
    export CFLAGS="$PHP_CFLAGS" CPPFLAGS="$PHP_CPPFLAGS" LDFLAGS="$PHP_LDFLAGS" && \
    pecl install \
        apcu \
        imagick-3.4.3 \
        xdebug \
        memcached && \
    docker-php-ext-enable imagick && \
    docker-php-ext-enable apcu && \
    docker-php-ext-enable memcached && \
    docker-php-ext-configure gd \
        --with-gd \
        --with-freetype-dir=/usr/include/ \
        --with-png-dir=/usr/include/ \
        --with-jpeg-dir=/usr/include/ && \
    docker-php-ext-configure bcmath && \
    docker-php-ext-install \
        soap \
        mcrypt \
        zip \
        curl \
        bcmath \
        exif \
        gd \
        iconv \
        intl \
        mbstring \
        opcache \
        pdo_mysql \
        pdo_pgsql && \
    apk del \
        .pecl-build-deps .phpize-deps


# Configure version constraints
ENV VERSION_COMPOSER_ASSET_PLUGIN=^1.4.2 \
    VERSION_PRESTISSIMO_PLUGIN=^0.3.7 \
    PATH=/app:/app/vendor/bin:/root/.composer/vendor/bin:$PATH \
    TERM=linux \
    COMPOSER_ALLOW_SUPERUSER=1

# Add configuration files
COPY image-files/ /

# Add GITHUB_API_TOKEN support for composer

RUN chmod 700 \
        /usr/local/bin/docker-entrypoint.sh \
        /usr/local/bin/composer

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- \
        --filename=composer.phar \
        --install-dir=/usr/local/bin && \
    composer global require --optimize-autoloader \
        "fxp/composer-asset-plugin:${VERSION_COMPOSER_ASSET_PLUGIN}" \
        "hirak/prestissimo:${VERSION_PRESTISSIMO_PLUGIN}" && \
    composer global dumpautoload --optimize && \
    composer clear-cache

# Install nginx
RUN apk --update add nginx

WORKDIR /srv

COPY composer.* /srv/
RUN /usr/local/bin/composer install --prefer-dist
ENV PATH /srv/vendor/bin:${PATH}

COPY . /srv/
RUN chown -R www-data:www-data /srv/ \
    && chmod 777 -R /srv/runtime

EXPOSE 80
CMD ["docker-entrypoint.sh"]
