# Plantify API RESTful

## Descripción del Proyecto

Plantify es una API RESTful desarrollada con Node.js y Express para la gestión de un inventario de productos. Lo que la hace única es su capacidad de ofrecer actualizaciones en tiempo real gracias a WebSockets y la renderización de vistas dinámicas con Handlebars. Es una solución ideal para cualquier aplicación que requiera una gestión de productos robusta, con funcionalidades en tiempo real y una interfaz de usuario simple.

## Tecnologías y Herramientas

Este proyecto fue construido utilizando:

- **Node.js**: Entorno de ejecución de JavaScript del lado del servidor.
- **Express.js**: Framework web minimalista y flexible para Node.js.
- **Express-Handlebars**: Motor de plantillas que permite crear vistas dinámicas en el servidor.
- **Socket.IO**: Librería que habilita la comunicación bidireccional en tiempo real (WebSockets) entre el cliente y el servidor.
- **JavaScript**: El lenguaje de programación principal.


## Características Principales

- **Gestión Completa de Productos**: La API permite realizar operaciones CRUD (crear, leer, actualizar, borrar) en el catálogo de productos.
- **Vistas Dinámicas con Handlebars**: Incluye dos vistas principales, `home.handlebars` para una lista estática de productos y `realTimeProducts.handlebars` para una lista en tiempo real.
- **Actualizaciones en Tiempo Real con WebSockets**: La vista `realTimeProducts.handlebars` se actualiza automáticamente cada vez que se agrega o elimina un producto.
- **Servidor de Prueba Integrado**: Una ruta (`/test-products`) genera un producto de ejemplo si el catálogo está vacío para facilitar un inicio rápido.
- **Manejo de CORS**: Configuración para manejar solicitudes de origen cruzado de manera segura.
- **Manejo de Errores y Rutas No Encontradas**: Un middleware se encarga de retornar un código de estado 404 para rutas no definidas.
- **Estructura Modular**: Código organizado en módulos separados para controladores, rutas y DAO (Data Access Object) para facilitar la escalabilidad y el mantenimiento.


## Instalación y Uso

Para poner en marcha la API en tu entorno local, sigue estos pasos:

### 1. Clonar el Repositorio:

```
git clone https://github.com/Leoledes/segunda-entrega-backend1.git
```

### 2. Navegar al Directorio del Proyecto:

```
cd segunda-entrega-backend1
```

### 3. Instalar Dependencias:

```
npm install
```

### 4. Configurar Variables de Entorno:

Crea un archivo `.env` en la raíz del proyecto y añade el puerto.

```
PORT=8080
```

### 5. Iniciar el Servidor:

```
node index.js
```

Una vez iniciado, el servidor estará escuchando en `http://localhost:8080`.

## Rutas de la API y Vistas

Aquí tienes una descripción de los endpoints principales y las vistas disponibles en la aplicación:

### Endpoints de la API (RESTful)

- **GET /**: Ruta de bienvenida.
- **GET /test-products**: Muestra todos los productos y agrega uno de prueba.
- **GET /api/products**: Obtiene la lista completa de productos.
- **POST /api/products**: Crea un nuevo producto.
- **GET /api/products/:pid**: Obtiene los detalles de un producto por su id.
- **PUT /api/products/:pid**: Actualiza un producto existente por su id.
- **DELETE /api/products/:pid**: Elimina un producto por su id.


### Vistas Renderizadas con Handlebars

- **GET /home**: Muestra una vista estática (`home.handlebars`) con una lista de todos los productos.
- **GET /realtimeproducts**: Presenta una vista dinámica (`realTimeProducts.handlebars`) que usa WebSockets para actualizaciones en tiempo real.


## Estructura del Proyecto

El proyecto sigue una estructura modular para facilitar el desarrollo y el mantenimiento.

```
├── data/
│   └── products.json          # Almacén de datos simulado
├── src/                       # Directorio principal del código fuente
│   ├── controllers/
│   │   └── products.controller.js
│   ├── dao/
│   │   └── products.dao.js
│   ├── routes/
│   │   ├── products.routes.js
│   │   └── views.router.js
│   ├── utils/
│   └── views/
│       ├── layouts/
│       │   └── main.handlebars
│       ├── home.handlebars
│       └── realTimeProducts.handlebars
├── public/
│   ├── js/
│   │   └── realTimeProducts.js
│   └── css/
│       ├── home.css
│       └── realtime.css
├── .env
├── app.js
├── index.js
└── package.json
```