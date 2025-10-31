export function formatTime(isoString: string | undefined): string {
  if (!isoString) return "—"

  try {
    const date = new Date(isoString)
    return new Intl.DateTimeFormat("es-BO", {
      timeZone: "America/La_Paz",
      dateStyle: "short",
      timeStyle: "medium",
    }).format(date)
  } catch {
    return "—"
  }
}

export function calculateMinutes(start: string | undefined, end: string | undefined): number | null {
  if (!start || !end) return null

  try {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diff = (endDate.getTime() - startDate.getTime()) / 60000
    return Math.round(diff * 10) / 10
  } catch {
    return null
  }
}

export function formatMinutes(minutes: number | null): string {
  if (minutes === null) return "—"
  return `${minutes.toFixed(1)}`
}
