const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        required: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    },
    gender: {
        type: DataTypes.ENUM('MALE', 'FEMALE', ""),
        defaultValue: "",
        allowNull: false
    },
    college: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false
    },
    school: {
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
}, { tableName: 'Users' });

module.exports = User;