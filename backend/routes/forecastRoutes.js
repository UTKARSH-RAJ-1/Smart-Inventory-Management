const express = require('express');
const router = express.Router();
const controller = require('../controllers/demandForecastController');

// Demand forecast routes
router.get('/forecast', controller.getDemandForecast);
router.get('/forecasts', controller.getAllForecasts);
router.post('/forecasts/generate-all', controller.generateAllForecasts);
router.get('/analysis/demand', controller.getDemandAnalysis);
router.get('/analysis/seasonal', controller.getSeasonalAnalysis);
router.get('/recommendations/reorder', controller.getReorderRecommendations);
router.get('/analysis/demand-vs-supply', controller.compareDemandSupply);

module.exports = router;
