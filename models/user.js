const sequelize = require('sequelize');

module.exports = sequelize.define(
    'user', {
        id: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: sequelize.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: sequelize.STRING,
            allowNull: false
        },
        password: {
            type: sequelize.STRING,
            allowNull: false
        }
    }
);