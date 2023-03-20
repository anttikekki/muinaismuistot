let year = 0
let result = []

while (year <= 13500) {
  result.push(
    `{ layer:\"issjohav_${year === 0 ? 1 : year}\", year: ${1950 - year}}`
  )
  year += 100
}

console.log(`[${result.join(", ")}]`)
