const sequelize = require('../models/db');  // Asegúrate de que esta ruta sea correcta
const Usuario = require('../models/userModel');  // Renombré esto según la estructura que mencionaste
const Publicacion = require('../models/publicacionModels');
const Comentario = require('../models/comentarioModel');
const LikePublicacion = require('../models/likesModel');
const Amistad = require('../models/amistadModel');
const Conversacion = require('../models/conversationModel');
const MensajeConversacion = require('../models/messageModel');

// Definir las relaciones entre los modelos
Usuario.hasMany(Publicacion, { foreignKey: 'id_usuario' });  // Un usuario tiene muchas publicaciones
Publicacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });  // Una publicación pertenece a un usuario

Usuario.hasMany(Comentario, { foreignKey: 'id_usuario' });  // Un usuario tiene muchos comentarios
Comentario.belongsTo(Usuario, { foreignKey: 'id_usuario' });  // Un comentario pertenece a un usuario

Publicacion.hasMany(Comentario, { foreignKey: 'id_publicacion' });  // Una publicación tiene muchos comentarios
Comentario.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });  // Un comentario pertenece a una publicación

Usuario.belongsToMany(Usuario, { 
  through: Amistad, 
  as: 'Amigos', 
  foreignKey: 'id_usuario', 
  otherKey: 'id_amigo'
});  // Relación de amistad entre usuarios (muchos a muchos)
Usuario.belongsToMany(Usuario, { 
  through: Amistad, 
  as: 'AmigosDe', 
  foreignKey: 'id_amigo', 
  otherKey: 'id_usuario'
});

Usuario.hasMany(LikePublicacion, { foreignKey: 'id_usuario' });  // Un usuario tiene muchos likes en publicaciones
LikePublicacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });  // Un like pertenece a un usuario

Publicacion.hasMany(LikePublicacion, { foreignKey: 'id_publicacion' });  // Una publicación tiene muchos likes
LikePublicacion.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });  // Un like pertenece a una publicación

Usuario.hasMany(Conversacion, { foreignKey: 'id_usuario' });  // Un usuario tiene muchas conversaciones
Conversacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });  // Una conversación pertenece a un usuario

Conversacion.hasMany(MensajeConversacion, { foreignKey: 'id_conversacion' });  // Una conversación tiene muchos mensajes
MensajeConversacion.belongsTo(Conversacion, { foreignKey: 'id_conversacion' });  // Un mensaje pertenece a una conversación

// Sincronización de los modelos, eliminando las tablas primero si es necesario
sequelize.sync({ force: true, alter: false }).then(() => {
  console.log('Base de datos sincronizada');
}).catch((error) => {
  console.error('Error al sincronizar la base de datos:', error);
});