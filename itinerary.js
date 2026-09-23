/**
 * Adaptive Itinerary Generator
 * Strictly implements §12.2 of the Product Specification.
 * Pure deterministic generator that scales cleanly from 1 to 15+ days
 * using verified destination data and deterministic category sequencing.
 */

const DEFAULT_CATEGORY_CYCLE = [
  'Landmark / Orientation',
  'Deep Culture / History',
  'Nature / Scenery',
  'Food & Local Markets',
  'Day Trip / Regional Excursion',
  'Leisure & Hidden Gems',
  'Flexible Exploration & Seasonal Highlights'
];

export const ItineraryGenerator = {
  /**
   * Generates a deterministic day-by-day itinerary tailored to the requested trip length.
   * @param {Object} destination Destination record with itineraryTemplate and extendedActivities
   * @param {number} requestedDays Integer >= 1
   * @returns {Array<Object>} Array of day plans
   */
  generateItinerary(destination, requestedDays = 5) {
    const days = Math.max(1, Math.min(30, parseInt(requestedDays, 10) || 5));
    const baseTemplate = Array.isArray(destination?.itineraryTemplate) ? destination.itineraryTemplate : [];
    const extended = Array.isArray(destination?.extendedActivities) ? destination.extendedActivities : [];
    
    // Combine base and extended pools
    const pool = [...baseTemplate, ...extended];
    const itinerary = [];

    for (let d = 1; d <= days; d++) {
      if (d <= pool.length) {
        // Use verified day from pool
        const item = pool[d - 1];
        itinerary.push({
          day: d,
          category: item.category || this._getCategoryForDay(d),
          title: item.title || `${item.category || this._getCategoryForDay(d)} in ${destination.name}`,
          activities: [...item.activities]
        });
      } else {
        // Beyond curated pool: cycle category deterministically
        const category = this._getCategoryForDay(d);
        itinerary.push({
          day: d,
          category: category,
          title: `${category} in ${destination.name}`,
          activities: [
            `Self-guided exploration of ${destination.name}'s local artisan neighborhoods`,
            `Visit seasonal viewpoints and scenic cafes overlooking ${destination.region || destination.name}`,
            `Relaxed dining sampling regional delicacies recommended by locals`
          ]
        });
      }
    }

    return itinerary;
  },

  _getCategoryForDay(dayNumber) {
    const index = (dayNumber - 1) % DEFAULT_CATEGORY_CYCLE.length;
    return DEFAULT_CATEGORY_CYCLE[index];
  }
};
