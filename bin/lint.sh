#!/usr/bin/env sh

set -e

bin="`dirname "$0"`"
root="$bin/.."

"$bin/HOST_PATH/flux-js-lint" "$root"
