const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Usuario = require('./userModel');
const Conversacion = require('./conversationModel');

const MensajeConversacion = sequelize.define('MensajeConversacion', {
  id_mensaje: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_conversacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Conversacion,
      key: 'id_conversacion',
    },
  },
  id_remitente: {
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
  fecha_envio: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

MensajeConversacion.belongsTo(Conversacion, { foreignKey: 'id_conversacion' });
MensajeConversacion.belongsTo(Usuario, { foreignKey: 'id_remitente' });

module.exports = MensajeConversacion;
