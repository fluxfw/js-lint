#!/usr/bin/env sh

set -e

installDependency() {
    if [ "`basename "$(realpath ..)"`" = "node_modules" ]; then
        node_modules=".."
    else 
        node_modules="node_modules"
    fi

    (mkdir -p "$node_modules/$1" && cd "$node_modules/$1" && wget -O - "$2" | tar -xz --strip-components=1)
}

installDependency flux-shutdown-handler-api https://github.com/fluxfw/flux-shutdown-handler-api/archive/refs/tags/v2022-11-24-1.tar.gz
