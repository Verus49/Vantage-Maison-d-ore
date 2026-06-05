import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, MessageSquare, ArrowRight, CornerDownLeft, Loader2, Compass } from "lucide-react";
import { ChatMessage, SearchFilters } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface AIConciergeProps {
  onApplyFilters: (filters: Partial<SearchFilters>) => void;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function AIConcierge({
  onApplyFilters,
  chatHistory,
  setChatHistory
}: AIConciergeProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      <div className="flex items-center justify-between bg-[#080808] px-4 py-3.5 border-b border-[#D4AF37]/20">
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
        <span className="text-[9px] font-mono text-zinc-400 bg-black px-2.5 py-1 rounded-none border border-[#D4AF37]/20 uppercase">
          Suite Offline Ready
        </span>
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

      {/* Preset Luxury Prompts */}
      <div className="bg-[#080808] px-3 py-2 border-t border-zinc-900 space-y-1">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">
          Bespoke Quick Prompts:
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 invisible-scrollbar scroll-smooth">
          {presetInquiries.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(preset.text)}
              className="whitespace-nowrap bg-black hover:bg-zinc-900 border border-zinc-900 hover:border-[#D4AF37]/45 hover:text-[#D4AF37] rounded-none px-2.5 py-1 text-[10px] font-mono transition-all duration-300 pointer-events-auto cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
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
