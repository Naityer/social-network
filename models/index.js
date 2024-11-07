const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db'); // Conexión a la base de datos

// Importa los modelos
const Usuario = require('./userModel');
const Amistad = require('./amistadModel');
const Comentario = require('./comentarioModel');
const Publicacion = require('./publicacionModels');
const Like = require('./likesModel');
const Message = require('./messageModel');

// Definir las asociaciones entre modelos

// Un usuario puede tener muchas amistades
Usuario.hasMany(Amistad, { foreignKey: 'id_usuario1', as: 'AmigosUsuario1' });
Usuario.hasMany(Amistad, { foreignKey: 'id_usuario2', as: 'AmigosUsuario2' });

// La amistad pertenece a dos usuarios
Amistad.belongsTo(Usuario, { foreignKey: 'id_usuario1', as: 'Usuario1' });
Amistad.belongsTo(Usuario, { foreignKey: 'id_usuario2', as: 'Usuario2' });

// Un usuario puede hacer muchas publicaciones
Usuario.hasMany(Publicacion, { foreignKey: 'id_usuario' });

// Un usuario puede tener muchos comentarios en publicaciones
Comentario.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuarioComentario' });

// Exportar los modelos y la instancia de sequelize
module.exports = {
  sequelize,
  Usuario,
  Amistad,
  Comentario,
  Publicacion,
  Like,
  Message
};
