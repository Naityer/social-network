// auth.js

// Función para manejar el login
async function loginUser(event) {
    event.preventDefault(); // Prevenir el envío del formulario
    
    const nombreUsuario = document.getElementById('nombreUsuario').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', { // Cambia la ruta según sea necesario
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombreUsuario, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Almacenar el token y el ID del usuario en el almacenamiento local
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            
            // Redirigir al perfil, home o a otra página según tu aplicación
            window.location.href = 'home.html';
        } else {
            // Mostrar el mensaje de error en la interfaz
            document.getElementById('error-message').innerText = data.error;
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        document.getElementById('error-message').innerText = 'Error en la conexión.';
    }
}

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
    const token = localStorage.getItem('token');
    return token !== null; // Retorna true si el token existe
}

// Función para redirigir al login si no está autenticado
function requireAuth(redirectUrl = 'login.html') {
    if (!isAuthenticated()) {
        window.location.href = redirectUrl;
    }
}

// Exportar las funciones para usarlas en diferentes archivos HTML
export { loginUser, isAuthenticated, requireAuth };
