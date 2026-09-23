/**
 * Decision-First 16 Global Destinations Dataset
 * Strictly adheres to §5 and §12 of the Product Specification.
 * Every score, cost breakdown, and itinerary day traces directly to verified schema data.
 */

export const DESTINATIONS = [
  {
    id: 'kyoto-japan',
    name: 'Kyoto',
    country: 'Japan',
    continent: 'Asia',
    region: 'Kansai Region, Honshu Island',
    coordinates: [35.0116, 135.7681],
    tagline: 'Ancient imperial capital of tranquil bamboo groves, wooden temples, and zen gardens.',
    description: 'Kyoto was Japan’s imperial capital for over a thousand years. It holds thousands of classical Buddhist temples, gardens, imperial palaces, and traditional wooden machiya houses.',
    costTier: {
      dailyBudget: 110,
      currency: 'USD'
    },
    dailyCostUSD: 110, // Backwards compatibility helper
    budgetBreakdown: {
      accommodationPerDay: 50,
      foodPerDay: 28,
      localTransportPerDay: 12,
      activitiesPerDay: 14,
      otherPerDay: 6
    },
    minDays: 3,
    maxRecommendedDays: 7,
    travelerFit: ['solo', 'couple', 'friends', 'family'],
    bestSeasons: ['spring', 'autumn'],
    shoulderSeasons: ['winter'],
    styleScores: {
      culture: 98,
      nature: 60,
      adventure: 30,
      nightlife: 42,
      food: 92,
      relaxation: 68
    },
    tradeOffs: {
      whyItFits: [
        'World-class historic preservation with 17 UNESCO World Heritage sites.',
        'Extremely walkable historic districts with efficient public bus & subway network.',
        'Exceptional culinary scene spanning Michelin kaiseki to casual ramen.'
      ],
      tradeOffs: [
        'Significant tourist crowding at Fushimi Inari and Arashiyama during peak cherry blossom & autumn foliage.',
        'Traditional ryokan accommodation fills up months in advance.',
        'Subway coverage is more limited than Tokyo, requiring reliance on city buses.'
      ]
    },
    notIncluded: ['flights', 'visa fees', 'travel insurance', 'shopping / souvenirs'],
    itineraryTemplate: [
      { day: 1, category: 'Landmark / Orientation', activities: ['Dawn hike through 10,000 vermilion torii gates at Fushimi Inari', 'Afternoon walk through historic Gion preservation district', 'Evening stroll along the Shirakawa canal'] },
      { day: 2, category: 'Deep Culture / History', activities: ['Morning stroll through Arashiyama bamboo forest', 'Explore Tenryu-ji landscape garden', 'Visit the shimmering Golden Pavilion (Kinkaku-ji)'] },
      { day: 3, category: 'Food & Local Markets', activities: ['Browse Nishiki Market street food stalls', 'Sample traditional matcha parfait and warabimochi', 'Sunset view over Kyoto from Kiyomizu-dera wooden terrace'] }
    ],
    extendedActivities: [
      { day: 4, category: 'Nature / Scenery', activities: ['Walk the scenic Philosopher’s Walk path along the canal', 'Explore the moss gardens of Ginkaku-ji (Silver Pavilion)', 'Tea ceremony in an authentic machiya townhouse'] },
      { day: 5, category: 'Day Trip / Regional Excursion', activities: ['Day trip to Nara to feed sacred wild sika deer in Nara Park', 'Tour Todai-ji temple housing the colossal Great Bronze Buddha', 'Explore ancient Kasuga Taisha shrine'] },
      { day: 6, category: 'Leisure & Hidden Gems', activities: ['Hike the quiet woodland trails of Kurama to Kibune mountain villages', 'Traditional riverside kawadoko dining in summer', 'Soak in a local Kurama onsen bath'] },
      { day: 7, category: 'Flexible Exploration & Seasonal Highlights', activities: ['Sake brewery tour and tasting in Fushimi Sake District', 'Visit Sanjusangendo temple with 1,001 carved Kannon statues', 'Souvenir shopping for Uji matcha and Kiyomizu ceramics'] }
    ],
    seasonalWeather: {
      tempC: 18,
      condition: 'Usually mild and clear',
      weatherCode: 1,
      typicalDescription: 'Spring cherry blossoms (15-20°C) or crisp autumn foliage (14-19°C).'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80',
      photographer: 'Su San Lee',
      source: 'Unsplash',
      license: 'Unsplash License (Free to use)'
    }
  },
  {
    id: 'bali-indonesia',
    name: 'Bali',
    country: 'Indonesia',
    continent: 'Asia',
    region: 'Lesser Sunda Islands, Indian Ocean',
    coordinates: [-8.3405, 115.0920],
    tagline: 'Island of the Gods featuring terraced rice fields, vibrant coral reefs, and cliffside temples.',
    description: 'Bali is Indonesia’s premier cultural and tropical haven, celebrated for its ornate Hindu temples, lush jungle ravines around Ubud, world-class surf breaks, and warm hospitality.',
    costTier: {
      dailyBudget: 45,
      currency: 'USD'
    },
    dailyCostUSD: 45,
    budgetBreakdown: {
      accommodationPerDay: 20,
      foodPerDay: 12,
      localTransportPerDay: 6,
      activitiesPerDay: 5,
      otherPerDay: 2
    },
    minDays: 4,
    maxRecommendedDays: 10,
    travelerFit: ['solo', 'couple', 'friends', 'family'],
    bestSeasons: ['spring', 'summer'],
    shoulderSeasons: ['autumn'],
    styleScores: {
      culture: 84,
      nature: 88,
      adventure: 82,
      nightlife: 78,
      food: 80,
      relaxation: 94
    },
    tradeOffs: {
      whyItFits: [
        'Extraordinary value for money across villa rentals, dining, and spa treatments.',
        'Diverse mix of surfing, tropical jungles, volcanic hiking, and spiritual retreats.',
        'Warm, welcoming local culture with active ceremonies and artistic traditions.'
      ],
      tradeOffs: [
        'Heavy vehicular traffic between Seminyak, Canggu, and Ubud can extend travel times.',
        'Rainy season (November–March) brings high humidity and tropical downpours.',
        'Popular tourist beaches can suffer from plastic debris and aggressive touts.'
      ]
    },
    notIncluded: ['flights', 'visa fees', 'travel insurance', 'shopping / souvenirs'],
    itineraryTemplate: [
      { day: 1, category: 'Landmark / Orientation', activities: ['Check into boutique villa in Ubud', 'Walk through the Sacred Monkey Forest sanctuary', 'Evening traditional Balinese Legong dance performance'] },
      { day: 2, category: 'Nature / Scenery', activities: ['Dawn walk through Tegallalang emerald rice terraces', 'Artisan woodcarving workshop in Mas village', 'Blessing ritual and holy dip at Tirta Empul water temple'] },
      { day: 3, category: 'Food & Local Markets', activities: ['Morning market tour in Ubud followed by authentic cooking class', 'Afternoon herbal tea tasting overlooking Campuhan Ridge', 'Sunset dinner in organic farm-to-table restaurant'] }
    ],
    extendedActivities: [
      { day: 4, category: 'Adventure & Active', activities: ['Early 2 AM wake-up for sunrise hike up Mount Batur caldera', 'Breakfast cooked by volcanic steam at the summit', 'Recovery soak in natural hot springs overlooking Lake Batur'] },
      { day: 5, category: 'Day Trip / Regional Excursion', activities: ['Fast boat to Nusa Penida island', 'Marvel at the dramatic T-Rex shaped Kelingking cliff beach', 'Snorkel with giant manta rays in Crystal Bay'] },
      { day: 6, category: 'Beach & Coastal Leisure', activities: ['Relocate to southern peninsula (Uluwatu or Canggu)', 'Surf lesson or beach relaxation at Padang Padang', 'Perched cliffside sunset cocktails overlooking the Indian Ocean'] },
      { day: 7, category: 'Flexible Exploration & Seasonal Highlights', activities: ['Sunset visit to Uluwatu sea temple on 70-meter cliffs', 'Watch the open-air Kecak and fire dance performance', 'Seafood barbecue dinner right on the sand at Jimbaran Bay'] }
    ],
    seasonalWeather: {
      tempC: 28,
      condition: 'Warm and tropical',
      weatherCode: 2,
      typicalDescription: 'Tropical warmth (26-30°C) with dry sunny days during peak season.'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
      photographer: 'Oliver Sjöström',
      source: 'Unsplash',
      license: 'Unsplash License (Free to use)'
    }
  },
  {
    id: 'hoi-an-vietnam',
    name: 'Hoi An',
    country: 'Vietnam',
    continent: 'Asia',
    region: 'Quang Nam Province, Central Coast',
    coordinates: [15.8801, 108.3380],
    tagline: 'Enchanting UNESCO ancient town glowing with silk lanterns, vibrant markets, and timeless canals.',
    description: 'A remarkably preserved 15th- to 19th-century international trading port. The streets are pedestrian-only in the evenings, illuminated by thousands of colorful silk lanterns reflecting off the Thu Bon River.',
    costTier: {
      dailyBudget: 35,
      currency: 'USD'
    },
    dailyCostUSD: 35,
    budgetBreakdown: {
      accommodationPerDay: 16,
      foodPerDay: 10,
      localTransportPerDay: 4,
      activitiesPerDay: 3,
      otherPerDay: 2
    },
    minDays: 2,
    maxRecommendedDays: 5,
    travelerFit: ['solo', 'couple', 'friends', 'family'],
    bestSeasons: ['spring', 'summer'],
    shoulderSeasons: ['autumn'],
    styleScores: {
      culture: 92,
      nature: 52,
      adventure: 45,
      nightlife: 58,
      food: 95,
      relaxation: 88
    },
    tradeOffs: {
      whyItFits: [
        'One of Southeast Asia’s most affordable yet picturesque cultural destinations.',
        'World-famous gastronomy (Cao Lau, Banh Mi, White Rose dumplings) for just $2–$4/meal.',
        'Flat, bicycle-friendly streets connecting ancient town to nearby An Bang beach.'
      ],
      tradeOffs: [
        'Can flood during monsoon storms in October and November.',
        'High density of souvenir shops and aggressive tailor shop marketing.',
        'Small core ancient area can feel crowded on weekend nights.'
      ]
    },
    notIncluded: ['flights', 'visa fees', 'travel insurance', 'custom clothing tailoring'],
    itineraryTemplate: [
      { day: 1, category: 'Landmark / Orientation', activities: ['Walking tour of UNESCO Ancient Town and 200-year-old Tan Ky merchant house', 'Cross the iconic 400-year-old Japanese Covered Bridge', 'Night lantern boat ride on the Thu Bon River'] },
      { day: 2, category: 'Food & Local Markets', activities: ['Morning food tour sampling famous Madam Khanh Banh Mi Queen', 'Cooking class including basket boat ride in coconut water palm forest', 'Evening tailors fitting for custom-made linens'] },
      { day: 3, category: 'Nature / Scenery', activities: ['Morning bicycle ride through green rice paddies to Tra Que vegetable village', 'Afternoon beach relaxation at An Bang beach', 'Fresh seafood dinner overlooking the South China Sea'] }
    ],
    extendedActivities: [
      { day: 4, category: 'Day Trip / Regional Excursion', activities: ['Half-day tour to My Son Sanctuary Hindu temple ruins from the Champa Kingdom', 'Return via riverboat cruise along Thu Bon river', 'Evening stroll under illuminated silk lantern bridges'] },
      { day: 5, category: 'Flexible Exploration & Seasonal Highlights', activities: ['Ferry trip to the pristine Cham Islands for snorkeling and corals', 'Browse pottery village of Thanh Ha', 'Sunset riverside cocktails in a French-colonial shophouse'] }
    ],
    seasonalWeather: {
      tempC: 26,
      condition: 'Pleasant and sunny',
      weatherCode: 1,
      typicalDescription: 'Warm, dry sunny days (24-29°C) ideal for cycling.'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1000&q=80',
      photographer: 'Tron Le',
      source: 'Unsplash',
      license: 'Unsplash License (Free to use)'
    }
  },
  {
    id: 'petra-jordan',
    name: 'Petra',
    country: 'Jordan',
    continent: 'Asia',
    region: 'Ma\'an Governorate, Southwestern Desert',
    coordinates: [30.3285, 35.4444],
    tagline: 'The Rose City carved directly into sandstone cliffs by the ancient Nabataeans.',
    description: 'One of the New Seven Wonders of the World, Petra was the bustling hub of the Nabataean spice trade. Entered through a narrow 1.2-kilometer gorge called the Siq, it reveals colossal carved facades.',
    costTier: {
      dailyBudget: 105,
      currency: 'USD'
    },
    dailyCostUSD: 105,
    budgetBreakdown: {
      accommodationPerDay: 48,
      foodPerDay: 24,
      localTransportPerDay: 10,
      activitiesPerDay: 18,
      otherPerDay: 5
    },
    minDays: 2,
    maxRecommendedDays: 4,
    travelerFit: ['solo', 'couple', 'friends'],
    bestSeasons: ['spring', 'autumn'],
    shoulderSeasons: ['winter'],
    styleScores: {
      culture: 96,
      nature: 72,
      adventure: 90,
      nightlife: 20,
      food: 74,
      relaxation: 38
    },
    tradeOffs: {
      whyItFits: [
        'Unrivaled ancient archaeological wonder carved into raw canyon stone.',
        'Spectacular desert hiking routes with stunning panoramic canyon views.',
        'Warm Bedouin hospitality and flavorful Levant culinary tradition.'
      ],
      tradeOffs: [
        'Extensive daily walking required (15,000–25,000 steps on steep, rocky trails).',
        'Entry ticket to Petra is among the world’s most expensive ($70+ per day).',
        'Summer temperatures frequently exceed 38°C with virtually no shade.'
      ]
    },
    notIncluded: ['flights', 'Jordan visa', 'Jordan Pass fee', 'donkey/camel rides'],
    itineraryTemplate: [
      { day: 1, category: 'Landmark / Orientation', activities: ['Walk through the 1.2km towering sandstone canyon of the Siq', 'Behold the dramatic first reveal of Al-Khazneh (The Treasury)', 'Explore the Street of Facades, Roman Theater, and Royal Tombs'] },
      { day: 2, category: 'Adventure & Active', activities: ['Challenging climb up 850 rock-cut steps to the monumental Ad-Deir Monastery', 'Panoramic tea break overlooking the vast Wadi Araba desert', 'Hike up to the High Place of Sacrifice for sunset views'] },
      { day: 3, category: 'Deep Culture / History', activities: ['Excursion to Siq al-Barid (Little Petra) to see ancient painted frescoes', 'Visit Bedouin camps for spiced cardamom coffee and stories', 'Petra by Night candlelit walk in front of the illuminated Treasury'] }
    ],
    extendedActivities: [
      { day: 4, category: 'Day Trip / Regional Excursion', activities: ['Combined 4x4 desert safari tour into nearby Wadi Rum (Valley of the Moon)', 'Sleep under the stars in a luxury Bedouin dome camp', 'Traditional Zarb subterranean barbecue dinner'] }
    ],
    seasonalWeather: {
      tempC: 21,
      condition: 'Sunny and dry',
      weatherCode: 0,
      typicalDescription: 'Clear desert skies (18-24°C) with comfortable day hiking conditions.'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1579606032822-0a4e37fc2806?auto=format&fit=crop&w=1000&q=80',
      photographer: 'Brian Kairuz',
      source: 'Unsplash',
      license: 'Unsplash License (Free to use)'
    }
  },
  {
    id: 'santorini-greece',
    name: 'Santorini',
    country: 'Greece',
    continent: 'Europe',
    region: 'Cyclades Islands, Aegean Sea',
    coordinates: [36.3932, 25.4615],
    tagline: 'Whitewashed villages and cobalt blue domes perched along volcanic cliffs high above the Aegean.',
    description: 'Formed by one of the largest volcanic eruptions in human history, Santorini features sheer caldera cliffs, striking volcanic beaches, and legendary golden sunsets over Oia.',
    costTier: {
      dailyBudget: 195,
      currency: 'USD'
    },
    dailyCostUSD: 195,
    budgetBreakdown: {
      accommodationPerDay: 110,
      foodPerDay: 48,
      localTransportPerDay: 14,
      activitiesPerDay: 18,
      otherPerDay: 5
    },
    minDays: 3,
    maxRecommendedDays: 6,
    travelerFit: ['couple', 'friends', 'solo'],
    bestSeasons: ['spring', 'summer', 'autumn'],
    shoulderSeasons: ['autumn'],
    styleScores: {
      culture: 78,
      nature: 84,
      adventure: 50,
      nightlife: 72,
      food: 88,
      relaxation: 92
    },
    tradeOffs: {
      whyItFits: [
        'Arguably the world’s most iconic romantic clifftop vistas and sunset views.',
        'Unique volcanic terroir yielding prized Assyrtiko dry white wines.',
        'High-end caldera infinity pools and luxury cave hotels.'
      ],
      tradeOffs: [
        'High peak-season prices for hotels and caldera-view restaurants.',
        'Oia becomes packed shoulder-to-shoulder at sunset from cruise ship tours.',
        'Volcanic beaches have pebbly black/red sand that gets scorching hot in midday sun.'
      ]
    },
    notIncluded: ['flights', 'ferry tickets', 'travel insurance', 'private sunset catamaran charters'],
    itineraryTemplate: [
      { day: 1, category: 'Landmark / Orientation', activities: ['Scenic 10km caldera rim walk from Fira to Oia', 'Stroll marble-paved alleys lined with blue-domed churches', 'Reserve sunset viewpoint overlooking Oia castle ruins'] },
      { day: 2, category: 'Nature / Scenery', activities: ['Catamaran cruise across the submerged volcanic caldera', 'Swim in geothermal hot springs near volcanic Nea Kameni', 'Barbecue lunch on board anchored near the Red Beach'] },
      { day: 3, category: 'Food & Local Markets', activities: ['Tour the preserved Minoan Bronze Age ruins of Akrotiri', 'Visit an underground volcanic wine cellar for Assyrtiko wine tasting', 'Relax at the black sand beach of Perissa with grilled octopus'] }
    ],
    extendedActivities: [
      { day: 4, category: 'Day Trip / Regional Excursion', activities: ['Hike up to the highest point of the island at Profitis Ilias monastery', 'Explore the authentic medieval inland village of Pyrgos', 'Dinner in a non-touristy taverna in Megalochori'] },
      { day: 5, category: 'Flexible Exploration & Seasonal Highlights', activities: ['Take a traditional wooden caique boat to Thirassia island', 'Climb the steps of Ammoudi Bay for cliff jumping and fresh lobster', 'Evening rooftop cinema experience in Kamari'] }
    ],
    seasonalWeather: {
      tempC: 24,
      condition: 'Sunny and breezy',
      weatherCode: 0,
      typicalDescription: 'Mediterranean sunshine (22-28°C) with dry Aegean sea breezes.'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1000&q=80',
      photographer: 'Heidi Kaden',
      source: 'Unsplash',
      license: 'Unsplash License (Free to use)'
    }
  },
  {
    id: 'swiss-alps-switzerland',
    name: 'Swiss Alps',
    country: 'Switzerland',
    continent: 'Europe',
    region: 'Lauterbrunnen Valley, Bernese Oberland',
    coordinates: [46.5600, 7.9000],
    tagline: 'Majestic jagged peaks, 72 glacial waterfalls, and emerald alpine meadows.',
    description: 'The Lauterbrunnen valley, set against the colossal peaks of the Eiger, Mönch, and Jungfrau, is famous for cascading waterfalls, traditional wooden chalets, and cogwheel mountain railways.',
    costTier: {
      dailyBudget: 230,
      currency: 'USD'
    },
    dailyCostUSD: 230,
    budgetBreakdown: {
      accommodationPerDay: 125,
      foodPerDay: 55,
      localTransportPerDay: 30,
      activitiesPerDay: 15,
      otherPerDay: 5
    },
    minDays: 3,
    maxRecommendedDays: 8,
    travelerFit: ['couple', 'family', 'friends', 'solo'],
    bestSeasons: ['summer', 'winter'],
    shoulderSeasons: ['autumn'],
    styleScores: {
      culture: 70,
      nature: 98,
      adventure: 92,
      nightlife: 30,
      food: 76,
      relaxation: 85
    },
    tradeOffs: {
      whyItFits: [
        'Pristine storybook landscapes with highest level of transit infrastructure in the world.',
        'World-class hiking in summer and alpine skiing/snowboarding in winter.',
        'Car-free mountaintop villages like Mürren and Wengen offering absolute peace.'
      ],
      tradeOffs: [
        'One of the most expensive destinations in Europe (mountain cable cars add up rapidly).',
        'Weather can be unpredictable in high altitudes; mountain summits can be clouded over.',
        'Quiet nightlife; most restaurants and shops close early in alpine villages.'
      ]
    },
    notIncluded: ['flights', 'Swiss Travel Pass', 'ski gear rental', 'travel insurance'],
    itineraryTemplate: [
      { day: 1, category: 'Landmark / Orientation', activities: ['Walk beneath the 300m misting cascade of Staubbach Falls', 'Explore Trümmelbach glacial waterfalls inside the mountain caves', 'Cable car up to the car-free cliffside village of Gimmelwald'] },
      { day: 2, category: 'Adventure & Active', activities: ['Ride the Eiger Express gondola to Jungfraujoch (3,454m)', 'Walk through the carved Ice Palace tunnels beneath the glacier', 'Panoramic terrace views over the colossal Aletsch Glacier'] },
      { day: 3, category: 'Nature / Scenery', activities: ['Hike the scenic alpine flower trail from Mürren to Allmendhubel', 'Scenic steamboat cruise on turquoise Lake Brienz', 'Traditional Swiss cheese fondue dinner in Interlaken'] }
    ],
    extendedActivities: [
      { day: 4, category: 'Day Trip / Regional Excursion', activities: ['Excursion to Grindelwald First for the thrilling Cliff Walk suspended bridge', 'Ride the First Glider zipline down the mountain valley', 'Hike to the mirror reflections of Lake Bachalpsee'] },
      { day: 5, category: 'Flexible Exploration & Seasonal Highlights', activities: ['Panoramic mountain cogwheel train to Schynige Platte', 'Visit the Swiss Alpine Garden with over 650 native flower species', 'Stroll through the woodcarving village of Brienz'] }
    ],
    seasonalWeather: {
      tempC: 17,
      condition: 'Crisp alpine air',
      weatherCode: 1,
      typicalDescription: 'Summer alpine warmth (15-22°C) or snowy winter (-3 to 4°C).'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80',
      photographer: 'Dino Reichmuth',
      source: 'Unsplash',
      license: 'Unsplash License (Free to use)'
    }
  },
  {
    id: 'rome-italy',
    name: 'Rome',
    country: 'Italy',
    continent: 'Europe',
    region: 'Lazio Region, Central Italy',
    coordinates: [41.9028, 12.4964],
    tagline: 'The Eternal City where ancient amphitheaters, renaissance plazas, and lively trattorias intersect.',
    description: 'An open-air living museum spanning almost 3,000 years of globally influential art, architecture, and culture. Rome is home to the Colosseum, the Pantheon, and the Vatican City.',
    costTier: {
      dailyBudget: 130,
      currency: 'USD'
    },
    dailyCostUSD: 130,
    budgetBreakdown: {
      accommodationPerDay: 68,
      foodPerDay: 36,
      localTransportPerDay: 8,
      activitiesPerDay: 14,
      otherPerDay: 4
    },
    minDays: 3,
    maxRecommendedDays: 6,
    travelerFit: ['solo', 'couple', 'family', 'friends'],
    bestSeasons: ['spring', 'autumn'],
    shoulderSeasons: ['winter'],
    styleScores: {
      culture: 99,
      nature: 42,
      adventure: 35,
      nightlife: 75,
      food: 96,
      relaxation: 52
    },
    tradeOffs: {
      whyItFits: [
        'Unsurpassed concentration of Western art, history, and classical antiquity.',
        'Sensational, accessible food culture from crispy Roman pizza to creamy Carbonara.',
        'Atmospheric cobblestone neighborhoods that come alive after dark.'
      ],
      tradeOffs: [
        'Heavy crowds year-round; tickets for Colosseum and Vatican must be pre-booked.',
        'Summer (July–August) is stiflingly hot with temperatures often topping 36°C.',
        'Cobblestone streets (Sanpietrini) can be tiring on feet and luggage.'
      ]
    },
    notIncluded: ['flights', 'city tourist tax (€4-7/night)', 'travel insurance', 'shopping'],
    itineraryTemplate: [
      { day: 1, category: 'Landmark / Orientation', activities: ['Walk the historic arena floor of the Colosseum', 'Explore the Roman Forum and emperors’ palaces on Palatine Hill', 'Evening gelato walk past the illuminated Trevi Fountain'] },
      { day: 2, category: 'Deep Culture / History', activities: ['Marvel at Michelangelo’s ceiling in the Sistine Chapel', 'Tour the expansive classical galleries of the Vatican Museums', 'Stand under the dome of St. Peter’s Basilica'] },
      { day: 3, category: 'Food & Local Markets', activities: ['Step inside the 2,000-year-old oculus of the Pantheon', 'Browse morning market stalls at Campo de\' Fiori', 'Traditional pasta feast in the cobblestone Trastevere district'] }
    ],
    extendedActivities: [
      { day: 4, category: 'Nature / Scenery', activities: ['Rent a bicycle to explore the monumental Appian Way (Via Appia Antica)', 'Tour the underground Catacombs of San Callisto', 'Afternoon walk through the gardens of Villa Borghese'] },
      { day: 5, category: 'Day Trip / Regional Excursion', activities: ['Day trip to Tivoli to visit Emperor Hadrian’s Villa and Villa d’Este waterfalls', 'Wine tasting tour in the Castelli Romani hill towns', 'Sunset view over Rome from the Gianicolo terrace'] }
    ],
    seasonalWeather: {
      tempC: 20,
      condition: 'Sunny and mild',
      weatherCode: 1,
      typicalDescription: 'Warm, pleasant Mediterranean conditions (18-23°C).'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80',
      photographer: 'David Cohen',
      source: 'Unsplash',
      license: 'Unsplash License (Free to use)'
    }
  },
  {
    id: 'reykjavik-iceland',
    name: 'Reykjavik',
    country: 'Iceland',
    continent: 'Europe',
    region: 'Capital Region & Golden Circle Route',
    coordinates: [64.1466, -21.9426],
    tagline: 'Gateway to erupting geysers, glaciers, black sand shores, and the dancing Northern Lights.',
    description: 'The world’s northernmost capital combines vibrant Nordic design and warm geothermal public pools with immediate access to Iceland’s raw volcanic landscapes and dramatic aurora displays.',
    costTier: {
      dailyBudget: 185,
      currency: 'USD'
    },
    dailyCostUSD: 185,
    budgetBreakdown: {
      accommodationPerDay: 95,
      foodPerDay: 48,
      localTransportPerDay: 20,
      activitiesPerDay: 17,
      otherPerDay: 5
    },
    minDays: 3,
    maxRecommendedDays: 7,
    travelerFit: ['couple', 'friends', 'solo'],
    bestSeasons: ['winter', 'summer'],
    shoulderSeasons: ['autumn'],
    styleScores: {
      culture: 72,
      nature: 97,
      adventure: 94,
      nightlife: 68,
      food: 75,
      relaxation: 82
    },
    tradeOffs: {
      whyItFits: [
        'Dramatic unearthly scenery (volcanoes, geysers, glaciers, black sand beaches).',
        'Top global destination for viewing the Aurora Borealis in winter.',
        'Extremely safe, clean, and geothermal bath culture.'
      ],
      tradeOffs: [
        'Expensive food and alcohol prices due to high import taxes.',
        'Winter brings severe cold, icy roads, and only 4 hours of daylight.',
        'A rental car or guided tour is mandatory to explore beyond the capital.'
      ]
    },
    notIncluded: ['flights', 'car rental / fuel', 'Blue Lagoon entry ticket', 'travel insurance'],
    itineraryTemplate: [
      { day: 1, category: 'Landmark / Orientation', activities: ['Ascend Hallgrimskirkja tower for 360-degree city views', 'Stroll the colorful houses on Laugavegur street', 'Relax in mineral-rich silica waters at the Blue Lagoon'] },
      { day: 2, category: 'Nature / Scenery', activities: ['Watch the Strokkur geyser erupt 30 meters into the air', 'Feel the roar of the two-tiered Gullfoss waterfall', 'Walk between the Eurasian and North American tectonic plates at Thingvellir'] },
      { day: 3, category: 'Adventure & Active', activities: ['Walk behind Seljalandsfoss waterfall sheet', 'Admire the basalt sea stacks at Reynisfjara black sand beach', 'Nighttime guided tour to view the Aurora Borealis'] }
    ],
    extendedActivities: [
      { day: 4, category: 'Day Trip / Regional Excursion', activities: ['Glacier hike on Solheimajokull with crampons and ice axes', 'Visit Skogafoss waterfall and traditional turf roof museum', 'Seafood dinner in the fishing port of Grindavik'] },
      { day: 5, category: 'Flexible Exploration & Seasonal Highlights', activities: ['Snaefellsnes Peninsula day tour around the Kirkjufell arrowhead mountain', 'Explore Vatnshellir lava tube cave', 'Whale watching boat tour from Reykjavik Old Harbour'] }
    ],
    seasonalWeather: {
      tempC: 7,
      condition: 'Cool and atmospheric',
      weatherCode: 3,
      typicalDescription: 'Cool summer midnight sun (10-14°C) or crisp winter aurora nights (-2 to 4°C).'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80',
      photographer: 'Mahlke Jon',
      source: 'Unsplash',
      license: 'Unsplash License (Free to use)'
    }
  },
  {
    id: 'banff-canada',
    name: 'Banff National Park',
    country: 'Canada',
    continent: 'Americas',
    region: 'Alberta, Canadian Rocky Mountains',
    coordinates: [51.1784, -115.5708],
    tagline: 'Turquoise glacier-fed lakes encircled by soaring Canadian Rocky peaks and pine forests.',
    description: 'Canada’s first national park encompasses 6,641 square kilometers of breathtaking mountain terrain, alpine meadows, wildlife habitats, and the world-famous turquoise waters of Lake Louise and Moraine Lake.',
    costTier: {
      dailyBudget: 145,
      currency: 'USD'
    },
    dailyCostUSD: 145,
    budgetBreakdown: {
      accommodationPerDay: 75,
      foodPerDay: 38,
      localTransportPerDay: 16,
      activitiesPerDay: 12,
      otherPerDay: 4
    },
    minDays: 3,
    maxRecommendedDays: 7,
    travelerFit: ['family', 'couple', 'friends', 'solo'],
    bestSeasons: ['summer', 'autumn', 'winter'],
    shoulderSeasons: ['spring'],
    styleScores: {
      culture: 45,
      nature: 99,
      adventure: 91,
      nightlife: 40,
      food: 72,
      relaxation: 80
    },
    tradeOffs: {
      whyItFits: [
        'Arguably the most breathtaking glacial turquoise lakes in the Western Hemisphere.',
        'Abundant wildlife sightings (elk, bighorn sheep, grizzly bears).',
        'Year-round destination with hiking/canoeing in summer and world-class skiing in winter.'
      ],
      tradeOffs: [
        'Moraine Lake road is closed to personal vehicles, requiring pre-booked park shuttles.',
        'High summer hotel rates in Banff and Lake Louise townships.',
        'Winter temperatures can drop below -20°C requiring serious alpine gear.'
      ]
    },
    notIncluded: ['flights', 'Parks Canada Discovery Pass', 'rental vehicle', 'canoe rental fees'],
    itineraryTemplate: [
      { day: 1, category: 'Landmark / Orientation', activities: ['Sunrise over the vibrant turquoise waters of Moraine Lake', 'Canoeing across Lake Louise surrounded by glaciers', 'Hike up to the historic Lake Agnes Teahouse'] },
      { day: 2, category: 'Adventure & Active', activities: ['Ride the Banff Gondola to the summit boardwalk of Sulphur Mountain', 'Soak in the historic Banff Upper Hot Springs', 'Evening wildlife spotting drive along Minnewanka loop'] },
      { day: 3, category: 'Nature / Scenery', activities: ['Drive the spectacular Icefields Parkway', 'Walk up to the toe of Athabasca Glacier', 'Hike Johnston Canyon cat-walks through limestone gorges'] }
    ],
    extendedActivities: [
      { day: 4, category: 'Day Trip / Regional Excursion', activities: ['Excursion across Kicking Horse Pass into Yoho National Park', 'Visit Emerald Lake and the natural rock bridge over Kicking Horse River', 'See the roaring 254-meter Takakkaw Falls'] },
      { day: 5, category: 'Flexible Exploration & Seasonal Highlights', activities: ['Hike the Sentinel Pass trail through Larch Valley', 'Stand-up paddleboarding on Two Jack Lake', 'Elk steak and local craft beer dinner in downtown Banff'] }
    ],
    seasonalWeather: {
      tempC: 16,
      condition: 'Fresh mountain breeze',
      weatherCode: 1,
      typicalDescription: 'Sunny summer mountain days (14-22°C) or alpine snow in winter.'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1000&q=80',
      photographer: 'Kalep Tapp',
      source: 'Unsplash',
      license: 'Unsplash License (Free to use)'
    }
  },
  {
    id: 'cusco-peru',
    name: 'Cusco',
    country: 'Peru',
    continent: 'Americas',
    region: 'Cusco Region, Peruvian Andes',
    coordinates: [-13.5319, -71.9675],
    tagline: 'Historic Incan capital and sacred gateway to the mystical citadel of Machu Picchu.',
    description: 'Set high in the Andes mountains at 3,400 meters elevation, Cusco was the capital of the Inca Empire. Colonial churches stand on Incan megalithic stone foundations, serving as the launching pad for the Sacred Valley.',
    costTier: {
      dailyBudget: 50,
      currency: 'USD'
    },
    dailyCostUSD: 50,
    budgetBreakdown: {
      accommodationPerDay: 22,
      foodPerDay: 14,
      localTransportPerDay: 6,
      activitiesPerDay: 6,
      otherPerDay: 2
    },
    minDays: 3,
    maxRecommendedDays: 6,
    travelerFit: ['solo', 'friends', 'couple'],
    bestSeasons: ['spring', 'summer', 'autumn'],
    shoulderSeasons: ['winter'],
    styleScores: {
      culture: 97,
      nature: 88,
      adventure: 93,
      nightlife: 62,
      food: 85,
      relaxation: 45
    },
    tradeOffs: {
      whyItFits: [
        'Bucket-list ancient wonder (Machu Picchu) accessible by train or classic trekking.',
        'Extremely budget-friendly food, lodging, and guided tours.',
        'Sensational Peruvian gastronomy (ceviche, lomo saltado, artisanal cacao).'
      ],
      tradeOffs: [
        'High altitude (3,400m) can cause altitude sickness (soroche) for the first 24–48 hours.',
        'Train tickets to Aguas Calientes and Machu Picchu entrance tickets are strictly capped.',
        'Rainy season (January–March) can cause landslides along mountain roads.'
      ]
    },
    notIncluded: ['flights', 'Machu Picchu train & ticket', 'Boleto Turistico pass', 'travel insurance'],
    itineraryTemplate: [
      { day: 1, category: 'Landmark / Orientation', activities: ['Acclimatize with a slow walk through Plaza de Armas and San Pedro Market', 'Explore the massive interlocking stones of Sacsayhuamán', 'Evening coca tea in the bohemian artisan neighborhood of San Blas'] },
      { day: 2, category: 'Deep Culture / History', activities: ['Full-day tour through the Sacred Valley of the Incas', 'Explore the living Inca town and fortress of Ollantaytambo', 'Scenic Vistadome train ride toward Aguas Calientes'] },
      { day: 3, category: 'Adventure & Active', activities: ['Dawn entrance into the cloud-shrouded citadel of Machu Picchu', 'Guided tour of the Sun Temple and Intihuatana astronomical stone', 'Optional hike up Huayna Picchu peak for breathtaking aerial views'] }
    ],
    extendedActivities: [
      { day: 4, category: 'Day Trip / Regional Excursion', activities: ['Early morning trek to the vibrant striped mineral slopes of Rainbow Mountain (Vinicunca at 5,200m)', 'Stop at Checacupe colonial rope bridge', 'Return to Cusco for Andean lomo saltado dinner'] },
      { day: 5, category: 'Flexible Exploration & Seasonal Highlights', activities: ['Tour the concentric circular agricultural terraces of Moray', 'Walk among 3,000 terraced hillside salt pans at Maras', 'Artisan weaving demonstration in Chinchero'] }
    ],
    seasonalWeather: {
      tempC: 15,
      condition: 'Sunny and dry',
      weatherCode: 0,
      typicalDescription: 'Dry mountain season (13-18°C) with intense Andean daytime sunshine.'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1000&q=80',
      photographer: 'Willian Justen de Vasconcellos',
      source: 'Unsplash',
      license: 'Unsplash License (Free to use)'
    }
  },
  {
    id: 'new-york-usa',
    name: 'New York City',
    country: 'United States',
    continent: 'Americas',
    region: 'New York State, Mid-Atlantic Coast',
    coordinates: [40.7128, -74.0060],
    tagline: 'The vibrant metropolis that never sleeps, filled with iconic architecture, Broadway, and global dining.',
    description: 'One of the world’s major commercial, financial, and cultural centers. Comprising 5 boroughs, NYC features legendary landmarks like the Statue of Liberty, Central Park, and the Empire State Building.',
    costTier: {
      dailyBudget: 240,
      currency: 'USD'
    },
    dailyCostUSD: 240,
    budgetBreakdown: {
      accommodationPerDay: 135,
      foodPerDay: 58,
      localTransportPerDay: 12,
      activitiesPerDay: 25,
      otherPerDay: 10
    },
    minDays: 3,
    maxRecommendedDays: 7,
    travelerFit: ['solo', 'couple', 'friends', 'family'],
    bestSeasons: ['spring', 'autumn'],
    shoulderSeasons: ['summer', 'winter'],
    styleScores: {
      culture: 98,
      nature: 40,
      adventure: 45,
      nightlife: 99,
      food: 98,
      relaxation: 30
    },
    tradeOffs: {
      whyItFits: [
        'World-leading museum collections (Met, MoMA) and Broadway theatrical performances.',
        'Incomparable 24/7 food diversity from \$1.50 dollar slices to three-star Michelin dining.',
        'Extensive 24-hour subway system reaching all 5 boroughs.'
      ],
      tradeOffs: [
        'Extremely high lodging costs and mandatory hotel facility fees.',
        'Fast-paced, sensory-overload environment with high noise levels.',
        'Sales tax and mandatory 18–22% tipping culture significantly increase dining costs.'
      ]
    },
    notIncluded: ['flights', 'ESTA / US visa', 'tips & gratuities (18-20%)', 'shopping'],
    itineraryTemplate: [
      { day: 1, category: 'Landmark / Orientation', activities: ['Morning walk through Central Park’s Bethesda Terrace and Bow Bridge', 'Visit the Museum of Modern Art (MoMA)', 'Evening Broadway theater production in Times Square'] },
      { day: 2, category: 'Deep Culture / History', activities: ['Walk the elevated park of The High Line above Chelsea', 'Sample gourmet bites at Chelsea Market', 'Sunset views across New York Harbor from Battery Park'] },
      { day: 3, category: 'Food & Local Markets', activities: ['Walk across the Brooklyn Bridge from Manhattan to DUMBO', 'Enjoy wood-fired pizza under the bridge with Manhattan skyline views', 'Nighttime observation deck experience at Summit One Vanderbilt'] }
    ],
    extendedActivities: [
      { day: 4, category: 'Nature / Scenery', activities: ['Ferry to Governors Island for bicycle rentals and harbor views', 'Visit the 9/11 Memorial and Oculus transit hub', 'Explore Greenwich Village jazz clubs and comedy cellar'] },
      { day: 5, category: 'Flexible Exploration & Seasonal Highlights', activities: ['Spend the morning exploring The Metropolitan Museum of Art (The Met)', 'Browse designer thrift shops in SoHo and Nolita', 'Rooftop cocktail lounge overlooking the Empire State Building'] }
    ],
    seasonalWeather: {
      tempC: 19,
      condition: 'Mild and pleasant',
      weatherCode: 1,
      typicalDescription: 'Pleasant spring/autumn temperatures (15-22°C).'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1000&q=80',
      photographer: 'Alexander Rotker',
      source: 'Unsplash',
      license: 'Unsplash License (Free to use)'
    }
  },
  {
    id: 'costa-rica',
    name: 'Costa Rica',
    country: 'Costa Rica',
    continent: 'Americas',
    region: 'Arenal & Manuel Antonio Rainforests',
    coordinates: [10.4678, -84.7036],
    tagline: 'Pura Vida paradise of steaming volcanoes, misty cloud forests, and biodiversity-rich beaches.',
    description: 'A global leader in eco-tourism and wildlife preservation. Costa Rica holds 5% of the world’s biodiversity, offering canopy ziplines, geothermal hot springs, and rainforest hikes filled with toucans and sloths.',
    costTier: {
      dailyBudget: 90,
      currency: 'USD'
    },
    dailyCostUSD: 90,
    budgetBreakdown: {
      accommodationPerDay: 44,
      foodPerDay: 24,
      localTransportPerDay: 10,
      activitiesPerDay: 10,
      otherPerDay: 2
    },
    minDays: 4,
    maxRecommendedDays: 8,
    travelerFit: ['family', 'couple', 'friends', 'solo'],
    bestSeasons: ['winter', 'spring'],
    shoulderSeasons: ['summer'],
    styleScores: {
      culture: 55,
      nature: 99,
      adventure: 96,
      nightlife: 45,
      food: 70,
      relaxation: 88
    },
    tradeOffs: {
      whyItFits: [
        'World’s premier destination for eco-tourism, wildlife spotting, and adventure sports.',
        'Lush geothermal hot spring rivers naturally heated by Arenal volcano.',
        'Warm, safe, and peaceful country with well-protected national parks.'
      ],
      tradeOffs: [
        'More expensive than neighboring Central American countries.',
        'Winding mountain roads and unpaved sections often require a 4WD vehicle.',
        'Rainy green season (May–November) can bring heavy afternoon downpours.'
      ]
    },
    notIncluded: ['flights', 'national park entrance fees', 'car rental / insurance', 'tips'],
    itineraryTemplate: [
      { day: 1, category: 'Landmark / Orientation', activities: ['Hike across ancient lava flows in Arenal Volcano National Park', 'Walk the suspended hanging bridges high in the rainforest canopy', 'Soak in volcanic thermal river pools at Tabacón'] },
      { day: 2, category: 'Adventure & Active', activities: ['Guided wildlife walk to spot howler monkeys, sloths, and toucans', 'Exhilarating canopy zipline across the cloud forest valley', 'Night tour to observe nocturnal tree frogs and insects'] },
      { day: 3, category: 'Nature / Scenery', activities: ['Trek the coastal trails of Manuel Antonio National Park', 'Swim in calm turquoise coves surrounded by tropical palms', 'Catamaran sunset tour with dolphin watching'] }
    ],
    extendedActivities: [
      { day: 4, category: 'Day Trip / Regional Excursion', activities: ['Class III-IV whitewater rafting excursion on the scenic Pacuare River', 'Riverside jungle lunch and waterfall canyon swim', 'Visit an organic fair-trade coffee and cacao plantation'] },
      { day: 5, category: 'Flexible Exploration & Seasonal Highlights', activities: ['Surf lessons at the Pacific break of Jaco or Tamarindo', 'Sea turtle nesting night tour (seasonal)', 'Beachfront seafood dinner enjoying the sunset over the Pacific'] }
    ],
    seasonalWeather: {
      tempC: 27,
      condition: 'Tropical and lush',
      weatherCode: 2,
      typicalDescription: 'Tropical sunny warmth (25-30°C) with refreshing afternoon showers.'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1518182170546-07661fd94144?auto=format&fit=crop&w=1000&q=80',
      photographer: 'Etienne Delorieux',
      source: 'Unsplash',
      license: 'Unsplash License (Free to use)'
    }
  },
  {
    id: 'cape-town-south-africa',
    name: 'Cape Town',
    country: 'South Africa',
    continent: 'Africa',
    region: 'Western Cape Province, Atlantic Seaboard',
    coordinates: [-33.9249, 18.4241],
    tagline: 'Where dramatic flat-topped mountains meet two roaring oceans, vineyards, and penguin colonies.',
    description: 'One of the world’s most spectacularly situated coastal cities, overlooked by the iconic flat summit of Table Mountain, bordered by white Atlantic sand beaches and historic Cape Dutch wine valleys.',
    costTier: {
      dailyBudget: 65,
      currency: 'USD'
    },
    dailyCostUSD: 65,
    budgetBreakdown: {
      accommodationPerDay: 30,
      foodPerDay: 18,
      localTransportPerDay: 8,
      activitiesPerDay: 7,
      otherPerDay: 2
    },
    minDays: 4,
    maxRecommendedDays: 7,
    travelerFit: ['solo', 'couple', 'friends', 'family'],
    bestSeasons: ['spring', 'summer'],
    shoulderSeasons: ['autumn'],
    styleScores: {
      culture: 82,
      nature: 94,
      adventure: 88,
      nightlife: 76,
      food: 89,
      relaxation: 84
    },
    tradeOffs: {
      whyItFits: [
        'Spectacular convergence of ocean, mountain peaks, and world-class wine country.',
        'Remarkable currency value for international travelers (dining and wine are very affordable).',
        'Unique wildlife encounters including African penguins and great white shark diving.'
      ],
      tradeOffs: [
        'Urban safety requires vigilance; avoiding walking alone at night outside tourist zones.',
        'Strong summer southeaster wind ("Cape Doctor") can temporarily close Table Mountain cableway.',
        'Atlantic ocean water temperatures are chilly (13–16°C) even in midsummer.'
      ]
    },
    notIncluded: ['flights', 'travel insurance', 'Table Mountain cableway pass', 'wine estate purchases'],
    itineraryTemplate: [
      { day: 1, category: 'Landmark / Orientation', activities: ['Ascend Table Mountain via rotating aerial cableway', 'Explore the colorful pastel houses of Bo-Kaap', 'Evening seafood dining along the lively V&A Waterfront'] },
      { day: 2, category: 'Nature / Scenery', activities: ['Drive the spectacular cliffside highway of Chapman’s Peak', 'Walk among wild African penguins at Boulders Beach', 'Funicular ride up to the historic lighthouse at Cape Point'] },
      { day: 3, category: 'Food & Local Markets', activities: ['Walk the treetop canopy walkway at Kirstenbosch Botanical Gardens', 'Tasting tour of South Africa’s oldest wine estates in Constantia', 'Sunset cocktails overlooking Camps Bay beach'] }
    ],
    extendedActivities: [
      { day: 4, category: 'Day Trip / Regional Excursion', activities: ['Full-day excursion to the historic Cape Winelands of Stellenbosch and Franschhoek', 'Hop-on hop-off Franschhoek Wine Tram experience', 'Artisanal cheese and chocolate pairing lunch'] },
      { day: 5, category: 'Adventure & Active', activities: ['Sunrise hike up Lion’s Head peak for panoramic 360-degree city views', 'Tandem paragliding landing on the Sea Point promenade', 'Visit Robben Island historic prison museum'] }
    ],
    seasonalWeather: {
      tempC: 23,
      condition: 'Breezy and bright',
      weatherCode: 1,
      typicalDescription: 'Sunny Mediterranean summer (21-27°C) with refreshing ocean breezes.'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1000&q=80',
      photographer: 'Jean van der Meulen',
      source: 'Unsplash',
      license: 'Unsplash License (Free to use)'
    }
  },
  {
    id: 'marrakech-morocco',
    name: 'Marrakech',
    country: 'Morocco',
    continent: 'Africa',
    region: 'Marrakech-Safi Region, Atlas Foothills',
    coordinates: [31.6295, -7.9811],
    tagline: 'The Red City of sensory spice souks, palatial courtyards, and bustling desert squares.',
    description: 'An intoxicating former imperial city in western Morocco. Its historic fortified medina is a labyrinth of bustling alleyways where traditional artisans hammer brass, weave carpets, and grind fragrant spices.',
    costTier: {
      dailyBudget: 55,
      currency: 'USD'
    },
    dailyCostUSD: 55,
    budgetBreakdown: {
      accommodationPerDay: 26,
      foodPerDay: 15,
      localTransportPerDay: 5,
      activitiesPerDay: 7,
      otherPerDay: 2
    },
    minDays: 3,
    maxRecommendedDays: 5,
    travelerFit: ['couple', 'friends', 'solo'],
    bestSeasons: ['spring', 'autumn'],
    shoulderSeasons: ['winter'],
    styleScores: {
      culture: 95,
      nature: 50,
      adventure: 75,
      nightlife: 60,
      food: 88,
      relaxation: 74
    },
    tradeOffs: {
      whyItFits: [
        'Vibrant exotic sensory immersion with riad courtyard architecture and eucalyptus hammams.',
        'High value for money on boutique lodging, leather craftsmanship, and spiced cuisine.',
        'Close gateway for day trips into the High Atlas mountains and Agafay stone desert.'
      ],
      tradeOffs: [
        'Medina alleyways can be overwhelming with aggressive vendor haggling and motorbike traffic.',
        'Summer temperatures frequently soar above 40°C in July and August.',
        'Navigation without GPS in the labyrinthine souks is challenging.'
      ]
    },
    notIncluded: ['flights', 'riad tourist tax', 'tips & baggage porters', 'carpet purchases'],
    itineraryTemplate: [
      { day: 1, category: 'Landmark / Orientation', activities: ['Navigate the artisan souks for leather and brass lanterns', 'Admire the intricate zellij tilework of Ben Youssef Madrasa', 'Sunset rooftop mint tea overlooking performers in Jemaa el-Fnaa'] },
      { day: 2, category: 'Deep Culture / History', activities: ['Tour the ornate 19th-century courtyards of Bahia Palace', 'Stroll through the electric cobalt-blue Jardin Majorelle', 'Visit the Yves Saint Laurent fashion museum'] },
      { day: 3, category: 'Food & Local Markets', activities: ['Traditional Moroccan cooking workshop preparing chicken tagine with preserved lemons', 'Relaxing eucalyptus steam bath at a heritage hammam', 'Evening street food tasting in the lively main square'] }
    ],
    extendedActivities: [
      { day: 4, category: 'Day Trip / Regional Excursion', activities: ['Excursion into the High Atlas Mountains and Ourika Valley', 'Visit Berber mountain villages and terraced walnut orchards', 'Camel trek through the desert palms of the Palmeraie'] }
    ],
    seasonalWeather: {
      tempC: 23,
      condition: 'Warm and sunny',
      weatherCode: 0,
      typicalDescription: 'Sunny dry days (20-26°C) with pleasant breezes off the Atlas peaks.'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1000&q=80',
      photographer: 'Annie Spratt',
      source: 'Unsplash',
      license: 'Unsplash License (Free to use)'
    }
  },
  {
    id: 'queenstown-new-zealand',
    name: 'Queenstown',
    country: 'New Zealand',
    continent: 'Oceania',
    region: 'Otago Region, South Island',
    coordinates: [-45.0312, 168.6626],
    tagline: 'The adventure capital of the world set on crystal Lake Wakatipu against The Remarkables.',
    description: 'Renowned worldwide for alpine adventure sports, Queenstown sits on the shores of Lake Wakatipu against the dramatic Remarkables mountain range, serving as the gateway to the majestic Milford Sound fjord.',
    costTier: {
      dailyBudget: 135,
      currency: 'USD'
    },
    dailyCostUSD: 135,
    budgetBreakdown: {
      accommodationPerDay: 68,
      foodPerDay: 35,
      localTransportPerDay: 14,
      activitiesPerDay: 14,
      otherPerDay: 4
    },
    minDays: 3,
    maxRecommendedDays: 7,
    travelerFit: ['friends', 'couple', 'solo', 'family'],
    bestSeasons: ['summer', 'winter'],
    shoulderSeasons: ['autumn'],
    styleScores: {
      culture: 50,
      nature: 97,
      adventure: 99,
      nightlife: 78,
      food: 80,
      relaxation: 75
    },
    tradeOffs: {
      whyItFits: [
        'Global capital of adrenaline sports (bungy jumping, canyon jet boating, skydiving).',
        'Direct access to Fiordland National Park and majestic Milford Sound.',
        'Lively, youthful backpacker and ski town atmosphere with excellent craft breweries.'
      ],
      tradeOffs: [
        'Adventure sports are expensive ($150–$350 per activity).',
        'Milford Sound is a 4-hour scenic drive each way from Queenstown.',
        'Accommodation books out early during winter ski season and peak summer holidays.'
      ]
    },
    notIncluded: ['flights', 'adventure sport bookings', 'Milford Sound cruise', 'travel insurance'],
    itineraryTemplate: [
      { day: 1, category: 'Landmark / Orientation', activities: ['Ride the Skyline Gondola for panoramic views of Lake Wakatipu', 'Race down the downhill gravity luge track', 'High-speed jet boat ride through the narrow Shotover River canyons'] },
      { day: 2, category: 'Nature / Scenery', activities: ['Full-day scenic drive through Fiordland National Park', 'Catamaran cruise under towering Mitre Peak and sheer waterfalls', 'Spot fur seals and dolphins playing in the fjord waters'] },
      { day: 3, category: 'Food & Local Markets', activities: ['Walk the historic autumn tree-lined streets of Arrowtown', 'Bicycle wine tour tasting Pinot Noir in Gibbston Valley', 'Iconic Fergburger dinner on the lakefront pier'] }
    ],
    extendedActivities: [
      { day: 4, category: 'Adventure & Active', activities: ['Tandem skydive or bungy jump at Kawarau Bridge (the world’s first commercial bungy)', 'Scenic drive along the cliffside road to Glenorchy', 'Lord of the Rings filming location walk through Paradise valley'] },
      { day: 5, category: 'Flexible Exploration & Seasonal Highlights', activities: ['Cruise on the historic 1912 TSS Earnslaw vintage steamship', 'Gourmet barbecue lunch at Walter Peak High Country Farm', 'Soak in private cedar hot tubs at Onsen Hot Pools overlooking Shotover River'] }
    ],
    seasonalWeather: {
      tempC: 18,
      condition: 'Crisp alpine air',
      weatherCode: 1,
      typicalDescription: 'Bright summer lake weather (16-22°C) or winter ski season (2-8°C).'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1000&q=80',
      photographer: 'Tobias Keller',
      source: 'Unsplash',
      license: 'Unsplash License (Free to use)'
    }
  },
  {
    id: 'sydney-australia',
    name: 'Sydney',
    country: 'Australia',
    continent: 'Oceania',
    region: 'New South Wales, East Coast Harbor',
    coordinates: [-33.8688, 151.2093],
    tagline: 'Sun-drenched harbor city famous for its sail-like Opera House, iconic bridge, and golden surf beaches.',
    description: 'Australia’s largest city wraps around one of the world’s grandest natural harbors. It blends vibrant cosmopolitan dining and arts with an effortless outdoor lifestyle anchored by Bondi and Manly beaches.',
    costTier: {
      dailyBudget: 140,
      currency: 'USD'
    },
    dailyCostUSD: 140,
    budgetBreakdown: {
      accommodationPerDay: 72,
      foodPerDay: 38,
      localTransportPerDay: 12,
      activitiesPerDay: 14,
      otherPerDay: 4
    },
    minDays: 3,
    maxRecommendedDays: 7,
    travelerFit: ['solo', 'couple', 'family', 'friends'],
    bestSeasons: ['spring', 'summer', 'autumn'],
    shoulderSeasons: ['winter'],
    styleScores: {
      culture: 88,
      nature: 85,
      adventure: 80,
      nightlife: 82,
      food: 92,
      relaxation: 80
    },
    tradeOffs: {
      whyItFits: [
        'World’s most iconic harbor setting with scenic public ferry transit system.',
        'Superb urban ocean beaches with coastal walking tracks and ocean pools.',
        'Dynamic multi-cultural dining scene from Asian night markets to harborfront seafood.'
      ],
      tradeOffs: [
        'Long travel distance and significant jet lag from the Northern Hemisphere.',
        'Sprawling geography; traveling between western suburbs, harbor, and beaches takes time.',
        'Strong ocean rips on open surf beaches require swimming strictly between red-and-yellow flags.'
      ]
    },
    notIncluded: ['flights', 'Australian visa / ETA', 'BridgeClimb ticket', 'travel insurance'],
    itineraryTemplate: [
      { day: 1, category: 'Landmark / Orientation', activities: ['Guided architectural walk around the Sydney Opera House sails', 'Walk across the Sydney Harbour Bridge for panoramic harbor views', 'Browse weekend artisan stalls in the historic cobblestone Rocks district'] },
      { day: 2, category: 'Nature / Scenery', activities: ['Take a morning surf lesson at world-famous Bondi Beach', 'Scenic 6km clifftop coastal walk from Bondi to Coogee', 'Swim in the iconic ocean pool at Bondi Icebergs'] },
      { day: 3, category: 'Food & Local Markets', activities: ['Catch the classic green-and-yellow ferry across the harbor to Manly', 'Snorkel with marine life in the sheltered waters of Shelly Beach', 'Sunset harbor sailing dinner cruise'] }
    ],
    extendedActivities: [
      { day: 4, category: 'Day Trip / Regional Excursion', activities: ['Day trip to the Blue Mountains to see the Three Sisters sandstone formation', 'Ride the Scenic World glass-floor railway down into ancient rainforest', 'Hike along Wentworth Falls cliff paths'] },
      { day: 5, category: 'Flexible Exploration & Seasonal Highlights', activities: ['Explore the Royal Botanic Garden and Mrs Macquarie’s Chair', 'Browse contemporary exhibits at the Museum of Contemporary Art (MCA)', 'Cocktails at an open-air rooftop bar in Barangaroo'] }
    ],
    seasonalWeather: {
      tempC: 22,
      condition: 'Warm and breezy',
      weatherCode: 1,
      typicalDescription: 'Sunny coastal warmth (20-26°C) with pleasant water temperatures.'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1000&q=80',
      photographer: 'Dan Freeman',
      source: 'Unsplash',
      license: 'Unsplash License (Free to use)'
    }
  }
];
