#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

"$SCRIPT_DIR/00-download-source-data.sh"
"$SCRIPT_DIR/02-extract-data-description.sh"
"$SCRIPT_DIR/01-inventory-geopackages.sh"
"$SCRIPT_DIR/03-append-data-model-analysis.sh"
"$SCRIPT_DIR/04-append-identifier-analysis.sh"
"$SCRIPT_DIR/05-validate-layer-mapping.sh"
"$SCRIPT_DIR/06-inventory-styles.sh"
