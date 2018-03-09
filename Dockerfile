FROM node:alpine AS base

EXPOSE 5000
RUN mkdir -p /usr/src/app/dist
WORKDIR /usr/src/app
ENTRYPOINT [ "npm", "run" ]
CMD [ "start:docker" ]

# Install updates
RUN apk update && \
    apk upgrade

COPY package.json \
     package-lock.json \
     /usr/src/app/

# Install dependencies
FROM base AS build
RUN apk add git python make g++ bash
RUN npm install

# Bundle app
FROM base
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY server /usr/src/app/server
COPY webapp /usr/src/app/webapp
COPY scripts /usr/src/app/scripts
COPY webpack.config.js /usr/src/app/webpack.config.js
