FROM nfnty/arch-mini:latest AS base

RUN mkdir -p /code/node_modules/bcoin /data
WORKDIR /code/node_modules/bcoin
ENTRYPOINT ["node"]
CMD ["/code/scripts/docker-bcoin-init.js"]

RUN pacman -Sy --noconfirm archlinux-keyring && \
    pacman -Syu --noconfirm nodejs npm && \
    rm /var/cache/pacman/pkg/*

FROM base AS build
# Install build dependencies
RUN pacman -Syu --noconfirm base-devel unrar git python2
#HACK: Node-gyp needs python
RUN ln -s /usr/bin/python2 /usr/bin/python

ARG repo=https://github.com/c4yt/bcoin.git
ARG branch=master
#HACK: Dingle this to trigger rebuilds
ARG rebuild=0

# Install bcoin
RUN git clone --branch $branch $repo /code/node_modules/bcoin
RUN npm install --production

#TODO: Inherit from official image
FROM base
COPY --from=build /code/node_modules/bcoin /code/node_modules/bcoin
COPY ./scripts/ /code/scripts
