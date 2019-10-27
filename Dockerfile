FROM node:alpine as build

# greet me :)
LABEL maintainer="Tobias Rös - <roes@amicaldo.de>"

COPY . /usr/src/app
WORKDIR /usr/src/app
# install dependencies
RUN npm install -g yarn && yarn install

# nginx
FROM openresty/openresty:alpine

ENV CRONJOB_ITERATION=15

WORKDIR /var/www/html
COPY --from=build /usr/src/app /var/www/html

# install vhost config
COPY config/vhost.conf /etc/nginx/conf.d/default.conf
COPY config/nginxEnv.conf /etc/nginx/modules/nginxEnv.conf

# install packages
RUN apk update && apk add \
  nginx-mod-http-lua \
  python3 \
  py-pip \
  && rm -rf /var/lib/apt/lists/*

RUN pip install speedtest-cli

RUN chmod +x /var/www/html/config/run.sh
RUN /var/www/html/config/run.sh