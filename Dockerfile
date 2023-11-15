FROM alpine:3.18 AS base

RUN apk upgrade --no-cache

RUN apk add --no-cache nodejs-current

RUN addgroup -S -g 1000 node && adduser -S -u 1000 -D -G node node

FROM base AS build

RUN apk add --no-cache npm

COPY bin/install-libraries.sh /build/opt/flux-js-lint/libs/flux-js-lint/bin/install-libraries.sh
RUN /build/opt/flux-js-lint/libs/flux-js-lint/bin/install-libraries.sh

RUN ln -s libs/flux-js-lint/bin /build/opt/flux-js-lint/bin

COPY . /build/opt/flux-js-lint/libs/flux-js-lint

RUN unlink /build/opt/flux-js-lint/bin/install-libraries.sh

RUN mkdir -p /build/usr/local/bin && (cd /build/opt/flux-js-lint/bin/PATH && for bin in *; do ln -s "../../../opt/flux-js-lint/bin/PATH/$bin" "/build/usr/local/bin/$bin"; done)

FROM base

USER node:node

ENTRYPOINT ["flux-js-lint"]

COPY --from=build /build /
