//models/amistadModels.js
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('./db');
const Usuario = require('./userModel');

const Amistad = sequelize.define('Amistad', {
  id_amistad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_usuario1: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id_usuario',
    },
  },
  id_usuario2: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id_usuario',
    },
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'aceptada', 'rechazada'),
    defaultValue: 'pendiente',
  },
  fecha_solicitud: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Amistad',
  timestamps: false,
  uniqueKeys: {
    unique_friendship: {
      fields: ['id_usuario1', 'id_usuario2']
    }
  }
});

// Método optimizado para obtener lista de amigos de un usuario sin imagen de perfil
Usuario.getFriends = async (id_usuario) => {
  try {
    const friends = await Usuario.findAll({
      attributes: ['id_usuario', 'nombre_usuario', 'nombre_completo'], // Eliminamos 'imagen_perfil_url'
      include: [{
        model: Amistad,
        as: 'AmigosUsuario1',
        where: { estado: 'aceptada', id_usuario1: id_usuario },
        required: true,
        include: [{
          model: Usuario,
          as: 'Usuario2',
          attributes: ['id_usuario', 'nombre_usuario', 'nombre_completo'] // Eliminamos 'imagen_perfil_url' aquí también
        }]
      }]
    });
    
    // Mapeamos el resultado para devolver solo los datos de Usuario2
    return friends.map(friend => friend.Usuario2);
  } catch (error) {
    throw new Error('Error al obtener la lista de amigos: ' + error.message);
  }
};


// Método optimizado para obtener amigos en común entre dos usuarios
Usuario.getMutualFriends = async (id_usuario1, id_usuario2) => {
  try {
    const mutualFriends = await Usuario.findAll({
      attributes: ['id_usuario', 'nombre_usuario', 'nombre_completo', 'imagen_perfil_url'],
      include: [{
        model: Amistad,
        as: 'AmigosUsuario1',
        where: { estado: 'aceptada', id_usuario1: id_usuario1 },
        required: true,
        include: [{
          model: Amistad,
          as: 'AmigosUsuario2',
          where: { estado: 'aceptada', id_usuario1: id_usuario2 },
          required: true,
          include: [{
            model: Usuario,
            as: 'Usuario2',
            attributes: ['id_usuario', 'nombre_usuario', 'nombre_completo', 'imagen_perfil_url']
          }]
        }]
      }]
    });

    // Devolver la lista de amigos comunes
    return mutualFriends.map(friend => friend.Usuario2);
  } catch (error) {
    throw error;
  }
};

// Enviar una solicitud de amistad
Amistad.sendFriendRequest = async (id_usuario1, id_usuario2) => {
  if (id_usuario1 === id_usuario2) {
    throw new Error('No puedes enviarte una solicitud a ti mismo');
  }

  // Comprobar si ya existen solicitudes previas entre los dos usuarios
  const existingRequest = await Amistad.findOne({
    where: {
      [Sequelize.Op.or]: [
        { id_usuario1, id_usuario2 },
        { id_usuario1: id_usuario2, id_usuario2: id_usuario1 }
      ]
    }
  });

  if (existingRequest) {
    throw new Error('Ya existe una solicitud de amistad entre estos usuarios');
  }

  // Crear una nueva solicitud de amistad
  try {
    const friendship = await Amistad.create({
      id_usuario1,
      id_usuario2,
      estado: 'pendiente',
    });
    return friendship;
  } catch (error) {
    throw new Error('Error al enviar la solicitud de amistad: ' + error.message);
  }
};

// Aceptar solicitud de amistad
Amistad.acceptFriendRequest = async (id_usuario1, id_usuario2) => {
  try {
    const friendship = await Amistad.findOne({
      where: {
        [Sequelize.Op.or]: [
          { id_usuario1, id_usuario2, estado: 'pendiente' },
          { id_usuario1: id_usuario2, id_usuario2: id_usuario1, estado: 'pendiente' }
        ]
      }
    });

    if (!friendship) {
      throw new Error('No hay solicitudes de amistad pendientes entre estos usuarios');
    }

    // Actualizar el estado de la solicitud a 'aceptada'
    friendship.estado = 'aceptada';
    await friendship.save();

    return friendship;
  } catch (error) {
    throw new Error('Error al aceptar la solicitud de amistad: ' + error.message);
  }
};

// Rechazar solicitud de amistad
Amistad.rejectFriendRequest = async (id_usuario1, id_usuario2) => {
  try {
    const friendship = await Amistad.findOne({
      where: {
        [Sequelize.Op.or]: [
          { id_usuario1, id_usuario2, estado: 'pendiente' },
          { id_usuario1: id_usuario2, id_usuario2: id_usuario1, estado: 'pendiente' }
        ]
      }
    });

    if (!friendship) {
      throw new Error('No hay solicitudes de amistad pendientes entre estos usuarios');
    }

    // Eliminar la solicitud de amistad
    await friendship.destroy();
    return { message: 'Solicitud de amistad rechazada' };
  } catch (error) {
    throw new Error('Error al rechazar la solicitud de amistad: ' + error.message);
  }
};

// Eliminar una amistad
Amistad.deleteFriend = async (id_usuario1, id_usuario2) => {
  try {
    const friendship = await Amistad.findOne({
      where: {
        [Sequelize.Op.or]: [
          { id_usuario1, id_usuario2, estado: 'aceptada' },
          { id_usuario1: id_usuario2, id_usuario2: id_usuario1, estado: 'aceptada' }
        ]
      }
    });

    if (!friendship) {
      throw new Error('No hay amistad aceptada entre estos usuarios');
    }

    // Eliminar la amistad
    await friendship.destroy();
    return { message: 'Amistad eliminada' };
  } catch (error) {
    throw new Error('Error al eliminar la amistad: ' + error.message);
  }
};

// Ver solicitudes de amistad pendientes
Amistad.getPendingRequests = async (id_usuario) => {
  try {
    const pendingRequests = await Amistad.findAll({
      where: {
        [Sequelize.Op.or]: [
          { id_usuario2: id_usuario, estado: 'pendiente' },
        ]
      },
      include: {
        model: Usuario,
        as: 'Usuario1',
        attributes: ['id_usuario', 'nombre_usuario', 'nombre_completo'] // Eliminamos 'imagen_perfil_url'
      }
    });

    return pendingRequests.map(request => request.Usuario1);
  } catch (error) {
    throw new Error('Error al obtener solicitudes de amistad pendientes: ' + error.message);
  }
};


// Método para obtener el estado de la solicitud de amistad entre dos usuarios
Amistad.getFriendshipStatus = async (id_usuario1, id_usuario2) => {
  try {
      const amistad = await Amistad.findOne({
          where: {
              [Sequelize.Op.or]: [
                  { id_usuario1, id_usuario2 },
                  { id_usuario1: id_usuario2, id_usuario2: id_usuario1 },
              ]
          }
      });

      if (amistad) {
          return amistad.estado; // Devuelve el estado de la amistad
      } else {
          return 'sin_solicitud'; // Si no hay relación, devuelve 'sin_solicitud'
      }
  } catch (error) {
      console.error('Error al consultar el estado de la solicitud de amistad:', error);
      throw new Error('Error al consultar el estado de la solicitud de amistad');
  }
};


module.exports = Amistad;
