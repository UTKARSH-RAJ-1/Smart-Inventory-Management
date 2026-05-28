const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Define all models
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user'
    }
});

const Inventory = sequelize.define('Inventory', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    batchId: {
        type: DataTypes.STRING,
        unique: true
    },
    quantity: DataTypes.INTEGER,
    unit: DataTypes.STRING,
    expiryDate: DataTypes.DATE,
    type: {
        type: DataTypes.STRING,
        defaultValue: 'raw_material'
    },
    current_stock: DataTypes.INTEGER,
    max_stock: DataTypes.INTEGER,
    daily_consumption: DataTypes.INTEGER
});

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

const Order = sequelize.define('Order', {
    orderNumber: {
        type: DataTypes.STRING,
        unique: true
    },
    materialType: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    unit: DataTypes.STRING,
    unitPrice: DataTypes.FLOAT,
    totalPrice: DataTypes.FLOAT,
    expectedDeliveryDate: DataTypes.DATE,
    actualDeliveryDate: DataTypes.DATE,
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
    },
    paymentStatus: {
        type: DataTypes.STRING,
        defaultValue: 'unpaid'
    },
    weatherDelayRisk: DataTypes.FLOAT,
    notes: DataTypes.TEXT
});

const Alert = sequelize.define('Alert', {
    alertType: DataTypes.STRING,
    severity: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    relatedItemId: DataTypes.INTEGER,
    relatedItemType: DataTypes.STRING,
    metadata: DataTypes.JSON,
    isResolved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    resolvedAt: DataTypes.DATE
});

const Batch = sequelize.define('Batch', {
    batchId: {
        type: DataTypes.STRING,
        unique: true
    },
    quantity: DataTypes.INTEGER,
    unit: DataTypes.STRING,
    currentLocation: DataTypes.STRING,
    expiryDate: DataTypes.DATE,
    manufactureDateDate: DataTypes.DATE,
    receivedDate: DataTypes.DATE,
    status: DataTypes.STRING,
    qualityCheckPassed: DataTypes.BOOLEAN,
    traceabilityNotes: DataTypes.TEXT,
    trackingUrl: DataTypes.STRING
});

const DemandForecast = sequelize.define('DemandForecast', {
    materialType: DataTypes.STRING,
    forecastDate: DataTypes.DATE,
    predictedDemand: DataTypes.FLOAT,
    currentStock: DataTypes.FLOAT,
    recommendedOrderQuantity: DataTypes.FLOAT,
    recommendedOrderDate: DataTypes.DATE,
    demandTrend: DataTypes.STRING,
    seasonalFactor: DataTypes.FLOAT,
    confidence: DataTypes.FLOAT,
    historicalData: DataTypes.JSON
});

// Define associations/relationships
Order.belongsTo(Supplier, { foreignKey: 'supplierId' });
Supplier.hasMany(Order, { foreignKey: 'supplierId' });

Batch.belongsTo(Inventory, { foreignKey: 'inventoryId' });
Inventory.hasMany(Batch, { foreignKey: 'inventoryId' });

Batch.belongsTo(Supplier, { foreignKey: 'supplierId' });
Supplier.hasMany(Batch, { foreignKey: 'supplierId' });

Batch.belongsTo(Order, { foreignKey: 'orderId' });
Order.hasMany(Batch, { foreignKey: 'orderId' });

// Export all models
module.exports = {
    sequelize,
    User,
    Inventory,
    Supplier,
    Order,
    Alert,
    Batch,
    DemandForecast
};
