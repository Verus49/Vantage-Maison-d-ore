import React, { FC, useRef } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  Crown, 
  UserCheck, 
  Building, 
  Sparkles,
  MapPin,
  Star
} from "lucide-react";

interface Testimonial {
  id: string;
  clientName: string;
  title: string;
  organization: string;
  residenceStayed: string;
  quote: string;
  ratingStars: number;
  location: string;
  date: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    clientName: "Sir Alistair Montgomery",
    title: "Senior Diplomatic Attaché",
    organization: "Global Sovereign Mission",
    residenceStayed: "Sovereign Yorkville Penthouse",
    quote: "Securing high-accredited safety together with five-star architectural elegance in Toronto had previously been a week-long ordeal. Vantage’s curated platform and immediate concierge response turned relocation into a masterfully seamless execution.",
    ratingStars: 5,
    location: "Toronto, ON",
    date: "April 2026"
  },
  {
    id: "2",
    clientName: "Dr. Elena Rostova",
    title: "Chief AI Architect",
    organization: "Aetheris Neural Labs",
    residenceStayed: "Coal Harbour Premium Tower",
    quote: "The 3D virtual tour fidelity is mathematically flawless. Every structural panel, marble vein, and light projection mapped perfectly to reality when I stepped inside. Vantage has bypassed the conventional gatekeeping of premium residential brokerage.",
    ratingStars: 5,
    location: "Vancouver, BC",
    date: "May 2026"
  },
  {
    id: "3",
    clientName: "Marcus Vance",
    title: "Managing Partner",
    organization: "Goldcrest Capital Partners",
    residenceStayed: "High-Fashion Yorkville Loft",
    quote: "The side-by-side Suite Comparator is a tool of sheer clarity. Analyzing rent-per-square-foot ratios, private amenities, and community prestige indexes in a unified gold theme enabled our board to make an instant executive lease decision.",
    ratingStars: 5,
    location: "Toronto, ON",
    date: "March 2026"
  },
  {
    id: "4",
    clientName: "Siddharth Nair",
    title: "Executive Vice President",
    organization: "Insignia Shipping Corp",
    residenceStayed: "Urban Luxury Vancouver Penthouse",
    quote: "Vantage provides more than simple residential listings; they deliver absolute peace of mind. From the private helicopter access integration to the custom key deposits, their operation remains unmatched in North America.",
    ratingStars: 5,
    location: "Vancouver, BC",
    date: "June 2026"
  },
  {
    id: "5",
    clientName: "Charlotte Dubois",
    title: "Artistic Director & Curator",
    organization: "Beaux-Arts Maritime Museum",
    residenceStayed: "Patrimonial Distillery Townhome",
    quote: "As someone who lives and breathes spatial composition, I was mesmerized by the interior curation. The physical flow of the loft space coupled with Vantage’s premium attention to detail established a true home away from home.",
    ratingStars: 5,
    location: "Toronto, ON",
    date: "February 2026"
  }
];

export const ClientExperiences: FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      // Scroll by one card width (approx 360px + gap)
      const scrollAmount = direction === "left" ? -390 : 390;
      scrollContainerRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-gradient-to-b from-black via-[#060606] to-black border border-zinc-900 p-5 md:p-8 rounded-none shadow-[0_0_40px_rgba(212,175,55,0.02)] mt-8 select-none">
      
      {/* Decorative Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-900 pb-5 mb-6 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 border border-[#D4AF37]/35 bg-black flex items-center justify-center text-[#D4AF37]">
            <Quote className="w-5 h-5 fill-[#D4AF37]/15" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[8.5px] font-mono text-[#D4AF37] uppercase tracking-widest leading-none">Patron Ledger</span>
              <span className="text-[7.5px] font-mono text-zinc-500 bg-zinc-950 border border-zinc-900 px-1.5 py-0.2 uppercase leading-none rounded-none">
                Verified Executive Reviews
              </span>
            </div>
            <h3 className="text-base md:text-lg font-serif uppercase tracking-wider font-semibold text-zinc-150 mt-1">
              Client Experiences & Testimony
            </h3>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll("left")}
            className="w-9 h-9 rounded-none bg-black border border-zinc-900 hover:border-[#D4AF37]/35 text-zinc-400 hover:text-[#D4AF37] flex items-center justify-center transition-all cursor-pointer active:scale-95"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="w-9 h-9 rounded-none bg-black border border-zinc-900 hover:border-[#D4AF37]/35 text-zinc-400 hover:text-[#D4AF37] flex items-center justify-center transition-all cursor-pointer active:scale-95"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Frame */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth snap-x snap-mandatory py-2 pb-5"
        style={{ scrollbarWidth: "none" }}
      >
        {TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="flex-shrink-0 w-full sm:w-[380px] snap-start bg-[#050505] border border-[#D4AF37]/30 hover:border-[#D4AF37]/80 p-5 md:p-6 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.01)] hover:shadow-[0_0_25px_rgba(212,175,55,0.04)] relative flex flex-col justify-between"
          >
            {/* Visual Gold Border Accents */}
            <div className="absolute top-0 left-0 w-2 h-[1px] bg-[#D4AF37]" />
            <div className="absolute top-0 left-0 w-[1px] h-2 bg-[#D4AF37]" />
            <div className="absolute top-0 right-0 w-2 h-[1px] bg-[#D4AF37]" />
            <div className="absolute top-0 right-0 w-[1px] h-2 bg-[#D4AF37]" />
            
            <div className="space-y-4">
              {/* Rating crown/stars deck */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.ratingStars }).map((_, idx) => (
                    <Star key={idx} className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>
                <div className="flex items-center gap-1 text-[8px] font-mono text-zinc-550 uppercase">
                  <Crown className="w-3 h-3 text-[#D4AF37]" />
                  <span>Vantage Tier</span>
                </div>
              </div>

              {/* Italicized Testimonial quote with high-end typography */}
              <p className="text-zinc-300 font-serif italic text-xs leading-relaxed md:text-[13px] tracking-wide select-text">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            {/* Past Executive Client Signature Block */}
            <div className="mt-6 pt-5 border-t border-zinc-900 flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-[11px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider">
                    {t.clientName}
                  </h4>
                  <div className="text-[9.5px] font-mono text-zinc-400 mt-0.5 uppercase tracking-wide">
                    {t.title}
                  </div>
                  <div className="text-[9px] font-mono text-zinc-550 mt-0.5 flex items-center gap-1 uppercase">
                    <Building className="w-3 h-3 text-zinc-650" />
                    <span>{t.organization}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-mono text-[#D4AF37] bg-[#D4AF37]/5 border border-[#D4AF37]/15 px-2 py-0.5 uppercase">
                    {t.date}
                  </span>
                </div>
              </div>

              {/* Visual tag for where they stayed */}
              <div className="bg-[#090909] border border-zinc-910 p-2 text-[9px] font-mono flex items-center justify-between text-zinc-500 uppercase mt-1">
                <span className="flex items-center gap-1 text-zinc-400">
                  <MapPin className="w-3 h-3 text-[#D4AF37]/75" />
                  <span>Stayed at {t.residenceStayed}</span>
                </span>
                <span className="text-zinc-650">{t.location}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Decorative Bottom Help/Accreditation Note */}
      <div className="flex justify-between items-center text-[8.5px] font-mono text-zinc-600 mt-2">
        <span className="flex items-center gap-1.5 uppercase">
          <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>All client relationships are subject to mutual NDA execution. Names printed under custom permission.</span>
        </span>
        <span className="uppercase text-right">Page 1 of 1 Verified testimony</span>
      </div>

    </section>
  );
};

export default ClientExperiences;
