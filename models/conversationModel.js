const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Conversacion = sequelize.define('Conversacion', {
  id_conversacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
  },
  tipo: {
    type: DataTypes.ENUM('amigo', 'grupo'),
    allowNull: false,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Conversacion;
