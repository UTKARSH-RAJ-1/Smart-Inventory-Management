const Inventory = require('../models/Inventory');
const Batch = require('../models/Batch');
const Alert = require('../models/Alert');
const { Op } = require('sequelize');

// Create new inventory item
exports.createInventory = async (req, res) => {
    try {
        const { name, batchId, quantity, unit, expiryDate, type, current_stock, max_stock, daily_consumption } = req.body;

        if (!name || !batchId || !quantity || !unit || !expiryDate) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const inventory = await Inventory.create({
            name,
            batchId,
            quantity,
            unit,
            expiryDate,
            type: type || 'raw_material',
            current_stock: current_stock || quantity,
            max_stock: max_stock || quantity * 2,
            daily_consumption: daily_consumption || 0
        });

        res.status(201).json({ message: 'Inventory created successfully', inventory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all inventory with filters
exports.getInventory = async (req, res) => {
    try {
        const { type, status, search } = req.query;
        let where = {};

        if (type) where.type = type;
        if (search) where.name = { [Op.like]: `%${search}%` };

        const inventory = await Inventory.findAll({ where });

        // Add health status to each item
        const inventoryWithStatus = inventory.map(item => {
            const daysUntilExpiry = Math.floor((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
            let expiryStatus = 'fresh';
            if (daysUntilExpiry <= 0) expiryStatus = 'expired';
            else if (daysUntilExpiry <= 7) expiryStatus = 'expiring_soon';
            else if (daysUntilExpiry <= 30) expiryStatus = 'warning';

            let stockStatus = 'normal';
            if (item.current_stock <= (item.max_stock * 0.2)) stockStatus = 'critical';
            else if (item.current_stock <= (item.max_stock * 0.5)) stockStatus = 'low';

            return {
                ...item.toJSON(),
                daysUntilExpiry,
                expiryStatus,
                stockStatus
            };
        });

        res.json(inventoryWithStatus);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get inventory by ID
exports.getInventoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const inventory = await Inventory.findByPk(id, { include: [Batch] });

        if (!inventory) return res.status(404).json({ error: 'Inventory not found' });

        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update inventory item
exports.updateInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const inventory = await Inventory.findByPk(id);
        if (!inventory) return res.status(404).json({ error: 'Inventory not found' });

        await inventory.update(updates);

        res.json({ message: 'Inventory updated successfully', inventory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete inventory item
exports.deleteInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const inventory = await Inventory.findByPk(id);

        if (!inventory) return res.status(404).json({ error: 'Inventory not found' });

        await inventory.destroy();

        res.json({ message: 'Inventory deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get expiry data (items expiring soon)
exports.getExpiryData = async (req, res) => {
    try {
        const now = new Date();
        const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        const expiringItems = await Inventory.findAll({
            where: {
                expiryDate: {
                    [Op.between]: [now, thirtyDaysLater]
                }
            },
            order: [['expiryDate', 'ASC']]
        });

        const categorized = {
            expired: expiringItems.filter(i => new Date(i.expiryDate) < now),
            expiring_soon: expiringItems.filter(i => {
                const days = Math.floor((new Date(i.expiryDate) - now) / (1000 * 60 * 60 * 24));
                return days > 0 && days <= 7;
            }),
            warning: expiringItems.filter(i => {
                const days = Math.floor((new Date(i.expiryDate) - now) / (1000 * 60 * 60 * 24));
                return days > 7 && days <= 30;
            })
        };

        res.json(categorized);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get low stock alerts
exports.getLowStockAlerts = async (req, res) => {
    try {
        const lowStockItems = await Inventory.findAll({
            where: {
                current_stock: {
                    [Op.lte]: sequelize.where(
                        sequelize.col('max_stock'),
                        Op.mul,
                        0.2
                    )
                }
            }
        });

        const alerts = lowStockItems.map(item => ({
            id: item.id,
            name: item.name,
            currentStock: item.current_stock,
            maxStock: item.max_stock,
            recommendedOrderQty: Math.ceil(item.max_stock - item.current_stock),
            urgency: item.current_stock === 0 ? 'critical' : item.current_stock <= item.max_stock * 0.1 ? 'high' : 'medium'
        }));

        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Calculate inventory health metrics
exports.getInventoryHealth = async (req, res) => {
    try {
        const now = new Date();
        const allItems = await Inventory.findAll();

        const metrics = {
            total_items: allItems.length,
            expired_count: 0,
            expiring_soon_count: 0,
            low_stock_count: 0,
            overstocked_count: 0,
            health_percentage: 0
        };

        allItems.forEach(item => {
            const daysUntilExpiry = Math.floor((new Date(item.expiryDate) - now) / (1000 * 60 * 60 * 24));
            if (daysUntilExpiry <= 0) metrics.expired_count++;
            else if (daysUntilExpiry <= 7) metrics.expiring_soon_count++;

            if (item.current_stock <= item.max_stock * 0.2) metrics.low_stock_count++;
            if (item.current_stock >= item.max_stock * 0.9) metrics.overstocked_count++;
        });

        // Calculate overall health percentage
        const unhealthyItems = metrics.expired_count + metrics.expiring_soon_count + metrics.low_stock_count;
        metrics.health_percentage = Math.round(((allItems.length - unhealthyItems) / allItems.length) * 100) || 0;

        res.json(metrics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Consume inventory (decrease current stock)
exports.consumeInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ error: 'Invalid quantity' });
        }

        const inventory = await Inventory.findByPk(id);
        if (!inventory) return res.status(404).json({ error: 'Inventory not found' });

        if (inventory.current_stock < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }

        inventory.current_stock -= quantity;
        await inventory.save();

        // Check if low stock alert needed
        if (inventory.current_stock <= inventory.max_stock * 0.2) {
            await Alert.create({
                alertType: 'low_stock',
                severity: inventory.current_stock === 0 ? 'critical' : 'high',
                title: `Low Stock Alert: ${inventory.name}`,
                description: `${inventory.name} stock is now at ${inventory.current_stock} ${inventory.unit}`,
                relatedItemId: id,
                relatedItemType: 'inventory'
            });
        }

        res.json({ message: 'Inventory consumed successfully', inventory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
