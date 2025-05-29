import { LRUCache } from "lru-cache"
import LayerGroup from "ol/layer/Group"
import { MaannousuInfoLayer } from "../../common/layers.types"
import { Settings } from "../../store/storeTypes"
import { isWebGLSupported } from "../../ui/util/webGLUtils"
import MaannousuInfoTileLayer from "./MaannousuInfoTileLayer"

export type ShowLoadingAnimationFn = (show: boolean) => void

export default class MaannousuInfoTileLayerGroup {
  private readonly layerGroup = new LayerGroup()
  // Store only 5 layers to save memory. Older mobile devices crash if
  // too many layers are loaded.
  private readonly layers = new LRUCache<
    MaannousuInfoLayer,
    MaannousuInfoTileLayer
  >({
    max: 5,
    dispose: (layer) => {
      this.layerGroup.getLayers().remove(layer.getLayer())
    }
  })
  private readonly onMapRenderCompleteOnce: (fn: () => void) => void
  private readonly updateTileLoadingStatus: ShowLoadingAnimationFn

  public constructor({
    settings,
    onMapRenderCompleteOnce,
    updateTileLoadingStatus
  }: {
    settings: Settings
    onMapRenderCompleteOnce: (fn: () => void) => void
    updateTileLoadingStatus: ShowLoadingAnimationFn
  }) {
    this.onMapRenderCompleteOnce = onMapRenderCompleteOnce
    this.updateTileLoadingStatus = updateTileLoadingStatus
    this.onYearChange(settings)
  }

  public getLayerGroup(): LayerGroup {
    return this.layerGroup
  }

  public onYearChange = (settings: Settings): void => {
    if (!settings.maannousuInfo.enabled || !isWebGLSupported()) {
      return
    }

    const nextYear = settings.maannousuInfo.selectedLayer

    // Hide all layers if current year is selected. This just shows the base map.
    if (parseInt(nextYear) === new Date().getFullYear()) {
      this.hideAllLayers()
      return
    }

    const cacheKey = nextYear

    this.updateTileLoadingStatus(false)
    const nextLayer = this.layers.get(cacheKey)
    if (!nextLayer) {
      this.updateTileLoadingStatus(true)
      const newLayer = new MaannousuInfoTileLayer(nextYear)
      this.layers.set(cacheKey, newLayer)

      newLayer.getSource().once("tileloadend", () => {
        this.onMapRenderCompleteOnce(() => {
          this.setLayerVisible(newLayer)
          this.updateTileLoadingStatus(false)
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

  private setLayerVisible = (nextLayer: MaannousuInfoTileLayer): void => {
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
