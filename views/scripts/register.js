document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevenir el envío del formulario
    
    const nombreCompleto = document.getElementById('nombreCompleto').value;
    const nombreUsuario = document.getElementById('nombreUsuario').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/register', { // Cambia la ruta según sea necesario
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombreCompleto, nombreUsuario, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Registro exitoso, redirigir a la página de inicio de sesión
            window.location.href = 'login.html';
        } else {
            // Mostrar el mensaje de error
            document.getElementById('error-message').innerText = data.error;
        }
    } catch (error) {
        console.error("Error al registrar:", error);
        document.getElementById('error-message').innerText = 'Error en la conexión.';
    }
});
