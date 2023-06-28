const sequelize = require('sequelize');

module.exports = sequelize.define('organizer', {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    email: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: sequelize.STRING,
        allowNull: false
    },
    password: {
        type: sequelize.STRING,
        allowNull: false
    },
    description: {
        type: sequelize.STRING,
        allowNull: false
    },
    address: {
        type: sequelize.STRING,
        allowNull: false
    }
});