const demandService = require('../services/demandForecastService');
const DemandForecast = require('../models/DemandForecast');

// Get demand forecast for a material
exports.getDemandForecast = async (req, res) => {
    try {
        const { materialType } = req.query;

        if (!materialType) {
            return res.status(400).json({ error: 'Material type is required' });
        }

        const forecast = await demandService.generateDemandForecast(materialType);
        res.json(forecast);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all demand forecasts
exports.getAllForecasts = async (req, res) => {
    try {
        const forecasts = await demandService.getActiveForecastsDB();
        res.json(forecasts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Generate forecast for all materials
exports.generateAllForecasts = async (req, res) => {
    try {
        const materials = ['wheat', 'potato', 'maize'];
        const forecasts = [];

        for (const material of materials) {
            const forecast = await demandService.generateDemandForecast(material);
            if (!forecast.error) {
                const saved = await demandService.saveForecast(forecast);
                forecasts.push(saved || forecast);
            }
        }

        res.json({
            message: `Generated ${forecasts.length} forecasts`,
            forecasts
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get demand analysis/trends
exports.getDemandAnalysis = async (req, res) => {
    try {
        const { materialType, monthsBack } = req.query;

        if (!materialType) {
            return res.status(400).json({ error: 'Material type is required' });
        }

        const analysis = await demandService.analyzeHistoricalDemand(
            materialType,
            monthsBack ? parseInt(monthsBack) : 6
        );

        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get seasonal factor for a material
exports.getSeasonalAnalysis = async (req, res) => {
    try {
        const { materialType } = req.query;

        if (!materialType) {
            return res.status(400).json({ error: 'Material type is required' });
        }

        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const factors = months.map((month, index) => ({
            month,
            seasonalFactor: demandService.getSeasonalFactor(materialType, index)
        }));

        res.json({
            materialType,
            seasonalFactors: factors
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get reorder recommendations
exports.getReorderRecommendations = async (req, res) => {
    try {
        const materials = ['wheat', 'potato', 'maize'];
        const recommendations = [];

        for (const material of materials) {
            const forecast = await demandService.generateDemandForecast(material);
            if (forecast.needsReorder && !forecast.error) {
                recommendations.push({
                    materialType: material,
                    currentStock: forecast.currentStock,
                    recommendedOrderQuantity: forecast.recommendedOrderQuantity,
                    recommendedOrderDate: forecast.recommendedOrderDate,
                    urgency: forecast.daysInventoryWillLast < 3 ? 'critical' : 'high',
                    predictedDemand: forecast.predictedDemand
                });
            }
        }

        res.json({
            needsReorders: recommendations.length > 0,
            recommendations
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Compare demand vs supply
exports.compareDemandSupply = async (req, res) => {
    try {
        const Inventory = require('../models/Inventory');
        const materials = ['wheat', 'potato', 'maize'];
        const comparison = [];

        for (const material of materials) {
            const forecast = await demandService.generateDemandForecast(material);
            const inventory = await Inventory.findOne({
                where: { name: material }
            });

            comparison.push({
                materialType: material,
                predictedDemand: forecast.predictedDemand,
                currentStock: forecast.currentStock,
                maxStock: forecast.maxStock,
                gap: forecast.predictedDemand - forecast.currentStock,
                sufficiency: forecast.currentStock >= forecast.predictedDemand ? 'sufficient' : 'insufficient',
                action: forecast.needsReorder ? 'order_needed' : 'no_action'
            });
        }

        res.json(comparison);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
