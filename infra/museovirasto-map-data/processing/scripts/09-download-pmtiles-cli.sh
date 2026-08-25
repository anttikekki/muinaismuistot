#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
TOOLS_DIR="$PROJECT_DIR/data/tools"
VERSION="1.31.2"

[[ "$(uname -s)" == "Darwin" && "$(uname -m)" == "arm64" ]] || {
  echo "This downloader currently supports macOS arm64 only." >&2
  exit 1
}

ARCHIVE_NAME="go-pmtiles-${VERSION}_Darwin_arm64.zip"
ARCHIVE_URL="https://github.com/protomaps/go-pmtiles/releases/download/v${VERSION}/${ARCHIVE_NAME}"
ARCHIVE_SHA256="40528f7f616fcbf91207cd48c8fc023d213f6d86c0cbf1f748732803d1880f3d"
ARCHIVE_FILE="$TOOLS_DIR/$ARCHIVE_NAME"
PMTILES_BIN="$TOOLS_DIR/pmtiles"

for command_name in curl shasum unzip; do
  command -v "$command_name" >/dev/null 2>&1 || {
    echo "Required command not found: $command_name" >&2
    exit 1
  }
done

mkdir -p "$TOOLS_DIR"
if [[ ! -f "$ARCHIVE_FILE" ]]; then
  curl --fail --silent --show-error --location --retry 3 \
    --output "$ARCHIVE_FILE.part" "$ARCHIVE_URL"
  mv "$ARCHIVE_FILE.part" "$ARCHIVE_FILE"
fi

actual_sha256="$(shasum -a 256 "$ARCHIVE_FILE" | awk '{print $1}')"
[[ "$actual_sha256" == "$ARCHIVE_SHA256" ]] || {
  echo "Checksum mismatch for $ARCHIVE_FILE" >&2
  echo "Expected: $ARCHIVE_SHA256" >&2
  echo "Actual:   $actual_sha256" >&2
  exit 1
}

unzip -jo "$ARCHIVE_FILE" pmtiles -d "$TOOLS_DIR" >/dev/null
chmod +x "$PMTILES_BIN"
"$PMTILES_BIN" version
