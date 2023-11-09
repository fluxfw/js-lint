FROM node:20-alpine AS build

COPY bin/install-libraries.sh /build/opt/flux-js-lint/libs/flux-js-lint/bin/install-libraries.sh
RUN /build/opt/flux-js-lint/libs/flux-js-lint/bin/install-libraries.sh

RUN ln -s libs/flux-js-lint/bin /build/opt/flux-js-lint/bin

COPY . /build/opt/flux-js-lint/libs/flux-js-lint

RUN unlink /build/opt/flux-js-lint/bin/install-libraries.sh

RUN mkdir -p /build/usr/local/bin && (cd /build/opt/flux-js-lint/bin/PATH && for bin in *; do ln -s "../../../opt/flux-js-lint/bin/PATH/$bin" "/build/usr/local/bin/$bin"; done)

FROM node:20-alpine

USER node:node

ENTRYPOINT ["flux-js-lint"]

COPY --from=build /build /
