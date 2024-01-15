#!/usr/bin/env sh

set -e

bin_folder="`dirname "$0"`"
root_folder="$bin_folder/.."

"$bin_folder/HOST_PATH/flux-js-lint" "$root_folder"
