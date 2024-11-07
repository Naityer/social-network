// controllers/messageController.js
const Message = require('../models/messageModel');
const Conversation = require('../models/conversationModel');

exports.sendMessage = async (req, res) => {
    try {
        const { content, conversationId, senderId, messageType } = req.body;

        const message = await Message.create({
            content,
            senderId,
            conversationId,
            messageType
        });

        res.status(201).json({ message });
    } catch (error) {
        res.status(500).json({ error: 'Error al enviar el mensaje' });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message.findAll({ where: { conversationId } });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los mensajes' });
    }
};
