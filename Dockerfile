FROM alpine:3.18 AS base

RUN apk upgrade --no-cache

RUN apk add --no-cache nodejs-current

RUN addgroup -S -g 1000 node && adduser -S -u 1000 -D -G node node

FROM base AS build

RUN apk add --no-cache npm

COPY bin/install-libraries.sh /build/flux-js-lint/bin/install-libraries.sh
RUN /build/flux-js-lint/bin/install-libraries.sh

COPY . /build/flux-js-lint

RUN /build/flux-js-lint/bin/build.mjs

FROM base

USER node:node

ENTRYPOINT ["flux-js-lint"]

COPY --from=build /build/flux-js-lint/build /
