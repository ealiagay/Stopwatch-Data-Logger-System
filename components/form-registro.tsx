"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"

interface FormRegistroProps {
  onAdd: (cliente: string, observacion: string) => void
  nextClientNumber: number
}

export function FormRegistro({ onAdd, nextClientNumber }: FormRegistroProps) {
  const handleAdd = () => {
    onAdd(`${nextClientNumber}`, "")
  }

  return (
    <Card className="p-4 md:p-6">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Alta Rápida</h2>
      <Button onClick={handleAdd} className="h-12 w-full font-semibold">
        <Plus className="h-5 w-5 mr-2" />
        Agregar
      </Button>
    </Card>
  )
}
