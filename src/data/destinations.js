// Curated destinations. Each one has rich metadata used across the app.
export const DESTINATIONS = [
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    emoji: '🏝️',
    gradient: 'linear-gradient(135deg, #fde68a 0%, #fb923c 50%, #0f766e 100%)',
    tagline: 'Island of the Gods — temples, surf and emerald rice terraces.',
    description:
      'Bali blends spiritual Hindu culture with surf-soaked beaches, jungle canopies, and a wellness scene that draws travellers from every continent.',
    bestSeason: 'Apr – Oct',
    avgDailyBudget: 70,
    languages: ['Indonesian', 'Balinese'],
    currency: 'IDR',
    interests: ['beach', 'wellness', 'culture', 'nature', 'photography'],
    highlights: ['Ubud', 'Uluwatu', 'Mount Batur', 'Tanah Lot'],
    tips: [
      'Carry small cash for temple donations and rural warungs.',
      'Rent a scooter only if you are confident — traffic can be wild.',
      'Cover shoulders & knees when entering temples.'
    ]
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    region: 'Asia',
    emoji: '🏯',
    gradient: 'linear-gradient(135deg, #fecaca 0%, #f472b6 50%, #7c3aed 100%)',
    tagline: 'Imperial shrines, bamboo groves and centuries-old tea houses.',
    description:
      'Kyoto is a living museum: 1,600+ Buddhist temples, geisha districts, and seasonal cuisine that reads like poetry.',
    bestSeason: 'Mar – May, Oct – Nov',
    avgDailyBudget: 130,
    languages: ['Japanese'],
    currency: 'JPY',
    interests: ['culture', 'food', 'photography', 'nature'],
    highlights: ['Fushimi Inari', 'Arashiyama', 'Gion', 'Kinkaku-ji'],
    tips: [
      'Buy an IC card (ICOCA) for buses and subways.',
      'Avoid weekends at Arashiyama — go at sunrise.',
      'Reserve top kaiseki restaurants weeks ahead.'
    ]
  },
  {
    id: 'iceland',
    name: 'Reykjavik & the South Coast',
    country: 'Iceland',
    region: 'Europe',
    emoji: '❄️',
    gradient: 'linear-gradient(135deg, #bfdbfe 0%, #38bdf8 50%, #1e3a8a 100%)',
    tagline: 'Glaciers, geysers and aurora-lit skies.',
    description:
      'Drive the Ring Road for waterfalls, black-sand beaches, geothermal lagoons and (in winter) the Northern Lights.',
    bestSeason: 'Jun – Aug, Sep – Mar (auroras)',
    avgDailyBudget: 220,
    languages: ['Icelandic', 'English'],
    currency: 'ISK',
    interests: ['adventure', 'nature', 'photography'],
    highlights: ['Blue Lagoon', 'Skógafoss', 'Vík', 'Þingvellir'],
    tips: [
      'Rent a 4×4 if visiting in winter or going off the Ring Road.',
      'Download the Vedur app for storm and aurora alerts.',
      'Tap water is among the cleanest in the world — refill bottles.'
    ]
  },
  {
    id: 'lisbon',
    name: 'Lisbon',
    country: 'Portugal',
    region: 'Europe',
    emoji: '🚋',
    gradient: 'linear-gradient(135deg, #fef3c7 0%, #fb7185 50%, #1e293b 100%)',
    tagline: 'Pastel cliffs, fado nights and the freshest pastéis de nata.',
    description:
      'Seven hills, yellow trams and tile-clad alleys — Lisbon mixes maritime history with a buzzing modern food and music scene.',
    bestSeason: 'Apr – Jun, Sep – Oct',
    avgDailyBudget: 110,
    languages: ['Portuguese'],
    currency: 'EUR',
    interests: ['culture', 'food', 'nightlife', 'photography'],
    highlights: ['Alfama', 'Belém', 'Sintra', 'LX Factory'],
    tips: [
      'Wear sneakers — the calçada cobblestones are slippery and steep.',
      'Tram 28 is iconic but pickpocket-heavy; keep bags zipped.',
      'Day-trip to Sintra mid-week to dodge the crowds.'
    ]
  },
  {
    id: 'marrakech',
    name: 'Marrakech',
    country: 'Morocco',
    region: 'Africa',
    emoji: '🕌',
    gradient: 'linear-gradient(135deg, #fde68a 0%, #ef4444 50%, #7c2d12 100%)',
    tagline: 'Medina mazes, riad rooftops and Atlas Mountain horizons.',
    description:
      'Lose yourself in the souks of the Medina, sip mint tea on hidden riads, and wake up to snowy Atlas peaks just an hour away.',
    bestSeason: 'Mar – May, Sep – Nov',
    avgDailyBudget: 60,
    languages: ['Arabic', 'French'],
    currency: 'MAD',
    interests: ['culture', 'shopping', 'food', 'photography'],
    highlights: ['Jardin Majorelle', 'Jemaa el-Fnaa', 'Bahia Palace', 'Atlas day trip'],
    tips: [
      'Bargain firmly but politely in the souks — start at 30–40% of asking.',
      'Dress modestly, especially in the medina.',
      'Use offline maps; the alleys confuse GPS.'
    ]
  },
  {
    id: 'patagonia',
    name: 'Patagonia',
    country: 'Argentina / Chile',
    region: 'South America',
    emoji: '🏔️',
    gradient: 'linear-gradient(135deg, #cffafe 0%, #14b8a6 50%, #0f172a 100%)',
    tagline: 'Granite peaks, glacier-blue lakes and the wind at the end of the world.',
    description:
      'From Torres del Paine to El Chaltén, Patagonia is a paradise for hikers, climbers and anyone chasing raw, untamed scale.',
    bestSeason: 'Nov – Mar',
    avgDailyBudget: 140,
    languages: ['Spanish'],
    currency: 'ARS / CLP',
    interests: ['adventure', 'nature', 'photography'],
    highlights: ['Torres del Paine', 'Perito Moreno', 'El Chaltén', 'Ushuaia'],
    tips: [
      'Pack layers — four seasons in one day is real here.',
      'Book Torres del Paine refugios months in advance.',
      'Buses are slow but reliable; plan buffer days.'
    ]
  },
  {
    id: 'new-york',
    name: 'New York City',
    country: 'USA',
    region: 'North America',
    emoji: '🗽',
    gradient: 'linear-gradient(135deg, #e0e7ff 0%, #6366f1 50%, #0f172a 100%)',
    tagline: 'The city that turns every block into a story.',
    description:
      'Five boroughs of museums, Broadway lights, hidden speakeasies, and skyline views that never get old.',
    bestSeason: 'Apr – Jun, Sep – Nov',
    avgDailyBudget: 200,
    languages: ['English'],
    currency: 'USD',
    interests: ['culture', 'food', 'nightlife', 'shopping'],
    highlights: ['Central Park', 'Brooklyn', 'MoMA', 'Broadway'],
    tips: [
      'Get a 7-day OMNY unlimited if staying that long.',
      'Tip 18–20% at restaurants and 15–20% in cabs.',
      'Walk the Brooklyn Bridge at sunrise to dodge crowds.'
    ]
  },
  {
    id: 'queenstown',
    name: 'Queenstown',
    country: 'New Zealand',
    region: 'Oceania',
    emoji: '🪂',
    gradient: 'linear-gradient(135deg, #d9f99d 0%, #22c55e 50%, #0f766e 100%)',
    tagline: 'The adrenaline capital cradled by the Southern Alps.',
    description:
      'Bungee, jet boats, ski fields and Lord of the Rings landscapes — all walkable from a buzzing lakeside village.',
    bestSeason: 'Dec – Feb (summer), Jun – Aug (ski)',
    avgDailyBudget: 170,
    languages: ['English', 'Māori'],
    currency: 'NZD',
    interests: ['adventure', 'nature', 'family', 'photography'],
    highlights: ['Milford Sound', 'Skyline Gondola', 'Glenorchy', 'Coronet Peak'],
    tips: [
      'Book Milford Sound day trips in advance during peak season.',
      'Try the Fergburger but go off-peak to skip the queue.',
      'Drive carefully — roads are narrow and weather flips fast.'
    ]
  }
];

export const REGIONS = [
  'All',
  ...Array.from(new Set(DESTINATIONS.map((d) => d.region)))
];

export const getDestination = (id) => DESTINATIONS.find((d) => d.id === id);
