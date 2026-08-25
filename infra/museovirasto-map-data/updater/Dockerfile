ARG NODE_VERSION=22.23.1

FROM protomaps/go-pmtiles:v1.31.2 AS pmtiles-builder
FROM node:${NODE_VERSION}-bookworm-slim AS node-builder
FROM ghcr.io/openwatersio/tippecanoe:2.79.0 AS tippecanoe-builder

FROM ghcr.io/osgeo/gdal:ubuntu-small-3.13.3

ARG TARGETARCH

RUN actual_arch="$(uname -m)" && \
    case "$TARGETARCH:$actual_arch" in \
      amd64:x86_64|arm64:aarch64) ;; \
      *) echo "Build platform mismatch: TARGETARCH=$TARGETARCH, uname=$actual_arch. Use Docker Buildx for cross-platform builds." >&2; exit 1 ;; \
    esac

ENV DEBIAN_FRONTEND=noninteractive \
    PORT=8080 \
    HOME=/tmp/updater-home \
    WRANGLER_LOG_PATH=/tmp/wrangler.log

RUN apt-get update && apt-get install -y --no-install-recommends \
      bash build-essential ca-certificates curl git jq libsqlite3-dev \
      pkg-config poppler-utils ripgrep sqlite3 unzip xz-utils zlib1g-dev && \
    rm -rf /var/lib/apt/lists/*

COPY --from=pmtiles-builder /go-pmtiles /usr/local/bin/pmtiles
COPY --from=node-builder /usr/local/ /usr/local/
COPY --from=tippecanoe-builder /usr/local/bin/ /usr/local/bin/

WORKDIR /workspace
COPY museovirasto-map-data /workspace/infra/museovirasto-map-data
COPY muinaismuistot-worker/wrangler.jsonc /workspace/infra/muinaismuistot-worker/wrangler.jsonc

RUN mkdir -p /tmp/updater-home /workspace/infra/museovirasto-map-data/data/tools && \
    cp /usr/local/bin/pmtiles /workspace/infra/museovirasto-map-data/data/tools/pmtiles && \
    npm ci --prefix /workspace/infra/museovirasto-map-data/updater && \
    rm -rf /root/.npm /tmp/updater-home/.npm

EXPOSE 8080
ENTRYPOINT ["node", "/workspace/infra/museovirasto-map-data/updater/container/server.mjs"]
