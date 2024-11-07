const userId = localStorage.getItem('userId'); // Verifica si el ID está almacenado

document.addEventListener('DOMContentLoaded', async () => {
    const searchButton = document.querySelector('.search-button');
    const searchInput = document.querySelector('.search-input');
    const resultsList = document.querySelector('.results-list');

    // Verifica si userId está presente
    if (!userId) {
        console.log("No se encontró el userId en localStorage.");
        return;
    }

    console.log("User ID encontrado:", userId); // Verificar el ID del usuario

    // Cargar amigos recientes y sugerencias al inicio
    await loadFriendSuggestions();

    // Función para buscar amigos
    searchButton.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        if (!query) return;

        try {
            const response = await fetch(`/api/user/search?query=${query}`);
            const friends = await response.json();
            console.log("Amigos encontrados:", friends); // Verificar la respuesta de la búsqueda
            displayResults(friends, resultsList);
        } catch (error) {
            console.error('Error al buscar amigos:', error);
        }
    });

    // Función para mostrar resultados de búsqueda
    function displayResults(friends, container) {
        container.innerHTML = ''; // Limpiar resultados anteriores
        if (friends.length === 0) {
            container.innerHTML = '<li>No se encontraron amigos.</li>';
        } else {
            friends.forEach(friend => {
                const listItem = document.createElement('li');
                listItem.innerHTML = ` 
                    ${friend.nombre_completo} (${friend.nombre_usuario}) 
                    <button class="add-button" data-id="${friend.id_usuario}">Agregar</button>
                `;
                container.appendChild(listItem);
            });

            // Agregar los event listeners para los botones de agregar
            document.querySelectorAll('.add-button').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const receiverId = e.target.getAttribute('data-id');
                    console.log("Enviando solicitud de amistad a:", receiverId); // Verificar el ID de destinatario
                    await sendFriendRequest(receiverId, e.target);
                });
            });

            // Verificar el estado de amistad para cada usuario y actualizar el botón
            checkFriendshipStatus();
        }
    }

    // Función para enviar solicitud de amistad
    async function sendFriendRequest(receiverId, button) {
        console.log("Enviando solicitud de amistad a:", receiverId); // Verificar ID del receptor
        console.log("User ID en la solicitud:", userId); // Verificar que el ID del usuario esté correcto

        try {
            const response = await fetch(`/api/user/${userId}/send-friend-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    receiverId: receiverId, // Enviar el ID del receptor en el cuerpo de la solicitud
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Cambiar el botón a "Pendiente" y desactivarlo
                button.innerText = 'Pendiente';
                button.disabled = true; // Desactivar el botón después de enviar la solicitud
                console.log("Solicitud enviada con éxito.");
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error al enviar solicitud de amistad:', error);
        }
    }

    // Cargar amigos recientes y sugerencias
    async function loadFriendSuggestions() {
        console.log("Cargando sugerencias de amigos...");
        try {
            const response = await fetch(`/api/user/friend-suggestions?userId=${userId}`);
            const { recentFriends, suggestions } = await response.json();
            console.log("Sugerencias de amigos:", suggestions); // Verificar las sugerencias
            displayFriends(recentFriends, '.recent-friends-list');
            displayFriends(suggestions, '.suggestions-list');
        } catch (error) {
            console.error('Error al cargar amigos recientes y sugerencias:', error);
        }
    }

    // Función para mostrar amigos y sugerencias
    function displayFriends(friends, selector) {
        const container = document.querySelector(selector);
        container.innerHTML = '';
        friends.forEach(friend => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                ${friend.nombre_completo} (${friend.nombre_usuario}) 
                <button class="add-button" data-id="${friend.id_usuario}">Agregar</button>
            `;
            container.appendChild(listItem);
        });

        // Agregar los event listeners para los botones de agregar
        document.querySelectorAll('.add-button').forEach(button => {
            button.addEventListener('click', async (e) => {
                const receiverId = e.target.getAttribute('data-id');
                console.log("Enviando solicitud de amistad a:", receiverId); // Verificar el ID de destinatario
                await sendFriendRequest(receiverId, e.target);
            });
        });

        // Verificar el estado de amistad para cada usuario y actualizar el botón
        checkFriendshipStatus();
    }

    // Función para verificar el estado de la amistad entre dos usuarios
    async function checkFriendshipStatus() {
        const buttons = document.querySelectorAll('.add-button');
        for (const button of buttons) {
            const receiverId = button.getAttribute('data-id');
            try {
                const response = await fetch(`/api/user/${userId}/friendship-status?receiverId=${receiverId}`);
                const data = await response.json();

                if (data.status === 'pendiente') {
                    button.innerText = 'Pendiente';
                    button.disabled = true;
                } else if (data.status === 'aceptada') {
                    button.innerText = 'Amigos';
                    button.disabled = true;
                } else if (data.status === 'sin_solicitud') {
                    button.innerText = 'Agregar';
                    button.disabled = false;
                } else if (data.status === 'rechazada') {
                    button.innerText = 'Rechazada';
                    button.disabled = true;
                }
            } catch (error) {
                console.error('Error al verificar el estado de la amistad:', error);
            }
        }
    }

    loadFriendSuggestions(); // Cargar sugerencias al inicio
});
