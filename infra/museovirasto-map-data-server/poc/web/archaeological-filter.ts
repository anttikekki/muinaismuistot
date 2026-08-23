export const archaeologicalTypes = [
  "ei määritelty",
  "alusten hylyt",
  "asuinpaikat",
  "hautapaikat",
  "kirkkorakenteet",
  "kivirakenteet",
  "kulkuväylät",
  "kultti- ja tarinapaikat",
  "luonnonmuodostumat",
  "löytöpaikat",
  "maarakenteet",
  "muinaisjäännösryhmät",
  "puolustusvarustukset",
  "puurakenteet",
  "raaka-aineen hankintapaikat",
  "tapahtumapaikat",
  "teollisuuskohteet",
  "taide, muistomerkit",
  "työ- ja valmistuspaikat",
] as const

export const archaeologicalDatings = [
  "moniperiodinen",
  "esihistoriallinen",
  "kivikautinen",
  "varhaismetallikautinen",
  "pronssikautinen",
  "rautakautinen",
  "rautakautinen ja/tai keskiaikainen",
  "keskiaikainen",
  "historiallinen",
  "moderni",
  "ajoittamaton",
  "ei määritelty",
] as const

export type ArchaeologicalFilter = {
  selectedTypes: ReadonlySet<string>
  selectedDatings: ReadonlySet<string>
  subtype: string
}

export type ArchaeologicalFilterProperties = {
  typesRaw: string
  subtypesRaw: string
  datingsRaw: string
}

export function matchesArchaeologicalFilter(
  properties: ArchaeologicalFilterProperties,
  filter: ArchaeologicalFilter,
): boolean {
  if (filter.selectedTypes.size === 0 || filter.selectedDatings.size === 0) return false

  const typeMatches =
    filter.selectedTypes.size === archaeologicalTypes.length ||
    [...filter.selectedTypes].some((value) => properties.typesRaw.includes(value))
  if (!typeMatches) return false

  const datingMatches =
    filter.selectedDatings.size === archaeologicalDatings.length ||
    [...filter.selectedDatings].some((value) => properties.datingsRaw.includes(value))
  if (!datingMatches) return false

  const subtype = normalize(filter.subtype)
  return subtype === "" || normalize(properties.subtypesRaw).includes(subtype)
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase("fi-FI")
}
