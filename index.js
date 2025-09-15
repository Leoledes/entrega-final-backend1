const app = require('./app');
const http = require('http'); 
const { Server } = require('socket.io');
require('dotenv').config();

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});