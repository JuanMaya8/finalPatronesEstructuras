"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RestaurantService } from "@/services/restaurant-service"
import { useToast } from "@/hooks/use-toast"
import { Clock, CheckCircle2, RotateCcw, AlertTriangle } from "lucide-react"

interface OrderItem {
  menuItemId: number
  name: string
  price: number
  quantity: number
  notes: string
}

interface Order {
  id: number
  waiterId: number
  waiterName: string
  tableId: number
  tableNumber: number
  items: OrderItem[]
  status: "pending" | "in-progress" | "completed" | "cancelled"
  timestamp: string
  updates: { action: string; timestamp: string }[]
}

interface ActiveOrdersProps {
  onOrderUpdated?: () => void
}

export default function ActiveOrders({ onOrderUpdated }: ActiveOrdersProps = {}) {
  const [orders, setOrders] = useState<Order[]>([])
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersData = await RestaurantService.getOrders()
      setOrders(ordersData)
    }

    fetchOrders()

    const interval = setInterval(fetchOrders, 5000)
    return () => clearInterval(interval)
  }, [])

  const updateOrderStatus = async (orderId: number, newStatus: "in-progress" | "completed" | "cancelled") => {
    try {
      await RestaurantService.updateOrderStatus(orderId, newStatus)

      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                updates: [
                  ...order.updates,
                  { action: `Status changed to ${newStatus}`, timestamp: new Date().toISOString() },
                ],
              }
            : order,
        ),
      )

      toast({
        title: "Estado actualizado",
        description: `La comanda #${orderId} ahora está ${
          newStatus === "in-progress" ? "en preparación" : newStatus === "completed" ? "completada" : "cancelada"
        }`,
      })

      if (onOrderUpdated) {
        onOrderUpdated()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la comanda",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-900/30 text-yellow-400 border-yellow-700">
            <Clock className="h-3 w-3 mr-1" /> Pendiente
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-700">
            <RotateCcw className="h-3 w-3 mr-1" /> En Preparación
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-700">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Completada
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-900/30 text-red-400 border-red-700">
            <AlertTriangle className="h-3 w-3 mr-1" /> Cancelada
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-4 text-gray-200">
      <ScrollArea className="h-[500px] pr-4">
        {orders.length > 0 ? (
          <Accordion
            type="single"
            collapsible
            value={expandedOrder}
            onValueChange={setExpandedOrder}
            className="space-y-4"
          >
            {orders.map((order) => (
              <AccordionItem
                key={order.id}
                value={order.id.toString()}
                className="border rounded-lg overflow-hidden border-gray-700 bg-gray-900"
              >
                <AccordionTrigger className="px-4 py-2 hover:bg-gray-800">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full text-left">
                    <div>
                      <span className="font-medium text-white">Comanda #{order.id}</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant="outline" className="border-gray-600 text-gray-300">
                          Mesa {order.tableNumber}
                        </Badge>
                        <Badge variant="outline" className="border-gray-600 text-gray-300">
                          Mesero: {order.waiterName}
                        </Badge>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 mt-2 sm:mt-0">{formatDate(order.timestamp)}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-gray-800">
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 text-cyan-400">Productos:</h4>
                        <ul className="space-y-2">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between border-b border-gray-700 pb-2">
                              <div>
                                <span className="font-medium text-white">{item.name}</span>
                                {item.notes && <p className="text-xs italic text-gray-500">Nota: {item.notes}</p>}
                              </div>
                              <div className="text-right">
                                <span className="text-gray-300">
                                  {item.quantity} x ${item.price.toFixed(2)}
                                </span>
                                <p className="text-sm font-medium text-cyan-400">
                                  ${(item.quantity * item.price).toFixed(2)}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex justify-between font-medium text-lg">
                        <span className="text-white">Total:</span>
                        <span className="text-cyan-400">
                          ${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                        </span>
                      </div>

                      {order.updates.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2 text-cyan-400">Historial de Cambios:</h4>
                          <ul className="space-y-1 text-sm">
                            {order.updates.map((update, idx) => (
                              <li key={idx} className="text-gray-500">
                                {update.action} - {formatDate(update.timestamp)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {order.status !== "completed" && order.status !== "cancelled" && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {order.status === "pending" && (
                            <Button
                              onClick={() => updateOrderStatus(order.id, "in-progress")}
                              className="bg-blue-700 hover:bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                            >
                              Iniciar Preparación
                            </Button>
                          )}

                          {order.status === "in-progress" && (
                            <Button
                              onClick={() => updateOrderStatus(order.id, "completed")}
                              className="bg-green-700 hover:bg-green-600 text-white shadow-sm shadow-green-500/20"
                            >
                              Marcar como Completada
                            </Button>
                          )}

                          <Button
                            onClick={() => updateOrderStatus(order.id, "cancelled")}
                            variant="outline"
                            className="text-red-400 border-red-900 hover:bg-red-900/20"
                          >
                            Cancelar Comanda
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-gray-500 mb-4">No hay comandas activas en este momento.</p>
              <Button
                onClick={() => {}}
                variant="outline"
                className="border-cyan-700 text-cyan-400 hover:bg-cyan-900/20"
              >
                Crear Nueva Comanda
              </Button>
            </CardContent>
          </Card>
        )}
      </ScrollArea>
    </div>
  )
}
