const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('SOCIALITE', 'root', '12345678',
    {
        dialect: 'mysql',
        host: 'localhost',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        timezone: '+05:30', // for writing to database
    });

module.exports = sequelize;