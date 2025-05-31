import WebGLTileLayer, { Style } from "ol/layer/WebGLTile"
import { GeoTIFF } from "ol/source"
import {
  MaanmittauslaitosLayer,
  MaannousuInfoLayer
} from "../../common/layers.types"
import { Settings } from "../../store/storeTypes"

export default class MaannousuInfoTileLayer {
  private readonly year: MaannousuInfoLayer
  private readonly source: GeoTIFF
  private readonly layer: WebGLTileLayer

  public constructor(year: MaannousuInfoLayer, settings: Settings) {
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
      style: this.createStyle(settings),
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

  public updateLayerStyle(settings: Settings): void {
    this.layer.setStyle(this.createStyle(settings))
  }

  private createStyle(settings: Settings): Style {
    const colorLand = [0, 0, 0, 0] // Invisible
    const noData = [0, 0, 0, 0] // Invisible

    /**
     * Change sea color based on selected National Land Survey of Finland
     * background map type.
     */
    const colorSea = ((): number[] => {
      switch (settings.maanmittauslaitos.selectedLayer) {
        case MaanmittauslaitosLayer.Maastokartta:
          return [177, 252, 254, 1]
        case MaanmittauslaitosLayer.Taustakartta:
          return [201, 236, 250, 1]
        case MaanmittauslaitosLayer.Ortokuva:
          return [31, 32, 58, 1]
      }
    })()

    return {
      color: [
        "case",
        ["==", ["band", 1], 0], // Value 0 = land
        colorLand,
        ["==", ["band", 1], 1], // Value 1 = sea
        colorSea,
        noData // Fallback
      ]
    }
  }
}
