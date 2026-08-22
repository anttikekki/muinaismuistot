#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PDF_FILE="${1:-$PROJECT_DIR/data/Tietotuotemaarittely_kulttuuriymparisto_kaikki.pdf}"
TEXT_FILE="${2:-$PROJECT_DIR/data/Tietotuotemaarittely_kulttuuriymparisto_kaikki.txt}"

if ! command -v pdftotext >/dev/null 2>&1; then
  echo "Error: 'pdftotext' is required." >&2
  exit 1
fi

if [[ ! -f "$PDF_FILE" ]]; then
  echo "Error: PDF does not exist: $PDF_FILE" >&2
  echo "Run $SCRIPT_DIR/00-download-source-data.sh first." >&2
  exit 1
fi

pdftotext -layout "$PDF_FILE" "$TEXT_FILE"
echo "Data description text written to $TEXT_FILE"
