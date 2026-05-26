const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Batch = sequelize.define('Batch', {
    batchId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    inventoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Inventories',
            key: 'id'
        }
    },
    supplierId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Suppliers',
            key: 'id'
        }
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Orders',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    currentLocation: {
        type: DataTypes.STRING, // 'warehouse', 'transit', 'supplier'
        defaultValue: 'warehouse'
    },
    expiryDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    manufactureDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    receivedDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING, // 'pending', 'in-transit', 'received', 'damaged', 'expired'
        defaultValue: 'pending'
    },
    qualityCheckPassed: {
        type: DataTypes.BOOLEAN,
        defaultValue: null
    },
    traceabilityNotes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    trackingUrl: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Batch;
