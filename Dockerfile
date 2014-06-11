FROM ubuntu:latest
MAINTAINER Jean-Baptiste "Faltad" Poupon, faltad@gmail.com


RUN apt-get update

RUN apt-get -y install nodejs

ADD . ./

EXPOSE 8888

CMD ["nodejs", "index.js"]
