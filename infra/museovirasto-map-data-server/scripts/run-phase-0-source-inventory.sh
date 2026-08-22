#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

"$SCRIPT_DIR/00-download-source-data.sh"
"$SCRIPT_DIR/01-inventory-geopackages.sh"
