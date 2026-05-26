const { sequelize, User, Inventory, Supplier, Order, Alert, Batch, DemandForecast } = require('../models/index');
const bcrypt = require('bcrypt');
const data = require('../config/data');

async function seedDatabase() {
    try {
        // Sync Database
        await sequelize.sync({ alter: true });
        console.log('✅ Database synced!');

        // --- 1. CREATE ADMIN USER ---
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            username: 'admin',
            password: hashedPassword,
            role: 'admin'
        });
        console.log('✅ Admin user created (admin / admin123)');

        // --- 2. SEED INVENTORY ---
        console.log('📦 Seeding inventory data...');
        const inventoryItems = [];
        
        // Add raw materials
        for (const material of data.rawMaterialData) {
            const inv = await Inventory.create({
                name: material.name,
                batchId: `RAW-${material.name}-001`,
                quantity: material.current_stock,
                unit: material.unit,
                expiryDate: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000), // 90 days
                type: 'raw_material',
                current_stock: material.current_stock,
                max_stock: material.max_stock,
                daily_consumption: material.daily_consumption
            });
            inventoryItems.push(inv);
        }

        // Add finished goods
        for (const item of data.expiryData) {
            const inv = await Inventory.create({
                name: item.name,
                batchId: item.batchId,
                quantity: item.quantity,
                unit: item.unit,
                expiryDate: item.expiryDate,
                type: 'finished_good',
                current_stock: item.quantity,
                max_stock: item.quantity * 2,
                daily_consumption: 0
            });
            inventoryItems.push(inv);
        }

        console.log(`✅ Created ${inventoryItems.length} inventory items`);

        // --- 3. SEED SUPPLIERS ---
        console.log('🤝 Seeding supplier data...');
        const suppliers = [
            {
                name: 'Kanpur Wheat Co-op',
                contactPerson: 'Rajesh Kumar',
                email: 'contact@kanpurwheat.com',
                phone: '+91-9876543210',
                location: 'Kanpur, Uttar Pradesh',
                latitude: 26.4499,
                longitude: 80.3319,
                materialType: 'wheat',
                currentInventory: 5000,
                unitPrice: 25,
                averageDeliveryDays: 5,
                rating: 4.5,
                reliabilityScore: 95
            },
            {
                name: 'Punjab Golden Fields',
                contactPerson: 'Harjeet Singh',
                email: 'info@punjabfields.com',
                phone: '+91-9876543211',
                location: 'Ludhiana, Punjab',
                latitude: 30.9010,
                longitude: 75.8573,
                materialType: 'wheat',
                currentInventory: 8000,
                unitPrice: 23,
                averageDeliveryDays: 4,
                rating: 4.8,
                reliabilityScore: 98
            },
            {
                name: 'Agra Potato Growers',
                contactPerson: 'Vikram Singh',
                email: 'sales@agrapotatogrowers.com',
                phone: '+91-9876543212',
                location: 'Agra, Uttar Pradesh',
                latitude: 27.1767,
                longitude: 78.0081,
                materialType: 'potato',
                currentInventory: 12000,
                unitPrice: 15,
                averageDeliveryDays: 3,
                rating: 4.3,
                reliabilityScore: 92
            },
            {
                name: 'Madhya Pradesh Maize Hub',
                contactPerson: 'Rohan Patel',
                email: 'contact@mpmaizehub.com',
                phone: '+91-9876543213',
                location: 'Indore, Madhya Pradesh',
                latitude: 22.7196,
                longitude: 75.8577,
                materialType: 'maize',
                currentInventory: 7000,
                unitPrice: 18,
                averageDeliveryDays: 5,
                rating: 4.2,
                reliabilityScore: 90
            }
        ];

        const supplierObjects = await Supplier.bulkCreate(suppliers);
        console.log(`✅ Created ${supplierObjects.length} suppliers`);

        // --- 4. SEED ORDERS ---
        console.log('📋 Seeding order data...');
        const orders = [
            {
                orderNumber: 'ORD-001-2025',
                supplierId: supplierObjects[0].id,
                materialType: 'wheat',
                quantity: 2000,
                unit: 'kg',
                unitPrice: 25,
                totalPrice: 50000,
                expectedDeliveryDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
                status: 'pending'
            },
            {
                orderNumber: 'ORD-002-2025',
                supplierId: supplierObjects[2].id,
                materialType: 'potato',
                quantity: 3000,
                unit: 'kg',
                unitPrice: 15,
                totalPrice: 45000,
                expectedDeliveryDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
                status: 'in-transit'
            }
        ];

        const orderObjects = await Order.bulkCreate(orders);
        console.log(`✅ Created ${orderObjects.length} orders`);

        // --- 5. SEED BATCHES ---
        console.log('📦 Seeding batch data...');
        const batches = [];
        
        for (let i = 0; i < inventoryItems.slice(0, 5).length; i++) {
            const batch = await Batch.create({
                batchId: `BATCH-${Date.now()}-${i}`,
                inventoryId: inventoryItems[i].id,
                supplierId: supplierObjects[i % supplierObjects.length].id,
                orderId: i < orderObjects.length ? orderObjects[i].id : null,
                quantity: inventoryItems[i].current_stock,
                unit: inventoryItems[i].unit,
                currentLocation: 'warehouse',
                expiryDate: inventoryItems[i].expiryDate,
                manufactureDateDate: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000),
                receivedDate: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000),
                status: 'received',
                qualityCheckPassed: true,
                traceabilityNotes: 'All quality checks passed. Ready for use.'
            });
            batches.push(batch);
        }

        console.log(`✅ Created ${batches.length} batches`);

        // --- 6. SEED ALERTS ---
        console.log('⚠️ Seeding alert data...');
        const alerts = [
            {
                alertType: 'expiry_warning',
                severity: 'medium',
                title: 'Expiry Warning: Finished Product Batch',
                description: 'One batch of finished goods is expiring in 7 days',
                isResolved: false
            },
            {
                alertType: 'low_stock',
                severity: 'high',
                title: 'Low Stock Alert: Wheat',
                description: 'Wheat inventory is below 20% of maximum level',
                relatedItemType: 'inventory',
                isResolved: false
            }
        ];

        const alertObjects = await Alert.bulkCreate(alerts);
        console.log(`✅ Created ${alertObjects.length} alerts`);

        // --- 7. SEED DEMAND FORECASTS ---
        console.log('📊 Seeding demand forecast data...');
        const forecasts = [
            {
                materialType: 'wheat',
                forecastDate: new Date(),
                predictedDemand: 2500,
                currentStock: 4000,
                recommendedOrderQuantity: 1000,
                recommendedOrderDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
                demandTrend: 'increasing',
                seasonalFactor: 1.2,
                confidence: 85
            },
            {
                materialType: 'potato',
                forecastDate: new Date(),
                predictedDemand: 3200,
                currentStock: 5500,
                recommendedOrderQuantity: 500,
                recommendedOrderDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
                demandTrend: 'stable',
                seasonalFactor: 1.0,
                confidence: 90
            },
            {
                materialType: 'maize',
                forecastDate: new Date(),
                predictedDemand: 1800,
                currentStock: 3200,
                recommendedOrderQuantity: 800,
                recommendedOrderDate: new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000),
                demandTrend: 'decreasing',
                seasonalFactor: 0.95,
                confidence: 75
            }
        ];

        const forecastObjects = await DemandForecast.bulkCreate(forecasts);
        console.log(`✅ Created ${forecastObjects.length} demand forecasts`);

        console.log('\n🎉 ===== DATABASE SEEDING COMPLETE =====');
        console.log('📊 Summary:');
        console.log(`   - Users: 1`);
        console.log(`   - Inventory Items: ${inventoryItems.length}`);
        console.log(`   - Suppliers: ${supplierObjects.length}`);
        console.log(`   - Orders: ${orderObjects.length}`);
        console.log(`   - Batches: ${batches.length}`);
        console.log(`   - Alerts: ${alertObjects.length}`);
        console.log(`   - Forecasts: ${forecastObjects.length}`);
        console.log('\n👤 Demo Credentials: admin / admin123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
}

seedDatabase();
