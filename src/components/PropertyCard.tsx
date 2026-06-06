import React, { useState, FC } from "react";
import { PropertyListing } from "../types";
import { ChevronLeft, ChevronRight, Bed, Bath, Hash, MapPin, Sparkles, AlertCircle, Check, Eye, Heart, GitCompare, Bell, Mail, X, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PropertyCardProps {
  property: PropertyListing;
  onLocateOnMap: () => void;
  onBookShowing: () => void;
  onOpenVirtualTour: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isComparing: boolean;
  onToggleCompare: () => void;
  isSelected?: boolean;
  isSubscribed: boolean;
  activeSubscription?: { email: string; priceAlert: boolean; availAlert: boolean };
  onSubscribe: (email: string, priceAlert: boolean, availAlert: boolean) => void;
  onUnsubscribe: () => void;
  onDirectInquiry: () => void;
}

const PropertyCard: FC<PropertyCardProps> = ({
  property,
  onLocateOnMap,
  onBookShowing,
  onOpenVirtualTour,
  isFavorite,
  onToggleFavorite,
  isComparing,
  onToggleCompare,
  isSelected = false,
  isSubscribed,
  activeSubscription,
  onSubscribe,
  onUnsubscribe,
  onDirectInquiry
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [showNotifyForm, setShowNotifyForm] = useState(false);
  const [emailInput, setEmailInput] = useState(activeSubscription?.email || "");
  const [priceAlert, setPriceAlert] = useState(activeSubscription?.priceAlert ?? true);
  const [availAlert, setAvailAlert] = useState(activeSubscription?.availAlert ?? true);

  // Sync state when active subscription changes or is initialized
  React.useEffect(() => {
    if (activeSubscription) {
      setEmailInput(activeSubscription.email);
      setPriceAlert(activeSubscription.priceAlert);
      setAvailAlert(activeSubscription.availAlert);
    }
  }, [activeSubscription]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    onSubscribe(emailInput, priceAlert, availAlert);
    setShowNotifyForm(false);
  };

  const handleUnsubscribe = () => {
    onUnsubscribe();
    setShowNotifyForm(false);
  };

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
      whileHover={{ 
        scale: 1.015,
        y: -4,
        transition: { duration: 0.25, ease: "easeOut" }
      }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.35 }}
      className={`relative flex flex-col bg-[#080808] border overflow-hidden group/card rounded-none ${
        isSelected
          ? "border-[#D4AF37] ring-1 ring-[#D4AF37]/30 shadow-[0_0_25px_rgba(212,175,55,0.16)]"
          : "border-zinc-900 hover:border-[#D4AF37]/65 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)]"
      } shadow-xl transition-all duration-300`}
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
        <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap flex-1 max-w-[calc(100%-80px)]">
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

        {/* Top Right Actions Deck (Favorite & Compare Toggles) */}
        <div className="absolute top-4 right-4 z-25 flex items-center gap-1.5">
          {/* Compare Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare();
            }}
            className={`p-2 border transition-all duration-305 bg-black/85 backdrop-blur-md rounded-none shadow-lg cursor-pointer ${
              isComparing 
                ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10" 
                : "border-zinc-850 hover:border-[#D4AF37]/45 text-zinc-400 hover:text-white"
            }`}
            title={isComparing ? "Remove Suite from Compare list" : "Compare this Suite Side-by-Side"}
          >
            <GitCompare className={`w-4 h-4 transition-transform duration-300 ${isComparing ? "scale-110" : "scale-100 hover:scale-115"}`} />
          </button>

          {/* Favorite Heart Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={`p-2 border transition-all duration-300 bg-black/85 backdrop-blur-md rounded-none shadow-lg cursor-pointer ${
              isFavorite 
                ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10 animate-pulse" 
                : "border-zinc-850 hover:border-[#D4AF37]/45 text-zinc-400 hover:text-white"
            }`}
            title={isFavorite ? "Remove from Curated Favorites" : "Curate to Favorites"}
          >
            <Heart className={`w-4 h-4 transition-transform duration-300 ${isFavorite ? "fill-[#D4AF37] scale-110" : "scale-100 hover:scale-115"}`} />
          </button>
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

        {/* 3D Tour Badge Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenVirtualTour();
          }}
          className="absolute bottom-3 right-3 z-10 bg-black/85 hover:bg-[#D4AF37] hover:text-black border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[9px] font-mono tracking-widest uppercase px-2.5 py-1.5 rounded-none backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer shadow-lg outline-none select-none"
        >
          <Eye className="w-3.5 h-3.5 animate-pulse" />
          <span>3D Tour</span>
        </button>
      </div>

      {/* Property Information */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Neighborhood & Name & Real-Time Availability Indicator */}
          <div className="flex items-center justify-between text-zinc-500 text-[10px] font-mono uppercase tracking-wider relative">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-[#D4AF37]" />
              <span>{property.neighborhood}</span>
            </div>

            {/* Real-time Availability status badge with tooltip */}
            {(() => {
              const isAvailable = !property.nextAvailableDate || property.nextAvailableDate === "Immediate";
              const nextDate = property.nextAvailableDate || "Immediate";
                
              return (
                <div className="relative group/avail flex items-center gap-1.5 cursor-help bg-[#020202] border border-zinc-900/60 hover:border-[#D4AF37]/35 px-2 py-0.5 rounded-none transition-colors">
                  <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-rose-500 shadow-[0_0_8px_#f43f5e]"}`} />
                  <span className={`text-[8.5px] font-bold tracking-wide ${isAvailable ? "text-emerald-400" : "text-rose-450"}`}>
                    {isAvailable ? "Available" : `Occupied (Avail: ${nextDate})`}
                  </span>

                  {/* Elegant floating status details tooltip */}
                  <div className="absolute bottom-full right-0 mb-2.5 opacity-0 translate-y-1.5 pointer-events-none group-hover/avail:opacity-100 group-hover/avail:translate-y-0 group-hover/avail:pointer-events-auto transition-all duration-300 w-52 bg-[#050505] border border-[#D4AF37]/45 p-3.5 shadow-[0_4px_20px_rgba(212,175,55,0.15)] z-40 font-sans text-left normal-case text-zinc-300">
                    {/* Tooltip header */}
                    <div className="text-[8.5px] font-mono uppercase tracking-widest font-bold text-[#D4AF37] border-b border-zinc-900 pb-1.5 mb-2 flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-emerald-500 animate-pulse" : "bg-rose-500 animate-pulse"}`} />
                      <span>Inventory Availability</span>
                    </div>
                    {/* Tooltip description */}
                    <p className="text-[10px] leading-relaxed text-zinc-300 font-sans">
                      {isAvailable 
                        ? "Immediate occupancy active. Fully verified, cleaned, and move-in ready upon corporate board consent." 
                        : `Currently leased. Corporate showing bookings or early hold reservation options open for lease cycle commencing ${nextDate}.`
                      }
                    </p>
                    {/* Tooltip footer stamp */}
                    <div className="border-t border-zinc-900 pt-1.5 mt-2.5 text-[8px] font-mono text-zinc-550 leading-none uppercase flex justify-between">
                      <span>Ledger Verified</span>
                      <span className="text-[#D4AF37]">Active</span>
                    </div>
                  </div>
                </div>
              );
            })()}
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
              className="bg-black hover:bg-zinc-900 text-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37] p-2.5 rounded-none transition-all duration-300 cursor-pointer flex items-center justify-center"
              title="Locate on Luxury Board"
            >
              <MapPin className="w-4 h-4" />
            </button>

            {/* Get Notified Toggle Bell Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowNotifyForm(true);
              }}
              className={`p-2.5 rounded-none border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                isSubscribed 
                  ? "border-emerald-500 text-emerald-400 bg-emerald-950/20" 
                  : "bg-black hover:bg-zinc-900 text-[#D4AF37] border-[#D4AF37]/30 hover:border-[#D4AF37]"
              }`}
              title={isSubscribed ? "Authorized Alerts: Active (Click to edit/mute)" : "Get Price Drops & Availability Updates"}
            >
              <Bell className={`w-4 h-4 ${isSubscribed ? "animate-pulse" : ""}`} />
            </button>

            {/* Direct Inquiry button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDirectInquiry();
              }}
              className="bg-black hover:bg-zinc-900 text-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37] p-2.5 rounded-none transition-all duration-300 cursor-pointer flex items-center justify-center"
              title={`Inquire about ${property.title} via AI Concierge`}
            >
              <MessageSquare className={`w-4 h-4`} />
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

      {/* Absolute Notify Form Overlay on top of Card */}
      <AnimatePresence>
        {showNotifyForm && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 bg-[#040404]/98 border border-[#D4AF37]/40 z-30 p-5 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-zinc-200">Suite Alerts Registry</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotifyForm(false);
                  }}
                  className="text-zinc-500 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h4 className="text-xs font-serif text-zinc-150 uppercase tracking-wide leading-tight mb-2">
                Subscribe for {property.title}
              </h4>
              <p className="text-[10.5px] text-zinc-400 mb-4 font-normal leading-relaxed">
                Receive diplomatic secure dispatches if price decreases or lease availability transitions.
              </p>

              {/* Preferences */}
              <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); }} className="space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={priceAlert}
                    onChange={(e) => setPriceAlert(e.target.checked)}
                    className="accent-[#D4AF37] rounded-none border-zinc-700 bg-black w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-zinc-300 group-hover:text-white transition-colors uppercase font-medium">
                    Price Drop Notifications
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={availAlert}
                    onChange={(e) => setAvailAlert(e.target.checked)}
                    className="accent-[#D4AF37] rounded-none border-zinc-700 bg-black w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-zinc-300 group-hover:text-white transition-colors uppercase font-medium">
                    Availability & Lease Status Alerts
                  </span>
                </label>
              </form>

              {/* Email Input */}
              <div className="mt-4">
                <label className="text-[9px] font-mono text-zinc-500 block uppercase mb-1.5 font-bold">Secure Corporate Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="partner@firm.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-black border border-zinc-910 focus:border-[#D4AF37]/50 p-2 pl-8 font-mono text-[11px] text-zinc-200 rounded-none focus:outline-none placeholder-zinc-700 transition-colors"
                  />
                  <Mail className="w-3.5 h-3.5 text-zinc-650 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 border-t border-zinc-900/60 pt-4">
              {isSubscribed && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnsubscribe();
                  }}
                  className="flex-1 border border-rose-950 hover:border-rose-800 text-rose-450 hover:text-rose-400 hover:bg-rose-950/20 py-2.5 text-[10px] font-mono uppercase tracking-wider rounded-none cursor-pointer transition-colors"
                >
                  Mute Alerts
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubscribe(e);
                }}
                disabled={!emailInput || (!priceAlert && !availAlert)}
                className="flex-1 bg-[#D4AF37] hover:bg-white text-black py-2.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-none cursor-pointer transition-colors disabled:opacity-30 disabled:hover:bg-[#D4AF37]"
              >
                {isSubscribed ? "Update Registry" : "Activate Alerts"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PropertyCard;
