FROM alpine:3.19 AS build

RUN apk upgrade --no-cache && \
    apk add --no-cache nodejs npm

COPY bin/install-libraries.sh /build/js-lint/bin/install-libraries.sh
RUN /build/js-lint/bin/install-libraries.sh

COPY . /build/js-lint

RUN /build/js-lint/bin/build.mjs

FROM alpine:3.19

RUN apk upgrade --no-cache && \
    apk add --no-cache nodejs

ENTRYPOINT ["js-lint"]

COPY --from=build /build/js-lint/build /
