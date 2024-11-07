const userId = localStorage.getItem("userId"); // ID del usuario actual

// Función para manejar el inicio de sesión
async function handleLogin(event) {
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
            
            // Redirigir a home.html
            window.location.href = 'home.html';
        } else {
            // Mostrar el mensaje de error
            document.getElementById('error-message').innerText = data.error;
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        document.getElementById('error-message').innerText = 'Error en la conexión.';
    }
}

// Añadir el evento de escucha al formulario cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});
