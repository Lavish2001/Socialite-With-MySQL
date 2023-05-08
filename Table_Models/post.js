const { DataTypes } = require('sequelize');
const sequelize = require('../config');
const User = require('./user');

const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    ownerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        required: true,
        references: {
            model: User,
            key: User.id
        }
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE
    },
    updatedAt: {
        type: DataTypes.DATE
    }
}, { tableName: 'Posts' });

module.exports = Post;