async function loginUser() {
    const nombreUsuario = document.getElementById('nombreUsuario').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombreUsuario, password }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'Error al iniciar sesión');
        }

        const { token, userId, userInfo } = await response.json();

        // Aquí guardas el token y el userId en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);

        // Opcional: Redirigir al usuario a otra página
        window.location.href = '/dashboard'; // Cambia esto a la ruta deseada

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert(error.message); // Muestra el mensaje de error al usuario
    }
}

// Asumiendo que tienes un botón para iniciar sesión
document.getElementById('loginButton').addEventListener('click', loginUser);
