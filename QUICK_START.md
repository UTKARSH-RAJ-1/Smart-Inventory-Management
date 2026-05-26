# 🚀 Quick Start Guide - SIM 2.0

## Prerequisites

- Node.js 18+ 
- npm 9+
- Basic knowledge of REST APIs

---

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
cd "d:\Projects\SIM 2.0\Smart-Inventory-Management"
npm install
```

### 2. Seed Database
```bash
npm run seed
```

You should see:
```
✅ Database synced!
✅ Admin user created (admin / admin123)
✅ Created 12 inventory items
✅ Created 4 suppliers
✅ Created 2 orders
✅ Created 5+ batches
...
👤 Demo Credentials: admin / admin123
```

### 3. Start Server
```bash
npm start
```

Server starts at: **http://localhost:3000**

### 4. Login
- **Username**: admin
- **Password**: admin123

---

## 📊 Key Features Unlocked

### ✅ Inventory Management
- Real-time stock tracking
- Expiry date monitoring
- Low stock alerts
- Health metrics dashboard

### ✅ Weather Integration
- Fog and delay predictions
- Order risk assessment
- Automatic alerts
- Impact analysis

### ✅ Order Management
- Create and track orders
- Supplier comparisons
- Delivery delay monitoring
- Order inquiry system

### ✅ Demand Forecasting
- 6-month historical analysis
- Seasonal pattern recognition
- Reorder recommendations
- Confidence scoring

---

## 🧪 Test the API

### Test 1: Check Inventory Health
```bash
curl http://localhost:3000/api/inventory-health
```

### Test 2: Get Demand Forecast
```bash
curl http://localhost:3000/api/forecast?materialType=wheat
```

### Test 3: Check Weather Delays
```bash
curl http://localhost:3000/api/weather/alerts
```

### Test 4: Get Suppliers
```bash
curl http://localhost:3000/api/suppliers?materialType=wheat
```

---

## 📱 Use in Frontend

```javascript
import * as API from './js/api.js';

// Login
const auth = await API.login('admin', 'admin123');

// Get inventory health
const health = await API.getInventoryHealth();
console.log('Health %:', health.health_percentage);

// Get forecast
const forecast = await API.getDemandForecast('wheat');
console.log('Next month demand:', forecast.predictedDemand);

// Check weather
const weather = await API.checkWeatherDelays();
console.log('Weather alerts:', weather.alerts);

// Create order
const order = await API.createOrder({
  supplierId: 1,
  materialType: 'wheat',
  quantity: 2000,
  unit: 'kg',
  unitPrice: 25,
  expectedDeliveryDate: '2025-06-10'
});
```

---

## 🗂️ What's New

| Component | What's New |
|-----------|-----------|
| Database | 5 new models (Supplier, Order, Alert, Batch, DemandForecast) |
| API | 34 endpoints (6 new route files) |
| Services | Demand forecasting + enhanced weather service |
| Controllers | 4 new controllers for comprehensive feature support |
| Frontend | 30+ new API functions |
| Docs | API_DOCUMENTATION.md + ENHANCEMENT_GUIDE.md |

---

## 🔗 Important URLs

- **Application**: http://localhost:3000
- **API Base**: http://localhost:3000/api
- **API Docs**: See `API_DOCUMENTATION.md`
- **Enhancement Details**: See `ENHANCEMENT_GUIDE.md`

---

## 🆘 Troubleshooting

### Issue: Port 3000 already in use
```bash
# Use different port
PORT=3001 npm start
```

### Issue: Database locked
```bash
# Delete old database
rm database.sqlite

# Re-seed
npm run seed
```

### Issue: Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

---

## 📖 Documentation Files

1. **README.md** - Project overview
2. **API_DOCUMENTATION.md** - Complete API reference
3. **ENHANCEMENT_GUIDE.md** - Detailed enhancement list
4. **QUICK_START.md** - This file

---

## 🎯 Next: Explore Features

1. **Dashboard** - View inventory health and alerts
2. **Raw Materials** - Check stock levels
3. **Suppliers** - Browse supplier marketplace
4. **Orders** - Create and manage orders
5. **Weather** - See delay predictions
6. **Forecasting** - Check demand predictions

---

## 💡 Pro Tips

- Use browser DevTools (F12) to monitor API calls
- Check browser Console for detailed error messages
- All timestamps in ISO 8601 format
- Weather data updates every server restart
- Forecasts can be regenerated anytime

---

## 📞 Support

- **Issues**: Check ENHANCEMENT_GUIDE.md
- **API Help**: See API_DOCUMENTATION.md
- **Code Issues**: Review error messages in console

---

**Ready to use! Happy inventory management! 🎉**
