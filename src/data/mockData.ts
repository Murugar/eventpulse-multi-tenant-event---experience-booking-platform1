import {
  ClientTenant,
  VenueLocation,
  EventItem,
  PromotionOffer,
  BookingOrder,
  FinancialTransaction,
  BusinessIntegration,
  StaffMember,
  ConversationalSession
} from '../types';

export const mockTenants: ClientTenant[] = [
  {
    id: 'apex-live',
    name: 'Apex Live Entertainment',
    slug: 'apex-live',
    brandColor: 'amber-600',
    accentColor: '#d97706',
    logoText: 'APEX LIVE',
    tagline: 'World-Class Concerts & Arena Experiences',
    customDomain: 'tickets.apexlive.events',
    currency: 'USD',
    currencySymbol: '$',
    heroBanner: '/src/assets/images/hero_concert_stage_1793098377229.jpg',
    contactEmail: 'boxoffice@apexlive.events',
    commissionRate: 0.08
  },
  {
    id: 'luminary-tech',
    name: 'Luminary Summits',
    slug: 'luminary-tech',
    brandColor: 'indigo-600',
    accentColor: '#4f46e5',
    logoText: 'LUMINARY',
    tagline: 'Global Technology & Executive Leadership Summits',
    customDomain: 'register.luminarysummits.io',
    currency: 'USD',
    currencySymbol: '$',
    heroBanner: '/src/assets/images/event_tech_conference_1793098377997.jpg',
    contactEmail: 'delegates@luminarysummits.io',
    commissionRate: 0.075
  },
  {
    id: 'velvet-vine',
    name: 'Velvet & Vine Gastronomy',
    slug: 'velvet-vine',
    brandColor: 'rose-700',
    accentColor: '#be123c',
    logoText: 'VELVET & VINE',
    tagline: 'Private Degustations & Sommelier Reservations',
    customDomain: 'dining.velvetandvine.com',
    currency: 'USD',
    currencySymbol: '$',
    heroBanner: '/src/assets/images/event_fine_dining_1793098379700.jpg',
    contactEmail: 'concierge@velvetandvine.com',
    commissionRate: 0.10
  },
  {
    id: 'horizon-activations',
    name: 'Horizon Brand Activations',
    slug: 'horizon-activations',
    brandColor: 'slate-900',
    accentColor: '#0f172a',
    logoText: 'HORIZON',
    tagline: 'Immersive Spatial Pavilions & Brand Launches',
    customDomain: 'access.horizonactivations.agency',
    currency: 'USD',
    currencySymbol: '$',
    heroBanner: '/src/assets/images/event_brand_activation_1793098378972.jpg',
    contactEmail: 'rsvp@horizonactivations.agency',
    commissionRate: 0.09
  }
];

export const mockVenues: VenueLocation[] = [
  {
    id: 'venue-solstice',
    name: 'The Solstice Amphitheater',
    city: 'Morrison, CO',
    address: '18300 W Alameda Pkwy, Morrison, CO 80465',
    capacity: 9525,
    type: 'amphitheater'
  },
  {
    id: 'venue-lumieres',
    name: 'Palais des Lumières Grand Auditorium',
    city: 'Paris, France',
    address: '8 Place du Carrousel, 75001 Paris',
    capacity: 2400,
    type: 'auditorium'
  },
  {
    id: 'venue-atelier',
    name: 'L’Atelier Étoile Chef’s Table',
    city: 'New York, NY',
    address: '42 Crosby Street, Soho, New York, NY 10012',
    capacity: 36,
    type: 'restaurant_chef_table'
  },
  {
    id: 'venue-glass-pavilion',
    name: 'The Glass Pavilion & Courtyard',
    city: 'Tokyo, Japan',
    address: '5 Chome Minamiaoyama, Minato City, Tokyo 107-0062',
    capacity: 1200,
    type: 'exhibition_pavilion'
  },
  {
    id: 'venue-foundry',
    name: 'The Foundry Center for Digital Arts',
    city: 'San Francisco, CA',
    address: '1425 Folsom Street, San Francisco, CA 94103',
    capacity: 850,
    type: 'ballroom'
  }
];

export const mockEvents: EventItem[] = [
  {
    id: 'evt-astra-nova',
    tenantId: 'apex-live',
    title: 'Astra Nova: Symphony Under The Stars',
    category: 'concert',
    tagline: 'A breathtaking orchestral & synthwave spectacle beneath the alpine night sky.',
    description: 'Join Grammy-winning sensation Astra Nova with the 60-piece Colorado Philharmonic for an electrifying night of symphonic synth-rock. Featuring synchronized pyrotechnics, immersive spatial sound, and panoramic mountain views.',
    imageUrl: '/src/assets/images/hero_concert_stage_1793098377229.jpg',
    date: '2026-11-14',
    startTime: '19:30',
    endTime: '23:00',
    venueId: 'venue-solstice',
    featured: true,
    status: 'published',
    lineupOrHosts: ['Astra Nova', 'Colorado Philharmonic Orchestra', 'Elena Santos (Conductor)', 'Kaelen Pulse (Support)'],
    schedule: [
      { time: '18:00', title: 'Gates Open & Sunset Terrace DJ Set', stageOrRoom: 'Upper Plaza' },
      { time: '19:30', title: 'Opening Act: Kaelen Pulse Live', stageOrRoom: 'Main Amphitheater Stage' },
      { time: '20:30', title: 'Astra Nova & Philharmonic Act I', stageOrRoom: 'Main Amphitheater Stage' },
      { time: '21:45', title: 'Symphonic Intermission & Stargazing', stageOrRoom: 'Concourse' },
      { time: '22:00', title: 'Astra Nova Grand Finale & Drone Light Show', stageOrRoom: 'Main Amphitheater Stage' }
    ],
    addOns: [
      { id: 'add-parking', name: 'VIP Priority Reserved Parking', price: 45, description: 'Guaranteed spot in lot A with dedicated bypass exit.' },
      { id: 'add-soundcheck', name: 'Early Soundcheck & Q&A Access', price: 95, description: 'Enter 2 hours early to observe private orchestra rehearsal.' },
      { id: 'add-merch', name: 'Collector Tour Vinyl & Commemorative Lanyard', price: 65, description: 'Exclusive 180g marble vinyl signed by Astra Nova.' }
    ],
    tiers: [
      {
        id: 'tier-astra-vip',
        eventId: 'evt-astra-nova',
        name: 'VIP Golden Circle Front Row',
        price: 285,
        capacity: 250,
        soldCount: 228,
        heldCount: 4,
        description: 'Prime reserved orchestra seating directly in front of stage with lounge access.',
        benefits: ['Dedicated VIP lane entrance', 'Complimentary welcome champagne', 'Access to backstage hospitality tent', 'Laminated VIP commemorative badge'],
        maxPerOrder: 4
      },
      {
        id: 'tier-astra-reserved',
        eventId: 'evt-astra-nova',
        name: 'Lower Bowl Reserved Seating',
        price: 165,
        capacity: 1800,
        soldCount: 1540,
        heldCount: 12,
        description: 'Assigned theater seats with unobstructed views and acoustic sweet spot.',
        benefits: ['Assigned chair with cushion', 'Direct concourse beverage bar access', 'Full stage and laser perspective'],
        maxPerOrder: 6
      },
      {
        id: 'tier-astra-ga',
        eventId: 'evt-astra-nova',
        name: 'General Admission Mountain Lawn',
        price: 75,
        capacity: 4500,
        soldCount: 3820,
        heldCount: 25,
        description: 'Sprawling grass amphitheater terrace with panoramic stage views.',
        benefits: ['Bring your own blanket', 'Surround sound audio towers', 'Food truck row access'],
        maxPerOrder: 8
      }
    ]
  },
  {
    id: 'evt-luminary-summit',
    tenantId: 'luminary-tech',
    title: 'Global Executive AI & Future Tech Summit',
    category: 'conference',
    tagline: 'Where 2,400 technology pioneers and enterprise leaders converge.',
    description: 'An exclusive multi-day summit exploring sovereign AI compute, agentic workflows, quantum algorithms, and autonomous enterprise systems. Features closed-door Chatham House roundtables and executive networking.',
    imageUrl: '/src/assets/images/event_tech_conference_1793098377997.jpg',
    date: '2026-11-20',
    startTime: '08:30',
    endTime: '18:00',
    venueId: 'venue-lumieres',
    featured: true,
    status: 'published',
    lineupOrHosts: ['Dr. Aris Thorne (Chief AI Scientist)', 'Dame Helena Mercier (EU Tech Envoy)', 'Devon Vance (Venture Partner)', 'Siddharth Nair (Infra VP)'],
    schedule: [
      { time: '08:30', title: 'Executive Breakfast & Delegate Registration', stageOrRoom: 'Grand Foyer' },
      { time: '09:30', title: 'Opening Keynote: The Sovereign Intelligence Frontier', stageOrRoom: 'Amphithéâtre Richelieu' },
      { time: '11:15', title: 'Panel: Next-Gen Agentic Architecture & Latency', stageOrRoom: 'Stage B: Technical Deep Dive' },
      { time: '13:00', title: 'Curated Networking Luncheon', stageOrRoom: 'Tuileries Atrium' },
      { time: '14:30', title: 'Closed-Door Roundtables (Executive Pass)', stageOrRoom: 'Salon Gabriel' },
      { time: '17:00', title: 'Venture Showcase & Cocktail Reception', stageOrRoom: 'Sculpture Garden' }
    ],
    addOns: [
      { id: 'add-gala', name: 'VIP Gala Dinner at Château Versailles', price: 320, description: 'Exclusive formal 4-course dinner with summit keynote speakers.' },
      { id: 'add-concierge', name: 'Dedicated Summit Concierge & Private Transfer', price: 210, description: 'Chauffeured airport transfer and priority session booking.' }
    ],
    tiers: [
      {
        id: 'tier-lum-exec',
        eventId: 'evt-luminary-summit',
        name: 'Executive All-Access Pass',
        price: 1850,
        capacity: 350,
        soldCount: 312,
        heldCount: 6,
        description: 'Complete summit access including closed-door roundtables and speakers lounge.',
        benefits: ['Front row keynote seating', 'Access to Chatham House roundtables', 'Speakers lounge & private meeting pods', 'All-inclusive gourmet dining'],
        maxPerOrder: 5
      },
      {
        id: 'tier-lum-delegate',
        eventId: 'evt-luminary-summit',
        name: 'Full Conference Delegate Pass',
        price: 980,
        capacity: 1500,
        soldCount: 1180,
        heldCount: 14,
        description: 'Access to all main stage keynotes, technical tracks, and networking luncheon.',
        benefits: ['Access to 4 technical stages', 'Delegate luncheon & coffee bars', 'Recorded video archive access', 'Delegate networking app access'],
        maxPerOrder: 10
      },
      {
        id: 'tier-lum-virtual',
        eventId: 'evt-luminary-summit',
        name: 'Interactive Virtual Pass',
        price: 290,
        capacity: 5000,
        soldCount: 2420,
        heldCount: 0,
        description: 'Live broadcast in 4K with interactive Q&A and digital delegate matchmaking.',
        benefits: ['HD live stream with chat', 'Session replay for 12 months', 'Digital materials package'],
        maxPerOrder: 20
      }
    ]
  },
  {
    id: 'evt-velvet-truffle',
    tenantId: 'velvet-vine',
    title: 'The Seven-Course Truffle & Heritage Degustation',
    category: 'dining',
    tagline: 'An intimate 36-seat culinary residency paired with Grand Cru vintages.',
    description: 'Three-star Chef Antoine Laurent presents an exclusive autumn degustation celebrating Périgord black truffles and dry-aged heritage beef. Each seating is strictly limited to 18 guests across two seatings with master sommelier storytelling.',
    imageUrl: '/src/assets/images/event_fine_dining_1793098379700.jpg',
    date: '2026-11-28',
    startTime: '19:00',
    endTime: '22:30',
    venueId: 'venue-atelier',
    featured: true,
    status: 'published',
    dietaryOptionsAvailable: true,
    lineupOrHosts: ['Chef Antoine Laurent (3-Star Michelin)', 'Gisèle Beaulieu (Master Sommelier)', 'Pastry Chef Kenji Mori'],
    schedule: [
      { time: '19:00', title: 'Salon Welcome: Vintage Champagne & Canapés', stageOrRoom: 'Wine Cellar Salon' },
      { time: '19:30', title: 'Courses 1 - 3: Périgord Truffle & Wild Langoustine', stageOrRoom: 'Main Chef’s Table' },
      { time: '20:45', title: 'Courses 4 - 5: Heritage Beef & Morel Cocotte', stageOrRoom: 'Main Chef’s Table' },
      { time: '21:30', title: 'Sommelier Reserve Uncorking & Cheese Cart', stageOrRoom: 'Main Chef’s Table' },
      { time: '22:00', title: 'Grand Dessert & Rare Cognac Pairing', stageOrRoom: 'Main Chef’s Table' }
    ],
    addOns: [
      { id: 'add-wine-pair', name: 'Prestige Grand Cru Sommelier Wine Pairing', price: 185, description: 'Rare cellar vintages matched to each course by Master Sommelier.' },
      { id: 'add-caviar', name: 'Golden Osetra Caviar Service Pre-Course', price: 95, description: '30g Imperial caviar with warm buckwheat blinis and crème fraîche.' }
    ],
    tiers: [
      {
        id: 'tier-velvet-counter',
        eventId: 'evt-velvet-truffle',
        name: 'Chef’s Counter Front-Row Seating',
        price: 380,
        capacity: 18,
        soldCount: 14,
        heldCount: 2,
        description: 'Immersive seating around the open hearth counter with direct chef interaction.',
        benefits: ['Direct conversation with Chef Antoine', 'Signed leather-bound menu', 'Behind-the-scenes hearth view', 'Gift box of artisanal mignardises'],
        maxPerOrder: 2
      },
      {
        id: 'tier-velvet-alcove',
        eventId: 'evt-velvet-truffle',
        name: 'Private Salon Table for 4',
        price: 1420,
        capacity: 4,
        soldCount: 3,
        heldCount: 1,
        description: 'Private candlelit corner alcove ideal for discerning corporate or celebratory guests.',
        benefits: ['Dedicated table sommelier', 'Magnum bottle of vintage champagne', 'Private dining seclusion', 'Bespoke menu personalization'],
        maxPerOrder: 1
      }
    ]
  },
  {
    id: 'evt-horizon-aeterna',
    tenantId: 'horizon-activations',
    title: 'Aeterna: Luxury Haute Couture & Spatial Art Pavilion',
    category: 'brand_activation',
    tagline: 'An architectural pop-up journey blending contemporary sculpture and haute couture.',
    description: 'Commissioned by international luxury houses, Aeterna transforms Tokyo’s Glass Pavilion into an ethereal sanctuary of kinetic light sculptures, bespoke fragrance installations, and private couture showings. Curated timed entry ensures serene immersion.',
    imageUrl: '/src/assets/images/event_brand_activation_1793098378972.jpg',
    date: '2026-12-05',
    startTime: '10:00',
    endTime: '21:00',
    venueId: 'venue-glass-pavilion',
    featured: true,
    status: 'published',
    lineupOrHosts: ['Studio Nendo (Spatial Architects)', 'Maison Aeterna Atelier', 'Kengo Takahashi (Light Designer)'],
    schedule: [
      { time: '10:00', title: 'Morning Vernissage & Architectural Walkthrough', stageOrRoom: 'North Gallery' },
      { time: '14:00', title: 'Couture Runway Presentation: Timeless Textures', stageOrRoom: 'Central Spiral Ramp' },
      { time: '17:30', title: 'Sensory Fragrance Lab & Olfactory Tasting', stageOrRoom: 'South Chamber' },
      { time: '19:30', title: 'Nocturne Kinetic Light & Sound Performance', stageOrRoom: 'Glass Courtyard' }
    ],
    addOns: [
      { id: 'add-fragrance', name: 'Aeterna Limited Edition Bespoke Extrait (50ml)', price: 160, description: 'Hand-numbered flacon created exclusively for pavilion attendees.' },
      { id: 'add-catalogue', name: 'Monograph Hardcover Exhibition Catalog', price: 45, description: 'Linen-bound archival book detailing all sculptures and architectural drawings.' }
    ],
    tiers: [
      {
        id: 'tier-hor-vip',
        eventId: 'evt-horizon-aeterna',
        name: 'Private Preview & Atelier Access',
        price: 220,
        capacity: 200,
        soldCount: 175,
        heldCount: 5,
        description: 'Exclusive 1-hour private time slot with curator guided tour and champagne lounge.',
        benefits: ['Private curator tour (max 10 guests)', 'Champagne & cocktail bar in courtyard', 'Priority boutique reservations', 'Fast-track entry anytime'],
        maxPerOrder: 4
      },
      {
        id: 'tier-hor-timed',
        eventId: 'evt-horizon-aeterna',
        name: 'Timed Entry Exhibition Ticket',
        price: 45,
        capacity: 1000,
        soldCount: 780,
        heldCount: 15,
        description: 'Guaranteed 90-minute immersion window into the full spatial exhibition.',
        benefits: ['Full access to all 4 pavilion installations', 'Digital audio guide companion', 'Access to public courtyard cafe'],
        maxPerOrder: 6
      }
    ]
  },
  {
    id: 'evt-sound-workshop',
    tenantId: 'apex-live',
    title: 'Masterclass: Immersive Audio Engineering & Stage Production',
    category: 'workshop',
    tagline: 'Hands-on intensive for live sound designers and touring engineers.',
    description: 'Spend an intensive full day with stadium touring audio directors at The Foundry. Learn Dolby Atmos live mixing, line array acoustical calibration, and stage telemetry systems.',
    imageUrl: '/src/assets/images/hero_concert_stage_1793098377229.jpg',
    date: '2026-12-12',
    startTime: '09:00',
    endTime: '17:00',
    venueId: 'venue-foundry',
    featured: false,
    status: 'published',
    lineupOrHosts: ['Damian Cross (Front of House Engineer)', 'Lia Sterling (System Tech Lead)'],
    schedule: [
      { time: '09:00', title: 'Acoustical Modeling & Line Array Rigging Theory', stageOrRoom: 'Studio A' },
      { time: '11:30', title: 'Live Spatial Panning & Multitrack Mixing Session', stageOrRoom: 'Soundstage 1' },
      { time: '14:00', title: 'Hands-on DiGiCo & Avid Console Programming', stageOrRoom: 'Tech Lab' },
      { time: '16:00', title: 'Q&A, Certification Certificate Presentation', stageOrRoom: 'Main Lounge' }
    ],
    tiers: [
      {
        id: 'tier-ws-student',
        eventId: 'evt-sound-workshop',
        name: 'Professional Workshop Seat',
        price: 450,
        capacity: 40,
        soldCount: 32,
        heldCount: 2,
        description: 'Includes dedicated console station, course workbook, and catered lunch.',
        benefits: ['Dedicated console hardware station', 'Certificate of Completion', 'All multitrack project files', 'Networking lunch with touring engineers'],
        maxPerOrder: 2
      }
    ]
  }
];

export const mockPromotions: PromotionOffer[] = [
  {
    id: 'promo-earlybird',
    code: 'EARLYBIRD20',
    discountType: 'percentage',
    discountValue: 20,
    maxRedemptions: 150,
    currentRedemptions: 98,
    validUntil: '2026-11-30',
    description: '20% off any event early booking tier across the platform',
    minTickets: 1
  },
  {
    id: 'promo-tech50',
    code: 'TECHSUMMIT50',
    tenantId: 'luminary-tech',
    discountType: 'fixed_amount',
    discountValue: 50,
    maxRedemptions: 100,
    currentRedemptions: 64,
    validUntil: '2026-11-20',
    description: '$50 discount on Luminary Executive or Delegate Passes',
    applicableCategories: ['conference']
  },
  {
    id: 'promo-group',
    code: 'GROUPVIP',
    discountType: 'percentage',
    discountValue: 15,
    maxRedemptions: 200,
    currentRedemptions: 43,
    validUntil: '2026-12-31',
    description: '15% group discount when booking 4 or more tickets',
    minTickets: 4
  },
  {
    id: 'promo-dining',
    code: 'CHEFSTABLE',
    tenantId: 'velvet-vine',
    discountType: 'fixed_amount',
    discountValue: 40,
    maxRedemptions: 30,
    currentRedemptions: 19,
    validUntil: '2026-11-28',
    description: '$40 sommelier voucher for Velvet & Vine reservations',
    applicableCategories: ['dining']
  }
];

export const mockBookings: BookingOrder[] = [
  {
    id: 'BK-9481',
    tenantId: 'apex-live',
    eventId: 'evt-astra-nova',
    channel: 'web',
    customerName: 'Marcus Reynolds',
    customerEmail: 'm.reynolds@apexventures.com',
    customerPhone: '+1 (415) 890-2341',
    tierId: 'tier-astra-vip',
    tierName: 'VIP Golden Circle Front Row',
    quantity: 2,
    unitPrice: 285,
    subtotal: 570,
    discountAmount: 114,
    appliedPromoCode: 'EARLYBIRD20',
    addOnsSelected: [{ name: 'VIP Priority Reserved Parking', price: 45 }],
    totalAmount: 501,
    status: 'confirmed',
    paymentMethod: 'apple_pay',
    paymentTransactionId: 'txn_apx_99281a',
    bookedAt: '2026-10-25T14:32:00Z',
    tickets: [
      {
        id: 'tkt-001',
        bookingId: 'BK-9481',
        ticketCode: 'APX-9481-01',
        eventId: 'evt-astra-nova',
        tierName: 'VIP Golden Circle Front Row',
        attendeeName: 'Marcus Reynolds',
        attendeeEmail: 'm.reynolds@apexventures.com',
        seatInfo: 'Row A, Seat 14',
        checkedIn: false
      },
      {
        id: 'tkt-002',
        bookingId: 'BK-9481',
        ticketCode: 'APX-9481-02',
        eventId: 'evt-astra-nova',
        tierName: 'VIP Golden Circle Front Row',
        attendeeName: 'Sophia Reynolds',
        attendeeEmail: 's.reynolds@apexventures.com',
        seatInfo: 'Row A, Seat 15',
        checkedIn: false
      }
    ]
  },
  {
    id: 'BK-9482',
    tenantId: 'luminary-tech',
    eventId: 'evt-luminary-summit',
    channel: 'whatsapp',
    customerName: 'Claire Delacroix',
    customerEmail: 'cdelacroix@novacore.fr',
    customerPhone: '+33 6 12 34 56 78',
    companyName: 'NovaCore AI Systems',
    tierId: 'tier-lum-exec',
    tierName: 'Executive All-Access Pass',
    quantity: 1,
    unitPrice: 1850,
    subtotal: 1850,
    discountAmount: 50,
    appliedPromoCode: 'TECHSUMMIT50',
    addOnsSelected: [{ name: 'VIP Gala Dinner at Château Versailles', price: 320 }],
    totalAmount: 2120,
    status: 'confirmed',
    paymentMethod: 'credit_card',
    paymentTransactionId: 'txn_lum_77412b',
    bookedAt: '2026-10-26T09:15:00Z',
    tickets: [
      {
        id: 'tkt-003',
        bookingId: 'BK-9482',
        ticketCode: 'LUM-9482-01',
        eventId: 'evt-luminary-summit',
        tierName: 'Executive All-Access Pass',
        attendeeName: 'Claire Delacroix',
        attendeeEmail: 'cdelacroix@novacore.fr',
        seatInfo: 'Orchestra Zone 1, Seat E-22',
        checkedIn: true,
        checkedInAt: '2026-10-26T10:05:00Z'
      }
    ]
  },
  {
    id: 'BK-9483',
    tenantId: 'velvet-vine',
    eventId: 'evt-velvet-truffle',
    channel: 'concierge',
    customerName: 'Lord Julian Sterling',
    customerEmail: 'julian@sterlingholdings.co.uk',
    customerPhone: '+44 20 7946 0912',
    tierId: 'tier-velvet-counter',
    tierName: 'Chef’s Counter Front-Row Seating',
    quantity: 2,
    unitPrice: 380,
    subtotal: 760,
    discountAmount: 40,
    appliedPromoCode: 'CHEFSTABLE',
    addOnsSelected: [{ name: 'Prestige Grand Cru Sommelier Wine Pairing', price: 185 }],
    totalAmount: 905,
    status: 'confirmed',
    paymentMethod: 'corporate_invoice',
    paymentTransactionId: 'txn_vel_44109c',
    bookedAt: '2026-10-26T16:48:00Z',
    tickets: [
      {
        id: 'tkt-004',
        bookingId: 'BK-9483',
        ticketCode: 'VLV-9483-01',
        eventId: 'evt-velvet-truffle',
        tierName: 'Chef’s Counter Front-Row Seating',
        attendeeName: 'Lord Julian Sterling',
        attendeeEmail: 'julian@sterlingholdings.co.uk',
        seatInfo: 'Chef Counter 01',
        checkedIn: false,
        dietaryNote: 'Pescatarian, no shellfish'
      },
      {
        id: 'tkt-005',
        bookingId: 'BK-9483',
        ticketCode: 'VLV-9483-02',
        eventId: 'evt-velvet-truffle',
        tierName: 'Chef’s Counter Front-Row Seating',
        attendeeName: 'Lady Eleanor Sterling',
        attendeeEmail: 'eleanor@sterlingholdings.co.uk',
        seatInfo: 'Chef Counter 02',
        checkedIn: false,
        dietaryNote: 'No dairy'
      }
    ]
  }
];

export const mockTransactions: FinancialTransaction[] = [
  {
    id: 'TXN-1001',
    bookingId: 'BK-9481',
    tenantId: 'apex-live',
    channel: 'web',
    amount: 501,
    type: 'payment',
    status: 'captured',
    gatewayFee: 14.83,
    agencyFee: 40.08,
    clientNet: 446.09,
    timestamp: '2026-10-25T14:32:05Z',
    customerName: 'Marcus Reynolds'
  },
  {
    id: 'TXN-1002',
    bookingId: 'BK-9482',
    tenantId: 'luminary-tech',
    channel: 'whatsapp',
    amount: 2120,
    type: 'payment',
    status: 'captured',
    gatewayFee: 61.78,
    agencyFee: 159.00,
    clientNet: 1899.22,
    timestamp: '2026-10-26T09:15:10Z',
    customerName: 'Claire Delacroix'
  },
  {
    id: 'TXN-1003',
    bookingId: 'BK-9483',
    tenantId: 'velvet-vine',
    channel: 'concierge',
    amount: 905,
    type: 'payment',
    status: 'settled',
    gatewayFee: 26.54,
    agencyFee: 90.50,
    clientNet: 787.96,
    timestamp: '2026-10-26T16:48:12Z',
    customerName: 'Lord Julian Sterling'
  }
];

export const mockIntegrations: BusinessIntegration[] = [
  {
    id: 'int-salesforce',
    name: 'Salesforce Enterprise CRM',
    type: 'crm',
    provider: 'Salesforce',
    connected: true,
    lastSync: '12 minutes ago',
    eventsSyncedCount: 4210,
    description: 'Syncs corporate delegates, account contacts, and high-value VIP bookings into Salesforce Opportunities.'
  },
  {
    id: 'int-hubspot',
    name: 'HubSpot Marketing Hub',
    type: 'marketing',
    provider: 'HubSpot',
    connected: true,
    lastSync: '4 minutes ago',
    eventsSyncedCount: 3890,
    description: 'Triggers automated event reminder workflows, personalized agendas, and post-event survey cadences.'
  },
  {
    id: 'int-square',
    name: 'Square Box Office POS & Door Terminals',
    type: 'pos',
    provider: 'Square',
    connected: true,
    lastSync: 'Just now',
    eventsSyncedCount: 1420,
    description: 'Real-time synchronization between physical gate ticket scanners, box office cash desks, and online inventory.'
  },
  {
    id: 'int-webhooks',
    name: 'Unified Webhook & Slack Event Stream',
    type: 'webhooks',
    provider: 'Custom Webhook API',
    connected: true,
    lastSync: 'Active streaming',
    eventsSyncedCount: 9812,
    description: 'Pushes real-time order notifications, hold releases, and door check-in logs to Slack #ops-live.'
  }
];

export const mockStaff: StaffMember[] = [
  {
    id: 'staff-elena',
    name: 'Elena Rostova',
    email: 'elena@eventpulse-agency.com',
    role: 'agency_admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'staff-marcus',
    name: 'Marcus Vance',
    email: 'marcus@apexlive.events',
    role: 'client_admin',
    tenantId: 'apex-live'
  },
  {
    id: 'staff-sarah',
    name: 'Sarah Chen',
    email: 'sarah.chen@luminarysummits.io',
    role: 'client_admin',
    tenantId: 'luminary-tech'
  },
  {
    id: 'staff-door-1',
    name: 'Jackson Miller',
    email: 'boxoffice-door@eventpulse.com',
    role: 'box_office_staff'
  },
  {
    id: 'staff-support-1',
    name: 'Amara Patel',
    email: 'support-ops@eventpulse.com',
    role: 'customer_support'
  }
];

export const initialConversations: ConversationalSession[] = [
  {
    id: 'conv-01',
    channel: 'whatsapp',
    customerName: 'David K.',
    customerPhone: '+1 (555) 392-1084',
    status: 'active',
    lastActivity: '2 mins ago',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: 'Hi! Are there any VIP tickets left for the Astra Nova concert in Morrison?',
        timestamp: '10:41 AM'
      },
      {
        id: 'm2',
        sender: 'bot',
        text: 'Hello David! Yes, there are currently 18 VIP Golden Circle Front Row tickets remaining ($285 each) for Astra Nova on Nov 14 at Solstice Amphitheater. Would you like me to place a 10-minute hold on 2 tickets for you?',
        timestamp: '10:41 AM'
      },
      {
        id: 'm3',
        sender: 'user',
        text: 'Yes please, hold 2 tickets for me under David K!',
        timestamp: '10:42 AM'
      },
      {
        id: 'm4',
        sender: 'bot',
        text: 'Done! Your 2 VIP tickets have been placed on temporary hold. Hold ID: HLD-8941. You have 9 minutes and 40 seconds to complete checkout via this secure link: https://tickets.apexlive.events/checkout?hold=HLD-8941',
        timestamp: '10:42 AM',
        actionPayload: {
          type: 'hold_ticket',
          eventId: 'evt-astra-nova',
          tierId: 'tier-astra-vip'
        }
      }
    ]
  },
  {
    id: 'conv-02',
    channel: 'chatbot',
    customerName: 'Camilla Rodriguez',
    customerPhone: '+1 (415) 772-9102',
    status: 'handed_off_to_human',
    assignedAgent: 'Amara Patel',
    lastActivity: 'Just now',
    messages: [
      {
        id: 'm21',
        sender: 'user',
        text: 'I booked 2 seats for the Truffle Degustation at Velvet & Vine, but my guest is severely allergic to mushrooms. Can the menu be modified?',
        timestamp: '11:15 AM'
      },
      {
        id: 'm22',
        sender: 'bot',
        text: 'Since this is a specialized truffle menu, Chef Antoine prepares a curated heritage seafood alternative for guests with mushroom allergies upon request with 48h advance notice. Would you like me to connect you with our Guest Relations Specialist to note this on your booking?',
        timestamp: '11:16 AM'
      },
      {
        id: 'm23',
        sender: 'user',
        text: 'Yes please, connect me to an agent.',
        timestamp: '11:16 AM'
      },
      {
        id: 'm24',
        sender: 'system',
        text: 'Conversation transferred to Amara Patel (Customer Operations). Agent joined the chat.',
        timestamp: '11:17 AM',
        actionPayload: { type: 'handoff_alert' }
      },
      {
        id: 'm25',
        sender: 'human_agent',
        text: 'Hello Camilla! I am looking at your reservation right now. I have tagged your booking with "Strict Mushroom Allergy - Chef Laurent Alternate Seafood Course". You are all set!',
        timestamp: '11:18 AM'
      }
    ]
  }
];
