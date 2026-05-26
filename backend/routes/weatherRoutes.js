const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherControllerEnhanced');
const authMiddleware = require('../middleware/authMiddleware');

// Weather endpoints
router.get('/weather/alerts', weatherController.checkWeatherDelays);
router.post('/weather/predict-delay', weatherController.predictDeliveryDelay);
router.get('/weather/forecast', weatherController.getWeatherForecast);
router.get('/weather/all-alerts', weatherController.getWeatherAlerts);
router.put('/weather/alerts/:id/resolve', authMiddleware, weatherController.resolveWeatherAlert);
router.get('/weather/impact-analysis', weatherController.getWeatherImpactAnalysis);

module.exports = router;
