const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Usuario = require('./userModel');
const Publicacion = require('./publicacionModels');

const Comentario = sequelize.define('Comentario', {
  id_comentario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_publicacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Publicacion,
      key: 'id_publicacion',
    },
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id_usuario',
    },
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fecha_comentario: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Comentario.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Comentario.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });

module.exports = Comentario;
