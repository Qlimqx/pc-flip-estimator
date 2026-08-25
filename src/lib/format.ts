export function formatEuro(value: number): string {
  return `${value.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €`
}

export function formatEuroPrecise(value: number): string {
  return `${value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
}

export function formatPct(value: number): string {
  return `${Math.round(value * 100)} %`
}
