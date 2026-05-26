# Smart Inventory Management System (SIM 2.0)

> An enterprise-grade supply chain optimization platform with real-time weather integration, intelligent inventory tracking, and supplier management capabilities.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Status](https://img.shields.io/badge/Status-Active-success.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Security](#security)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [Support](#support)

---

## 🎯 Overview

Smart Inventory Management System (SIM 2.0) is a modern supply chain optimization platform that addresses critical challenges in large-scale inventory networks.

### The Problem

Large-scale supply chains face volatile dependencies where minor disruptions propagate unpredictably:
- Logistical delays due to weather or supplier issues
- Demand fluctuations without visibility
- Supplier inconsistencies and unexpected delays
- Resulting in inventory mismatches, operational downtime, and financial inefficiencies

### The Solution

SIM 2.0 leverages three core data streams to generate intelligent, actionable recommendations:

```
Inventory Data + Demand Data = Optimal Order Quantity
Weather Data = Optimal Order Timing  
Supplier Data = Best Route & Pricing
```

---

## ✨ Key Features

### 🌦️ Weather Integration
- Real-time weather forecasting from Open-Meteo API
- Automatic fog and delay predictions
- Dynamic route optimization based on weather conditions
- Supplier alert system for unexpected disruptions

### 📦 Intelligent Inventory Management
- **Expiry Tracking**: Automated batch lifecycle monitoring with alerts
- **Stock Optimization**: Real-time inventory analysis and recommendations
- **Batch Traceability**: Complete supply chain visibility (Supplier → Transit → Warehouse)
- **Low Stock Alerts**: Proactive notifications with reorder quantities

### 🏪 Supplier Marketplace
- Real-time supplier inventory visibility
- Competitive pricing comparison across suppliers
- Accurate delivery time estimates
- One-click order inquiries with contract enforcement

### 👥 Demand Forecasting
- Historical data analysis and trend prediction
- Seasonal pattern recognition
- Demand-based inventory recommendations
- Predictive ordering suggestions

### 🎨 Premium User Interface
- Modern glassmorphism design with semi-transparent elements
- Dark/Light theme toggle with persistent preferences
- Interactive real-time dashboards
- Professional data visualization with Chart.js
- Toast notifications for user actions

### 🔒 Enterprise Security
- JWT-based secure authentication
- Role-based access control
- Data encryption and validation
- SQLite with Sequelize ORM for data integrity

---

## 💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js, Express.js |
| **Database** | SQLite, Sequelize ORM |
| **Frontend** | HTML5, CSS3, ES6+ JavaScript |
| **Authentication** | JWT (JSON Web Tokens) |
| **Data Visualization** | Chart.js |
| **Weather API** | Open-Meteo |
| **Testing** | Jest |
| **Code Quality** | ESLint |

---

## 📁 Project Structure

```
Smart-Inventory-Management/
├── backend/
│   ├── config/
│   │   ├── data.js              # Sample data configuration
│   │   └── database.js          # Database initialization
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── inventoryController.js
│   │   ├── supplierController.js
│   │   └── weatherController.js
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification
│   ├── models/
│   │   ├── Inventory.js         # Inventory model
│   │   └── User.js              # User model
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── inventoryRoutes.js
│   │   ├── supplierRoutes.js
│   │   └── weatherRoutes.js
│   ├── services/
│   │   └── weatherService.js    # External API integration
│   ├── scripts/
│   │   └── seed.js              # Database seeding
│   └── server.js                # Server entry point
├── js/
│   ├── api.js                   # API communication layer
│   ├── main.js                  # Application logic
│   ├── ui.js                    # UI manipulation
│   ├── toast.js                 # Notification system
│   └── utils.js                 # Helper functions
├── tests/
│   └── api.test.js              # API test suite
├── index.html                   # Main application page
├── style.css                    # Global styles
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Smart-Inventory-Management.git
   cd Smart-Inventory-Management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run seed
   ```

### Configuration

Create a `.env` file in the project root:

```env
PORT=5000
NODE_ENV=development
DB_PATH=./database.sqlite
JWT_SECRET=your_jwt_secret_key_here
OPENMETEO_API_URL=https://api.open-meteo.com/v1
CORS_ORIGIN=http://localhost:5000
```

### Running the Application

**Start development server:**
```bash
npm start
```

The application will be available at `http://localhost:5000`

---

## 📖 Usage

### Default Credentials

```
Username: admin
Password: admin123
```

### Main Workflows

#### 1. Inventory Management
- Dashboard displays current stock levels in real-time
- Visual expiry date indicators (Green/Yellow/Red)
- Automatic low-stock alerts with reorder recommendations

#### 2. Weather-Based Ordering
- Real-time weather forecasting for your region
- Automatic delay predictions and ordering recommendations
- Alternate supplier suggestions based on weather impact

#### 3. Supplier Collaboration
- Browse supplier marketplace
- Compare prices and delivery times
- Place order inquiries with contract tracking

#### 4. Analytics & Reporting
- Inventory trend analysis
- Demand pattern insights
- Supply chain efficiency metrics

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Token verification

### Inventory
- `GET /api/inventory` - Fetch all items
- `POST /api/inventory` - Create new item
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item

### Suppliers
- `GET /api/suppliers` - Fetch supplier list
- `POST /api/suppliers` - Add new supplier
- `GET /api/suppliers/:id` - Get supplier details

### Weather
- `GET /api/weather` - Fetch weather forecast
- `POST /api/weather/predict-delay` - Predict delivery delays

---

## ✅ Testing

```bash
npm test                    # Run test suite
npm test -- --coverage      # With coverage report
npm test api.test.js        # Specific test file
```

---

## 🔒 Security Features

- JWT-based authentication
- Bcrypt password hashing
- CORS protection
- Input validation on all endpoints
- SQL injection prevention via Sequelize
- Rate limiting (coming soon)

---

## 🏗️ Architecture

### Design Patterns
- **MVC Pattern**: Separation of concerns
- **Module Pattern**: ES6 modules for frontend
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic separation

### Data Flow
```
User Input → API Client → Express Server → Controllers 
  → Sequelize Models → SQLite Database
```

---

## 🤝 Contributing

We welcome contributions! 

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow ESLint guidelines
- Write tests for new features
- Update documentation
- Follow existing code structure

---

## 📞 Support

- **Issues**: GitHub Issues
- **Documentation**: Project Wiki
- **Email**: support@example.com

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Open-Meteo for free weather API
- Open-source community
- Contributors to supply chain innovation

---

**Version**: 2.0.0  
**Last Updated**: May 25, 2026




