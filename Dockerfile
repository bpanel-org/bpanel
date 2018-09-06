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

ARG NPM_VERSION=6.0.1

# Install updates
RUN apk upgrade --no-cache && \
    apk add --no-cache git python make g++ bash && \
    npm install -g npm@$NPM_VERSION

COPY package.json \
     package-lock.json \
     /usr/src/app/

# Install dependencies
FROM base AS build
# install dependencies for node-hid
RUN apk add --no-cache linux-headers eudev-dev libusb-dev
RUN npm install

# Bundle app
FROM base
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY configs /usr/src/app/configs
COPY scripts /usr/src/app/scripts
COPY server /usr/src/app/server
COPY webapp /usr/src/app/webapp
