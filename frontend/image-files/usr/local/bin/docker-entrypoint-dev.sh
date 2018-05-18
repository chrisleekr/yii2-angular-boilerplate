#!/bin/sh

printf "Starting nginx...\n\n"
nginx -g "daemon on;"

printf "Building and watching app...\n\n"
npm run build -- --watch --poll=1000 --output-path=/srv
