const Order = require('../models/Order');
const Supplier = require('../models/Supplier');
const Alert = require('../models/Alert');
const { Op } = require('sequelize');

// Create new order
exports.createOrder = async (req, res) => {
    try {
        const { supplierId, materialType, quantity, unit, unitPrice, expectedDeliveryDate, notes } = req.body;

        if (!supplierId || !materialType || !quantity || !unit || !unitPrice || !expectedDeliveryDate) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const supplier = await Supplier.findByPk(supplierId);
        if (!supplier) return res.status(404).json({ error: 'Supplier not found' });

        const totalPrice = quantity * unitPrice;
        const orderNumber = `ORD-${Date.now()}`;

        const order = await Order.create({
            orderNumber,
            supplierId,
            materialType,
            quantity,
            unit,
            unitPrice,
            totalPrice,
            expectedDeliveryDate,
            notes,
            status: 'pending'
        });

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all orders with filters
exports.getOrders = async (req, res) => {
    try {
        const { status, supplierId, materialType } = req.query;
        let where = {};

        if (status) where.status = status;
        if (supplierId) where.supplierId = supplierId;
        if (materialType) where.materialType = materialType;

        const orders = await Order.findAll({
            where,
            include: [Supplier],
            order: [['createdAt', 'DESC']]
        });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByPk(id, { include: [Supplier] });

        if (!order) return res.status(404).json({ error: 'Order not found' });

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, actualDeliveryDate, notes } = req.body;

        if (!status) return res.status(400).json({ error: 'Status is required' });

        const order = await Order.findByPk(id);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        const oldStatus = order.status;
        await order.update({
            status,
            actualDeliveryDate: actualDeliveryDate || order.actualDeliveryDate,
            notes: notes || order.notes
        });

        // Check if order is delayed
        if (status === 'in-transit' || status === 'delayed') {
            const expectedDate = new Date(order.expectedDeliveryDate);
            const now = new Date();
            if (now > expectedDate && status === 'in-transit') {
                await Alert.create({
                    alertType: 'supplier_delay',
                    severity: 'high',
                    title: `Order Delay: ${order.orderNumber}`,
                    description: `Order ${order.orderNumber} is delayed. Expected: ${expectedDate.toLocaleDateString()}`,
                    relatedItemId: id,
                    relatedItemType: 'order'
                });
            }
        }

        res.json({ message: 'Order updated successfully', order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByPk(id);

        if (!order) return res.status(404).json({ error: 'Order not found' });

        if (order.status === 'delivered' || order.status === 'cancelled') {
            return res.status(400).json({ error: `Cannot cancel order with status: ${order.status}` });
        }

        await order.update({ status: 'cancelled' });

        res.json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get delayed orders
exports.getDelayedOrders = async (req, res) => {
    try {
        const now = new Date();
        const delayedOrders = await Order.findAll({
            where: {
                expectedDeliveryDate: { [Op.lt]: now },
                status: { [Op.notIn]: ['delivered', 'cancelled'] }
            },
            include: [Supplier]
        });

        const formattedOrders = delayedOrders.map(order => ({
            ...order.toJSON(),
            daysDelayed: Math.floor((now - new Date(order.expectedDeliveryDate)) / (1000 * 60 * 60 * 24))
        }));

        res.json(formattedOrders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create supplier
exports.createSupplier = async (req, res) => {
    try {
        const { name, contactPerson, email, phone, location, materialType, unitPrice, averageDeliveryDays } = req.body;

        if (!name || !contactPerson || !phone || !location || !materialType || !unitPrice) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const supplier = await Supplier.create({
            name,
            contactPerson,
            email,
            phone,
            location,
            materialType,
            unitPrice,
            averageDeliveryDays: averageDeliveryDays || 5,
            contractStatus: 'active'
        });

        res.status(201).json({ message: 'Supplier created successfully', supplier });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all suppliers
exports.getSuppliers = async (req, res) => {
    try {
        const { materialType, contractStatus } = req.query;
        let where = {};

        if (materialType) where.materialType = materialType;
        if (contractStatus) where.contractStatus = contractStatus;

        const suppliers = await Supplier.findAll({ where });

        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get supplier by ID
exports.getSupplierById = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await Supplier.findByPk(id);

        if (!supplier) return res.status(404).json({ error: 'Supplier not found' });

        res.json(supplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update supplier
exports.updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const supplier = await Supplier.findByPk(id);
        if (!supplier) return res.status(404).json({ error: 'Supplier not found' });

        await supplier.update(updates);

        res.json({ message: 'Supplier updated successfully', supplier });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Place order inquiry
exports.placeOrderInquiry = async (req, res) => {
    try {
        const { supplierId, materialType, quantity, unit } = req.body;

        const supplier = await Supplier.findByPk(supplierId);
        if (!supplier) return res.status(404).json({ error: 'Supplier not found' });

        // Check supplier availability
        if (supplier.currentInventory < quantity) {
            return res.status(400).json({
                available: false,
                message: `Supplier has insufficient inventory. Available: ${supplier.currentInventory} ${unit}`,
                availableQuantity: supplier.currentInventory
            });
        }

        // Calculate expected delivery and cost
        const expectedDeliveryDate = new Date();
        expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + supplier.averageDeliveryDays);

        const totalCost = quantity * supplier.unitPrice;

        const inquiry = {
            supplier: supplier.name,
            materialType,
            quantity,
            unit,
            unitPrice: supplier.unitPrice,
            totalCost,
            expectedDeliveryDate,
            available: true,
            reliabilityScore: supplier.reliabilityScore,
            rating: supplier.rating
        };

        res.json(inquiry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get supplier marketplace (all suppliers for comparison)
exports.getSupplierMarketplace = async (req, res) => {
    try {
        const { materialType } = req.query;
        let where = { contractStatus: 'active' };

        if (materialType) where.materialType = materialType;

        const suppliers = await Supplier.findAll({ where });

        // Format for marketplace display
        const marketplace = suppliers.map(supplier => ({
            id: supplier.id,
            name: supplier.name,
            materialType: supplier.materialType,
            unitPrice: supplier.unitPrice,
            availableInventory: supplier.currentInventory,
            averageDeliveryDays: supplier.averageDeliveryDays,
            rating: supplier.rating,
            reliabilityScore: supplier.reliabilityScore,
            location: supplier.location
        }));

        res.json(marketplace);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
