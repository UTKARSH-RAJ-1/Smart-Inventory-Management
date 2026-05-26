const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alert = sequelize.define('Alert', {
    alertType: {
        type: DataTypes.STRING, // 'weather_delay', 'low_stock', 'expiry_warning', 'supplier_delay'
        allowNull: false
    },
    severity: {
        type: DataTypes.STRING, // 'low', 'medium', 'high', 'critical'
        defaultValue: 'medium'
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    relatedItemId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    relatedItemType: {
        type: DataTypes.STRING, // 'inventory', 'order', 'supplier'
        allowNull: true
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true
    },
    isResolved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Alert;
