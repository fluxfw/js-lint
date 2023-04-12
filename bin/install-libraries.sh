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

installLibrary() {
    (mkdir -p "$libs/$1" && cd "$libs/$1" && wget -O - "$2" | tar -xz --strip-components=1)
}

checkAlreadyInstalled

(cd "$libs" && npm install --no-save eslint@8.31.0 eslint-plugin-jsdoc@39.6.4 eslint-plugin-json@3.1.0)

installLibrary flux-shutdown-handler https://github.com/fluxfw/flux-shutdown-handler/archive/refs/tags/v2023-03-16-1.tar.gz
