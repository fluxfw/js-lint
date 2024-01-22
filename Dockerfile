FROM alpine:3.19 AS build

RUN apk upgrade --no-cache && \
    apk add --no-cache nodejs npm

COPY bin/install-libraries.sh /build/flux-js-lint/bin/install-libraries.sh
RUN /build/flux-js-lint/bin/install-libraries.sh

COPY . /build/flux-js-lint

RUN /build/flux-js-lint/bin/build.mjs

FROM alpine:3.19

RUN apk upgrade --no-cache && \
    apk add --no-cache nodejs

ENTRYPOINT ["flux-js-lint"]

COPY --from=build /build/flux-js-lint/build /
