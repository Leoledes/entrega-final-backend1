# 🌿 Plantify API RESTful

-----

## **Descripción del Proyecto**

`Plantify` es una API RESTful desarrollada con Node.js y Express diseñada para la gestión de un inventario de productos, específicamente plantas. Esta API actúa como el *back-end* de una aplicación, proporcionando una serie de *endpoints* que permiten realizar operaciones CRUD (Crear, Leer, Actualizar, Borrar) sobre los productos. Es una solución ideal para sistemas de comercio electrónico, paneles de administración de inventario o cualquier aplicación que requiera una robusta gestión de productos basada en plantas.

-----

## **Tecnologías y Herramientas**

Este proyecto fue construido utilizando:

  * **Node.js**: Entorno de ejecución de JavaScript del lado del servidor.
  * **Express.js**: Un framework web minimalista y flexible para Node.js que proporciona un conjunto robusto de características para aplicaciones web y móviles.
  * **JavaScript**: El lenguaje de programación principal.

-----

## **Características Principales**

  * **Gestión Completa de Productos**: La API permite a los usuarios gestionar el catálogo de productos con operaciones CRUD (creación, lectura, actualización y eliminación).
  * **Servidor de Prueba Integrado**: Incluye una ruta (`/test-products`) que automáticamente genera un producto de ejemplo si el catálogo está vacío, facilitando un inicio rápido del desarrollo y las pruebas.
  * **Manejo de CORS**: Configuración robusta para gestionar solicitudes de origen cruzado, asegurando que la API pueda ser consumida de forma segura por aplicaciones *front-end* alojadas en diferentes dominios.
  * **Manejo de Errores y Rutas No Encontradas**: Implementa un *middleware* para manejar rutas no definidas, retornando un código de estado `404` y un mensaje descriptivo.
  * **Estructura Modular**: Organización clara del código siguiendo patrones como DAO (Data Access Object) y separación de controladores, servicios y rutas para facilitar la escalabilidad y el mantenimiento.

-----

## **Instalación y Uso**

Para poner en marcha la API en tu entorno local, sigue los siguientes pasos:

1.  **Clonar el Repositorio**:

    ```bash
    git clone <https://github.com/Leoledes/segunda-entrega-backend1.git>
    ```

2.  **Navegar al Directorio del Proyecto**:

    ```bash
    cd plantify
    ```

3.  **Instalar Dependencias**:

    ```bash
    npm install
    ```

4.  **Configurar Variables de Entorno**:
    Crea un archivo llamado `.env` en la raíz del proyecto. Este archivo contendrá las variables de entorno necesarias.

    ```env
    # Puerto en el que el servidor escuchará. Si no se especifica, usa 8080 por defecto.
    PORT=8080
    ```

5.  **Iniciar el Servidor**:
    Puedes iniciar el servidor usando Node directamente o a través de un script npm (si está configurado en `package.json`).

    ```bash
    node index.js
    # O si tienes configurado el script "start" en package.json
    # npm start
    ```

    Una vez iniciado, el servidor estará escuchando en `http://localhost:8080` (o el puerto que hayas definido en `.env`).

-----

## **Rutas de la API**

Aquí tienes una descripción de los *endpoints* principales disponibles en la API:

  * **`GET /`**
      * **Descripción**: Ruta de bienvenida simple para verificar que el servidor está funcionando correctamente.
      * **Respuesta**: `Servidor funcionando`
  * **`GET /test-products`**
      * **Descripción**: Obtiene todos los productos del inventario. Si el inventario está vacío, crea un producto de prueba para facilitar el desarrollo.
      * **Respuesta**: `JSON` con la lista de productos.
  * **`GET /api/products`**
      * **Descripción**: Obtiene una lista completa de todos los productos en el inventario.
      * **Respuesta**: `JSON` con un array de objetos de producto.
  * **`POST /api/products`**
      * **Descripción**: Crea un nuevo producto y lo añade al inventario. Requiere un cuerpo de solicitud `JSON` con los detalles del producto.
      * **Cuerpo de la Solicitud (Ejemplo)**:
        ```json
        {
            "name": "Monstera Deliciosa",
            "description": "Una hermosa planta tropical con hojas grandes y distintivas.",
            "price": 25.99,
            "stock": 50,
            "category": "Interior"
        }
        ```
      * **Respuesta**: `JSON` con el producto creado.
  * **`GET /api/products/:id`**
      * **Descripción**: Obtiene los detalles de un producto específico utilizando su `id`.
      * **Parámetros**: `id` (entero) - El ID del producto.
      * **Respuesta**: `JSON` con los detalles del producto.
  * **`PUT /api/products/:id`**
      * **Descripción**: Actualiza la información de un producto existente identificado por su `id`. Requiere un cuerpo de solicitud `JSON` con los campos a actualizar.
      * **Parámetros**: `id` (entero) - El ID del producto.
      * **Cuerpo de la Solicitud (Ejemplo)**:
        ```json
        {
            "price": 27.50,
            "stock": 45
        }
        ```
      * **Respuesta**: `JSON` con el producto actualizado.
  * **`DELETE /api/products/:id`**
      * **Descripción**: Elimina un producto del inventario utilizando su `id`.
      * **Parámetros**: `id` (entero) - El ID del producto.
      * **Respuesta**: `JSON` de confirmación de la eliminación.

-----

## **Estructura del Proyecto**

El proyecto sigue una estructura modular y organizada para facilitar el desarrollo, mantenimiento y escalabilidad. La arquitectura está diseñada para separar las preocupaciones de manera clara.