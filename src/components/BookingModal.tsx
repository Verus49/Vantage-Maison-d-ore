import React, { useState } from "react";
import { PropertyListing } from "../types";
import { X, Calendar, Clock, Crown, ShieldAlert, BadgeCheck, Utensils, Plane, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BookingModalProps {
  property: PropertyListing | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (booking: {
    fullName: string;
    email: string;
    phone: string;
    moveInDate: string;
    durationMonths: number;
    specialRequests: string[];
  }) => void;
}

export default function BookingModal({
  property,
  isOpen,
  onClose,
  onSubmit
}: BookingModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [durationMonths, setDurationMonths] = useState(12);
  const [specialRequests, setSpecialRequests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen || !property) return null;

  const luxuryCustomizations = [
    {
      id: "airport",
      title: "Airport Chauffeur Transfer",
      desc: "Private luxury vehicle pickup (Bentley or Mercedes G-Class) directly from YVR or YYZ executive runways.",
      icon: <Plane className="w-4 h-4 text-[#D4AF37]" />
    },
    {
      id: "fridge",
      title: "Gourmet Pre-Arrival Stocking",
      desc: "Caviar, organic juices, premium water array, and sommelier-selected champagne selection.",
      icon: <Utensils className="w-4 h-4 text-[#D4AF37]" />
    },
    {
      id: "butler",
      title: "24/7 Bespoke Butler Assistance",
      desc: "Dedicated white-glove lifestyle management assistant for booking, laundry, and daily tasks.",
      icon: <Crown className="w-4 h-4 text-[#D4AF37]" />
    },
    {
      id: "security",
      title: "Elite Private Guard Services",
      desc: "Certified security guard detail guarding the suite and coordinating secure transportation.",
      icon: <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />
    }
  ];

  const toggleLuxuryRequest = (id: string) => {
    setSpecialRequests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !moveInDate) {
      alert("Please enter our requested tenant profiling details.");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate luxury registry processing
    setTimeout(() => {
      onSubmit({
        fullName,
        email,
        phone,
        moveInDate,
        durationMonths,
        specialRequests
      });
      setIsSubmitting(false);
      setIsCompleted(true);
    }, 1500);
  };

  const handleResetAndClose = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setMoveInDate("");
    setDurationMonths(12);
    setSpecialRequests([]);
    setIsCompleted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleResetAndClose}
        className="absolute inset-0 bg-[#000000]/85 backdrop-blur-md"
      />

      {/* Booking Form Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 15 }}
        transition={{ duration: 0.3 }}
        className="relative bg-[#0c0c0c] border border-[#D4AF37]/25 rounded-none w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 select-none z-10 custom-scrollbar shadow-[#D4AF37]/3"
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 text-zinc-450 hover:text-[#D4AF37] bg-black border border-zinc-900 p-2 rounded-none transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!isCompleted ? (
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Header */}
            <div>
              <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-1">
                LIFESTYLE LEASE REGISTRY
              </span>
              <h2 className="text-xl md:text-2xl font-serif text-zinc-100 pr-8">
                Request "Maison d'Or" Tenancy
              </h2>
              <div className="flex items-center gap-2 border border-zinc-900 bg-black/60 px-3 py-2.5 rounded-none mt-3.5">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-none object-cover border border-[#D4AF37]/15 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-serif font-bold text-zinc-200 truncate">
                    {property.title}
                  </h4>
                  <p className="text-[10px] font-mono text-zinc-500 truncate">
                    {property.neighborhood} • ${property.price.toLocaleString()}/mo
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Inputs */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                1. Executive Profile Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-400 block">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sterling H. Dupont"
                    className="w-full bg-black border border-zinc-900 text-zinc-100 rounded-none px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] placeholder-zinc-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-400 block">Digital Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dupont@executive.com"
                    className="w-full bg-black border border-zinc-900 text-zinc-100 rounded-none px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] placeholder-zinc-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-400 block">Direct Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (416) 555-8822"
                    className="w-full bg-black border border-zinc-900 text-zinc-100 rounded-none px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] placeholder-zinc-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 block">Move-in Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={moveInDate}
                        onChange={(e) => setMoveInDate(e.target.value)}
                        className="w-full bg-black border border-zinc-900 text-zinc-100 rounded-none pl-3 pr-2 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] uppercase font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 block">Lease Length</label>
                    <select
                      value={durationMonths}
                      onChange={(e) => setDurationMonths(Number(e.target.value))}
                      className="w-full bg-black border border-zinc-900 text-zinc-100 rounded-none px-2.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] font-mono"
                    >
                      <option value={3}>3 Months</option>
                      <option value={6}>6 Months</option>
                      <option value={12}>12 Months (Standard)</option>
                      <option value={18}>18 Months</option>
                      <option value={24}>24 Months (Prestige VIP)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom VIP Options */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                2. Luxury VIP Customizations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {luxuryCustomizations.map((item) => {
                  const isChecked = specialRequests.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleLuxuryRequest(item.id)}
                      className={`border rounded-none p-3.5 cursor-pointer flex gap-3 select-none transition-all duration-300 ${
                        isChecked
                          ? "bg-[#D4AF37]/5 border-[#D4AF37]/60"
                          : "bg-black border-zinc-900 hover:border-zinc-850"
                      }`}
                    >
                      <div className={`mt-0.5 w-7 h-7 rounded-none flex items-center justify-center shrink-0 ${
                        isChecked ? "bg-[#D4AF37] text-black" : "bg-[#0b0b0b] border border-zinc-900"
                      }`}>
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-serif font-bold text-zinc-200">
                            {item.title}
                          </h4>
                          {isChecked && (
                            <span className="w-1.5 h-1.5 rounded-none bg-[#D4AF37] animate-pulse" />
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-normal mt-1 pr-1">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-zinc-900/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-zinc-550 block">Total Est. Security Deposit</span>
                <span className="text-lg font-serif font-semibold text-[#D4AF37]">
                  ${(property.price * 1.5).toLocaleString()} <span className="text-[10px] font-sans font-normal text-zinc-400">CAD</span>
                </span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#D4AF37] hover:bg-white text-black font-mono font-bold text-xs uppercase px-6 py-3.5 rounded-none flex items-center gap-2 tracking-wider transition-all duration-350 cursor-pointer disabled:bg-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Engaging Registry...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Tenancy Proposal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="py-8 text-center space-y-5">
            <div className="w-16 h-16 bg-[#D4AF37] rounded-none flex items-center justify-center mx-auto shadow-xl shadow-[#D4AF37]/10">
              <BadgeCheck className="w-9 h-9 text-black" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
                REGISTRY ASSIGNED: CONFIRMED
              </span>
              <h3 className="text-2xl font-serif text-zinc-100">
                Application Received, {fullName}!
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                Maison d'Or's underwriting boutique has initialized review on your requested lease for the{" "}
                <strong className="text-[#D4AF37] font-medium">{property.title}</strong>. An exclusive concierge agent is matching with your coordinates.
              </p>
            </div>
            
            <div className="bg-black border border-zinc-900 rounded-none p-4 max-w-sm mx-auto text-left text-xs font-mono text-zinc-400 space-y-2">
              <p className="flex justify-between">
                <span>Lease Duration:</span>
                <span className="text-zinc-200 font-bold">{durationMonths} Months</span>
              </p>
              <p className="flex justify-between">
                <span>Move-in target:</span>
                <span className="text-zinc-200 font-bold uppercase">{moveInDate}</span>
              </p>
              <p className="flex justify-between">
                <span>Bespoke features:</span>
                <span className="text-[#D4AF37] font-bold">
                  {specialRequests.length > 0 ? `${specialRequests.length} selected` : "Standard VIP"}
                </span>
              </p>
            </div>

            <button
              onClick={handleResetAndClose}
              className="bg-black hover:bg-zinc-900 border border-zinc-900 text-zinc-200 hover:text-[#D4AF37] font-mono text-xs px-6 py-3 rounded-none transition-all duration-300 uppercase cursor-pointer"
            >
              Return to Catalog
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
