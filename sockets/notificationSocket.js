// sockets/notificationSocket.js
module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('typing', (data) => {
            const { conversationId, userId } = data;
            socket.to(conversationId).emit('user_typing', userId);
        });

        socket.on('stop_typing', (conversationId) => {
            socket.to(conversationId).emit('user_stopped_typing');
        });
    });
};
