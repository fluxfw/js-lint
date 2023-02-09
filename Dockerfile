FROM node:19-alpine AS build

COPY package*.json /build/flux-js-lint/libs/flux-js-lint/
COPY bin/install-libraries.sh /build/flux-js-lint/libs/flux-js-lint/bin/install-libraries.sh
RUN /build/flux-js-lint/libs/flux-js-lint/bin/install-libraries.sh

RUN ln -s libs/flux-js-lint/bin /build/flux-js-lint/bin

COPY . /build/flux-js-lint/libs/flux-js-lint

RUN mkdir -p /build/flux-js-lint/.local/bin && for bin in /build/flux-js-lint/bin/*.mjs; do ln -s "../../bin/`basename "$bin"`" "/build/flux-js-lint/.local/bin/`basename "${bin%.*}"`"; done

FROM node:19-alpine

ENV PATH "/flux-js-lint/.local/bin:$PATH"

USER node:node

ENTRYPOINT []

COPY --from=build /build /
