ARG NODE_VERSION=22.9.0

FROM node:22.9.0-alpine

WORKDIR /usr/src/server

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

USER node

COPY . .

CMD npm start
