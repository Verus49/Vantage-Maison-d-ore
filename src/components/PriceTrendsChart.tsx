import React, { useState, FC } from "react";
import { 
  TrendingUp, 
  MapPin, 
  DollarSign, 
  Layers, 
  Activity, 
  Sparkles, 
  ArrowUpRight, 
  HelpCircle,
  TrendingDown,
  Percent,
  Compass
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";

type MetricType = "averageRent" | "pricePerSqft" | "inventoryCalls";

interface ChartDataPoint {
  month: string;
  vancouver: number;
  toronto: number;
}

export const PriceTrendsChart: FC = () => {
  const [activeMetric, setActiveMetric] = useState<MetricType>("averageRent");

  // Multi-dimensional premium real estate metrics for the last 12 months (culminating June 2026)
  const datasets: Record<MetricType, ChartDataPoint[]> = {
    averageRent: [
      { month: "Jul 25", vancouver: 6950, toronto: 7400 },
      { month: "Aug 25", vancouver: 7100, toronto: 7450 },
      { month: "Sep 25", vancouver: 7200, toronto: 7650 },
      { month: "Oct 25", vancouver: 7150, toronto: 7500 },
      { month: "Nov 25", vancouver: 7250, toronto: 7580 },
      { month: "Dec 25", vancouver: 7380, toronto: 7720 },
      { month: "Jan 26", vancouver: 7450, toronto: 7850 },
      { month: "Feb 26", vancouver: 7500, toronto: 7900 },
      { month: "Mar 26", vancouver: 7650, toronto: 8120 },
      { month: "Apr 26", vancouver: 7780, toronto: 8300 },
      { month: "May 26", vancouver: 7900, toronto: 8450 },
      { month: "Jun 26", vancouver: 8100, toronto: 8650 },
    ],
    pricePerSqft: [
      { month: "Jul 25", vancouver: 4.10, toronto: 4.30 },
      { month: "Aug 25", vancouver: 4.15, toronto: 4.35 },
      { month: "Sep 25", vancouver: 4.20, toronto: 4.42 },
      { month: "Oct 25", vancouver: 4.18, toronto: 4.38 },
      { month: "Nov 25", vancouver: 4.22, toronto: 4.44 },
      { month: "Dec 25", vancouver: 4.28, toronto: 4.50 },
      { month: "Jan 26", vancouver: 4.32, toronto: 4.58 },
      { month: "Feb 26", vancouver: 4.35, toronto: 4.62 },
      { month: "Mar 26", vancouver: 4.40, toronto: 4.70 },
      { month: "Apr 26", vancouver: 4.48, toronto: 4.78 },
      { month: "May 26", vancouver: 4.55, toronto: 4.85 },
      { month: "Jun 26", vancouver: 4.62, toronto: 4.95 },
    ],
    inventoryCalls: [
      { month: "Jul 25", vancouver: 12, toronto: 15 },
      { month: "Aug 25", vancouver: 14, toronto: 17 },
      { month: "Sep 25", vancouver: 18, toronto: 19 },
      { month: "Oct 25", vancouver: 15, toronto: 18 },
      { month: "Nov 25", vancouver: 16, toronto: 21 },
      { month: "Dec 25", vancouver: 20, toronto: 24 },
      { month: "Jan 26", vancouver: 22, toronto: 25 },
      { month: "Feb 26", vancouver: 24, toronto: 27 },
      { month: "Mar 26", vancouver: 28, toronto: 31 },
      { month: "Apr 26", vancouver: 32, toronto: 35 },
      { month: "May 26", vancouver: 36, toronto: 40 },
      { month: "Jun 26", vancouver: 42, toronto: 45 },
    ]
  };

  const metricDetails = {
    averageRent: {
      title: "Average Lease Rate Trend",
      description: "Typical monthly lease valuations for core premium properties including penthouses and townhomes.",
      yLabel: "Monthly Lease (CAD)",
      formatVal: (val: number) => `$${val.toLocaleString()}`,
      vancCurrent: "$8,100",
      vancYoY: "+16.5%",
      toroCurrent: "$8,650",
      toroYoY: "+16.8%",
    },
    pricePerSqft: {
      title: "Unit Area Cost Ratio",
      description: "Calculated monthly rate per square foot of interior fully-furnished luxury floor plans.",
      yLabel: "Price / Sqft (CAD)",
      formatVal: (val: number) => `$${val.toFixed(2)}/sqft`,
      vancCurrent: "$4.62",
      vancYoY: "+12.6%",
      toroCurrent: "$4.95",
      toroYoY: "+15.1%",
    },
    inventoryCalls: {
      title: "Client Application Volume",
      description: "Aggregated VIP corporate viewings and concierge showing matches completed per calendar month.",
      yLabel: "Active Matches",
      formatVal: (val: number) => `${val} matches`,
      vancCurrent: "42",
      vancYoY: "+250%",
      toroCurrent: "45",
      toroYoY: "+200%",
    }
  };

  const currentDetails = metricDetails[activeMetric];
  const activeDataset = datasets[activeMetric];

  // Custom luxury theme tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#050505] border border-[#D4AF37]/50 p-3.5 shadow-[0_0_20px_rgba(212,175,55,0.15)] flex flex-col font-mono text-[10px] select-text">
          <p className="border-b border-[#D4AF37]/25 pb-1 max-sm:text-[9px] uppercase tracking-wider font-semibold text-zinc-150">
            Analytics Month: <span className="text-[#D4AF37]">{label}</span>
          </p>
          <div className="space-y-1.5 mt-2">
            <div className="flex items-center justify-between gap-8">
              <span className="flex items-center gap-1.5 text-zinc-400 max-sm:text-[9.5px]">
                <span className="w-1.5 h-1.5 bg-[#D4AF37]" />
                Vancouver Index:
              </span>
              <span className="text-[#D4AF37] font-semibold">
                {currentDetails.formatVal(payload[0].value)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-8">
              <span className="flex items-center gap-1.5 text-zinc-400 max-sm:text-[9.5px]">
                <span className="w-1.5 h-1.5 bg-zinc-300" />
                Toronto Index:
              </span>
              <span className="text-zinc-200 font-semibold">
                {currentDetails.formatVal(payload[1].value)}
              </span>
            </div>
          </div>
          <div className="border-t border-zinc-900 pt-1.5 mt-2 text-[8px] text-zinc-550 leading-none uppercase">
            Maison d'Or Real-Time Ledger
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="bg-gradient-to-b from-black via-[#040404] to-black border border-zinc-900 p-5 md:p-8 rounded-none shadow-[0_0_40px_rgba(212,175,55,0.03)] select-none">
      
      {/* Decorative top grid coordinates border */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-5 mb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 border border-[#D4AF37]/35 bg-black flex items-center justify-center text-[#D4AF37]">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '20s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[8.5px] font-mono text-[#D4AF37] uppercase tracking-widest leading-none">Market Intelligence Hub</span>
              <span className="text-[7.5px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-1.5 py-0.2 uppercase leading-none rounded-none">
                Live Indices Sourced
              </span>
            </div>
            <h3 className="text-base md:text-lg font-serif uppercase tracking-wider font-semibold text-zinc-150 mt-1">
              Metropolitan Luxury Rental Trends
            </h3>
          </div>
        </div>

        {/* Dynamic Metric Switch Deck */}
        <div className="flex flex-wrap gap-1 bg-black border border-zinc-900 p-1">
          {(["averageRent", "pricePerSqft", "inventoryCalls"] as MetricType[]).map((m) => (
            <button
              key={m}
              onClick={() => setActiveMetric(m)}
              className={`px-3 py-1.5 font-mono text-[9px] uppercase tracking-wide cursor-pointer transition-all duration-300 ${
                activeMetric === m
                  ? "bg-[#D4AF37] text-black font-bold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-950"
              }`}
            >
              {m === "averageRent" ? "Avg Lease" : m === "pricePerSqft" ? "Price / Sqft" : "Client Matches"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Metric Insights Sidebar */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="bg-[#050505] border border-zinc-900/80 p-4.5 rounded-none relative">
              <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#D4AF37]/50" />
              <h4 className="text-xs font-serif uppercase text-[#D4AF37] font-semibold tracking-widest flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                <span>{currentDetails.title}</span>
              </h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans mt-2.5">
                {currentDetails.description}
              </p>
            </div>

            {/* Quick Stat Blocks */}
            <div className="grid grid-cols-2 gap-3">
              {/* Vancouver Stat */}
              <div className="bg-[#050505] border border-zinc-900/80 p-4 rounded-none text-left">
                <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-widest block">Vancouver Avg</span>
                <span className="text-lg font-serif font-semibold text-[#D4AF37] block mt-1.5">
                  {currentDetails.vancCurrent}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                  <span className="text-[9px] font-mono text-emerald-400 font-semibold">{currentDetails.vancYoY} YoY</span>
                </div>
              </div>

              {/* Toronto Stat */}
              <div className="bg-[#050505] border border-[#d4af37]/10 p-4 rounded-none text-left">
                <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-widest block">Toronto Avg</span>
                <span className="text-lg font-serif font-semibold text-zinc-200 block mt-1.5">
                  {currentDetails.toroCurrent}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                  <span className="text-[9px] font-mono text-emerald-400 font-semibold">{currentDetails.toroYoY} YoY</span>
                </div>
              </div>
            </div>
          </div>

          {/* Prestige Disclaimer Badge */}
          <div className="border border-[#D4AF37]/15 bg-black/40 p-4 rounded-none flex items-start gap-3 select-text">
            <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5 animate-pulse" />
            <div className="text-[10px] font-mono text-zinc-500 leading-relaxed">
              <span className="text-[#D4AF37] font-semibold block uppercase text-[8px] mb-0.5 tracking-wider">Premium Real Estate Standard</span>
              Values are derived from monthly verified bookings in Coal Harbour, Yorkville, Yaletown, and Distillery District luxury inventories.
            </div>
          </div>
        </div>

        {/* Interactive Chart Panel Area */}
        <div className="lg:col-span-8 bg-[#030303] border border-zinc-910 p-4 flex flex-col justify-between h-[340px] relative">
          
          {/* Chart Backdrop Aesthetic GridLines */}
          <div className="absolute inset-x-8 top-12 bottom-6 pointer-events-none border-x border-dashed border-zinc-950 flex justify-between">
            <div className="w-px h-full" />
            <div className="w-px h-full" />
            <div className="w-px h-full" />
          </div>

          <div className="w-full h-full relative z-10 font-mono text-[9px] text-zinc-500">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={activeDataset}
                margin={{ top: 15, right: 10, left: 0, bottom: 5 }}
              >
                <defs>
                  {/* Vancouver Gold Gradient */}
                  <linearGradient id="vancouverGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                  </linearGradient>
                  {/* Toronto Silver/Gray Gradient */}
                  <linearGradient id="torontoSilver" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e5e5e5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#e5e5e5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid 
                  strokeDasharray="4 4" 
                  stroke="#121212" 
                  vertical={false} 
                />

                <XAxis 
                  dataKey="month" 
                  stroke="#3f3f46" 
                  tick={{ fill: "#71717a", fontSize: 9 }}
                  tickLine={false}
                  axisLine={{ stroke: "#27272a" }}
                  dy={10}
                />

                <YAxis 
                  stroke="#3f3f46" 
                  tick={{ fill: "#71717a", fontSize: 9 }}
                  tickLine={false}
                  axisLine={{ stroke: "#27272a" }}
                  tickFormatter={currentDetails.formatVal}
                  dx={-5}
                />

                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ stroke: "#D4AF37", strokeWidth: 1, strokeDasharray: "3 3" }}
                />

                <Area
                  type="monotone"
                  dataKey="vancouver"
                  name="Vancouver Premium Portfolio"
                  stroke="#D4AF37"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#vancouverGold)"
                  activeDot={{ r: 5, stroke: "#000", strokeWidth: 2, fill: "#D4AF37" }}
                />

                <Area
                  type="monotone"
                  dataKey="toronto"
                  name="Toronto Royal Portfolio"
                  stroke="#e5e5e5"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#torontoSilver)"
                  activeDot={{ r: 5, stroke: "#000", strokeWidth: 2, fill: "#fff" }}
                />

                <Legend
                  verticalAlign="top"
                  height={32}
                  iconType="circle"
                  iconSize={6}
                  formatter={(value) => (
                    <span className="text-zinc-200 text-[10px] lowercase tracking-wide font-mono hover:text-[#D4AF37] transition-colors uppercase">
                      {value}
                    </span>
                  )}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PriceTrendsChart;
