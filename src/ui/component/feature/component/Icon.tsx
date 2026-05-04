import React from "react"
import {
  isGeoJSONFeature,
  MapFeature
} from "../../../../common/mapFeature.types"
import {
  isMaalinnoitusKohdeFeature,
  isMaalinnoitusRajausFeature,
  isMaalinnoitusYksikkoFeature,
  MaalinnoitusKohdetyyppi,
  MaalinnoitusRajaustyyppi
} from "../../../../common/maalinnoitusHelsinki.types"
import { isAhvenanmaaFeature } from "../../../../common/ahvenanmaa.types"
import {
  AhvenanmaaLayer,
  FeatureLayer,
  HelsinkiLayer,
  MaisemanMuistiLayer,
  ModelLayer,
  MuseovirastoLayer,
  ViabundusLayer
} from "../../../../common/layers.types"
import { isMaisemanMuistiFeature } from "../../../../common/maisemanMuisti.types"
import {
  isViabundusPlaceFeature,
  isViabundusRoadFeature,
  isViabundusTownOutlineFeature,
  ViabundusFeatureType,
  ViabundusRoadCertainty,
  ViabundusRoadType
} from "../../../../common/viabundus.types"
import { getFeatureLayer } from "../../../../common/util/featureParser"

type IconParams = {
  uniqueId: string
  type: "square" | "circle" | "star" | "line" | "pentagon"
  fillColor?: string
  fillPattern?: "crosshatch"
  strokeColor: string
  dashed?: boolean
}

const Icon: React.FC<IconParams> = ({
  uniqueId,
  type,
  fillColor,
  fillPattern,
  strokeColor,
  dashed
}) => {
  const size = 25

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        marginRight: "5px"
      }}
    >
      {fillPattern === "crosshatch" && (
        <defs>
          <pattern
            id={`icon-crosshatch-${uniqueId}`}
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
          >
            <path d="M 0 8 L 8 0" stroke={fillColor} strokeWidth="1" />
            <path d="M 0 0 L 8 8" stroke={fillColor} strokeWidth="1" />
          </pattern>
        </defs>
      )}

      {type === "square" && (
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          fill={
            fillPattern === "crosshatch"
              ? `url(#icon-crosshatch-${uniqueId})`
              : fillColor
          }
          stroke={strokeColor}
          strokeWidth="2"
        />
      )}

      {type === "circle" && (
        <circle
          cx="12"
          cy="12"
          r="9"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
        />
      )}

      {type === "line" && (
        <line
          x1="4"
          y1="20"
          x2="20"
          y2="4"
          stroke={strokeColor}
          strokeWidth="3"
          strokeDasharray={dashed ? "4" : undefined}
          strokeLinecap="round"
        />
      )}

      {type === "star" && (
        <path
          d="M12 4L14.63 9.32L20.5 10.18L16.25 14.32L17.25 20.17L12 17.4L6.75 20.17L7.75 14.32L3.5 10.18L9.37 9.32L12 4Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      )}

      {type === "pentagon" && (
        <path
          d="M12 2.5L21.5 9.4L17.9 20.5H6.1L2.5 9.4L12 2.5Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

type LayerIconParams = {
  layer: FeatureLayer
  uniqueId?: string
}

export const LayerIcon: React.FC<LayerIconParams> = ({
  layer,
  uniqueId = layer
}) => {
  switch (layer) {
    case MuseovirastoLayer.Muinaisjaannokset_piste:
      return (
        <Icon
          uniqueId={uniqueId}
          type="circle"
          fillColor="#ff0000"
          strokeColor="#000000"
        />
      )
    case MuseovirastoLayer.Muinaisjaannokset_alue:
      return (
        <Icon
          uniqueId={uniqueId}
          type="square"
          fillColor="#ff0000"
          fillPattern="crosshatch"
          strokeColor="#ff0000"
        />
      )
    case MuseovirastoLayer.Muu_kulttuuriperintokohde_piste:
      return (
        <Icon
          uniqueId={uniqueId}
          type="circle"
          fillColor="#b67f4a"
          strokeColor="#000000"
        />
      )
    case MuseovirastoLayer.Muu_kulttuuriperintokohde_alue:
      return (
        <Icon
          uniqueId={uniqueId}
          type="square"
          fillColor="#b67f4a"
          fillPattern="crosshatch"
          strokeColor="#b67f4a"
        />
      )
    case MuseovirastoLayer.RKY_alue:
      return (
        <Icon
          uniqueId={uniqueId}
          type="square"
          fillColor="#006fff"
          fillPattern="crosshatch"
          strokeColor="#006fff"
        />
      )
    case MuseovirastoLayer.RKY_viiva:
      return <Icon uniqueId={uniqueId} type="line" strokeColor="#006fff" />
    case MuseovirastoLayer.RKY_piste:
      return (
        <Icon
          uniqueId={uniqueId}
          type="square"
          fillColor="#006fff"
          strokeColor="#000000"
        />
      )
    case MuseovirastoLayer.Maailmanperinto_alue:
      return (
        <Icon
          uniqueId={uniqueId}
          type="square"
          fillColor="#ffa901"
          fillPattern="crosshatch"
          strokeColor="#ffa901"
        />
      )
    case MuseovirastoLayer.Maailmanperinto_piste:
      return (
        <Icon
          uniqueId={uniqueId}
          type="pentagon"
          fillColor="#ffa901"
          strokeColor="#ffa901"
        />
      )
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
      return (
        <Icon
          uniqueId={uniqueId}
          type="square"
          fillColor="#37a800"
          fillPattern="crosshatch"
          strokeColor="#37a800"
        />
      )
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
      return (
        <Icon
          uniqueId={uniqueId}
          type="square"
          fillColor="#37a800"
          strokeColor="#000000"
        />
      )
    case MuseovirastoLayer.VARK_pisteet:
      return (
        <Icon
          uniqueId={uniqueId}
          type="circle"
          fillColor="#8401a8"
          strokeColor="#000000"
        />
      )
    case MuseovirastoLayer.VARK_alueet:
      return (
        <Icon
          uniqueId={uniqueId}
          type="square"
          fillColor="#8401a8"
          fillPattern="crosshatch"
          strokeColor="#8401a8"
        />
      )
    case MuseovirastoLayer.Löytöpaikka_piste:
      return (
        <Icon
          uniqueId={uniqueId}
          type="circle"
          fillColor="#ff7f02"
          strokeColor="#000000"
        />
      )
    case MuseovirastoLayer.Löytöpaikka_alue:
      return (
        <Icon
          uniqueId={uniqueId}
          type="square"
          fillColor="#ff7f02"
          fillPattern="crosshatch"
          strokeColor="#ff7f02"
        />
      )
    case MuseovirastoLayer.Havaintokohde_piste:
      return (
        <Icon
          uniqueId={uniqueId}
          type="square"
          fillColor="#ff0000"
          strokeColor="#ff0000"
        />
      )
    case MuseovirastoLayer.Havaintokohde_alue:
      return (
        <Icon
          uniqueId={uniqueId}
          type="square"
          fillColor="#aaaaaa"
          strokeColor="#000000"
        />
      )
    case MuseovirastoLayer.Luonnonmuodostuma_piste:
      return (
        <Icon
          uniqueId={uniqueId}
          type="circle"
          fillColor="#00c6ff"
          strokeColor="#000000"
        />
      )
    case MuseovirastoLayer.Luonnonmuodostuma_alue:
      return (
        <Icon
          uniqueId={uniqueId}
          type="square"
          fillColor="#00c6ff"
          fillPattern="crosshatch"
          strokeColor="#00c6ff"
        />
      )
    case MuseovirastoLayer.Mahdollinen_muinaisjäännös_piste:
      return (
        <Icon
          uniqueId={uniqueId}
          type="circle"
          fillColor="#cb00ff"
          strokeColor="#000000"
        />
      )
    case MuseovirastoLayer.Mahdollinen_muinaisjäännös_alue:
      return (
        <Icon
          uniqueId={uniqueId}
          type="square"
          fillColor="#cb00ff"
          fillPattern="crosshatch"
          strokeColor="#cb00ff"
        />
      )
    case MuseovirastoLayer.Muu_kohde_piste:
      return (
        <Icon
          uniqueId={uniqueId}
          type="circle"
          fillColor="#ffffff"
          strokeColor="#000000"
        />
      )
    case MuseovirastoLayer.Muu_kohde_alue:
      return (
        <Icon
          uniqueId={uniqueId}
          type="square"
          fillColor="#c0c0c0"
          fillPattern="crosshatch"
          strokeColor="#000000"
        />
      )
    case MuseovirastoLayer.PoistettuKiinteäMuijaisjäännösPiste:
      return (
        <Icon
          uniqueId={uniqueId}
          type="circle"
          fillColor="#908e8e"
          strokeColor="#000000"
        />
      )
    case MuseovirastoLayer.PoistettuKiinteäMuijaisjäännösAlue:
      return (
        <Icon
          uniqueId={uniqueId}
          type="square"
          fillColor="#908e8e"
          fillPattern="crosshatch"
          strokeColor="#908e8e"
        />
      )
    case MuseovirastoLayer.Alakohde_piste:
      return (
        <Icon
          uniqueId={uniqueId}
          type="star"
          fillColor="#ff0000"
          fillPattern="crosshatch"
          strokeColor="#000000"
        />
      )
    case AhvenanmaaLayer.Fornminnen:
    case AhvenanmaaLayer.MaritimaFornminnen:
      return (
        <Icon
          uniqueId={uniqueId}
          type="square"
          fillColor="#5b8846"
          strokeColor="#010101"
        />
      )
    case ModelLayer.ModelLayer:
      return ["images/3d_malli_square.png"]
    case MaisemanMuistiLayer.MaisemanMuisti:
      return (
        <Icon
          uniqueId={uniqueId}
          type="star"
          fillColor="#f1615b"
          strokeColor="#f1615b"
        />
      )
    case HelsinkiLayer.Maalinnoitus_yksikot:
      return (
        <Icon
          uniqueId={uniqueId}
          type="circle"
          fillColor="#000000"
          strokeColor="#000000"
        />
      )
    case HelsinkiLayer.Maalinnoitus_kohteet:
      return <Icon uniqueId={uniqueId} type="line" strokeColor="#934539" />
    case HelsinkiLayer.Maalinnoitus_rajaukset:
      return (
        <Icon
          uniqueId={uniqueId}
          type="square"
          fillColor="#eeecea"
          strokeColor="#000000"
        />
      )
    case ViabundusLayer.Viabundus:
      return (
        <img className="feature-icon" src="images/viabundus-kaupunki.png" />
      )
  }
  return null
}

type FeatureIconParams = {
  feature: MapFeature
  uniqueFeatureId: string
}

export const FeatureIcon: React.FC<FeatureIconParams> = ({
  feature,
  uniqueFeatureId
}) => {
  if (isGeoJSONFeature(feature)) {
    if (isMaalinnoitusKohdeFeature(feature)) {
      return (
        <MaalinnoitusFeatureIcon
          layer={HelsinkiLayer.Maalinnoitus_kohteet}
          type={feature.properties.kohdetyyppi}
          uniqueId={uniqueFeatureId}
        />
      )
    }
    if (
      isMaalinnoitusRajausFeature(feature) &&
      feature.properties.rajaustyyppi
    ) {
      return (
        <MaalinnoitusFeatureIcon
          layer={HelsinkiLayer.Maalinnoitus_rajaukset}
          type={feature.properties.rajaustyyppi}
          uniqueId={uniqueFeatureId}
        />
      )
    }
    if (isViabundusPlaceFeature(feature)) {
      const {
        Is_Town,
        Is_Settlement,
        Is_Bridge,
        Is_Ferry,
        Is_Fair,
        Is_Toll,
        Is_Harbour
      } = feature.properties
      return (
        <ViabundusFeatureIcon
          type={ViabundusFeatureType.place}
          Is_Town={Is_Town}
          Is_Settlement={Is_Settlement}
          Is_Bridge={Is_Bridge}
          Is_Ferry={Is_Ferry}
          Is_Fair={Is_Fair}
          Is_Toll={Is_Toll}
          Is_Harbour={Is_Harbour}
          uniqueId={uniqueFeatureId}
        />
      )
    }
    if (isViabundusRoadFeature(feature)) {
      const { roadType, certainty } = feature.properties
      return (
        <ViabundusFeatureIcon
          type={ViabundusFeatureType.road}
          roadType={roadType}
          certainty={certainty}
          uniqueId={uniqueFeatureId}
        />
      )
    }
    if (isViabundusTownOutlineFeature(feature)) {
      return (
        <ViabundusFeatureIcon
          type={ViabundusFeatureType.townOutline}
          uniqueId={uniqueFeatureId}
        />
      )
    }
  }

  const layer = getFeatureLayer(feature)
  return <LayerIcon layer={layer} uniqueId={uniqueFeatureId} />
}

type MaalinnoitusFeatureIconParams =
  | {
      layer: HelsinkiLayer.Maalinnoitus_kohteet
      type: MaalinnoitusKohdetyyppi
      uniqueId?: string
    }
  | {
      layer: HelsinkiLayer.Maalinnoitus_rajaukset
      type: MaalinnoitusRajaustyyppi
      uniqueId?: string
    }

export const MaalinnoitusFeatureIcon: React.FC<
  MaalinnoitusFeatureIconParams
> = ({ layer, type, uniqueId = `${layer}-${type}` }) => {
  switch (layer) {
    case HelsinkiLayer.Maalinnoitus_kohteet:
      switch (type) {
        case MaalinnoitusKohdetyyppi.Asema:
          return <Icon uniqueId={uniqueId} type="line" strokeColor="#934539" />
        case MaalinnoitusKohdetyyppi.Luola:
          return <Icon uniqueId={uniqueId} type="line" strokeColor="#0006ff" />
        case MaalinnoitusKohdetyyppi.Tykkipatteri:
          return <Icon uniqueId={uniqueId} type="line" strokeColor="#ff0204" />
        case MaalinnoitusKohdetyyppi.Tykkitie:
          return <Icon uniqueId={uniqueId} type="line" strokeColor="#680401" />
        default:
          return null
      }
    case HelsinkiLayer.Maalinnoitus_rajaukset:
      switch (type) {
        case MaalinnoitusRajaustyyppi.Tukikohta:
          return (
            <Icon
              uniqueId={uniqueId}
              type="square"
              fillColor="#eeecea"
              strokeColor="#000000"
            />
          )
        case MaalinnoitusRajaustyyppi.Puolustusasema:
          return (
            <Icon
              uniqueId={uniqueId}
              type="square"
              fillColor="#eeecea"
              strokeColor="#000000"
            />
          )
        default:
          return null
      }

    default:
      return null
  }
}

type ViabundusFeatureIconParams =
  | {
      type: ViabundusFeatureType.place
      Is_Town?: boolean
      Is_Settlement?: boolean
      Is_Bridge?: boolean
      Is_Ferry?: boolean
      Is_Fair?: boolean
      Is_Toll?: boolean
      Is_Harbour?: boolean
      uniqueId?: string
    }
  | {
      type: ViabundusFeatureType.road
      roadType: ViabundusRoadType
      certainty?: ViabundusRoadCertainty
      uniqueId?: string
    }
  | {
      type: ViabundusFeatureType.townOutline
      uniqueId?: string
    }

export const ViabundusFeatureIcon: React.FC<ViabundusFeatureIconParams> = (
  params
) => {
  switch (params.type) {
    case ViabundusFeatureType.place: {
      const {
        Is_Town,
        Is_Settlement,
        Is_Bridge,
        Is_Ferry,
        Is_Fair,
        Is_Toll,
        Is_Harbour
      } = params
      if (Is_Town) {
        return (
          <img className="feature-icon" src="images/viabundus-kaupunki.png" />
        )
      } else if (Is_Settlement) {
        return (
          <img
            className="feature-icon"
            src="images/viabundus-asuttu-paikka.png"
          />
        )
      } else if (Is_Bridge) {
        return <img className="feature-icon" src="images/viabundus-silta.png" />
      } else if (Is_Ferry) {
        return <img className="feature-icon" src="images/viabundus-lossi.png" />
      } else if (Is_Fair) {
        return (
          <img className="feature-icon" src="images/viabundus-markkinat.png" />
        )
      } else if (Is_Toll) {
        return <img className="feature-icon" src="images/viabundus-tulli.png" />
      } else if (Is_Harbour) {
        return (
          <img className="feature-icon" src="images/viabundus-satama.png" />
        )
      }
      return null
    }
    case ViabundusFeatureType.road: {
      const {
        type,
        roadType,
        certainty,
        uniqueId = `${type}-${roadType}-${certainty}`
      } = params
      switch (roadType) {
        case ViabundusRoadType.winter:
          return (
            <Icon
              uniqueId={uniqueId}
              type="line"
              strokeColor="#663300"
              dashed={true}
            />
          )
        case ViabundusRoadType.coast: {
          if (certainty === ViabundusRoadCertainty.Uncertain) {
            return (
              <Icon
                uniqueId={uniqueId}
                type="line"
                strokeColor="#017acc"
                dashed={true}
              />
            )
          }
          return <Icon uniqueId={uniqueId} type="line" strokeColor="#017acc" />
        }
        case ViabundusRoadType.land:
        default: {
          if (certainty === ViabundusRoadCertainty.Uncertain) {
            return (
              <Icon
                uniqueId={uniqueId}
                type="line"
                strokeColor="#cc0000"
                dashed={true}
              />
            )
          }
          return <Icon uniqueId={uniqueId} type="line" strokeColor="#cc0000" />
        }
      }
    }
    case ViabundusFeatureType.townOutline: {
      const { type, uniqueId = type } = params
      return (
        <Icon
          uniqueId={uniqueId}
          type="square"
          fillColor="#eedad8"
          strokeColor="#000000"
        />
      )
    }
    default:
      return null
  }
}
