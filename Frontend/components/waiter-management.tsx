"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RestaurantService } from "@/services/restaurant-service"
import { useToast } from "@/hooks/use-toast"
import { UserPlus, RefreshCw, User, Clock } from "lucide-react"

interface Waiter {
  id: number
  name: string
  active: boolean
  assignedTables: number[]
  ordersCompleted: number
}

export default function WaiterManagement() {
  const [waiters, setWaiters] = useState<Waiter[]>([])
  const [newWaiterName, setNewWaiterName] = useState("")
  const [currentShift, setCurrentShift] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      const waitersData = await RestaurantService.getWaiters()
      setWaiters(waitersData)

      const shiftData = await RestaurantService.getCurrentShift()

      if (Array.isArray(shiftData)) {
        const validShift = shiftData.filter((item) => typeof item === "string" && item.length > 0)
        setCurrentShift(validShift)
      } else {
        console.warn("Datos de turno inválidos:", shiftData)
        setCurrentShift([])
      }
    }

    fetchData()
  }, [])

  const addWaiter = async () => {
    if (!newWaiterName.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingrese un nombre para el mesero",
        variant: "destructive",
      })
      return
    }

    try {
      const newWaiter = await RestaurantService.addWaiter(newWaiterName)
      setWaiters([...waiters, newWaiter])
      setNewWaiterName("")

      toast({
        title: "Mesero agregado",
        description: `${newWaiterName} ha sido agregado al sistema`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el mesero",
        variant: "destructive",
      })
    }
  }

  const toggleWaiterStatus = async (waiterId: number, active: boolean) => {
    try {
      await RestaurantService.updateWaiterStatus(waiterId, !active)

      setWaiters(waiters.map((waiter) => (waiter.id === waiterId ? { ...waiter, active: !active } : waiter)))

      const waiter = waiters.find((w) => w.id === waiterId)
      if (waiter) {
        toast({
          title: "Estado actualizado",
          description: `${waiter.name} ahora está ${!active ? "activo" : "inactivo"}`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del mesero",
        variant: "destructive",
      })
    }
  }

  const rotateShift = async () => {
    try {
      const newShift = await RestaurantService.rotateWaiterShift()

      setCurrentShift(newShift)

      setTimeout(async () => {
        const freshShift = await RestaurantService.getCurrentShift()
        setCurrentShift(freshShift)
      }, 500)

      toast({
        title: "Turno rotado",
        description: "La rotación de turnos ha sido actualizada",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo rotar el turno",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gray-800 border-cyan-700 shadow-md shadow-cyan-500/10">
        <CardHeader>
          <CardTitle className="text-cyan-400">Gestión de Meseros</CardTitle>
          <CardDescription className="text-gray-400">
            Administre el personal de servicio del restaurante
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {waiters.map((waiter) => (
                <Card key={waiter.id} className="bg-gray-900 border-gray-700 overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <h3 className="font-medium text-white">{waiter.name}</h3>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge
                            variant={waiter.active ? "default" : "outline"}
                            className={waiter.active ? "bg-cyan-700 text-white" : "text-gray-400 border-gray-600"}
                          >
                            {waiter.active ? "Activo" : "Inactivo"}
                          </Badge>
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
                            {waiter.assignedTables.length} mesas
                          </Badge>
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
                            {waiter.ordersCompleted} órdenes
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant={waiter.active ? "outline" : "default"}
                        size="sm"
                        onClick={() => toggleWaiterStatus(waiter.id, waiter.active)}
                        className={
                          waiter.active
                            ? "border-cyan-700 text-cyan-400 hover:bg-cyan-900/20"
                            : "bg-cyan-700 text-white hover:bg-cyan-600"
                        }
                      >
                        {waiter.active ? "Desactivar" : "Activar"}
                      </Button>
                    </div>

                    {waiter.assignedTables.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-500">Mesas asignadas: {waiter.assignedTables.join(", ")}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {waiters.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay meseros registrados.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex-col space-y-4">
          <div className="grid grid-cols-4 gap-2 w-full">
            <div className="col-span-3">
              <Input
                placeholder="Nombre del nuevo mesero"
                value={newWaiterName}
                onChange={(e) => setNewWaiterName(e.target.value)}
                className="bg-gray-900 border-gray-700 text-gray-200 placeholder:text-gray-500"
              />
            </div>
            <Button
              onClick={addWaiter}
              className="bg-cyan-700 hover:bg-cyan-600 text-white shadow-md shadow-cyan-500/20"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card className="bg-gray-800 border-cyan-700 shadow-md shadow-cyan-500/10">
        <CardHeader>
          <CardTitle className="text-cyan-400">Rotación de Turnos</CardTitle>
          <CardDescription className="text-gray-400">
            Sistema de rotación circular para asignación equitativa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-md p-4 border-gray-700 bg-gray-900">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium flex items-center text-white">
                  <Clock className="h-4 w-4 mr-2 text-cyan-400" />
                  Turno Actual
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={rotateShift}
                  disabled={waiters.filter((w) => w.active).length < 2}
                  className="border-cyan-700 text-cyan-400 hover:bg-cyan-900/20"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Rotar Turno
                </Button>
              </div>

              {currentShift && currentShift.length > 0 ? (
                <div className="relative">
                  <div className="flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border-4 border-cyan-900 flex items-center justify-center relative">
                      {currentShift.length > 0 && typeof currentShift[0] === "string" && (
                        <div className="text-center">
                          <p className="font-bold text-cyan-400">Actual</p>
                          <p className="text-white">{currentShift[0]}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-center text-gray-500">
                      Próximo:{" "}
                      {currentShift.length > 1 && typeof currentShift[1] === "string" ? currentShift[1] : "N/A"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">No hay meseros en el turno</div>
              )}
            </div>

            <div className="border rounded-md p-4 border-gray-700 bg-gray-900">
              <h3 className="font-medium mb-2 text-cyan-400">Información del Sistema</h3>
              <p className="text-sm text-gray-500">
                El sistema de rotación utiliza una lista circular para asignar equitativamente las nuevas mesas a los
                meseros activos. Cada vez que se rota el turno, el mesero al frente pasa al final de la lista.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
