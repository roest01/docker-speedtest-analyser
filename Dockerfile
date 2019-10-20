FROM node:alpine as build

# greet me :)
LABEL maintainer="Tobias Rös - <roes@amicaldo.de>"

COPY . /usr/src/app
WORKDIR /usr/src/app
# install dependencies
RUN npm install -g yarn && yarn install

# nginx
FROM nginx:alpine

WORKDIR /usr/src/app
COPY --from=build /usr/src/app /usr/src/app

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

RUN chmod +x /usr/src/app/config/run.sh
ENTRYPOINT ["/usr/src/app/config/run.sh"]