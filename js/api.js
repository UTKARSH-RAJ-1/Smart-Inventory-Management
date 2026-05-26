const API_URL = 'http://localhost:3000';

function getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
}

export async function login(username, password) {
    const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
    }
    return await response.json();
}

export async function fetchExpiryData() {
    const response = await fetch(`${API_URL}/api/expiry`, { headers: getAuthHeaders() });
    return await response.json();
}

export async function fetchRawMaterials() {
    const response = await fetch(`${API_URL}/api/raw-materials`, { headers: getAuthHeaders() });
    return await response.json();
}

export async function fetchRawMaterialBatches() {
    const response = await fetch(`${API_URL}/api/raw-materials/batches`, { headers: getAuthHeaders() });
    return await response.json();
}

export async function fetchTraceability(material) {
    const response = await fetch(`${API_URL}/api/traceability?material=${material}`, { headers: getAuthHeaders() });
    return await response.json();
}

export async function fetchBatchDetails(batchId) {
    const response = await fetch(`${API_URL}/api/traceability/batch/${batchId}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Batch not found');
    return await response.json();
}

export async function fetchSuppliers(material) {
    const response = await fetch(`${API_URL}/api/suppliers?material=${material}`, { headers: getAuthHeaders() });
    return await response.json();
}

export async function fetchFinishedGoods() {
    // Mock Data for Finished Goods
    return [
        {
            id: 'FG-001',
            name: 'Spicy Potato Chips',
            sku: 'SPC-100g',
            current_stock: 1200,
            max_stock: 5000,
            market_demand: 'High ⬆️',
            predicted_production_need: 850,
            unit_price: 20.00,
            status: 'In Stock'
        },
        {
            id: 'FG-002',
            name: 'Salted Corn Rings',
            sku: 'SCR-50g',
            current_stock: 450,
            max_stock: 3000,
            market_demand: 'Medium ➡️',
            predicted_production_need: 1200,
            unit_price: 15.00,
            status: 'Low Stock'
        },
        {
            id: 'FG-003',
            name: 'Masala Wheat Sticks',
            sku: 'MWS-100g',
            current_stock: 2800,
            max_stock: 4000,
            market_demand: 'Low ⬇️',
            predicted_production_need: 0,
            unit_price: 25.00,
            status: 'Overstocked'
        },
        {
            id: 'FG-004',
            name: 'Classic Salted Wafers',
            sku: 'CSW-200g',
            current_stock: 100,
            max_stock: 2500,
            market_demand: 'Very High ⬆️',
            predicted_production_need: 2400,
            unit_price: 40.00,
            status: 'Critical Low'
        },
        {
            id: 'FG-005',
            name: 'Cheese Balls',
            sku: 'CB-150g',
            current_stock: 3200,
            max_stock: 4000,
            market_demand: 'High ⬆️',
            predicted_production_need: 500,
            unit_price: 35.00,
            status: 'In Stock'
        },
        {
            id: 'FG-006',
            name: 'Corn Puffs',
            sku: 'CP-80g',
            current_stock: 1500,
            max_stock: 3000,
            market_demand: 'Medium ➡️',
            predicted_production_need: 1000,
            unit_price: 18.00,
            status: 'In Stock'
        },
        {
            id: 'FG-007',
            name: 'Baked Wheat Sticks',
            sku: 'BWS-120g',
            current_stock: 4800,
            max_stock: 5000,
            market_demand: 'Low ⬇️',
            predicted_production_need: 0,
            unit_price: 30.00,
            status: 'Overstocked'
        },
        {
            id: 'FG-008',
            name: 'Veggie Chips',
            sku: 'VC-100g',
            current_stock: 50,
            max_stock: 2000,
            market_demand: 'Very High ⬆️',
            predicted_production_need: 1950,
            unit_price: 55.00,
            status: 'Critical Low'
        },
        {
            id: 'FG-009',
            name: 'Masala Munch',
            sku: 'MM-200g',
            current_stock: 800,
            max_stock: 5000,
            market_demand: 'High ⬆️',
            predicted_production_need: 3000,
            unit_price: 45.00,
            status: 'Low Stock'
        }
    ];
}

export async function fetchWeatherAlerts() {
    try {
        const response = await fetch(`${API_URL}/api/alerts`);
        const data = await response.json();
        return data.alerts || [];
    } catch (error) {
        console.error('Error fetching weather alerts:', error);
        return [];
    }
}

export async function fetchQualityIncidents() {
    return [
        { id: 'QI-001', date: '2025-10-24', type: 'Foreign Material', details: 'Plastic fragment found in Potato Batch B-102', severity: 'High', status: 'Open' },
        { id: 'QI-002', date: '2025-10-22', type: 'Moisture Content', details: 'Wheat Batch W-908 exceeds moisture limit (14%)', severity: 'Medium', status: 'Investigating' },
        { id: 'QI-003', date: '2025-10-15', type: 'Packaging', details: 'Damaged seals on Oil drums from Supplier X', severity: 'Low', status: 'Resolved' },
        { id: 'QI-004', date: '2025-10-10', type: 'Pest Control', details: 'Minor pest activity detected near storage unit C', severity: 'Medium', status: 'Resolved' }
    ];
}

export async function fetchComplianceData() {
    return [
        { id: 'C-001', name: 'FSSAI License', supplier: 'Agro Farms Ltd', expiry: '2025-12-31', status: 'Valid' },
        { id: 'C-002', name: 'ISO 9001:2015', supplier: 'Global Spices Corp', expiry: '2025-11-15', status: 'Expiring Soon' },
        { id: 'C-003', name: 'Organic Certification', supplier: 'Green Earth Supplies', expiry: '2025-09-30', status: 'Expired' },
        { id: 'C-004', name: 'Halal Certification', supplier: 'Pure Oils Pvt Ltd', expiry: '2026-06-20', status: 'Valid' }
    ];
}

// ===== NEW: ORDER MANAGEMENT API FUNCTIONS =====

export async function createOrder(orderData) {
    const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData)
    });
    if (!response.ok) throw new Error('Failed to create order');
    return await response.json();
}

export async function fetchOrders(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.supplierId) params.append('supplierId', filters.supplierId);
    if (filters.materialType) params.append('materialType', filters.materialType);

    const response = await fetch(`${API_URL}/api/orders?${params}`, { headers: getAuthHeaders() });
    return await response.json();
}

export async function getOrderById(orderId) {
    const response = await fetch(`${API_URL}/api/orders/${orderId}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Order not found');
    return await response.json();
}

export async function updateOrderStatus(orderId, statusData) {
    const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(statusData)
    });
    if (!response.ok) throw new Error('Failed to update order');
    return await response.json();
}

export async function cancelOrder(orderId) {
    const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to cancel order');
    return await response.json();
}

export async function getDelayedOrders() {
    const response = await fetch(`${API_URL}/api/orders/delayed`, { headers: getAuthHeaders() });
    return await response.json();
}

// ===== NEW: SUPPLIER MANAGEMENT API FUNCTIONS =====

export async function createSupplier(supplierData) {
    const response = await fetch(`${API_URL}/api/suppliers`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(supplierData)
    });
    if (!response.ok) throw new Error('Failed to create supplier');
    return await response.json();
}

export async function getAllSuppliers(filters = {}) {
    const params = new URLSearchParams();
    if (filters.materialType) params.append('materialType', filters.materialType);
    if (filters.contractStatus) params.append('contractStatus', filters.contractStatus);

    const response = await fetch(`${API_URL}/api/suppliers?${params}`, { headers: getAuthHeaders() });
    return await response.json();
}

export async function getSupplierById(supplierId) {
    const response = await fetch(`${API_URL}/api/suppliers/${supplierId}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Supplier not found');
    return await response.json();
}

export async function updateSupplier(supplierId, supplierData) {
    const response = await fetch(`${API_URL}/api/suppliers/${supplierId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(supplierData)
    });
    if (!response.ok) throw new Error('Failed to update supplier');
    return await response.json();
}

export async function placeOrderInquiry(supplierId, inquiryData) {
    const response = await fetch(`${API_URL}/api/suppliers/${supplierId}/order-inquiry`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(inquiryData)
    });
    return await response.json();
}

export async function getSupplierMarketplace(materialType = null) {
    const params = materialType ? `?materialType=${materialType}` : '';
    const response = await fetch(`${API_URL}/api/marketplace/suppliers${params}`, { headers: getAuthHeaders() });
    return await response.json();
}

// ===== NEW: DEMAND FORECASTING API FUNCTIONS =====

export async function getDemandForecast(materialType) {
    const response = await fetch(`${API_URL}/api/forecast?materialType=${materialType}`, { headers: getAuthHeaders() });
    return await response.json();
}

export async function getAllForecasts() {
    const response = await fetch(`${API_URL}/api/forecasts`, { headers: getAuthHeaders() });
    return await response.json();
}

export async function generateAllForecasts() {
    const response = await fetch(`${API_URL}/api/forecasts/generate-all`, {
        method: 'POST',
        headers: getAuthHeaders()
    });
    return await response.json();
}

export async function getDemandAnalysis(materialType, monthsBack = 6) {
    const response = await fetch(`${API_URL}/api/analysis/demand?materialType=${materialType}&monthsBack=${monthsBack}`, 
        { headers: getAuthHeaders() });
    return await response.json();
}

export async function getSeasonalAnalysis(materialType) {
    const response = await fetch(`${API_URL}/api/analysis/seasonal?materialType=${materialType}`, { headers: getAuthHeaders() });
    return await response.json();
}

export async function getReorderRecommendations() {
    const response = await fetch(`${API_URL}/api/recommendations/reorder`, { headers: getAuthHeaders() });
    return await response.json();
}

export async function compareDemandSupply() {
    const response = await fetch(`${API_URL}/api/analysis/demand-vs-supply`, { headers: getAuthHeaders() });
    return await response.json();
}

// ===== NEW: WEATHER & DELAY PREDICTION =====

export async function checkWeatherDelays() {
    try {
        const response = await fetch(`${API_URL}/api/weather/alerts`, { headers: getAuthHeaders() });
        return await response.json();
    } catch (error) {
        console.error('Error checking weather delays:', error);
        return { alerts: [] };
    }
}

export async function predictDeliveryDelay(supplierId, expectedDeliveryDate) {
    const response = await fetch(`${API_URL}/api/weather/predict-delay`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ supplierId, expectedDeliveryDate })
    });
    return await response.json();
}

export async function getWeatherForecast(latitude, longitude, location = null) {
    const params = new URLSearchParams({ latitude, longitude });
    if (location) params.append('location', location);
    
    const response = await fetch(`${API_URL}/api/weather/forecast?${params}`, { headers: getAuthHeaders() });
    return await response.json();
}

export async function getAllWeatherAlerts() {
    const response = await fetch(`${API_URL}/api/weather/all-alerts`, { headers: getAuthHeaders() });
    return await response.json();
}

export async function resolveWeatherAlert(alertId, resolution) {
    const response = await fetch(`${API_URL}/api/weather/alerts/${alertId}/resolve`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ resolution })
    });
    return await response.json();
}

export async function getWeatherImpactAnalysis() {
    const response = await fetch(`${API_URL}/api/weather/impact-analysis`, { headers: getAuthHeaders() });
    return await response.json();
}

// ===== NEW: INVENTORY MANAGEMENT FUNCTIONS (DB) =====

export async function getInventoryHealth() {
    const response = await fetch(`${API_URL}/api/inventory-health`, { headers: getAuthHeaders() });
    return await response.json();
}

export async function getLowStockAlerts() {
    const response = await fetch(`${API_URL}/api/low-stock-alerts`, { headers: getAuthHeaders() });
    return await response.json();
}

export async function consumeInventory(itemId, quantity) {
    const response = await fetch(`${API_URL}/api/inventory/${itemId}/consume`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity })
    });
    if (!response.ok) throw new Error('Failed to consume inventory');
    return await response.json();
}

export async function createInventoryItem(itemData) {
    const response = await fetch(`${API_URL}/api/inventory`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(itemData)
    });
    if (!response.ok) throw new Error('Failed to create inventory item');
    return await response.json();
}

export async function updateInventoryItem(itemId, updateData) {
    const response = await fetch(`${API_URL}/api/inventory/${itemId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
    });
    if (!response.ok) throw new Error('Failed to update inventory item');
    return await response.json();
}

