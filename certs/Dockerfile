FROM ubuntu:16.04

# TODO: split apart to optimize smaller build
RUN apt-get update \
  && apt-get install -y wget make libtext-template-perl perl gcc curl dnsutils \
  && cd /usr/src \
  && wget https://www.openssl.org/source/openssl-1.0.2-latest.tar.gz \
  && tar -zxf openssl-1.0.2-latest.tar.gz \
  && cd `ls | grep -v tar.gz` \
  && ./config \
  && make \
  && make test \
  && make install

# copy the scripts to the appropriate directory
COPY scripts /opt/securityc

CMD ["/bin/bash"]

