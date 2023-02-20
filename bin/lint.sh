#!/usr/bin/env sh

set -e

bin="`dirname "$0"`"
root="$bin/.."
local_bin="$root/.local/bin"

"$local_bin/flux-js-lint.sh" "$root"
