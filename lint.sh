#!/usr/bin/env sh

set -e

root_folder="`dirname "$0"`"

"$root_folder/HOST_PATH/`basename "$(realpath "$root_folder")"`" "$root_folder"
