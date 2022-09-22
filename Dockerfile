FROM node:18-alpine AS build

COPY package*.json /build/flux-js-lint/
RUN (cd /build/flux-js-lint && npm ci --omit=dev)

COPY . /build/flux-js-lint

FROM node:18-alpine

RUN ln -s /flux-js-lint/bin/flux-js-lint.mjs /usr/bin/flux-js-lint

USER node:node

ENTRYPOINT []

COPY --from=build /build /

ARG COMMIT_SHA
LABEL org.opencontainers.image.revision="$COMMIT_SHA"
