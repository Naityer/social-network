// controllers/userController.js
const { Usuario, Amistad } = require('../models'); // Asegúrate de importar los modelos correctos
const Sequelize = require('sequelize');

/*
========================================================================================
    MODIFICADORES DE PERFIL DE USUARIO
========================================================================================
*/

// Obtener el perfil de un usuario
exports.getUserProfile = async (req, res) => {
    const userId = req.params.id; // ID del usuario se pasa como parámetro
    console.log(userId);
    try {
        const user = await Usuario.findOne({
            where: { id_usuario: userId }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(user); // Devuelve el perfil del usuario
    } catch (err) {
        console.error("Error al obtener el perfil:", err);
        res.status(500).json({ error: 'Error al obtener el perfil' });
    }
};

// Actualizar el perfil 
exports.updateUserProfile = async (req, res) => {
    const userId = req.params.id; // ID del usuario
    const { nombreUsuario, email, nombreCompleto } = req.body; // Campos a actualizar

    // Verifica que se proporcionen datos a actualizar
    if (!nombreUsuario && !email && !nombreCompleto) {
        return res.status(400).json({ error: 'Faltan datos para actualizar' });
    }

    try {
        const [updated] = await Usuario.update(
            { nombre_usuario: nombreUsuario, email, nombre_completo: nombreCompleto },
            { where: { id_usuario: userId } }
        );

        if (updated) {
            res.json({ message: 'Perfil actualizado exitosamente' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (err) {
        console.error("Error al actualizar el perfil:", err);
        res.status(500).json({ error: 'Error al actualizar el perfil' });
    }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
    const userId = req.params.id; // ID del usuario a eliminar

    try {
        const deleted = await Usuario.destroy({
            where: { id_usuario: userId }
        });

        if (deleted) {
            res.json({ message: 'Usuario eliminado exitosamente' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (err) {
        console.error("Error al eliminar el usuario:", err);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
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
        const friends = await Usuario.findAll({
            where: {
                nombre_completo: {
                    [Sequelize.Op.like]: `%${query}%`
                }
            }
        });

        res.json(friends);
    } catch (error) {
        console.error('Error al buscar amigos:', error); // Log del error en consola
        res.status(500).json({ error: 'Error al buscar amigos' });
    }
};

// Obtener amigos recientes y sugerencias
exports.getFriendSuggestions = async (req, res) => {
    const { userId } = req.query;
    console.log("Solicitud recibida para userId:", userId);

    try {
        // Obtener amigos recientes (aquellos que están en estado 'aceptada')
        const recentFriends = await Amistad.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { id_usuario1: userId, estado: 'aceptada' },
                    { id_usuario2: userId, estado: 'aceptada' }
                ]
            },
            include: [
                {
                    model: Usuario,
                    as: 'Usuario1', // Relación con el usuario 1
                    attributes: ['id_usuario', 'nombre_completo', 'nombre_usuario']
                },
                {
                    model: Usuario,
                    as: 'Usuario2', // Relación con el usuario 2
                    attributes: ['id_usuario', 'nombre_completo', 'nombre_usuario']
                }
            ],
            order: [['fecha_solicitud', 'DESC']], // Ordenar por la fecha de solicitud
            limit: 5
        });

        // Extraer amigos de la relación 'Usuario1' y 'Usuario2'
        const friends = [];
        recentFriends.forEach(amistad => {
            if (amistad.Usuario1.id_usuario !== userId) {
                friends.push(amistad.Usuario1); // Añadir a los amigos desde 'Usuario1'
            }
            if (amistad.Usuario2.id_usuario !== userId) {
                friends.push(amistad.Usuario2); // Añadir a los amigos desde 'Usuario2'
            }
        });

        // Obtener sugerencias de amigos (usuarios que no son el usuario actual)
        const suggestions = await Usuario.findAll({
            where: { id_usuario: { [Sequelize.Op.ne]: userId } }, // Excluir al usuario actual
            attributes: ['id_usuario', 'nombre_completo', 'nombre_usuario'],
            limit: 10
        });

        res.json({ recentFriends: friends, suggestions });
    } catch (error) {
        console.error('Error al obtener sugerencias:', error);
        res.status(500).json({ error: 'Error al obtener sugerencias' });
    }
};

/*
========================================================================================
    METODOS DE GESTION DE AMIGOS
========================================================================================
*/

exports.sendFriendRequest = async (req, res) => {
    const id_usuario1 = req.params.id; // Usuario que envía la solicitud
    const { receiverId } = req.body; // Usuario al que se le envía la solicitud (receptor)
    console.log(`Usuario que envía solicitud: ${id_usuario1}`);
    console.log(`Usuario receptor: ${receiverId}`);

    try {
        // Verificar si los IDs son diferentes (no puedes enviarte una solicitud a ti mismo)
        if (id_usuario1 === receiverId) {
            return res.status(400).json({ error: 'No puedes enviarte una solicitud a ti mismo' });
        }

        // Verificar si ya existe una solicitud pendiente entre los dos usuarios
        const existingRequest = await Amistad.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { id_usuario1, id_usuario2: receiverId, estado: 'pendiente' },
                    { id_usuario1: receiverId, id_usuario2: id_usuario1, estado: 'pendiente' },
                    { id_usuario1, id_usuario2: receiverId, estado: 'aceptada' },
                    { id_usuario1: receiverId, id_usuario2: id_usuario1, estado: 'aceptada' }
                ]
            }
        });

        if (existingRequest) {
            return res.status(400).json({ error: 'Ya existe una solicitud pendiente o ya son amigos.' });
        }

        // Crear una nueva solicitud de amistad
        const newFriendship = await Amistad.create({
            id_usuario1,
            id_usuario2: receiverId,
            estado: 'pendiente',
            fecha_solicitud: new Date()
        });

        // Responder con la solicitud creada
        res.status(200).json({
            message: 'Solicitud de amistad enviada con éxito.',
            friendship: newFriendship
        });
    } catch (error) {
        console.error('Error al enviar solicitud de amistad:', error);
        res.status(500).json({ error: error.message });
    }
};


// Método para obtener la lista de amigos de un usuario
exports.getFriends = async (req, res) => {
    const { userId } = req.params; // Suponiendo que userId se pasa como parámetro en la URL
  
    try {
      // Obtenemos la lista de amigos usando el método getFriends del modelo Usuario
      const friends = await Usuario.getFriends(userId);
  
      // Enviamos la lista de amigos como respuesta
      res.status(200).json(friends);
    } catch (error) {
      console.error('Error al obtener la lista de amigos:', error.message);
      res.status(500).json({ error: 'Error al obtener la lista de amigos' });
    }
  };

// Método para obtener el estado de la solicitud de amistad entre dos usuarios
exports.getFriendshipStatus = async (req, res) => {
    const id_usuario1 = req.params.id;  // ID del usuario que hace la consulta (el que está logueado)
    const { receiverId } = req.query;   // ID del usuario con el que se verifica la amistad

    try {
        // Consultar el estado de la solicitud de amistad
        const estado = await Amistad.getFriendshipStatus(id_usuario1, receiverId);

        // Responder con el estado de la amistad
        res.status(200).json({ status: estado });
    } catch (error) {
        console.error('Error al obtener el estado de la solicitud de amistad:', error);
        res.status(500).json({ error: 'Error al obtener el estado de la solicitud de amistad' });
    }
};

  
  // Aceptar solicitud de amistad
  exports.acceptFriendRequest = async (req, res) => {
    const { id_usuario2 } = req.body;
    const id_usuario1 = req.params.id;
  
    try {
      const friendship = await Amistad.acceptFriendRequest(id_usuario1, id_usuario2);
      res.status(200).json(friendship);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Rechazar solicitud de amistad
  exports.rejectFriendRequest = async (req, res) => {
    const { id_usuario2 } = req.body;
    const id_usuario1 = req.params.id;
  
    try {
      const response = await Amistad.rejectFriendRequest(id_usuario1, id_usuario2);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Obtener solicitudes de amistad pendientes
exports.getPendingFriendRequests = async (req, res) => {
    const id_usuario = req.params.id; // Obtenemos el ID del usuario desde los parámetros de la URL
    
    try {
      const pendingRequests = await Amistad.getPendingRequests(id_usuario);
      res.status(200).json(pendingRequests); // Devolvemos las solicitudes pendientes al cliente
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener solicitudes de amistad pendientes' });
    }
  };
  

/*
========================================================================================
    ACTUALIZADOR PAGINA DE INICIO
========================================================================================
*/

// Obtener usuario específico (por ejemplo, por nombre de usuario)
exports.obtenerUsuario = async (req, res) => {
    const username = req.params.id_usuario;

    if (!id_usuario) {
        return res.status(400).json({ error: "ID de usuario no proporcionado" });
    }

    try {
        const user = await Usuario.findOne({
            where: { nombre_usuario: username }
        });

        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(user);
    } catch (err) {
        console.error('Error al obtener el usuario:', err);
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};

// Obtener lista de amigos de un usuario
exports.obtenerAmigos = async (req, res) => {
    const userId = req.params.id_usuario;
    console.log(userId);
    try {
        const friends = await Amistad.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { id_usuario1: userId, estado: 'aceptada' },
                    { id_usuario2: userId, estado: 'aceptada' }
                ]
            },
            include: [
                {
                    model: Usuario,
                    as: 'Usuario1', 
                    attributes: ['id_usuario', 'nombre_completo', 'nombre_usuario']
                },
                {
                    model: Usuario,
                    as: 'Usuario2', 
                    attributes: ['id_usuario', 'nombre_completo', 'nombre_usuario']
                }
            ]
        });

        const amigos = [];
        friends.forEach(friendship => {
            if (friendship.Usuario1.id_usuario !== userId) {
                amigos.push(friendship.Usuario1);
            }
            if (friendship.Usuario2.id_usuario !== userId) {
                amigos.push(friendship.Usuario2);
            }
        });

        res.json(amigos); 
    } catch (error) {
        console.error('Error al obtener la lista de amigos:', error);
        res.status(500).json({ error: 'Error al obtener la lista de amigos' });
    }
};

  
