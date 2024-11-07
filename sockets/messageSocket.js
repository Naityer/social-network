// sockets/messageSocket.js
module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Usuario conectado:', socket.id);

        // Escucha de nuevos mensajes
        socket.on('send_message', (data) => {
            const { conversationId, content, senderId } = data;

            // Reenvía el mensaje a los participantes en la conversación
            io.to(conversationId).emit('receive_message', data);
        });

        // Unirse a una conversación específica
        socket.on('join_conversation', (conversationId) => {
            socket.join(conversationId);
            console.log(`Usuario unido a la conversación: ${conversationId}`);
        });

        socket.on('disconnect', () => {
            console.log('Usuario desconectado:', socket.id);
        });
    });
};
