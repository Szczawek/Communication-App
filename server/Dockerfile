# syntax=docker/dockerfile:1

FROM node:22.3.0-alpine

WORKDIR /src/app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci 
    
USER node

COPY . .

EXPOSE 443

CMD node server.js
