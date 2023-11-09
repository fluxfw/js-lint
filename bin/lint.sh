#!/usr/bin/env sh

set -e

bin="`dirname "$0"`"
root="$bin/.."

"$bin/PATH/host/flux-js-lint" "$root"
