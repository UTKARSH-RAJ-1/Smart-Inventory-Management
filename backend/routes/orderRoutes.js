const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Order routes
router.post('/orders', authMiddleware, controller.createOrder);
router.get('/orders', controller.getOrders);
router.get('/orders/:id', controller.getOrderById);
router.put('/orders/:id/status', authMiddleware, controller.updateOrderStatus);
router.delete('/orders/:id', authMiddleware, controller.cancelOrder);
router.get('/orders/delayed', controller.getDelayedOrders);

// Supplier routes
router.post('/suppliers', authMiddleware, controller.createSupplier);
router.get('/suppliers', controller.getSuppliers);
router.get('/suppliers/:id', controller.getSupplierById);
router.put('/suppliers/:id', authMiddleware, controller.updateSupplier);
router.post('/suppliers/:id/order-inquiry', controller.placeOrderInquiry);
router.get('/marketplace/suppliers', controller.getSupplierMarketplace);

module.exports = router;
