# 🌱 Plantify - E-commerce Backend

API RESTful desarrollada con **Node.js**, **Express** y **MongoDB** para la gestión de un e-commerce de plantas.  
Incluye CRUD de productos, gestión de carritos, paginación avanzada y actualizaciones en tiempo real con **WebSockets**.

---

## 📋 Tabla de Contenidos

- [✨ Características](#-características)
- [🛠 Tecnologías](#-tecnologías)
- [📦 Requisitos Previos](#-requisitos-previos)
- [🚀 Instalación y Setup](#-instalación-y-setup)
- [⚙️ Configuración de Entorno](#-configuración-de-entorno)
- [🎮 Uso](#-uso)
- [📡 API Endpoints](#-api-endpoints)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🎯 Funcionalidades Principales](#-funcionalidades-principales)
- [🧪 Testing](#-testing)
- [🤝 Contribuciones](#-contribuciones)
- [📝 Scripts Disponibles](#-scripts-disponibles)
- [📄 Licencia](#-licencia)
- [👤 Autor](#-autor)
- [🐛 Reporte de Bugs](#-reporte-de-bugs)
- [📚 Documentación Adicional](#-documentación-adicional)

---

## ✨ Características

**Gestión de Productos**
- CRUD completo de productos
- Paginación (`limit`, `page`, `sort`, `query`)
- Filtros por categoría y disponibilidad
- Ordenamiento ascendente/descendente por precio
- Respuesta con metadata completa

**Gestión de Carritos**
- Creación automática de carrito por sesión
- Agregar/eliminar productos
- Actualizar cantidades
- Reemplazar todos los productos
- Vaciar carrito completo
- Referencias pobladas con detalles de productos

**Vistas Dinámicas**
- Catálogo con paginación visual
- Detalle de producto individual
- Carrito con productos poblados
- Actualizaciones en tiempo real con WebSockets

**Técnicas**
- Arquitectura modular (MVC + DAO)
- Persistencia con MongoDB y Mongoose
- Sistema de sesiones con Express-Session
- WebSockets para actualizaciones en tiempo real
- Validaciones robustas
- Manejo centralizado de errores

---

## 🛠 Tecnologías

Node.js, Express.js, MongoDB, Mongoose, Express-Handlebars, Socket.IO,  
Express-Session, Dotenv, Cloudinary (opcional), Multer

---

## 📦 Requisitos Previos

- Node.js ≥ 14
- MongoDB (local o Atlas)
- npm o yarn

---

## 🚀 Instalación y Setup

1️⃣ **Clonar el repositorio**  
- `git clone https://github.com/Leoledes/entrega-final-backend1.git`  
- `cd entrega-final-backend1`

2️⃣ **Instalar dependencias y ejecutar setup**  
- `npm run setup`  

3️⃣ **Configurar variables de entorno**  
- Copiar plantilla: `cp .env.profe .env`  
- Editar `.env` con tus valores:
  - `PORT=8080`
  - `MONGO_URI=mongodb://localhost:27017/plantify`
  - `SESSION_SECRET=tu_secreto_super_seguro`  

4️⃣ **Iniciar la aplicación**  
- Producción: `npm start`  
- Desarrollo: `npm run dev`  
- Verificar: `http://localhost:8080`

---

## ⚙️ Configuración de Entorno

| Variable         | Descripción                  | Valor por defecto |
|------------------|-----------------------------|-----------------|
| `PORT`           | Puerto del servidor          | 8080            |
| `MONGO_URI`      | URI de conexión a MongoDB    | (requerido)     |
| `SESSION_SECRET` | Secreto para firmar sesiones | (requerido)     |

---

## 🎮 Uso

**Rutas Principales**
- Inicio: `/`
- Catálogo: `/home` o `/products`
- Detalle de producto: `/products/:pid`
- Carrito: `/carts/:cid`
- Productos en tiempo real: `/realtimeproducts`
- Carritos en tiempo real: `/realtimecarts`

**Ejemplos de Paginación y Filtros**
- `/products?page=2`
- `/products?limit=5`
- `/products?query=Interior`
- `/products?query=status:true`
- `/products?sort=asc`
- `/products?query=Interior&sort=asc&limit=5&page=1`

---

## 📡 API Endpoints

**Productos**
- `GET /api/products`
- `GET /api/products/:pid`
- `POST /api/products`
- `PUT /api/products/:pid`
- `DELETE /api/products/:pid`

**Carritos**
- `POST /api/carts`
- `GET /api/carts/:cid`
- `POST /api/carts/:cid/products/:pid`
- `PUT /api/carts/:cid`
- `PUT /api/carts/:cid/products/:pid`
- `DELETE /api/carts/:cid/products/:pid`
- `DELETE /api/carts/:cid`

---

## 📁 Estructura del Proyecto

entrega-final-backend1/
- index.js                    
- package-lock.json
- package.json                 
- public/                      
  - css/                      
    - carts.css
    - home.css
    - productDetail.css
    - products.css
    - realtime.css
    - realtimeCarts.css
  - docs/
    - README.md
  - js/                        
    - cart.js
    - home.js
    - realTimeCarts.js
    - realTimeProducts.js
- src/                         
  - app.js                    
  - config/                    
    - config.js
    - database.js              
    - server.js               
  - controllers/               
    - cartController.js
    - productsController.js
  - dao/                       
    - cart.dao.js
    - product.dao.js
  - data/                      
    - carts.json
    - products.json
  - managers/                 
    - cartManager.js
    - productManager.js
  - middlewares/               
    - cartInitializer.js
  - models/                   
    - cart.model.js
    - product.model.js
  - routes/                    
    - api/
      - carts.js
    - carts.routes.js
    - products.routes.js
    - views.router.js
  - services/                 
    - productService.js
  - utils/                     
    - fileManager.js
  - views/                     
    - home.handlebars
    - layouts/
      - main.handlebars
    - pages/
      - cartDetail.handlebars
      - productDetail.handlebars
      - products.handlebars
    - realTimeCarts.handlebars
    - realTimeProducts.handlebars


---

## 🎯 Funcionalidades Principales

- Paginación con metadata completa
- Filtros avanzados
- Carritos con referencias (`populate()`)
- WebSockets en tiempo real
- Carrito único por sesión

---

## 🧪 Testing

Ejemplo con cURL:

### Obtener productos con paginación
```bash
curl http://localhost:8080/api/products?page=1&limit=5
Crear producto
bash
Copiar código
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Pothos", "price": 1200, "stock": 20, "category": "Interior"}'
Agregar producto al carrito
bash
Copiar código
curl -X POST http://localhost:8080/api/carts/CART_ID/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -d '{"quantity": 2}'
🤝 Contribuciones
Fork del proyecto

Crear rama:

bash
Copiar código
git checkout -b feature/AmazingFeature
Commit cambios:

bash
Copiar código
git commit -m 'Add some AmazingFeature'
Push:

bash
Copiar código
git push origin feature/AmazingFeature
Abrir Pull Request

📝 Scripts Disponibles
json
Copiar código
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
Abrir un issue en GitHub.

📚 Documentación Adicional
Express.js

MongoDB

Mongoose

Socket.IO

Handlebars

Desarrollado para Backend 1 - Coderhouse
