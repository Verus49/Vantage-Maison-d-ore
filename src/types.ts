export interface PropertyListing {
  id: string;
  title: string;
  description: string;
  price: number;
  city: "Vancouver" | "Toronto";
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  amenities: string[];
  type: "Condo" | "Penthouse" | "Loft" | "Townhouse";
  furnished: boolean;
  featured?: boolean;
}

export interface SearchFilters {
  city: "all" | "Vancouver" | "Toronto";
  type: "all" | "Condo" | "Penthouse" | "Loft" | "Townhouse";
  minPrice: number;
  maxPrice: number;
  bedrooms: number | "all";
  amenities: string[];
  searchQuery: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "concierge";
  text: string;
  timestamp: string;
  suggestedFilters?: Partial<SearchFilters>;
  matchingListingIds?: string[];
}

export interface BookingApplication {
  id: string;
  propertyId: string;
  propertyName: string;
  fullName: string;
  email: string;
  phone: string;
  moveInDate: string;
  durationMonths: number;
  specialRequests: string[];
  status: "pending" | "confirmed" | "viewing_scheduled";
  createdAt: string;
}
