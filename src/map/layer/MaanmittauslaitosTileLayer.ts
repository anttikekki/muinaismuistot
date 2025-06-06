import WMTSCapabilities from "ol/format/WMTSCapabilities"
import TileLayer from "ol/layer/Tile"
import WMTSSource, { optionsFromCapabilities } from "ol/source/WMTS"
import { MaanmittauslaitosLayer } from "../../common/layers.types"
import { Settings } from "../../store/storeTypes"

export type ShowLoadingAnimationFn = (show: boolean) => void

export default class MaanmittauslaitosTileLayer {
  private readonly mmlMaastokarttaLayer: TileLayer<WMTSSource>
  private readonly mmlTaustakarttaLayer: TileLayer<WMTSSource>
  private readonly mmlOrtokuvaLayer: TileLayer<WMTSSource>
  private maastokarttaLayerSource?: WMTSSource
  private taustakarttaLayerSource?: WMTSSource
  private ortokuvaLayerSource?: WMTSSource
  private readonly updateTileLoadingStatus: ShowLoadingAnimationFn

  public constructor(
    settings: Settings,
    updateTileLoadingStatus: ShowLoadingAnimationFn
  ) {
    this.updateTileLoadingStatus = updateTileLoadingStatus

    const parser = new WMTSCapabilities()
    const capabilities = parser.read(WMTSCapabilitiesResult)

    const maastokarttaOptions = optionsFromCapabilities(capabilities, {
      layer: MaanmittauslaitosLayer.Maastokartta
    })
    const taustakarttaOptions = optionsFromCapabilities(capabilities, {
      layer: MaanmittauslaitosLayer.Taustakartta
    })
    const ortokuvaOptions = optionsFromCapabilities(capabilities, {
      layer: MaanmittauslaitosLayer.Ortokuva
    })

    if (!maastokarttaOptions || !taustakarttaOptions || !ortokuvaOptions) {
      throw new Error(`Expected layers were not found from WMTS Capabilities`)
    }

    this.maastokarttaLayerSource = new WMTSSource(maastokarttaOptions)
    this.taustakarttaLayerSource = new WMTSSource(taustakarttaOptions)
    this.ortokuvaLayerSource = new WMTSSource(ortokuvaOptions)

    // Add MML api key to all layers. This API key is just for avoin-karttakuva.maanmittauslaitos.fi
    ;[
      this.maastokarttaLayerSource,
      this.taustakarttaLayerSource,
      this.ortokuvaLayerSource
    ].forEach((source) => {
      source.setUrls(
        source
          .getUrls()
          ?.map(
            (url) => `${url}api-key=${settings.maanmittauslaitos.apiKey}&`
          ) || []
      )
    })

    const selectedLayer = settings.maanmittauslaitos.selectedLayer
    this.mmlMaastokarttaLayer = new TileLayer({
      source: this.maastokarttaLayerSource,
      visible: selectedLayer === MaanmittauslaitosLayer.Maastokartta
    })
    this.mmlTaustakarttaLayer = new TileLayer({
      source: this.taustakarttaLayerSource,
      visible: selectedLayer === MaanmittauslaitosLayer.Taustakartta
    })
    this.mmlOrtokuvaLayer = new TileLayer({
      source: this.ortokuvaLayerSource,
      visible: selectedLayer === MaanmittauslaitosLayer.Ortokuva
    })

    this.updateLoadingAnimationOnLayerSourceTileLoad(
      this.maastokarttaLayerSource
    )
    this.updateLoadingAnimationOnLayerSourceTileLoad(
      this.taustakarttaLayerSource
    )
    this.updateLoadingAnimationOnLayerSourceTileLoad(this.ortokuvaLayerSource)
  }

  private updateLoadingAnimationOnLayerSourceTileLoad = (
    source: WMTSSource
  ) => {
    source.on("tileloadstart", () => {
      this.updateTileLoadingStatus(true)
    })
    source.on("tileloadend", () => {
      this.updateTileLoadingStatus(false)
    })
    source.on("tileloaderror", () => {
      this.updateTileLoadingStatus(false)
    })
  }

  public selectedMaanmittauslaitosLayerChanged = (settings: Settings) => {
    if (
      !this.mmlMaastokarttaLayer ||
      !this.mmlTaustakarttaLayer ||
      !this.mmlOrtokuvaLayer
    ) {
      return
    }
    const layer = settings.maanmittauslaitos.selectedLayer
    this.mmlMaastokarttaLayer.setVisible(
      layer === MaanmittauslaitosLayer.Maastokartta
    )
    this.mmlTaustakarttaLayer.setVisible(
      layer === MaanmittauslaitosLayer.Taustakartta
    )
    this.mmlOrtokuvaLayer.setVisible(layer === MaanmittauslaitosLayer.Ortokuva)
  }

  public getLayers = (): {
    mmlMaastokarttaLayer: TileLayer<WMTSSource>
    mmlTaustakarttaLayer: TileLayer<WMTSSource>
    mmlOrtokuvaLayer: TileLayer<WMTSSource>
  } => {
    return {
      mmlMaastokarttaLayer: this.mmlMaastokarttaLayer,
      mmlTaustakarttaLayer: this.mmlTaustakarttaLayer,
      mmlOrtokuvaLayer: this.mmlOrtokuvaLayer
    }
  }
}

/**
 * Copy of Maanmittauslaitos WMTS Capabilities XML from
 * https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/WMTSCapabilities.xml
 * to speed up the layer creation.
 */
const WMTSCapabilitiesResult = `
<Capabilities xmlns="http://www.opengis.net/wmts/1.0"
    xmlns:ows="http://www.opengis.net/ows/1.1"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:gml="http://www.opengis.net/gml" xsi:schemaLocation="http://www.opengis.net/wmts/1.0 http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd" version="1.0.0">
    <ows:ServiceIdentification>
        <ows:Title>Maanmittauslaitoksen Karttakuvapalvelu (WMTS)</ows:Title>
        <ows:Abstract>Kuvaus palvelusta</ows:Abstract>
        <ows:ServiceType>OGC WMTS</ows:ServiceType>
        <ows:ServiceTypeVersion>1.0.0</ows:ServiceTypeVersion>
        <ows:AccessConstraints>Vaatii käyttäjätunnuksen</ows:AccessConstraints>
    </ows:ServiceIdentification>
    <ows:ServiceProvider>
        <ows:ProviderName>Maanmittauslaitos</ows:ProviderName>
        <ows:ProviderSite xlink:href="http://www.maanmittauslaitos.fi"></ows:ProviderSite>
        <ows:ServiceContact>
            <ows:IndividualName>Verkkopalvelu - sovellustuki</ows:IndividualName>
            <ows:ContactInfo>
                <ows:Address>
                    <ows:ElectronicMailAddress>verkkopalvelut@maanmittauslaitos.fi</ows:ElectronicMailAddress>
                </ows:Address>
            </ows:ContactInfo>
        </ows:ServiceContact>
    </ows:ServiceProvider>
    <ows:OperationsMetadata>
        <ows:Operation name="GetCapabilities">
            <ows:DCP>
                <ows:HTTP>
                    <ows:Get xlink:href="https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts?">
                        <ows:Constraint name="GetEncoding">
                            <ows:AllowedValues>
                                <ows:Value>KVP</ows:Value>
                            </ows:AllowedValues>
                        </ows:Constraint>
                    </ows:Get>
                </ows:HTTP>
            </ows:DCP>
        </ows:Operation>
        <ows:Operation name="GetTile">
            <ows:DCP>
                <ows:HTTP>
                    <ows:Get xlink:href="https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts?">
                        <ows:Constraint name="GetEncoding">
                            <ows:AllowedValues>
                                <ows:Value>KVP</ows:Value>
                            </ows:AllowedValues>
                        </ows:Constraint>
                    </ows:Get>
                </ows:HTTP>
            </ows:DCP>
        </ows:Operation>
        <ows:Operation name="GetFeatureInfo">
            <ows:DCP>
                <ows:HTTP>
                    <ows:Get xlink:href="https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts?">
                        <ows:Constraint name="GetEncoding">
                            <ows:AllowedValues>
                                <ows:Value>KVP</ows:Value>
                            </ows:AllowedValues>
                        </ows:Constraint>
                    </ows:Get>
                </ows:HTTP>
            </ows:DCP>
        </ows:Operation>
    </ows:OperationsMetadata>
    <Contents>
        <Layer>
            <ows:Title>Maastokartta</ows:Title>
            <ows:Identifier>maastokartta</ows:Identifier>
            <Style isDefault="true">
                <ows:Identifier>default</ows:Identifier>
            </Style>
            <Format>image/png</Format>
            <TileMatrixSetLink>
                <TileMatrixSet>ETRS-TM35FIN</TileMatrixSet>
            </TileMatrixSetLink>
            <TileMatrixSetLink>
                <TileMatrixSet>WGS84_Pseudo-Mercator</TileMatrixSet>
            </TileMatrixSetLink>
            <ResourceURL format="image/png" resourceType="tile" template="https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/maastokartta/default/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"></ResourceURL>
        </Layer>
        <Layer>
            <ows:Title>Kiinteistotunnukset</ows:Title>
            <ows:Identifier>kiinteistotunnukset</ows:Identifier>
            <Style isDefault="true">
                <ows:Identifier>default</ows:Identifier>
            </Style>
            <Format>image/png</Format>
            <TileMatrixSetLink>
                <TileMatrixSet>ETRS-TM35FIN</TileMatrixSet>
            </TileMatrixSetLink>
            <TileMatrixSetLink>
                <TileMatrixSet>WGS84_Pseudo-Mercator</TileMatrixSet>
            </TileMatrixSetLink>
            <ResourceURL format="image/png" resourceType="tile" template="https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/kiinteistotunnukset/default/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"></ResourceURL>
        </Layer>
        <Layer>
            <ows:Title>Selkokartta</ows:Title>
            <ows:Identifier>selkokartta</ows:Identifier>
            <Style isDefault="true">
                <ows:Identifier>default</ows:Identifier>
            </Style>
            <Format>image/png</Format>
            <TileMatrixSetLink>
                <TileMatrixSet>ETRS-TM35FIN</TileMatrixSet>
            </TileMatrixSetLink>
            <TileMatrixSetLink>
                <TileMatrixSet>WGS84_Pseudo-Mercator</TileMatrixSet>
            </TileMatrixSetLink>
            <ResourceURL format="image/png" resourceType="tile" template="https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/selkokartta/default/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"></ResourceURL>
        </Layer>
        <Layer>
            <ows:Title>Taustakartta</ows:Title>
            <ows:Identifier>taustakartta</ows:Identifier>
            <Style isDefault="true">
                <ows:Identifier>default</ows:Identifier>
            </Style>
            <Format>image/png</Format>
            <TileMatrixSetLink>
                <TileMatrixSet>ETRS-TM35FIN</TileMatrixSet>
            </TileMatrixSetLink>
            <TileMatrixSetLink>
                <TileMatrixSet>WGS84_Pseudo-Mercator</TileMatrixSet>
            </TileMatrixSetLink>
            <ResourceURL format="image/png" resourceType="tile" template="https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/taustakartta/default/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"></ResourceURL>
        </Layer>
        <Layer>
            <ows:Title>Kiinteistojaotus</ows:Title>
            <ows:Identifier>kiinteistojaotus</ows:Identifier>
            <Style isDefault="true">
                <ows:Identifier>default</ows:Identifier>
            </Style>
            <Format>image/png</Format>
            <TileMatrixSetLink>
                <TileMatrixSet>ETRS-TM35FIN</TileMatrixSet>
            </TileMatrixSetLink>
            <TileMatrixSetLink>
                <TileMatrixSet>WGS84_Pseudo-Mercator</TileMatrixSet>
            </TileMatrixSetLink>
            <ResourceURL format="image/png" resourceType="tile" template="https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/kiinteistojaotus/default/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"></ResourceURL>
        </Layer>
        <Layer>
            <ows:Title>Ortokuva</ows:Title>
            <ows:Identifier>ortokuva</ows:Identifier>
            <Style isDefault="true">
                <ows:Identifier>default</ows:Identifier>
            </Style>
            <Format>image/jpeg</Format>
            <TileMatrixSetLink>
                <TileMatrixSet>ETRS-TM35FIN</TileMatrixSet>
            </TileMatrixSetLink>
            <TileMatrixSetLink>
                <TileMatrixSet>WGS84_Pseudo-Mercator</TileMatrixSet>
            </TileMatrixSetLink>
            <ResourceURL format="image/jpeg" resourceType="tile" template="https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/ortokuva/default/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg"></ResourceURL>
        </Layer>
        <TileMatrixSet>
            <ows:Identifier>ETRS-TM35FIN</ows:Identifier>
            <ows:BoundingBox crs="urn:ogc:def:crs:EPSG:6.3:3067">
                <ows:LowerCorner>-548576.000000 6291456.000000</ows:LowerCorner>
                <ows:UpperCorner>1548576.000000 8388608.000000</ows:UpperCorner>
            </ows:BoundingBox>
            <ows:SupportedCRS>urn:ogc:def:crs:EPSG:6.3:3067</ows:SupportedCRS>
            <TileMatrix>
                <ows:Identifier>0</ows:Identifier>
                <ScaleDenominator>29257142.85714285820722579956</ScaleDenominator>
                <TopLeftCorner>-548576.000000 8388608.000000</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>1</MatrixWidth>
                <MatrixHeight>1</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>1</ows:Identifier>
                <ScaleDenominator>14628571.42857142910361289978</ScaleDenominator>
                <TopLeftCorner>-548576.000000 8388608.000000</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>2</MatrixWidth>
                <MatrixHeight>2</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>2</ows:Identifier>
                <ScaleDenominator>7314285.71428571455180644989</ScaleDenominator>
                <TopLeftCorner>-548576.000000 8388608.000000</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>4</MatrixWidth>
                <MatrixHeight>4</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>3</ows:Identifier>
                <ScaleDenominator>3657142.85714285727590322495</ScaleDenominator>
                <TopLeftCorner>-548576.000000 8388608.000000</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>8</MatrixWidth>
                <MatrixHeight>8</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>4</ows:Identifier>
                <ScaleDenominator>1828571.42857142863795161247</ScaleDenominator>
                <TopLeftCorner>-548576.000000 8388608.000000</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>16</MatrixWidth>
                <MatrixHeight>16</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>5</ows:Identifier>
                <ScaleDenominator>914285.71428571431897580624</ScaleDenominator>
                <TopLeftCorner>-548576.000000 8388608.000000</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>32</MatrixWidth>
                <MatrixHeight>32</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>6</ows:Identifier>
                <ScaleDenominator>457142.85714285715948790312</ScaleDenominator>
                <TopLeftCorner>-548576.000000 8388608.000000</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>64</MatrixWidth>
                <MatrixHeight>64</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>7</ows:Identifier>
                <ScaleDenominator>228571.42857142857974395156</ScaleDenominator>
                <TopLeftCorner>-548576.000000 8388608.000000</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>128</MatrixWidth>
                <MatrixHeight>128</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>8</ows:Identifier>
                <ScaleDenominator>114285.71428571428987197578</ScaleDenominator>
                <TopLeftCorner>-548576.000000 8388608.000000</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>256</MatrixWidth>
                <MatrixHeight>256</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>9</ows:Identifier>
                <ScaleDenominator>57142.85714285714493598789</ScaleDenominator>
                <TopLeftCorner>-548576.000000 8388608.000000</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>512</MatrixWidth>
                <MatrixHeight>512</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>10</ows:Identifier>
                <ScaleDenominator>28571.42857142857246799394</ScaleDenominator>
                <TopLeftCorner>-548576.000000 8388608.000000</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>1024</MatrixWidth>
                <MatrixHeight>1024</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>11</ows:Identifier>
                <ScaleDenominator>14285.71428571428623399697</ScaleDenominator>
                <TopLeftCorner>-548576.000000 8388608.000000</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>2048</MatrixWidth>
                <MatrixHeight>2048</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>12</ows:Identifier>
                <ScaleDenominator>7142.85714285714311699849</ScaleDenominator>
                <TopLeftCorner>-548576.000000 8388608.000000</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>4096</MatrixWidth>
                <MatrixHeight>4096</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>13</ows:Identifier>
                <ScaleDenominator>3571.42857142857155849924</ScaleDenominator>
                <TopLeftCorner>-548576.000000 8388608.000000</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>8192</MatrixWidth>
                <MatrixHeight>8192</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>14</ows:Identifier>
                <ScaleDenominator>1785.71428571428577924962</ScaleDenominator>
                <TopLeftCorner>-548576.000000 8388608.000000</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>16384</MatrixWidth>
                <MatrixHeight>16384</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>15</ows:Identifier>
                <ScaleDenominator>892.85714285714288962481</ScaleDenominator>
                <TopLeftCorner>-548576.000000 8388608.000000</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>32768</MatrixWidth>
                <MatrixHeight>32768</MatrixHeight>
            </TileMatrix>
        </TileMatrixSet>
        <TileMatrixSet>
            <ows:Identifier>WGS84_Pseudo-Mercator</ows:Identifier>
            <ows:BoundingBox crs="urn:ogc:def:crs:EPSG:6.3:3857">
                <ows:LowerCorner>-20037508.342789 -20037508.342789</ows:LowerCorner>
                <ows:UpperCorner>20037508.342789 20037508.342789</ows:UpperCorner>
            </ows:BoundingBox>
            <ows:SupportedCRS>urn:ogc:def:crs:EPSG:6.3:3857</ows:SupportedCRS>
            <TileMatrix>
                <ows:Identifier>0</ows:Identifier>
                <ScaleDenominator>559082264.02871787548065185547</ScaleDenominator>
                <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>1</MatrixWidth>
                <MatrixHeight>1</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>1</ows:Identifier>
                <ScaleDenominator>279541132.01435887813568115234</ScaleDenominator>
                <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>2</MatrixWidth>
                <MatrixHeight>2</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>2</ows:Identifier>
                <ScaleDenominator>139770566.00717940926551818848</ScaleDenominator>
                <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>4</MatrixWidth>
                <MatrixHeight>4</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>3</ows:Identifier>
                <ScaleDenominator>69885283.00358971953392028809</ScaleDenominator>
                <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>8</MatrixWidth>
                <MatrixHeight>8</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>4</ows:Identifier>
                <ScaleDenominator>34942641.50179485976696014404</ScaleDenominator>
                <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>16</MatrixWidth>
                <MatrixHeight>16</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>5</ows:Identifier>
                <ScaleDenominator>17471320.75089742988348007202</ScaleDenominator>
                <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>32</MatrixWidth>
                <MatrixHeight>32</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>6</ows:Identifier>
                <ScaleDenominator>8735660.37544871494174003601</ScaleDenominator>
                <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>64</MatrixWidth>
                <MatrixHeight>64</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>7</ows:Identifier>
                <ScaleDenominator>4367830.18772435747087001801</ScaleDenominator>
                <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>128</MatrixWidth>
                <MatrixHeight>128</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>8</ows:Identifier>
                <ScaleDenominator>2183915.09386217873543500900</ScaleDenominator>
                <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>256</MatrixWidth>
                <MatrixHeight>256</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>9</ows:Identifier>
                <ScaleDenominator>1091957.54693108866922557354</ScaleDenominator>
                <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>512</MatrixWidth>
                <MatrixHeight>512</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>10</ows:Identifier>
                <ScaleDenominator>545978.77346554468385875225</ScaleDenominator>
                <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>1024</MatrixWidth>
                <MatrixHeight>1024</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>11</ows:Identifier>
                <ScaleDenominator>272989.38673277228372171521</ScaleDenominator>
                <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>2048</MatrixWidth>
                <MatrixHeight>2048</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>12</ows:Identifier>
                <ScaleDenominator>136494.69336638617096468806</ScaleDenominator>
                <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>4096</MatrixWidth>
                <MatrixHeight>4096</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>13</ows:Identifier>
                <ScaleDenominator>68247.34668319307093042880</ScaleDenominator>
                <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>8192</MatrixWidth>
                <MatrixHeight>8192</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>14</ows:Identifier>
                <ScaleDenominator>34123.67334159654274117202</ScaleDenominator>
                <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>16384</MatrixWidth>
                <MatrixHeight>16384</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>15</ows:Identifier>
                <ScaleDenominator>17061.83667079827137058601</ScaleDenominator>
                <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>32768</MatrixWidth>
                <MatrixHeight>32768</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>16</ows:Identifier>
                <ScaleDenominator>8530.91833539913568529300</ScaleDenominator>
                <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>65536</MatrixWidth>
                <MatrixHeight>65536</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>17</ows:Identifier>
                <ScaleDenominator>4265.45916769956784264650</ScaleDenominator>
                <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>131072</MatrixWidth>
                <MatrixHeight>131072</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>18</ows:Identifier>
                <ScaleDenominator>2132.72958384978392132325</ScaleDenominator>
                <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <MatrixWidth>262144</MatrixWidth>
                <MatrixHeight>262144</MatrixHeight>
            </TileMatrix>
        </TileMatrixSet>
    </Contents>
</Capabilities>
`
