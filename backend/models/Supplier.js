const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Supplier = sequelize.define('Supplier', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    contactPerson: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        validate: { isEmail: true }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    materialType: {
        type: DataTypes.STRING, // 'wheat', 'potato', 'maize'
        allowNull: false
    },
    currentInventory: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    unitPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    averageDeliveryDays: {
        type: DataTypes.INTEGER,
        defaultValue: 5
    },
    contractStatus: {
        type: DataTypes.STRING, // 'active', 'inactive', 'suspended'
        defaultValue: 'active'
    },
    securityDeposit: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 5.0,
        validate: { min: 0, max: 5 }
    },
    lastDeliveryDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    reliabilityScore: {
        type: DataTypes.FLOAT,
        defaultValue: 100,
        validate: { min: 0, max: 100 }
    }
});

module.exports = Supplier;
