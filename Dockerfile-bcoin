FROM nfnty/arch-mini:latest AS base

RUN mkdir -p /code/node_modules/bcoin /data
WORKDIR /code

RUN pacman -Sy --noconfirm archlinux-keyring && \
    pacman -Syu --noconfirm nodejs-lts-carbon npm && \
    rm /var/cache/pacman/pkg/*

FROM base AS build

# Install build dependencies
# Note: node-gyp needs python
RUN pacman -Syu --noconfirm base-devel unrar git python2 \
    && ln -s /usr/bin/python2 /usr/bin/python

ARG repo=bpanel-org/bcoin#experimental

# use this to bust the build cache
ARG rebuild=0

# Install bcoin, bmultisig, blgr, bclient
RUN npm init -y &>/dev/null \
  && npm install $repo \
  bcoin-org/bmultisig \
  bcoin-org/blgr \
  bcoin-org/bclient

# TODO: Inherit from official image
FROM base

COPY --from=build /code/node_modules /code/node_modules
COPY ./scripts/ /code/scripts

ENTRYPOINT [ "node" ]

# In order to have some predictability w/ docker instances
# set the prefix via args to avoid any unexpected inconsistencies
CMD ["/code/scripts/bcoin-init.js", "--prefix=/data"]
