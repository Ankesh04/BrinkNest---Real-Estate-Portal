// server/seed/seedData.js
// This script populates our MongoDB Atlas database with realistic mock real-estate listings,
// sample user accounts (including one administrator), and initial demo inquiries.
// Run with: npm run seed (from inside /server)

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables (MONGO_URI)
dotenv.config();

const User = require('../models/User');
const Property = require('../models/Property');
const Favorite = require('../models/Favorite');
const Inquiry = require('../models/Inquiry');

const propertiesData = [
  {
    title: 'The Highland Sanctuary — Modern Hillside Villa',
    description: 'Perched on the rolling slopes of West Lake Hills, this architectural masterpiece combines raw limestone, glass curtain walls, and warm cedar accents. Features an infinity pool overlooking the canyon, temperature-controlled wine room, and an expansive chef kitchen equipped with Sub-Zero and Wolf appliances.',
    price: 2450000,
    listingType: 'sale',
    propertyType: 'villa',
    bedrooms: 5,
    bathrooms: 6,
    areaSqft: 5800,
    address: '4208 Skyline Ridge Trail',
    city: 'Austin',
    state: 'TX',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Infinity Pool', 'Wine Cellar', 'Smart Home Automation', 'Outdoor Kitchen', '3-Car Garage', 'Hill Country Views'],
    ownerName: 'Eleanor Vance',
    ownerEmail: 'eleanor.vance@highlandestates.com',
    ownerPhone: '+1 (512) 555-0192',
    isFeatured: true,
  },
  {
    title: 'The Tribeca Cast-Iron Loft',
    description: 'Classic Manhattan charm meets high-end industrial minimalism. Spanning an entire floor with soaring 13-foot tin-pressed ceilings, original exposed brick, massive Corinthian cast-iron columns, and direct keyed elevator access.',
    price: 9500,
    listingType: 'rent',
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 2200,
    address: '74 Franklin Street, Fl 4',
    city: 'New York',
    state: 'NY',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Keyed Elevator', 'Exposed Brick', 'Custom Millwork', 'Miele Appliances', 'Doorman', 'Storage Unit'],
    ownerName: 'Marcus Sterling',
    ownerEmail: 'm.sterling@tribecaproperties.com',
    ownerPhone: '+1 (212) 555-0144',
    isFeatured: true,
  },
  {
    title: 'Silver Lake Mid-Century Modern Retreat',
    description: 'Designed in 1958 and meticulously restored, this post-and-beam architectural gem celebrates indoor-outdoor California living. Terrazzo flooring throughout, tongue-and-groove ceilings, floor-to-ceiling glass sliders opening to a private bamboo courtyard and heated plunge pool.',
    price: 1875000,
    listingType: 'sale',
    propertyType: 'house',
    bedrooms: 3,
    bathrooms: 2,
    areaSqft: 2150,
    address: '2814 Moreno Drive',
    city: 'Los Angeles',
    state: 'CA',
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Plunge Pool', 'Solar Panels', 'Terrazzo Flooring', 'Private Courtyard', 'EV Charger'],
    ownerName: 'Claire Laurent',
    ownerEmail: 'claire@laurentrealty.com',
    ownerPhone: '+1 (323) 555-0188',
    isFeatured: true,
  },
  {
    title: 'Biscayne Bayfront Residence & Private Dock',
    description: 'Ultra-contemporary waterfront estate on Venetian Islands with 100 feet of prime deep-water frontage. Open-concept entertaining spaces, Italian Dada kitchen, expansive rooftop terrace with panoramic Miami skyline sunsets, and deep-water dock accommodating up to a 75-foot yacht.',
    price: 4950000,
    listingType: 'sale',
    propertyType: 'villa',
    bedrooms: 6,
    bathrooms: 7,
    areaSqft: 6400,
    address: '840 Venetian Way',
    city: 'Miami',
    state: 'FL',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Private Yacht Dock', 'Heated Saltwater Pool', 'Rooftop Lounge', 'Home Cinema', 'Elevator', 'Security Gated'],
    ownerName: 'Ricardo Delgado',
    ownerEmail: 'rdelgado@biscayneluxury.com',
    ownerPhone: '+1 (305) 555-0129',
    isFeatured: true,
  },
  {
    title: 'Cherry Creek Modern Brownstone',
    description: 'Sophisticated 4-story luxury townhome nestled in vibrant Cherry Creek North. Handcrafted iron railings, wide-plank white oak flooring, private residential elevator, and a 4th-floor entertainment penthouse with outdoor fireplace and Rocky Mountain vistas.',
    price: 4200,
    listingType: 'rent',
    propertyType: 'house',
    bedrooms: 3,
    bathrooms: 4,
    areaSqft: 3100,
    address: '345 Columbine Street',
    city: 'Denver',
    state: 'CO',
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Rooftop Fireplace', 'In-Unit Elevator', 'Radiant Heated Floors', 'Attached 2-Car Garage', 'Walk to Boutiques'],
    ownerName: 'Hannah Meyer',
    ownerEmail: 'hannah@cherrycreekliving.com',
    ownerPhone: '+1 (303) 555-0167',
    isFeatured: false,
  },
  {
    title: 'Capitol Hill Nordic Penthouse',
    description: 'Scandi-inspired top-floor corner residence surrounded by evergreen foliage and city views. Light ash wood, integrated Gaggenau appliances, custom acoustic slat walls, and a wrap-around cedar terrace overlooking the Space Needle.',
    price: 3600,
    listingType: 'rent',
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1450,
    address: '1120 E Pine Street, Unit 6A',
    city: 'Seattle',
    state: 'WA',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Wrap-Around Deck', 'Space Needle Views', 'Gas Fireplace', 'Bike Storage', 'EV Charging Station'],
    ownerName: 'Lukas Lindstrom',
    ownerEmail: 'lukas@nordichomes.com',
    ownerPhone: '+1 (206) 555-0176',
    isFeatured: false,
  },
  {
    title: 'Historic Gold Coast Greystone Residence',
    description: 'Magnificent turn-of-the-century greystone mansion restored with flawless transitional finishes. Five levels of opulent living including ballroom-height ceilings, bespoke plaster moldings, state-of-the-art climate zoning, and heated cobblestone driveway.',
    price: 3250000,
    listingType: 'sale',
    propertyType: 'house',
    bedrooms: 6,
    bathrooms: 6,
    areaSqft: 6800,
    address: '1418 N Astor Street',
    city: 'Chicago',
    state: 'IL',
    images: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Historic Preservation', 'Heated Driveway', 'Library with Fireplace', 'Wine Cellar', 'Catering Kitchen'],
    ownerName: 'Arthur Kensington',
    ownerEmail: 'art@kensingtonproperties.com',
    ownerPhone: '+1 (312) 555-0118',
    isFeatured: true,
  },
  {
    title: 'The Foundry — Creative Tech & Design Studio Space',
    description: 'Premier brick-and-beam commercial creative headquarters in the heart of East Austin Innovation District. Concrete polished floors, 24-foot clear heights, overhead crane aesthetic, fiber optic infrastructure, and 12 dedicated executive parking spots.',
    price: 1850000,
    listingType: 'sale',
    propertyType: 'commercial',
    bedrooms: 0,
    bathrooms: 4,
    areaSqft: 8500,
    address: '1205 E 6th Street',
    city: 'Austin',
    state: 'TX',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['High-Speed Fiber', 'Roll-Up Glass Doors', 'Conference Rooms', 'Kitchenette', 'Private Parking Lot', 'HVAC Multi-Zone'],
    ownerName: 'Venture Real Estate Holdings',
    ownerEmail: 'leasing@ventureholdings.com',
    ownerPhone: '+1 (512) 555-0155',
    isFeatured: false,
  },
  {
    title: 'Sonoran Desert Modern Compound',
    description: 'A striking desert sanctuary built with rammed earth and blackened steel. Framing the McDowell Mountains, this home features seamless pocketing glass walls, resort-style desert landscaping, negative-edge pool, and detached private guest casita.',
    price: 3100000,
    listingType: 'sale',
    propertyType: 'villa',
    bedrooms: 4,
    bathrooms: 5,
    areaSqft: 4900,
    address: '10420 E Pinnacle Peak Road',
    city: 'Scottsdale',
    state: 'AZ',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Negative-Edge Pool', 'Guest Casita', 'Outdoor Fire Pit', 'Mountain Views', 'Smart Irrigation', 'Rammed Earth Design'],
    ownerName: 'Jackson Stone',
    ownerEmail: 'jstone@deserthomes.com',
    ownerPhone: '+1 (480) 555-0133',
    isFeatured: false,
  },
  {
    title: 'Music Row Loft & Executive Suite',
    description: 'Chic modern loft situated directly on Music Row. Boasts 11-foot exposed concrete ceilings, acoustic soundproofing insulation, acoustic baffle panels, private balcony overlooking the city skyline, and secure garage parking.',
    price: 2800,
    listingType: 'rent',
    propertyType: 'apartment',
    bedrooms: 1,
    bathrooms: 2,
    areaSqft: 1100,
    address: '1700 Grand Avenue, Apt 402',
    city: 'Nashville',
    state: 'TN',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Acoustic Soundproofing', 'Private Balcony', 'Fitness Center', 'Clubroom', 'Covered Parking'],
    ownerName: 'Sarah Jenkins',
    ownerEmail: 'sarah.j@nashvilleproperties.com',
    ownerPhone: '+1 (615) 555-0142',
    isFeatured: false,
  },
  {
    title: 'Pacific Heights Classical Edwardian Flat',
    description: 'Elegant top-floor flat overlooking the bay and Alcatraz Island. Intricate crown moldings, wood-burning fireplace, formal dining room, and an updated marble kitchen with French doors opening to an herb garden deck.',
    price: 5500,
    listingType: 'rent',
    propertyType: 'apartment',
    bedrooms: 3,
    bathrooms: 2,
    areaSqft: 1850,
    address: '2240 Vallejo Street',
    city: 'San Francisco',
    state: 'CA',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Bay Views', 'Wood Fireplace', 'Formal Dining', 'Private Garage', 'In-Unit Laundry'],
    ownerName: 'Julian Chen',
    ownerEmail: 'julian@chenrealty.com',
    ownerPhone: '+1 (415) 555-0160',
    isFeatured: false,
  },
  {
    title: 'Blue Ridge Mountain Crest Timber Home',
    description: 'Rustic luxury custom timber-frame home nestled on 8 secluded wooded acres. Floor-to-ceiling stone fireplace, hand-hewn logs, wrap-around covered porch with hot tub, and year-round panoramic mountain views.',
    price: 1395000,
    listingType: 'sale',
    propertyType: 'house',
    bedrooms: 4,
    bathrooms: 4,
    areaSqft: 3900,
    address: '512 Ridge Crest Way',
    city: 'Denver',
    state: 'CO',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['8 Private Acres', 'Hot Tub', 'Stone Fireplace', 'Timber Frame Craftsmanship', 'Hiking Trail Access'],
    ownerName: 'Wyatt Thorne',
    ownerEmail: 'wyatt@blueridgeliving.com',
    ownerPhone: '+1 (303) 555-0182',
    isFeatured: false,
  },
  {
    title: 'Hill Country Residential Development Acreage',
    description: 'Prime 12.5-acre development parcel situated in the coveted Dripping Springs school district. Gently sloping topography, mature heritage live oaks, seasonal creek bed, and approved municipal water utility access.',
    price: 890000,
    listingType: 'sale',
    propertyType: 'plot',
    bedrooms: 0,
    bathrooms: 0,
    areaSqft: 544500,
    address: 'Lot 14 Canyon Oaks Road',
    city: 'Austin',
    state: 'TX',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Heritage Oaks', 'Utility Hookups Available', 'No HOA Restrictions', 'Seasonal Creek'],
    ownerName: 'Travis County Land Partners',
    ownerEmail: 'parcels@travisland.com',
    ownerPhone: '+1 (512) 555-0104',
    isFeatured: false,
  },
  {
    title: 'Brickell Financial District Commercial Floor',
    description: 'Turnkey Class-A corporate office space occupying a premier corner position with floor-to-ceiling glass wrapping Brickell Avenue. Ready with executive boardroom, 8 conference suites, open collaborative desks, and full server closet.',
    price: 14500,
    listingType: 'rent',
    propertyType: 'commercial',
    bedrooms: 0,
    bathrooms: 4,
    areaSqft: 5200,
    address: '1111 Brickell Ave, Suite 2100',
    city: 'Miami',
    state: 'FL',
    images: [
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['24/7 Security Guard', 'Dedicated High-Speed Elevators', 'Boardroom AV System', 'Catering Galley', 'Valet Parking'],
    ownerName: 'Brickell Towers Management',
    ownerEmail: 'leasing@brickelltowers.com',
    ownerPhone: '+1 (305) 555-0177',
    isFeatured: false,
  },
  {
    title: 'Lincoln Park Modern Craftsman House',
    description: 'Charming blend of historic architectural proportions and contemporary lifestyle design. Steps from Oz Park, with private rear brick patio, custom chef kitchen, spa master bathroom, and finished lower level media lounge.',
    price: 1650000,
    listingType: 'sale',
    propertyType: 'house',
    bedrooms: 4,
    bathrooms: 4,
    areaSqft: 3400,
    address: '2134 N Clifton Ave',
    city: 'Chicago',
    state: 'IL',
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Finished Lower Level', 'Brick Courtyard Patio', 'Spa Bath', 'Smart Thermostats', 'Walk to Parks'],
    ownerName: 'Emily Goldberg',
    ownerEmail: 'emily@lincolnparkhomes.com',
    ownerPhone: '+1 (312) 555-0199',
    isFeatured: false,
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB. Clearing existing collections...');

    // Clear old data for a fresh seed
    await User.deleteMany();
    await Property.deleteMany();
    await Favorite.deleteMany();
    await Inquiry.deleteMany();

    console.log('Collections cleared.');

    // 1. Create Default Admin User
    const adminSalt = await bcrypt.genSalt(10);
    const adminHashedPassword = await bcrypt.hash('admin123', adminSalt);
    const adminUser = await User.create({
      name: 'BrickNest Admin',
      email: 'admin@bricknest.com',
      password: adminHashedPassword,
      role: 'admin',
    });
    console.log(`✅ Admin user seeded: ${adminUser.email} (password: admin123)`);

    // 2. Create Default Regular User
    const userSalt = await bcrypt.genSalt(10);
    const userHashedPassword = await bcrypt.hash('user123', userSalt);
    const regularUser = await User.create({
      name: 'Alex Mercer',
      email: 'user@bricknest.com',
      password: userHashedPassword,
      role: 'user',
    });
    console.log(`✅ Demo regular user seeded: ${regularUser.email} (password: user123)`);

    // 3. Seed Properties with createdBy referencing adminUser
    const propertiesWithCreator = propertiesData.map((prop) => ({
      ...prop,
      createdBy: adminUser._id,
    }));

    const insertedProperties = await Property.insertMany(propertiesWithCreator);
    console.log(`✅ Seeded ${insertedProperties.length} realistic properties!`);

    // 4. Seed an initial favorite for the demo user
    await Favorite.create({
      user: regularUser._id,
      property: insertedProperties[0]._id,
    });
    await Favorite.create({
      user: regularUser._id,
      property: insertedProperties[1]._id,
    });
    console.log('✅ Demo favorites seeded for user@bricknest.com');

    // 5. Seed an initial sample inquiry for the admin to view
    await Inquiry.create({
      property: insertedProperties[0]._id,
      name: 'Jordan Belfort',
      email: 'jordan@example.com',
      phone: '+1 (512) 555-8822',
      message: 'Hello, I am interested in scheduling a private viewing for this villa this upcoming Friday afternoon. Are financing pre-approvals required prior?',
    });
    await Inquiry.create({
      property: insertedProperties[1]._id,
      name: 'Samantha Fox',
      email: 'samantha.fox@example.com',
      phone: '+1 (212) 555-9031',
      message: 'Inquiring if the lease terms for this Tribeca loft allow for a 24-month duration, and what the move-in deposit requirements look like.',
    });
    console.log('✅ Demo customer inquiries seeded');

    console.log('\n🎉 Database seeding completed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
