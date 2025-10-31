"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ObservacionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (observacion: string) => void
}

export function ObservacionModal({ open, onOpenChange, onSave }: ObservacionModalProps) {
  const [observacion, setObservacion] = useState("")

  const handleSave = () => {
    onSave(observacion)
    setObservacion("")
  }

  const handleCancel = () => {
    setObservacion("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Finalizar Registro</DialogTitle>
          <DialogDescription>
            Agrega una observación antes de finalizar el registro. Este registro se moverá a la pestaña General.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="observacion">Observación</Label>
            <Textarea
              id="observacion"
              placeholder="Escribe una observación (opcional)..."
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar y Finalizar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
