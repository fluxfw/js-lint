# flux-js-lint

## Gitlab ci

```yaml
lint:
    stage: test
    image: fluxfw/flux-js-lint:latest
    script:
        - flux-js-lint
```

## Local

```shell
./bin/install-to-home-local-bin.sh
```

```shell
flux-js-lint
```

## IDE/Editor

Not possible
