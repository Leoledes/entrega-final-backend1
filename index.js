const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const { productManager } = require('./src/dao/products.dao');

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    productManager.getProducts().then(products => {
        socket.emit('updateProducts', products);
    });

    socket.on('addProduct', async (productData) => {
        try {
            await productManager.addProduct(productData);
            const updatedProducts = await productManager.getProducts();
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            console.error('Error al agregar producto:', error);
            socket.emit('productError', { message: 'Error al agregar el producto.' });
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            await productManager.deleteProduct(Number(productId));
            const updatedProducts = await productManager.getProducts();
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            socket.emit('productError', { message: 'Error al eliminar el producto.' });
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});