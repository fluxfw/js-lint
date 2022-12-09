FROM node:19-alpine AS build

COPY package*.json /build/flux-js-lint/libs/flux-js-lint/
COPY bin/install-libraries.sh /build/flux-js-lint/libs/flux-js-lint/bin/install-libraries.sh
RUN /build/flux-js-lint/libs/flux-js-lint/bin/install-libraries.sh

RUN ln -s libs/flux-js-lint/bin /build/flux-js-lint/bin

COPY . /build/flux-js-lint/libs/flux-js-lint

FROM node:19-alpine

RUN ln -s /flux-js-lint/bin/flux-js-lint.mjs /usr/bin/flux-js-lint

USER node:node

ENTRYPOINT []

COPY --from=build /build /

ARG COMMIT_SHA
LABEL org.opencontainers.image.revision="$COMMIT_SHA"
