
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Search, Sparkles } from "lucide-react"
import { RestaurantService } from "@/services/restaurant-service"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
}

export default function MenuDisplay() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const menu = await RestaurantService.getMenu()
        console.log("📋 Menú recibido en MenuDisplay:", menu)

        console.log("🔍 ===== ANÁLISIS FORZADO DE CADA ELEMENTO =====")
        if (menu && Array.isArray(menu)) {
          menu.forEach((item, index) => {
            console.log(`🔍 ELEMENTO ${index + 1}:`)
            console.log(`   - Nombre: "${item.name}"`)
            console.log(`   - Categoría: "${item.category}"`)
            console.log(`   - Categoría JSON: ${JSON.stringify(item.category)}`)
            console.log(`   - Tipo categoría: ${typeof item.category}`)
            console.log(`   - Objeto completo:`, JSON.stringify(item, null, 2))
          })

          const finalDistribution = menu.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1
            return acc
          }, {})
          console.log("🔍 DISTRIBUCIÓN FINAL:", finalDistribution)
        }

        console.log("🔍 ===== ANÁLISIS DETALLADO DE CATEGORÍAS =====")
        if (menu && Array.isArray(menu)) {
          menu.forEach((item, index) => {
            console.log(`🔍 Item ${index + 1}: "${item.name}"`)
            console.log(`   - Categoría original: "${item.category}"`)
            console.log(`   - Tipo: ${typeof item.category}`)
          })

          const categoriesFound = menu.map((item) => item.category)
          const uniqueCategories = [...new Set(categoriesFound)]

          console.log("🔍 Todas las categorías encontradas:", categoriesFound)
          console.log("🔍 Categorías únicas:", uniqueCategories)

          const categoryCount = categoriesFound.reduce((acc, cat) => {
            acc[cat] = (acc[cat] || 0) + 1
            return acc
          }, {})

          console.log("🔍 Conteo por categoría:", categoryCount)

          const expectedCategories = ["appetizers", "main", "desserts", "drinks"]
          expectedCategories.forEach((expectedCat) => {
            const itemsInCat = menu.filter((item) => item.category === expectedCat)
            console.log(
              `🔍 Items en "${expectedCat}":`,
              itemsInCat.map((item) => item.name),
            )
          })
        }

        if (menu && Array.isArray(menu) && menu.length > 0) {
          const categoriesFound = menu.map((item) => item.category)
          const uniqueCategories = [...new Set(categoriesFound)]

          console.log("📋 Categorías encontradas en el menú:", uniqueCategories)
          console.log(
            "📋 Distribución de categorías:",
            categoriesFound.reduce((acc, cat) => {
              acc[cat] = (acc[cat] || 0) + 1
              return acc
            }, {}),
          )

          setMenuItems(menu)
          setFilteredItems(menu)
        } else {
          console.log("⚠️ Menú vacío o inválido, usando datos por defecto")
          const defaultMenu = [
            {
              id: 1,
              name: "Ensalada César",
              description: "Lechuga romana, crutones, queso parmesano y aderezo César",
              price: 8.99,
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
              id: 7,
              name: "Tiramisú",
              description: "Postre italiano con café, mascarpone y cacao",
              price: 8.99,
              category: "desserts",
            },
            {
              id: 9,
              name: "Vino Tinto",
              description: "Copa de vino tinto de la casa",
              price: 6.99,
              category: "drinks",
            },
          ]
          setMenuItems(defaultMenu)
          setFilteredItems(defaultMenu)
        }
      } catch (error) {
        console.error("❌ Error cargando menú:", error)
      }
    }

    fetchMenu()
  }, [])

  useEffect(() => {
    console.log(`🔍 Filtrando menú - Categoría activa: "${activeCategory}", Término de búsqueda: "${searchTerm}"`)
    console.log(`🔍 Total de elementos en menú: ${menuItems.length}`)

    let filtered = menuItems

    if (activeCategory !== "all") {
      const beforeFilter = filtered.length
      filtered = filtered.filter((item) => item.category === activeCategory)
      console.log(
        `🔍 Después de filtrar por categoría "${activeCategory}": ${filtered.length} elementos (antes: ${beforeFilter})`,
      )

      if (filtered.length === 0) {
        console.log(`⚠️ No se encontraron elementos para la categoría "${activeCategory}"`)
        console.log(`🔍 Categorías disponibles:`, [...new Set(menuItems.map((item) => item.category))])
      }
    }

    if (searchTerm) {
      const beforeSearch = filtered.length
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      console.log(
        `🔍 Después de filtrar por búsqueda "${searchTerm}": ${filtered.length} elementos (antes: ${beforeSearch})`,
      )
    }

    console.log(
      `🔍 Elementos filtrados finales:`,
      filtered.map((item) => `${item.name} (${item.category})`),
    )
    setFilteredItems(filtered)
  }, [searchTerm, activeCategory, menuItems])

  const categories = ["all", "appetizers", "main", "desserts", "drinks"]
  const categoryNames: Record<string, string> = {
    all: "Todos",
    appetizers: "Entradas",
    main: "Platos Fuertes",
    desserts: "Postres",
    drinks: "Bebidas",
  }

  const categoryIcons: Record<string, string> = {
    appetizers: "🥗",
    main: "🍽️",
    desserts: "🍰",
    drinks: "🍷",
  }

  return (
    <Card className="bg-gray-800/70 backdrop-blur-sm border-cyan-700/30 shadow-xl shadow-cyan-500/10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5"></div>
      <CardHeader className="relative z-10">
        <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          Menú del Restaurante
        </CardTitle>
        <CardDescription className="text-gray-400">
          Explore nuestras deliciosas opciones organizadas por categoría
        </CardDescription>
        <div className="relative mt-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Buscar en el menú..."
            className="pl-8 bg-gray-900/80 border-gray-700/50 text-gray-200 placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid grid-cols-5 mb-4 bg-gray-900/80 border border-gray-700/50 rounded-lg overflow-hidden">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-900/80 data-[state=active]:to-purple-900/80 data-[state=active]:text-cyan-400 transition-all duration-300"
              >
                {category === "all" ? (
                  "Todos"
                ) : (
                  <span className="flex items-center gap-1">
                    <span>{categoryIcons[category]}</span>
                    <span className="hidden sm:inline">{categoryNames[category]}</span>
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="h-[500px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.length > 0 ? (
                (() => {
                  const validatedItems = filteredItems.filter((item) => item && item.id !== undefined && item.name)
                  return validatedItems.map((item) => (
                    <Card
                      key={`menu-item-${item.id}-${item.name.replace(/\s+/g, "-").toLowerCase()}`}
                      className="bg-gray-900/80 border-gray-700/50 overflow-hidden hover:border-cyan-600/50 transition-all duration-300 group"
                    >
                      <div className="p-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-300">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 text-cyan-300 border-cyan-700/50 group-hover:from-cyan-800/40 group-hover:to-purple-800/40 transition-all duration-300"
                            >
                              ${item.price.toFixed(2)}
                            </Badge>
                          </div>
                          <div className="mt-2">
                            <Badge
                              variant="secondary"
                              className="text-xs bg-gray-800/80 text-gray-300 border border-gray-700/50"
                            >
                              {categoryNames[item.category]} {categoryIcons[item.category]}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                })()
              ) : (
                <div className="col-span-2 text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/80 mb-4">
                    <Search className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-gray-500">No se encontraron elementos que coincidan con su búsqueda.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  )
}
