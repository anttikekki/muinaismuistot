export const toggleSelection = function <T>(
  value: T,
  values: T[]
): T[] {
  if (values.includes(value)) {
    return values.filter((v) => v !== value)
  } else {
    return [...values, value]
  }
}
