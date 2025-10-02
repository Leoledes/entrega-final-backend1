🌱 Plantify - E-commerce Backend

API RESTful desarrollada con Node.js, Express y MongoDB para la gestión completa de un e-commerce de plantas. Incluye gestión de productos, carritos de compra, paginación avanzada, y actualizaciones en tiempo real con WebSockets.

📋 Tabla de Contenidos

Características

Tecnologías

Requisitos Previos

Instalación y Setup

Configuración de Entorno

Uso

API Endpoints

Estructura del Proyecto

Funcionalidades Principales

Testing

Contribuciones

Scripts Disponibles

Licencia

Autor

Reporte de Bugs

Documentación Adicional

✨ Características
Gestión de Productos

CRUD completo de productos

Paginación profesional con limit, page, sort y query

Filtros por categoría y disponibilidad

Ordenamiento ascendente/descendente por precio

Formato de respuesta con metadata de paginación completa

Gestión de Carritos

Creación automática de carrito por sesión

Agregar/eliminar productos individuales

Actualizar cantidades de productos

Reemplazar todos los productos del carrito

Vaciar carrito completo

Referencias pobladas con detalles completos de productos

Vistas Dinámicas

Catálogo de productos con paginación visual

Vista detallada de producto individual

Vista de carrito con productos populados

Actualizaciones en tiempo real con WebSockets

Características Técnicas

Arquitectura modular (MVC + DAO)

Persistencia con MongoDB y Mongoose

Sistema de sesiones con Express-Session

WebSockets para actualizaciones en tiempo real

Validaciones robustas en todas las capas

Manejo centralizado de errores

🛠 Tecnologías

Node.js - Entorno de ejecución de JavaScript

Express.js - Framework web minimalista

MongoDB - Base de datos NoSQL

Mongoose - ODM para MongoDB

Express-Handlebars - Motor de plantillas

Socket.IO - Comunicación bidireccional en tiempo real

Express-Session - Manejo de sesiones

Dotenv - Gestión de variables de entorno

Cloudinary - Gestión de imágenes (opcional)

Multer - Carga de archivos

📦 Requisitos Previos

Node.js (versión 14 o superior)

MongoDB (local o MongoDB Atlas)

npm o yarn

🚀 Instalación y Setup

Clonar el repositorio:

git clone https://github.com/Leoledes/entrega-final-backend1.git
cd entrega-final-backend1


Instalar dependencias y ejecutar setup:

npm run setup


Esto instalará todas las dependencias y ejecutará src/config/setup.js si existe algún script inicial de configuración.

Configurar variables de entorno:

Copiar el archivo .env.example a .env y completar los valores:

cp .env.example .env


Ejemplo de .env:

PORT=8080
MONGO_URI=mongodb://localhost:27017/plantify
SESSION_SECRET=tu_secreto_super_seguro


Iniciar la aplicación:

Modo producción:

npm start


Modo desarrollo (con recarga automática):

npm run dev


Verificar funcionamiento:
La aplicación estará disponible en http://localhost:8080.

⚙️ Configuración de Entorno
Variable	Descripción	Valor por Defecto
PORT	Puerto del servidor	8080
MONGO_URI	URI de conexión a MongoDB	(requerido)
SESSION_SECRET	Secreto para firmar sesiones	(requerido)

Nota: Nunca subir .env con datos reales a repositorios públicos. Se debe usar .env.example como plantilla.

🎮 Uso
Rutas Principales

Inicio: /

Catálogo: /home o /products

Detalle de producto: /products/:pid

Ver carrito: /carts/:cid

Productos en tiempo real: /realtimeproducts

Carritos en tiempo real: /realtimecarts

Ejemplos de Paginación y Filtros

Paginación básica:

/products?page=2
/products?limit=5


Filtros por categoría:

/products?query=Interior
/products?query=category:Interior


Filtros por disponibilidad:

/products?query=true
/products?query=status:true


Ordenamiento:

/products?sort=asc
/products?sort=desc


Combinaciones:

/products?query=Interior&sort=asc&limit=5&page=1

📡 API Endpoints
Productos
GET /api/products

Obtiene lista de productos con paginación y filtros.

Query Parameters:

limit (opcional): Cantidad de productos por página (default: 10)

page (opcional): Número de página (default: 1)

query (opcional): Filtro de búsqueda (categoría o disponibilidad)

sort (opcional): Ordenamiento por precio (asc o desc)

Respuesta:

{
  "status": "success",
  "payload": [...],
  "totalPages": 5,
  "prevPage": 1,
  "nextPage": 3,
  "page": 2,
  "hasPrevPage": true,
  "hasNextPage": true,
  "prevLink": "http://localhost:8080/api/products?page=1",
  "nextLink": "http://localhost:8080/api/products?page=3"
}

GET /api/products/:pid

Obtiene un producto específico por ID.

POST /api/products

Crea un nuevo producto.

Body:

{
  "name": "Monstera Deliciosa",
  "description": "Planta de interior",
  "price": 2500,
  "stock": 15,
  "category": "Interior",
  "thumbnails": ["url_imagen"],
  "status": true
}

PUT /api/products/:pid

Actualiza un producto existente.

DELETE /api/products/:pid

Elimina un producto.

Carritos
POST /api/carts

Crea un nuevo carrito vacío.

GET /api/carts/:cid

Obtiene un carrito con productos poblados.

POST /api/carts/:cid/products/:pid

Agrega un producto al carrito.

PUT /api/carts/:cid

Actualiza todos los productos del carrito.

PUT /api/carts/:cid/products/:pid

Actualiza la cantidad de un producto específico.

DELETE /api/carts/:cid/products/:pid

Elimina un producto específico del carrito.

DELETE /api/carts/:cid

Vacía el carrito completamente.

📁 Estructura del Proyecto
entrega-final-backend1/
├── index.js                      
├── package.json                  
├── public/                       
│   ├── css/                      
│   └── js/                       
└── src/
    ├── app.js                    
    ├── config/
    ├── controllers/              
    ├── dao/                      
    ├── models/                   
    ├── routes/                   
    ├── middlewares/              
    ├── services/                 
    ├── utils/                    
    └── views/                    

🎯 Funcionalidades Principales

Paginación Profesional con metadata completa.

Filtros Avanzados por categoría, disponibilidad y ordenamiento.

Sistema de Carritos con Referencias (populate()) para obtener detalles completos de productos.

WebSockets en Tiempo Real para productos y carritos.

Sistema de Sesiones que genera un carrito único por usuario.

🧪 Testing

Prueba los endpoints con Postman, Insomnia, Thunder Client o cURL.

# Obtener productos con paginación
curl http://localhost:8080/api/products?page=1&limit=5

# Crear un producto
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Pothos", "price": 1200, "stock": 20, "category": "Interior"}'

# Agregar producto al carrito
curl -X POST http://localhost:8080/api/carts/CART_ID/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -d '{"quantity": 2}'

🤝 Contribuciones

Fork el proyecto

Crear una rama para tu feature (git checkout -b feature/AmazingFeature)

Commit tus cambios (git commit -m 'Add some AmazingFeature')

Push a la rama (git push origin feature/AmazingFeature)

Abrir un Pull Request

📝 Scripts Disponibles
{
  "start": "node src/config/server.js",
  "dev": "nodemon src/config/server.js",
  "setup": "npm install && node src/config/setup.js"
}

📄 Licencia

Licencia ISC. Código abierto.

👤 Autor

Leonardo Ledesma
GitHub: @Leoledes

🐛 Reporte de Bugs

Abre un issue
 en GitHub.

📚 Documentación Adicional

Express.js Documentation

MongoDB Documentation

Mongoose Documentation

Socket.IO Documentation

Handlebars Documentation

Desarrollado para Backend 1 - Coderhouse