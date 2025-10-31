"use client"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import type { Registro } from "@/lib/types"
import { exportToCSV } from "@/lib/csv-utils"
import { AppHeader } from "@/components/app-header"
import { Kpis } from "@/components/kpis"
import { FormRegistro } from "@/components/form-registro"
import { ListaRegistros } from "@/components/lista-registros"
import { BulkActionsBar } from "@/components/bulk-actions-bar"
import { ConfirmModal } from "@/components/confirm-modal"
import { ObservacionModal } from "@/components/observacion-modal"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [registros, setRegistros] = useState<Registro[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [observacionModal, setObservacionModal] = useState<{
    open: boolean
    registroId: string | null
  }>({
    open: false,
    registroId: null,
  })
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean
    title: string
    description: string
    onConfirm: () => void
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  })
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState<"activos" | "general">("activos")

  const nextClientNumber = registros.length + 1

  const addRegistro = (cliente: string, observacion: string) => {
    const nuevoRegistro: Registro = {
      id: uuidv4(),
      cliente,
      observacion: observacion || undefined,
    }
    setRegistros([...registros, nuevoRegistro])
    toast({
      title: "Registro agregado",
      description: `Cliente ${cliente} agregado correctamente.`,
    })
  }

  const mark = (id: string, tipo: "llegada" | "servicio" | "fin") => {
    if (tipo === "fin") {
      setObservacionModal({ open: true, registroId: id })
      return
    }

    setRegistros(
      registros.map((reg) => {
        if (reg.id === id) {
          const now = new Date().toISOString()
          if (tipo === "llegada") return { ...reg, horaLlegada: now }
          if (tipo === "servicio") return { ...reg, horaServicio: now }
        }
        return reg
      }),
    )
    toast({
      title: "Hora marcada",
      description: `Hora de ${tipo} registrada.`,
    })
  }

  const saveObservacionAndFinish = (observacion: string) => {
    if (!observacionModal.registroId) return

    const now = new Date().toISOString()
    setRegistros(
      registros.map((reg) => {
        if (reg.id === observacionModal.registroId) {
          return { ...reg, horaFin: now, observacion }
        }
        return reg
      }),
    )

    toast({
      title: "Registro finalizado",
      description: "El registro ha sido completado y movido a la pestaña General.",
    })

    setObservacionModal({ open: false, registroId: null })
  }

  const markBatch = (tipo: "llegada" | "servicio" | "fin") => {
    const now = new Date().toISOString()
    const loteId = uuidv4()

    setRegistros(
      registros.map((reg) => {
        if (selectedIds.has(reg.id)) {
          if (tipo === "llegada" && !reg.horaLlegada) {
            return { ...reg, horaLlegada: now, loteId }
          }
          if (tipo === "servicio" && !reg.horaServicio) {
            return { ...reg, horaServicio: now, loteId }
          }
          if (tipo === "fin" && !reg.horaFin) {
            return { ...reg, horaFin: now, loteId }
          }
        }
        return reg
      }),
    )

    setSelectedIds(new Set())
    toast({
      title: "Acción masiva completada",
      description: `Hora de ${tipo} marcada para ${selectedIds.size} registros.`,
    })
  }

  const removeOne = (id: string) => {
    setConfirmModal({
      open: true,
      title: "¿Eliminar registro?",
      description: "Esta acción no se puede deshacer.",
      onConfirm: () => {
        setRegistros(registros.filter((r) => r.id !== id))
        setSelectedIds((prev) => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
        toast({
          title: "Registro eliminado",
          description: "El registro ha sido eliminado correctamente.",
        })
        setConfirmModal({ ...confirmModal, open: false })
      },
    })
  }

  const removeBatch = () => {
    setConfirmModal({
      open: true,
      title: `¿Eliminar ${selectedIds.size} registros?`,
      description: "Esta acción no se puede deshacer.",
      onConfirm: () => {
        setRegistros(registros.filter((r) => !selectedIds.has(r.id)))
        setSelectedIds(new Set())
        toast({
          title: "Registros eliminados",
          description: `${selectedIds.size} registros eliminados correctamente.`,
        })
        setConfirmModal({ ...confirmModal, open: false })
      },
    })
  }

  const clearAll = () => {
    setRegistros([])
    setSelectedIds(new Set())
    toast({
      title: "Todos los registros eliminados",
      description: "La lista ha sido limpiada completamente.",
    })
  }

  const handleExport = () => {
    if (registros.length === 0) {
      toast({
        title: "No hay datos",
        description: "No hay registros para exportar.",
        variant: "destructive",
      })
      return
    }
    exportToCSV(registros)
    toast({
      title: "CSV exportado",
      description: "El archivo ha sido descargado correctamente.",
    })
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const toggleSelectAll = (registrosActuales: Registro[]) => {
    if (selectedIds.size === registrosActuales.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(registrosActuales.map((r) => r.id)))
    }
  }

  const updateObservacion = (id: string, observacion: string) => {
    setRegistros(registros.map((reg) => (reg.id === id ? { ...reg, observacion } : reg)))
    toast({
      title: "Observación actualizada",
      description: "La observación ha sido guardada.",
    })
  }

  const registrosActivos = registros.filter((r) => !r.horaFin)
  const todosLosRegistros = registros

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader onExport={handleExport} onClearAll={clearAll} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <Kpis registros={registros} />
        <FormRegistro onAdd={addRegistro} nextClientNumber={nextClientNumber} />

        <Tabs
          defaultValue="activos"
          className="w-full"
          onValueChange={(value) => setActiveTab(value as "activos" | "general")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="activos">Activos ({registrosActivos.length})</TabsTrigger>
            <TabsTrigger value="general">General ({todosLosRegistros.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="activos" className="mt-4">
            <ListaRegistros
              registros={registrosActivos}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={() => toggleSelectAll(registrosActivos)}
              onMark={mark}
              onDelete={removeOne}
              onUpdateObservacion={updateObservacion}
            />
          </TabsContent>

          <TabsContent value="general" className="mt-4">
            <ListaRegistros
              registros={todosLosRegistros}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={() => toggleSelectAll(todosLosRegistros)}
              onMark={mark}
              onDelete={removeOne}
              onUpdateObservacion={updateObservacion}
            />
          </TabsContent>
        </Tabs>
      </main>

      <BulkActionsBar
        selectedCount={selectedIds.size}
        onMarkBatch={markBatch}
        onDeleteBatch={removeBatch}
        showOnlyDelete={activeTab === "general"}
      />

      <ConfirmModal
        open={confirmModal.open}
        onOpenChange={(open) => setConfirmModal({ ...confirmModal, open })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
      />

      <ObservacionModal
        open={observacionModal.open}
        onOpenChange={(open) => setObservacionModal({ ...observacionModal, open })}
        onSave={saveObservacionAndFinish}
      />

      <Toaster />
    </div>
  )
}
