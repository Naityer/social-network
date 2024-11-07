// controllers/conversationController.js
const Conversation = require('../models/conversationModel');
const User = require('../models/userModel');

exports.createConversation = async (req, res) => {
    try {
        const { userIds, isGroup, name } = req.body;

        const conversation = await Conversation.create({ isGroup, name });
        await conversation.addUsers(userIds); // Asocia usuarios a la conversación

        res.status(201).json(conversation);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la conversación' });
    }
};

exports.getUserConversations = async (req, res) => {
    try {
        const { userId } = req.params;
        const conversations = await Conversation.findAll({
            include: {
                model: User,
                where: { id: userId },
                attributes: ['id', 'name']
            }
        });
        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener conversaciones del usuario' });
    }
};
``
