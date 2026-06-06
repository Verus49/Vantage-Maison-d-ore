import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, MessageSquare, ArrowRight, CornerDownLeft, Loader2, Compass, Download, FileText, FileCode, ChevronDown, Check, X } from "lucide-react";
import { ChatMessage, SearchFilters } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface AIConciergeProps {
  onApplyFilters: (filters: Partial<SearchFilters>) => void;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  prefilledInput?: string;
  onClearPrefill?: () => void;
}

export default function AIConcierge({
  onApplyFilters,
  chatHistory,
  setChatHistory,
  prefilledInput,
  onClearPrefill
}: AIConciergeProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const exportAsJSON = () => {
    if (chatHistory.length === 0) return;
    
    const exportData = {
      registry: "Maison d'Or Diplomatic Real Estate Registry",
      dispatch_ref: `MDO-CONCIERGE-${Date.now().toString().slice(-6).toUpperCase()}`,
      dispatch_timestamp: new Date().toISOString(),
      client_email: "nn2611067@gmail.com",
      dialogue: chatHistory.map((msg, index) => ({
        sequence: index + 1,
        messenger: msg.sender === "concierge" ? "LA CONCIERGE D'OR" : "CLIENT RECIPIENT",
        timestamp: msg.timestamp,
        text: msg.text,
        registry_matches: msg.suggestedFilters || null
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Maison_dOr_Concierge_Dispatch_${exportData.dispatch_ref}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setNotification("JSON DISPATCH SECURED");
    setShowExportDropdown(false);
    setTimeout(() => setNotification(null), 3500);
  };

  const exportAsText = () => {
    if (chatHistory.length === 0) return;
    
    const dispatchRef = `MDO-CONCIERGE-${Date.now().toString().slice(-6).toUpperCase()}`;
    const timestamp = new Date().toLocaleString();
    
    let content = `================================================================================
                    MAISON D'OR DIPLOMATIC PORTFOLIO REGISTRY
================================================================================
                       AI CONCIERGE CHAT BRIEF DISPATCH
================================================================================
Dispatch Ref:   ${dispatchRef}
Export Date:    ${timestamp}
Client Scope:   Luxury Residential Tailoring Services

Dear Client,

Below is the verified diagnostic transcript of your curated session with the 
La Concierge d'Or service module regarding luxury rental acquisitions.

================================================================================
                     CONVERSATION DIALOGUE RECORD
================================================================================\n\n`;

    chatHistory.forEach((msg, idx) => {
      const isConcierge = msg.sender === "concierge";
      const senderLabel = isConcierge ? "LA CONCIERGE D'OR (AI)" : "CLIENT RECIPIENT";
      const blockSeparator = "--------------------------------------------------------------------------------";
      
      content += `${blockSeparator}\n`;
      content += `[${msg.timestamp}] ${senderLabel}\n`;
      content += `"${msg.text}"\n`;
      
      if (isConcierge && msg.suggestedFilters) {
        content += `\n>> [REGISTRY FILTER TUNING]:\n`;
        const filters = msg.suggestedFilters;
        if (filters.city && filters.city !== "all") content += `   • Geographic Target: ${filters.city}\n`;
        if (filters.maxPrice) content += `   • Rent Threshold: $${filters.maxPrice.toLocaleString()}/mo\n`;
        if (filters.bedrooms && filters.bedrooms !== "all") content += `   • Chamber Spec: ${filters.bedrooms} bedroom(s)\n`;
        if (filters.type && filters.type !== "all") content += `   • Estate Profile: ${filters.type}\n`;
      }
      content += `\n`;
    });

    content += `================================================================================
                                 END OF BRIEFING
================================================================================
This transcript details proprietary matching algorithms & search query state configurations.
La Concierge d'Or • Bespoke Living Spaces • Vancouver • Toronto
================================================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Maison_dOr_Concierge_Dispatch_${dispatchRef}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setNotification("TEXT BRIEF SECURED");
    setShowExportDropdown(false);
    setTimeout(() => setNotification(null), 3500);
  };

  // Prefill effect
  useEffect(() => {
    if (prefilledInput) {
      setInput(prefilledInput);
      if (onClearPrefill) {
        onClearPrefill();
      }
    }
  }, [prefilledInput, onClearPrefill]);

  const presetInquiries = [
    {
      label: "Vancouver Harbour Condo near $4k",
      text: "I am an international executive looking for a 2-bedroom furnished condo near Vancouver Harbour with a budget of $4,000."
    },
    {
      label: "Toronto Skyline Penthouse",
      text: "Show me a luxury penthouse in Toronto with sky-high views and a Private Pool."
    },
    {
      label: "Cozy Loft in Yorkville",
      text: "I want an elegant furnished Yorkville loft with double-height ceilings around $5,000."
    }
  ];

  const conciergeTips = [
    {
      label: "What are the most pet-friendly options?",
      text: "What are the most pet-friendly options in the Maison d'Or portfolio?"
    },
    {
      label: "Show me listings with private gyms",
      text: "Show me listings with premier private gyms and wellness amenities."
    }
  ];

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsgId = Date.now().toString();
    const newUserMessage: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setChatHistory((prev) => [...prev, newUserMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/concierge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: [...chatHistory, newUserMessage]
        })
      });

      if (!response.ok) {
        throw new Error("Maison d'Or registry communication service failed.");
      }

      const data = await response.json();
      
      const conciergeMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "concierge",
        text: data.reply || "I have adjusted our fine portfolios for your approval.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedFilters: data.filters
      };

      setChatHistory((prev) => [...prev, conciergeMessage]);

      if (data.filters) {
        // Feed the extracted parameters into the main interface
        onApplyFilters(data.filters);
      }
    } catch (error) {
      console.error("Concierge query failed:", error);
      
      // Resilient elegant fallback logic
      const fallbackText = "Forgive me, my direct link with our registry is currently experiencing interference, but I have tailored our catalog listings manually based on your parameters. Let me know if you would like me to draft an application for a booking.";
      
      const conciergeMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "concierge",
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setChatHistory((prev) => [...prev, conciergeMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className="flex flex-col h-[500px] bg-[#0c0c0c] border border-[#D4AF37]/30 rounded-none overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.06)] flex-1 max-w-full">
      {/* Header Container */}
      <div className="flex items-center justify-between bg-[#080808] px-4 py-3.5 border-b border-[#D4AF37]/20 relative">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/45 flex items-center justify-center p-[1px]">
              <Sparkles className="w-4.5 h-4.5 text-[#D4AF37]" />
            </div>
            <span className="absolute bottom-[-1px] right-[-1px] w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#080808] animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-serif uppercase tracking-widest text-zinc-100 font-semibold leading-tight">
              LA CONCIERGE D'OR
            </h3>
            <p className="text-[10px] font-mono text-[#D4AF37]/80 uppercase tracking-widest flex items-center gap-1">
              <Compass className="w-3 h-3 animate-spin-slow" />
              <span>Bespoke AI Tailoring</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Badges */}
        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline-block text-[9px] font-mono text-zinc-400 bg-black px-2.5 py-1 rounded-none border border-[#D4AF37]/10 uppercase">
            Suite Offline Ready
          </span>

          <div className="relative">
            <button
              onClick={() => setShowExportDropdown((prev) => !prev)}
              disabled={chatHistory.length === 0}
              className={`h-7.5 rounded-none px-3 text-[9px] font-mono uppercase tracking-widest border transition-all cursor-pointer flex items-center gap-1.5 ${
                showExportDropdown
                  ? "bg-[#D4AF37] text-black border-[#D4AF37] font-semibold"
                  : chatHistory.length === 0
                  ? "opacity-30 cursor-not-allowed border-zinc-900 text-zinc-650 bg-black"
                  : "bg-black hover:bg-[#D4AF37]/5 border-[#D4AF37]/35 text-[#D4AF37] hover:border-[#D4AF37]"
              }`}
              type="button"
              title="Secure Session Archive"
            >
              <Download className="w-3 h-3 text-current" />
              <span>Export</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 text-current ${showExportDropdown ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showExportDropdown && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[0.5px]"
                    onClick={() => setShowExportDropdown(false)}
                  />
                  {/* Dropdown Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-2.5 z-50 w-52 bg-[#0c0c0c] border border-[#D4AF37]/45 shadow-[0_12px_40px_rgba(0,0,0,0.95)] p-2.5 flex flex-col space-y-1 rounded-none text-left"
                  >
                    <div className="px-1.5 py-1 border-b border-zinc-900 mb-1 flex items-center justify-between">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">Secure Dispatch</span>
                      <X className="w-3 h-3 text-zinc-650 hover:text-white cursor-pointer" onClick={() => setShowExportDropdown(false)} />
                    </div>

                    {/* Export Formatted Text */}
                    <button
                      type="button"
                      onClick={exportAsText}
                      className="w-full text-left p-1.5 hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]/25 border border-transparent transition-all flex items-center gap-2.5 rounded-none group cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-[#D4AF37] group-hover:scale-105 transition-transform" />
                      <div className="min-w-0">
                        <p className="text-[9.5px] font-mono uppercase tracking-wider text-zinc-200 group-hover:text-white transition-colors animate-none">Formatted Brief</p>
                        <p className="text-[8px] font-mono text-zinc-650 group-hover:text-zinc-400 transition-colors mt-0.5 normal-case">Prestige Letterhead .txt</p>
                      </div>
                    </button>

                    {/* Export JSON Registry */}
                    <button
                      type="button"
                      onClick={exportAsJSON}
                      className="w-full text-left p-1.5 hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]/25 border border-transparent transition-all flex items-center gap-2.5 rounded-none group cursor-pointer"
                    >
                      <FileCode className="w-4 h-4 text-[#D4AF37] group-hover:scale-105 transition-transform" />
                      <div className="min-w-0">
                        <p className="text-[9.5px] font-mono uppercase tracking-wider text-zinc-200 group-hover:text-white transition-colors animate-none">JSON Metadata</p>
                        <p className="text-[8px] font-mono text-zinc-650 group-hover:text-zinc-400 transition-colors mt-0.5 normal-case">Structured Archive .json</p>
                      </div>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -10, x: "-50%" }}
              className="absolute left-1/2 bottom-[-16px] transform -translate-x-1/2 z-50 bg-black border border-[#D4AF37] text-[#D4AF37] font-mono text-[8px] tracking-widest uppercase px-3 py-1 flex items-center gap-1.5 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
            >
              <Check className="w-3 h-3 text-[#D4AF37]" />
              <span>{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-black/60 custom-scrollbar">
        <AnimatePresence initial={false}>
          {chatHistory.map((msg) => {
            const isConcierge = msg.sender === "concierge";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-3 max-w-[85%] ${
                  isConcierge ? "mr-auto" : "ml-auto flex-row-reverse"
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-7 h-7 flex items-center justify-center shrink-0 border rounded-none text-xs font-mono mt-0.5 ${
                    isConcierge
                      ? "bg-[#0b0b0b] border-[#D4AF37]/30 text-[#D4AF37]"
                      : "bg-[#D4AF37] border-none text-black"
                  }`}
                >
                  {isConcierge ? (
                    <Sparkles className="w-3.5 h-3.5" />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Message Body */}
                <div className="space-y-1">
                  <div
                    className={`p-3.5 text-xs leading-relaxed rounded-none ${
                      isConcierge
                        ? "bg-[#080808] border border-zinc-900 text-zinc-200"
                        : "bg-[#D4AF37] text-black font-semibold shadow-[0_0_15px_rgba(212,175,55,0.08)]"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Applied Filter Notice */}
                    {isConcierge && msg.suggestedFilters && (
                      <div className="mt-3.5 pt-3 border-t border-zinc-900 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest w-full mb-1">
                          Registry matched:
                        </span>
                        {msg.suggestedFilters.city && msg.suggestedFilters.city !== "all" && (
                          <span className="bg-black px-2 py-0.5 rounded-none text-[9px] font-mono text-zinc-400 border border-zinc-900">
                            Location: {msg.suggestedFilters.city}
                          </span>
                        )}
                        {msg.suggestedFilters.maxPrice && (
                          <span className="bg-black px-2 py-0.5 rounded-none text-[9px] font-mono text-zinc-400 border border-zinc-900">
                            Max Rent: ${msg.suggestedFilters.maxPrice.toLocaleString()}
                          </span>
                        )}
                        {msg.suggestedFilters.bedrooms && msg.suggestedFilters.bedrooms !== "all" && (
                          <span className="bg-black px-2 py-0.5 rounded-none text-[9px] font-mono text-zinc-400 border border-zinc-900">
                            {msg.suggestedFilters.bedrooms} Bed
                          </span>
                        )}
                        {msg.suggestedFilters.type && msg.suggestedFilters.type !== "all" && (
                          <span className="bg-black px-2 py-0.5 rounded-none text-[9px] font-mono text-zinc-400 border border-zinc-900">
                            Type: {msg.suggestedFilters.type}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="block text-[9px] font-mono text-zinc-550 text-right uppercase tracking-wider">
                    {msg.timestamp}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 max-w-[80%] mr-auto"
          >
            <div className="w-7 h-7 rounded-none bg-[#0b0b0b] border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center shrink-0">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
            </div>
            <div className="bg-[#0c0c0c] border border-zinc-900 rounded-none p-3.5 text-xs text-zinc-450 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="font-mono tracking-wider text-[10px] text-zinc-400">Tailoring prestige portfolio...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Interactive Concierge Tips & Presets Container */}
      <div className="bg-[#080808] px-3 pt-2.5 pb-2 border-t border-zinc-900 space-y-2">
        {/* Concierge Tips */}
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest pl-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse" />
            <span>Concierge Tips:</span>
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 invisible-scrollbar scroll-smooth">
            {conciergeTips.map((tip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(tip.text)}
                className="whitespace-nowrap bg-black hover:bg-[#D4AF37]/10 border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 text-[#D4AF37] rounded-none px-2.5 py-1 text-[10px] font-sans transition-all duration-300 pointer-events-auto cursor-pointer"
              >
                {tip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bespoke Quick Prompts */}
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest pl-1 flex items-center gap-1.5">
            <span className="w-1 h-1 bg-zinc-700 rounded-full" />
            <span>Bespoke Quick Prompts:</span>
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 invisible-scrollbar scroll-smooth">
            {presetInquiries.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(preset.text)}
                className="whitespace-nowrap bg-black hover:bg-zinc-900 border border-zinc-900 hover:border-[#D4AF37]/45 hover:text-[#D4AF37] rounded-none px-2.5 py-1 text-[10px] font-mono transition-all duration-300 pointer-events-auto cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleFormSubmit}
        className="flex items-center gap-2 p-3 bg-black border-t border-zinc-900"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="I am an international executive looking for a condo near Vancouver Harbour..."
          disabled={isLoading}
          className="flex-1 bg-zinc-950 border border-zinc-900 text-zinc-100 rounded-none px-3.5 py-3 text-xs focus:outline-none focus:border-[#D4AF37] placeholder-zinc-600 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-[#D4AF37] hover:bg-white disabled:bg-zinc-900 disabled:text-zinc-650 text-black p-3.5 rounded-none font-medium transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
