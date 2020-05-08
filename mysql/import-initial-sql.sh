#!/bin/bash

set -e

BASEDIR=$(dirname "$0")

# shellcheck disable=SC1091
source "$BASEDIR/.env"

if [ "$IS_DOCKER" = true ]; then
    docker exec mysql mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USERNAME" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" < "$BASEDIR/sql/initial.sql"
else
    mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USERNAME" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" < "$BASEDIR/sql/initial.sql"
fi



