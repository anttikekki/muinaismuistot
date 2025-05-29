import WebGLTileLayer, { Style } from "ol/layer/WebGLTile"
import { GeoTIFF } from "ol/source"

const colorNotIce = [0, 0, 0, 0] // Invisible
const colorIce = [255, 255, 255, 1] // White
const noData = [0, 0, 0, 0] // Invisible
const style: Style = {
  color: [
    "case",
    ["==", ["band", 1], 0], // Value 0 = not ice
    colorNotIce,
    ["==", ["band", 1], 1], // Value 1 = ice
    colorIce,
    noData // Fallback
  ]
}

export default class MaannousuInfoGlacialTileLayer {
  private readonly year: number
  private readonly source: GeoTIFF
  private readonly layer: WebGLTileLayer

  public constructor(year: number) {
    this.year = year

    this.source = new GeoTIFF({
      sources: [
        {
          url: `https://maannousu.info/api/v2/ice/${this.year}`,
          bands: [1]
        }
      ],
      sourceOptions: {
        /**
         * Decrease cache size from default 100 to 50 tiles to save memory.
         * Older mobile devices crash if too many layers and tiles are loaded into memory.
         */
        cacheSize: 50
      },
      convertToRGB: false,
      normalize: false
    })

    this.layer = new WebGLTileLayer({
      source: this.source,
      style,
      visible: true
    })
  }

  public getYear(): number {
    return this.year
  }

  public getLayer(): WebGLTileLayer {
    return this.layer
  }

  public getSource(): GeoTIFF {
    return this.source
  }
}
