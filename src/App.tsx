import React, { useState, useMemo } from "react";
import { PropertyListing, SearchFilters, ChatMessage, BookingApplication } from "./types";
import { LUXURY_PROPERTIES } from "./data/properties";
import PropertyMap from "./components/PropertyMap";
import AIConcierge from "./components/AIConcierge";
import PropertyCard from "./components/PropertyCard";
import LuxuryFilters from "./components/LuxuryFilters";
import BookingModal from "./components/BookingModal";
import { Compass, Sparkles, Building, Crown, Landmark, UserCheck, CheckCircle2, ChevronRight, MapPin, Eye, Calendar, AlertCircle } from "lucide-react";
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

  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [bookingProperty, setBookingProperty] = useState<PropertyListing | null>(null);
  const [activeMapCity, setActiveMapCity] = useState<"Vancouver" | "Toronto">("Vancouver");
  
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
  }, [filters]);

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
                setFilters((prev) => ({ ...prev, city: "all" }));
              }}
              className={`hover:text-[#D4AF37] transition-all cursor-pointer ${
                filters.city === "all" ? "text-[#D4AF37] font-bold border-b border-[#D4AF37]/55 pb-1" : ""
              }`}
            >
              Collections
            </span>
            <span
              onClick={() => {
                setFilters((prev) => ({ ...prev, city: "Vancouver" }));
              }}
              className={`hover:text-[#D4AF37] transition-all cursor-pointer ${
                filters.city === "Vancouver" ? "text-[#D4AF37] font-bold border-b border-[#D4AF37]/55 pb-1" : ""
              }`}
            >
              Vancouver
            </span>
            <span
              onClick={() => {
                setFilters((prev) => ({ ...prev, city: "Toronto" }));
              }}
              className={`hover:text-[#D4AF37] transition-all cursor-pointer ${
                filters.city === "Toronto" ? "text-[#D4AF37] font-bold border-b border-[#D4AF37]/55 pb-1" : ""
              }`}
            >
              Toronto
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
          <div className="space-y-3.5">
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
          />
        </section>

        {/* Curated Listings Grid */}
        <section className="space-y-5">
          <AnimatePresence mode="popLayout">
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredProperties.map((p) => (
                  <PropertyCard
                    key={p.id}
                    property={p}
                    isSelected={selectedProperty?.id === p.id}
                    onLocateOnMap={() => handleLocateProperty(p)}
                    onBookShowing={() => setBookingProperty(p)}
                  />
                ))}
              </div>
            ) : (
              <motion.div
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
      </main>

      {/* Decorative Elegant Footer with humble & premium labels */}
      <footer className="border-t border-[#D4AF37]/15 bg-black py-10 select-none text-[10px] text-zinc-550 font-mono">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-6">
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
          <p className="text-center text-[9px] text-zinc-650 max-w-2xl mx-auto leading-relaxed text-zinc-550">
            Vantage is an accredited and registered platform for booking fully-furnished luxury corporate housing, estate lofts, and residential penthouses. Content synchronized with our premier private AI database.
          </p>
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
    </div>
  );
}
