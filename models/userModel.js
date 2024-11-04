// models/userModel.js
const db = require('./db');

/*
=====================================================================
    BUSCADORES DE USUARIO REGISTER - LOGIN
======================================================================
*/

// por nombre de usuario
exports.findByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM usuario WHERE nombre_usuario = ?', [username], (err, results) => {
      if (err) return reject(err);
      resolve(results.length ? results[0] : null); // Devuelve el primer resultado o null si no existe
    });
  });
};

// por email
exports.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM usuario WHERE email = ?', [email], (err, results) => {
      if (err) return reject(err);
      resolve(results.length ? results[0] : null); // Devuelve el primer resultado o null si no existe
    });
  });
};


/*
========================================================================================
    MODIFICADORES DE TABLA USUARIO
========================================================================================
*/

// Insertar 
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

// Actualizar 
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

// Eliminar 
exports.deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM Usuario WHERE id_usuario = ?', [id], (err, result) => {
      if (err) return reject(err);
      if (result.affectedRows === 0) resolve({ message: 'Usuario no encontrado' });
      resolve({ message: 'Usuario eliminado', changes: result.affectedRows });
    });
  });
};


// Obtener lista de amigos de un usuario
exports.getFriends = (id_usuario) => {
  return new Promise((resolve, reject) => {
    db.query(`
      SELECT Usuario.id_usuario, Usuario.nombre_usuario, Usuario.nombre_completo, Usuario.imagen_perfil_url
      FROM Amistad
      JOIN Usuario ON (Amistad.id_usuario2 = Usuario.id_usuario AND Amistad.id_usuario1 = ?)
      WHERE Amistad.estado = 'aceptada'
    `, [id_usuario], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

/*
========================================================================================
    BUSCADOR DE USUARIOS - PAGE = search-friend.html
========================================================================================
*/

// Buscar amigos por nombre
exports.searchFriendsByName = (name) => {
  return new Promise((resolve, reject) => {
      db.query(`
          SELECT id_usuario, nombre_usuario, nombre_completo 
          FROM Usuario 
          WHERE nombre_usuario LIKE CONCAT('%', ?, '%') 
          OR nombre_completo LIKE CONCAT('%', ?, '%') 
          LIMIT 10
      `, [name, name], (err, results) => {
          if (err) return reject(err);
          resolve(results);
      });
  });
};

// Obtener los primeros 5 amigos seguidos recientemente
exports.getRecentFriends = (userId, limit = 5) => {
  return new Promise((resolve, reject) => {
      db.query(`
          SELECT u.id_usuario, u.nombre_usuario, u.nombre_completo, cp.imagen_perfil_url
          FROM Amistad a
          JOIN Usuario u ON u.id_usuario = a.id_usuario2
          LEFT JOIN ConfiguracionPerfil cp ON u.id_usuario = cp.id_usuario
          WHERE a.id_usuario1 = ? AND a.estado = 'aceptada'
          ORDER BY a.fecha_solicitud DESC
          LIMIT ?
      `, [userId, limit], (err, results) => {
          if (err) return reject(err);
          resolve(results);
      });
  });
};

// Obtener 10 sugerencias de usuarios
exports.getSuggestions = (userId, limit = 10) => {
  return new Promise((resolve, reject) => {
      db.query(`
          SELECT u.id_usuario, u.nombre_usuario, u.nombre_completo, cp.imagen_perfil_url 
          FROM Usuario u 
          LEFT JOIN Amistad a ON (a.id_usuario2 = u.id_usuario AND a.id_usuario1 = ?) 
          LEFT JOIN ConfiguracionPerfil cp ON u.id_usuario = cp.id_usuario
          WHERE a.estado IS NULL OR a.id_usuario1 IS NULL AND u.id_usuario <> ?
          LIMIT ?
      `, [userId, userId, limit], (err, results) => {
          if (err) return reject(err);
          resolve(results);
      });
  });
};

/*
========================================================================================
    BUSCADOR DE USUARIOS - PAGE = search-friend.html
========================================================================================
*/

// Obtener publicaciones de un usuario específico
exports.getUserPosts = (id_usuario) => {
  return new Promise((resolve, reject) => {
    db.query(`
      SELECT * FROM Publicacion WHERE id_usuario = ? ORDER BY fecha_publicacion DESC
    `, [id_usuario], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Obtener amigos en común entre dos usuarios
exports.getMutualFriends = (id_usuario1, id_usuario2) => {
  return new Promise((resolve, reject) => {
    db.query(`
      SELECT Usuario.id_usuario, Usuario.nombre_usuario, Usuario.nombre_completo, Usuario.imagen_perfil_url
      FROM Amistad AS A1
      JOIN Amistad AS A2 ON A1.id_usuario2 = A2.id_usuario2
      JOIN Usuario ON Usuario.id_usuario = A1.id_usuario2
      WHERE A1.id_usuario1 = ? AND A2.id_usuario1 = ? AND A1.estado = 'aceptada' AND A2.estado = 'aceptada'
    `, [id_usuario1, id_usuario2], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Obtener perfil de usuario con estadísticas (cantidad de amigos y publicaciones)
exports.getUserProfileWithStats = (id_usuario) => {
  return new Promise((resolve, reject) => {
    db.query(`
      SELECT 
        Usuario.id_usuario,
        Usuario.nombre_usuario,
        Usuario.nombre_completo,
        Usuario.email,
        Usuario.imagen_perfil_url,
        (SELECT COUNT(*) FROM Amistad WHERE id_usuario1 = ? AND estado = 'aceptada') AS cantidad_amigos,
        (SELECT COUNT(*) FROM Publicacion WHERE id_usuario = ?) AS cantidad_publicaciones
      FROM Usuario
      WHERE id_usuario = ?
    `, [id_usuario, id_usuario, id_usuario], (err, results) => {
      if (err) return reject(err);
      resolve(results.length ? results[0] : null);
    });
  });
};



