// Cohérence entre les listes du formulaire (capacités, types) et ce que le
// catalogue sait valoriser. Un décalage donnerait une option du formulaire
// sans tarif, ou un tarif jamais utilisable.

const numbers = (src, constName) => {
  const m = src.match(new RegExp(`const\\s+${constName}[^=]*=\\s*\\[([^\\]]*)\\]`))
  return m ? (m[1].match(/\d+/g) ?? []).map(Number) : null
}

const unionNumbers = (src, typeName) => {
  const m = src.match(new RegExp(`export type ${typeName}\\s*=\\s*([^\\n]+)`))
  return m ? (m[1].match(/\d+/g) ?? []).map(Number) : null
}

const unionStrings = (src, typeName) => {
  const m = src.match(new RegExp(`export type ${typeName}\\s*=\\s*([^\\n]+)`))
  return m ? (m[1].match(/'([^']+)'/g) ?? []).map((s) => s.replace(/'/g, '')) : null
}

const keysOf = (src, constName) => {
  const start = src.indexOf(`export const ${constName}`)
  if (start === -1) return null
  const body = src.slice(start)
  return [...body.matchAll(/^\s{2}(ddr3|ddr4|ddr5|hdd|ssd|nvme):\s*\{/gm)].map((m) => m[1])
}

const diff = (a, b) => a.filter((x) => !b.includes(x))

/**
 * @param {{types:string, ramFields:string, storageList:string, ram:string, storage:string}} sources contenus des fichiers
 * @returns {Array<{kind:string, detail:string}>}
 */
export function checkFormCoverage({ types, ramFields, storageList, ram, storage }) {
  const issues = []
  const push = (detail) => issues.push({ kind: 'formulaire-incoherent', detail })

  const ramCaps = unionNumbers(types, 'RamCapacity')
  const formRamCaps = numbers(ramFields, 'CAPACITIES')
  if (ramCaps && formRamCaps) {
    const missing = diff(ramCaps, formRamCaps)
    const extra = diff(formRamCaps, ramCaps)
    if (missing.length) push(`capacités RAM du type absentes du formulaire : ${missing.join(', ')} Go`)
    if (extra.length) push(`capacités RAM du formulaire hors du type : ${extra.join(', ')} Go`)
  } else push('capacités RAM illisibles (types ou RamFields.tsx)')

  const stCaps = unionNumbers(types, 'StorageCapacity')
  const formStCaps = numbers(storageList, 'CAPACITIES')
  if (stCaps && formStCaps) {
    const missing = diff(stCaps, formStCaps)
    const extra = diff(formStCaps, stCaps)
    if (missing.length) push(`capacités de stockage du type absentes du formulaire : ${missing.join(', ')} Go`)
    if (extra.length) push(`capacités de stockage du formulaire hors du type : ${extra.join(', ')} Go`)
  } else push('capacités de stockage illisibles (types ou StorageList.tsx)')

  const ramTypes = unionStrings(types, 'RamType')
  const ramKeys = keysOf(ram, 'RAM_TYPE_PRICING')
  if (ramTypes && ramKeys) {
    const noRate = diff(ramTypes, ramKeys)
    if (noRate.length) push(`types de RAM sans tarif : ${noRate.join(', ')}`)
  } else push('types de RAM ou tarifs illisibles')

  const stTypes = unionStrings(types, 'StorageType')
  const stKeys = keysOf(storage, 'STORAGE_TYPE_PRICING')
  if (stTypes && stKeys) {
    const noRate = diff(stTypes, stKeys)
    if (noRate.length) push(`types de stockage sans tarif : ${noRate.join(', ')}`)
  } else push('types de stockage ou tarifs illisibles')

  return issues
}
