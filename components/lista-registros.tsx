"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import type { Registro } from "@/lib/types"
import { formatTime, calculateMinutes, formatMinutes } from "@/lib/time-utils"
import { Clock, Play, CheckCircle, Trash2, Edit2 } from "lucide-react"
import { useState } from "react"

interface ListaRegistrosProps {
  registros: Registro[]
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  onMark: (id: string, tipo: "llegada" | "servicio" | "fin") => void
  onDelete: (id: string) => void
  onUpdateObservacion: (id: string, observacion: string) => void
}

export function ListaRegistros({
  registros,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onMark,
  onDelete,
  onUpdateObservacion,
}: ListaRegistrosProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const startEdit = (id: string, currentValue: string) => {
    setEditingId(id)
    setEditValue(currentValue)
  }

  const saveEdit = (id: string) => {
    onUpdateObservacion(id, editValue)
    setEditingId(null)
    setEditValue("")
  }

  const allSelected = registros.length > 0 && registros.every((r) => selectedIds.has(r.id))

  if (registros.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No hay registros. Agrega tu primer cliente.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 px-2">
        <Checkbox checked={allSelected} onCheckedChange={onToggleSelectAll} id="select-all" />
        <label htmlFor="select-all" className="text-sm font-medium text-foreground cursor-pointer">
          Seleccionar todos ({registros.length})
        </label>
      </div>

      {registros.map((registro) => {
        const espera = calculateMinutes(registro.horaLlegada, registro.horaServicio)
        const atencion = calculateMinutes(registro.horaServicio, registro.horaFin)
        const total = calculateMinutes(registro.horaLlegada, registro.horaFin)

        return (
          <Card key={registro.id} className="p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={selectedIds.has(registro.id)}
                onCheckedChange={() => onToggleSelect(registro.id)}
                className="mt-1"
              />

              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">Cliente {registro.cliente}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(registro.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Llegada:</span>
                    <p className="font-medium text-foreground">{formatTime(registro.horaLlegada)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Inicio:</span>
                    <p className="font-medium text-foreground">{formatTime(registro.horaServicio)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fin:</span>
                    <p className="font-medium text-foreground">{formatTime(registro.horaFin)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Espera:</span>
                    <p className="font-bold text-accent">{formatMinutes(espera)} min</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Atención:</span>
                    <p className="font-bold text-accent">{formatMinutes(atencion)} min</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total:</span>
                    <p className="font-bold text-primary">{formatMinutes(total)} min</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {editingId === registro.id ? (
                    <>
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder="Observación"
                        className="h-9 flex-1"
                      />
                      <Button size="sm" onClick={() => saveEdit(registro.id)} className="h-9">
                        Guardar
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="text-sm text-muted-foreground flex-1">
                        {registro.observacion || "Sin observación"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEdit(registro.id, registro.observacion || "")}
                        className="h-8 w-8"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onMark(registro.id, "llegada")}
                    disabled={!!registro.horaLlegada}
                    className="h-10"
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    Llegada
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onMark(registro.id, "servicio")}
                    disabled={!!registro.horaServicio}
                    className="h-10"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Inicio
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onMark(registro.id, "fin")}
                    disabled={!!registro.horaFin}
                    className="h-10"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Fin
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
