# Smart Inventory Management System (SIM 2.0) - API Documentation

**Last Updated**: May 25, 2026  
**Version**: 2.0.0

---

## 📋 Table of Contents

- [Authentication](#authentication)
- [Inventory Management](#inventory-management)
- [Order Management](#order-management)
- [Supplier Management](#supplier-management)
- [Weather & Delay Prediction](#weather--delay-prediction)
- [Demand Forecasting](#demand-forecasting)
- [Alerts & Monitoring](#alerts--monitoring)

---

## 🔐 Authentication

All protected endpoints require a Bearer token in the Authorization header.

### Login
```
POST /api/login
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin"
}
```

**Usage:**
```javascript
import { login } from './js/api.js';
const result = await login('admin', 'admin123');
localStorage.setItem('authToken', result.token);
```

---

## 📦 Inventory Management

### Get All Inventory Items
```
GET /api/raw-materials
```

**Query Parameters:**
- `type` - Filter by type (raw_material, finished_good)
- `status` - Filter by status
- `search` - Search by name

**Response:**
```json
[
  {
    "id": 1,
    "name": "Wheat",
    "batchId": "RAW-Wheat-001",
    "quantity": 5000,
    "unit": "kg",
    "current_stock": 4500,
    "max_stock": 8000,
    "daily_consumption": 50,
    "expiryDate": "2025-08-25",
    "daysUntilExpiry": 92,
    "expiryStatus": "fresh",
    "stockStatus": "normal"
  }
]
```

**Usage:**
```javascript
import { fetchRawMaterials, getInventoryHealth, getLowStockAlerts } from './js/api.js';

const materials = await fetchRawMaterials();
const health = await getInventoryHealth();
const lowStock = await getLowStockAlerts();
```

### Get Inventory Health Metrics
```
GET /api/inventory-health
```

**Response:**
```json
{
  "total_items": 12,
  "expired_count": 0,
  "expiring_soon_count": 2,
  "low_stock_count": 1,
  "overstocked_count": 3,
  "health_percentage": 87
}
```

### Get Low Stock Alerts
```
GET /api/low-stock-alerts
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Potato",
    "currentStock": 800,
    "maxStock": 5000,
    "recommendedOrderQty": 3200,
    "urgency": "high"
  }
]
```

### Create Inventory Item
```
POST /api/inventory
```

**Required Headers:** Authorization: Bearer {token}

**Request Body:**
```json
{
  "name": "Rice",
  "batchId": "RAW-Rice-001",
  "quantity": 3000,
  "unit": "kg",
  "expiryDate": "2025-09-30",
  "type": "raw_material",
  "max_stock": 6000,
  "daily_consumption": 40
}
```

**Usage:**
```javascript
import { createInventoryItem } from './js/api.js';

const newItem = await createInventoryItem({
  name: 'Rice',
  batchId: 'RAW-Rice-001',
  quantity: 3000,
  unit: 'kg',
  expiryDate: '2025-09-30',
  type: 'raw_material'
});
```

### Get Expiry Data
```
GET /api/expiry
```

**Response:**
```json
{
  "expired": [],
  "expiring_soon": [
    {
      "id": 5,
      "name": "Corn",
      "expiryDate": "2025-06-01",
      "daysUntilExpiry": 3
    }
  ],
  "warning": []
}
```

---

## 📋 Order Management

### Create New Order
```
POST /api/orders
```

**Required Headers:** Authorization: Bearer {token}

**Request Body:**
```json
{
  "supplierId": 1,
  "materialType": "wheat",
  "quantity": 2000,
  "unit": "kg",
  "unitPrice": 25,
  "expectedDeliveryDate": "2025-06-10",
  "notes": "Urgent order"
}
```

**Response:**
```json
{
  "message": "Order created successfully",
  "order": {
    "id": 1,
    "orderNumber": "ORD-1716571234567",
    "supplierId": 1,
    "status": "pending",
    "totalPrice": 50000,
    "createdAt": "2025-05-25"
  }
}
```

**Usage:**
```javascript
import { createOrder } from './js/api.js';

const order = await createOrder({
  supplierId: 1,
  materialType: 'wheat',
  quantity: 2000,
  unit: 'kg',
  unitPrice: 25,
  expectedDeliveryDate: '2025-06-10'
});
```

### Get All Orders
```
GET /api/orders
```

**Query Parameters:**
- `status` - pending, confirmed, in-transit, delivered, delayed, cancelled
- `supplierId` - Filter by supplier
- `materialType` - Filter by material type

**Response:**
```json
[
  {
    "id": 1,
    "orderNumber": "ORD-001-2025",
    "status": "in-transit",
    "quantity": 2000,
    "totalPrice": 50000,
    "expectedDeliveryDate": "2025-06-10",
    "Supplier": {
      "id": 1,
      "name": "Kanpur Wheat Co-op"
    }
  }
]
```

### Update Order Status
```
PUT /api/orders/:id/status
```

**Required Headers:** Authorization: Bearer {token}

**Request Body:**
```json
{
  "status": "delivered",
  "actualDeliveryDate": "2025-06-10",
  "notes": "Order delivered successfully"
}
```

**Usage:**
```javascript
import { updateOrderStatus, getDelayedOrders } from './js/api.js';

await updateOrderStatus(1, {
  status: 'delivered',
  actualDeliveryDate: new Date().toISOString()
});

const delayed = await getDelayedOrders();
```

### Get Delayed Orders
```
GET /api/orders/delayed
```

**Response:**
```json
[
  {
    "id": 2,
    "orderNumber": "ORD-002-2025",
    "status": "in-transit",
    "daysDelayed": 3,
    "expectedDeliveryDate": "2025-06-05"
  }
]
```

### Cancel Order
```
DELETE /api/orders/:id
```

**Required Headers:** Authorization: Bearer {token}

---

## 🤝 Supplier Management

### Create Supplier
```
POST /api/suppliers
```

**Required Headers:** Authorization: Bearer {token}

**Request Body:**
```json
{
  "name": "New Supplier",
  "contactPerson": "John Doe",
  "email": "john@supplier.com",
  "phone": "+91-9876543210",
  "location": "Delhi",
  "latitude": 28.7041,
  "longitude": 77.1025,
  "materialType": "wheat",
  "unitPrice": 24,
  "averageDeliveryDays": 5
}
```

### Get All Suppliers
```
GET /api/suppliers
```

**Query Parameters:**
- `materialType` - Filter by material type
- `contractStatus` - active, inactive, suspended

**Response:**
```json
[
  {
    "id": 1,
    "name": "Kanpur Wheat Co-op",
    "materialType": "wheat",
    "currentInventory": 5000,
    "unitPrice": 25,
    "averageDeliveryDays": 5,
    "rating": 4.5,
    "reliabilityScore": 95,
    "contractStatus": "active"
  }
]
```

**Usage:**
```javascript
import { getAllSuppliers, getSupplierMarketplace } from './js/api.js';

const suppliers = await getAllSuppliers({ materialType: 'wheat' });
const marketplace = await getSupplierMarketplace('wheat');
```

### Place Order Inquiry
```
POST /api/suppliers/:id/order-inquiry
```

**Request Body:**
```json
{
  "materialType": "wheat",
  "quantity": 2000,
  "unit": "kg"
}
```

**Response:**
```json
{
  "supplier": "Kanpur Wheat Co-op",
  "materialType": "wheat",
  "quantity": 2000,
  "unitPrice": 25,
  "totalCost": 50000,
  "expectedDeliveryDate": "2025-06-01",
  "available": true,
  "reliabilityScore": 95,
  "rating": 4.5
}
```

**Usage:**
```javascript
import { placeOrderInquiry } from './js/api.js';

const inquiry = await placeOrderInquiry(1, {
  materialType: 'wheat',
  quantity: 2000,
  unit: 'kg'
});
```

### Get Supplier Marketplace
```
GET /api/marketplace/suppliers
```

**Query Parameters:**
- `materialType` - Filter by material type

**Response:**
```json
[
  {
    "id": 1,
    "name": "Kanpur Wheat Co-op",
    "materialType": "wheat",
    "unitPrice": 25,
    "availableInventory": 5000,
    "averageDeliveryDays": 5,
    "rating": 4.5,
    "reliabilityScore": 95,
    "location": "Kanpur"
  }
]
```

---

## 🌦️ Weather & Delay Prediction

### Check Weather Delays for All Orders
```
GET /api/weather/alerts
```

**Response:**
```json
{
  "alertCount": 1,
  "alerts": [
    {
      "orderId": 2,
      "orderNumber": "ORD-002-2025",
      "supplier": "Agra Potato Growers",
      "alertType": "weather_delay",
      "severity": "high",
      "message": "Fog detected at Agra Potato Growers. Estimated delay risk: 75%",
      "delayRiskPercentage": 75,
      "recommendedAction": "Consider alternative supplier or route"
    }
  ],
  "timestamp": "2025-05-25T10:30:00Z"
}
```

**Usage:**
```javascript
import { checkWeatherDelays, predictDeliveryDelay } from './js/api.js';

const alerts = await checkWeatherDelays();
const prediction = await predictDeliveryDelay(1, '2025-06-10');
```

### Predict Delivery Delay
```
POST /api/weather/predict-delay
```

**Request Body:**
```json
{
  "supplierId": 1,
  "expectedDeliveryDate": "2025-06-10"
}
```

**Response:**
```json
{
  "supplier": "Kanpur Wheat Co-op",
  "originalDeliveryDate": "2025-06-10",
  "delayRiskPercentage": 35,
  "estimatedDelay": 2,
  "revisedDeliveryDate": "2025-06-12",
  "recommendation": "MEDIUM RISK - Monitor",
  "weatherConditions": [...]
}
```

### Get Weather Forecast
```
GET /api/weather/forecast
```

**Query Parameters:**
- `latitude` - Location latitude (required)
- `longitude` - Location longitude (required)
- `location` - Location name (optional)

**Response:**
```json
{
  "location": "Kanpur, Uttar Pradesh",
  "forecast": {
    "hasFog": false,
    "conditions": [
      {
        "day": 1,
        "code": 3,
        "description": "Clear",
        "delayFactor": 0,
        "precipitation": 0,
        "windSpeed": 10.5
      }
    ],
    "averageDelayFactor": 0.15
  }
}
```

### Get All Weather Alerts
```
GET /api/weather/all-alerts
```

**Response:**
```json
[
  {
    "id": 1,
    "alertType": "weather_delay",
    "severity": "high",
    "title": "Weather Delay Risk: Order ORD-002-2025",
    "description": "Fog detected at Agra Potato Growers. Delay risk: 75%",
    "isResolved": false,
    "createdAt": "2025-05-25T10:30:00Z"
  }
]
```

### Get Weather Impact Analysis
```
GET /api/weather/impact-analysis
```

**Response:**
```json
{
  "totalPendingOrders": 5,
  "affectedOrders": 2,
  "averageDelayRisk": "42.5",
  "recommendation": "NORMAL: Weather impact minimal"
}
```

---

## 📊 Demand Forecasting

### Get Demand Forecast
```
GET /api/forecast?materialType=wheat
```

**Response:**
```json
{
  "materialType": "wheat",
  "forecastDate": "2025-05-25",
  "predictedDemand": 2500,
  "currentStock": 4000,
  "maxStock": 8000,
  "daysInventoryWillLast": 80,
  "needsReorder": false,
  "recommendedOrderQuantity": 0,
  "recommendedOrderDate": "2025-08-20",
  "demandTrend": "increasing",
  "seasonalFactor": 1.2,
  "confidence": 85
}
```

**Usage:**
```javascript
import { getDemandForecast, getAllForecasts, getReorderRecommendations } from './js/api.js';

const forecast = await getDemandForecast('wheat');
const allForecasts = await getAllForecasts();
const recommendations = await getReorderRecommendations();
```

### Generate All Forecasts
```
POST /api/forecasts/generate-all
```

**Required Headers:** Authorization: Bearer {token}

**Response:**
```json
{
  "message": "Generated 3 forecasts",
  "forecasts": [
    { "materialType": "wheat", ... },
    { "materialType": "potato", ... },
    { "materialType": "maize", ... }
  ]
}
```

### Get Demand Analysis
```
GET /api/analysis/demand?materialType=wheat&monthsBack=6
```

**Response:**
```json
{
  "materialType": "wheat",
  "averageDemand": 2200,
  "trend": "increasing",
  "variance": 45000,
  "standardDeviation": 212,
  "historicalData": [2100, 2200, 2300, 2400],
  "weekCount": 4
}
```

### Get Seasonal Analysis
```
GET /api/analysis/seasonal?materialType=wheat
```

**Response:**
```json
{
  "materialType": "wheat",
  "seasonalFactors": [
    { "month": "January", "seasonalFactor": 1.2 },
    { "month": "February", "seasonalFactor": 1.2 },
    ...
  ]
}
```

### Get Reorder Recommendations
```
GET /api/recommendations/reorder
```

**Response:**
```json
{
  "needsReorders": true,
  "recommendations": [
    {
      "materialType": "potato",
      "currentStock": 500,
      "recommendedOrderQuantity": 3500,
      "recommendedOrderDate": "2025-05-26",
      "urgency": "critical",
      "predictedDemand": 3200
    }
  ]
}
```

### Compare Demand vs Supply
```
GET /api/analysis/demand-vs-supply
```

**Response:**
```json
[
  {
    "materialType": "wheat",
    "predictedDemand": 2500,
    "currentStock": 4000,
    "gap": -1500,
    "sufficiency": "sufficient",
    "action": "no_action"
  }
]
```

---

## ⚠️ Alerts & Monitoring

### Get All Alerts
```
GET /api/weather/all-alerts
```

**Response includes:**
- Weather delay alerts
- Low stock alerts
- Expiry warnings
- Supplier delays

### Resolve Alert
```
PUT /api/weather/alerts/:id/resolve
```

**Request Body:**
```json
{
  "resolution": "Order rerouted via alternate supplier"
}
```

---

## 📝 Error Handling

All endpoints return standard error responses:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Server Error

---

## 🔑 Frontend Usage Example

```javascript
import * as API from './js/api.js';

async function demonstrateAPI() {
  try {
    // Login
    const auth = await API.login('admin', 'admin123');
    localStorage.setItem('authToken', auth.token);

    // Get inventory
    const materials = await API.fetchRawMaterials();
    console.log('Materials:', materials);

    // Get forecast
    const forecast = await API.getDemandForecast('wheat');
    console.log('Forecast:', forecast);

    // Check weather
    const weather = await API.checkWeatherDelays();
    console.log('Weather Alerts:', weather);

    // Create order
    const order = await API.createOrder({
      supplierId: 1,
      materialType: 'wheat',
      quantity: 2000,
      unit: 'kg',
      unitPrice: 25,
      expectedDeliveryDate: '2025-06-10'
    });
    console.log('Order Created:', order);

  } catch (error) {
    console.error('API Error:', error);
  }
}
```

---

**End of API Documentation**
