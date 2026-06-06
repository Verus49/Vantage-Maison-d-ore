import React, { useState, useEffect, useRef, useMemo } from "react";
import { SearchFilters, PropertyListing } from "../types";
import { Search, SlidersHorizontal, Map, Building, DollarSign, Bed, Sparkles, RefreshCw, Heart, MapPin } from "lucide-react";
import { UNIQUE_AMENITIES, LUXURY_PROPERTIES } from "../data/properties";
import { motion, AnimatePresence } from "motion/react";

interface LuxuryFiltersProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  onReset: () => void;
  resultCount: number;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (val: boolean) => void;
  favoritesCount: number;
}

export default function LuxuryFilters({
  filters,
  setFilters,
  onReset,
  resultCount,
  showFavoritesOnly,
  setShowFavoritesOnly,
  favoritesCount
}: LuxuryFiltersProps) {
  const propertyTypes = ["all", "Condo", "Penthouse", "Loft", "Townhouse"];
  const cities = ["all", "Vancouver", "Toronto"];
  const bedrooms = ["all", 1, 2, 3, 4];

  // Predictive search state variables
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute matched predictive suggestions
  const suggestions = useMemo(() => {
    const q = filters.searchQuery.trim().toLowerCase();
    if (!q) return [];

    // Get unique neighborhood names
    const uniqueNeighborhoods = Array.from(
      new Set(LUXURY_PROPERTIES.map((p) => p.neighborhood))
    );

    // Get unique titles/building names
    const uniqueTitles = Array.from(
      new Set(LUXURY_PROPERTIES.map((p) => p.title))
    );

    const matchedNeighborhoods = uniqueNeighborhoods
      .filter((n) => n.toLowerCase().includes(q))
      .map((n) => ({ value: n, type: "neighborhood" as const, label: n }));

    const matchedTitles = uniqueTitles
      .filter((t) => t.toLowerCase().includes(q))
      .map((t) => ({ value: t, type: "residence" as const, label: t }));

    // Limit suggestions to maximum 8 total to keep dropdown clean
    return [...matchedNeighborhoods, ...matchedTitles].slice(0, 8);
  }, [filters.searchQuery]);

  // Click outside to hide suggestions handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % suggestions.length);
      setShowSuggestions(true);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      setShowSuggestions(true);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < suggestions.length) {
        selectSuggestion(suggestions[focusedIndex].value);
      } else if (suggestions.length > 0) {
        selectSuggestion(suggestions[0].value);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (val: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: val }));
    setShowSuggestions(false);
    setFocusedIndex(-1);
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters((prev) => {
      const active = prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: active };
    });
  };

  return (
    <div className="bg-[#0b0b0b] border border-[#D4AF37]/20 rounded-none p-5 md:p-6 space-y-6 shadow-xl shadow-[#D4AF37]/2">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-b border-zinc-900 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-none bg-black border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shadow-md">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-serif uppercase tracking-widest text-zinc-100 font-semibold">
              Filter Registry
            </h3>
            <p className="text-[10px] font-mono text-zinc-500">
              {resultCount} curated residence{resultCount !== 1 && "s"} found
            </p>
          </div>
        </div>
        
        {/* Actions Row (Favorites Filter + Reset Button) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center justify-center gap-1.5 border font-mono text-[10px] uppercase px-3 py-1.5 rounded-none transition-all cursor-pointer ${
              showFavoritesOnly
                ? "bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]"
                : "bg-black hover:bg-zinc-900 border-zinc-850 hover:border-[#D4AF37]/30 text-zinc-400 hover:text-white"
            }`}
            title="Toggle between all properties and your favored collections"
          >
            <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? "fill-[#D4AF37] text-[#D4AF37]" : ""}`} />
            <span>Curated Collection ({favoritesCount})</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 bg-black hover:bg-zinc-900 border border-zinc-850 hover:border-[#D4AF37]/35 text-zinc-400 hover:text-[#D4AF37] font-mono text-[10px] uppercase px-3 py-1.5 rounded-none transition-all cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Portal</span>
          </button>
        </div>
      </div>

      {/* Main Filter Sections */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Search Query */}
        <div ref={containerRef} className="space-y-1.5 col-span-1 md:col-span-2 relative">
          <label className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 uppercase tracking-wider">
            <Search className="w-3.5 h-3.5 text-[#D4AF37]/75" />
            <span>Refine Keyword</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
                setShowSuggestions(true);
                setFocusedIndex(-1);
              }}
              onFocus={() => {
                setShowSuggestions(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Coal Harbour, Yorkville, Penthouse, Yaletown..."
              className="w-full bg-black border border-zinc-900 text-zinc-100 rounded-none pl-3.5 pr-10 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] placeholder-zinc-650 transition-colors"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, searchQuery: "" }));
                  setShowSuggestions(false);
                }}
                className="absolute right-9 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#D4AF37] transition-colors cursor-pointer text-[10px] font-mono"
              >
                Clear
              </button>
            )}
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
              <Search className="w-4 h-4" />
            </div>
          </div>

          {/* Predictive Search Suggestions Dropdown Overlay */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full mt-1.5 bg-[#070707]/98 border border-[#D4AF37]/35 shadow-2xl shadow-[#D4AF37]/5 max-h-[220px] overflow-y-auto z-50 rounded-none divide-y divide-zinc-900/60 custom-scrollbar"
              >
                <div className="px-3 py-1.5 bg-[#0a0a0a] border-b border-zinc-900 flex justify-between items-center">
                  <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500">PREDICTIVE SUGGESTIONS</span>
                  <span className="text-[8px] font-mono text-[#D4AF37] opacity-60">↑↓ keys to navigate</span>
                </div>
                {suggestions.map((suggestion, index) => {
                  const isFocused = index === focusedIndex;
                  return (
                    <button
                      key={`${suggestion.type}-${suggestion.value}`}
                      type="button"
                      onClick={() => selectSuggestion(suggestion.value)}
                      onMouseEnter={() => setFocusedIndex(index)}
                      className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between transition-colors duration-150 cursor-pointer ${
                        isFocused 
                          ? "bg-[#D4AF37]/10 text-[#D4AF37]" 
                          : "text-zinc-300 hover:bg-zinc-950 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {suggestion.type === "neighborhood" ? (
                          <MapPin className="w-3.5 h-3.5 text-[#D4AF37] opacity-80 shrink-0" />
                        ) : (
                          <Building className="w-3.5 h-3.5 text-[#D4AF37] opacity-80 shrink-0" />
                        )}
                        <span className="text-[11px] truncate font-sans font-medium">{suggestion.label}</span>
                      </div>
                      <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-550 px-1.5 py-0.5 border border-zinc-900/80 bg-black shrink-0">
                        {suggestion.type === "neighborhood" ? "Neighborhood" : "Suite/Building"}
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* City Toggle */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 uppercase tracking-wider">
            <Map className="w-3.5 h-3.5 text-[#D4AF37]/75" />
            <span>Select Metropolitan</span>
          </label>
          <div className="grid grid-cols-3 gap-1 bg-black border border-zinc-900 p-1 rounded-none">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setFilters((prev) => ({ ...prev, city: city as any }))}
                className={`py-1.5 text-[10px] font-mono rounded-none transition-all uppercase cursor-pointer ${
                  filters.city === city
                    ? "bg-[#D4AF37] text-black font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {city === "all" ? "All" : city.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Lease Budget Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-[#D4AF37]/75" />
              <span>Monthly Rent limit</span>
            </span>
            <span className="text-[#D4AF37] font-semibold font-mono">
              ${filters.maxPrice >= 20000 ? "Any" : `Under $${filters.maxPrice.toLocaleString()}`}
            </span>
          </div>
          <div className="relative pt-2">
            <input
              type="range"
              min={3500}
              max={20000}
              step={250}
              value={filters.maxPrice}
              onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
              className="w-full accent-[#D4AF37] cursor-pointer h-1 bg-zinc-900 rounded-none appearance-none"
            />
            <div className="flex justify-between text-[9px] font-mono text-zinc-500 mt-1">
              <span>$3.5k</span>
              <span>$10k</span>
              <span>$20k+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded spec selectors */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 pt-1.5 border-t border-zinc-900/60">
        {/* Bedrooms count */}
        <div className="space-y-1.5 col-span-1">
          <label className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 uppercase tracking-wider">
            <Bed className="w-3.5 h-3.5 text-[#D4AF37]/75" />
            <span>Beardroom Layout</span>
          </label>
          <div className="grid grid-cols-5 gap-1 bg-black border border-zinc-900 p-1 rounded-none text-center">
            {bedrooms.map((bed) => (
              <button
                key={bed}
                onClick={() => setFilters((prev) => ({ ...prev, bedrooms: bed as any }))}
                className={`py-1.5 text-[10px] font-mono rounded-none transition-all cursor-pointer ${
                  filters.bedrooms === bed
                    ? "bg-[#D4AF37] text-black font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {bed === "all" ? "All" : `${bed}`}
              </button>
            ))}
          </div>
        </div>

        {/* Property Type Selection */}
        <div className="space-y-1.5 col-span-1 md:col-span-1">
          <label className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 uppercase tracking-wider">
            <Building className="w-3.5 h-3.5 text-[#D4AF37]/75" />
            <span>Suite Category</span>
          </label>
          <select
            value={filters.type}
            onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value as any }))}
            className="w-full bg-black border border-zinc-900 text-zinc-300 rounded-none px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37] font-mono"
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type === "all" ? "All Categories" : type}
              </option>
            ))}
          </select>
        </div>

        {/* Amenity Toggles checkboxes */}
        <div className="space-y-2 col-span-1 md:col-span-2">
          <label className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]/75" />
            <span>Refine Amenity Array</span>
          </label>
          
          <div className="flex flex-wrap gap-1.5 overflow-x-auto max-h-[85px] py-0.5 custom-scrollbar">
            {UNIQUE_AMENITIES.map((amenity) => {
              const active = filters.amenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`px-3 py-1.5 text-[9px] font-mono rounded-none border transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? "bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/50 font-semibold"
                      : "bg-black hover:bg-zinc-900 text-zinc-400 border-zinc-900 hover:border-zinc-800"
                  }`}
                >
                  {amenity}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
