export const aggregationEnableThreshold = 40_000
export const aggregationDisableThreshold = 20_000

export function nextAggregationMode(
  currentlyAggregated: boolean,
  activePointCount: number,
  disableThreshold = aggregationDisableThreshold,
  enableThreshold = aggregationEnableThreshold,
): boolean {
  if (disableThreshold >= enableThreshold) throw new Error("Aggregation thresholds must define hysteresis")
  if (currentlyAggregated) return activePointCount >= disableThreshold
  return activePointCount > enableThreshold
}
