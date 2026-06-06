import { PropertyListing } from "../types";

export const LUXURY_PROPERTIES: PropertyListing[] = [
  {
    id: "vanc-1",
    title: "The Sovereign Harbour Penthouse",
    description: "Suspended above Coal Harbour, this masterfully designed penthouse offers panoramic 360-degree vistas of the Vancouver Harbour, Stanley Park, and the North Shore mountains. Crafted with exquisite Italian marble, custom automated brass-inlaid paneling, and featuring a seamless 1,000 sq ft wrap-around heated terrace.",
    price: 12500,
    city: "Vancouver",
    neighborhood: "Coal Harbour / Waterfront",
    bedrooms: 3,
    bathrooms: 3.5,
    sqft: 2850,
    coordinates: {
      lat: 49.2895,
      lng: -123.1165
    },
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200"
    ],
    amenities: ["Waterfront", "Skyline View", "Private Pool", "Valet Parking", "24/7 Concierge", "Private Wine Cellar", "Steam Room"],
    type: "Penthouse",
    furnished: true,
    featured: true,
    nextAvailableDate: "Immediate"
  },
  {
    id: "vanc-2",
    title: "Harbourfront Luminary Residence",
    description: "An elegant, fully-furnished executive sanctuary located directly on the Vancouver Harbour. Featuring floor-to-ceiling window walls, a state-of-the-art Gaggenau kitchen, custom walnut cabinetry, and a private direct-elevator foyer. The absolute perfect fit for global leaders seeking understated luxury near downtown.",
    price: 3950,
    city: "Vancouver",
    neighborhood: "Vancouver Harbour / Downtown",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1220,
    coordinates: {
      lat: 49.2872,
      lng: -123.1118
    },
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200"
    ],
    amenities: ["Waterfront", "Skyline View", "24/7 Concierge", "Gym & Spa Access", "Heated Balcony", "Smart Home Tech", "Private Gym", "Pet Friendly"],
    type: "Condo",
    furnished: true,
    featured: true,
    nextAvailableDate: "August 1, 2026"
  },
  {
    id: "vanc-3",
    title: "Yaletown Glass Loft Pavilion",
    description: "Boasting double-height 18-foot ceilings, this designer-furnished loft pavilion represents Yaletown modernism at its finest. Exposed structural concrete elements contrast beautifully with custom gold lighting fixtures and curated velvet furnishings. Features a generous private courtyard terrace.",
    price: 4900,
    city: "Vancouver",
    neighborhood: "Yaletown",
    bedrooms: 1,
    bathrooms: 2,
    sqft: 1150,
    coordinates: {
      lat: 49.2765,
      lng: -123.1215
    },
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1200"
    ],
    amenities: ["Skyline View", "Double-Height Ceilings", "Private Courtyard", "Valet Parking", "Concierge Service"],
    type: "Loft",
    furnished: true,
    featured: false,
    nextAvailableDate: "Immediate"
  },
  {
    id: "vanc-4",
    title: "The Georgia Estate Townhome",
    description: "Nestled in Vancouver's prestige district, this multi-level luxurious townhouse blends private residence privacy with five-star hotel services. Enjoy your private secure two-car garage, personal wellness area with Finnish sauna, and a sweeping private rooftop garden with outdoor fire pit.",
    price: 8500,
    city: "Vancouver",
    neighborhood: "Downtown West / West End",
    bedrooms: 2,
    bathrooms: 2.5,
    sqft: 1950,
    coordinates: {
      lat: 49.2831,
      lng: -123.1212
    },
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=1200"
    ],
    amenities: ["Rooftop Garden", "Private Garage", "Personal Sauna", "Fireplace", "Concierge Service", "Skyline View", "Pet Friendly"],
    type: "Townhouse",
    furnished: true,
    featured: false,
    nextAvailableDate: "July 15, 2026"
  },
  {
    id: "toro-1",
    title: "The Bloor-West Imperial Penthouse",
    description: "Encompassing the entire topmost floor of Toronto's most sought-after Yorkville building, this ultra-exclusive residence represents the standard of visual craft. Surrounded by soaring floor-to-ceiling custom glass, every window looks out onto the striking CN Tower and downtown Toronto outline.",
    price: 16500,
    city: "Toronto",
    neighborhood: "Yorkville",
    bedrooms: 4,
    bathrooms: 4.5,
    sqft: 3450,
    coordinates: {
      lat: 43.6695,
      lng: -79.3865
    },
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200"
    ],
    amenities: ["Skyline View", "Private Pool", "Valet Parking", "24/7 Concierge", "Integrated Humidification", "Private Wellness Center", "Private Gym"],
    type: "Penthouse",
    furnished: true,
    featured: true,
    nextAvailableDate: "Immediate"
  },
  {
    id: "toro-2",
    title: "Yorkville Gilded Conservatory Loft",
    description: "A showcase of custom hand-picked elements: chevron-patterned dark oak flooring, brushed gold moldings, and double-height custom arch windows. Fully furnished with high-end European designer brands, this conservation loft is the definitive choice for design-conscious executives.",
    price: 5200,
    city: "Toronto",
    neighborhood: "Yorkville",
    bedrooms: 1,
    bathrooms: 1.5,
    sqft: 1080,
    coordinates: {
      lat: 43.6702,
      lng: -79.3912
    },
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200"
    ],
    amenities: ["Skyline View", "Double-Height Ceilings", "Smart Home Tech", "Gym & Pool Facility", "24/7 Security", "Private Gym"],
    type: "Loft",
    furnished: true,
    featured: false,
    nextAvailableDate: "September 1, 2026"
  },
  {
    id: "toro-3",
    title: "Marina Panorama Sanctuary",
    description: "Located high above the vibrant Queen's Quay on the Toronto Waterfront, this spacious 2-bedroom home enjoys uninterrupted vistas of Lake Ontario. Features a custom stone fireplace, premium bespoke audio systems integrated across all rooms, and a massive heated balcony overlooking the yacht club.",
    price: 6100,
    city: "Toronto",
    neighborhood: "Toronto Waterfront",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1450,
    coordinates: {
      lat: 43.6385,
      lng: -79.3872
    },
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=1200"
    ],
    amenities: ["Waterfront", "Skyline View", "Fireplace", "Heated Balcony", "Valet Parking", "24/7 Concierge"],
    type: "Condo",
    furnished: true,
    featured: true,
    nextAvailableDate: "Immediate"
  },
  {
    id: "toro-4",
    title: "The Distillery Heritage Estate",
    description: "A breathtaking warehouse conversion showcasing stunning original red brick masonry, steel columns, and newly inlaid gold detailing. Boasts a massive bespoke open-plan chef's kitchen, custom luxury lighting, and direct internal resident access to private wellness and cinema club.",
    price: 7800,
    city: "Toronto",
    neighborhood: "Distillery District",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1750,
    coordinates: {
      lat: 43.6503,
      lng: -79.3592
    },
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200"
    ],
    amenities: ["Skyline View", "Exposed Heritage Brick", "Resident Cinema Access", "Smart Home Tech", "Concierge Service", "Pet Friendly"],
    type: "Townhouse",
    furnished: true,
    featured: false,
    nextAvailableDate: "July 1, 2026"
  }
];

export const UNIQUE_AMENITIES = Array.from(
  new Set(LUXURY_PROPERTIES.flatMap((p) => p.amenities))
).sort();
