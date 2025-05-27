"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChefHat, ClipboardList, Home, Menu, Users, Wifi, WifiOff, Zap } from "lucide-react"
import MenuDisplay from "@/components/menu-display"
import OrderForm from "@/components/order-form"
import ActiveOrders from "@/components/active-orders"
import WaiterManagement from "@/components/waiter-management"
import KitchenView from "@/components/kitchen-view"
import { RestaurantService } from "@/services/restaurant-service"

export default function RestaurantManagementSystem() {
  const [activeTab, setActiveTab] = useState("home")
  const [isInitialized, setIsInitialized] = useState(false)
  const [isBackendConnected, setIsBackendConnected] = useState(false)
  const [dashboardStats, setDashboardStats] = useState({
    occupiedTables: 0,
    totalTables: 0,
    activeOrders: 0,
    activeWaiters: 0,
    totalWaiters: 0,
    pendingOrders: [],
  })
  const [currentShift, setCurrentShift] = useState<string[]>([])

  useEffect(() => {
    const initializeService = async () => {
      await RestaurantService.initialize()
      setIsBackendConnected(RestaurantService.isBackendConnected())
      setIsInitialized(true)

      // Cargar datos iniciales del dashboard
      await updateDashboardStats()
    }

    initializeService()
  }, [])

  // Actualizar estadísticas del dashboard
  const updateDashboardStats = async () => {
    try {
      console.log("🔄 Actualizando estadísticas del dashboard...")

      const stats = await RestaurantService.getDashboardStats()
      const shift = await RestaurantService.getCurrentShift()

      console.log("📊 Estadísticas obtenidas:", stats)
      console.log("🔄 Turno obtenido:", shift)

      setDashboardStats(stats)
      setCurrentShift(shift)
    } catch (error) {
      console.error("❌ Error actualizando estadísticas:", error)
    }
  }

  // Actualizar dashboard cada 10 segundos
  useEffect(() => {
    if (isInitialized) {
      const interval = setInterval(updateDashboardStats, 10000)
      return () => clearInterval(interval)
    }
  }, [isInitialized])

  // Actualizar dashboard cuando cambie de tab
  useEffect(() => {
    if (activeTab === "home" && isInitialized) {
      updateDashboardStats()
    }
  }, [activeTab, isInitialized])

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">Cargando Sistema de Restaurante...</h2>
          <div className="animate-spin h-10 w-10 border-4 border-cyan-500 rounded-full border-t-transparent mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-100">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-gray-900/5 to-purple-900/20 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 z-0"></div>

      <header className="relative z-10 bg-black/80 backdrop-blur-sm border-b border-cyan-500/50 text-white p-4 shadow-lg shadow-cyan-500/20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Zap className="h-8 w-8 text-cyan-400 animate-pulse" />
              <div className="absolute -inset-1 bg-cyan-400 rounded-full blur-md opacity-30 animate-pulse"></div>
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              NEON BYTE DINER
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {isBackendConnected ? (
              <Badge
                variant="outline"
                className="bg-green-900/30 text-green-400 border-green-700 flex items-center gap-1"
              >
                <Wifi className="h-3 w-3" /> Backend Conectado
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-yellow-900/30 text-yellow-400 border-yellow-700 flex items-center gap-1"
              >
                <WifiOff className="h-3 w-3" /> Modo Local
              </Badge>
            )}
            <Badge variant="outline" className="bg-black text-cyan-400 border-cyan-700 shadow-sm shadow-cyan-500/50">
              v2.0.77
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 pt-8 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full max-w-4xl mx-auto bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-1 shadow-lg shadow-cyan-500/5">
            <TabsTrigger
              value="home"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-900 data-[state=active]:to-purple-900 data-[state=active]:text-cyan-400 rounded-lg transition-all duration-300"
            >
              <Home size={16} /> Inicio
            </TabsTrigger>
            <TabsTrigger
              value="menu"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-900 data-[state=active]:to-purple-900 data-[state=active]:text-cyan-400 rounded-lg transition-all duration-300"
            >
              <Menu size={16} /> Menú
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-900 data-[state=active]:to-purple-900 data-[state=active]:text-cyan-400 rounded-lg transition-all duration-300"
            >
              <ClipboardList size={16} /> Comandas
            </TabsTrigger>
            <TabsTrigger
              value="waiters"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-900 data-[state=active]:to-purple-900 data-[state=active]:text-cyan-400 rounded-lg transition-all duration-300"
            >
              <Users size={16} /> Meseros
            </TabsTrigger>
            <TabsTrigger
              value="kitchen"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-900 data-[state=active]:to-purple-900 data-[state=active]:text-cyan-400 rounded-lg transition-all duration-300"
            >
              <ChefHat size={16} /> Cocina
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-4">
            <Card className="bg-gray-800/70 backdrop-blur-sm border-cyan-700/30 shadow-xl shadow-cyan-500/10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-2xl">
                  Bienvenido al Sistema de Gestión de Restaurante
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Un sistema completo para administrar menús, comandas, meseros y cocina
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 backdrop-blur-sm">
                    <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-100">
                      Características Principales:
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-300">
                      <li>Gestión de menú categorizado</li>
                      <li>Sistema de comandas con historial de cambios</li>
                      <li>Rotación de turnos de meseros</li>
                      <li>Visualización en tiempo real para la cocina</li>
                      <li>Búsqueda rápida de productos</li>
                    </ul>
                  </div>
                  <div className="space-y-2 bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 backdrop-blur-sm">
                    <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-100">
                      Estructuras de Datos Implementadas:
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-300">
                      <li>Árboles para categorización del menú</li>
                      <li>Listas doblemente enlazadas para comandas</li>
                      <li>Pilas para historial de cambios</li>
                      <li>Colas para pedidos de cocina</li>
                      <li>Grafos para conexiones entre mesas</li>
                      <li>Listas circulares para rotación de turnos</li>
                      <li>Tablas hash para búsqueda de productos</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center gap-4 relative z-10">
                <Button
                  onClick={() => setActiveTab("menu")}
                  className="bg-gradient-to-r from-cyan-700 to-cyan-600 hover:from-cyan-600 hover:to-cyan-500 text-white shadow-md shadow-cyan-500/20 border border-cyan-500/20"
                >
                  Ver Menú
                </Button>
                <Button
                  onClick={() => setActiveTab("orders")}
                  className="bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white shadow-md shadow-purple-500/20 border border-purple-500/20"
                >
                  Gestionar Comandas
                </Button>
              </CardFooter>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-800/70 backdrop-blur-sm border-cyan-700/30 shadow-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent"></div>
                <CardHeader className="relative z-10 pb-2">
                  <CardTitle className="text-cyan-400 text-lg">Estado del Sistema</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Backend:</span>
                      <Badge
                        variant={isBackendConnected ? "default" : "outline"}
                        className={isBackendConnected ? "bg-green-700" : "text-yellow-400 border-yellow-700"}
                      >
                        {isBackendConnected ? "Conectado" : "Modo Local"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Mesas Ocupadas:</span>
                      <Badge variant="outline" className="bg-cyan-900/30 text-cyan-400 border-cyan-700">
                        {dashboardStats.occupiedTables}/{dashboardStats.totalTables}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Comandas Activas:</span>
                      <Badge variant="outline" className="bg-purple-900/30 text-purple-400 border-purple-700">
                        {dashboardStats.activeOrders}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Meseros Activos:</span>
                      <Badge variant="outline" className="bg-cyan-900/30 text-cyan-400 border-cyan-700">
                        {dashboardStats.activeWaiters}/{dashboardStats.totalWaiters}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/70 backdrop-blur-sm border-cyan-700/30 shadow-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
                <CardHeader className="relative z-10 pb-2">
                  <CardTitle className="text-purple-400 text-lg">Comandas Pendientes</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 pt-0">
                  <div className="space-y-2">
                    {dashboardStats.pendingOrders.length > 0 ? (
                      dashboardStats.pendingOrders.slice(0, 2).map((order: any) => (
                        <div key={order.id} className="p-2 bg-gray-900/50 rounded-lg border border-gray-700/50">
                          <div className="flex justify-between">
                            <span className="font-medium text-white">Mesa {order.tableNumber}</span>
                            <Badge variant="outline" className="bg-yellow-900/30 text-yellow-400 border-yellow-700">
                              Pendiente
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {order.items.length} productos • {order.waiterName}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 bg-gray-900/50 rounded-lg border border-gray-700/50">
                        <span className="text-gray-500">No hay comandas pendientes</span>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                      onClick={() => setActiveTab("orders")}
                    >
                      Ver todas las comandas
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/70 backdrop-blur-sm border-cyan-700/30 shadow-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent"></div>
                <CardHeader className="relative z-10 pb-2">
                  <CardTitle className="text-cyan-400 text-lg">Turno Actual</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 pt-0">
                  <div className="flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-700 to-purple-700 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                      <div className="text-white font-bold">
                        {currentShift.length > 0 && typeof currentShift[0] === "string"
                          ? currentShift[0].substring(0, 2).toUpperCase()
                          : "N/A"}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-white font-medium">
                        {currentShift.length > 0 && typeof currentShift[0] === "string"
                          ? currentShift[0]
                          : "Sin asignar"}
                      </div>
                      <div className="text-xs text-gray-400">
                        Siguiente:{" "}
                        {currentShift.length > 1 && typeof currentShift[1] === "string" ? currentShift[1] : "N/A"}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20"
                    onClick={() => setActiveTab("waiters")}
                  >
                    Gestionar meseros
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="menu">
            <MenuDisplay />
          </TabsContent>

          <TabsContent value="orders">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/70 backdrop-blur-sm border-cyan-700/30 shadow-xl shadow-cyan-500/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                    Nueva Comanda
                  </CardTitle>
                  <CardDescription className="text-gray-400">Crear una nueva orden para una mesa</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <OrderForm onOrderCreated={updateDashboardStats} />
                </CardContent>
              </Card>

              <Card className="bg-gray-800/70 backdrop-blur-sm border-cyan-700/30 shadow-xl shadow-cyan-500/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                    Comandas Activas
                  </CardTitle>
                  <CardDescription className="text-gray-400">Gestionar las órdenes en proceso</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <ActiveOrders onOrderUpdated={updateDashboardStats} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="waiters">
            <WaiterManagement onWaiterUpdated={updateDashboardStats} />
          </TabsContent>

          <TabsContent value="kitchen">
            <KitchenView onOrderUpdated={updateDashboardStats} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-black/80 backdrop-blur-sm border-t border-cyan-900/50 text-gray-400 p-4 mt-8 relative z-10">
        <div className="container mx-auto text-center">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">
            © 2025 NEON BYTE DINER - SISTEMA DE GESTIÓN v2.0.77
          </p>
          <div className="text-xs mt-1 text-gray-500">
            {isBackendConnected ? "Conectado al backend Java" : "Ejecutando en modo local (sin backend)"}
          </div>
        </div>
      </footer>
    </div>
  )
}
