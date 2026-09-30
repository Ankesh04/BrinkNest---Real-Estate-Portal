// client/src/components/AmbientBackground.jsx
// Adds subtle, slow-drifting decorative architectural line art and soft color blobs
// behind sections to give the page organic depth and luxury texture without visual noise.

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function AmbientBackground() {
  const shouldReduceMotion = useReducedMotion();

  // If user has system accessibility set to reduce motion, render static background
  if (shouldReduceMotion) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 opacity-15">
        <div className="absolute top-24 -left-20 w-96 h-96 rounded-full bg-[#C89B3C]/10 blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-[32rem] h-[32rem] rounded-full bg-[#13293D]/10 blur-3xl" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Soft warm brass ambient glow */}
      <motion.div
        className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-[#C89B3C]/10 blur-3xl"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, 40, 10, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Deep navy atmospheric glow */}
      <motion.div
        className="absolute top-1/2 -right-32 w-[34rem] h-[34rem] rounded-full bg-[#13293D]/8 blur-3xl"
        animate={{
          x: [0, -40, 20, 0],
          y: [0, -30, 25, 0],
          scale: [1, 1.05, 0.98, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Architectural subtle geometry lines */}
      <motion.svg
        className="absolute bottom-12 left-10 w-64 h-64 text-[#C89B3C]/15 hidden lg:block"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 140,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <circle cx="100" cy="100" r="80" strokeDasharray="4 6" />
        <rect x="50" y="50" width="100" height="100" strokeDasharray="8 8" />
        <line x1="20" y1="100" x2="180" y2="100" opacity="0.5" />
        <line x1="100" y1="20" x2="100" y2="180" opacity="0.5" />
      </motion.svg>
    </div>
  );
}
