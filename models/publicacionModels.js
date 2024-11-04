// models/publicacionModel.js
const db = require('./db');

module.exports = {
    // Obtener todas las publicaciones con detalles del usuario
    async getAllPublicaciones() {
        try {
            const [rows] = await db.query(`
                SELECT Publicacion.*, Usuario.nombre_usuario, Usuario.nombre_completo, Usuario.imagen_perfil_url 
                FROM Publicacion
                JOIN Usuario ON Publicacion.id_usuario = Usuario.id_usuario
                ORDER BY fecha_publicacion DESC
            `);
            return rows;
        } catch (error) {
            console.error('Error al obtener todas las publicaciones:', error);
            throw error; // Propagar el error para manejarlo en el controlador
        }
    },

    // Obtener comentarios por ID de publicación
    async getComentariosByPublicacion(id_publicacion) {
        try {
            const [rows] = await db.query(`
                SELECT Comentario.*, Usuario.nombre_usuario, Usuario.imagen_perfil_url 
                FROM Comentario
                JOIN Usuario ON Comentario.id_usuario = Usuario.id_usuario
                WHERE id_publicacion = ?
                ORDER BY fecha_comentario ASC
            `, [id_publicacion]);
            return rows;
        } catch (error) {
            console.error('Error al obtener comentarios por publicación:', error);
            throw error; // Propagar el error para manejarlo en el controlador
        }
    },

    // Obtener publicación por ID
    async getPublicacionPorId(id_publicacion) {
        try {
            const [rows] = await db.query(`
                SELECT Publicacion.*, Usuario.nombre_usuario, Usuario.nombre_completo, Usuario.imagen_perfil_url 
                FROM Publicacion
                JOIN Usuario ON Publicacion.id_usuario = Usuario.id_usuario
                WHERE Publicacion.id_publicacion = ?
            `, [id_publicacion]);
            return rows.length ? rows[0] : null; // Devuelve null si no hay publicación
        } catch (error) {
            console.error('Error al obtener publicación por ID:', error);
            throw error; // Propagar el error para manejarlo en el controlador
        }
    },

    // Crear una nueva publicación
    async crearPublicacion(data) {
        try {
            const { titulo, contenido, id_usuario } = data;
            const [result] = await db.query(`
                INSERT INTO Publicacion (titulo, contenido, id_usuario, fecha_publicacion) 
                VALUES (?, ?, ?, NOW())
            `, [titulo, contenido, id_usuario]);
            return { id_publicacion: result.insertId, ...data }; // Devuelve la nueva publicación
        } catch (error) {
            console.error('Error al crear una nueva publicación:', error);
            throw error; // Propagar el error para manejarlo en el controlador
        }
    },

    // Actualizar una publicación
    async actualizarPublicacion(id_publicacion, data) {
        try {
            const { titulo, contenido } = data;
            const [result] = await db.query(`
                UPDATE Publicacion 
                SET titulo = ?, contenido = ? 
                WHERE id_publicacion = ?
            `, [titulo, contenido, id_publicacion]);
            return result.affectedRows > 0; // Retorna true si se actualizó
        } catch (error) {
            console.error('Error al actualizar publicación:', error);
            throw error; // Propagar el error para manejarlo en el controlador
        }
    },

    // Eliminar una publicación
    async eliminarPublicacion(id_publicacion) {
        try {
            const [result] = await db.query(`
                DELETE FROM Publicacion WHERE id_publicacion = ?
            `, [id_publicacion]);
            return result.affectedRows > 0; // Retorna true si se eliminó
        } catch (error) {
            console.error('Error al eliminar publicación:', error);
            throw error; // Propagar el error para manejarlo en el controlador
        }
    }
};
