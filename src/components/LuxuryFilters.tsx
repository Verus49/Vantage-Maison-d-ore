import React from "react";
import { SearchFilters, PropertyListing } from "../types";
import { Search, SlidersHorizontal, Map, Building, DollarSign, Bed, Sparkles, RefreshCw } from "lucide-react";
import { UNIQUE_AMENITIES } from "../data/properties";

interface LuxuryFiltersProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  onReset: () => void;
  resultCount: number;
}

export default function LuxuryFilters({
  filters,
  setFilters,
  onReset,
  resultCount
}: LuxuryFiltersProps) {
  const propertyTypes = ["all", "Condo", "Penthouse", "Loft", "Townhouse"];
  const cities = ["all", "Vancouver", "Toronto"];
  const bedrooms = ["all", 1, 2, 3, 4];

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
        
        {/* Reset Button */}
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-1.5 bg-black hover:bg-zinc-900 border border-[#D4AF37]/35 hover:border-[#D4AF37] text-zinc-400 hover:text-[#D4AF37] font-mono text-[10px] uppercase px-3 py-1.5 rounded-none transition-all cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Portal</span>
        </button>
      </div>

      {/* Main Filter Sections */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Search Query */}
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 uppercase tracking-wider">
            <Search className="w-3.5 h-3.5 text-[#D4AF37]/75" />
            <span>Refine Keyword</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="e.g. Waterfront, Harbour view, Double-height ceilings..."
              className="w-full bg-black border border-zinc-900 text-zinc-100 rounded-none pl-3.5 pr-10 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] placeholder-zinc-600 transition-colors"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-550">
              <Search className="w-4 h-4" />
            </div>
          </div>
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
