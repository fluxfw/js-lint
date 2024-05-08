#!/usr/bin/env sh

set -e

bin_folder="`dirname "$0"`"
root_folder="$bin_folder/.."

name="`basename "$(realpath "$root_folder")"`"
host="${PUBLISH_DOCKER_HOST:=}"
host_with_slash="${host}${host:+/}"
image="$host_with_slash$PUBLISH_DOCKER_USER/$name"
tag="v`echo -n "$(cat "$root_folder/version")"`"

"$bin_folder/build.sh"

tag-release "$root_folder"
create-github-release "$root_folder"

export DOCKER_CONFIG="$PUBLISH_DOCKER_CONFIG_FOLDER"
docker push "$image:$tag"
docker push "$image:latest"
unset DOCKER_CONFIG
