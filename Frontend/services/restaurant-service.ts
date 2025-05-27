interface ApiError extends Error {
  message: string
}

const API_URL = "http://localhost:8080"

const menuData = [
  {
    id: 1,
    name: "Ensalada César",
    description: "Lechuga romana, crutones, queso parmesano y aderezo César",
    price: 8.99,
    category: "appetizers",
  },
  {
    id: 2,
    name: "Carpaccio de Res",
    description: "Finas láminas de res con aceite de oliva, limón y parmesano",
    price: 12.99,
    category: "appetizers",
  },
  {
    id: 3,
    name: "Sopa de Cebolla",
    description: "Caldo de cebolla caramelizada con queso gratinado",
    price: 7.99,
    category: "appetizers",
  },
  {
    id: 4,
    name: "Filete Mignon",
    description: "Corte premium de res con salsa de vino tinto y vegetales",
    price: 29.99,
    category: "main",
  },
  {
    id: 5,
    name: "Salmón a la Parrilla",
    description: "Filete de salmón con salsa de limón y hierbas",
    price: 24.99,
    category: "main",
  },
  {
    id: 6,
    name: "Risotto de Hongos",
    description: "Arroz cremoso con variedad de hongos y queso parmesano",
    price: 18.99,
    category: "main",
  },
  {
    id: 7,
    name: "Tiramisú",
    description: "Postre italiano con café, mascarpone y cacao",
    price: 8.99,
    category: "desserts",
  },
  {
    id: 8,
    name: "Crème Brûlée",
    description: "Natilla cremosa con costra de azúcar caramelizada",
    price: 7.99,
    category: "desserts",
  },
  { id: 9, name: "Vino Tinto", description: "Copa de vino tinto de la casa", price: 6.99, category: "drinks" },
  { id: 10, name: "Agua Mineral", description: "Botella de agua mineral", price: 2.99, category: "drinks" },
]

const waitersData = [
  { id: 1, name: "Carlos Rodríguez", active: true, assignedTables: [1, 2, 3], ordersCompleted: 24 },
  { id: 2, name: "María González", active: true, assignedTables: [4, 5], ordersCompleted: 18 },
  { id: 3, name: "Juan Pérez", active: false, assignedTables: [], ordersCompleted: 12 },
]

const tablesData = [
  { id: 1, number: 1, capacity: 4, status: "occupied" },
  { id: 2, number: 2, capacity: 2, status: "available" },
  { id: 3, number: 3, capacity: 6, status: "reserved" },
  { id: 4, number: 4, capacity: 4, status: "available" },
  { id: 5, number: 5, capacity: 8, status: "occupied" },
]

const ordersData = [
  {
    id: 1,
    waiterId: 1,
    waiterName: "Carlos Rodríguez",
    tableId: 1,
    tableNumber: 1,
    items: [
      { menuItemId: 1, name: "Ensalada César", price: 8.99, quantity: 1, notes: "" },
      { menuItemId: 4, name: "Filete Mignon", price: 29.99, quantity: 2, notes: "Término medio" },
      { menuItemId: 9, name: "Vino Tinto", price: 6.99, quantity: 2, notes: "" },
    ],
    status: "in-progress",
    timestamp: "2025-05-22T18:30:00.000Z",
    updates: [
      { action: "Order created", timestamp: "2025-05-22T18:30:00.000Z" },
      { action: "Status changed to in-progress", timestamp: "2025-05-22T18:35:00.000Z" },
    ],
    estimatedTime: 15,
  },
  {
    id: 2,
    waiterId: 2,
    waiterName: "María González",
    tableId: 5,
    tableNumber: 5,
    items: [
      { menuItemId: 3, name: "Sopa de Cebolla", price: 7.99, quantity: 3, notes: "" },
      { menuItemId: 6, name: "Risotto de Hongos", price: 18.99, quantity: 2, notes: "Sin cebolla" },
      { menuItemId: 8, name: "Crème Brûlée", price: 7.99, quantity: 2, notes: "" },
    ],
    status: "pending",
    timestamp: "2025-05-22T18:45:00.000Z",
    updates: [{ action: "Order created", timestamp: "2025-05-22T18:45:00.000Z" }],
  },
]

const currentShift = waitersData.filter((w) => w.active).map((w) => w.name)

const normalizeCategoryFromBackend = (backendCategory: string): string => {
  if (!backendCategory) {
    console.log("⚠️ Categoría vacía o undefined, usando 'main' por defecto")
    return "main"
  }

  const cleanCategory = backendCategory.toString().trim().toLowerCase()

  console.log(`🔄 Normalizando categoría original: "${backendCategory}" -> limpia: "${cleanCategory}"`)

  if (cleanCategory.includes("entrada") || cleanCategory.includes("appetizer") || cleanCategory.includes("starter")) {
    console.log(`✅ Mapeado a appetizers`)
    return "appetizers"
  }

  if (cleanCategory.includes("postre") || cleanCategory.includes("dessert") || cleanCategory.includes("sweet")) {
    console.log(`✅ Mapeado a desserts`)
    return "desserts"
  }

  if (
    cleanCategory.includes("bebida") ||
    cleanCategory.includes("drink") ||
    cleanCategory.includes("beverage") ||
    cleanCategory.includes("liquido")
  ) {
    console.log(`✅ Mapeado a drinks`)
    return "drinks"
  }

  if (
    cleanCategory.includes("principal") ||
    cleanCategory.includes("main") ||
    cleanCategory.includes("plato") ||
    cleanCategory.includes("fuerte")
  ) {
    console.log(`✅ Mapeado a main`)
    return "main"
  }

  console.log(
    `❌ Categoría NO RECONOCIDA: "${backendCategory}" (limpia: "${cleanCategory}"), usando 'main' por defecto`,
  )
  return "main"
}

const getLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }
  return null
}

const setLocalStorage = (key: string, value: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

const initializeLocalStorage = () => {
  if (!getLocalStorage("menu")) {
    setLocalStorage("menu", menuData)
  }

  if (!getLocalStorage("waiters")) {
    setLocalStorage("waiters", waitersData)
  }

  if (!getLocalStorage("tables")) {
    setLocalStorage("tables", tablesData)
  }

  if (!getLocalStorage("orders")) {
    setLocalStorage("orders", ordersData)
  }

  if (!getLocalStorage("currentShift")) {
    setLocalStorage("currentShift", currentShift)
  }
}

const fetchFromApi = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...((options.headers as Record<string, string>) || {}),
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.warn(`Backend connection failed: ${(error as ApiError).message}. Using localStorage fallback.`)
    return null
  }
}

export const RestaurantService = {
  initialize: async () => {
    try {
      console.log("🔄 Intentando conectar al backend...")

      const response = await fetch(`${API_URL}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("📡 Respuesta del servidor:", response.status)

      if (response.status === 404 || response.status === 200) {
        console.log("✅ Backend detectado! Probando endpoints...")

        try {
          const menuResponse = await fetch(`${API_URL}/api/menu`)
          if (menuResponse.ok) {
            const menuData = await menuResponse.json()
            console.log("📋 Datos del menú obtenidos:", menuData)
            // FORZAR ANÁLISIS COMPLETO DEL BACKEND
            console.log("🔍 ===== ANÁLISIS COMPLETO DEL BACKEND =====")
            menuData.forEach((item, index) => {
              console.log(`🔍 ITEM ${index + 1}:`)
              console.log(`   - ID: ${item.id}`)
              console.log(`   - Nombre: "${item.name}"`)
              console.log(`   - Categoría RAW: "${item.category}" (tipo: ${typeof item.category})`)
              console.log(`   - Categoría JSON: ${JSON.stringify(item.category)}`)
              console.log(`   - Precio: ${item.price}`)
              console.log(`   - Objeto completo:`, item)
            })

            // MOSTRAR TODAS LAS CATEGORÍAS ÚNICAS DEL BACKEND
            const backendCategories = [...new Set(menuData.map((item) => item.category))]
            console.log("🔍 CATEGORÍAS ÚNICAS DEL BACKEND:", backendCategories)
          }
        } catch (menuError) {
          console.log("⚠️ Endpoint de menú no disponible, usando datos locales")
        }

        localStorage.setItem("backendConnected", "true")
      } else {
        throw new Error(`Server responded with status: ${response.status}`)
      }
    } catch (error) {
      console.warn("⚠️ Backend no disponible:", (error as ApiError).message)
      console.log("🔄 Inicializando con datos locales...")
      localStorage.setItem("backendConnected", "false")
      initializeLocalStorage()
    }
    return true
  },

  isBackendConnected: () => {
    return localStorage.getItem("backendConnected") === "true"
  },

  getMenu: async () => {
    try {
      const apiData = await fetchFromApi("/api/menu")
      if (apiData && Array.isArray(apiData)) {
        console.log("📋 ===== ANÁLISIS DETALLADO DEL MENÚ DEL BACKEND =====")
        console.log("📋 Menú crudo del backend:", apiData)

        console.log("🔍 ===== CATEGORÍAS EXACTAS DEL BACKEND =====")
        const allBackendCategories = apiData.map((item) => item.category)
        const uniqueBackendCategories = [...new Set(allBackendCategories)]
        console.log("🔍 Categorías únicas del backend:", uniqueBackendCategories)

        uniqueBackendCategories.forEach((cat) => {
          console.log(`🔍 Categoría: "${cat}" (JSON: ${JSON.stringify(cat)}, tipo: ${typeof cat})`)
        })

        apiData.forEach((item, index) => {
          console.log(`📋 --- ITEM ${index + 1} ---`)
          console.log(`📋 ID: ${item.id}`)
          console.log(`📋 Nombre: ${item.name}`)
          console.log(`📋 Categoría ORIGINAL: "${item.category}" (tipo: ${typeof item.category})`)
          console.log(`📋 Precio: ${item.price}`)
        })

        const validatedMenu = apiData.map((item, index) => {
          console.log(`📋 Procesando item ${index + 1}: ${item.name}`)

          const normalizedCategory = normalizeCategoryFromBackend(item.category)
          const validatedItem = {
            id: item.id || index + 1,
            name: item.name || "Producto sin nombre",
            description: item.description || "Sin descripción",
            price: typeof item.price === "number" ? item.price : 0,
            category: normalizedCategory,
          }

          console.log(`📋 Item procesado - Categoría final: "${validatedItem.category}"`)
          return validatedItem
        })

        console.log("📋 ===== MENÚ PROCESADO FINAL =====")
        console.log("📋 Menú procesado completo:", validatedMenu)

        const categoryDistribution = validatedMenu.reduce(
          (acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        )

        console.log("📊 Distribución antes de corrección:", categoryDistribution)

        const totalItems = validatedMenu.length
        const mainItems = categoryDistribution.main || 0

        if (mainItems > totalItems * 0.8) {
          console.log("⚠️ PROBLEMA DETECTADO: Demasiados elementos en 'main', redistribuyendo...")

          const redistributedMenu = validatedMenu.map((item, index) => {
            const itemName = item.name.toLowerCase()

            if (
              itemName.includes("ensalada") ||
              itemName.includes("sopa") ||
              itemName.includes("carpaccio") ||
              itemName.includes("entrada") ||
              itemName.includes("aperitivo")
            ) {
              console.log(`🔄 Redistribuyendo "${item.name}" a appetizers`)
              return { ...item, category: "appetizers" }
            }

            if (
              itemName.includes("tiramisu") ||
              itemName.includes("postre") ||
              itemName.includes("helado") ||
              itemName.includes("tarta") ||
              itemName.includes("flan") ||
              itemName.includes("crème") ||
              itemName.includes("brûlée") ||
              itemName.includes("chocolate")
            ) {
              console.log(`🔄 Redistribuyendo "${item.name}" a desserts`)
              return { ...item, category: "desserts" }
            }

            if (
              itemName.includes("vino") ||
              itemName.includes("agua") ||
              itemName.includes("refresco") ||
              itemName.includes("jugo") ||
              itemName.includes("cerveza") ||
              itemName.includes("café") ||
              itemName.includes("té") ||
              itemName.includes("bebida")
            ) {
              console.log(`🔄 Redistribuyendo "${item.name}" a drinks`)
              return { ...item, category: "drinks" }
            }

            return item
          })

          console.log("📊 Menú redistribuido:")
          const newDistribution = redistributedMenu.reduce(
            (acc, item) => {
              acc[item.category] = (acc[item.category] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          )
          console.log("📊 Nueva distribución:", newDistribution)

          return redistributedMenu
        }

        const categoryCount = validatedMenu.reduce(
          (acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        )

        console.log("📊 ===== DISTRIBUCIÓN FINAL POR CATEGORÍAS =====")
        console.log("📊 Distribución por categorías:", categoryCount)

        const expectedCategories = ["appetizers", "main", "desserts", "drinks"]
        expectedCategories.forEach((cat) => {
          const count = categoryCount[cat] || 0
          console.log(`📊 Categoría "${cat}": ${count} elementos`)

          if (count === 0) {
            console.log(`⚠️ PROBLEMA: No hay elementos en la categoría "${cat}"`)
          }
        })

        expectedCategories.forEach((cat) => {
          const itemsInCategory = validatedMenu.filter((item) => item.category === cat)
          console.log(
            `📋 Elementos en "${cat}":`,
            itemsInCategory.map((item) => item.name),
          )
        })

        return validatedMenu
      }
    } catch (error) {
      console.log("⚠️ Error obteniendo menú del backend:", error.message)
    }

    const localData = getLocalStorage("menu") || menuData
    console.log("📋 Usando menú local:", localData.length, "elementos")
    return localData
  },

  getWaiters: async () => {
    try {
      const apiData = await fetchFromApi("/api/waiters")
      if (apiData && Array.isArray(apiData)) {
        console.log("👥 Meseros obtenidos del backend:", apiData.length, "elementos")
        return apiData
      }
    } catch (error) {
      console.log("⚠️ Error obteniendo meseros del backend:", error.message)
    }

    const localData = getLocalStorage("waiters") || waitersData
    console.log("👥 Usando meseros locales:", localData.length, "elementos")
    return localData
  },

  addWaiter: async (name: string) => {
    if (RestaurantService.isBackendConnected()) {
      const response = await fetchFromApi("/api/waiters", {
        method: "POST",
        body: JSON.stringify({ name }),
      })

      if (response) return response
    }

    const waiters = getLocalStorage("waiters") || waitersData
    const newWaiter = {
      id: Math.max(0, ...waiters.map((w: any) => w.id)) + 1,
      name,
      active: true,
      assignedTables: [],
      ordersCompleted: 0,
    }

    const updatedWaiters = [...waiters, newWaiter]
    setLocalStorage("waiters", updatedWaiters)

    if (newWaiter.active) {
      const shift = getLocalStorage("currentShift") || currentShift
      setLocalStorage("currentShift", [...shift, newWaiter.name])
    }

    return newWaiter
  },

  updateWaiterStatus: async (waiterId: number, active: boolean) => {
    if (RestaurantService.isBackendConnected()) {
      const response = await fetchFromApi(`/api/waiters/${waiterId}/status`, {
        method: "PUT",
        body: JSON.stringify({ active }),
      })

      if (response) return response
    }

    const waiters = getLocalStorage("waiters") || waitersData
    const updatedWaiters = waiters.map((waiter: any) => (waiter.id === waiterId ? { ...waiter, active } : waiter))

    setLocalStorage("waiters", updatedWaiters)

    const waiter = waiters.find((w: any) => w.id === waiterId)
    if (waiter) {
      let shift = getLocalStorage("currentShift") || currentShift

      if (active && !shift.includes(waiter.name)) {
        shift = [...shift, waiter.name]
      } else if (!active && shift.includes(waiter.name)) {
        shift = shift.filter((name: string) => name !== waiter.name)
      }

      setLocalStorage("currentShift", shift)
    }

    return true
  },

  getCurrentShift: async () => {
    try {
      const apiData = await fetchFromApi("/api/waiters/rotation")
      console.log("🔄 Respuesta cruda del endpoint de rotación:", apiData)

      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        console.log("🔄 Turno crudo del backend:", apiData)

        const shiftNames = apiData.map((item) => {
          if (typeof item === "string") {
            return item
          } else if (item && typeof item === "object" && item.name) {
            return item.name
          } else {
            return "Mesero Desconocido"
          }
        })

        console.log("🔄 Turno transformado:", shiftNames)
        return shiftNames
      } else {
        console.log("⚠️ Turno vacío del backend, usando datos locales")
      }
    } catch (error) {
      console.log("⚠️ Error obteniendo turno del backend:", error.message)
    }

    const localData = getLocalStorage("currentShift") || currentShift
    console.log("🔄 Usando turno local:", localData)
    return localData
  },

  rotateWaiterShift: async () => {
    if (RestaurantService.isBackendConnected()) {
      const response = await fetchFromApi("/api/waiters/rotation/next", {
        method: "POST",
      })

      if (response) {
        console.log("🔄 Respuesta de rotación del backend:", response)

        if (Array.isArray(response)) {
          const shiftNames = response.map((item) => {
            if (typeof item === "string") {
              return item
            } else if (item && typeof item === "object" && item.name) {
              return item.name
            } else {
              return "Mesero Desconocido"
            }
          })
          console.log("🔄 Turno rotado transformado:", shiftNames)
          return shiftNames
        }
        return response
      }
    }

    let shift = getLocalStorage("currentShift") || currentShift

    if (shift.length > 1) {
      const firstWaiter = shift[0]
      shift = [...shift.slice(1), firstWaiter]
      setLocalStorage("currentShift", shift)
    }

    return shift
  },

  getTables: async () => {
    const apiData = await fetchFromApi("/api/tables")
    return apiData || getLocalStorage("tables") || tablesData
  },

  getOrders: async () => {
    const apiData = await fetchFromApi("/api/orders")
    return apiData || getLocalStorage("orders") || ordersData
  },

  getKitchenOrders: async () => {
    try {
      const apiData = await fetchFromApi("/api/orders/kitchen")
      if (apiData && Array.isArray(apiData)) {
        console.log("🍳 Órdenes de cocina del backend:", apiData.length, "elementos")

        apiData.forEach((order) => {
          if (order.estimatedTime) {
            console.log(`⏱️ Orden ${order.id} tiene tiempo estimado: ${order.estimatedTime} minutos`)
          } else {
            console.log(`⚠️ Orden ${order.id} NO tiene tiempo estimado`)
          }
        })

        return apiData
      }
    } catch (error) {
      console.log("⚠️ Error obteniendo órdenes de cocina del backend:", error.message)
    }

    const localData = getLocalStorage("orders") || ordersData
    console.log("🍳 Usando órdenes locales:", localData.length, "elementos")
    return localData
  },

  createOrder: async (orderData: any) => {
    if (RestaurantService.isBackendConnected()) {
      const response = await fetchFromApi("/api/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
      })

      if (response) return response
    }

    const orders = getLocalStorage("orders") || ordersData
    const waiters = getLocalStorage("waiters") || waitersData
    const tables = getLocalStorage("tables") || tablesData

    const waiter = waiters.find((w: any) => w.id === orderData.waiterId)
    const table = tables.find((t: any) => t.id === orderData.tableId)

    if (!waiter || !table) {
      throw new Error("Waiter or table not found")
    }

    const newOrder = {
      id: Math.max(0, ...orders.map((o: any) => o.id)) + 1,
      waiterId: orderData.waiterId,
      waiterName: waiter.name,
      tableId: orderData.tableId,
      tableNumber: table.number,
      items: orderData.items,
      status: "pending",
      timestamp: orderData.timestamp || new Date().toISOString(),
      updates: [{ action: "Order created", timestamp: new Date().toISOString() }],
    }

    const updatedOrders = [...orders, newOrder]
    setLocalStorage("orders", updatedOrders)

    const updatedTables = tables.map((t: any) => (t.id === orderData.tableId ? { ...t, status: "occupied" } : t))
    setLocalStorage("tables", updatedTables)

    return newOrder
  },

  updateOrderStatus: async (orderId: number, status: "in-progress" | "completed" | "cancelled") => {
    if (RestaurantService.isBackendConnected()) {
      const response = await fetchFromApi(`/api/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      })

      if (response) return response
    }

    const orders = getLocalStorage("orders") || ordersData
    const waiters = getLocalStorage("waiters") || waitersData

    const updatedOrders = orders.map((order: any) => {
      if (order.id === orderId) {
        const updates = [
          ...order.updates,
          { action: `Status changed to ${status}`, timestamp: new Date().toISOString() },
        ]

        return { ...order, status, updates }
      }
      return order
    })

    setLocalStorage("orders", updatedOrders)

    if (status === "completed") {
      const order = orders.find((o: any) => o.id === orderId)
      if (order) {
        const updatedWaiters = waiters.map((waiter: any) => {
          if (waiter.id === order.waiterId) {
            return { ...waiter, ordersCompleted: waiter.ordersCompleted + 1 }
          }
          return waiter
        })

        setLocalStorage("waiters", updatedWaiters)
      }
    }

    return true
  },

  setOrderEstimatedTime: async (orderId: number, minutes: number) => {
    console.log(`⏱️ Intentando establecer tiempo estimado: Orden ${orderId}, ${minutes} minutos`)

    if (RestaurantService.isBackendConnected()) {
      try {
        console.log(`⏱️ Enviando al backend: PUT ${API_URL}/api/orders/${orderId}/estimated-time`)
        console.log(`⏱️ Payload:`, { minutes })

        const response = await fetch(`${API_URL}/api/orders/${orderId}/estimated-time`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ minutes }),
        })

        console.log(`⏱️ Respuesta del backend:`, {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries()),
        })

        if (response.ok) {
          console.log(`✅ Backend confirmó actualización de tiempo estimado`)

          const orders = getLocalStorage("orders") || ordersData
          const updatedOrders = orders.map((order: any) => {
            if (order.id === orderId) {
              return { ...order, estimatedTime: minutes }
            }
            return order
          })
          setLocalStorage("orders", updatedOrders)

          return { success: true, estimatedTime: minutes }
        } else {
          const errorText = await response.text()
          console.log(`❌ Error del backend:`, errorText)
          throw new Error(`Backend error: ${response.status} - ${errorText}`)
        }
      } catch (error) {
        console.log(`❌ Error de conexión con backend:`, error.message)
      }
    }

    // Fallback a localStorage
    console.log(`⏱️ Usando localStorage para tiempo estimado`)
    const orders = getLocalStorage("orders") || ordersData

    const updatedOrders = orders.map((order: any) => {
      if (order.id === orderId) {
        const updates = [
          ...order.updates,
          { action: `Estimated time set to ${minutes} minutes`, timestamp: new Date().toISOString() },
        ]

        return { ...order, estimatedTime: minutes, updates }
      }
      return order
    })

    setLocalStorage("orders", updatedOrders)
    console.log(`⏱️ Tiempo estimado guardado en localStorage`)
    return { success: true, estimatedTime: minutes }
  },

  getDashboardStats: async () => {
    try {
      const [orders, tables, waiters] = await Promise.all([
        RestaurantService.getOrders(),
        RestaurantService.getTables(),
        RestaurantService.getWaiters(),
      ])

      const occupiedTables = tables.filter((t: any) => t.status === "occupied").length
      const totalTables = tables.length
      const activeOrders = orders.filter((o: any) => o.status === "pending" || o.status === "in-progress").length
      const activeWaiters = waiters.filter((w: any) => w.active).length
      const totalWaiters = waiters.length
      const pendingOrders = orders.filter((o: any) => o.status === "pending")

      return {
        occupiedTables,
        totalTables,
        activeOrders,
        activeWaiters,
        totalWaiters,
        pendingOrders,
      }
    } catch (error) {
      console.error("Error obteniendo estadísticas del dashboard:", error)
      return {
        occupiedTables: 0,
        totalTables: 0,
        activeOrders: 0,
        activeWaiters: 0,
        totalWaiters: 0,
        pendingOrders: [],
      }
    }
  },
}
