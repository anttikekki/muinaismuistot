export interface ViabundusFeatureProperties {
  ID: number
  Type: "land" | "ferry" | "water"
  Certainty: 1 | 2 | 3
  Zoomlevel: 1 | 2 | 3 | 4
  From: string
  To: string
  Comment_ID: string
  Length: number
  From_Node: number
  To_Node: number
  Ready: "y" | "n"
}
