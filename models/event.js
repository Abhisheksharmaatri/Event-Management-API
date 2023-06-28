const sequelize = require('sequelize');

module.exports = sequelize.define('event', {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: sequelize.STRING,
        allowNull: false
    },
    description: {
        type: sequelize.STRING,
        allowNull: false
    },
    date: {
        type: sequelize.DATE,
        allowNull: false
    },
    venue: {
        type: sequelize.STRING,
        allowNull: false
    },
    organizer_id: {
        type: sequelize.INTEGER,
        allowNull: false
    }
});