const axios = require('axios');

// Supplier locations with coordinates
const SUPPLIER_LOCATIONS = {
    'Kanpur Wheat Co-op': { lat: 26.4499, lon: 80.3319 },
    'Punjab Golden Fields': { lat: 30.9010, lon: 75.8573 },
    'Agra Potato Growers': { lat: 27.1767, lon: 78.0081 },
    'Madhya Pradesh Maize Hub': { lat: 22.7196, lon: 75.8577 },
    'Gujarat Agro Suppliers': { lat: 22.3072, lon: 73.1812 },
    'Haryana Farm Supply Co.': { lat: 29.0588, lon: 77.0745 }
};

// WMO Weather codes for different conditions
const WEATHER_CODES = {
    45: { description: 'Fog', delayFactor: 0.8 },
    48: { description: 'Fog with rime', delayFactor: 0.9 },
    51: { description: 'Light drizzle', delayFactor: 0.4 },
    53: { description: 'Moderate drizzle', delayFactor: 0.6 },
    55: { description: 'Heavy drizzle', delayFactor: 0.7 },
    61: { description: 'Slight rain', delayFactor: 0.5 },
    63: { description: 'Moderate rain', delayFactor: 0.7 },
    65: { description: 'Heavy rain', delayFactor: 0.9 },
    71: { description: 'Slight snow', delayFactor: 0.6 },
    73: { description: 'Moderate snow', delayFactor: 0.8 },
    75: { description: 'Heavy snow', delayFactor: 0.95 },
    80: { description: 'Slight rain showers', delayFactor: 0.5 },
    82: { description: 'Moderate rain showers', delayFactor: 0.7 },
    85: { description: 'Heavy rain showers', delayFactor: 0.9 },
    95: { description: 'Thunderstorm', delayFactor: 0.95 }
};

// Get weather forecast for a location
const getFogForecast = async (latitude, longitude) => {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,precipitation_sum,windspeed_10m_max&forecast_days=7&timezone=auto`;

        const response = await axios.get(url);
        const dailyCodes = response.data.daily.weathercode;
        const precipitation = response.data.daily.precipitation_sum;
        const windSpeed = response.data.daily.windspeed_10m_max;

        // Check if any of the next 3 days has fog
        const hasFog = dailyCodes.slice(0, 3).some(code => code === 45 || code === 48);
        
        const conditions = dailyCodes.slice(0, 3).map((code, index) => ({
            day: index + 1,
            code,
            description: WEATHER_CODES[code]?.description || 'Clear',
            delayFactor: WEATHER_CODES[code]?.delayFactor || 0,
            precipitation: precipitation[index],
            windSpeed: windSpeed[index]
        }));

        const averageDelayFactor = conditions.length > 0 
            ? conditions.reduce((sum, c) => sum + c.delayFactor, 0) / conditions.length 
            : 0;

        return {
            hasFog,
            conditions,
            averageDelayFactor,
            location: { lat: latitude, lon: longitude },
            timestamp: new Date()
        };
    } catch (error) {
        console.error('Error fetching weather:', error.message);
        return {
            hasFog: false,
            conditions: [],
            averageDelayFactor: 0,
            error: true,
            errorMessage: error.message
        };
    }
};

// Calculate delay risk based on weather data
const calculateDelayRisk = (weatherData) => {
    if (!weatherData || !weatherData.conditions || weatherData.conditions.length === 0) {
        return 0;
    }

    // Risk is based on average delay factor
    // Multiply by 1.2 to scale it to 0-1 range better
    const baseRisk = Math.min(weatherData.averageDelayFactor || 0, 1);
    
    // Check for extreme conditions (fog, heavy rain, heavy snow, thunderstorm)
    const hasExtreme = weatherData.conditions.some(c => 
        c.code === 45 || c.code === 48 || c.code === 65 || c.code === 75 || c.code === 95
    );

    return hasExtreme ? Math.min(baseRisk * 1.5, 1) : baseRisk;
};

// Get alternative routes/suppliers based on weather
const getAlternativeSuppliers = async (primarySupplierId, affectedLocations) => {
    try {
        // This would query the database for alternative suppliers
        // For now, return a suggestion
        return {
            recommendation: 'Check alternative suppliers with better weather conditions',
            alternatives: []
        };
    } catch (error) {
        console.error('Error getting alternatives:', error.message);
        return { alternatives: [], error: true };
    }
};

// Predict delivery delays in days based on weather
const predictDelayDays = (weatherData) => {
    if (!weatherData || !weatherData.conditions) return 0;

    const delayRisk = calculateDelayRisk(weatherData);
    
    // Estimate 1-5 days delay based on risk level
    if (delayRisk < 0.2) return 0;
    if (delayRisk < 0.4) return 1;
    if (delayRisk < 0.6) return 2;
    if (delayRisk < 0.8) return 3;
    return 5;
};

// Get weather impact on all active orders
const checkAllWeatherImpacts = async (suppliers) => {
    const impacts = [];

    for (const supplier of suppliers) {
        if (supplier.latitude && supplier.longitude) {
            const weather = await getFogForecast(supplier.latitude, supplier.longitude);
            const delayRisk = calculateDelayRisk(weather);

            if (delayRisk > 0.3) {
                impacts.push({
                    supplier: supplier.name,
                    location: supplier.location,
                    delayRiskPercentage: delayRisk * 100,
                    estimatedDelay: predictDelayDays(weather),
                    conditions: weather.conditions
                });
            }
        }
    }

    return impacts;
};

module.exports = {
    getFogForecast,
    calculateDelayRisk,
    getAlternativeSuppliers,
    predictDelayDays,
    checkAllWeatherImpacts,
    SUPPLIER_LOCATIONS,
    WEATHER_CODES
};
