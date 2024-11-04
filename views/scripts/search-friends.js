// scripts/search-friends.js
document.addEventListener('DOMContentLoaded', async () => {

    const searchButton = document.querySelector('.search-button');
    const searchInput = document.querySelector('.search-input');
    const resultsList = document.querySelector('.results-list');

    // Cargar amigos recientes y sugerencias al inicio
    await loadFriendSuggestions();

    // Función para buscar amigos
    searchButton.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        if (!query) return;

        try {
            const response = await fetch(`/api/user/search?query=${query}`);
            const friends = await response.json();
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
        }
    }

    // Cargar amigos recientes y sugerencias
    async function loadFriendSuggestions() {
        const userId = localStorage.getItem('userId');; // Cambia esto por el ID real del usuario
        try {
            const response = await fetch(`/api/user/friend-suggestions?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Error en la respuesta de la red');
            }
            const { recentFriends, suggestions } = await response.json();
            console.log("Amigos recientes:", recentFriends); // Verifica que se cargan los amigos recientes
            console.log("Sugerencias:", suggestions); // Verifica que se cargan las sugerencias
            displayFriends(recentFriends, '.recent-friends-list'); // Asegúrate de que este selector exista en tu HTML
            displayFriends(suggestions, '.suggestions-list'); // Asegúrate de que este selector exista en tu HTML
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
    }

    loadFriendSuggestions(); // Cargar sugerencias al inicio
});
