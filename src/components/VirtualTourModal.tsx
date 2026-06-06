import React, { useState, useEffect, useRef, MouseEvent, TouchEvent, FC } from "react";
import { PropertyListing } from "../types";
import { 
  X, 
  Compass, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Camera, 
  Move, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  Plus, 
  Minus, 
  Layers, 
  MapPin, 
  Eye, 
  Info,
  ChevronRight,
  ChevronLeft,
  Share2,
  Twitter,
  Linkedin,
  Mail,
  Link
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VirtualTourModalProps {
  property: PropertyListing;
  isOpen: boolean;
  onClose: () => void;
}

interface Hotspot {
  id: string;
  x: number; // percentage coordinate 0 to 100 on the panorama span
  y: number; // absolute vertical offset percentage
  title: string;
  description: string;
}

interface Room {
  id: string;
  name: string;
  image: string;
  compassAngleOffset: number; // offset to rotate compass
  hotspots: Hotspot[];
}

export const VirtualTourModal: FC<VirtualTourModalProps> = ({ property, isOpen, onClose }) => {
  // Define rooms & hotspots for the property
  const rooms: Room[] = [
    {
      id: "living",
      name: "Grand Salon Loft",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1800",
      compassAngleOffset: 0,
      hotspots: [
        {
          id: "fireplace",
          x: 25,
          y: 65,
          title: "Travertine Hearth",
          description: "Double-sided hand-carved Italian travertine mantelpiece with clean-burning smart ethanol combustion."
        },
        {
          id: "skylight",
          x: 70,
          y: 20,
          title: "Double-Height Truss",
          description: "18-foot ceiling heights supported by exposed acoustic architectural cedar and automated ventilation."
        },
        {
          id: "sofa",
          x: 48,
          y: 75,
          title: "Curated French Linen Sofa",
          description: "Premium deep-seated down-filled linen sectional curated by Copenhagen interior ateliers."
        }
      ]
    },
    {
      id: "kitchen",
      name: "Culinary Gallery",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1800",
      compassAngleOffset: 90,
      hotspots: [
        {
          id: "appliances",
          x: 18,
          y: 45,
          title: "Gaggenau Integration",
          description: "Professional induction cooktop, steam ovens, and sub-zero wine climate controls concealed inside walnut cabinetry."
        },
        {
          id: "island",
          x: 55,
          y: 70,
          title: "Underlit Quartz Island",
          description: "Single-slab honed quartzite island bar with integrated charging fields and structural steel supports."
        }
      ]
    },
    {
      id: "bedroom",
      name: "Master Sanctuary",
      image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1800",
      compassAngleOffset: 180,
      hotspots: [
        {
          id: "bed",
          x: 35,
          y: 60,
          title: "Sovereign Silk Bedstead",
          description: "Bespoke king frame with raw-silk fabric headboard, organic memory foam, and posture control."
        },
        {
          id: "bathtub",
          x: 80,
          y: 55,
          title: "Monolithic Bath Retreat",
          description: "Soaking capsule carved from a single boulder of Turkish marble, overlooking the master bed bay."
        }
      ]
    },
    {
      id: "terrace",
      name: "Skyline Oasis Terrace",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1800",
      compassAngleOffset: 270,
      hotspots: [
        {
          id: "firebowl",
          x: 30,
          y: 75,
          title: "Prestige Fire Circle",
          description: "Concrete fire bowl equipped with multi-color dynamic ambient burner with micro-glass embers."
        },
        {
          id: "pool",
          x: 65,
          y: 80,
          title: "Sky Horizon Plunge",
          description: "Infinity edge heated plunge pool looking out onto the metropolitan harbor marina."
        }
      ]
    }
  ];

  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const activeRoom = rooms[activeRoomIndex];

  // States
  const [panX, setPanX] = useState(0); // in pixels
  const [isDragging, setIsDragging] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoom, setZoom] = useState(1); // Scale multiplier (1 to 1.6)
  const [soundOn, setSoundOn] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [loading, setLoading] = useState(true);
  const [cameraShutter, setCameraShutter] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const getShareUrl = () => {
    return `${window.location.origin}${window.location.pathname}?suite=${property.id}`;
  };

  const getShareText = () => {
    return `Explore this exquisite fully-furnished luxury suite: '${property.title}' in ${property.neighborhood}, ${property.city}. Experience virtual immersive optics:`;
  };

  const shareOnX = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getShareUrl();
    const text = getShareText();
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(xUrl, "_blank", "noopener,noreferrer");
    setShareStatus("Posted to X");
    setShowShareMenu(false);
    setTimeout(() => setShareStatus(null), 3500);
  };

  const shareOnLinkedIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getShareUrl();
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, "_blank", "noopener,noreferrer");
    setShareStatus("Posted to LinkedIn");
    setShowShareMenu(false);
    setTimeout(() => setShareStatus(null), 3500);
  };

  const shareViaEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getShareUrl();
    const subject = `Exquisite Luxury Suite Discovery: ${property.title}`;
    const body = `Greetings,\n\nI have discovered an exceptional luxury lease opportunity that matches diplomatic and corporate suite standards:\n\nTitle: ${property.title}\nNeighborhood: ${property.neighborhood}, ${property.city}\nLease Rate: $${property.price.toLocaleString()}/mo\nType: ${property.type}\n\nExperience this suite through virtual immersive 360-degree optics here:\n${url}\n\nBest regards.`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, "_blank");
    setShareStatus("Email Brief Ready");
    setShowShareMenu(false);
    setTimeout(() => setShareStatus(null), 3500);
  };

  const triggerWebShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: `Maison d'Or: ${property.title}`,
      text: `Take a look at this stunning fully furnished luxury rental at Maison d'Or: ${property.title} in ${property.neighborhood}.`,
      url: getShareUrl()
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareStatus("Shared successfully");
        setShowShareMenu(false);
        setTimeout(() => setShareStatus(null), 3500);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Web Share failed:", err);
          await copyToClipboard(getShareUrl());
        }
      }
    } else {
      await copyToClipboard(getShareUrl());
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus("Link copied");
      setShowShareMenu(false);
      setTimeout(() => setShareStatus(null), 3500);
    } catch {
      const subject = `Maison d'Or: ${property.title}`;
      const body = `Take a look at this stunning fully furnished luxury rental at Maison d'Or:\n\n${property.title} in ${property.neighborhood}\n\nUrl: ${url}`;
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoUrl, "_blank");
      setShareStatus("Mail brief ready");
      setShowShareMenu(false);
      setTimeout(() => setShareStatus(null), 3500);
    }
  };

  // Drag Refs
  const startXRef = useRef(0);
  const startPanXRef = useRef(0);
  const viewContainerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Panorama width constant (Virtual container wraps around)
  const PANORAMA_WIDTH = 2400;

  // Auto-rotation animation loop
  useEffect(() => {
    if (autoRotate && !isDragging) {
      const animate = () => {
        setPanX((prev) => {
          const nextPan = prev - 0.45; // gentle pan increment
          return nextPan < -PANORAMA_WIDTH ? nextPan + PANORAMA_WIDTH : nextPan;
        });
        rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
    } else {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [autoRotate, isDragging]);

  // Loading timer for rooms
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      // Center the view on room load
      setPanX(-PANORAMA_WIDTH / 4);
    }, 850);
    return () => clearTimeout(timer);
  }, [activeRoomIndex]);

  // Handle Drag Start (Mouse/Touch)
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setAutoRotate(false);
    startXRef.current = clientX;
    startPanXRef.current = panX;
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return; // only left click
    handleDragStart(e.clientX);
  };

  const handleTouchStart = (e: TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  // Handle Dragging
  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startXRef.current;
    let nextPan = startPanXRef.current + deltaX;

    // Boundary Wrap
    if (nextPan < -PANORAMA_WIDTH) {
      nextPan += PANORAMA_WIDTH;
    } else if (nextPan > 0) {
      nextPan -= PANORAMA_WIDTH;
    }
    setPanX(nextPan);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  // Handle Drag End
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Sound generator (Simulates a quiet relaxing high-rise lounge hum)
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let oscillator: OscillatorNode | null = null;
    let filterNode: BiquadFilterNode | null = null;
    let gainNode: GainNode | null = null;

    if (soundOn && isOpen) {
      try {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtx = new AudioCtxClass();
        
        // Low ambient noise
        oscillator = audioCtx.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(45, audioCtx.currentTime); // deeply bassy

        filterNode = audioCtx.createBiquadFilter();
        filterNode.type = "lowpass";
        filterNode.frequency.setValueAtTime(120, audioCtx.currentTime);

        gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime); // quiet

        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
      } catch (err) {
        console.warn("Speech/Audio Context is blocked or not sustained", err);
      }
    }

    return () => {
      if (oscillator) {
        try {
          oscillator.stop();
        } catch {}
      }
      if (audioCtx) {
        audioCtx.close().catch(() => {});
      }
    };
  }, [soundOn, isOpen]);

  // Photo snap action
  const triggerCameraSnap = () => {
    setCameraShutter(true);
    if (soundOn) {
      try {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtxClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } catch {}
    }
    setTimeout(() => setCameraShutter(false), 300);
  };

  // Calculate compass heading: map 0 to -PANORAMA_WIDTH panorama to 0 to 360 degrees
  const angle = (Math.abs(panX) % PANORAMA_WIDTH) / PANORAMA_WIDTH * 360;
  const currentHeading = ((angle + activeRoom.compassAngleOffset) % 360);

  const getCompassDirection = (h: number) => {
    if (h >= 337.5 || h < 22.5) return "N";
    if (h >= 22.5 && h < 67.5) return "NE";
    if (h >= 67.5 && h < 112.5) return "E";
    if (h >= 112.5 && h < 157.5) return "SE";
    if (h >= 157.5 && h < 202.5) return "S";
    if (h >= 202.5 && h < 247.5) return "SW";
    if (h >= 247.5 && h < 292.5) return "W";
    return "NW";
  };

  // Render rooms loop back or side-by-side to allow seamless endless scrolling
  const renderRoomsPanels = () => {
    return (
      <div 
        className="flex h-full select-none"
        style={{
          width: `${PANORAMA_WIDTH * 2}px`,
          transform: `translate3d(${panX}px, 0, 0)`,
          transition: isDragging ? "none" : "transform 0.1s ease-out"
        }}
      >
        {/* Set 1 */}
        <div className="relative h-full" style={{ width: `${PANORAMA_WIDTH}px` }}>
          <img 
            src={activeRoom.image} 
            alt="Seamless Pan view base" 
            className="w-full h-full object-cover select-none pointer-events-none"
            referrerPolicy="no-referrer"
            style={{ filter: `brightness(${showGrid ? 0.8 : 1}) inline: absolute` }}
          />
          {showGrid && <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none select-none" />}
          {renderHotspots(0)}
        </div>
        {/* Mirror Set 2 for seamless wrap looping */}
        <div className="relative h-full" style={{ width: `${PANORAMA_WIDTH}px` }}>
          <img 
            src={activeRoom.image} 
            alt="Seamless Pan view mirror" 
            className="w-full h-full object-cover select-none pointer-events-none"
            referrerPolicy="no-referrer"
            style={{ filter: `brightness(${showGrid ? 0.8 : 1})` }}
          />
          {showGrid && <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none select-none" />}
          {renderHotspots(PANORAMA_WIDTH)}
        </div>
      </div>
    );
  };

  const renderHotspots = (offsetAdjustment: number) => {
    return activeRoom.hotspots.map((hs) => {
      // hs.x is horizontal percentage from 0 to 100
      const leftPx = (hs.x / 100) * PANORAMA_WIDTH;
      const topPx = (hs.y / 100) * 100; // top is vertical percentage

      const isCurrentActive = activeHotspot?.id === hs.id;

      return (
        <div
          key={hs.id}
          className="absolute z-20 cursor-pointer pointer-events-auto"
          style={{
            left: `${leftPx}px`,
            top: `${topPx}%`,
            transform: "translate(-50%, -50%)"
          }}
          onClick={(e) => {
            e.stopPropagation();
            setActiveHotspot(isCurrentActive ? null : hs);
            setAutoRotate(false);
          }}
        >
          <div className="relative flex items-center justify-center">
            {/* Pulsing ring */}
            <span className="absolute inline-flex h-9 w-9 rounded-full bg-[#D4AF37]/35 animate-ping" />
            
            {/* Hotspot anchor dot */}
            <div className={`w-5 h-5 rounded-none border flex items-center justify-center transition-all ${
              isCurrentActive 
                ? "bg-[#D4AF37] border-white text-black scale-115" 
                : "bg-black/90 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
            }`}>
              <Plus className="w-3.5 h-3.5" />
            </div>

            {/* Micro info tag */}
            {!isCurrentActive && (
              <span className="absolute bottom-[-24px] bg-black/85 border border-zinc-900 px-1.5 py-0.5 text-[8px] font-mono text-zinc-300 tracking-wider uppercase whitespace-nowrap shadow-md select-none">
                {hs.title}
              </span>
            )}
          </div>
        </div>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-4">
      <div className="relative w-full max-w-6xl h-[85vh] md:h-[90vh] bg-black border border-[#D4AF37]/30 flex flex-col overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.08)]">
        
        {/* Flash snap screen overlay */}
        <AnimatePresence>
          {cameraShutter && (
            <motion.div 
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-white z-50 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Modal Header */}
        <div className="bg-[#050505] px-4 py-3 border-b border-[#D4AF37]/15 flex items-center justify-between z-30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-none border border-[#D4AF37]/30 bg-black flex items-center justify-center text-[#D4AF37]">
              <Compass className="w-4.5 h-4.5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest leading-none">Vantage Immersive Optics</span>
                <span className="w-1.5 h-1.5 rounded-none bg-emerald-500 animate-pulse" />
              </div>
              <h3 className="text-sm font-serif text-zinc-100 font-bold uppercase tracking-wider leading-tight mt-0.5">
                {property.title} • Virtual 3D
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative inline-block">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowShareMenu((prev) => !prev);
                }}
                className={`h-8 rounded-none border text-zinc-400 flex items-center justify-center transition-all cursor-pointer px-3 font-mono text-[9px] uppercase tracking-wider gap-1.5 shrink-0 ${
                  showShareMenu
                    ? "border-[#D4AF37] text-[#D4AF37] bg-zinc-950/90"
                    : "border-zinc-900 bg-black hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
                }`}
                title="Share Option Registry"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share Suite</span>
                {shareStatus && (
                  <span className="absolute bottom-full right-0 mb-2 bg-black border border-[#D4AF37] text-[#D4AF37] text-[8.5px] px-2 py-1 uppercase font-mono whitespace-nowrap z-50 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                    {shareStatus}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showShareMenu && (
                  <>
                    {/* Click-Outside Overlay Backstop */}
                    <div 
                      className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[0.5px] cursor-default" 
                      onClick={() => setShowShareMenu(false)}
                    />
                    
                    {/* Share Menu Dropdown Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute right-0 mt-2 z-50 w-72 bg-[#0c0c0c] border border-[#D4AF37]/40 shadow-[0_10px_35px_rgba(0,0,0,0.85)] p-3.5 flex flex-col space-y-2 rounded-none antialiased text-left normal-case"
                    >
                      {/* Header signature */}
                      <div className="border-b border-zinc-900 pb-2 mb-1 flex items-center justify-between">
                        <span className="text-[9px] font-mono uppercase tracking-widest font-bold text-[#D4AF37]">Share Portfolio Access</span>
                        <X 
                          className="w-3.5 h-3.5 text-zinc-650 hover:text-white cursor-pointer" 
                          onClick={() => setShowShareMenu(false)}
                        />
                      </div>

                      {/* Option 1: Web Share API System Share */}
                      <button
                        type="button"
                        onClick={triggerWebShare}
                        className="w-full text-left p-2 hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]/25 border border-transparent transition-all flex items-start gap-3 rounded-none group cursor-pointer"
                      >
                        <Share2 className="w-4.5 h-4.5 text-[#D4AF37] group-hover:scale-105 transition-transform mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-200 group-hover:text-white transition-colors leading-snug">System Share</p>
                          <p className="text-[9px] font-mono text-zinc-550 group-hover:text-zinc-400 transition-colors leading-tight mt-0.5">AirDrop, WhatsApp, Messages, or external device channels</p>
                        </div>
                      </button>

                      {/* Option 2: Twitter / X */}
                      <button
                        type="button"
                        onClick={shareOnX}
                        className="w-full text-left p-2 hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]/25 border border-transparent transition-all flex items-start gap-3 rounded-none group cursor-pointer"
                      >
                        <Twitter className="w-4.5 h-4.5 text-[#D4AF37] group-hover:scale-105 transition-transform mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-200 group-hover:text-white transition-colors leading-snug">Share on X / Twitter</p>
                          <p className="text-[9px] font-mono text-zinc-550 group-hover:text-zinc-400 transition-colors leading-tight mt-0.5">Publish details instantly on your social profile timeline</p>
                        </div>
                      </button>

                      {/* Option 3: LinkedIn */}
                      <button
                        type="button"
                        onClick={shareOnLinkedIn}
                        className="w-full text-left p-2 hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]/25 border border-transparent transition-all flex items-start gap-3 rounded-none group cursor-pointer"
                      >
                        <Linkedin className="w-4.5 h-4.5 text-[#D4AF37] group-hover:scale-105 transition-transform mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-200 group-hover:text-white transition-colors leading-snug">Publish on LinkedIn</p>
                          <p className="text-[9px] font-mono text-zinc-550 group-hover:text-zinc-400 transition-colors leading-tight mt-0.5">Share lease brief with professional, corporate networks</p>
                        </div>
                      </button>

                      {/* Option 4: Corporate Dispatch / Email */}
                      <button
                        type="button"
                        onClick={shareViaEmail}
                        className="w-full text-left p-2 hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]/25 border border-transparent transition-all flex items-start gap-3 rounded-none group cursor-pointer"
                      >
                        <Mail className="w-4.5 h-4.5 text-[#D4AF37] group-hover:scale-105 transition-transform mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-200 group-hover:text-white transition-colors leading-snug">Email Dispatch</p>
                          <p className="text-[9px] font-mono text-zinc-550 group-hover:text-zinc-400 transition-colors leading-tight mt-0.5">Compose official corporate or diplomatic email brief</p>
                        </div>
                      </button>

                      {/* Option 5: Copy Secure Link */}
                      <button
                        type="button"
                        onClick={() => copyToClipboard(getShareUrl())}
                        className="w-full text-left p-2 hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]/25 border border-transparent transition-all flex items-start gap-3 rounded-none group cursor-pointer"
                      >
                        <Link className="w-4.5 h-4.5 text-[#D4AF37] group-hover:scale-105 transition-transform mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-200 group-hover:text-white transition-colors leading-snug">Copy Secure Link</p>
                          <p className="text-[9px] font-mono text-zinc-550 group-hover:text-zinc-400 transition-colors leading-tight mt-0.5">Copy direct suite routing link to clipboard</p>
                        </div>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={() => setHelpOpen((prev) => !prev)}
              className="w-8 h-8 rounded-none bg-black border border-zinc-900 hover:border-[#D4AF37]/30 text-zinc-400 hover:text-[#D4AF37] flex items-center justify-center transition-colors cursor-pointer"
              title="Help Manual"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-none bg-black border border-zinc-900 hover:border-[#D4AF37]/35 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close System"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Informational Help overlay */}
        <AnimatePresence>
          {helpOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-14 right-4 z-40 w-72 bg-[#0c0c0c] border border-[#D4AF37]/40 p-4 font-mono text-[10px] text-zinc-300 leading-relaxed shadow-2xl"
            >
              <h4 className="text-[#D4AF37] text-xs font-serif font-bold tracking-wider uppercase mb-2 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> Navigation Manual
              </h4>
              <ul className="space-y-1.5 list-disc pl-3.5">
                <li><strong className="text-zinc-100">Drag & Look:</strong> Swipe or click-and-drag horizontally inside the spatial frame to pan 360 degrees.</li>
                <li><strong className="text-zinc-100">Hotspots (+):</strong> Interact with golden crosshairs to inspect raw finishes, design details, and material provenances.</li>
                <li><strong className="text-zinc-100">Deck Selection:</strong> Switch rooms via the bottom bay deck (Living Salon, Master Sanctuary, culinary, terrace).</li>
                <li><strong className="text-zinc-100">Autopilot:</strong> Toggle auto-spin using the loop rotation controls.</li>
              </ul>
              <button 
                onClick={() => setHelpOpen(false)}
                className="mt-3.5 w-full bg-black hover:bg-zinc-900 border border-zinc-900 hover:border-[#D4AF37]/40 py-1.5 text-center text-[#D4AF37] uppercase font-mono tracking-widest text-[9px] cursor-pointer"
              >
                Acknowledge Protocol
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Display Area (Sphere Panner Container) */}
        <div 
          ref={viewContainerRef}
          className="flex-1 relative bg-[#040404] overflow-hidden cursor-grab active:cursor-grabbing select-none group/view"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
        >
          
          {/* Calibrating / Rendering Loader */}
          <AnimatePresence>
            {loading && (
              <motion.div 
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black z-30 flex flex-col items-center justify-center space-y-3 pointer-events-none"
              >
                <div className="relative w-12 h-12">
                  <span className="absolute inset-0 border border-[#D4AF37]/20 rounded-none animate-spin-slow" />
                  <span className="absolute inset-2 border border-dashed border-[#D4AF37]/50 rounded-none animate-spin" />
                  <Compass className="absolute inset-0 m-auto w-4.5 h-4.5 text-[#D4AF37]" />
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-mono tracking-[0.2em] text-[#D4AF37] uppercase block animate-pulse">Optics Calibrating...</span>
                  <span className="text-[8px] font-mono text-zinc-650 block mt-1 uppercase">Loading 3D Horizon Grid • 360 Scan</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Panoramic Panning Horizon Stage */}
          <div 
            className="h-full relative transform-gpu origin-center"
            style={{
              transform: `scale(${zoom})`,
              transition: isDragging ? "none" : "transform 0.3s ease-out"
            }}
          >
            {renderRoomsPanels()}
          </div>

          {/* Map Location Coordinates indicator overlay */}
          <div className="absolute top-4 left-4 z-20 bg-black/85 border border-zinc-900/60 px-3 py-1.5 shadow-lg flex items-center gap-2.5 font-mono text-[10px] text-zinc-300">
            <span className="w-2 h-2 rounded-none bg-[#D4AF37] animate-pulse" />
            <span className="text-[#D4AF37] font-bold uppercase">{activeRoom.name.toUpperCase()}</span>
            <span className="text-zinc-600">|</span>
            <span>COORDINATE GRID: {Math.round(currentHeading)}° {getCompassDirection(currentHeading)}</span>
          </div>

          {/* Interactive Status Indicator Overlay (Compass Graphic) */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
            {/* Live Compass Ring */}
            <div className="bg-black/85 border border-zinc-900/60 p-2 shadow-lg flex items-center gap-2 font-mono text-[10px]">
              <Compass 
                className="w-4 h-4 text-[#D4AF37]" 
                style={{ transform: `rotate(${currentHeading}deg)` }}
              />
              <span className="text-[9px] text-[#D4AF37] font-bold">{getCompassDirection(currentHeading)}</span>
            </div>
          </div>

          {/* Snapshot & Spatial Controls Deck (HUD Right Rail) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20 flex flex-col gap-2.5 bg-black/85 border border-[#D4AF37]/15 p-2 rounded-none backdrop-blur-md opacity-85 hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(1.6, z + 0.15)); }}
              className="w-8 h-8 rounded-none border border-zinc-900 hover:border-[#D4AF37]/45 text-zinc-400 hover:text-[#D4AF37] bg-black flex items-center justify-center transition-all cursor-pointer"
              title="Zoom In (Optics Focus)"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(1, z - 0.15)); }}
              className="w-8 h-8 rounded-none border border-zinc-900 hover:border-[#D4AF37]/45 text-zinc-400 hover:text-[#D4AF37] bg-black flex items-center justify-center transition-all cursor-pointer"
              title="Zoom Out"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="h-[1px] bg-zinc-900 w-full" />
            <button
              onClick={(e) => { e.stopPropagation(); setAutoRotate((prev) => !prev); }}
              className={`w-8 h-8 rounded-none border flex items-center justify-center transition-all cursor-pointer ${
                autoRotate 
                  ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10" 
                  : "border-zinc-900 hover:border-[#D4AF37]/45 text-zinc-400 hover:text-[#D4AF37] bg-black"
              }`}
              title={autoRotate ? "Pause Auto-Rotation" : "Enable Auto-Rotation"}
            >
              <RotateCw className={`w-4 h-4 ${autoRotate ? "animate-spin-slow" : ""}`} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowGrid((prev) => !prev); }}
              className={`w-8 h-8 rounded-none border flex items-center justify-center transition-all cursor-pointer ${
                showGrid 
                  ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10" 
                  : "border-zinc-900 hover:border-[#D4AF37]/45 text-zinc-400 hover:text-[#D4AF37] bg-black"
              }`}
              title="Toggle Alignment Grid"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setSoundOn((prev) => !prev); }}
              className={`w-8 h-8 rounded-none border flex items-center justify-center transition-all cursor-pointer ${
                soundOn 
                  ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10" 
                  : "border-zinc-900 hover:border-[#D4AF37]/45 text-zinc-400 hover:text-[#D4AF37] bg-black"
              }`}
              title="Toggle Spatial Ambiance Room Hum"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-[#D4AF37]" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); triggerCameraSnap(); }}
              className="w-8 h-8 rounded-none border border-zinc-900 hover:border-[#D4AF37]/45 text-zinc-400 hover:text-[#D4AF37] bg-black flex items-center justify-center transition-all cursor-pointer"
              title="Take Scenic Client Snapshot"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom center Drag notification */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none select-none bg-black/85 border border-zinc-950 px-3.5 py-1 text-[8.5px] font-mono text-zinc-450 tracking-widest uppercase flex items-center gap-1.5 shadow-md">
            <Move className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
            <span>Click & Drag to Rotatably Pan Suite</span>
          </div>

          {/* Active Hotspot Info Card overlay */}
          <AnimatePresence>
            {activeHotspot && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute bottom-6 left-6 z-30 w-72 bg-[#090909]/95 border border-[#D4AF37]/50 rounded-none p-4 shadow-2xl backdrop-blur-md pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-2 border-b border-zinc-900 pb-2 mb-2">
                  <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-wider font-semibold">
                    FINISH OPTICAL ANALYZER
                  </span>
                  <button 
                    onClick={() => setActiveHotspot(null)}
                    className="text-zinc-550 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <h4 className="text-sm font-serif font-bold text-zinc-100 flex items-center gap-1.5 uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>{activeHotspot.title}</span>
                </h4>
                
                <p className="text-[10.5px] text-zinc-400 leading-relaxed font-sans mt-2">
                  {activeHotspot.description}
                </p>

                <div className="mt-3 pt-2.5 border-t border-zinc-900 flex justify-between items-center text-[8.5px] font-mono text-zinc-550">
                  <span>SPEC ACCREDITED: YES</span>
                  <span className="text-[#D4AF37] font-semibold">PREMIUM FITOUT</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Room Navigation Deck Drawer */}
        <div className="bg-[#050505] border-t border-[#D4AF37]/15 p-3 sm:p-4 z-30 shrink-0 select-none">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 max-w-5xl mx-auto">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1 sm:mb-0">
              <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Optic Room Selectors:</span>
            </span>

            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 px-1">
              {rooms.map((room, idx) => {
                const isActive = activeRoomIndex === idx;
                return (
                  <button
                    key={room.id}
                    onClick={() => {
                      setActiveRoomIndex(idx);
                      setActiveHotspot(null);
                    }}
                    className={`py-2 px-3 border text-left font-mono text-[10px] transition-all flex flex-col justify-between cursor-pointer rounded-none relative overflow-hidden ${
                      isActive 
                        ? "bg-[#D4AF37]/10 border-[#D4AF37] text-white font-bold" 
                        : "bg-black hover:bg-zinc-900 border-zinc-900 hover:border-[#D4AF37]/35 text-zinc-455 hover:text-zinc-200"
                    }`}
                  >
                    {/* Tiny visual compass indicator for selector */}
                    <span className="text-[8px] text-zinc-400 font-normal uppercase block mb-0.5">ROOM 0{idx + 1}</span>
                    <span className={`block truncate ${isActive ? "text-[#D4AF37]" : "text-zinc-300"}`}>
                      {room.name}
                    </span>
                    
                    {/* Active pointer block */}
                    {isActive && (
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#D4AF37]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTourModal;
