const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Usuario = require('./userModel');
const Publicacion = require('./publicacionModels');

const LikePublicacion = sequelize.define('LikePublicacion', {
  id_like: {
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
  fecha_like: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  uniqueKeys: {
    unique_like: {
      fields: ['id_publicacion', 'id_usuario']
    }
  }
});

LikePublicacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });
LikePublicacion.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });

module.exports = LikePublicacion;
