// India Hyundai Power - Initial Seed Data Engine

export const INITIAL_AREAS = [
  { id: 'area-in', name: 'India', type: 'Country', parentId: null, code: 'IND' }
];

export const INITIAL_ROLES = [
  { id: 'ADMIN', name: 'Administrator', description: 'Full access across all India territories, users, finances, and products' },
  { id: 'SALES_HEAD', name: 'Sales Head', description: 'Manages assigned region/state sales operations, sales persons, and dealers' },
  { id: 'SALES_PERSON', name: 'Sales Person', description: 'Field sales representative handling assigned area dealers and client orders' },
  { id: 'DEALER', name: 'Authorized Dealer', description: 'Business partner serving retail battery buyers and institutional clients' }
];

export const INITIAL_USERS = [
  {
    id: 'usr-admin',
    name: 'Keshav (Admin)',
    email: 'mr.k22322627@gmail.com',
    phone: '+91 98765 43210',
    role: 'ADMIN',
    areaId: 'area-in',
    areaName: 'India',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    status: 'ACTIVE',
    createdAt: '2025-01-10T10:00:00Z'
  },
  {
    id: 'usr-sh-pb',
    name: 'Harpreet Singh Sandhu',
    email: 'h.sandhu@hyundaipower.in',
    phone: '+91 98123 45678',
    role: 'SALES_HEAD',
    areaId: 'area-in',
    areaName: 'India',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    status: 'ACTIVE',
    createdAt: '2025-01-12T11:30:00Z'
  },
  {
    id: 'usr-sp-ldh',
    name: 'Gurpreet Singh',
    email: 'gurpreet.sp@hyundaipower.in',
    phone: '+91 98450 11223',
    role: 'SALES_PERSON',
    areaId: 'area-in',
    areaName: 'India',
    salesHeadId: 'usr-sh-pb',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    status: 'ACTIVE',
    createdAt: '2025-01-18T14:20:00Z'
  },
  {
    id: 'usr-dealer-ldh',
    name: 'Ludhiana Power Hub (Sunil Aggarwal)',
    email: 'sunil@ludhianapower.com',
    phone: '+91 98111 22334',
    role: 'DEALER',
    areaId: 'area-in',
    areaName: 'India',
    salesPersonId: 'usr-sp-ldh',
    salesHeadId: 'usr-sh-pb',
    businessName: 'Ludhiana Power Hub & Battery Solutions',
    gstin: '03AAAAA0000A1Z5',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    status: 'ACTIVE',
    createdAt: '2025-01-25T08:00:00Z'
  }
];

export const INITIAL_CATEGORIES = [
  {
    id: 'cat-automotive',
    name: 'Automotive Batteries',
    slug: 'automotive-batteries',
    icon: 'Car',
    description: 'Maintenance-free, high CCA batteries for passenger cars, SUVs, and luxury vehicles.',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'cat-inverter',
    name: 'Inverter & Solar Tubular Batteries',
    slug: 'inverter-solar-batteries',
    icon: 'Zap',
    description: 'Heavy duty tall tubular batteries engineered for long power cuts and solar energy storage.',
    image: 'https://images.unsplash.com/photo-1558441719-6745088737a0?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'cat-twowheeler',
    name: 'Two-Wheeler Batteries',
    slug: 'two-wheeler-batteries',
    icon: 'Bike',
    description: 'VRLA AGM spill-proof batteries for motorcycles, scooters, and e-bikes.',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'cat-commercial',
    name: 'Commercial & Heavy Vehicle',
    slug: 'commercial-batteries',
    icon: 'Truck',
    description: 'Rugged vibration-resistant batteries for trucks, buses, tractors, and JCBs.',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'cat-industrial',
    name: 'Industrial & UPS Power Solutions',
    slug: 'industrial-power-solutions',
    icon: 'Server',
    description: 'High-capacity SMF & VRLA batteries for telecom towers, data centers, and industrial UPS.',
    image: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&q=80&w=600'
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-auto-65ah',
    name: 'Hyundai Power Enercell 65Ah Automotive Battery',
    slug: 'hyundai-power-enercell-65ah',
    category: 'Automotive Batteries',
    categoryId: 'cat-automotive',
    brand: 'India Hyundai Power',
    shortDescription: '65Ah 12V Maintenance-Free Car Battery with 550 CCA for SUV & Sedan models.',
    fullDescription: 'Designed with advanced calcium-silver grid technology for immediate cranking power in extreme temperatures. Features built-in magic eye charge indicator, explosion-proof arrestor, and zero-maintenance sealed design.',
    sku: 'HPI-CAR-65AH',
    capacity: '65 Ah',
    voltage: '12V',
    warranty: '48 Months (24M Free Replacement + 24M Pro-rata)',
    price: 6850,
    dealerPrice: 5400,
    stockQuantity: 140,
    stockStatus: 'IN_STOCK',
    status: 'ACTIVE',
    rating: 4.9,
    reviewsCount: 128,
    images: [
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=800'
    ],
    specs: {
      cca: '550 Amps',
      dimensions: '260 x 173 x 225 mm',
      weight: '16.5 kg',
      layout: 'Left Hand Layout (-/+)',
      technology: 'Sealed Maintenance Free (SMF) Silver Alloy'
    }
  },
  {
    id: 'prod-inv-150ah',
    name: 'Hyundai Solaria 150Ah Tall Tubular Inverter Battery',
    slug: 'hyundai-solaria-150ah-tubular',
    category: 'Inverter & Solar Tubular Batteries',
    categoryId: 'cat-inverter',
    brand: 'India Hyundai Power',
    shortDescription: '150Ah 12V Tall Tubular Deep Cycle Battery with 60 Months Warranty.',
    fullDescription: 'Engineered for frequent and long power cuts in Indian households and commercial establishments. Features thick 3D tubular plates, ceramic vent plugs for minimal water loss, and high charge acceptance.',
    sku: 'HPI-INV-150TT',
    capacity: '150 Ah',
    voltage: '12V',
    warranty: '60 Months (36M Free + 24M Pro-rata)',
    price: 15490,
    dealerPrice: 12200,
    stockQuantity: 95,
    stockStatus: 'IN_STOCK',
    status: 'ACTIVE',
    rating: 4.95,
    reviewsCount: 312,
    images: [
      'https://images.unsplash.com/photo-1558441719-6745088737a0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=800'
    ],
    specs: {
      backupTime: '4.5 Hours on 400W Load',
      dimensions: '505 x 190 x 410 mm',
      weight: '52.0 kg',
      electrolyteVolume: '14.5 Liters',
      technology: 'Hybrid Tall Tubular Technology'
    }
  },
  {
    id: 'prod-inv-200ah',
    name: 'Hyundai Solaria Ultra 200Ah Heavy Duty Tubular Battery',
    slug: 'hyundai-solaria-200ah-heavy-tubular',
    category: 'Inverter & Solar Tubular Batteries',
    categoryId: 'cat-inverter',
    brand: 'India Hyundai Power',
    shortDescription: '200Ah 12V Ultra Heavy Tubular Battery for Solar & High Load Inverters.',
    fullDescription: 'Premium heavy-duty tall tubular battery built to deliver continuous backup for ACs, refrigerators, and heavy office loads. Superior deep discharge recovery and high corrosion resistance.',
    sku: 'HPI-INV-200TT',
    capacity: '200 Ah',
    voltage: '12V',
    warranty: '72 Months (48M Free + 24M Pro-rata)',
    price: 19800,
    dealerPrice: 15900,
    stockQuantity: 60,
    stockStatus: 'IN_STOCK',
    status: 'ACTIVE',
    rating: 5.0,
    reviewsCount: 89,
    images: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=800'
    ],
    specs: {
      backupTime: '6.5 Hours on 400W Load',
      dimensions: '505 x 190 x 430 mm',
      weight: '63.5 kg',
      electrolyteVolume: '18.0 Liters',
      technology: 'Ultra Corrosion Resistant Tubular Lead-Acid'
    }
  },
  {
    id: 'prod-tw-5ah',
    name: 'Hyundai Rider 5Ah VRLA Bike Battery',
    slug: 'hyundai-rider-5ah-vrla-bike',
    category: 'Two-Wheeler Batteries',
    categoryId: 'cat-twowheeler',
    brand: 'India Hyundai Power',
    shortDescription: '5Ah 12V Spill-Proof AGM VRLA Two-Wheeler Battery.',
    fullDescription: 'High vibration resistance motorcycle battery designed for instantaneous electric start in cold weather. Sealed spill-proof design requiring zero top-up maintenance.',
    sku: 'HPI-BIKE-5AH',
    capacity: '5 Ah',
    voltage: '12V',
    warranty: '36 Months (24M Replacement)',
    price: 1350,
    dealerPrice: 1050,
    stockQuantity: 280,
    stockStatus: 'IN_STOCK',
    status: 'ACTIVE',
    rating: 4.8,
    reviewsCount: 75,
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800'
    ],
    specs: {
      cca: '90 Amps',
      dimensions: '120 x 60 x 130 mm',
      weight: '2.1 kg',
      technology: 'AGM VRLA Sealed'
    }
  },
  {
    id: 'prod-comm-120ah',
    name: 'Hyundai Cargo 120Ah Heavy Commercial Battery',
    slug: 'hyundai-cargo-120ah-commercial',
    category: 'Commercial & Heavy Vehicle',
    categoryId: 'cat-commercial',
    brand: 'India Hyundai Power',
    shortDescription: '120Ah Heavy Duty Battery for Trucks, Buses & Tractors.',
    fullDescription: 'Rugged battery casing designed to withstand heavy vibration, off-road conditions, and continuous long-distance commercial haulage.',
    sku: 'HPI-COMM-120AH',
    capacity: '120 Ah',
    voltage: '12V',
    warranty: '36 Months (18M Free + 18M Pro-rata)',
    price: 11900,
    dealerPrice: 9400,
    stockQuantity: 45,
    stockStatus: 'IN_STOCK',
    status: 'ACTIVE',
    rating: 4.85,
    reviewsCount: 42,
    images: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800'
    ],
    specs: {
      cca: '850 Amps',
      dimensions: '500 x 180 x 230 mm',
      weight: '34.0 kg',
      technology: 'Heavy Duty Reinforced Plate'
    }
  }
];

export const INITIAL_DELIVERY_PERSONNEL = [
  {
    id: 'dp-1',
    name: 'Sukhwinder Singh',
    phone: '+91 98721 00112',
    vehicleNumber: 'PB-10-CZ-4482 (Tata Ace)',
    areaId: 'area-in',
    areaName: 'India',
    status: 'ACTIVE',
    totalDeliveries: 48,
    rating: 4.9
  },
  {
    id: 'dp-2',
    name: 'Gurmeet Ram',
    phone: '+91 98155 33221',
    vehicleNumber: 'PB-02-AX-9012 (Mahindra Bolero Maxi)',
    areaId: 'area-in',
    areaName: 'India',
    status: 'ACTIVE',
    totalDeliveries: 34,
    rating: 4.8
  },
  {
    id: 'dp-3',
    name: 'Vikas Sharma',
    phone: '+91 99100 44556',
    vehicleNumber: 'HR-26-DQ-1123 (Eicher Pro)',
    areaId: 'area-in',
    areaName: 'India',
    status: 'ACTIVE',
    totalDeliveries: 52,
    rating: 4.95
  }
];

export const INITIAL_ORDERS = [];

export const INITIAL_PAYMENTS = [];

export const INITIAL_NOTIFICATIONS = [];

export const INITIAL_COMPLAINTS = [];



