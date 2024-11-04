// routes/publicacionRoutes.js
const express = require('express');
const router = express.Router();
const publicacionController = require('../controllers/publicacionController');

// Obtener todas las publicaciones
router.get('/', publicacionController.obtenerPublicaciones); // Cambiado a '/' para ser más RESTful

// Obtener comentarios de una publicación específica
router.get('/:id_publicacion/comentarios', publicacionController.obtenerComentarios);

module.exports = router;
