// app.js
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Configuración de variables de entorno
dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Permite manejar datos en formato JSON

// Servir archivos estáticos
app.use(express.static('views'));

// Rutas de autenticación y perfil de usuario
app.use('/api/auth', authRoutes);  // Ruta para autenticación (registro e inicio de sesión)
app.use('/api/user', userRoutes);  // Ruta para perfil de usuario

// Ruta principal para mostrar index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Ruta para mostrar register.html
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Ruta para mostrar login.html
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Middleware para manejar errores (opcional, pero recomendado)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Servidor escuchando en el puerto especificado
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
