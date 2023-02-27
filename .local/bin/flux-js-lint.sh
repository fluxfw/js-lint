#!/usr/bin/env sh

set -e

path="$1"
if [ -z "$path" ]; then
    echo "Please pass a path" >&2
    exit 1
fi
shift

local_bin="`dirname "$(realpath "$0")"`"
root="$local_bin/../.."

name="`basename "$(realpath "$root")"`"
user="${FLUX_PUBLISH_DOCKER_USER:=fluxfw}"
image="$user/$name"
tag="`get-release-tag "$root"`"

path_host="`realpath "$path"`"
path_volume="/code/`basename "$path_host"`"

docker run --rm -it --network none -u "`id -u`":"`id -g`" -v "$path_host":"$path_volume":ro "$image:$tag" flux-js-lint "$path_volume" "$@"
