# FROM node:alpine AS base
FROM mhart/alpine-node AS base

EXPOSE 5000
RUN mkdir -p /usr/src/app/dist
WORKDIR /usr/src/app
ENTRYPOINT [ "node" ]
CMD [ "server" ]

# Install updates
RUN apk update && \
    apk upgrade && \
    apk add git python make g++ bash

COPY package.json \
     package-lock.json \
     /usr/src/app/

# Install dependencies
FROM base AS build
RUN npm install

# Bundle app
FROM base
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY webpack.config.js /usr/src/app/webpack.config.js
COPY scripts /usr/src/app/scripts
COPY server /usr/src/app/server
COPY webapp /usr/src/app/webapp
