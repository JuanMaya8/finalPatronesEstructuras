"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RestaurantService } from "@/services/restaurant-service"
import { useToast } from "@/hooks/use-toast"
import { Clock, CheckCircle2, ChefHat, Bell, AlertTriangle, Flame } from "lucide-react"

interface OrderItem {
  menuItemId: number
  name: string
  quantity: number
  notes: string
}

interface KitchenOrder {
  id: number
  tableNumber: number
  waiterName: string
  items: OrderItem[]
  status: "pending" | "in-progress" | "completed" | "cancelled"
  timestamp: string
  estimatedTime?: number
}

export default function KitchenView() {
  const [orders, setOrders] = useState<KitchenOrder[]>([])
  const [activeTab, setActiveTab] = useState("pending")
  const [updatingTime, setUpdatingTime] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrders = async () => {
      // Solo actualizar si no estamos en proceso de actualizar tiempo
      if (updatingTime === null) {
        const ordersData = await RestaurantService.getKitchenOrders()
        setOrders(ordersData)
      }
    }

    fetchOrders()

    const interval = setInterval(fetchOrders, 10000) 
    return () => clearInterval(interval)
  }, [updatingTime])

  const updateOrderStatus = async (orderId: number, newStatus: "in-progress" | "completed" | "cancelled") => {
    try {
      await RestaurantService.updateOrderStatus(orderId, newStatus)

      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
      )

      toast({
        title: "Estado actualizado",
        description: `La comanda #${orderId} ahora está ${
          newStatus === "in-progress" ? "en preparación" : newStatus === "completed" ? "completada" : "cancelada"
        }`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la comanda",
        variant: "destructive",
      })
    }
  }

  const setEstimatedTime = async (orderId: number, minutes: number) => {
    console.log(`⏱️ Estableciendo tiempo estimado: ${minutes} minutos para orden ${orderId}`)

    setUpdatingTime(orderId)

    try {
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? { ...order, estimatedTime: minutes } : order)),
      )

      const result = await RestaurantService.setOrderEstimatedTime(orderId, minutes)

      if (result && result.success) {
        console.log(`✅ Tiempo estimado actualizado exitosamente`)

        toast({
          title: "Tiempo estimado actualizado",
          description: `La comanda #${orderId} tiene un tiempo estimado de ${minutes} minutos`,
        })

        setTimeout(async () => {
          try {
            const freshOrders = await RestaurantService.getKitchenOrders()
            const updatedOrder = freshOrders.find((o: any) => o.id === orderId)

            if (updatedOrder && updatedOrder.estimatedTime === minutes) {
              console.log(`✅ Confirmado: tiempo estimado persistido en backend`)
            } else {
              console.log(`⚠️ Tiempo estimado no persistido, manteniendo valor local`)
              setOrders((prevOrders) =>
                prevOrders.map((order) => (order.id === orderId ? { ...order, estimatedTime: minutes } : order)),
              )
            }
          } catch (error) {
            console.log(`⚠️ Error verificando persistencia:`, error)
          }
        }, 2000)
      } else {
        throw new Error("Backend no confirmó la actualización")
      }
    } catch (error) {
      console.error(`❌ Error estableciendo tiempo estimado:`, error)

      toast({
        title: "Error",
        description: "No se pudo actualizar el tiempo estimado, pero se mantuvo localmente",
        variant: "destructive",
      })

      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? { ...order, estimatedTime: minutes } : order)),
      )
    } finally {
      setTimeout(() => {
        setUpdatingTime(null)
      }, 1000)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "pending") return order.status === "pending"
    if (activeTab === "in-progress") return order.status === "in-progress"
    if (activeTab === "completed") return order.status === "completed"
    return true
  })

  return (
    <Card className="bg-gray-800/70 backdrop-blur-sm border-cyan-700/30 shadow-xl shadow-cyan-500/10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5"></div>
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          <Flame className="h-5 w-5 mr-2 text-orange-400" />
          Vista de Cocina
        </CardTitle>
        <CardDescription className="text-gray-400">Gestione las órdenes pendientes y en preparación</CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4 bg-gray-900/80 border border-gray-700/50 rounded-lg overflow-hidden">
            <TabsTrigger
              value="pending"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-900/50 data-[state=active]:to-orange-900/50 data-[state=active]:text-yellow-400 transition-all duration-300"
            >
              <Clock className="h-4 w-4" /> Pendientes
              {orders.filter((o) => o.status === "pending").length > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-1 bg-red-700 border border-red-600/50 shadow shadow-red-500/20"
                >
                  {orders.filter((o) => o.status === "pending").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="in-progress"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-900/50 data-[state=active]:to-cyan-900/50 data-[state=active]:text-blue-400 transition-all duration-300"
            >
              <ChefHat className="h-4 w-4" /> En Preparación
              {orders.filter((o) => o.status === "in-progress").length > 0 && (
                <Badge
                  variant="default"
                  className="ml-1 bg-blue-700 border border-blue-600/50 shadow shadow-blue-500/20"
                >
                  {orders.filter((o) => o.status === "in-progress").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-900/50 data-[state=active]:to-emerald-900/50 data-[state=active]:text-green-400 transition-all duration-300"
            >
              <CheckCircle2 className="h-4 w-4" /> Completadas
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <Card
                    key={order.id}
                    className={`overflow-hidden border-l-4 bg-gray-900/80 border-gray-700/50 ${
                      order.status === "pending"
                        ? "border-l-yellow-500"
                        : order.status === "in-progress"
                          ? "border-l-blue-500"
                          : order.status === "completed"
                            ? "border-l-green-500"
                            : "border-l-red-500"
                    } shadow-lg ${
                      order.status === "pending"
                        ? "shadow-yellow-500/10"
                        : order.status === "in-progress"
                          ? "shadow-blue-500/10"
                          : order.status === "completed"
                            ? "shadow-green-500/10"
                            : "shadow-red-500/10"
                    } group hover:scale-[1.01] transition-all duration-300`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardContent className="p-4 relative z-10">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold flex items-center text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-300">
                            Comanda #{order.id}
                            {order.status === "pending" && (
                              <Bell className="h-4 w-4 ml-2 text-yellow-400 animate-pulse" />
                            )}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <Badge variant="outline" className="border-gray-600/50 text-gray-300 bg-gray-800/50">
                              Mesa {order.tableNumber}
                            </Badge>
                            <Badge variant="outline" className="border-gray-600/50 text-gray-300 bg-gray-800/50">
                              Mesero: {order.waiterName}
                            </Badge>
                            <Badge variant="outline" className="border-gray-600/50 text-gray-300 bg-gray-800/50">
                              {formatDate(order.timestamp)}
                            </Badge>
                            {order.estimatedTime && (
                              <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-700/50">
                                ~{order.estimatedTime} min
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <h4 className="text-sm font-medium text-cyan-400">Productos:</h4>
                        <ul className="space-y-1 bg-gray-950/30 p-2 rounded-md border border-gray-800/50">
                          {order.items.map((item, idx) => (
                            <li
                              key={idx}
                              className="text-sm flex justify-between p-1 border-b border-gray-800/50 last:border-0"
                            >
                              <div>
                                <span className="font-medium text-white">
                                  {item.quantity}x {item.name}
                                </span>
                                {item.notes && <p className="text-xs italic text-gray-500">Nota: {item.notes}</p>}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {order.status === "pending" && (
                        <div className="space-y-2">
                          <Button
                            onClick={() => updateOrderStatus(order.id, "in-progress")}
                            className="w-full bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white shadow-sm shadow-blue-500/20 border border-blue-600/30"
                            size="sm"
                          >
                            Iniciar Preparación
                          </Button>

                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs text-gray-400 w-full mb-1">Tiempo estimado:</span>
                            {[5, 10, 15, 20].map((time) => (
                              <Button
                                key={time}
                                variant="outline"
                                size="sm"
                                onClick={() => setEstimatedTime(order.id, time)}
                                disabled={updatingTime === order.id}
                                className="border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white disabled:opacity-50"
                              >
                                {updatingTime === order.id ? "..." : `${time}m`}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {order.status === "in-progress" && (
                        <div className="space-y-2">
                          <Button
                            onClick={() => updateOrderStatus(order.id, "completed")}
                            className="w-full bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white shadow-sm shadow-green-500/20 border border-green-600/30"
                            size="sm"
                          >
                            Completar
                          </Button>

                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs text-gray-400 w-full mb-1">Actualizar tiempo:</span>
                            {[5, 10, 15, 20].map((time) => (
                              <Button
                                key={time}
                                variant="outline"
                                size="sm"
                                onClick={() => setEstimatedTime(order.id, time)}
                                disabled={updatingTime === order.id}
                                className="border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white disabled:opacity-50"
                              >
                                {updatingTime === order.id ? "..." : `${time}m`}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {(order.status === "pending" || order.status === "in-progress") && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, "cancelled")}
                          variant="outline"
                          size="sm"
                          className="w-full mt-2 text-red-400 border-red-900/30 hover:bg-red-900/20 hover:border-red-900/50"
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800/50">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/80 mb-4">
                    {activeTab === "pending" ? (
                      <Clock className="h-8 w-8 text-gray-500" />
                    ) : activeTab === "in-progress" ? (
                      <ChefHat className="h-8 w-8 text-gray-500" />
                    ) : (
                      <CheckCircle2 className="h-8 w-8 text-gray-500" />
                    )}
                  </div>
                  <p className="text-gray-500">
                    No hay comandas{" "}
                    {activeTab === "pending"
                      ? "pendientes"
                      : activeTab === "in-progress"
                        ? "en preparación"
                        : activeTab === "completed"
                          ? "completadas"
                          : ""}{" "}
                    en este momento.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  )
}
