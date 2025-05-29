import { LRUCache } from "lru-cache"
import LayerGroup from "ol/layer/Group"
import { MaannousuInfoGlacialLayer } from "../../common/layers.types"
import { Settings } from "../../store/storeTypes"
import MaannousuInfoGlacialTileLayer from "./MaannousuInfoGlacialTileLayer"

const isSupportedGlacialYear = (
  layer: string
): layer is MaannousuInfoGlacialLayer =>
  Object.values(MaannousuInfoGlacialLayer).includes(
    layer as MaannousuInfoGlacialLayer
  )

export default class MaannousuInfoGlacialTileLayerGroup {
  private readonly layerGroup = new LayerGroup()
  // Store only 5 layers to save memory. Older mobile devices crash if
  // too many layers are loaded.
  private readonly layers = new LRUCache<
    MaannousuInfoGlacialLayer,
    MaannousuInfoGlacialTileLayer
  >({
    max: 5,
    dispose: (layer) => {
      this.layerGroup.getLayers().remove(layer.getLayer())
    }
  })
  private onMapRenderCompleteOnce?: (fn: () => void) => void

  public constructor({
    settings,
    onMapRenderCompleteOnce
  }: {
    settings: Settings
    onMapRenderCompleteOnce: (fn: () => void) => void
  }) {
    this.onMapRenderCompleteOnce = onMapRenderCompleteOnce
    this.onYearChange(settings)
  }

  public getLayerGroup(): LayerGroup {
    return this.layerGroup
  }

  public onYearChange = (settings: Settings): void => {
    const nextYear = settings.maannousuInfo.selectedLayer

    // Next year is not supported year for ice. hide all layers
    if (!isSupportedGlacialYear(nextYear)) {
      this.hideAllLayers()
      return
    }

    const nextLayer = this.layers.get(nextYear)

    if (!nextLayer) {
      const newLayer = new MaannousuInfoGlacialTileLayer(nextYear)
      this.layers.set(nextYear, newLayer)

      newLayer.getSource().once("tileloadend", () => {
        this.onMapRenderCompleteOnce?.(() => {
          this.setLayerVisible(newLayer)
        })
      })
      this.layerGroup.getLayers().push(newLayer.getLayer())
    } else {
      this.setLayerVisible(nextLayer)
    }
  }

  public updateLayerVisibility(settings: Settings): void {
    if (settings.maannousuInfo.enabled) {
      /**
       * Show selected layer. Create layers only when the layer group is
       * made visible, because creation the GeoTIFF source starts loading the
       * data right away when layer is added to map. This would slow down
       * stat up time of the whole page even if layer group would be insivible.
       */
      this.onYearChange(settings)
    } else {
      this.hideAllLayers()
    }
  }

  public opacityChanged(settings: Settings): void {
    this.layerGroup.setOpacity(settings.maannousuInfo.opacity)
  }

  private setLayerVisible = (
    nextLayer: MaannousuInfoGlacialTileLayer
  ): void => {
    nextLayer.getLayer().setVisible(true)
    this.layers.forEach((prevLayer) => {
      if (
        prevLayer.getYear() !== nextLayer.getYear() &&
        prevLayer.getLayer().isVisible()
      ) {
        prevLayer.getLayer().setVisible(false)
      }
    })
  }

  private hideAllLayers = (): void => {
    this.layers.forEach((layer) => {
      layer.getLayer().setVisible(false)
    })
  }
}
