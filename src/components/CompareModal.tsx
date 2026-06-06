import React, { FC } from "react";
import { PropertyListing } from "../types";
import { 
  X, 
  GitCompare, 
  DollarSign, 
  Hash, 
  Compass, 
  Bed, 
  Bath, 
  Sparkles, 
  Eye, 
  Calendar,
  AlertCircle,
  TrendingDown,
  ExternalLink,
  MapPin,
  Check,
  Minus,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CompareModalProps {
  comparedProperties: PropertyListing[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveFromCompare: (id: string) => void;
  onBookShowing: (property: PropertyListing) => void;
  onOpenVirtualTour: (property: PropertyListing) => void;
}

export const CompareModal: FC<CompareModalProps> = ({
  comparedProperties,
  isOpen,
  onClose,
  onRemoveFromCompare,
  onBookShowing,
  onOpenVirtualTour,
}) => {
  if (!isOpen) return null;

  // Compute neighborhood prestige data helper
  const getNeighborhoodPrestige = (neighborhood: string) => {
    const norm = neighborhood.toLowerCase();
    
    if (norm.includes("coal harbour") || norm.includes("waterfront")) {
      return {
        score: "9.9/10",
        tier: "Sovereign Marine Tier",
        color: "text-amber-400 border-amber-400/20",
        description: "Premier maritime residential corridor with private biometric entries, scenic waterfront seawalls, and pristine skyline vistas of Stanley Park."
      };
    }
    if (norm.includes("yorkville")) {
      return {
        score: "10/10",
        tier: "Diplomatic Landmark Tier",
        color: "text-amber-500 border-amber-500/20",
        description: "Canada's premier high-fashion nucleus. Host to luxury five-star hotel residences, Michelin culinary selections, and prominent diplomatic private estates."
      };
    }
    if (norm.includes("yaletown")) {
      return {
        score: "9.5/10",
        tier: "Chic Artisan Tier",
        color: "text-emerald-400 border-emerald-400/20",
        description: "Unmatched historical heritage warehouse quarter combining premium designer lounges, high-end patios, and luxury glass-domed lofts."
      };
    }
    if (norm.includes("west end") || norm.includes("downtown west")) {
      return {
        score: "9.6/10",
        tier: "Sovereign Estate Tier",
        color: "text-blue-400 border-blue-400/20",
        description: "Architecturally rich elite residential sanctuary combining quiet private lanes, beautiful sunset beaches, and instant access to Financial District boardrooms."
      };
    }
    if (norm.includes("vancouver harbour") || norm.includes("waterfront")) {
      return {
        score: "9.4/10",
        tier: "Core Elite Tier",
        color: "text-purple-400 border-purple-400/20",
        description: "Striking metropolitan high-rises commanding sweeping ocean inlets, mountain backdrops, and exclusive executive helicopter club access."
      };
    }
    if (norm.includes("distillery district") || norm.includes("distillery")) {
      return {
        score: "9.2/10",
        tier: "Patrimonial Brick Tier",
        color: "text-rose-400 border-rose-400/20",
        description: "Historic Victorian warehouse conversion district featuring pedestrian-only cobblestone alleys, sculpture galleries, and prestigious architectural loft residences."
      };
    }
    return {
      score: "9.3/10",
      tier: "Curated Luxury Tier",
      color: "text-zinc-300 border-zinc-800",
      description: "Superb metropolitan sanctuary showcasing premium double glass paneling, smart home systems, and highly-rated neighbourhood security services."
    };
  };

  // Compile unique array of all amenities among all compared listings
  const allComparedAmenities = Array.from(
    new Set(comparedProperties.flatMap((p) => p.amenities))
  ).sort();

  // Find lowest price to highlight value
  const minPrice = comparedProperties.length > 0 
    ? Math.min(...comparedProperties.map(p => p.price)) 
    : 0;

  // Find largest sqft to highlight space
  const maxSqft = comparedProperties.length > 0 
    ? Math.max(...comparedProperties.map(p => p.sqft)) 
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-4 select-text">
      <div className="relative w-full max-w-6xl h-[90vh] bg-black border border-[#D4AF37]/30 flex flex-col overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.08)]">
        
        {/* Header Block */}
        <div className="bg-[#050505] px-4 py-4 border-b border-[#D4AF37]/15 flex items-center justify-between z-30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-none border border-[#D4AF37]/35 bg-black flex items-center justify-center text-[#D4AF37]">
              <GitCompare className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest leading-none">Maison d'Or Suite Comparator</span>
                <span className="text-[9px] font-mono text-zinc-550 bg-zinc-950 border border-zinc-900 px-1.5 py-0.2 leading-none uppercase">
                  {comparedProperties.length} / 3 selected
                </span>
              </div>
              <h3 className="text-sm font-serif text-zinc-100 font-bold uppercase tracking-wider leading-tight mt-0.5">
                Side-by-Side Suite Comparison Grid
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-none bg-black border border-zinc-900 hover:border-[#D4AF37]/35 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Exit Comparator"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Modal content body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {comparedProperties.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto py-20">
              <div className="w-12 h-12 rounded-none border border-zinc-800 bg-[#080808] flex items-center justify-center text-zinc-500">
                <GitCompare className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-zinc-200 font-serif text-base uppercase tracking-wider font-semibold">No Properties Selected</h4>
                <p className="text-zinc-500 font-mono text-[10.5px] leading-relaxed mt-1.5">
                  Your comparison deck is currently empty. Elevate your experience by clicking the Compare icon (<GitCompare className="w-3 h-3 inline-block" />) in the top-right corner of any luxury residence card.
                </p>
              </div>
              <button
                onClick={onClose}
                className="bg-black hover:bg-zinc-900 border border-[#D4AF37]/40 text-[#D4AF37] font-mono text-[9px] uppercase tracking-widest px-4 py-2 cursor-pointer transition-all"
              >
                Return to Collections
              </button>
            </div>
          ) : (
            <div className="space-y-6">

              {/* Main Side-by-Side Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                
                {/* Labels Column (Hidden or collapsed on mobile) */}
                <div className="hidden md:flex md:col-span-3 flex-col justify-between py-2 border-r border-zinc-900 pr-4">
                  <div className="space-y-[140px]">
                    <div className="border-l-2 border-[#D4AF37] pl-3">
                      <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block">Level 01</span>
                      <h4 className="text-zinc-100 font-serif text-sm uppercase tracking-wider mt-0.5">Signature Suite</h4>
                      <p className="text-[10px] text-zinc-500 mt-1">Curated photographic facade, rate structural blueprints, and exact geographical coordinates.</p>
                    </div>

                    <div className="border-l-2 border-[#D4AF37] pl-3 pt-6">
                      <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block">Level 02</span>
                      <h4 className="text-zinc-100 font-serif text-sm uppercase tracking-wider mt-0.5">Specifications</h4>
                      <p className="text-[10px] text-zinc-500 mt-1">Side-by-side technical parameters including monthly lease, interior space, and custom structural counts.</p>
                    </div>

                    <div className="border-l-2 border-[#D4AF37] pl-3 pt-24">
                      <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block">Level 03</span>
                      <h4 className="text-zinc-100 font-serif text-sm uppercase tracking-wider mt-0.5">Prestige Rating</h4>
                      <p className="text-[10px] text-zinc-500 mt-1">Dynamic score assessing community affluence, quiet indicators, and boutique culinary density.</p>
                    </div>
                  </div>
                </div>

                {/* Compared Cards columns */}
                <div className={`col-span-1 md:col-span-9 grid gap-4`} style={{
                  gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))`
                }}>
                  {comparedProperties.map((p) => {
                    const prestige = getNeighborhoodPrestige(p.neighborhood);
                    const isLowestPrice = p.price === minPrice && comparedProperties.length > 1;
                    const isLargestSqft = p.sqft === maxSqft && comparedProperties.length > 1;

                    return (
                      <div 
                        key={p.id}
                        className="bg-[#080808] border border-zinc-900 p-4 flex flex-col justify-between relative transform-gpu hover:border-zinc-800 transition-all duration-300"
                      >
                        {/* Remove Action Button */}
                        <button
                          onClick={() => onRemoveFromCompare(p.id)}
                          className="absolute top-2 right-2 z-10 p-1.5 bg-black/90 border border-zinc-900 rounded-none text-zinc-500 hover:text-rose-400 hover:border-rose-400/20 transition-all cursor-pointer"
                          title="Remove from Compare Grid"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="space-y-4">
                          {/* Photo Frame & Image */}
                          <div className="relative h-28 w-full border border-zinc-900 overflow-hidden select-none">
                            <img 
                              src={p.images[0]} 
                              alt={p.title} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            {isLowestPrice && (
                              <div className="absolute top-2 left-2 bg-emerald-500 text-black text-[8px] font-mono font-bold tracking-widest px-2 py-0.5 flex items-center gap-1 uppercase">
                                <TrendingDown className="w-2.5 h-2.5" />
                                <span>Optimal Value</span>
                              </div>
                            )}
                          </div>

                          {/* Quick Title Spec block */}
                          <div>
                            <span className="text-[8px] font-mono text-[#D4AF37] tracking-widest uppercase block mb-0.5">
                              {p.city} • {p.type}
                            </span>
                            <h5 className="font-serif text-zinc-100 text-sm tracking-wide line-clamp-1 uppercase font-bold">
                              {p.title}
                            </h5>
                            <span className="text-[9.5px] font-mono text-zinc-500 block truncate mt-1">
                              <MapPin className="w-2.5 h-2.5 text-[#D4AF37] inline mr-1" />
                              {p.neighborhood}
                            </span>
                          </div>

                          {/* Level 02 Technical parameters */}
                          <div className="border-t border-zinc-900 pt-3.5 space-y-2.5">
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-zinc-500">MONTHLY LEASE</span>
                              <div className="text-right">
                                <span className={`font-serif text-sm font-semibold ${isLowestPrice ? "text-emerald-400" : "text-[#D4AF37]"}`}>
                                  ${p.price.toLocaleString()}
                                </span>
                                <span className="text-[8.5px] text-zinc-500 block">EXCL. DIRECT FEES</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-zinc-500">INTERIOR SPACE</span>
                              <div className="text-right">
                                <span className={`font-semibold ${isLargestSqft ? "text-[#D4AF37] underline decoration-dotted decoration-[#D4AF37]/50" : "text-zinc-200"}`}>
                                  {p.sqft.toLocaleString()} SQFT
                                </span>
                                <span className="text-[8.5px] text-zinc-500 block">MEASURED PLOTTED</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-zinc-500">BED / BATH SPECS</span>
                              <span className="font-semibold text-zinc-200">
                                {p.bedrooms} Bed & {p.bathrooms} Bath
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[11px] font-mono border-t border-zinc-900/40 pt-2 mt-2">
                              <span className="text-zinc-500">AVAILABILITY</span>
                              {(() => {
                                const isAvailable = !p.nextAvailableDate || p.nextAvailableDate === "Immediate";
                                const nextDate = p.nextAvailableDate || "Immediate";
                                return (
                                  <div className="text-right">
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider ${isAvailable ? "text-emerald-400" : "text-rose-450"}`}>
                                      <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-rose-500"}`} />
                                      {isAvailable ? "Available" : "Occupied"}
                                    </span>
                                    <span className="text-[8.5px] text-zinc-500 block uppercase">
                                      {isAvailable ? "Immediate" : `Lease: ${nextDate}`}
                                    </span>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>

                          {/* Level 03 Prestige ranking */}
                          <div className="border-t border-zinc-900 pt-3.5 bg-[#030303] border border-zinc-905 p-3 rounded-none">
                            <div className="flex items-center justify-between">
                              <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-widest">
                                DISTRICT SCORE
                              </span>
                              <span className={`text-xs font-serif font-bold py-0.5 px-2 border ${prestige.color} uppercase tracking-wider bg-black/60`}>
                                {prestige.score}
                              </span>
                            </div>
                            <span className="text-[9px] font-mono text-[#D4AF37] font-semibold tracking-wider block mt-1.5 uppercase">
                              {prestige.tier}
                            </span>
                            <p className="text-[9.5px] text-zinc-400 font-sans leading-relaxed mt-1">
                              {prestige.description}
                            </p>
                          </div>
                        </div>

                        {/* Interactive Client operations footer */}
                        <div className="mt-5 pt-3.5 border-t border-zinc-900 flex flex-col gap-1.5">
                          <button
                            onClick={() => onBookShowing(p)}
                            className="w-full bg-[#D4AF37] hover:bg-white text-black font-mono font-bold text-[10px] tracking-widest uppercase py-2 text-center transition-all cursor-pointer"
                          >
                            Apply for Showing
                          </button>
                          <button
                            onClick={() => onOpenVirtualTour(p)}
                            className="w-full bg-black hover:bg-zinc-900 border border-zinc-850 hover:border-[#D4AF37]/30 text-zinc-400 hover:text-white font-mono text-[9px] tracking-wider uppercase py-1.5 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5 animate-pulse text-[#D4AF37]" />
                            <span>Launch 3D Tour</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Amenity Attribute Checklist matrix panel */}
              <div className="pt-4 border-t border-zinc-900">
                <div className="bg-[#050505] p-4 border border-zinc-900">
                  <h4 className="text-xs font-serif text-zinc-200 uppercase tracking-wider font-semibold mb-3.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Cross-Amenity Grid Matrix</span>
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse font-mono text-[10px] text-zinc-450 text-left">
                      <thead>
                        <tr className="border-b border-zinc-850">
                          <th className="py-2.5 font-bold tracking-wider uppercase text-zinc-100 w-1/4">Feature / Finish</th>
                          {comparedProperties.map((p) => (
                            <th key={p.id} className="py-2.5 px-3 font-semibold text-[#D4AF37] text-center w-1/4">
                              <span className="block truncate max-w-[140px] uppercase font-bold text-[9px]">{p.title}</span>
                            </th>
                          ))}
                          {/* Fill columns if there are fewer than 3 properties compared, to keep the table consistent */}
                          {Array.from({ length: Math.max(0, 3 - comparedProperties.length) }).map((_, idx) => (
                            <th key={`empty-th-${idx}`} className="py-2.5 px-3 text-zinc-700 text-center w-1/4 font-normal">
                              - Empty Slot -
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900 text-[10.5px]">
                        {allComparedAmenities.map((amenity) => (
                          <tr key={amenity} className="hover:bg-zinc-950/20 transition-colors">
                            <td className="py-2.5 font-sans font-medium text-zinc-300">
                              {amenity}
                            </td>
                            {comparedProperties.map((p) => {
                              const hasAmenity = p.amenities.includes(amenity);
                              return (
                                <td key={`${p.id}-${amenity}`} className="py-2.5 px-3 text-center">
                                  {hasAmenity ? (
                                    <div className="inline-flex items-center justify-center w-5 h-5 bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37]">
                                      <Check className="w-3.5 h-3.5" />
                                    </div>
                                  ) : (
                                    <div className="inline-flex items-center justify-center w-5 h-5 text-zinc-800">
                                      <Minus className="w-3.5 h-3.5" />
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                            {/* Fill columns for layout consistency */}
                            {Array.from({ length: Math.max(0, 3 - comparedProperties.length) }).map((_, idx) => (
                              <td key={`empty-td-${idx}`} className="py-2.5 px-3 text-center text-zinc-800">
                                <Minus className="w-3.5 h-3.5 opacity-25" />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Informative Deck Footer Banner */}
        <div className="bg-[#050505] border-t border-[#D4AF37]/15 px-4 py-3 z-30 shrink-0 text-center font-mono text-[9px] text-zinc-500">
          <span>Accredited real estate assets of Maison d'Or. Prices in CAD, subject to localized corporate premium checks.</span>
        </div>

      </div>
    </div>
  );
};

export default CompareModal;
