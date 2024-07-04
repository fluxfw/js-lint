#!/usr/bin/env sh

set -e

node_modules_folder="`dirname "$0"`/node_modules"

installArchiveLibrary() {
    dest="$node_modules_folder/$1"

    if [ -e "$dest" ]; then
        echo "$1 is already installed in $dest!" >&2
        exit 1
    fi

    echo "Install archive library $2 to $dest"

    while true; do 
        rm -rf "$dest" && mkdir -p "$dest"

        wget -T 5 -O "$dest.tar.gz" "$2" && true

        if [ "$?" = 0 ] && [ -e "$dest.tar.gz" ]; then
            (cd "$dest" && tar -xzf "$dest.tar.gz" --strip-components=1)
            unlink "$dest.tar.gz"

            if [ `ls "$dest" | wc -l` != 0 ]; then
                break
            fi
        fi

        sleep 10
    done
}

installNpmLibrary() {
    dest="$node_modules_folder/$1"

    if [ -e "$dest" ]; then
        echo "$1 is already installed in $dest!" >&2
        exit 1
    fi

    dest_temp="$node_modules_folder/_$1"

    echo "Install npm library $1@$2 to $dest"

    mkdir -p "$dest_temp"
    (cd "$dest_temp" && npm install --prefix . --no-save --omit=dev --omit=optional --omit=peer --no-audit --no-fund "$1@$2")

    mkdir -p "`dirname "$dest"`"
    mv "$dest_temp/node_modules/$1" "$dest"
    mv "$dest_temp/node_modules" "$dest/node_modules"
    rmdir "$dest_temp"
}

installArchiveLibrary build-utils https://github.com/fluxfw/build-utils/archive/refs/tags/v2024-07-04-2.tar.gz

installArchiveLibrary config https://github.com/fluxfw/config/archive/refs/tags/v2024-05-08-1.tar.gz

installArchiveLibrary shutdown-handler https://github.com/fluxfw/shutdown-handler/archive/refs/tags/v2024-05-08-1.tar.gz

installArchiveLibrary uglify-js https://registry.npmjs.org/uglify-js/-/uglify-js-3.17.4.tgz

installNpmLibrary eslint 8.31.0

installNpmLibrary eslint-plugin-jsdoc 39.6.4

installNpmLibrary eslint-plugin-json 3.1.0
