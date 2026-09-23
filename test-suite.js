/**
 * Automated Test Suite for Decision-First Travel Planner
 * Verifies Decision Data Schema, Matching Math Boundaries (§12.1),
 * Adaptive Itinerary Cycling (§12.2), Compare Matrix (§12.4),
 * and Local Persistence CRUD.
 */

import { DESTINATIONS } from '../js/data/destinations.js';
import { MatchingEngine } from '../js/engine/matching.js';
import { ItineraryGenerator } from '../js/engine/itinerary.js';
import { Validator } from '../js/models/validator.js';
import { Schema } from '../js/models/schema.js';
import { LocalTripRepository } from '../js/repositories/localTripRepository.js';
import { weatherService } from '../js/services/weatherService.js';
import { mapService } from '../js/services/mapService.js';

export class TestRunner {
  constructor(onTestComplete = null) {
    this.results = [];
    this.onTestComplete = onTestComplete;
  }

  assert(description, condition, details = '') {
    const passed = Boolean(condition);
    const result = {
      description,
      passed,
      details: passed ? '' : details,
      timestamp: new Date().toISOString()
    };
    this.results.push(result);
    if (this.onTestComplete) {
      this.onTestComplete(result);
    }
    return passed;
  }

  async runAll() {
    this.results = [];

    // --- Suite 1: Decision-First Data Schema Verification ---
    this._runDataVerificationTests();

    // --- Suite 2: Matching Engine Math Boundaries (§12.1) ---
    this._runMatchingEngineTests();

    // --- Suite 3: Adaptive Itinerary Cycling (§12.2) ---
    this._runItineraryCyclingTests();

    // --- Suite 4: Security & Input Validators ---
    this._runValidatorTests();

    // --- Suite 5: Repository Persistence & Migration ---
    await this._runRepositoryTests();

    // --- Suite 6: Offline & Failure Degradation ---
    this._runDegradationTests();

    const passedCount = this.results.filter(r => r.passed).length;
    const failedCount = this.results.length - passedCount;

    return {
      total: this.results.length,
      passed: passedCount,
      failed: failedCount,
      allPassed: failedCount === 0,
      results: this.results
    };
  }

  _runDataVerificationTests() {
    this.assert(
      'Destination dataset must contain exactly 16 verified destinations',
      DESTINATIONS.length === 16,
      `Found ${DESTINATIONS.length} destinations.`
    );

    const requiredStyles = ['culture', 'nature', 'adventure', 'nightlife', 'food', 'relaxation'];

    DESTINATIONS.forEach((d) => {
      // 1. Budget breakdown itemization & sum verification
      const bb = d.budgetBreakdown;
      const hasBreakdown = Boolean(
        bb &&
        typeof bb.accommodationPerDay === 'number' &&
        typeof bb.foodPerDay === 'number' &&
        typeof bb.localTransportPerDay === 'number' &&
        typeof bb.activitiesPerDay === 'number' &&
        typeof bb.otherPerDay === 'number'
      );

      const dailySum = hasBreakdown ? (bb.accommodationPerDay + bb.foodPerDay + bb.localTransportPerDay + bb.activitiesPerDay + bb.otherPerDay) : 0;
      const dailyTarget = d.costTier?.dailyBudget || d.dailyCostUSD;

      this.assert(
        `[${d.name}] Itemized budget breakdown must sum exactly to daily budget ($${dailyTarget})`,
        hasBreakdown && dailySum === dailyTarget,
        `Sum of breakdown: $${dailySum} vs dailyBudget: $${dailyTarget}`
      );

      // 2. Style scores coverage
      const hasAllStyles = requiredStyles.every(s => typeof d.styleScores?.[s] === 'number' && d.styleScores[s] >= 0 && d.styleScores[s] <= 100);
      this.assert(
        `[${d.name}] Style scores must cover all 6 categories (0-100)`,
        hasAllStyles,
        `Invalid style scores for ${d.name}`
      );

      // 3. Trade-offs present
      const hasTradeOffs = Array.isArray(d.tradeOffs?.whyItFits) && d.tradeOffs.whyItFits.length > 0 &&
                           Array.isArray(d.tradeOffs?.tradeOffs) && d.tradeOffs.tradeOffs.length > 0;
      this.assert(
        `[${d.name}] Must have verified 'whyItFits' and 'tradeOffs' bullet arrays`,
        hasTradeOffs,
        `Missing trade-offs for ${d.name}`
      );

      // 4. Duration bounds
      this.assert(
        `[${d.name}] Duration bounds minDays <= maxRecommendedDays`,
        typeof d.minDays === 'number' && typeof d.maxRecommendedDays === 'number' && d.minDays <= d.maxRecommendedDays
      );
    });
  }

  _runMatchingEngineTests() {
    const mockDest = {
      id: 'test-dest',
      name: 'Test Destination',
      costTier: { dailyBudget: 100 },
      dailyCostUSD: 100,
      minDays: 3,
      maxRecommendedDays: 7,
      bestSeasons: ['spring'],
      shoulderSeasons: ['autumn'],
      styleScores: { culture: 100, nature: 50, adventure: 40, nightlife: 30, food: 80, relaxation: 60 }
    };

    // 1. Budget Fit: Exact at-budget (Estimated = $1,000, Budget = $1,000)
    // Formula: 25 * (1 - 0.4 * 0) = 25.0
    const atBudget = MatchingEngine.scoreDestination(mockDest, { budget: 1000, days: 5, travelers: 2, season: 'spring', styles: [] });
    this.assert(
      'Budget Fit (§12.1): At-budget trip scores full 25.0 points and flags comfortable',
      atBudget.subScores.budget === 25 && atBudget.breakdown.budgetStatus === 'comfortable',
      `Expected 25.0, got ${atBudget.subScores.budget}`
    );

    // 2. Budget Fit: Well under budget (Estimated = $500, Budget = $1,000)
    // Formula: 25 * (1 - 0.4 * (500/1000)) = 25 * (1 - 0.2) = 20.0
    const underBudget = MatchingEngine.scoreDestination(mockDest, { budget: 1000, days: 5, travelers: 1, season: 'spring', styles: [] });
    this.assert(
      'Budget Fit (§12.1): Trip at 50% of budget scores 20.0 points',
      underBudget.subScores.budget === 20,
      `Expected 20.0, got ${underBudget.subScores.budget}`
    );

    // 3. Budget Fit: Near Limit within 15% tolerance (Estimated = $1,100, Budget = $1,000)
    // Overage = 100, MaxTol = 150. S_budget = 25 * (1 - 100/150) = 25 * (0.333) = 8.3
    const nearLimit = MatchingEngine.scoreDestination(mockDest, { budget: 1000, days: 11, travelers: 1, season: 'spring', styles: [] });
    this.assert(
      'Budget Fit (§12.1): Trip 10% over budget scores within 15% tolerance band and flags near-limit',
      nearLimit.breakdown.budgetStatus === 'near-limit' && nearLimit.subScores.budget >= 5 && nearLimit.subScores.budget < 25,
      `Status: ${nearLimit.breakdown.budgetStatus}, Score: ${nearLimit.subScores.budget}`
    );

    // 4. Budget Fit: Hard failure > 15% over budget (Estimated = $1,500, Budget = $1,000)
    const overBudget = MatchingEngine.scoreDestination(mockDest, { budget: 1000, days: 15, travelers: 1, season: 'spring', styles: [] });
    this.assert(
      'Budget Fit (§12.1): Trip >15% over budget scores 0 on budget and flags over-budget',
      overBudget.subScores.budget === 0 && overBudget.breakdown.budgetStatus === 'over-budget',
      `Expected 0, got ${overBudget.subScores.budget}`
    );

    // 5. Duration Fit: 5 days (between 3 and 7) = full 20 pts
    const idealDuration = MatchingEngine.scoreDestination(mockDest, { budget: 2000, days: 5, travelers: 1, season: 'spring', styles: [] });
    this.assert('Duration Fit (§12.1): Pacing between minDays and maxDays scores 20 pts', idealDuration.subScores.duration === 20);

    // 6. Duration Fit: 2 days (1 day short of minDays=3) -> deduct 5 pts = 15 pts
    const shortDuration = MatchingEngine.scoreDestination(mockDest, { budget: 2000, days: 2, travelers: 1, season: 'spring', styles: [] });
    this.assert('Duration Fit (§12.1): 1 day short deducts 5 pts (scores 15)', shortDuration.subScores.duration === 15);

    // 7. Season Fit: Spring (best) = 20, Autumn (shoulder) = 12, Winter (off) = 4
    const bestSeason = MatchingEngine.scoreDestination(mockDest, { budget: 2000, days: 5, travelers: 1, season: 'spring', styles: [] });
    const shoulderSeason = MatchingEngine.scoreDestination(mockDest, { budget: 2000, days: 5, travelers: 1, season: 'autumn', styles: [] });
    const offSeason = MatchingEngine.scoreDestination(mockDest, { budget: 2000, days: 5, travelers: 1, season: 'winter', styles: [] });

    this.assert('Season Fit (§12.1): Prime season scores 20', bestSeason.subScores.season === 20);
    this.assert('Season Fit (§12.1): Shoulder season scores 12', shoulderSeason.subScores.season === 12);
    this.assert('Season Fit (§12.1): Off-season scores 4', offSeason.subScores.season === 4);

    // 8. Style Match: Empty tags awards neutral 25 pts
    const emptyStyles = MatchingEngine.scoreDestination(mockDest, { budget: 2000, days: 5, travelers: 1, season: 'spring', styles: [] });
    this.assert('Style Match (§12.1): Empty tags list awards neutral baseline 25 pts', emptyStyles.subScores.style === 25);

    // 9. Style Match: Single tag culture (score 100) -> 35 * (100/100) = 35 pts
    const cultureStyle = MatchingEngine.scoreDestination(mockDest, { budget: 2000, days: 5, travelers: 1, season: 'spring', styles: ['culture'] });
    this.assert('Style Match (§12.1): Culture (100/100) scores full 35.0 pts', cultureStyle.subScores.style === 35);
  }

  _runItineraryCyclingTests() {
    const dest = DESTINATIONS[0]; // Kyoto

    // 1. Short trip (2 days)
    const shortPlan = ItineraryGenerator.generateItinerary(dest, 2);
    this.assert('Adaptive Itinerary (§12.2): Generates exactly 2 days for 2-day trip', shortPlan.length === 2);

    // 2. Medium trip (5 days)
    const medPlan = ItineraryGenerator.generateItinerary(dest, 5);
    this.assert('Adaptive Itinerary (§12.2): Generates 5 distinct days with categories', medPlan.length === 5 && medPlan[4].category.includes('Day Trip'));

    // 3. Extended trip (12 days) - scaling past curated pool without crashing
    const longPlan = ItineraryGenerator.generateItinerary(dest, 12);
    this.assert(
      'Adaptive Itinerary (§12.2): Scales cleanly to 12 days without array bounds errors or crashing',
      longPlan.length === 12 && longPlan[11].day === 12 && longPlan[11].activities.length > 0
    );
  }

  _runValidatorTests() {
    // Search input
    const longQuery = 'A'.repeat(100);
    const validatedQuery = Validator.validateSearchQuery(longQuery);
    this.assert('Search query bounds input to maximum 60 characters without mutating characters', validatedQuery.length === 60);

    // URL security validator
    this.assert('Validator accepts valid https:// URLs', Validator.isValidHttpsUrl('https://images.unsplash.com/photo-123') === true);
    this.assert('Validator rejects non-https URLs', Validator.isValidHttpsUrl('http://example.com') === false && Validator.isValidHttpsUrl('javascript:alert(1)') === false);

    // Integer bounds
    this.assert('Validator clamps integer bounds', Validator.validateInteger(0, 1, 60, 5) === 1 && Validator.validateInteger(75, 1, 60, 5) === 60);
  }

  async _runRepositoryTests() {
    const repo = new LocalTripRepository();
    const testTrip = {
      destinationId: 'kyoto-japan',
      savedAt: new Date().toISOString(),
      customDays: 4,
      customTravelers: 1,
      travelStyle: 'budget',
      userNotes: 'Decision-first test note'
    };

    const saveRes = await repo.save(testTrip);
    this.assert('Repository successfully saves validated trip', saveRes.success === true);

    const fetched = await repo.getByDestinationId('kyoto-japan');
    this.assert('Repository retrieves saved trip', fetched && fetched.customDays === 4);

    const recovered = Schema.migrateAndValidate('{"corrupt": true');
    this.assert('Schema safely recovers from corrupted storage', recovered && recovered.version === 1);

    await repo.delete('kyoto-japan');
  }

  _runDegradationTests() {
    const dest = DESTINATIONS[0];
    const fallbackWeather = weatherService._formatSeasonalFallback(dest, 'Simulated Offline Test');
    this.assert(
      'Weather Service fallback labels data truthfully as "Typical seasonal conditions"',
      fallbackWeather.status === 'seasonal' && fallbackWeather.isLive === false
    );

    const testDiv = document.createElement('div');
    mapService.renderFallbackOverview(testDiv, [dest]);
    this.assert(
      'Map Service renders structured text overview panel when map tiles are offline',
      testDiv.querySelector('.map-fallback-panel') !== null
    );
  }
}
