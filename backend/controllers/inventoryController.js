const data = require('../config/data');

const getExpiryData = (req, res) => {
    res.json(data.expiryData);
};

const getRawMaterials = (req, res) => {
    res.json(data.rawMaterialData);
};

const getRawMaterialBatches = (req, res) => {
    res.json(data.rawMaterialBatches);
};

const getTraceability = (req, res) => {
    const material = req.query.material;
    if (material === 'wheat') {
        res.json(data.wheatBatches);
    } else if (material === 'potato') {
        res.json(data.potatoBatches);
    } else if (material === 'maize') {
        res.json(data.maizeBatches);
    } else {
        res.status(400).json({ error: 'Invalid material parameter' });
    }
};

const getBatchDetails = (req, res) => {
    const { id } = req.params;
    const batch = data.allTraceabilityBatches.find((b) => b.batchId === id);

    if (batch) {
        res.json(batch);
    } else {
        res.status(404).json({ error: 'Batch not found' });
    }
};

const getAlerts = (req, res) => {
    try {
        const alerts = data.generateInventoryAlerts();
        res.json({
            alerts: alerts,
            totalAlerts: alerts.length,
            criticalCount: alerts.filter(a => a.severity === 'critical').length,
            highCount: alerts.filter(a => a.severity === 'high').length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error generating alerts:', error);
        res.status(500).json({ error: 'Failed to generate alerts' });
    }
};

module.exports = {
    getExpiryData,
    getRawMaterials,
    getRawMaterialBatches,
    getTraceability,
    getBatchDetails,
    getAlerts
};
