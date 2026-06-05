import React, { useState, FC } from "react";
import { PropertyListing } from "../types";
import { ChevronLeft, ChevronRight, Bed, Bath, Hash, MapPin, Sparkles, AlertCircle, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PropertyCardProps {
  property: PropertyListing;
  onLocateOnMap: () => void;
  onBookShowing: () => void;
  isSelected?: boolean;
}

const PropertyCard: FC<PropertyCardProps> = ({
  property,
  onLocateOnMap,
  onBookShowing,
  isSelected = false
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <motion.div
      id={`property-card-${property.id}`}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.35 }}
      className={`relative flex flex-col bg-[#080808] border overflow-hidden group/card rounded-none ${
        isSelected
          ? "border-[#D4AF37] ring-1 ring-[#D4AF37]/30 shadow-[0_0_25px_rgba(212,175,55,0.12)]"
          : "border-zinc-900 hover:border-[#D4AF37]/30"
      } shadow-xl hover:shadow-2xl transition-all duration-300`}
    >
      {/* Visual Header / Gallery Slider */}
      <div className="relative h-56 md:h-64 overflow-hidden select-none">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={property.images[currentImageIndex]}
            alt={`${property.title} - View ${currentImageIndex + 1}`}
            referrerPolicy="no-referrer"
            initial={{ opacity: 0.6, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.6 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
          />
        </AnimatePresence>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/50 to-transparent" />

        {/* Elite Badges */}
        <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
          <span className="bg-black/90 text-[10px] font-mono font-semibold tracking-wider text-[#D4AF37] border border-[#D4AF37]/30 px-2.5 py-1 rounded-none backdrop-blur-md uppercase">
            {property.city}
          </span>
          <span className="bg-black/90 text-[10px] font-mono tracking-wider text-zinc-300 border border-zinc-800 px-2.5 py-1 rounded-none backdrop-blur-md">
            {property.type}
          </span>
          {property.featured && (
            <span className="bg-[#D4AF37] text-black text-[9px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-none shadow-md flex items-center gap-1 uppercase">
              <Sparkles className="w-3 h-3" />
              <span>PRESTIGE</span>
            </span>
          )}
        </div>

        {/* Gallery Slider Controls */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-[#080808] border border-zinc-850 text-zinc-300 hover:text-[#D4AF37] p-2 rounded-none cursor-pointer transition-all opacity-0 group-hover/card:opacity-100 hidden md:flex"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-[#080808] border border-zinc-850 text-zinc-300 hover:text-[#D4AF37] p-2 rounded-none cursor-pointer transition-all opacity-0 group-hover/card:opacity-100 hidden md:flex"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            
            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
              {property.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`w-1.5 h-1.5 rounded-none transition-all duration-350 cursor-pointer ${
                    currentImageIndex === idx ? "bg-[#D4AF37] w-3" : "bg-zinc-600/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Property Information */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Neighborhood & Name */}
          <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-mono uppercase tracking-wider">
            <MapPin className="w-3 h-3 text-[#D4AF37]" />
            <span>{property.neighborhood}</span>
          </div>
          
          <h3 className="text-lg md:text-xl font-serif font-normal text-zinc-100 hover:text-[#D4AF37] transition-colors mt-1 leading-tight">
            {property.title}
          </h3>

          <p className="text-zinc-400 text-xs mt-2 line-clamp-3 leading-relaxed">
            {property.description}
          </p>

          {/* Quick Specs */}
          <div className="grid grid-cols-3 gap-2 bg-black/40 border border-zinc-900 rounded-none p-3 mt-4 text-xs font-mono text-zinc-400">
            <div className="flex flex-col items-center justify-center border-r border-zinc-850/60">
              <span className="text-zinc-500 flex items-center gap-1 mb-0.5"><Bed className="w-3.5 h-3.5" /> Bed</span>
              <span className="text-zinc-100 font-semibold">{property.bedrooms}</span>
            </div>
            <div className="flex flex-col items-center justify-center border-r border-zinc-850/60">
              <span className="text-zinc-500 flex items-center gap-1 mb-0.5"><Bath className="w-3.5 h-3.5" /> Bath</span>
              <span className="text-zinc-100 font-semibold">{property.bathrooms}</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-zinc-550 flex items-center gap-1 mb-0.5"><Hash className="w-3.5 h-3.5" /> Area</span>
              <span className="text-zinc-100 font-semibold leading-none">{property.sqft.toLocaleString()} <span className="text-[9px] text-zinc-500 font-normal">sqft</span></span>
            </div>
          </div>

          {/* Key Amenities Tagline */}
          <div className="mt-4 flex flex-wrap gap-1.5 max-h-[64px] overflow-hidden">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="bg-black text-zinc-400 px-2 py-0.5 rounded-none border border-zinc-900 text-[10px] font-mono flex items-center gap-1"
              >
                <Check className="w-2.5 h-2.5 text-[#D4AF37]" />
                <span>{amenity}</span>
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-[10px] text-zinc-500 font-mono self-center ml-0.5">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Call-to-Actions */}
        <div className="mt-5.5 pt-4 border-t border-zinc-900/60 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono text-zinc-500 block uppercase">Monthly lease</span>
            <span className="text-xl md:text-2xl font-serif text-[#D4AF37] font-semibold tracking-tight">
              ${property.price.toLocaleString()}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onLocateOnMap}
              className="bg-black hover:bg-zinc-900 text-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37] p-2.5 rounded-none transition-all duration-300 cursor-pointer"
              title="Locate on Luxury Board"
            >
              <MapPin className="w-4 h-4" />
            </button>
            <button
              onClick={onBookShowing}
              className="bg-[#D4AF37] hover:bg-white text-black font-mono font-bold text-xs px-4 py-2.5 rounded-none transition-all duration-350 shadow-md flex items-center gap-1 uppercase cursor-pointer"
            >
              <span>Apply Suite</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
