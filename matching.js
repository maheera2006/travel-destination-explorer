/**
 * Decision-First Deterministic Matching Engine
 * Strictly implements §12.1 of the Product Specification.
 * Pure mathematical scoring function with zero DOM dependencies.
 */

export const MatchingEngine = {
  /**
   * Scores a single destination against user constraints and preferences.
   * @param {Object} destination
   * @param {Object} constraints { budget, days, travelers, season, travelerType, styles }
   * @returns {Object} Score decomposition & breakdown
   */
  scoreDestination(destination, constraints) {
    const userBudget = Math.max(1, Number(constraints.budget) || 1000);
    const days = Math.max(1, Number(constraints.days) || 5);
    const travelers = Math.max(1, Number(constraints.travelers) || 2);
    const season = (constraints.season || 'spring').toLowerCase();
    const travelerType = (constraints.travelerType || 'couple').toLowerCase();
    const selectedStyles = Array.isArray(constraints.styles) ? constraints.styles : [];

    // Daily budget
    const dailyRate = destination.costTier?.dailyBudget || destination.dailyCostUSD || 100;
    const estimatedTotal = dailyRate * days * travelers;

    // ----------------------------------------------------
    // 1. Budget Fit (Max: 25 pts)
    // ----------------------------------------------------
    let budgetScore = 0;
    let budgetStatus = 'comfortable'; // 'comfortable' | 'near-limit' | 'over-budget'

    if (estimatedTotal <= userBudget) {
      // At-budget scores 25; well-under-budget floors at 15
      budgetScore = 25 * (1 - 0.4 * ((userBudget - estimatedTotal) / userBudget));
      budgetStatus = 'comfortable';
    } else if (estimatedTotal <= 1.15 * userBudget) {
      // 15% tolerance band: scores between 5 and 25
      const overage = estimatedTotal - userBudget;
      const maxTolerance = 0.15 * userBudget;
      budgetScore = Math.max(5, 25 * (1 - (overage / maxTolerance)));
      budgetStatus = 'near-limit';
    } else {
      budgetScore = 0;
      budgetStatus = 'over-budget';
    }
    budgetScore = Math.max(0, Math.min(25, budgetScore));

    // ----------------------------------------------------
    // 2. Duration Fit (Max: 20 pts)
    // ----------------------------------------------------
    const minDays = destination.minDays || 3;
    const maxDays = destination.maxRecommendedDays || 7;
    let durationScore = 20;

    if (days >= minDays && days <= maxDays) {
      durationScore = 20;
    } else if (days < minDays) {
      durationScore = 20 - 5 * (minDays - days);
    } else {
      durationScore = 20 - 3 * (days - maxDays);
    }
    durationScore = Math.max(0, Math.min(20, durationScore));

    // ----------------------------------------------------
    // 3. Season Fit (Max: 20 pts)
    // ----------------------------------------------------
    let seasonScore = 4; // Default off-season
    let seasonRating = 'off';

    const best = (destination.bestSeasons || []).map(s => s.toLowerCase());
    const shoulder = (destination.shoulderSeasons || []).map(s => s.toLowerCase());

    if (best.includes(season)) {
      seasonScore = 20;
      seasonRating = 'perfect';
    } else if (shoulder.includes(season)) {
      seasonScore = 12;
      seasonRating = 'shoulder';
    } else {
      seasonScore = 4;
      seasonRating = 'off';
    }

    // ----------------------------------------------------
    // 4. Style Match (Max: 35 pts)
    // ----------------------------------------------------
    let styleScore = 25; // Default neutral baseline when no tags picked
    const availableStyles = destination.styleScores || {};

    if (selectedStyles.length > 0) {
      let sum = 0;
      selectedStyles.forEach(s => {
        sum += (availableStyles[s] ?? 50);
      });
      const avg = sum / selectedStyles.length;
      styleScore = 35 * (avg / 100);
    }
    styleScore = Math.max(0, Math.min(35, styleScore));

    // ----------------------------------------------------
    // Total Match Calculation (0 - 100)
    // ----------------------------------------------------
    const rawTotal = budgetScore + durationScore + seasonScore + styleScore;
    const totalScore = Math.max(0, Math.min(100, Math.round(rawTotal)));

    // Find top strength
    let topStrength = 'Culture';
    let topStrengthScore = -1;
    Object.entries(availableStyles).forEach(([cat, val]) => {
      if (val > topStrengthScore) {
        topStrengthScore = val;
        topStrength = cat.charAt(0).toUpperCase() + cat.slice(1);
      }
    });

    // Generate human summary
    let summaryLine = '';
    if (budgetStatus === 'comfortable' && seasonRating === 'perfect') {
      summaryLine = `Within budget and visiting during prime ${season} weather.`;
    } else if (budgetStatus === 'near-limit') {
      summaryLine = `Strong preference match, but slightly above baseline budget (within 15%).`;
    } else if (budgetStatus === 'over-budget') {
      const overPct = Math.round(((estimatedTotal - userBudget) / userBudget) * 100);
      summaryLine = `Exceeds your budget by roughly ${overPct}% (more than the 15% tolerance).`;
    } else {
      summaryLine = `Good fit for ${days} days with top strength in ${topStrength}.`;
    }

    return {
      destinationId: destination.id,
      destinationName: destination.name,
      totalScore,
      subScores: {
        budget: Math.round(budgetScore * 10) / 10,
        budgetMax: 25,
        duration: Math.round(durationScore * 10) / 10,
        durationMax: 20,
        season: Math.round(seasonScore * 10) / 10,
        seasonMax: 20,
        style: Math.round(styleScore * 10) / 10,
        styleMax: 35
      },
      breakdown: {
        estimatedTotal,
        userBudget,
        remainingBuffer: userBudget - estimatedTotal,
        dailyRate,
        budgetStatus, // 'comfortable' | 'near-limit' | 'over-budget'
        isNearLimit: budgetStatus === 'near-limit',
        isOverBudget: budgetStatus === 'over-budget',
        seasonRating, // 'perfect' | 'shoulder' | 'off'
        durationRating: (days < minDays ? 'short' : (days > maxDays ? 'long' : 'ideal')),
        topStrength,
        summaryLine
      }
    };
  },

  /**
   * Scores and ranks all destinations in descending order of match %.
   */
  rankDestinations(destinations = [], constraints = {}) {
    const scored = destinations.map(dest => {
      const matchData = this.scoreDestination(dest, constraints);
      return {
        ...dest,
        match: matchData
      };
    });

    // Sort descending by total score
    return scored.sort((a, b) => b.match.totalScore - a.match.totalScore);
  }
};
