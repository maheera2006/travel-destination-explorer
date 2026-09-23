/**
 * Resilient Weather Service
 * Connects to Open-Meteo API when online, caches responses with TTL,
 * and truthfully falls back to destination seasonal conditions when offline/failing.
 */

import { APP_CONFIG } from '../config.js';
import { appCache } from './cacheService.js';
import { logger } from './logger.js';

// WMO Weather Interpretation Codes (WW)
const WMO_CODES = {
  0: { label: 'Clear sky', icon: '☀️' },
  1: { label: 'Mainly clear', icon: '🌤️' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Foggy', icon: '🌫️' },
  48: { label: 'Depositing rime fog', icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  53: { label: 'Moderate drizzle', icon: '🌦️' },
  55: { label: 'Dense drizzle', icon: '🌧️' },
  61: { label: 'Slight rain', icon: '🌧️' },
  63: { label: 'Moderate rain', icon: '🌧️' },
  65: { label: 'Heavy rain', icon: '🌧️' },
  71: { label: 'Slight snow fall', icon: '🌨️' },
  73: { label: 'Moderate snow fall', icon: '🌨️' },
  75: { label: 'Heavy snow fall', icon: '❄️' },
  77: { label: 'Snow grains', icon: '❄️' },
  80: { label: 'Slight rain showers', icon: '🌦️' },
  81: { label: 'Moderate rain showers', icon: '🌦️' },
  82: { label: 'Violent rain showers', icon: '⛈️' },
  85: { label: 'Slight snow showers', icon: '🌨️' },
  86: { label: 'Heavy snow showers', icon: '❄️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm with hail', icon: '⛈️' },
  99: { label: 'Heavy thunderstorm with hail', icon: '⛈️' }
};

export class WeatherService {
  /**
   * Retrieves weather for a destination coordinates with multi-tier fallback.
   * @param {Object} destination Destination object with coordinates and seasonalWeather
   * @returns {Promise<Object>} Weather payload with explicit truthful state
   */
  async getWeatherForDestination(destination) {
    if (!destination || !Array.isArray(destination.coordinates) || destination.coordinates.length < 2) {
      return this._formatSeasonalFallback(destination, 'Missing coordinates');
    }

    const [lat, lng] = destination.coordinates;
    const cacheKey = `weather:${lat.toFixed(2)}:${lng.toFixed(2)}`;

    // 1. Check TTL Cache
    const cached = appCache.get(cacheKey);
    if (cached) {
      logger.debug('WeatherService', `Using cached weather for ${destination.name} (${cached.ageMinutes}m old)`);
      return {
        status: 'cached',
        badgeLabel: `Cached weather (${cached.ageMinutes}m ago)`,
        tempC: cached.data.tempC,
        condition: cached.data.condition,
        icon: cached.data.icon,
        isLive: false,
        note: `Data retrieved ${cached.ageMinutes} minutes ago.`
      };
    }

    // 2. Attempt Live Fetch from Open-Meteo
    try {
      const url = `${APP_CONFIG.WEATHER.API_BASE_URL}?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code&timezone=auto`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.WEATHER.REQUEST_TIMEOUT_MS);

      logger.debug('WeatherService', `Fetching live weather for ${destination.name}...`);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Open-Meteo returned HTTP ${response.status}`);
      }

      const json = await response.json();

      // Defensive response schema validation
      if (!json?.current || typeof json.current.temperature_2m !== 'number' || typeof json.current.weather_code !== 'number') {
        throw new Error('Invalid weather response schema from API');
      }

      const tempC = Math.round(json.current.temperature_2m);
      const code = json.current.weather_code;
      const wmoInfo = WMO_CODES[code] ?? { label: 'Variable', icon: '🌤️' };

      const weatherData = {
        tempC,
        condition: wmoInfo.label,
        icon: wmoInfo.icon
      };

      // Store in cache
      appCache.set(cacheKey, weatherData, APP_CONFIG.WEATHER.CACHE_TTL_MS);

      logger.info('WeatherService', `Live weather retrieved for ${destination.name}: ${tempC}°C, ${wmoInfo.label}`);

      return {
        status: 'live',
        badgeLabel: 'Current weather',
        tempC,
        condition: wmoInfo.label,
        icon: wmoInfo.icon,
        isLive: true,
        note: 'Live conditions via Open-Meteo'
      };
    } catch (err) {
      const reason = err.name === 'AbortError' ? 'Request timed out' : err.message;
      logger.warn('WeatherService', `Live weather unavailable for ${destination.name} (${reason}). Using seasonal fallback.`);
      return this._formatSeasonalFallback(destination, reason);
    }
  }

  _formatSeasonalFallback(destination, reason) {
    const seasonal = destination?.seasonalWeather ?? {
      tempC: 20,
      condition: 'Typical seasonal conditions',
      weatherCode: 1,
      typicalDescription: 'Mild conditions typical of this region.'
    };

    const wmoInfo = WMO_CODES[seasonal.weatherCode] ?? { icon: '🌤️' };

    return {
      status: 'seasonal',
      badgeLabel: 'Typical seasonal conditions',
      tempC: seasonal.tempC,
      condition: seasonal.condition,
      icon: wmoInfo.icon,
      isLive: false,
      note: seasonal.typicalDescription || `Offline / seasonal fallback (${reason})`
    };
  }
}

export const weatherService = new WeatherService();
