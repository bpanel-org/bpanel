FROM node:alpine
EXPOSE 5000
WORKDIR /usr/src/app

# Install dependencies
RUN apk update && \
    apk upgrade
# RUN apk add git python make g++

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY package.json /usr/src/app/
RUN npm install && npm cache verify
RUN mkdir /usr/src/app/dist
COPY server /usr/src/app/server
COPY webapp /usr/src/app/webapp
COPY .babelrc /usr/src/app/.babelrc
COPY webpack.config.js /usr/src/app/webpack.config.js

RUN npm run build

CMD [ "npm", "start" ]

