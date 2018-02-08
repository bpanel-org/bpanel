FROM node:alpine
EXPOSE 5000
WORKDIR /usr/src/app

# Install dependencies
RUN apk update && \
    apk upgrade

RUN apk add git python make g++

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY package.json /usr/src/app/
# Since some packages are private
# Need to just copy from local build
# Until they're available
# RUN npm install && npm cache verify
COPY node_modules /usr/src/app/node_modules
RUN mkdir /usr/src/app/dist
COPY server /usr/src/app/server
COPY webapp /usr/src/app/webapp
COPY webpack.config.js /usr/src/app/webpack.config.js
COPY scripts /usr/src/app/scripts

CMD [ "npm", "start" ]
