// controllers/authController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();


/*
==========================================================================================
REGISTRO DE USUARIOS
==========================================================================================

*/
exports.register = (req, res) => {
    const { nombreCompleto, nombreUsuario, email, password } = req.body;
    
    // Log para ver los datos recibidos
    console.log("Datos recibidos:", { nombreCompleto, nombreUsuario, email, password });

    // Verificación de datos requeridos
    if (!nombreCompleto || !nombreUsuario || !email || !password) {
        console.log("Faltan datos requeridos");
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Hashear la contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log("Contraseña hasheada:", hashedPassword);

    // Llamar al método del modelo para crear el usuario
    User.createUser(nombreCompleto, nombreUsuario, email, hashedPassword, (err, result) => {
        if (err) {
            console.error("Error al registrar usuario:", err);
            // Manejo del error por duplicado
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'El nombre de usuario o email ya están en uso.' });
            }
            return res.status(500).json({ error: 'Error al registrar usuario' });
        }
        // Respuesta exitosa
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    });
};

/*
==========================================================================================
INICIO DE SESION DE LOS USUARIOS
==========================================================================================

*/

exports.login = async (req, res) => {
    const { nombreUsuario, password } = req.body;

    // Verificación de datos requeridos
    if (!nombreUsuario || !password) {
        console.log("Faltan datos requeridos");
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
        // Buscar al usuario por nombre de usuario
        const user = await User.findByUsername(nombreUsuario);
        
        if (!user) {
            console.log("Usuario no encontrado");
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Comparar la contraseña ingresada con la contraseña hasheada
        const isMatch = bcrypt.compareSync(password, user.contraseña); // Aquí usamos bcrypt.compareSync
        if (!isMatch) {
            console.log("Contraseña incorrecta");
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Generar token JWT
        const token = jwt.sign({ id: user.id_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Aquí generamos el token
        
        console.log("Inicio de sesión exitoso, token generado");
        
        // Respuesta exitosa con el token y ID del usuario
        res.status(200).json({ message: 'Inicio de sesión exitoso', token, userId: user.id_usuario });

    } catch (error) {
        console.error("Error al intentar iniciar sesión:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

