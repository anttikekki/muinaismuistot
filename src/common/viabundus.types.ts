export enum ViabundusFeatureType {
  road = "road",
  place = "place",
  townOutline = "townOutline"
}

type Description =
  | string
  | undefined
  | { fi: string | undefined; en: string | undefined }

export enum ViabundusSubFeatureType {
  settlement = "settlement",
  town = "town",
  fair = "fair",
  toll = "toll",
  bridge = "bridge",
  stable = "stable",
  ferry = "ferry",
  harbour = "harbour",
  lock = "lock"
}

type ViabundusSubFeatureBase = {
  from: string | undefined
  to: string | undefined
  description: Description
  literature: string[] | undefined
}

export type ViabundusSubFeatureSettlement = ViabundusSubFeatureBase & {
  type: ViabundusSubFeatureType.settlement
}

export type ViabundusSubFeatureTown = ViabundusSubFeatureBase & {
  type: ViabundusSubFeatureType.town
}

export type ViabundusSubFeatureFair = ViabundusSubFeatureBase & {
  type: ViabundusSubFeatureType.fair
  gregorianCalendar: string | undefined
}

export type ViabundusSubFeatureToll = ViabundusSubFeatureBase & {
  type: ViabundusSubFeatureType.toll
  owner: string | undefined
}

export type ViabundusSubFeatureBridge = ViabundusSubFeatureBase & {
  type: ViabundusSubFeatureType.bridge
}

export type ViabundusSubFeatureStable = ViabundusSubFeatureBase & {
  type: ViabundusSubFeatureType.stable
  duration: string | undefined
}

export type ViabundusSubFeatureFerry = ViabundusSubFeatureBase & {
  type: ViabundusSubFeatureType.ferry
}

export type ViabundusSubFeatureHarbour = ViabundusSubFeatureBase & {
  type: ViabundusSubFeatureType.harbour
}

export type ViabundusSubFeatureLock = ViabundusSubFeatureBase & {
  type: ViabundusSubFeatureType.lock
}

export type ViabundusSubFeature =
  | ViabundusSubFeatureSettlement
  | ViabundusSubFeatureTown
  | ViabundusSubFeatureFair
  | ViabundusSubFeatureToll
  | ViabundusSubFeatureBridge
  | ViabundusSubFeatureStable
  | ViabundusSubFeatureFerry
  | ViabundusSubFeatureHarbour
  | ViabundusSubFeatureLock

export type ViabunduPopulation = {
  year: number
  /**
   * 0 = < 1000
   * 1 = 1000
   * 2 = 2000
   */
  inhabitants: number
}

export type ViabundusPlaceFeatureProperties = {
  type: ViabundusFeatureType.place
  id: number
  name: string
  subfeatures: ViabundusSubFeature[]
  literature: string[] | undefined
  population: ViabunduPopulation[] | undefined
}

export enum ViabundusRoadType {
  canal = "canal",
  coast = "coast",
  ferry = "ferry",
  land = "land",
  river = "river",
  winter = "winter"
}

export type ViabundusRoadFeatureProperties = {
  type: ViabundusFeatureType.road
  id: number
  roadType: ViabundusRoadType
  certainty: 1 | 2 | 3
  fromyear: number | undefined
  toyear: number | undefined
  descriptions: Description
}

export type ViabundusTownOutlineFeatureProperties = {
  type: ViabundusFeatureType.townOutline
  nodesid: number
  fromyear: number | undefined
  toyear: number | undefined
}

export type ViabundusFeatureProperties =
  | ViabundusPlaceFeatureProperties
  | ViabundusRoadFeatureProperties
  | ViabundusTownOutlineFeatureProperties
