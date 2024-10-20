# Use the Dockerfile syntax for BuildKit support (Docker 18.09+)
# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.9.0

# Base image for Node.js environment
FROM node:${NODE_VERSION}-alpine as base

WORKDIR /client

# Install production dependencies
FROM base as deps

# Use --mount to cache npm files and bind package.json files
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Build the application
FROM deps as build

# Bind package.json and package-lock.json and use the cache
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npm run build

FROM nginx:alpine as final

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./ssl/client.cert /etc/nginx/ssl/client.cert
COPY ./ssl/client.key /etc/nginx/ssl/client.key

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY --from=build /client/dist .

EXPOSE 8443

ENTRYPOINT ["nginx", "-g", "daemon off;"]
