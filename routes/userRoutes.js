const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Obtener el perfil de un usuario
router.get('/profile/:id', userController.getUserProfile);

// Actualizar el perfil de un usuario
router.put('/profile/:id', userController.updateUserProfile);

// Eliminar un usuario
router.delete('/profile/:id', userController.deleteUser);

// Obtener la lista de usuarios (si es necesario)
router.get('/usuario', userController.obtenerUsuario);

// Obtener amigos de un usuario
router.get('/amigos', userController.obtenerAmigos);

// Ruta para buscar amigos
router.get('/search', userController.searchFriends);

// Ruta para obtener la lista de amigos de un usuario
router.get('mensajes/:userId/friends', userController.getFriends);

// Sugerencias de amigos
router.get('/friend-suggestions', userController.getFriendSuggestions);

// Ruta para enviar una solicitud de amistad
router.post('/profile/:id/send-friend-request', userController.sendFriendRequest);

// Aceptar una solicitud de amistad
router.put('/profile/:id/accept-friend-request', userController.acceptFriendRequest);

// Rechazar una solicitud de amistad
router.delete('/profile/:id/reject-friend-request', userController.rejectFriendRequest);

// Obtener solicitudes de amistad pendientes
router.get('/profile/:id/pending-friend-requests', userController.getPendingFriendRequests);

// Ruta para obtener el estado de la solicitud de amistad entre dos usuarios
router.get('/profile/:id/friendship-status', userController.getFriendshipStatus);



module.exports = router;
