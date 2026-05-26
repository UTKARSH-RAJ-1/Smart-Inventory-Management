const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models/index');

const app = express();
const PORT = 3000;

// Import Routes
const inventoryRoutes = require('./routes/inventoryRoutes');
const inventoryRoutesDB = require('./routes/inventoryRoutesDB');
const supplierRoutes = require('./routes/supplierRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const forecastRoutes = require('./routes/forecastRoutes');

// --- 1. MIDDLEWARE SETUP ---
app.use(cors()); // Allow requests from other origins
app.use(express.json()); // Parse JSON bodies

// Serve static frontend files from the root directory safely
app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../style.css'));
});
app.use('/js', express.static(path.join(__dirname, '../js')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// --- 2. API ROUTES ---
console.log('Mounting Inventory Routes...');
app.use('/api', inventoryRoutes); // Original routes with static data
app.use('/api', inventoryRoutesDB); // Database routes

console.log('Mounting Order & Supplier Routes...');
app.use('/api', orderRoutes);
app.use('/api', supplierRoutes); // Keep original as fallback

console.log('Mounting Auth Routes...');
app.use('/api', authRoutes);

console.log('Mounting Weather Routes...');
app.use('/api', weatherRoutes);

console.log('Mounting Forecast Routes...');
app.use('/api', forecastRoutes);

console.log('All routes mounted.');

// --- 3. DATABASE & START SERVER ---
// Sync database (creates tables if they don't exist)
sequelize.sync({ force: false }).then(() => {
    console.log('✅ Database connected & synced');
    app.listen(PORT, () => {
        console.log(`✅ Inventory Server is running!`);
        console.log(`👉 Open your browser to: http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('❌ Database connection error:', err);
});
