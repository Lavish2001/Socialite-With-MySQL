const { DataTypes } = require('sequelize');
const sequelize = require('../config');
const User = require('./user');

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    senderId: {
        type: DataTypes.BIGINT,
        references: {
            model: User,
            key: User.id
        },
        required: true
    },
    receiverId: {
        type: DataTypes.BIGINT,
        references: {
            model: User,
            key: User.id
        },
        required: true
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    },
    createdAt: {
        type: DataTypes.DATE
    },
    updatedAt: {
        type: DataTypes.DATE
    }
}, { tableName: 'Messages' });

module.exports = Message;