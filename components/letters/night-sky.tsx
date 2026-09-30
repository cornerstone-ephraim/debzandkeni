"use client";

import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";

/** Deterministic points keep server and client markup identical. */
export function NightSky({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const reduced = useReducedMotion();

  // progress 0 → 0.5 → 1 maps to these positions
  const moonX = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", reduced ? "0vw" : "70vw"],
  );
  const moonY = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["0vh", "-6vh", "-8vh", "-6vh", "0vh"],
  );

  return (
    <div className="night-sky" aria-hidden="true">
      <svg
        className="night-stars"
        viewBox="0 0 1440 650"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 150 }, (_, i) => {
          const x = (i * 137.508 + 19) % 1440;
          const y = (i * i * 17.13 + i * 71.7 + 13) % 650;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i % 9 === 0 ? 1.5 : 0.8}
              opacity={0.3 + (i % 5) * 0.12}
            />
          );
        })}
      </svg>
      <motion.div className="winter-moon" style={{ x: moonX, y: moonY }} />
    </div>
  );
}
