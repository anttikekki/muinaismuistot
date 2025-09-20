import WebGLTileLayer, { Style } from "ol/layer/WebGLTile"
import { GeoTIFF } from "ol/source"
import {
  MMLPohjakarttaLayer,
  MaannousuInfoLayer
} from "../../common/layers.types"
import { isMobileDevice } from "../../common/util/deviceDetectionUtil"
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
         * Decrease block cache size from default 100 to 25 to save memory. One block is 64 kb.
         * Older mobile devices crash if too much data is loaded into memory.
         */
        cacheSize: isMobileDevice() ? 25 : 50
      },
      convertToRGB: false,
      // Required for Android devices. Read more from createStyle().
      normalize: true,
      interpolate: false
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
    const colorIce = [255, 255, 255, 1] // White

    /**
     * Change sea color based on selected National Land Survey of Finland
     * background map type.
     */
    const colorSea = ((): number[] => {
      switch (settings.maanmittauslaitos.basemap.selectedLayer) {
        case MMLPohjakarttaLayer.Maastokartta:
          return [177, 252, 254, 1]
        case MMLPohjakarttaLayer.Taustakartta:
          return [201, 236, 250, 1]
        case MMLPohjakarttaLayer.Ortokuva:
          return [31, 32, 58, 1]
        default:
          return [201, 236, 250, 1]
      }
    })()

    /**
     * OpenLayers converts GeoTIFF data band to Float32 even if it's source type is Byte if
     * normalization is not enabled. Only with normalization it keeps the original Byte type.
     * Many Android device do not support WebGL 1 "OES_texture_float" extension. Dekstop browser and
     * iOS devices support it. This causes WebGL to throw error on some Android devices because
     * OpenLayers converts data to Float but Android device does not support "OES_texture_float".
     * Thrown errors:
     *
     * TileTexture.js:105 WebGL: INVALID_ENUM: texImage2D: invalid type
     * RENDER WARNING: texture bound to texture unit 0 is not renderable. It might be non-power-of-2 or
     * have incompatible texture filtering (maybe)?
     *
     * The only fix for this for now is to enable normalization. It distributes the Byte values (0,1,2,255)
     * between 0.0 - 1.0:
     * 0   --> 0.0
     * 1   --> 1 / 255 ≈ 0.0039
     * 2   --> 2 / 255 ≈ 0.0078
     * 255 --> 1.0
     *
     * Lets reverse the normalization in style to make it simpler to understand.
     *
     * @see https://github.com/openlayers/openlayers/issues/15581: COG -> GeoTIFF() + normalize:false ->
     * TileLayer is broken on many newer Android phones
     */
    const style: Style = {
      color: [
        "match",
        ["round", ["*", ["band", 1], 255]], // Reverse normalization: [0.0–1.0] → [0–255]
        0,
        colorLand, // Land
        1,
        colorSea, // Sea
        2,
        colorIce, // Ice
        255,
        noData, // NoData (commonly encoded as 255)
        noData // Default fallback
      ]
    }

    return style
  }
}
