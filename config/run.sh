#!/usr/bin/env bash
echo "Installing Cronjob"
crond -l 2 -f &

echo "Starting nginx"
exec nginx -g "daemon off;"

exit 0;