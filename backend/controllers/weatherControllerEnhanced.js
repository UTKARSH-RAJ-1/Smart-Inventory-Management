const weatherService = require('../services/weatherService');
const Order = require('../models/Order');
const Alert = require('../models/Alert');

// Check weather delays for pending orders
exports.checkWeatherDelays = async (req, res) => {
    try {
        const alerts = [];
        const pendingOrders = await Order.findAll({
            where: {
                status: ['pending', 'in-transit']
            },
            include: ['Supplier']
        });

        for (const order of pendingOrders) {
            if (order.Supplier && order.Supplier.latitude && order.Supplier.longitude) {
                const weather = await weatherService.getFogForecast(
                    order.Supplier.latitude,
                    order.Supplier.longitude
                );

                if (weather.hasFog) {
                    const delayRisk = weatherService.calculateDelayRisk(weather);
                    
                    alerts.push({
                        orderId: order.id,
                        orderNumber: order.orderNumber,
                        supplier: order.Supplier.name,
                        location: order.Supplier.location,
                        alertType: 'weather_delay',
                        severity: delayRisk > 0.7 ? 'high' : 'medium',
                        message: `Weather hazard (Fog) detected at ${order.Supplier.name}. Estimated delay risk: ${(delayRisk * 100).toFixed(0)}%`,
                        weatherData: weather,
                        delayRiskPercentage: delayRisk * 100,
                        recommendedAction: delayRisk > 0.7 ? 'Consider alternative supplier or route' : 'Monitor weather updates'
                    });

                    // Create alert in database
                    await Alert.create({
                        alertType: 'weather_delay',
                        severity: delayRisk > 0.7 ? 'high' : 'medium',
                        title: `Weather Delay Risk: Order ${order.orderNumber}`,
                        description: `Fog detected at ${order.Supplier.name}. Delay risk: ${(delayRisk * 100).toFixed(0)}%`,
                        relatedItemId: order.id,
                        relatedItemType: 'order',
                        metadata: {
                            weatherData: weather,
                            delayRisk: delayRisk * 100
                        }
                    });

                    // Update order weather delay risk
                    order.weatherDelayRisk = delayRisk * 100;
                    await order.save();
                }
            }
        }

        res.json({
            alertCount: alerts.length,
            alerts,
            timestamp: new Date()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Predict delivery delays based on weather
exports.predictDeliveryDelay = async (req, res) => {
    try {
        const { supplierId, expectedDeliveryDate } = req.body;

        if (!supplierId || !expectedDeliveryDate) {
            return res.status(400).json({ error: 'Supplier ID and expected delivery date are required' });
        }

        const Supplier = require('../models/Supplier');
        const supplier = await Supplier.findByPk(supplierId);

        if (!supplier || !supplier.latitude || !supplier.longitude) {
            return res.status(400).json({ error: 'Supplier location data not available' });
        }

        const weather = await weatherService.getFogForecast(supplier.latitude, supplier.longitude);
        const delayRisk = weatherService.calculateDelayRisk(weather);

        const prediction = {
            supplier: supplier.name,
            originalDeliveryDate: expectedDeliveryDate,
            delayRiskPercentage: delayRisk * 100,
            estimatedDelay: delayRisk > 0.5 ? Math.ceil(delayRisk * 5) : 0, // Estimated days
            revisedDeliveryDate: new Date(new Date(expectedDeliveryDate).getTime() + (delayRisk * 5 * 24 * 60 * 60 * 1000)),
            weatherConditions: weather.conditions,
            recommendation: delayRisk > 0.7 ? 'HIGH RISK - Consider alternative' : delayRisk > 0.4 ? 'MEDIUM RISK - Monitor' : 'LOW RISK - Proceed',
            alternativeSuppliers: [] // Can be populated with alternative suppliers
        };

        res.json(prediction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all weather alerts
exports.getWeatherAlerts = async (req, res) => {
    try {
        const alerts = await Alert.findAll({
            where: { alertType: 'weather_delay', isResolved: false },
            order: [['createdAt', 'DESC']]
        });

        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get weather forecast for specific location
exports.getWeatherForecast = async (req, res) => {
    try {
        const { latitude, longitude, location } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const forecast = await weatherService.getFogForecast(parseFloat(latitude), parseFloat(longitude));

        res.json({
            location: location || `${latitude}, ${longitude}`,
            forecast,
            timestamp: new Date()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Resolve weather alert
exports.resolveWeatherAlert = async (req, res) => {
    try {
        const { id } = req.params;
        const { resolution } = req.body;

        const alert = await Alert.findByPk(id);
        if (!alert) return res.status(404).json({ error: 'Alert not found' });

        await alert.update({
            isResolved: true,
            resolvedAt: new Date(),
            metadata: {
                ...alert.metadata,
                resolution
            }
        });

        res.json({ message: 'Alert resolved successfully', alert });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get weather impact analysis
exports.getWeatherImpactAnalysis = async (req, res) => {
    try {
        const Order = require('../models/Order');
        const orders = await Order.findAll({
            where: {
                status: ['pending', 'in-transit']
            }
        });

        let affectedOrders = 0;
        let totalDelayRisk = 0;

        for (const order of orders) {
            if (order.weatherDelayRisk && order.weatherDelayRisk > 0) {
                affectedOrders++;
                totalDelayRisk += order.weatherDelayRisk;
            }
        }

        const analysis = {
            totalPendingOrders: orders.length,
            affectedOrders,
            averageDelayRisk: orders.length > 0 ? (totalDelayRisk / orders.length).toFixed(2) : 0,
            recommendation: affectedOrders > 2 ? 'CRITICAL: Multiple orders at risk' : 'NORMAL: Weather impact minimal'
        };

        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
