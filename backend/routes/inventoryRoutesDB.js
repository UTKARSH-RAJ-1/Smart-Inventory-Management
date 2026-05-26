const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventoryControllerDB');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes (no auth required for demo, but protect in production)
router.get('/expiry', controller.getExpiryData);
router.get('/raw-materials', controller.getInventory);
router.get('/raw-materials/:id', controller.getInventoryById);
router.get('/inventory-health', controller.getInventoryHealth);
router.get('/low-stock-alerts', controller.getLowStockAlerts);

// Protected routes (require authentication)
router.post('/inventory', authMiddleware, controller.createInventory);
router.put('/inventory/:id', authMiddleware, controller.updateInventory);
router.delete('/inventory/:id', authMiddleware, controller.deleteInventory);
router.post('/inventory/:id/consume', authMiddleware, controller.consumeInventory);

module.exports = router;
