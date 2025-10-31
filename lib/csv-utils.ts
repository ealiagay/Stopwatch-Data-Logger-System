import type { Registro } from "./types"
import { calculateMinutes } from "./time-utils"

export function exportToCSV(registros: Registro[]) {
  const headers = [
    "cliente",
    "horaLlegada",
    "horaInicioServicio",
    "horaFinServicio",
    "observacion",
    "esperaMin",
    "atencionMin",
    "totalMin",
    "loteId",
  ]

  const rows = registros.map((reg) => {
    const esperaMin = calculateMinutes(reg.horaLlegada, reg.horaServicio)
    const atencionMin = calculateMinutes(reg.horaServicio, reg.horaFin)
    const totalMin = calculateMinutes(reg.horaLlegada, reg.horaFin)

    return [
      reg.cliente,
      reg.horaLlegada || "",
      reg.horaServicio || "",
      reg.horaFin || "",
      reg.observacion || "",
      esperaMin !== null ? esperaMin.toString() : "",
      atencionMin !== null ? atencionMin.toString() : "",
      totalMin !== null ? totalMin.toString() : "",
      reg.loteId || "",
    ]
  })

  const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  const now = new Date()
  const filename = `fila_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}.csv`

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
