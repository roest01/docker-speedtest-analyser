FROM alpine

# greet me :)
MAINTAINER Tobias Rös - <roes@amicaldo.de>

# install dependencies
RUN apk update && apk add \
  bash \
  git \
  nodejs \
  nginx \
  python \
  py-pip


RUN pip install speedtest-cli

# remove default content
RUN rm -R /var/www/*

# create directory structure
RUN mkdir -p /etc/nginx
RUN mkdir -p /run/nginx
RUN mkdir -p /etc/nginx/global
RUN mkdir -p /var/www/html

# touch required files
RUN touch /var/log/nginx/access.log && touch /var/log/nginx/error.log

# install vhost config
ADD ./config/vhost.conf /etc/nginx/conf.d/default.conf

# prepare run script which start webserver and cronjobs
ADD ./config/run.sh /tmp/run.sh
RUN chmod +x /tmp/run.sh

# install webroot files
ADD ./ /var/www/html/

# install bower dependencies
RUN npm install -g bower && cd /var/www/html/ && bower install --quiet

# activate cronjob
RUN crontab /var/www/html/config/crontab

# run first speedtest
RUN cd /var/www/html/scripts && ./speedtest.py

EXPOSE 80
EXPOSE 443

CMD /tmp/run.sh