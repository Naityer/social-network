const Publicacion = require('../models/publicacionModels');

module.exports = {
    async obtenerPublicaciones(req, res) {
        try {
            const publicaciones = await Publicacion.getAllPublicaciones();
            res.json(publicaciones);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener publicaciones' });
        }
    },
    async obtenerComentarios(req, res) {
        const { id_publicacion } = req.params;
        try {
            const comentarios = await Publicacion.getComentariosByPublicacion(id_publicacion);
            res.json(comentarios);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener comentarios' });
        }
    }
};
