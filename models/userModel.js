// models/userModel.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db');

// Definición del modelo de Usuario
const Usuario = sequelize.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  nombre_completo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Usuario',
  timestamps: false, // Si no tienes createdAt y updatedAt en la tabla
});

// Crear un nuevo usuario
Usuario.createUser = async (nombreCompleto, nombreUsuario, email, contraseña) => {
  try {
    return await Usuario.create({
      nombre_usuario: nombreUsuario,
      nombre_completo: nombreCompleto,
      email,
      contraseña,
    });
  } catch (error) {
    throw error;
  }
};

// Buscar por nombre de usuario
Usuario.findByUsername = async (username) => {
  try {
    return await Usuario.findOne({
      where: { nombre_usuario: username }
    });
  } catch (error) {
    throw error;
  }
};

// Buscar por email
Usuario.findByEmail = async (email) => {
  try {
    return await Usuario.findOne({
      where: { email }
    });
  } catch (error) {
    throw error;
  }
};

// Crear un nuevo usuario
Usuario.createUser = async (nombreCompleto, nombreUsuario, email, contraseña) => {
  try {
    return await Usuario.create({
      nombre_usuario: nombreUsuario,
      nombre_completo: nombreCompleto,
      email,
      contraseña,
    });
  } catch (error) {
    throw error;
  }
};

// Actualizar usuario
Usuario.updateUser = async (id, nombreUsuario, email) => {
  try {
    const user = await Usuario.findByPk(id);
    if (!user) throw new Error('Usuario no encontrado');
    return await user.update({ nombre_usuario: nombreUsuario, email });
  } catch (error) {
    throw error;
  }
};

// Eliminar usuario
Usuario.deleteUser = async (id) => {
  try {
    const user = await Usuario.findByPk(id);
    if (!user) throw new Error('Usuario no encontrado');
    await user.destroy();
    return { message: 'Usuario eliminado' };
  } catch (error) {
    throw error;
  }
};

// Buscar amigos por nombre
Usuario.searchFriendsByName = async (name) => {
  try {
    return await Usuario.findAll({
      attributes: ['id_usuario', 'nombre_usuario', 'nombre_completo'],
      where: {
        [Sequelize.Op.or]: [
          { nombre_usuario: { [Sequelize.Op.like]: `%${name}%` } },
          { nombre_completo: { [Sequelize.Op.like]: `%${name}%` } },
        ],
      },
      limit: 10,
    });
  } catch (error) {
    throw error;
  }
};

module.exports = Usuario;
