FROM mhart/alpine-node:latest AS base

# update npm
ARG NPM_VERSION=6.0.1
RUN npm install -g npm@$NPM_VERSION

WORKDIR /usr/src/app

# install updates
RUN apk update && \
    apk upgrade && \
    apk add git python make g++ bash

COPY package.json \
     package-lock.json \
     /usr/src/app/

# install dependencies
FROM base AS build
RUN npm install

# bundle app
FROM base

RUN mkdir -p /usr/src/app/dist

COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY webpack.config.js /usr/src/app/webpack.config.js
COPY scripts /usr/src/app/scripts
COPY server /usr/src/app/server
COPY webapp /usr/src/app/webapp

ENTRYPOINT [ "node" ]
CMD [ "server" ]
EXPOSE 5000
