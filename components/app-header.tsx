"use client"

import { Button } from "@/components/ui/button"
import { Download, Trash2, Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AppHeaderProps {
  onExport: () => void
  onClearAll: () => void
}

export function AppHeader({ onExport, onClearAll }: AppHeaderProps) {
  const [isDark, setIsDark] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark")
    setIsDark(!isDark)
  }

  const handleClearAll = () => {
    onClearAll()
    setShowConfirm(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Cronómetro</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-10 w-10">
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="outline" size="sm" onClick={onExport} className="h-10 bg-transparent">
                <Download className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Exportar CSV</span>
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setShowConfirm(true)} className="h-10">
                <Trash2 className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Borrar Todo</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Borrar TODOS los registros?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente todos los registros y no se puede deshacer. ¿Estás completamente
              seguro?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sí, borrar todo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
