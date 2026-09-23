/**
 * Application Configuration & Constants
 * Travel Destination Explorer
 */

export const APP_CONFIG = {
  APP_NAME: 'Travel Destination Explorer',
  STORAGE_KEY: 'travelExplorer:v1',
  SCHEMA_VERSION: 1,
  
  // Weather Service configuration
  WEATHER: {
    API_BASE_URL: 'https://api.open-meteo.com/v1/forecast',
    REQUEST_TIMEOUT_MS: 5000,
    CACHE_TTL_MS: 30 * 60 * 1000, // 30 minutes
  },

  // Map Service configuration
  MAP: {
    DEFAULT_CENTER: [20.0, 0.0],
    DEFAULT_ZOOM: 2,
    MAX_ZOOM: 18,
    INIT_TIMEOUT_MS: 4000,
    TILE_LAYER_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    TILE_ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
  },

  // Fixed Reference Currency Exchange Rates (Base: USD = 1.00)
  // Explicitly labeled as fixed reference rates for estimations, not live forex rates.
  CURRENCIES: {
    USD: { symbol: '$', rate: 1.00, name: 'US Dollar', format: 'en-US' },
    EUR: { symbol: '€', rate: 0.92, name: 'Euro', format: 'de-DE' },
    GBP: { symbol: '£', rate: 0.79, name: 'British Pound', format: 'en-GB' },
    JPY: { symbol: '¥', rate: 155.0, name: 'Japanese Yen', format: 'ja-JP' },
    INR: { symbol: '₹', rate: 83.50, name: 'Indian Rupee', format: 'en-IN' }
  },

  // Travel Style Cost Multipliers
  TRAVEL_STYLES: {
    budget: { multiplier: 1.0, label: 'Budget (Backpacker / Hostels / Local transit)' },
    comfort: { multiplier: 1.6, label: 'Comfort (Mid-range hotels / Mix of dining)' },
    luxury: { multiplier: 2.8, label: 'Luxury (4-5 star resorts / Private tours)' }
  },

  // Limits and Bounds
  BOUNDS: {
    MIN_DAYS: 1,
    MAX_DAYS: 60,
    DEFAULT_DAYS: 5,
    MIN_TRAVELERS: 1,
    MAX_TRAVELERS: 20,
    DEFAULT_TRAVELERS: 2,
    MAX_SEARCH_LENGTH: 60,
    MAX_NOTE_LENGTH: 500
  },

  // Logging Configuration
  LOG_LEVEL: 'INFO' // 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'NONE'
};
