import React, { useState, useEffect, useMemo, useRef } from "react";
import { PropertyListing } from "../types";
import { Compass, ZoomIn, ZoomOut, Maximize2, MapPin, Eye, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PropertyMapProps {
  properties: PropertyListing[];
  selectedProperty: PropertyListing | null;
  onSelectProperty: (property: PropertyListing | null) => void;
  activeCity: "Vancouver" | "Toronto";
}

export default function PropertyMap({
  properties,
  selectedProperty,
  onSelectProperty,
  activeCity
}: PropertyMapProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredProperty, setHoveredProperty] = useState<PropertyListing | null>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Reset zoom/pan when city changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [activeCity]);

  // Project lat/lng to [0, 100]% coordinates based on city boundaries
  const projectCoordinates = (lat: number, lng: number): { x: number; y: number } => {
    if (activeCity === "Vancouver") {
      // Lat: 49.270 to 49.295, Lng: -123.130 to -123.105
      const minLat = 49.270;
      const maxLat = 49.295;
      const minLng = -123.130;
      const maxLng = -123.105;

      const x = ((lng - minLng) / (maxLng - minLng)) * 100;
      const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100; // invert Y for screen coords
      return { x: Math.max(10, Math.min(90, x)), y: Math.max(10, Math.min(90, y)) };
    } else {
      // Toronto -> Lat: 43.630 to 43.680, Lng: -79.400 to -79.350
      const minLat = 43.630;
      const maxLat = 43.680;
      const minLng = -79.400;
      const maxLng = -79.350;

      const x = ((lng - minLng) / (maxLng - minLng)) * 100;
      const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;
      return { x: Math.max(10, Math.min(90, x)), y: Math.max(10, Math.min(90, y)) };
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".map-controls") || (e.target as HTMLElement).closest(".map-marker")) {
      return;
    }
    isDragging.current = true;
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const currentCityProperties = useMemo(() => {
    return properties.filter((p) => p.city === activeCity);
  }, [properties, activeCity]);

  const handleCenter = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Beautiful stylized golden grid lines and waterways for background
  const renderMapBackground = () => {
    if (activeCity === "Vancouver") {
      return (
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none select-none" xmlns="http://www.w3.org/2000/svg">
          {/* Grid background */}
          <defs>
            <pattern id="vanc-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.15" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#vanc-grid)" />

          {/* Waterway (Burrard Inlet at the top) */}
          <path d="M -10,-10 C 20,40 50,30 110,15 L 110,-10 Z" fill="#D4AF37" fillOpacity="0.08" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.2" />
          
          {/* Stanley Park (Top Left green-esque shape, styled in golden outline) */}
          <path d="M 5,5 Q 15,30 30,25 T 35,5 Z" fill="#D4AF37" fillOpacity="0.05" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.3" />

          {/* False Creek (Bottom) */}
          <path d="M -10,80 Q 30,75 55,83 T 110,80" fill="none" stroke="#D4AF37" strokeWidth="8" strokeOpacity="0.05" />

          {/* Street lines (golden schematics) */}
          <line x1="30" y1="40" x2="110" y2="40" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.1" />
          <line x1="25" y1="50" x2="110" y2="50" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.1" />
          <line x1="20" y1="60" x2="110" y2="60" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.1" />
          
          <line x1="40" y1="30" x2="40" y2="90" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.1" />
          <line x1="65" y1="30" x2="65" y2="90" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.1" />
          <line x1="90" y1="30" x2="90" y2="90" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.1" />

          {/* Texts */}
          <text x="15" y="15" fill="#D4AF37" fillOpacity="0.4" fontSize="10" fontFamily="monospace" letterSpacing="1">STANLEY PARK</text>
          <text x="60" y="25" fill="#D4AF37" fillOpacity="0.4" fontSize="11" fontFamily="monospace" letterSpacing="1">COAL HARBOUR</text>
          <text x="65" y="70" fill="#D4AF37" fillOpacity="0.4" fontSize="10" fontFamily="monospace" letterSpacing="1">YALETOWN</text>
        </svg>
      );
    } else {
      return (
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none select-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="toro-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.15" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#toro-grid)" />

          {/* Lake Ontario (Bottom half) */}
          <path d="M -10,85 Q 50,75 110,85 L 110,110 L -10,110 Z" fill="#D4AF37" fillOpacity="0.08" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.2" />

          {/* Toronto Island outline */}
          <path d="M 30,93 Q 50,91 70,95 T 90,92 Q 60,99 30,93 Z" fill="#D4AF37" fillOpacity="0.05" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.2" />

          {/* Major streets (Yonge, Bloor, Front) */}
          <line x1="50" y1="0" x2="50" y2="85" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.2" /> {/* Yonge St */}
          <line x1="0" y1="25" x2="110" y2="25" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.15" /> {/* Bloor St */}
          <line x1="0" y1="75" x2="110" y2="75" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.15" /> {/* Front St */}

          {/* Diagonal highways (DVP/Gardiner) */}
          <path d="M 0,80 C 40,78 60,76 95,50 T 110,0" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.1" />

          {/* Texts */}
          <text x="55" y="18" fill="#D4AF37" fillOpacity="0.4" fontSize="11" fontFamily="monospace" letterSpacing="1">YORKVILLE</text>
          <text x="15" y="65" fill="#D4AF37" fillOpacity="0.4" fontSize="10" fontFamily="monospace" letterSpacing="1">CN TOWER</text>
          <text x="55" y="81" fill="#D4AF37" fillOpacity="0.5" fontSize="11" fontFamily="monospace" letterSpacing="1">WATERFRONT</text>
        </svg>
      );
    }
  };

  return (
    <div
      id="map-console-panel"
      ref={mapContainerRef}
      className="relative w-full h-[350px] md:h-[450px] bg-black border border-[#D4AF37]/20 rounded-none overflow-hidden cursor-grab active:cursor-grabbing select-none group"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Banner overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/90 border border-[#D4AF37]/30 px-3 py-1.5 rounded-none text-xs font-mono text-zinc-400 backdrop-blur-md">
        <Compass className="w-3.5 h-3.5 text-[#D4AF37] animate-spin-slow" />
        <span>VANTAGE METROPOLITAN MATRIX</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
        <span className="text-[#D4AF37] font-semibold">{activeCity.toUpperCase()}</span>
      </div>

      {/* Map Content Wrapper */}
      <div
        className="absolute inset-0 w-full h-full transition-transform duration-200 ease-out"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center"
        }}
      >
        {renderMapBackground()}

        {/* Render Property Pins */}
        {currentCityProperties.map((p) => {
          const { x, y } = projectCoordinates(p.coordinates.lat, p.coordinates.lng);
          const isSelected = selectedProperty?.id === p.id;
          const isHovered = hoveredProperty?.id === p.id;

          return (
            <div
              key={p.id}
              className="map-marker absolute group/pin cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => setHoveredProperty(p)}
              onMouseLeave={() => setHoveredProperty(null)}
              onClick={() => onSelectProperty(isSelected ? null : p)}
            >
              <div className="relative flex items-center justify-center">
                {/* Ping rings */}
                {isSelected && (
                  <span className="absolute inline-flex h-12 w-12 rounded-full bg-[#D4AF37]/20 animate-ping" />
                )}
                {isHovered && !isSelected && (
                  <span className="absolute inline-flex h-8 w-8 rounded-full bg-[#D4AF37]/15 animate-ping" />
                )}

                {/* Pin visual */}
                <motion.div
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-none border transition-all duration-300 ${
                    isSelected
                      ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 scale-110 font-bold"
                      : "bg-black hover:bg-zinc-900 text-[#D4AF37] border-[#D4AF37]/35 hover:border-[#D4AF37]"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[10px] font-mono tracking-tight font-medium">
                    ${(p.price / 1000).toFixed(1)}k
                  </span>
                </motion.div>
                
                {/* Arrow Pointer */}
                <div className={`absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent ${
                  isSelected ? "border-t-[4px] border-t-[#D4AF37]" : "border-t-[4px] border-t-zinc-900 border-b-zinc-800/10"
                }`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Controls */}
      <div className="map-controls absolute bottom-4 right-4 z-10 flex flex-col gap-1 bg-black/95 border border-[#D4AF37]/25 p-1.5 rounded-none backdrop-blur-md">
        <button
          onClick={() => setZoom((prev) => Math.min(2.5, prev + 0.25))}
          className="p-2 text-zinc-400 hover:text-[#D4AF37] hover:bg-zinc-950 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((prev) => Math.max(0.6, prev - 0.25))}
          className="p-2 text-zinc-400 hover:text-[#D4AF37] hover:bg-zinc-950 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleCenter}
          className="p-2 text-zinc-400 hover:text-[#D4AF37] hover:bg-zinc-950 transition-colors"
          title="Recenter Map"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Dynamic Gold Overlay Tooltip */}
      <AnimatePresence>
        {(hoveredProperty || selectedProperty) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-4 left-4 z-10 w-64 md:w-72 bg-black/95 border border-[#D4AF37]/40 rounded-none p-3 shadow-2xl backdrop-blur-lg pointer-events-auto"
          >
            {(() => {
              const item = hoveredProperty || selectedProperty;
              if (!item) return null;
              return (
                <div className="flex gap-2">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-none object-cover border border-[#D4AF37]/20 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-mono uppercase text-[#D4AF37] tracking-wider font-semibold">
                      {item.type} • {item.neighborhood.split(" / ")[0]}
                    </span>
                    <h4 className="text-xs font-serif font-semibold text-zinc-100 truncate mt-0.5">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5 font-mono">
                      {item.bedrooms} Bed • {item.bathrooms} Bath • {item.sqft} sq ft
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-serif text-[#D4AF37] font-bold">
                        ${item.price.toLocaleString()}/mo
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProperty(item);
                        }}
                        className="text-[9px] font-mono text-zinc-300 hover:text-[#D4AF37] flex items-center gap-1 border border-zinc-900 bg-black hover:bg-zinc-900 px-1.5 py-0.5 rounded-none transition-colors"
                      >
                        <Building2 className="w-3 h-3" />
                        <span>View Suite</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Status Line */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 px-3 py-1 bg-black/90 border border-[#D4AF37]/35 text-[10px] font-mono text-zinc-500 tracking-wider rounded-none pointer-events-none select-none backdrop-blur-sm hidden md:flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-none bg-[#D4AF37] animate-pulse" />
        <span>METROPOLITAN COORDINATE GRID: SYSTEM STABLE</span>
      </div>
    </div>
  );
}
