import WebGLTileLayer, { Style } from "ol/layer/WebGLTile"
import { GeoTIFF } from "ol/source"

const colorNotIce = [0, 0, 0, 0] // Invisible
const colorIce = [255, 255, 255, 1] // White
const noData = [0, 0, 0, 0] // Invisible

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
 * The only fix for this for now is to enable normalization. It distributes the Byte values (0,1,255)
 * between 0.0 - 1.0:
 * 0   --> 0.0
 * 1   --> 1 / 255 ≈ 0.0039
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
    colorNotIce, // Value 0 = not ice
    1,
    colorIce, // Value 1 = ice
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
      // Required for Android devices. Read more from style definition.
      normalize: true,
      interpolate: false
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
