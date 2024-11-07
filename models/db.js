// models/db.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Configura Sequelize con tus credenciales de base de datos
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false, // Opcional: para deshabilitar el registro de SQL en la consola
});

// Verifica la conexión con la base de datos
sequelize.authenticate()
  .then(() => console.log('Conectado a la base de datos'))
  .catch(err => console.error('Error conectando a la base de datos:', err));

module.exports = sequelize;
