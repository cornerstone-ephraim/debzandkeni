"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

export function HeartGate({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="heart-gate"
      animate={{ opacity: opening ? 0 : 1 }}
      transition={{ delay: reduce ? 0 : 0.75, duration: 0.3 }}
      onAnimationComplete={() => {
        if (opening) onOpen();
      }}
    >
      <button
        className="heart-invitation"
        aria-label="Open Keniye’s letter to Debz"
        disabled={opening}
        onClick={() => setOpening(true)}
      >
        <motion.span
          className="heart-expansion"
          animate={{ transform: opening && !reduce ? "scale(35)" : "scale(1)" }}
          transition={{ duration: 0.95, ease: [0.77, 0, 0.175, 1] }}
        >
          <svg
            className={opening ? "heart-shape" : "heart-shape heart-bounce"}
            viewBox="0 0 120 112"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="heart-color" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#dc655b" />
                <stop offset="1" stopColor="#aa302d" />
              </linearGradient>
            </defs>
            <path
              d="M60 103C48 94 7 64 7 36C7 8 42 1 60 26C78 1 113 8 113 36C113 64 72 94 60 103Z"
              fill="url(#heart-color)"
            />
            <path
              d="M20 34C20 20 36 15 45 23"
              fill="none"
              stroke="#ef9b8d"
              strokeWidth="4"
              strokeLinecap="round"
              opacity=".65"
            />
          </svg>
        </motion.span>
        <span className="heart-note" style={{ opacity: opening ? 0 : 1 }}>
          Click me
          <svg viewBox="0 0 70 65" aria-hidden="true">
            <path
              d="M55 56C17 56 12 31 31 12M17 15L32 9L34 25"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <noscript>
        <p>Please enable JavaScript to open this letter.</p>
      </noscript>
    </motion.div>
  );
}
