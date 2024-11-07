const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const publicacionRoutes = require('./routes/publicacionRoutes'); // Ruta de publicaciones
const userController = require('./controllers/userController'); // Controlador de usuarios

const http = require("http"); // Importamos el módulo http
const socketIo = require("socket.io"); // Importamos socket.io

// Configuración de variables de entorno
dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Permite manejar datos en formato JSON

// Servir archivos estáticos (si hay imágenes, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'views')));

// Rutas de autenticación y perfil de usuario
app.use('/api/auth', authRoutes);  // Ruta para autenticación (registro e inicio de sesión)
app.use('/api/user', userRoutes);  // Ruta para perfil de usuario
app.use('/api/publicaciones', publicacionRoutes); // Ruta para gestión de publicaciones

// Rutas de mensajería
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/conversations', require('./routes/conversationRoutes'));

// Nueva ruta para cargar amigos (verifica que el controlador y la ruta estén correctos)
// app.get('/api/user/friends/:id_usuario', userController.obtenerAmigos);

// Enviar solicitud de amistad
app.post('/api/user/:id/send-friend-request', userController.sendFriendRequest);

// Aceptar solicitud de amistad
app.put('/api/user/:id/accept-friend-request', userController.acceptFriendRequest);

// Rechazar solicitud de amistad
app.delete('/api/user/:id/reject-friend-request', userController.rejectFriendRequest);

// Ruta para obtener solicitudes de amistad pendientes (API)
app.get('/api/user/:id/pending-friend-requests', userController.getPendingFriendRequests); 

// Obtener estado de la solicitud de amistad entre dos usuarios
app.get('/api/user/:id/friendship-status', userController.getFriendshipStatus);

// Obtener lista de amigos de un usuario
app.get('/api/user/friends/:id', userController.getFriends);

// Rutas para mostrar vistas (index, login, register)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Ruta para mostrar el perfil de usuario
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'profile.html'));
});

// Creación del servidor HTTP
const server = http.createServer(app); // Creamos el servidor HTTP con Express

// Configuración de Socket.io
const io = socketIo(server); // Asociamos Socket.io con el servidor HTTP

// Conectar los controladores de socket.io con el objeto 'io'
require('./sockets/messageSocket')(io);  // Pasa el objeto 'io' a tu archivo de sockets
require('./sockets/notificationSocket')(io); // Pasa el objeto 'io' a tus otros controladores de socket

// Middleware para manejar errores (opcional, pero recomendado)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Servidor escuchando en el puerto especificado
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => { // Usamos server.listen para iniciar el servidor con Socket.io
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
