#!/bin/sh

set -xe

nginx -g "daemon on;"

npm run build -- --watch --poll=1000 --output-path=/srv
