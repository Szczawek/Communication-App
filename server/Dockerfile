FROM node:22.9.0-alpine as build

WORKDIR /src/app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci 
    
USER node

COPY . .

FROM node:22.9.0-alpine as production

WORKDIR /src/app

COPY --from=build /src/app /src/app

EXPOSE 443

CMD node server.js
