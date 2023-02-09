#!/usr/bin/env sh

set -e

bin="`dirname "$0"`"
root="$bin/.."
libs="$root/.."

checkAlreadyInstalled() {
    if [ `ls "$libs" | wc -l` != "1" ]; then
        echo "Already installed" >&2
        exit 1
    fi
}

installNodeModules() {
    (cd "$root" && npm ci --omit=dev && mv node_modules ../node_modules)
}

installLibrary() {
    (mkdir -p "$libs/$1" && cd "$libs/$1" && wget -O - "$2" | tar -xz --strip-components=1)
}

checkAlreadyInstalled

installNodeModules

installLibrary flux-shutdown-handler-api https://github.com/fluxfw/flux-shutdown-handler-api/archive/refs/tags/v2023-02-09-1.tar.gz
