const Inventory = require('../models/Inventory');
const Order = require('../models/Order');
const DemandForecast = require('../models/DemandForecast');
const { Op } = require('sequelize');

// Analyze historical demand patterns
const analyzeHistoricalDemand = async (materialType, monthsBack = 6) => {
    try {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - monthsBack);

        const orders = await Order.findAll({
            where: {
                materialType,
                createdAt: { [Op.gte]: startDate },
                status: 'delivered'
            },
            order: [['createdAt', 'ASC']]
        });

        if (orders.length === 0) {
            return {
                materialType,
                averageDemand: 0,
                trend: 'insufficient_data',
                variance: 0,
                historicalData: []
            };
        }

        // Group by week
        const weeklyDemand = {};
        orders.forEach(order => {
            const week = Math.floor(order.createdAt / (7 * 24 * 60 * 60 * 1000));
            weeklyDemand[week] = (weeklyDemand[week] || 0) + order.quantity;
        });

        const demandValues = Object.values(weeklyDemand);
        const averageDemand = demandValues.reduce((a, b) => a + b, 0) / demandValues.length;
        
        // Calculate variance and trend
        const variance = demandValues.reduce((sum, val) => sum + Math.pow(val - averageDemand, 2), 0) / demandValues.length;
        
        // Determine trend (increasing, decreasing, or stable)
        const firstHalf = demandValues.slice(0, Math.floor(demandValues.length / 2));
        const secondHalf = demandValues.slice(Math.floor(demandValues.length / 2));
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
        
        let trend = 'stable';
        if (secondAvg > firstAvg * 1.1) trend = 'increasing';
        else if (secondAvg < firstAvg * 0.9) trend = 'decreasing';

        return {
            materialType,
            averageDemand,
            trend,
            variance,
            standardDeviation: Math.sqrt(variance),
            historicalData: demandValues,
            weekCount: demandValues.length
        };
    } catch (error) {
        console.error('Error analyzing demand:', error.message);
        return {
            materialType,
            error: error.message,
            averageDemand: 0,
            trend: 'error'
        };
    }
};

// Generate demand forecast for next period
const generateDemandForecast = async (materialType, daysAhead = 30) => {
    try {
        const analysis = await analyzeHistoricalDemand(materialType);
        
        if (analysis.trend === 'error' || analysis.trend === 'insufficient_data') {
            return {
                materialType,
                error: 'Insufficient historical data',
                predictedDemand: 0
            };
        }

        // Get current stock
        const inventory = await Inventory.findOne({
            where: { name: materialType }
        });

        const currentStock = inventory ? inventory.current_stock : 0;
        const maxStock = inventory ? inventory.max_stock : 0;
        const dailyConsumption = inventory ? inventory.daily_consumption : analysis.averageDemand / 30;

        // Calculate predicted demand
        let predictedDemand = analysis.averageDemand;
        
        // Apply trend adjustment
        if (analysis.trend === 'increasing') {
            predictedDemand *= 1.15; // 15% increase
        } else if (analysis.trend === 'decreasing') {
            predictedDemand *= 0.85; // 15% decrease
        }

        // Apply seasonal factor (example: higher demand in certain seasons)
        const month = new Date().getMonth();
        const seasonalFactor = getSeasonalFactor(materialType, month);
        predictedDemand *= seasonalFactor;

        // Calculate how many days inventory will last
        const daysInventoryWillLast = dailyConsumption > 0 
            ? Math.floor(currentStock / dailyConsumption) 
            : 365;

        // Determine if reorder is needed
        const needsReorder = daysInventoryWillLast < (daysAhead * 1.5);
        
        // Calculate recommended order quantity
        const recommendedOrderQty = needsReorder 
            ? Math.ceil((maxStock - currentStock) * 1.2) 
            : 0;

        // Calculate recommended order date
        const recommendedOrderDate = new Date();
        recommendedOrderDate.setDate(recommendedOrderDate.getDate() + Math.max(1, daysInventoryWillLast - 7));

        return {
            materialType,
            forecastDate: new Date(),
            predictedDemand: Math.ceil(predictedDemand),
            currentStock,
            maxStock,
            daysInventoryWillLast,
            needsReorder,
            recommendedOrderQuantity: recommendedOrderQty,
            recommendedOrderDate,
            demandTrend: analysis.trend,
            seasonalFactor,
            confidence: calculateConfidence(analysis),
            analysis
        };
    } catch (error) {
        console.error('Error generating forecast:', error.message);
        return {
            materialType,
            error: error.message
        };
    }
};

// Get seasonal factor (adjust demand based on season)
const getSeasonalFactor = (materialType, month) => {
    // Example seasonal factors (these can be adjusted based on real data)
    const seasonalFactors = {
        wheat: [1.2, 1.2, 1.1, 0.9, 0.8, 0.9, 1.0, 1.0, 1.1, 1.2, 1.3, 1.4],
        potato: [1.0, 0.95, 0.9, 1.0, 1.1, 1.2, 1.3, 1.2, 1.0, 0.9, 1.0, 1.1],
        maize: [0.9, 0.85, 0.95, 1.0, 1.1, 1.2, 1.3, 1.2, 1.0, 0.95, 0.9, 1.0]
    };

    const factors = seasonalFactors[materialType] || [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    return factors[month] || 1.0;
};

// Calculate forecast confidence
const calculateConfidence = (analysis) => {
    let confidence = 80; // Base confidence

    // Reduce confidence if high variance
    if (analysis.variance > analysis.averageDemand * 0.5) {
        confidence -= 15;
    }

    // Reduce confidence if insufficient data
    if (analysis.weekCount < 8) {
        confidence -= 20;
    }

    return Math.max(40, Math.min(confidence, 95));
};

// Get all active forecasts
const getActiveForecastsDB = async () => {
    try {
        const forecasts = await DemandForecast.findAll({
            where: {
                forecastDate: {
                    [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                }
            },
            order: [['createdAt', 'DESC']]
        });

        return forecasts;
    } catch (error) {
        console.error('Error fetching forecasts:', error.message);
        return [];
    }
};

// Save forecast to database
const saveForecast = async (forecast) => {
    try {
        const saved = await DemandForecast.create({
            materialType: forecast.materialType,
            forecastDate: forecast.forecastDate || new Date(),
            predictedDemand: forecast.predictedDemand,
            currentStock: forecast.currentStock,
            recommendedOrderQuantity: forecast.recommendedOrderQuantity,
            recommendedOrderDate: forecast.recommendedOrderDate,
            demandTrend: forecast.demandTrend,
            seasonalFactor: forecast.seasonalFactor,
            confidence: forecast.confidence,
            historicalData: forecast.analysis?.historicalData || null
        });

        return saved;
    } catch (error) {
        console.error('Error saving forecast:', error.message);
        return null;
    }
};

module.exports = {
    analyzeHistoricalDemand,
    generateDemandForecast,
    getSeasonalFactor,
    calculateConfidence,
    getActiveForecastsDB,
    saveForecast
};
