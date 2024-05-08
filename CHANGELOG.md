# Changelog

## latest

Changes:

\-

## v2024-05-08-1

Changes:

- Deflux
- Install to `lib` instead of `opt`
- Simple `bin` in `.dockerignore`
- Remove `bin` folder from build
- Remove `node` user (Always run with host user id)
- Merge `RUN`'s in `Dockerfile`
- Disable npm audit/fund
- Update `build-utils`

## v2024-01-15-1

Changes:

- Install libraries to inline `node_modules` folder
- Download npm libraries with no dependencies again directly from archive without cli
- Load libraries using NodeJS's module resolver
- Load json using import attributes

## v2024-01-09-1

Changes:

- Adapted `flux-build-utils`
- Use same NodeJS 20 version from Alpine 3.19 (`nodejs` package (LTS NodeJS)) instead of Alpine 3.18 (`nodejs-current` package) due is seems smaller

## v2023-12-18-1

Changes:

- Fix

## v2023-12-12-2

Changes:

- Fix

## v2023-12-12-1

Changes:

- Fix

## v2023-12-11-3

Changes:

- Fix

## v2023-12-11-2

Changes:

- Fix

## v2023-12-11-1

Changes:

- Fix

## v2023-12-04-2

Changes:

- Fix

## v2023-12-04-1

Changes:

- Bundle

## v2023-11-15-1

Changes:

- Use nodejs version from alpine (Smaller without npm/yarn)

## v2023-11-09-1

Changes:

- New PATH

## v2023-10-02-1

Changes:

- `version` file

## v2023-03-22-1

Changes:

- path

## v2023-03-17-1

Changes:

- libraries

## v2023-02-13-1

Changes:

- relative paths

## v2023-02-09-1

Changes:

- build / publish

## v2023-01-31-1

Changes:

- remove commit label

## v2023-01-10-1

Changes:

- Update `eslint`

## v2022-12-14-1

Changes:

- Force curly

## v2022-12-09-1

Changes:

- libraries

## v2022-12-08-1

Changes:

- libraries

## v2022-11-24-3

Changes:

- shutdown handler

## v2022-11-24-2

Changes:

- shutdown handler

## v2022-11-24-1

Changes:

- bin

## v2022-11-14-1

Changes:

- Use `node:path/posix`

## v2022-11-01-1

Changes:

- Enable `worker`

## v2022-10-28-1

Changes:

- init

## v2022-10-24-1

Changes:

- NodeJS 19

## v2022-10-21-1

Changes:

- Fix `no-extra-parens` and `no-mixed-operators` conflict

## v2022-10-19-2

Changes:

- Code style

## v2022-10-19-1

Changes:

- JsDoc code style

## v2022-10-17-1

Changes:

- Dynamic imports

## v2022-10-11-1

Changes:

- install dependencies script

## v2022-10-04-1

Changes:

- Error on multiple assigns

## v2022-10-03-1

Changes:

- Error on unused vars

## v2022-09-26-2

Changes:

- Use flux-shutdown-handler-api

## v2022-09-26-1

Changes:

- Fix permissions

## v2022-09-22-1

Changes:

- Error handling

## v2022-09-21-1

Changes:

- First release
