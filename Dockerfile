FROM node:19-alpine AS build

COPY package*.json /build/flux-js-lint/
COPY bin/install-dependencies.sh /build/flux-js-lint/bin/install-dependencies.sh
RUN (cd /build/flux-js-lint && npm ci --omit=dev && rm -rf bin)

RUN ln -s node_modules/flux-js-lint/bin /build/flux-js-lint/bin

COPY . /build/flux-js-lint/node_modules/flux-js-lint

FROM node:19-alpine

RUN ln -s /flux-js-lint/bin/flux-js-lint.mjs /usr/bin/flux-js-lint

USER node:node

ENTRYPOINT []

COPY --from=build /build /

ARG COMMIT_SHA
LABEL org.opencontainers.image.revision="$COMMIT_SHA"
