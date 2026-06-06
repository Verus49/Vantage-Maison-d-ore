import React, { FC } from "react";
import { motion } from "motion/react";

export const PropertyCardSkeleton: FC = () => {
  return (
    <div className="relative flex flex-col bg-[#080808] border border-zinc-900/60 overflow-hidden w-full h-[500px] hover:shadow-[0_0_30px_rgba(212,175,55,0.03)] transition-shadow duration-300">
      {/* Skeleton Header Image */}
      <div className="relative h-56 md:h-64 overflow-hidden bg-black flex items-center justify-center border-b border-zinc-900/40">
        <div className="gold-shimmer-bg w-full h-full absolute inset-0" />
        
        {/* Mock top badges */}
        <div className="absolute top-3.5 left-3.5 w-16 h-4 bg-zinc-950/80 border border-zinc-900" />
        <div className="absolute top-3.5 right-3.5 w-12 h-4 bg-zinc-950/80 border border-zinc-900" />
      </div>

      {/* Skeleton Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-3.5">
          {/* Price & Availability row */}
          <div className="flex justify-between items-center">
            <div className="gold-shimmer-bg h-5 w-28" />
            <div className="gold-shimmer-bg h-4 w-16" />
          </div>

          {/* Title */}
          <div className="gold-shimmer-bg h-6 w-5/6" />

          {/* Location */}
          <div className="gold-shimmer-bg h-4 w-1/2" />

          {/* Specs: Bed / Bath / Area */}
          <div className="flex items-center gap-3 pt-1">
            <div className="gold-shimmer-bg h-4 w-12" />
            <div className="gold-shimmer-bg h-4 w-12" />
            <div className="gold-shimmer-bg h-4 w-16" />
          </div>

          {/* Amenities pill chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <div className="gold-shimmer-bg h-4 w-14" />
            <div className="gold-shimmer-bg h-4 w-16" />
            <div className="gold-shimmer-bg h-4 w-12" />
          </div>
        </div>

        {/* Footer row action buttons mock */}
        <div className="pt-2 border-t border-zinc-900/60 flex items-center justify-between gap-2.5">
          <div className="gold-shimmer-bg h-7 w-20" />
          <div className="flex gap-1.5">
            <div className="gold-shimmer-bg h-7 w-7" />
            <div className="gold-shimmer-bg h-7 w-7" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const LuxuryGridSkeleton: FC = () => {
  // Return an array of 3 or 6 skeletons to matches standard grid layouts
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full"
    >
      {Array.from({ length: 3 }).map((_, idx) => (
        <PropertyCardSkeleton key={idx} />
      ))}
    </motion.div>
  );
};
