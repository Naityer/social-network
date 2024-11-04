// controllers/userController.js
const User = require('../models/userModel');

/*
========================================================================================
    MODIFICADORES DE PERFIL DE USUARIO
========================================================================================
*/

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

// Actualizar el perfil 
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

/*
========================================================================================
    METODOS DE BUSQUEDA DE USUARIOS
========================================================================================
*/

exports.searchFriends = async (req, res) => {
    const { query } = req.query;
    console.log("Consulta recibida:", query); // Verifica qué consulta se está recibiendo
    try {
        const friends = await User.searchFriendsByName(query);
        res.json(friends);
    } catch (error) {
        console.error('Error al buscar amigos:', error); // Log del error en consola
        res.status(500).json({ error: 'Error al buscar amigos' });
    }
};

// obtener amigos recientes y sugerencias
exports.getFriendSuggestions = async (req, res) => {
    const { userId } = req.query;
    console.log("Solicitud recibida para userId:", userId);
    try {
        const recentFriends = await User.getRecentFriends(userId, 5);
        const suggestions = await User.getSuggestions(userId, 10);

        // Agregar logs para verificar los resultados
        console.log("Amigos recientes:", recentFriends);
        console.log("Sugerencias:", suggestions);

        res.json({ recentFriends, suggestions });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener sugerencias' });
    }
};

/*
========================================================================================
    ACTUALIZADOR PAGINA DE INICIO
========================================================================================
*/

// Obtener usuario específico (por ejemplo, por nombre de usuario)
exports.obtenerUsuario = (req, res) => {
    const username = req.query.nombre_usuario;

    User.findByUsername(username)
        .then((user) => {
            if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
            res.json(user);
        })
        .catch((err) => res.status(500).json({ error: 'Error al obtener el usuario' }));
};

// Obtener lista de amigos de un usuario
exports.obtenerAmigos = (req, res) => {
    const userId = req.query.id_usuario;

    User.getAmigos(userId)
        .then((friends) => res.json(friends))
        .catch((err) => res.status(500).json({ error: 'Error al obtener la lista de amigos' }));
};

