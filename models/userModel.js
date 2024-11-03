// models/userModel.js
const db = require('./db');

// Buscar usuario por nombre de usuario
exports.findByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM usuario WHERE nombre_usuario = ?', [username], (err, results) => {
      if (err) return reject(err);
      resolve(results.length ? results[0] : null); // Devuelve el primer resultado o null si no existe
    });
  });
};

// Insertar usuario
exports.createUser = (nombreCompleto, nombreUsuario, email, contraseña) => {
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO Usuario (nombre_usuario, nombre_completo, email, contraseña) VALUES (?, ?, ?, ?)',
      [nombreUsuario, nombreCompleto, email, contraseña],
      (err, result) => {
        if (err) return reject(err);
        resolve({ id: result.insertId, nombreUsuario, nombreCompleto, email });
      }
    );
  });
};

// Actualizar usuario
exports.updateUser = (id, nombreUsuario, email) => {
  return new Promise((resolve, reject) => {
    db.query(
      'UPDATE Usuario SET nombre_usuario = ?, email = ? WHERE id_usuario = ?',
      [nombreUsuario, email, id],
      (err, result) => {
        if (err) return reject(err);
        if (result.affectedRows === 0) resolve({ message: 'Usuario no encontrado o sin cambios' });
        resolve({ message: 'Usuario actualizado', changes: result.affectedRows });
      }
    );
  });
};

// Eliminar usuario
exports.deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM Usuario WHERE id_usuario = ?', [id], (err, result) => {
      if (err) return reject(err);
      if (result.affectedRows === 0) resolve({ message: 'Usuario no encontrado' });
      resolve({ message: 'Usuario eliminado', changes: result.affectedRows });
    });
  });
};
