"use client"

import { Card } from "@/components/ui/card"
import type { Registro } from "@/lib/types"
import { calculateMinutes } from "@/lib/time-utils"
import { Users, Clock, Timer, TrendingUp } from "lucide-react"

interface KpisProps {
  registros: Registro[]
}

export function Kpis({ registros }: KpisProps) {
  const total = registros.length

  const esperas = registros
    .map((r) => calculateMinutes(r.horaLlegada, r.horaServicio))
    .filter((v): v is number => v !== null)

  const atenciones = registros
    .map((r) => calculateMinutes(r.horaServicio, r.horaFin))
    .filter((v): v is number => v !== null)

  const totales = registros
    .map((r) => calculateMinutes(r.horaLlegada, r.horaFin))
    .filter((v): v is number => v !== null)

  const esperaPromedio = esperas.length > 0 ? (esperas.reduce((a, b) => a + b, 0) / esperas.length).toFixed(1) : "—"

  const atencionPromedio =
    atenciones.length > 0 ? (atenciones.reduce((a, b) => a + b, 0) / atenciones.length).toFixed(1) : "—"

  const totalPromedio = totales.length > 0 ? (totales.reduce((a, b) => a + b, 0) / totales.length).toFixed(1) : "—"

  const esperaMaxima = esperas.length > 0 ? Math.max(...esperas).toFixed(1) : "—"

  const kpis = [
    { label: "Total Registros", value: total, icon: Users, color: "text-primary" },
    { label: "Espera Promedio", value: `${esperaPromedio} min`, icon: Clock, color: "text-accent" },
    { label: "Atención Promedio", value: `${atencionPromedio} min`, icon: Timer, color: "text-accent" },
    { label: "Total Promedio", value: `${totalPromedio} min`, icon: Timer, color: "text-accent" },
    { label: "Máxima Espera", value: `${esperaMaxima} min`, icon: TrendingUp, color: "text-destructive" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
      {kpis.map((kpi, idx) => (
        <Card key={idx} className="p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              <span className="text-xs text-muted-foreground">{kpi.label}</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-foreground">{kpi.value}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
