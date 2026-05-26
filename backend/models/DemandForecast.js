const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DemandForecast = sequelize.define('DemandForecast', {
    materialType: {
        type: DataTypes.STRING,
        allowNull: false // 'wheat', 'potato', 'maize'
    },
    forecastDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    predictedDemand: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    currentStock: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    recommendedOrderQuantity: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    recommendedOrderDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    demandTrend: {
        type: DataTypes.STRING, // 'increasing', 'decreasing', 'stable'
        defaultValue: 'stable'
    },
    seasonalFactor: {
        type: DataTypes.FLOAT,
        defaultValue: 1.0
    },
    confidence: {
        type: DataTypes.FLOAT, // 0-100
        defaultValue: 80
    },
    historicalData: {
        type: DataTypes.JSON,
        allowNull: true
    }
});

module.exports = DemandForecast;
