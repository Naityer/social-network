const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Usuario = require('./userModel');

const Publicacion = sequelize.define('Publicacion', {
  id_publicacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  },
  imagen_url: {
    type: DataTypes.STRING(255),
  },
  fecha_publicacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Obtener publicaciones de un usuario específico
Usuario.getUserPosts = async (id_usuario) => {
  try {
    return await sequelize.query(`
      SELECT * FROM Publicacion WHERE id_usuario = ? ORDER BY fecha_publicacion DESC
    `, {
      replacements: [id_usuario],
      type: Sequelize.QueryTypes.SELECT
    });
  } catch (error) {
    throw error;
  }
};

Publicacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });

module.exports = Publicacion;
