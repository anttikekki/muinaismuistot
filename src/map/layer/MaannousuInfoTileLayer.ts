import WebGLTileLayer, { Style } from "ol/layer/WebGLTile"
import { GeoTIFF } from "ol/source"
import { MaannousuInfoLayer } from "../../common/layers.types"

const colorLand = [0, 0, 0, 0] // Invisible
const colorSea = [201, 236, 250, 1] // National Land Survey of Finland background map sea color
const noData = [0, 0, 0, 0] // Invisible
const style: Style = {
  color: [
    "case",
    ["==", ["band", 1], 0], // Value 0 = land
    colorLand,
    ["==", ["band", 1], 1], // Value 1 = sea
    colorSea,
    noData // Fallback
  ]
}

export default class MaannousuInfoTileLayer {
  private readonly year: MaannousuInfoLayer
  private readonly source: GeoTIFF
  private readonly layer: WebGLTileLayer

  public constructor(year: MaannousuInfoLayer) {
    this.year = year

    this.source = new GeoTIFF({
      sources: [
        {
          url: `https://maannousu.info/api/v2/${this.year}`,
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

  public getYear(): MaannousuInfoLayer {
    return this.year
  }

  public getLayer(): WebGLTileLayer {
    return this.layer
  }

  public getSource(): GeoTIFF {
    return this.source
  }
}
