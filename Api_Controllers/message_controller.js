const Message = require('../Table_Models/messages');
const { QueryTypes } = require('sequelize');
const sequelize = require('../config');


// Send Messages

exports.startMessage = async (req, res) => {
    try {
        const { receiverId } = req.query;
        if (!req.body.text) {
            return res.status(400).json({
                'status': 'failed',
                'message': 'message cannot be empty'
            })
        };
        if (!receiverId) {
            return res.status(200).json({
                'status': 'failed',
                'message': 'select user for start a chat'
            })
        }
        if (receiverId && req.body.text) {
            if (req.user.id == receiverId) {
                return res.status(400).json({
                    'status': 'failed',
                    'message': 'You cant message yourself'
                })
            } else {
                const message = await Message.create({
                    senderId: req.user.id,
                    receiverId: receiverId,
                    text: req.body.text,
                    senderstatus: true
                });
                if (message) {
                    return res.status(200).json({
                        'status': 'success',
                        'message': 'message sent successfully'
                    })
                }
            }
        } else {
            return res.status(400).json('require all fields')
        }
    } catch (err) {
        return res.status(500).json({
            'status': 'failed',
            'message': err.message
        })
    }
};



// Get User Chats and Last Message

exports.getChats = async (req, res) => {
    try {
        const chats = await sequelize.query(`SELECT (SELECT userName FROM Users WHERE id IN(SELECT IF(senderId!=:id,senderId,receiverId)))AS Name,
        (SELECT id FROM Users WHERE id IN(SELECT IF(senderId!=:id,senderId,receiverId)))AS id,(SELECT text FROM Messages 
            WHERE ((senderId=:id OR receiverId=:id) AND id=MAX(M.id)))AS Last_Message
        FROM Messages M WHERE senderId=:id OR receiverId=:id GROUP BY GREATEST(senderId,receiverId),LEAST(senderId,receiverId)`, {
            type: QueryTypes.SELECT,
            replacements: { id: req.user.id }
        });
        if (chats) {
            return res.status(200).json(chats)
        }
    } catch (err) {
        return res.status(500).json({
            'status': 'failed',
            'message': err.message
        })
    }
};



// Read Chat Messages

exports.readMessages = async (req, res) => {
    try {
        const messages = await sequelize.query(`select* from Messages where ((senderId=:id AND receiverId=:id2) OR (senderId=:id2 AND receiverId=:id))
         order by createdAt`, {
            type: QueryTypes.SELECT,
            replacements: { id: req.user.id, id2: req.query.id }
        });
        if (messages.length) {
            return res.status(200).json(messages)
        } else {
            return res.status(400).json({
                'status': 'failed',
                'messsage': 'start a chat first'
            })
        }
    } catch (err) {
        return res.status(500).json({
            'status': 'failed',
            'message': err.message
        })
    }
};