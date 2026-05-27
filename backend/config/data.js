// --- MOCK DATABASE (DATA STORAGE) ---

// Helper function needed for data generation
function getFutureDate(daysToAdd) {
  const today = new Date();
  today.setDate(today.getDate() + daysToAdd);
  return today.toISOString().split('T')[0];
}

// > Data: Expiry Dashboard
const expiryData = [
  {
    name: 'Bulk Wheat Flour',
    batchId: 'B-1001-A',
    quantity: 500,
    unit: 'kg',
    expiryDate: getFutureDate(8),
  },
  {
    name: 'Active Dry Yeast',
    batchId: 'B-1003-B',
    quantity: 20,
    unit: 'kg',
    expiryDate: getFutureDate(2),
  },
  {
    name: 'Finished Biscuits',
    batchId: 'F-0982',
    quantity: 1500,
    unit: 'units',
    expiryDate: getFutureDate(35),
  },
  {
    name: 'Potato Starch',
    batchId: 'P-045A',
    quantity: 250,
    unit: 'kg',
    expiryDate: getFutureDate(-2), // Expired
  },
  {
    name: 'Vegetable Oil',
    batchId: 'V-004C',
    quantity: 120,
    unit: 'liters',
    expiryDate: getFutureDate(20),
  },
  {
    name: 'Maize Flour',
    batchId: 'M-023B',
    quantity: 400,
    unit: 'kg',
    expiryDate: getFutureDate(14),
  },
];

// > Data: Raw Materials (Overview)
const rawMaterialData = [
  {
    name: 'Wheat Flour',
    current_stock: 75000,
    max_stock: 100000,
    daily_consumption: 5000,
    unit: 'kg',
  },
  {
    name: 'Potato Starch',
    current_stock: 12000,
    max_stock: 50000,
    daily_consumption: 2000,
    unit: 'kg',
  },
  {
    name: 'Maize (for Corn Flour)',
    current_stock: 40000,
    max_stock: 80000,
    daily_consumption: 3000,
    unit: 'kg',
  },
  {
    name: 'Refined Sugar',
    current_stock: 30000,
    max_stock: 30000,
    daily_consumption: 2500,
    unit: 'kg',
  },
  {
    name: 'Vegetable Oil',
    current_stock: 5000,
    max_stock: 20000,
    daily_consumption: 1500,
    unit: 'liters',
  },
];

// > Data: Raw Material Batches (Detailed view)
const rawMaterialBatches = {
  'Wheat Flour': [
    {
      batchId: 'B-1001-A',
      delivered: '2025-11-01',
      expiry: '2026-05-01',
      quantity: 20000,
      qualityScore: 95,
    },
    {
      batchId: 'B-1008-C',
      delivered: '2025-11-10',
      expiry: '2026-05-10',
      quantity: 50000,
      qualityScore: 88,
    },
    {
      batchId: 'B-1009-F',
      delivered: '2025-11-12',
      expiry: '2026-02-12',
      quantity: 5000,
      qualityScore: 92,
    },
  ],
  'Potato Starch': [
    {
      batchId: 'P-045A',
      delivered: '2025-10-15',
      expiry: '2026-01-15',
      quantity: 12000,
      qualityScore: 75,
    },
  ],
  'Maize (for Corn Flour)': [
    {
      batchId: 'M-023B',
      delivered: '2025-11-05',
      expiry: '2026-06-05',
      quantity: 40000,
      qualityScore: 90,
    },
  ],
  'Refined Sugar': [
    {
      batchId: 'S-0771',
      delivered: '2025-09-20',
      expiry: '2027-09-20',
      quantity: 30000,
      qualityScore: 99,
    },
  ],
  'Vegetable Oil': [
    {
      batchId: 'V-004C',
      delivered: '2025-11-08',
      expiry: '2026-03-08',
      quantity: 5000,
      qualityScore: 85,
    },
  ],
};

// > Data: Batch Traceability (Live Routes)
const wheatBatches = [
  {
    batchId: 'B-1001-A',
    productName: 'Wheat Flour',
    supplierName: 'Kanpur Wheat Co-op',
    orderAmount: 20000,
    status: 'In Transit',
    totalRoute: 450,
    coveredRoute: 310,
    delayReason: 'Weather Delay - Fog',
    solution: 'Suggesting alternate route via NH-27. This will add 45km but bypass the fog zone.',
  },
  {
    batchId: 'B-1008-C',
    productName: 'Wheat Flour',
    supplierName: 'Punjab Golden Fields',
    orderAmount: 50000,
    status: 'Loading',
    totalRoute: 820,
    coveredRoute: 0,
    delayReason: 'Loading delay - Equipment Malfunction',
    solution: 'Dispatching secondary loading team. Estimated 4-hour rectification.',
  },
  {
    batchId: 'B-1009-F',
    productName: 'Organic Wheat',
    supplierName: 'Himalayan Organics',
    orderAmount: 10000,
    status: 'Packing',
    totalRoute: 600,
    coveredRoute: 0,
    delayReason: 'Awaiting Quality Check',
    solution: 'Lab results expected in 2 hours. Please standby.',
  },
];

const potatoBatches = [
  {
    batchId: 'P-045A',
    productName: 'Potato (Chip Grade)',
    supplierName: 'Agra Potato Growers',
    orderAmount: 30000,
    status: 'In Transit',
    totalRoute: 300,
    coveredRoute: 280,
    delayReason: null,
    solution: null,
  },
  {
    batchId: 'P-046B',
    productName: 'Potato',
    supplierName: 'Indore Farm Fresh',
    orderAmount: 25000,
    status: 'In Transit',
    totalRoute: 710,
    coveredRoute: 150,
    delayReason: 'Traffic Jam - NH-19',
    solution: 'Driver has been rerouted via local state highway. ETA updated.',
  },
];

const maizeBatches = [
  {
    batchId: 'M-023B',
    productName: 'Maize (Feed Grade)',
    supplierName: 'Bihar Maize Collective',
    orderAmount: 100000,
    status: 'Packing',
    totalRoute: 550,
    coveredRoute: 0,
    delayReason: null,
    solution: null,
  },
];

// Combine all for search by ID
const allTraceabilityBatches = [...wheatBatches, ...potatoBatches, ...maizeBatches];

// > Data: Suppliers
const wheatSupplierData = [
  { name: 'Kanpur Wheat Co-op', quantity: 50000, max_quantity: 100000, price: 22.5, delivery_time: 2, location: 'Kanpur, UP', rating: 4.5, quality_score: 92, certification: 'ISO 9001' },
  { name: 'AgriGrain India', quantity: 80000, max_quantity: 80000, price: 21.75, delivery_time: 3, location: 'Indore, MP', rating: 4.7, quality_score: 95, certification: 'FSSAI' },
  { name: 'Punjab Golden Fields', quantity: 120000, max_quantity: 250000, price: 23.0, delivery_time: 5, location: 'Ludhiana, Punjab', rating: 4.3, quality_score: 88, certification: 'Organic' },
  { name: 'UP Farm Collective', quantity: 35000, max_quantity: 40000, price: 22.0, delivery_time: 1, location: 'Varanasi, UP', rating: 4.6, quality_score: 93, certification: 'ISO 9001' },
  { name: 'Himalayan Organics', quantity: 15000, max_quantity: 20000, price: 35.0, delivery_time: 4, location: 'Himachal Pradesh', rating: 4.8, quality_score: 98, certification: 'Organic Certified' },
];

const potatoSupplierData = [
  { name: 'Agra Potato Growers', quantity: 75000, max_quantity: 100000, price: 15.0, delivery_time: 2, location: 'Agra, UP', rating: 4.4, quality_score: 90, certification: 'FSSAI' },
  { name: 'Indore Farm Fresh', quantity: 50000, max_quantity: 50000, price: 14.5, delivery_time: 3, location: 'Indore, MP', rating: 4.6, quality_score: 91, certification: 'ISO 9001' },
  { name: 'Gujarat Potato Co.', quantity: 150000, max_quantity: 200000, price: 15.5, delivery_time: 5, location: 'Ahmedabad, Gujarat', rating: 4.5, quality_score: 89, certification: 'FSSAI' },
  { name: 'West Bengal Farms', quantity: 200000, max_quantity: 300000, price: 14.75, delivery_time: 6, location: 'Kolkata, WB', rating: 4.2, quality_score: 86, certification: 'Certified' },
  { name: 'Small Farm Collective', quantity: 20000, max_quantity: 25000, price: 16.0, delivery_time: 1, location: 'Nashik, Maharashtra', rating: 4.7, quality_score: 94, certification: 'Organic' },
];

const maizeSupplierData = [
  { name: 'Bihar Maize Collective', quantity: 150000, max_quantity: 200000, price: 21.0, delivery_time: 4, location: 'Patna, Bihar', rating: 4.3, quality_score: 87, certification: 'FSSAI' },
  { name: 'Karnataka Corn Co.', quantity: 300000, max_quantity: 300000, price: 20.5, delivery_time: 6, location: 'Bengaluru, Karnataka', rating: 4.8, quality_score: 96, certification: 'ISO 9001' },
  { name: 'Central India Feeds', quantity: 80000, max_quantity: 100000, price: 21.2, delivery_time: 3, location: 'Nagpur, Maharashtra', rating: 4.5, quality_score: 91, certification: 'Certified' },
  { name: 'Telangana Maize Farms', quantity: 120000, max_quantity: 150000, price: 20.8, delivery_time: 5, location: 'Hyderabad, Telangana', rating: 4.6, quality_score: 93, certification: 'FSSAI' },
  { name: 'Rajasthan Arid Crops', quantity: 60000, max_quantity: 60000, price: 21.5, delivery_time: 4, location: 'Jaipur, Rajasthan', rating: 4.4, quality_score: 88, certification: 'Organic' },
];

// > Data: Inventory Alerts (Low Stock, Expiry Warnings, etc.)
const generateInventoryAlerts = () => {
  const alerts = [];
  const daysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
  };
  
  // Check for low stock materials
  rawMaterialData.forEach(material => {
    const stockPercent = (material.current_stock / material.max_stock) * 100;
    const daysLeft = material.current_stock / material.daily_consumption;
    
    if (stockPercent < 25) {
      alerts.push({
        id: `inv-low-${material.name}`,
        alertType: 'Low Stock',
        severity: stockPercent < 10 ? 'critical' : 'high',
        message: `${material.name}: Stock critically low at ${stockPercent.toFixed(0)}% (${daysLeft.toFixed(1)} days of production left)`,
        material: material.name,
        timestamp: new Date().toISOString()
      });
    }
  });
  
  // Check for expiring batches
  expiryData.forEach(item => {
    const daysLeft = daysUntilExpiry(item.expiryDate);
    if (daysLeft <= 7 && daysLeft > 0) {
      alerts.push({
        id: `exp-warn-${item.batchId}`,
        alertType: 'Expiry Warning',
        severity: daysLeft <= 3 ? 'high' : 'medium',
        message: `${item.name} (Batch ${item.batchId}) expires in ${daysLeft} days`,
        batch: item.batchId,
        timestamp: new Date().toISOString()
      });
    } else if (daysLeft <= 0) {
      alerts.push({
        id: `exp-expired-${item.batchId}`,
        alertType: 'Expired Item',
        severity: 'critical',
        message: `${item.name} (Batch ${item.batchId}) has EXPIRED. Qty: ${item.quantity} ${item.unit}`,
        batch: item.batchId,
        timestamp: new Date().toISOString()
      });
    }
  });
  
  return alerts;
};

// Export all data
module.exports = {
  expiryData,
  rawMaterialData,
  rawMaterialBatches,
  wheatBatches,
  potatoBatches,
  maizeBatches,
  allTraceabilityBatches,
  wheatSupplierData,
  potatoSupplierData,
  maizeSupplierData,
  generateInventoryAlerts
};
