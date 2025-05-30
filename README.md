 Requisitos Previos
Node.js v18 o superior
npm
Java JDK 17 o superior
Maven (para compilar el backend)

🔧 Instalación y Ejecución
1. Clonar el Repositorio
git clone https://github.com/JuanMaya8/finalPatronesEstructuras.git
cd finalPatronesEstructuras

2. Configurar y Ejecutar el Backend
cd Backend
mvn clean install
mvn spring-boot:run
El backend se iniciará en http://localhost:8080.

3. Configurar y Ejecutar el Frontend
cd ../Frontend
npm install
npm run dev
El frontend estará disponible en http://localhost:3000.

Tecnologías Utilizadas
Frontend
Next.js 14
TypeScript
Tailwind CSS
Shadcn/UI
Lucide React

Backend
Java Spring Boot
Maven
