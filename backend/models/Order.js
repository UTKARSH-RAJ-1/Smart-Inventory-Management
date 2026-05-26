const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    orderNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    supplierId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Suppliers',
            key: 'id'
        }
    },
    materialType: {
        type: DataTypes.STRING,
        allowNull: false // 'wheat', 'potato', 'maize'
    },
    quantity: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    unitPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    orderDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    expectedDeliveryDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    actualDeliveryDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending' // pending, confirmed, in-transit, delivered, delayed, cancelled
    },
    paymentStatus: {
        type: DataTypes.STRING,
        defaultValue: 'pending' // pending, partial, completed
    },
    weatherDelayRisk: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Order;
