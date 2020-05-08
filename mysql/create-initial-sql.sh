#!/bin/bash

set -e

BASEDIR=$(dirname "$0")

# shellcheck disable=SC1091
source "$BASEDIR/.env"

echo "MYSQL_HOST: $MYSQL_HOST"
echo "MYSQL_PORT: $MYSQL_PORT"

if [ "$IS_DOCKER" = true ]; then
    echo "Mode: docker"
    docker exec mysql mysqldump -h"$MYSQL_HOST" -P$MYSQL_PORT -u"$MYSQL_USERNAME" -p"$MYSQL_PASSWORD" --databases "$MYSQL_DATABASE" > "$BASEDIR/sql/initial.sql"
else
    echo "Mode: bash"
    mysqldump -h"$MYSQL_HOST" -P$MYSQL_PORT -u"$MYSQL_USERNAME" -p"$MYSQL_PASSWORD" --databases "$MYSQL_DATABASE" > "$BASEDIR/sql/initial.sql"
fi