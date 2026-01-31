#!/bin/bash
# GNOME Shell Extension Pack Script

set -euo pipefail

# Configuration: extra files to include in the package
EXTRA_SOURCES=(
    "constants.js"
)

# Get script directory (extension root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Build pack arguments
ARGS=()
for src in "${EXTRA_SOURCES[@]}"; do
    ARGS+=("--extra-source=${SCRIPT_DIR}/${src}")
done

# Pack the extension
gnome-extensions pack "${ARGS[@]}" "${SCRIPT_DIR}" --force
