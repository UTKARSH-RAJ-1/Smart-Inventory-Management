const { Supplier } = require('../models');

const getSuppliers = async (req, res) => {
    try {
        const material = req.query.material;
        console.log('Fetching suppliers for material:', material);
        
        if (!material) {
            return res.status(400).json({ error: 'Material parameter is required' });
        }

        // Query suppliers from database by material type
        const suppliers = await Supplier.findAll({
            where: { materialType: material }
        });

        console.log(`Found ${suppliers.length} suppliers for ${material}`);
        res.json(suppliers);
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).json({ error: 'Failed to fetch suppliers', details: error.message });
    }
};

module.exports = {
    getSuppliers
};
