FROM php:8.0.7-apache

RUN requirements="nano mariadb-client libwebp-dev libxpm-dev libmcrypt-dev libmcrypt4 libcurl3-dev libxml2-dev \
    libmemcached-dev zlib1g-dev libc6 libstdc++6 libkrb5-3 openssl debconf libfreetype6-dev libjpeg-dev libtiff-dev \
    libpng-dev git imagemagick libmagickwand-dev ghostscript gsfonts libbz2-dev libonig-dev libzip-dev zip unzip" \
    && apt-get update && apt-get install -y --no-install-recommends $requirements && apt-get clean && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install mysqli \
    pdo_mysql \
    iconv  \
    gd  \
    mbstring \
    soap  \
    exif \
    opcache \
    && pecl install apcu \
    xdebug \
    imagick \
    memcached \
    && docker-php-ext-enable memcached \
    xdebug \
    imagick \
    apcu \
    opcache

# Configure version constraints
ENV VERSION_COMPOSER_ASSET_PLUGIN=^1.4.6 \
    VERSION_PRESTISSIMO_PLUGIN=^0.3.7 \
    PATH=/srv:/srv/vendor/bin:/root/.composer/vendor/bin:$PATH \
    TERM=linux \
    COMPOSER_ALLOW_SUPERUSER=1

RUN a2enmod headers && \
    a2enmod rewrite

# Add configuration files
COPY image-files/ /

# Add GITHUB_API_TOKEN support for composer

RUN chmod 700 \
    /usr/local/bin/docker-entrypoint.sh \
    /usr/local/bin/composer

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- \
    # FIXME: Composer 2.0.0 is not compatible with fxp/composer-asset-plugin for now. Set version until it is fixed.
    # --version=1.10.22 \
    --filename=composer.phar \
    --install-dir=/usr/local/bin
# composer global require --optimize-autoloader \
# "fxp/composer-asset-plugin:${VERSION_COMPOSER_ASSET_PLUGIN}" && \
# "hirak/prestissimo:${VERSION_PRESTISSIMO_PLUGIN}" && \
# composer global dumpautoload --optimize && \
# composer clear-cache

WORKDIR /srv

COPY composer.* /srv/
RUN composer install --prefer-dist
ENV PATH /srv/vendor/bin:${PATH}

COPY . /srv/

RUN mkdir /srv/runtime \
    && chmod 777 -R /srv/runtime \
    && mkdir /srv/web/assets \
    && chmod 777 -R /srv/web/assets \
    && chown -R www-data:www-data /srv/

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

CMD ["apache2-foreground"]
