// scripts/mensajes.js
const userId = localStorage.getItem("userId"); // ID del usuario actual
const socket = io(); // Inicializar Socket.io
let activeConversationId = null;

// Cargar conversaciones al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    loadConversations();
    loadFriends(); // Cargar lista de amigos
    initializeNavBar();
});

// Cargar lista de amigos
async function loadFriends() {
    try {
        // Verificar si el userId está disponible
        if (!userId) {
            console.error('No se encontró el ID de usuario.');
            return;
        }

        console.log('User ID desde mensajes.js:', userId);

        // Realizar la solicitud para obtener la lista de amigos
        const response = await fetch(`/api/user/${userId}/friends`);

        // Verificar si la respuesta fue exitosa (status 200-299)
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
        }

        // Obtener el cuerpo de la respuesta en formato JSON
        const responseBody = await response.json();
        console.log('Response Body:', responseBody);

        // Procesar los amigos devueltos por la API
        const friends = responseBody;

        // Limpiar la lista de amigos en la interfaz
        const friendListContainer = document.getElementById("friend-list");
        friendListContainer.innerHTML = "";

        // Verificar si se encontraron amigos
        if (friends.length === 0) {
            const noFriendsMessage = document.createElement("p");
            noFriendsMessage.textContent = "No tienes amigos.";
            friendListContainer.appendChild(noFriendsMessage);
            return;
        }

        // Agregar cada amigo a la lista
        friends.forEach(friend => {
            const friendItem = document.createElement("div");
            friendItem.classList.add("friend-item");
            friendItem.innerHTML = `
                <p><strong>${friend.nombre_completo} (${friend.nombre_usuario})</strong></p>
                <button onclick="startConversation(${friend.id_usuario}, '${friend.nombre_completo}')">Iniciar Conversación</button>
            `;
            friendListContainer.appendChild(friendItem);
        });
    } catch (error) {
        console.error("Error al cargar amigos:", error);
    }
}


// Iniciar una conversación con un amigo
async function startConversation(friendId, friendName) {
    try {
        const response = await fetch(`/api/conversations/start/${userId}/${friendId}`);
        const conversation = await response.json();

        // Si la conversación existe, solo la abrimos. Si no, la creamos.
        if (conversation) {
            activeConversationId = conversation.id;
            document.getElementById("chat-header").textContent = `Chat con ${friendName}`;
            await loadMessages(conversation.id);
            socket.emit("join_conversation", conversation.id);
        } else {
            alert("No se pudo iniciar la conversación");
        }
    } catch (error) {
        console.error("Error al iniciar conversación:", error);
    }
}


// Cargar lista de conversaciones (de amigos y grupos)
async function loadConversations() {
    try {
        // Obtener conversaciones de amigos
        const responseFriends = await fetch(`/api/conversations/friends/${userId}`);
        const conversationsFriends = await responseFriends.json();
        const conversationListFriends = document.getElementById("conversation-list-friends");
        conversationListFriends.innerHTML = "";

        conversationsFriends.forEach(conversation => {
            const conversationItem = document.createElement("div");
            conversationItem.classList.add("conversacion");
            conversationItem.innerHTML = `
                <p><strong>${conversation.name}</strong></p>
                <button onclick="openConversation(${conversation.id}, '${conversation.name}')">Abrir</button>
            `;
            conversationListFriends.appendChild(conversationItem);
        });

        // Obtener conversaciones de grupos
        const responseGroups = await fetch(`/api/conversations/groups/${userId}`);
        const conversationsGroups = await responseGroups.json();
        const conversationListGroups = document.getElementById("conversation-list-groups");
        conversationListGroups.innerHTML = "";

        conversationsGroups.forEach(conversation => {
            const conversationItem = document.createElement("div");
            conversationItem.classList.add("conversacion");
            conversationItem.innerHTML = `
                <p><strong>Grupo: ${conversation.name}</strong></p>
                <button onclick="openConversation(${conversation.id}, '${conversation.name}')">Abrir</button>
            `;
            conversationListGroups.appendChild(conversationItem);
        });
    } catch (error) {
        console.error("Error al cargar conversaciones:", error);
    }
}

// Abrir una conversación específica
async function openConversation(conversationId, conversationName) {
    activeConversationId = conversationId;
    document.getElementById("chat-header").textContent = `Chat con ${conversationName}`;
    await loadMessages(conversationId);
    socket.emit("join_conversation", conversationId);
}

// Cargar mensajes de la conversación seleccionada
async function loadMessages(conversationId) {
    try {
        const response = await fetch(`/api/messages/${conversationId}`);
        const messages = await response.json();
        const messageWindow = document.getElementById("message-window");
        messageWindow.innerHTML = "";

        messages.forEach(message => {
            const messageItem = document.createElement("p");
            messageItem.classList.add(message.senderId === userId ? "sent-message" : "received-message");
            messageItem.innerHTML = `<strong>${message.senderId === userId ? "Tú" : message.senderId}:</strong> ${message.content}`;
            messageWindow.appendChild(messageItem);
        });
        messageWindow.scrollTop = messageWindow.scrollHeight; // Auto-scroll al final
    } catch (error) {
        console.error("Error al cargar mensajes:", error);
    }
}


// Enviar un mensaje
async function sendMessage(event) {
    event.preventDefault();
    const messageInput = document.getElementById("message-input");
    const content = messageInput.value.trim();

    if (!content || !activeConversationId) return;

    const messageData = {
        content,
        conversationId: activeConversationId,
        senderId: userId
    };

    // Emitir mensaje por Socket.io
    socket.emit("send_message", messageData);
    messageInput.value = "";
}

// Recibir mensajes en tiempo real
socket.on("receive_message", (message) => {
    if (message.conversationId === activeConversationId) {
        const messageItem = document.createElement("p");
        messageItem.classList.add(message.senderId === userId ? "sent-message" : "received-message");
        messageItem.innerHTML = `<strong>${message.senderId === userId ? "Tú" : message.senderId}:</strong> ${message.content}`;
        document.getElementById("message-window").appendChild(messageItem);
        document.getElementById("message-window").scrollTop = document.getElementById("message-window").scrollHeight;
    }
});


// Recibir mensajes en tiempo real
socket.on("receive_message", (message) => {
    if (message.conversationId === activeConversationId) {
        const messageItem = document.createElement("p");
        messageItem.classList.add(message.senderId === userId ? "sent-message" : "received-message");
        messageItem.innerHTML = `<strong>${message.senderId === userId ? "Tú" : message.senderId}:</strong> ${message.content}`;
        document.getElementById("message-window").appendChild(messageItem);
        document.getElementById("message-window").scrollTop = document.getElementById("message-window").scrollHeight;
    }
});

// Inicializar la barra de navegación
function initializeNavBar() {
    const buttons = document.querySelectorAll(".nav-button");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const targetUrl = button.getAttribute("data-href");
            window.location.href = targetUrl;
        });
    });
}
