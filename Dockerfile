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
RUN apk update && \
    apk upgrade && \
    apk add git python make g++ bash && \
    npm install -g npm@$NPM_VERSION

COPY package.json \
     package-lock.json \
     /usr/src/app/

# Install dependencies
FROM base AS build
RUN echo npm version $(npm --version)
RUN npm install

# Bundle app
FROM base
RUN echo npm version $(npm --version)
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY webpack.config.js /usr/src/app/webpack.config.js
COPY scripts /usr/src/app/scripts
COPY server /usr/src/app/server
COPY webapp /usr/src/app/webapp

