"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, MinusCircle, Trash2 } from "lucide-react"
import { RestaurantService } from "@/services/restaurant-service"
import { useToast } from "@/hooks/use-toast"

interface MenuItem {
  id: number
  name: string
  price: number
  category: string
}

interface OrderItem {
  menuItemId: number
  name: string
  price: number
  quantity: number
  notes: string
}

interface OrderFormProps {
  onOrderCreated?: () => void
}

export default function OrderForm({ onOrderCreated }: OrderFormProps = {}) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [waiters, setWaiters] = useState<{ id: number; name: string }[]>([])
  const [tables, setTables] = useState<{ id: number; number: number }[]>([])

  const [selectedWaiter, setSelectedWaiter] = useState("")
  const [selectedTable, setSelectedTable] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedMenuItem, setSelectedMenuItem] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState("")
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])

  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      const menu = await RestaurantService.getMenu()
      const waitersData = await RestaurantService.getWaiters()
      const tablesData = await RestaurantService.getTables()

      setMenuItems(menu)
      setWaiters(waitersData)
      setTables(tablesData)
    }

    fetchData()
  }, [])

  const categories = Array.from(new Set(menuItems.map((item) => item.category)))

  const filteredMenuItems = selectedCategory ? menuItems.filter((item) => item.category === selectedCategory) : []

  const addItemToOrder = () => {
    if (!selectedMenuItem) {
      toast({
        title: "Error",
        description: "Por favor seleccione un producto del menú",
        variant: "destructive",
      })
      return
    }

    const menuItem = menuItems.find((item) => item.id.toString() === selectedMenuItem)
    if (!menuItem) return

    const newItem: OrderItem = {
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity,
      notes,
    }

    setOrderItems([...orderItems, newItem])

    setSelectedMenuItem("")
    setQuantity(1)
    setNotes("")

    toast({
      title: "Producto agregado",
      description: `${menuItem.name} agregado a la comanda`,
    })
  }

  const removeOrderItem = (index: number) => {
    const newItems = [...orderItems]
    newItems.splice(index, 1)
    setOrderItems(newItems)
  }

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return

    const newItems = [...orderItems]
    newItems[index].quantity = newQuantity
    setOrderItems(newItems)
  }

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const submitOrder = async () => {
    if (!selectedWaiter || !selectedTable || orderItems.length === 0) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    try {
      await RestaurantService.createOrder({
        waiterId: Number.parseInt(selectedWaiter),
        tableId: Number.parseInt(selectedTable),
        items: orderItems,
        timestamp: new Date().toISOString(),
      })

      setSelectedWaiter("")
      setSelectedTable("")
      setOrderItems([])

      toast({
        title: "Comanda creada",
        description: "La comanda ha sido enviada a cocina",
      })

      if (onOrderCreated) {
        onOrderCreated()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la comanda",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6 text-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="waiter" className="text-gray-300">
            Mesero
          </Label>
          <Select value={selectedWaiter} onValueChange={setSelectedWaiter}>
            <SelectTrigger id="waiter" className="bg-gray-900 border-gray-700 text-gray-200">
              <SelectValue placeholder="Seleccionar mesero" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700 text-gray-200">
              {waiters.map((waiter) => (
                <SelectItem key={`waiter-${waiter.id}`} value={waiter.id.toString()}>
                  {waiter.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="table" className="text-gray-300">
            Mesa
          </Label>
          <Select value={selectedTable} onValueChange={setSelectedTable}>
            <SelectTrigger id="table" className="bg-gray-900 border-gray-700 text-gray-200">
              <SelectValue placeholder="Seleccionar mesa" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700 text-gray-200">
              {tables.map((table) => (
                <SelectItem key={`table-${table.id}`} value={table.id.toString()}>
                  Mesa {table.number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4">
        <h3 className="font-medium mb-2 text-cyan-400">Agregar Productos</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-300">
              Categoría
            </Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category" className="bg-gray-900 border-gray-700 text-gray-200">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-gray-200">
                {categories.map((category) => (
                  <SelectItem key={`category-${category}`} value={category}>
                    {category === "appetizers"
                      ? "Entradas"
                      : category === "main"
                        ? "Platos Fuertes"
                        : category === "desserts"
                          ? "Postres"
                          : category === "drinks"
                            ? "Bebidas"
                            : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="menuItem" className="text-gray-300">
              Producto
            </Label>
            <Select value={selectedMenuItem} onValueChange={setSelectedMenuItem} disabled={!selectedCategory}>
              <SelectTrigger id="menuItem" className="bg-gray-900 border-gray-700 text-gray-200">
                <SelectValue
                  placeholder={selectedCategory ? "Seleccionar producto" : "Primero seleccione una categoría"}
                />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-gray-200">
                {filteredMenuItems.map((item) => (
                  <SelectItem key={`menu-item-select-${item.id}`} value={item.id.toString()}>
                    {item.name} - ${item.price.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-gray-300">
                Cantidad
              </Label>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="border-gray-700 text-gray-300 hover:bg-gray-700"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                  className="mx-2 text-center bg-gray-900 border-gray-700 text-gray-200"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-700"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-gray-300">
                Notas
              </Label>
              <Input
                id="notes"
                placeholder="Sin cebolla, extra salsa, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-gray-900 border-gray-700 text-gray-200 placeholder:text-gray-500"
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={addItemToOrder}
            disabled={!selectedMenuItem}
            className="w-full bg-cyan-700 hover:bg-cyan-600 text-white shadow-md shadow-cyan-500/20"
          >
            Agregar a la Comanda
          </Button>
        </div>
      </div>

      {orderItems.length > 0 && (
        <div className="border-t border-gray-700 pt-4">
          <h3 className="font-medium mb-2 text-cyan-400">Resumen de la Comanda</h3>

          <ScrollArea className="h-[200px] border rounded-md p-2 border-gray-700 bg-gray-900">
            <div className="space-y-2">
              {orderItems.map((item, index) => (
                <div
                  key={`order-item-${index}-${item.menuItemId}`}
                  className="flex items-center justify-between border-b border-gray-700 pb-2"
                >
                  <div className="flex-1">
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-gray-400">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                    {item.notes && <p className="text-xs italic text-gray-500">Nota: {item.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                      className="border-gray-700 text-gray-300 hover:bg-gray-700"
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      className="border-gray-700 text-gray-300 hover:bg-gray-700"
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeOrderItem(index)}
                      className="text-red-500 border-red-900/50 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex justify-between items-center mt-4 font-medium text-white">
            <span>Total:</span>
            <span className="text-cyan-400">${calculateTotal().toFixed(2)}</span>
          </div>

          <Button
            onClick={submitOrder}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-500/20"
          >
            Enviar Comanda a Cocina
          </Button>
        </div>
      )}
    </div>
  )
}
