#!sh
echo "Starting run.sh"

cat /var/www/html/config/crontab.default > /var/www/html/config/crontab

if [[ ${CRONJOB_ITERATION} ]]; then
    sed -i -e "s/0/*\/${CRONJOB_ITERATION}/g" /var/www/html/config/crontab
fi
crontab /var/www/html/config/crontab

echo "Starting Cronjob"
crond -l 2 -f &

exit 0;