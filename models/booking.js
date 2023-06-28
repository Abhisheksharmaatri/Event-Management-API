const sequelize = require('sequelize');

module.exports = sequelize.define('booking', {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    event_id: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    date: {
        type: sequelize.DATE,
        allowNull: false
    },
    payment_status: {
        type: sequelize.BOOLEAN,
        allowNull: false
    }
});