// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Asegúrate de que esta ruta es correcta

// Verifica que las funciones estén definidas en el controlador
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
