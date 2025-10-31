"use client"

import { Button } from "@/components/ui/button"
import { Clock, Play, CheckCircle, Trash2 } from "lucide-react"

interface BulkActionsBarProps {
  selectedCount: number
  onMarkBatch: (tipo: "llegada" | "servicio" | "fin") => void
  onDeleteBatch: () => void
  showOnlyDelete?: boolean
}

export function BulkActionsBar({
  selectedCount,
  onMarkBatch,
  onDeleteBatch,
  showOnlyDelete = false,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg p-3 z-50">
      <div className="container mx-auto">
        <p className="text-sm font-medium mb-3 text-foreground">
          {selectedCount} {selectedCount === 1 ? "registro seleccionado" : "registros seleccionados"}
        </p>
        {showOnlyDelete ? (
          <Button onClick={onDeleteBatch} className="h-12 font-semibold w-full" variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button onClick={() => onMarkBatch("llegada")} className="h-12 font-semibold" variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Marcar Llegada
            </Button>
            <Button onClick={() => onMarkBatch("servicio")} className="h-12 font-semibold" variant="outline">
              <Play className="h-4 w-4 mr-2" />
              Marcar Inicio
            </Button>
            <Button onClick={() => onMarkBatch("fin")} className="h-12 font-semibold" variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar Fin
            </Button>
            <Button onClick={onDeleteBatch} className="h-12 font-semibold" variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
