# FROM node:alpine AS base
FROM mhart/alpine-node:latest AS base

# temporarily use this fork of node:alpine
# because it has a newer version of npm
# temporarily update npm manually
# because of bug introduced in npm 6.0.0

EXPOSE 5000
RUN mkdir -p /usr/src/app/dist

WORKDIR /usr/src/app

ENTRYPOINT [ "node" ]
CMD [ "server" ]

ARG NPM_VERSION=6.3.0

# Install updates
RUN apk upgrade --no-cache && \
    apk add --no-cache git python make g++ bash && \
    npm install -g npm@$NPM_VERSION

# install dependencies for node-hid
RUN apk add --no-cache linux-headers eudev-dev libusb-dev
# install handshake deps
RUN apk add --no-cache unbound-dev

COPY package.json \
     package-lock.json \
     /usr/src/app/

# Install dependencies
FROM base AS build

# dont run preinstall scripts here
# by omitting --unsafe-perm
RUN npm install

# this is a grandchild dependency of hsd that gets skipped for some reason
# and needs to be installed manually
RUN npm install budp

# Bundle app
FROM base
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY pkg.js /usr/src/app/pkg.js
COPY vendor /usr/src/app/vendor
COPY scripts /usr/src/app/scripts
COPY configs /usr/src/app/configs
COPY server /usr/src/app/server
COPY webapp /usr/src/app/webapp
RUN npm run build:dll && \
    npm run preinstall --unsafe-perm && \
    touch /root/.bpanel/clients/_docker.conf
