import React, { useState, useMemo } from "react";
import { PropertyListing, SearchFilters, ChatMessage, BookingApplication } from "./types";
import { LUXURY_PROPERTIES } from "./data/properties";
import PropertyMap from "./components/PropertyMap";
import AIConcierge from "./components/AIConcierge";
import PropertyCard from "./components/PropertyCard";
import LuxuryFilters from "./components/LuxuryFilters";
import BookingModal from "./components/BookingModal";
import VirtualTourModal from "./components/VirtualTourModal";
import CompareModal from "./components/CompareModal";
import PriceTrendsChart from "./components/PriceTrendsChart";
import ClientExperiences from "./components/ClientExperiences";
import { LuxuryGridSkeleton } from "./components/PropertyCardSkeleton";
import { Compass, Sparkles, Building, Crown, Landmark, UserCheck, CheckCircle2, ChevronRight, MapPin, Eye, Calendar, AlertCircle, Heart, GitCompare, X, Bell, PawPrint, Dumbbell, Anchor } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Global States
  const [filters, setFilters] = useState<SearchFilters>({
    city: "all",
    type: "all",
    minPrice: 0,
    maxPrice: 20000,
    bedrooms: "all",
    amenities: [],
    searchQuery: ""
  });

  // Curated Favorites Collection Local States
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("vantage_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

  // Sync favorites collection to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem("vantage_favorites", JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed persisting curation favorites to partition storage", e);
    }
  }, [favorites]);

  const handleToggleFavorite = (propertyId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(propertyId);
      if (isFav) {
        return prev.filter((id) => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  };

  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [bookingProperty, setBookingProperty] = useState<PropertyListing | null>(null);
  const [virtualTourProperty, setVirtualTourProperty] = useState<PropertyListing | null>(null);

  // Prefill State for direct AI concierge inquiries
  const [prefilledInquiry, setPrefilledInquiry] = useState<string>("");

  const handlePropertyInquiry = (property: PropertyListing) => {
    const messageTemplate = `Greetings Concierge. I am deeply interested in securing further material details on the exquisite suite: '${property.title}' in the neighborhood of ${property.neighborhood}, ${property.city}. What are the primary bespoke features and available showing options?`;
    setPrefilledInquiry(messageTemplate);

    setTimeout(() => {
      const chatPanel = document.getElementById("ai-concierge-chat-panel");
      if (chatPanel) {
        chatPanel.scrollIntoView({ behavior: "smooth", block: "center" });
        const inputElement = chatPanel.querySelector("input");
        if (inputElement) {
          inputElement.focus();
        }
      }
    }, 150);
  };

  // Premium Alerts Subscription States
  const [subscriptions, setSubscriptions] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("maison_subscriptions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showAlertsOnly, setShowAlertsOnly] = useState<boolean>(false);

  // Sync subscriptions list to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem("maison_subscriptions", JSON.stringify(subscriptions));
    } catch (e) {
      console.error("Failed persisting alerts list to storage", e);
    }
  }, [subscriptions]);

  const handleSubscribeUpdate = (propertyId: string, email: string, priceAlert: boolean, availAlert: boolean) => {
    setSubscriptions((prev) => {
      const existingIdx = prev.findIndex((sub) => sub.propertyId === propertyId);
      const newSub = { propertyId, email, priceAlert, availAlert, timestamp: new Date().toLocaleDateString() };
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx] = newSub;
        return copy;
      } else {
        return [...prev, newSub];
      }
    });

    const p = LUXURY_PROPERTIES.find((item) => item.id === propertyId);
    if (p) {
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          {
            id: `alert-reg-${Date.now()}`,
            sender: "concierge",
            text: `Priorities registered: Verified secure tracking dispatch for "${p.title}" on email address "${email}". Price drop and availability status shifts have been synced to our live ledger.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]);
      }, 1000);
    }
  };

  const handleUnsubscribeUpdate = (propertyId: string) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.propertyId !== propertyId));
    const p = LUXURY_PROPERTIES.find((item) => item.id === propertyId);
    if (p) {
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          {
            id: `alert-unreg-${Date.now()}`,
            sender: "concierge",
            text: `Alert monitoring has been terminated for "${p.title}".`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]);
      }, 1000);
    }
  };

  // Side-by-Side Comparator States
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [compareWarning, setCompareWarning] = useState<string | null>(null);

  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        return prev.filter((item) => item !== id);
      } else {
        if (prev.length >= 3) {
          setCompareWarning("You can select up to a maximum of 3 luxury properties to compare side-by-side simultaneously.");
          setTimeout(() => setCompareWarning(null), 5500);
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const handleRemoveFromCompare = (id: string) => {
    setCompareIds((prev) => prev.filter((item) => item !== id));
  };

  // Memoized array of compared properties
  const comparedPropertiesList = useMemo(() => {
    return LUXURY_PROPERTIES.filter((p) => compareIds.includes(p.id));
  }, [compareIds]);
  const [activeMapCity, setActiveMapCity] = useState<"Vancouver" | "Toronto">("Vancouver");
  const [isUpdatingPortfolio, setIsUpdatingPortfolio] = useState(false);

  React.useEffect(() => {
    setIsUpdatingPortfolio(true);
    const timer = setTimeout(() => {
      setIsUpdatingPortfolio(false);
    }, 650);
    return () => clearTimeout(timer);
  }, [filters, showFavoritesOnly, showAlertsOnly]);
  
  // Real-time Booking / Applications Storage
  const [applications, setApplications] = useState<BookingApplication[]>([]);

  // AI Concierge Chat History
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "greeting",
      sender: "concierge",
      text: "Welcome to Maison d'Or. I am your private AI rental concierge. Over elite districts in Vancouver and Toronto, I curate hand-picked executive lofts, luxury waterfront condos, and penthouse sanctuaries.\n\nTell me: 'I am an international executive looking for a 2-bedroom furnished condo near Vancouver Harbour with a budget of $4,000' and I will instantly tailor our portfolio to your exact specifications.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  // Adjust active map focus automatically if filters city changes
  React.useEffect(() => {
    if (filters.city !== "all") {
      setActiveMapCity(filters.city);
    }
  }, [filters.city]);

  // Combined Filters Logic
  const filteredProperties = useMemo(() => {
    return LUXURY_PROPERTIES.filter((p) => {
      // Favorites filtering
      if (showFavoritesOnly && !favorites.includes(p.id)) {
        return false;
      }
      // Active Alerts monitoring filter
      if (showAlertsOnly && !subscriptions.some((sub) => sub.propertyId === p.id)) {
        return false;
      }
      // City checking
      if (filters.city !== "all" && p.city !== filters.city) {
        return false;
      }
      // Suite type checking
      if (filters.type !== "all" && p.type !== filters.type) {
        return false;
      }
      // Price range checking
      if (p.price > filters.maxPrice) {
        return false;
      }
      // Bedrooms checking
      if (filters.bedrooms !== "all" && p.bedrooms !== Number(filters.bedrooms)) {
        return false;
      }
      // Amenities checking
      if (filters.amenities.length > 0) {
        const carriesAttrs = filters.amenities.every((amen) => p.amenities.includes(amen));
        if (!carriesAttrs) return false;
      }
      // Keyword search query checking
      if (filters.searchQuery.trim() !== "") {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesNeighborhood = p.neighborhood.toLowerCase().includes(query);
        const matchesAmenities = p.amenities.some((amenity) => amenity.toLowerCase().includes(query));
        
        if (!matchesTitle && !matchesDesc && !matchesNeighborhood && !matchesAmenities) {
          return false;
        }
      }
      return true;
    });
  }, [filters, showFavoritesOnly, showAlertsOnly, favorites, subscriptions]);

  const handleApplyAIFilters = (aiFilters: Partial<SearchFilters>) => {
    setFilters((prev) => {
      const updated = { ...prev };
      
      if (aiFilters.city !== undefined) updated.city = aiFilters.city;
      if (aiFilters.type !== undefined) updated.type = aiFilters.type;
      if (aiFilters.maxPrice !== undefined) updated.maxPrice = aiFilters.maxPrice;
      if (aiFilters.bedrooms !== undefined) updated.bedrooms = aiFilters.bedrooms;
      if (aiFilters.amenities !== undefined) {
        // Overlay instead of overwrite optionally, or clean overwrite
        updated.amenities = aiFilters.amenities;
      }
      return updated;
    });
  };

  const handleCreateApplication = (formData: any) => {
    if (!bookingProperty) return;

    const newApp: BookingApplication = {
      id: `app-${Date.now()}`,
      propertyId: bookingProperty.id,
      propertyName: bookingProperty.title,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      moveInDate: formData.moveInDate,
      durationMonths: formData.durationMonths,
      specialRequests: formData.specialRequests,
      status: "pending",
      createdAt: new Date().toLocaleDateString()
    };

    setApplications((prev) => [newApp, ...prev]);
    
    // Add contextually aware messaging inside chat
    setTimeout(() => {
      const responseText = `Masterful choice, ${formData.fullName}. Your formal occupancy application for "${bookingProperty.title}" has been registered within your Private Client portal. Our luxury underwriters are evaluating your profiling. Private transfer services and pre-arrival stocked accommodations will be finalized next.`;
      
      setChatHistory((prev) => [
        ...prev,
        {
          id: `status-${Date.now()}`,
          sender: "concierge",
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }, 1200);

    setBookingProperty(null);
  };

  const resetAllFilters = () => {
    setFilters({
      city: "all",
      type: "all",
      minPrice: 0,
      maxPrice: 20000,
      bedrooms: "all",
      amenities: [],
      searchQuery: ""
    });
    setShowFavoritesOnly(false);
    setShowAlertsOnly(false);
  };

  // Locate the property pin and center onto map coordinates
  const handleLocateProperty = (p: PropertyListing) => {
    setSelectedProperty(p);
    setActiveMapCity(p.city);
    
    const container = document.getElementById("map-console-panel");
    if (container) {
      container.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-[#D4AF37] selection:text-black custom-scrollbar bg-grid-pattern pb-12">
      {/* Decorative Gold Header Toprail */}
      <div className="h-[2px] bg-[#D4AF37]/80 z-50 relative" />

      {/* Luxury Navbar header */}
      <header className="border-b border-[#D4AF37]/20 bg-black/40 backdrop-blur-md sticky top-0 z-40 select-none px-6 md:px-12 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border border-[#D4AF37] flex items-center justify-center transform rotate-45 bg-[#050505]">
              <div className="w-4 h-4 bg-[#D4AF37] transform rotate-12" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-serif font-bold tracking-[0.3em] text-zinc-100 flex items-center leading-none">
                VANTAGE
              </h1>
              <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase mt-1 block">
                Maison d'Or Residential Registry
              </span>
            </div>
          </div>

          <nav className="hidden md:flex gap-12 text-[11px] uppercase tracking-widest text-white/70 font-medium">
            <span
              onClick={() => {
                setShowFavoritesOnly(false);
                setShowAlertsOnly(false);
                setFilters((prev) => ({ ...prev, city: "all" }));
              }}
              className={`hover:text-[#D4AF37] transition-all cursor-pointer ${
                !showFavoritesOnly && !showAlertsOnly && filters.city === "all" ? "text-[#D4AF37] font-bold border-b border-[#D4AF37]/55 pb-1" : ""
              }`}
            >
              Collections
            </span>
            <span
              onClick={() => {
                setShowFavoritesOnly(false);
                setShowAlertsOnly(false);
                setFilters((prev) => ({ ...prev, city: "Vancouver" }));
              }}
              className={`hover:text-[#D4AF37] transition-all cursor-pointer ${
                !showFavoritesOnly && !showAlertsOnly && filters.city === "Vancouver" ? "text-[#D4AF37] font-bold border-b border-[#D4AF37]/55 pb-1" : ""
              }`}
            >
              Vancouver
            </span>
            <span
              onClick={() => {
                setShowFavoritesOnly(false);
                setShowAlertsOnly(false);
                setFilters((prev) => ({ ...prev, city: "Toronto" }));
              }}
              className={`hover:text-[#D4AF37] transition-all cursor-pointer ${
                !showFavoritesOnly && !showAlertsOnly && filters.city === "Toronto" ? "text-[#D4AF37] font-bold border-b border-[#D4AF37]/55 pb-1" : ""
              }`}
            >
              Toronto
            </span>
            <span
              onClick={() => {
                setShowFavoritesOnly(true);
                setShowAlertsOnly(false);
              }}
              className={`hover:text-[#D4AF37] transition-all cursor-pointer flex items-center gap-1.5 ${
                showFavoritesOnly ? "text-[#D4AF37] font-bold border-b border-[#D4AF37]/55 pb-1" : ""
              }`}
              title="Filter exclusively by your favorited luxury curations"
            >
              <Heart className={`w-3.5 h-3.5 transition-transform ${favorites.length > 0 ? "fill-[#D4AF37] text-[#D4AF37] scale-110" : "text-zinc-500"}`} />
              <span>Favorites ({favorites.length})</span>
            </span>
            <span
              onClick={() => {
                setShowFavoritesOnly(false);
                setShowAlertsOnly(true);
              }}
              className={`hover:text-[#D4AF37] transition-all cursor-pointer flex items-center gap-1.5 ${
                showAlertsOnly ? "text-[#D4AF37] font-bold border-b border-[#D4AF37]/55 pb-1" : ""
              }`}
              title="Filter exclusively by suites with active notification watches"
            >
              <Bell className={`w-3.5 h-3.5 transition-transform ${subscriptions.length > 0 ? "fill-[#D4AF37] text-[#D4AF37] scale-110 animate-bounce" : "text-zinc-500"}`} />
              <span>Alerts ({subscriptions.length})</span>
            </span>
          </nav>

          <button className="px-6 py-2 border border-[#D4AF37] text-[10px] uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all">
            Private Client Portal
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Luxury Hero Banner / Splat Section */}
        <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#121212] via-[#080808] to-[#121212] border border-[#D4AF37]/20 p-8 md:p-12 shadow-[0_0_30px_rgba(212,175,55,0.05)] flex flex-col md:flex-row items-center justify-between gap-8 select-none">
          {/* Simulated High-Res Background Image inside the theme */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80')] bg-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          
          {/* Subtle background luxury glow */}
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[110px] transform -translate-y-1/2 pointer-events-none" />

          <div className="space-y-4 max-w-xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/60 border border-[#D4AF37]/35 rounded-none text-[10px] font-mono text-[#D4AF37] tracking-wider">
              <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>THE FIVE-STAR PORTFOLIO STANDARD</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-white leading-tight">
              Where AI Meets <span className="text-[#D4AF37] italic">Bespoke Living</span>
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Maison d'Or fuses fully-furnished architectural properties in Vancouver & Toronto with elite automated booking tools. Consult our digital concierge to locate and secure high-spec townhomes, skyline lofts, or harborside masterpieces.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0 max-w-sm relative z-10">
            <div className="bg-black/55 border border-white/10 p-5 rounded-none flex items-center gap-3">
              <div className="w-9 h-9 rounded-none bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <Crown className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-white/40 block uppercase">Catalog pricing</span>
                <span className="text-sm font-semibold font-mono text-[#D4AF37]">$3.9k - $16.5k</span>
              </div>
            </div>
            
            <div className="bg-black/55 border border-white/10 p-5 rounded-none flex items-center gap-3">
              <div className="w-9 h-9 rounded-none bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <UserCheck className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-white/40 block uppercase">Resident Match</span>
                <span className="text-sm font-semibold font-mono text-white font-medium">100% Accredited</span>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Map and AI Concierge Side-by-Side block */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Interactive Custom SVG Vector Luxury Map Map */}
          <div className="space-y-3.5">
            <div className="flex justify-between items-center px-1">
              <div>
                <h3 className="text-sm font-serif font-bold uppercase text-zinc-100 tracking-wide">
                  Metropolitan Yacht Grids
                </h3>
                <p className="text-[10px] font-mono text-zinc-500">
                  Select a city to pan, zoom, or align coordinating property coordinates
                </p>
              </div>

              {/* City Map Selector */}
              <div className="flex gap-1.5 bg-black border border-[#D4AF37]/20 p-1 rounded-sm font-mono text-[10px]">
                <button
                  onClick={() => setActiveMapCity("Vancouver")}
                  className={`px-3 py-1 rounded-sm transition-all cursor-pointer ${
                    activeMapCity === "Vancouver"
                      ? "bg-[#D4AF37] text-black font-bold"
                      : "text-zinc-400 hover:text-zinc-250 hover:text-white"
                  }`}
                >
                  VANCOUVER
                </button>
                <button
                  onClick={() => setActiveMapCity("Toronto")}
                  className={`px-3 py-1 rounded-sm transition-all cursor-pointer ${
                    activeMapCity === "Toronto"
                      ? "bg-[#D4AF37] text-black font-bold"
                      : "text-zinc-400 hover:text-zinc-250 hover:text-white"
                  }`}
                >
                  TORONTO
                </button>
              </div>
            </div>

            <PropertyMap
              properties={filteredProperties}
              selectedProperty={selectedProperty}
              onSelectProperty={(p) => setSelectedProperty(p)}
              activeCity={activeMapCity}
            />
          </div>

          {/* AI Rental Concierge Chat Box panel */}
          <div id="ai-concierge-chat-panel" className="space-y-3.5">
            <div className="px-1">
              <h3 className="text-sm font-serif font-bold uppercase text-zinc-100 tracking-wide">
                Direct Client Communication
              </h3>
              <p className="text-[10px] font-mono text-zinc-500">
                Type instructions naturally to instantly configure catalog specs
              </p>
            </div>
            
            <AIConcierge
              onApplyFilters={handleApplyAIFilters}
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              prefilledInput={prefilledInquiry}
              onClearPrefill={() => setPrefilledInquiry("")}
            />
          </div>
        </section>

        {/* Private Resident Portal / Applications Dashboard */}
        {applications.length > 0 && (
          <section className="bg-[#0b0b0b] border border-[#D4AF37]/30 rounded-none p-5 md:p-6 shadow-[0_0_20px_rgba(212,175,55,0.06)] select-none">
            <div className="flex items-center gap-3.5 border-b border-zinc-900 pb-4 mb-4.5">
              <div className="w-9 h-9 border border-[#D4AF37]/35 bg-black flex items-center justify-center text-[#D4AF37]">
                <CheckCircle2 className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-serif uppercase text-zinc-100 tracking-widest font-semibold">
                  Private Client Portals & Active Proposals
                </h3>
                <p className="text-[10px] font-mono text-zinc-500">
                  Real-time underwrite evaluation and lifestyle logistics track
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-black/65 border border-zinc-900 p-4 rounded-none flex gap-3.5 items-start hover:border-[#D4AF37]/30 transition-colors"
                >
                  <div className="w-9 h-9 border border-zinc-800 bg-zinc-950 flex items-center justify-center font-serif text-[#D4AF37] font-semibold shrink-0">
                    V
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-serif font-bold text-zinc-250 truncate pr-2">
                        {app.propertyName}
                      </h4>
                      <span className="shrink-0 bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-[8px] uppercase tracking-wider px-2 py-0.5">
                        UNDERWRITE REVIEW
                      </span>
                    </div>

                    <p className="text-[9px] font-mono text-zinc-400">
                      Applicant: {app.fullName} • Proposed Move-in: {app.moveInDate}
                    </p>
                    
                    <div className="flex gap-2.5 pt-1.5 font-mono text-[9px] text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#D4AF37]" />
                        <span>Duration: {app.durationMonths} m</span>
                      </span>
                      <span>•</span>
                      <span className="text-[#D4AF37]/80">
                        {app.specialRequests.length ? `${app.specialRequests.length} custom specs` : "Standard VIP Package"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Real Estate Database Filter Bar */}
        <section className="space-y-4">
          <div className="px-1">
            <h3 className="text-xs font-serif uppercase text-zinc-100 tracking-widest font-semibold">
              Browse Residential Registries
            </h3>
            <p className="text-[10px] font-mono text-zinc-500">
              Refine listings using high-end specs or manual search params
            </p>
          </div>

          <LuxuryFilters
            filters={filters}
            setFilters={setFilters}
            onReset={resetAllFilters}
            resultCount={filteredProperties.length}
            showFavoritesOnly={showFavoritesOnly}
            setShowFavoritesOnly={setShowFavoritesOnly}
            favoritesCount={favorites.length}
          />
        </section>

        {/* Curated Listings Grid */}
        <section className="space-y-5">
          {/* Quick Portfolio Filter Chips Row */}
          <div className="bg-[#040404] border border-zinc-900/70 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">Quick Curations</span>
                <p className="text-[9px] font-mono text-zinc-500 leading-none">Instant one-tap filtering of luxury specs</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              {[
                {
                  id: "pet-friendly",
                  label: "Pet Friendly",
                  icon: PawPrint,
                  isActive: filters.amenities.includes("Pet Friendly"),
                  toggle: () => {
                    setFilters((prev) => ({
                      ...prev,
                      amenities: prev.amenities.includes("Pet Friendly")
                        ? prev.amenities.filter((a) => a !== "Pet Friendly")
                        : [...prev.amenities, "Pet Friendly"]
                    }));
                  }
                },
                {
                  id: "harbour-view",
                  label: "Harbour View",
                  icon: Anchor,
                  isActive: filters.searchQuery.toLowerCase().trim() === "harbour",
                  toggle: () => {
                    setFilters((prev) => ({
                      ...prev,
                      searchQuery: prev.searchQuery.toLowerCase().trim() === "harbour" ? "" : "Harbour"
                    }));
                  }
                },
                {
                  id: "private-gym",
                  label: "Private Gym",
                  icon: Dumbbell,
                  isActive: filters.amenities.includes("Private Gym"),
                  toggle: () => {
                    setFilters((prev) => ({
                      ...prev,
                      amenities: prev.amenities.includes("Private Gym")
                        ? prev.amenities.filter((a) => a !== "Private Gym")
                        : [...prev.amenities, "Private Gym"]
                    }));
                  }
                },
                {
                  id: "penthouse",
                  label: "Penthouse",
                  icon: Crown,
                  isActive: filters.type === "Penthouse",
                  toggle: () => {
                    setFilters((prev) => ({
                      ...prev,
                      type: prev.type === "Penthouse" ? "all" : "Penthouse"
                    }));
                  }
                }
              ].map((chip) => {
                const IconComponent = chip.icon;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={chip.toggle}
                    className={`flex items-center gap-2 rounded-none px-3.5 py-1.5 text-xs font-mono transition-all duration-300 pointer-events-auto cursor-pointer border ${
                      chip.isActive
                        ? "bg-[#D4AF37] text-black border-[#D4AF37] font-medium shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                        : "bg-black text-zinc-400 border-zinc-900 hover:border-[#D4AF37]/50 hover:text-white"
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 shrink-0 ${chip.isActive ? "text-black" : "text-[#D4AF37]"}`} />
                    <span>{chip.label}</span>
                    {chip.isActive && (
                      <span className="w-1.5 h-1.5 bg-black rounded-full shrink-0" />
                    )}
                  </button>
                );
              })}

              {(filters.amenities.includes("Pet Friendly") || 
                filters.amenities.includes("Private Gym") || 
                filters.searchQuery.toLowerCase().trim() === "harbour" || 
                filters.type === "Penthouse") && (
                <button
                  type="button"
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      amenities: prev.amenities.filter(a => a !== "Pet Friendly" && a !== "Private Gym"),
                      searchQuery: prev.searchQuery.toLowerCase().trim() === "harbour" ? "" : prev.searchQuery,
                      type: prev.type === "Penthouse" ? "all" : prev.type
                    }));
                  }}
                  className="text-[9px] font-mono text-zinc-500 hover:text-[#D4AF37] transition-colors cursor-pointer px-2 py-1.5 hover:underline decoration-1"
                >
                  Clear presets
                </button>
              )}
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {isUpdatingPortfolio ? (
              <LuxuryGridSkeleton key="skeleton-loader" />
            ) : filteredProperties.length > 0 ? (
              <motion.div
                key="listings-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {filteredProperties.map((p) => (
                  <PropertyCard
                    key={p.id}
                    property={p}
                    isSelected={selectedProperty?.id === p.id}
                    onLocateOnMap={() => handleLocateProperty(p)}
                    onBookShowing={() => setBookingProperty(p)}
                    onOpenVirtualTour={() => setVirtualTourProperty(p)}
                    isFavorite={favorites.includes(p.id)}
                    onToggleFavorite={() => handleToggleFavorite(p.id)}
                    isComparing={compareIds.includes(p.id)}
                    onToggleCompare={() => handleToggleCompare(p.id)}
                    isSubscribed={subscriptions.some((sub) => sub.propertyId === p.id)}
                    activeSubscription={subscriptions.find((sub) => sub.propertyId === p.id)}
                    onSubscribe={(email, priceAlert, availAlert) => handleSubscribeUpdate(p.id, email, priceAlert, availAlert)}
                    onUnsubscribe={() => handleUnsubscribeUpdate(p.id)}
                    onDirectInquiry={() => handlePropertyInquiry(p)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#0b0b0b] border border-[#D4AF37]/30 rounded-none py-16 px-6 text-center max-w-md mx-auto space-y-4 shadow-[0_0_30px_rgba(212,175,55,0.05)]"
              >
                <div className="w-12 h-12 bg-black border border-[#D4AF37]/35 rounded-none flex items-center justify-center text-[#D4AF37] mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-base font-serif font-normal text-zinc-200">No curations matched</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    Vantage currently does not have active fully furnished vacancies matching those exact parameters. Please reset filters or ask La Concierge to optimize parameters.
                  </p>
                </div>
                <button
                  onClick={resetAllFilters}
                  className="bg-black border border-[#D4AF37]/45 text-xs font-mono px-5 py-3 tracking-widest text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black hover:font-bold transition-all uppercase cursor-pointer"
                >
                  Clear filter bounds
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Elite Client Testimonial Carousel */}
        <ClientExperiences />

        {/* Brand Price Trends Analytics Suite */}
        <PriceTrendsChart />
      </main>

      {/* Decorative Elegant Footer with humble & premium labels */}
      <footer className="border-t border-[#D4AF37]/15 bg-black py-12 select-none text-[10px] text-zinc-550 font-mono">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-[#D4AF37] flex items-center justify-center transform rotate-45 shrink-0">
                <div className="w-2 h-2 bg-[#D4AF37]" />
              </div>
              <span className="font-serif font-bold text-zinc-300 tracking-widest uppercase">VANTAGE ESTATE PARTNERS © 2026</span>
            </div>
            <div className="flex gap-6 text-zinc-500">
              <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">Digital Privacy Protocol</span>
              <span>•</span>
              <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">Exclusive Terms of Service</span>
            </div>
          </div>

          <p className="text-center text-[9px] text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Vantage is an accredited and registered platform for booking fully-furnished luxury corporate housing, estate lofts, and residential penthouses. Content synchronized with our premier private AI database.
          </p>

          {/* Founder & Designer Stamp Block */}
          <div className="relative max-w-xl mx-auto border border-[#D4AF37]/20 bg-[#080808]/75 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 select-text">
            {/* Geometric accents */}
            <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#D4AF37]/45" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-[#D4AF37]/45" />
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black border border-[#D4AF37]/35 flex items-center justify-center text-xs font-serif text-[#D4AF37] select-none shrink-0 tracking-widest">
                RT
              </div>
              <div className="text-left">
                <span className="text-[8px] tracking-widest text-[#D4AF37]/80 block font-mono uppercase mb-0.5">FOUNDER & CHIEF DESIGNER</span>
                <span className="text-xs font-serif text-zinc-100 font-bold block uppercase tracking-wider">Rafik Tourki</span>
              </div>
            </div>

            <div className="flex flex-col sm:items-end text-[9px] font-mono text-zinc-400 gap-1 text-center sm:text-right">
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2.5 justify-center">
                <a href="mailto:rafik.rr@hotmail.com" className="hover:text-[#D4AF37] transition-colors">rafik.rr@hotmail.com</a>
                <span className="hidden sm:inline text-zinc-800">|</span>
                <a href="tel:+213672185177" className="hover:text-[#D4AF37] transition-colors">+213 67 218 5177</a>
              </div>
              <a 
                href="https://gini.so/passport/rafik-tourki-30dea4" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-1 inline-flex items-center gap-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37] border border-[#D4AF37]/40 text-[#D4AF37] hover:text-black px-2 py-0.5 text-[8px] uppercase tracking-wider transition-all"
              >
                <span className="w-1 h-1 bg-[#D4AF37] rounded-none inline-block animate-pulse" />
                <span>Verified Designer Passport</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Booking application Modal view */}
      <AnimatePresence>
        {bookingProperty && (
          <BookingModal
            property={bookingProperty}
            isOpen={!!bookingProperty}
            onClose={() => setBookingProperty(null)}
            onSubmit={handleCreateApplication}
          />
        )}
      </AnimatePresence>

      {/* Virtual 3D Tour Modal View */}
      <AnimatePresence>
        {virtualTourProperty && (
          <VirtualTourModal
            property={virtualTourProperty}
            isOpen={!!virtualTourProperty}
            onClose={() => setVirtualTourProperty(null)}
          />
        )}
      </AnimatePresence>

      {/* Floating Compare Action Deck */}
      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-[92%] max-w-lg bg-[#080808]/95 border border-[#D4AF37]/50 p-4 shadow-2xl backdrop-blur-md flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 border border-[#D4AF37]/20 bg-black flex items-center justify-center text-[#D4AF37]">
                <GitCompare className="w-5 h-5" />
              </div>
              <div className="text-left font-mono">
                <h5 className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest leading-none">
                  Suite Comparator
                </h5>
                <p className="text-[9px] text-zinc-400 mt-1 uppercase tracking-wider">
                  {compareIds.length} of 3 suites selected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCompareOpen(true)}
                disabled={compareIds.length < 2}
                className={`font-mono text-[9px] uppercase font-bold tracking-widest px-3.5 py-2 transition-all duration-300 ${
                  compareIds.length >= 2
                    ? "bg-[#D4AF37] hover:bg-white text-black active:scale-95 cursor-pointer font-bold"
                    : "bg-zinc-900 border border-zinc-850 text-zinc-550 cursor-not-allowed"
                }`}
                title={compareIds.length < 2 ? "Select at least 2 properties to compare side-by-side" : "Open Comparison Interface"}
              >
                Compare ({compareIds.length})
              </button>
              
              <button
                onClick={() => setCompareIds([])}
                className="p-2 border border-zinc-900 bg-black hover:bg-zinc-900 text-zinc-550 hover:text-rose-400 transition-colors cursor-pointer"
                title="Reset comparison slots"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alert / Warnings Notification Panel */}
      <AnimatePresence>
        {compareWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md bg-black border border-rose-500/40 p-3.5 shadow-2xl backdrop-blur-md flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1 text-left font-mono">
              <h5 className="text-[9px] text-rose-400 uppercase tracking-widest font-bold">Comparator Notice</h5>
              <p className="text-[10px] text-zinc-300 mt-1 leading-relaxed font-sans">{compareWarning}</p>
            </div>
            <button 
              onClick={() => setCompareWarning(null)}
              className="text-zinc-550 hover:text-zinc-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare side-by-side Modal */}
      <AnimatePresence>
        {isCompareOpen && (
          <CompareModal
            comparedProperties={comparedPropertiesList}
            isOpen={isCompareOpen}
            onClose={() => setIsCompareOpen(false)}
            onRemoveFromCompare={handleRemoveFromCompare}
            onBookShowing={(p) => {
              setIsCompareOpen(false);
              setBookingProperty(p);
            }}
            onOpenVirtualTour={(p) => {
              setIsCompareOpen(false);
              setVirtualTourProperty(p);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
