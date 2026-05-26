const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../database.sqlite'),
    logging: false,
});

// Export sequelize instance
module.exports = sequelize;

