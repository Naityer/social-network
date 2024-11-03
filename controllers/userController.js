// controllers/userController.js
const User = require('../models/userModel');

// Obtener el perfil de un usuario
exports.getUserProfile = (req, res) => {
    const userId = req.params.id; // ID del usuario se pasa como parámetro

    User.findById(userId, (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(results[0]); // Devuelve el perfil del usuario
    });
};

// Actualizar el perfil de un usuario
exports.updateUserProfile = (req, res) => {
    const userId = req.params.id; // ID del usuario
    const { nombreUsuario, email, nombreCompleto } = req.body; // Campos a actualizar

    // Verifica que se proporcionen datos a actualizar
    if (!nombreUsuario && !email && !nombreCompleto) {
        return res.status(400).json({ error: 'Faltan datos para actualizar' });
    }

    User.updateUser(userId, { nombreUsuario, email, nombreCompleto }, (err, result) => {
        if (err) {
            console.error("Error al actualizar el perfil:", err);
            return res.status(500).json({ error: 'Error al actualizar el perfil' });
        }
        res.json({ message: 'Perfil actualizado exitosamente' });
    });
};

// Eliminar un usuario
exports.deleteUser = (req, res) => {
    const userId = req.params.id; // ID del usuario a eliminar

    User.deleteUser(userId, (err, result) => {
        if (err) {
            console.error("Error al eliminar el usuario:", err);
            return res.status(500).json({ error: 'Error al eliminar el usuario' });
        }
        res.json({ message: 'Usuario eliminado exitosamente' });
    });
};
