// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Obtener el perfil de un usuario
router.get('/profile/:id', userController.getUserProfile);

// Actualizar el perfil de un usuario
router.put('/profile/:id', userController.updateUserProfile);

// Eliminar un usuario
router.delete('/profile/:id', userController.deleteUser);

module.exports = router;
