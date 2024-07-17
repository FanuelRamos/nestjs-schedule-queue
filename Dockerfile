FROM node:18-alpine3.19

USER root

WORKDIR /home/root/app

COPY . .

RUN npm install -g @nestjs/cli@10.0.0

