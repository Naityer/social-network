// views/profile

const userId = localStorage.getItem("userId");

// Función para obtener el perfil del usuario y las notificaciones
async function fetchUserData(userId) {
    console.log("Fetching user data for userId:", userId);

    // Función para obtener el perfil del usuario y las notificaciones
    async function fetchUserData(userId) {
        console.log("Fetching user data for userId:", userId);
        try {
            // Obtener el perfil de usuario
            const userResponse = await fetch(`/api/user/profile/${userId}`);
            const userData = await userResponse.json();
            document.getElementById('username').textContent = userData.nombre_usuario;
            document.getElementById('email').textContent = userData.email;
            document.getElementById('fullname').textContent = userData.nombre_completo;
    
            // Obtener las solicitudes de amistad pendientes
            const notificationsResponse = await fetch(`/api/user/${userId}/friend-requests`);
            const notificationsData = await notificationsResponse.json();
    
            const notificationsList = document.getElementById('notifications-list');
            notificationsList.innerHTML = ''; // Limpiar la lista
    
            if (notificationsData.length > 0) {
                notificationsData.forEach(notification => {
                    const li = document.createElement('li');
                    li.textContent = `Solicitud de amistad de ${notification.nombre_usuario}`;
    
                    // Botón para aceptar solicitud
                    const acceptButton = document.createElement('button');
                    acceptButton.textContent = "Aceptar";
                    acceptButton.onclick = () => handleFriendRequest(notification.id_usuario1, notification.id_usuario2, 'accept');
    
                    // Botón para rechazar solicitud
                    const rejectButton = document.createElement('button');
                    rejectButton.textContent = "Rechazar";
                    rejectButton.onclick = () => handleFriendRequest(notification.id_usuario1, notification.id_usuario2, 'reject');
    
                    // Añadir botones al li
                    li.appendChild(acceptButton);
                    li.appendChild(rejectButton);
    
                    notificationsList.appendChild(li);
                });
            } else {
                notificationsList.innerHTML = '<li>No tienes solicitudes de amistad</li>';
            }
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    }
    
    // Función para manejar las solicitudes de amistad (aceptar/rechazar)
    async function handleFriendRequest(id_usuario1, id_usuario2, action) {
        const userId = localStorage.getItem("userId");
        try {
            let response;
            if (action === 'accept') {
                response = await fetch(`/api/user/${userId}/accept-friend-request`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id_usuario2: id_usuario2 })
                });
            } else if (action === 'reject') {
                response = await fetch(`/api/user/${userId}/reject-friend-request`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id_usuario2: id_usuario2 })
                });
            }
    
            if (response.ok) {
                console.log(`Solicitud de amistad ${action}da correctamente.`);
                fetchUserData(userId); // Vuelve a cargar las solicitudes de amistad
            } else {
                console.error("Error al manejar la solicitud de amistad.");
            }
        } catch (error) {
            console.error("Error al procesar la solicitud de amistad:", error);
        }
    }
    
    fetchUserData(userId);
    
    try {
        // Obtener el perfil de usuario
        const userResponse = await fetch(`/api/user/profile/${userId}`);  
        const userData = await userResponse.json();
        document.getElementById('username').textContent = userData.nombre_usuario;
        document.getElementById('email').textContent = userData.email;
        document.getElementById('fullname').textContent = userData.nombre_completo;

        // Obtener las notificaciones de solicitudes de amistad
        const notificationsResponse = await fetch(`/api/user/profile/${userId}/notifications`);  // Cambié '/user' por '/api/user'
        const notificationsData = await notificationsResponse.json();

        const notificationsList = document.getElementById('notifications-list');
        notificationsList.innerHTML = ''; // Limpiar la lista

        if (notificationsData.length > 0) {
            notificationsData.forEach(notification => {
                const li = document.createElement('li');
                li.textContent = `Solicitud de amistad de ${notification.nombre_usuario}`;
                notificationsList.appendChild(li);
            });
        } else {
            notificationsList.innerHTML = '<li>No tienes solicitudes de amistad</li>';
        }

    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

fetchUserData(userId);
