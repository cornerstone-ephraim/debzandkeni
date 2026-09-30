"use client";

import { useEffect, useRef, useState } from "react";
import { CharacterPair } from "./character-pair";
import { CountdownClock } from "./countdown-clock";
import { Fireworks } from "./fireworks";
import { timelineEvents } from "@/data/timeline-events";

const event = timelineEvents.find((e) => e.id === "new-years-eve")!;

// SceneOne is the first chapter of the timeline.
// It uses a "scroll-to-progress" pattern:
//   - The outer wrapper is tall (400vh) to give scroll room.
//   - The inner content is `position: sticky` so it stays in view while the user scrolls.
//   - We read scrollY relative to the sticky container's top to derive a `progress` value (0→1).
//   - That single `progress` value drives ALL animations in the scene.
//
// This is the foundational pattern for every scene in the project.

export function SceneOne() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const containerHeight = el.offsetHeight;
      const viewportHeight = window.innerHeight;

      // How far we've scrolled through this scene
      // rect.top goes from 0 (just entered view) to -(containerHeight - viewportHeight) (fully scrolled)
      const scrolled = -rect.top;
      const scrollable = containerHeight - viewportHeight;
      const p = Math.max(0, Math.min(1, scrolled / scrollable));

      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // init
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Derived values from progress
  // Cloud / atmosphere layer moves slower than the scene (parallax Layer 2)
  const cloudOffset = progress * -40; // px upward
  // Stars layer moves even slower (Layer 1)
  const starParallax = progress * -20;

  // Text phases
  const showOpeningText = progress < 0.15;
  const showCountdown = progress > 0.1 && progress < 0.75;
  const showMeetText = progress > 0.72 && progress < 0.88;
  const showRevealText = progress >= 0.88;
  const showFireworks = progress >= 0.88;

  // Character progress: ramp from 0.15 to 0.85 scroll range
  const charProgress = Math.max(0, Math.min(1, (progress - 0.15) / 0.7));

  // Clock progress: ramp 0.1 → 0.85
  const clockProgress = Math.max(0, Math.min(1, (progress - 0.1) / 0.75));

  // Background gradient shifts from deep navy to a warmer midnight as they meet
  const warmth = progress * 30;
  const bgColor = `hsl(${230 - warmth}, ${60 - progress * 10}%, ${4 + progress * 3}%)`;

  return (
    // Outer container: 400vh gives scroll travel room
    <div ref={containerRef} style={{ height: "400vh", position: "relative" }}>
      {/* Sticky inner: stays in viewport while user scrolls through the outer height */}
      <div
        style={{ background: bgColor }}
        className={`sticky top-0 h-screen overflow-hidden transition-all duration-300 ease-linear`}
      >
        {/* ── LAYER 1: Atmospheric nebula (slowest parallax) ── */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            transform: `translateY(${starParallax}px)`,
            zIndex: 1,
          }}
        >
          {/* Subtle nebula blobs */}
          <div className="absolute top-[10%] left-[5%] h-[40vw] w-[40vw] rounded-[50%] bg-[radial-gradient(circle_at_center,rgba(45,27,78,0.35)_0%,transparent_70%)] blur-[60px]" />
          <div className="pointer-events-none absolute top-[20%] right-[8%] h-[35vw] w-[35vw] rounded-[50%] bg-[radial-gradient(circle_at_center,rgba(26,39,68,0.4)_0%,transparent_70%)] blur-[50px]" />

          {/* Warm horizon glow — grows as progress increases */}
          <div
            className={`absolute right-0 bottom-0 left-0 h-[70vh] transition-none`}
            style={{
              background: `radial-gradient(ellipse at 50% 100%, rgba(212,168,83,${
                0.04 + progress * 0.12
              }) 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* ── LAYER 2: Cloud / particle atmosphere (medium parallax) ── */}
        <div
          className="pointer-events-none absolute inset-0 z-2"
          style={{ transform: `translateY(${cloudOffset}px)` }}
        >
          <svg
            className="absolute h-full w-full"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Soft cloud wisps */}
            <ellipse
              cx="200"
              cy="200"
              rx="180"
              ry="40"
              fill="rgba(232,213,176,0.025)"
              filter="url(#blur1)"
            />
            <ellipse
              cx="1200"
              cy="160"
              rx="200"
              ry="35"
              fill="rgba(232,213,176,0.02)"
              filter="url(#blur1)"
            />
            <ellipse
              cx="720"
              cy="120"
              rx="300"
              ry="50"
              fill="rgba(232,213,176,0.015)"
              filter="url(#blur1)"
            />
            <defs>
              <filter id="blur1">
                <feGaussianBlur stdDeviation="18" />
              </filter>
            </defs>
          </svg>
        </div>

        {/* ── LAYER 3: Timeline path line ── */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 z-3 w-0.5 -translate-x-1/2 transition-none"
          style={{
            height: `${20 + progress * 30}vh`,
            background:
              "linear-gradient(to top, rgba(212,168,83,0.6), transparent)",
          }}
        />

        {/* ── LAYER 4: Characters ── */}
        <div className="pointer-events-none absolute bottom-[12vh] z-4 w-full">
          <CharacterPair progress={charProgress} />
        </div>

        {/* ── LAYER 5: Clock ── */}
        <div
          style={{ opacity: showCountdown ? 1 : 0 }}
          className="pointer-events-none absolute top-[18vh] left-1/2 z-5 -translate-x-1/2 transition-opacity duration-800 ease-linear"
        >
          <CountdownClock progress={clockProgress} />
        </div>

        {/* ── TEXT LAYERS ── */}

        {/* Opening chapter label */}
        <div
          style={{ opacity: showOpeningText ? 1 : 0 }}
          className="pointer-events-none absolute top-[30vh] left-1/2 z-6 flex w-[90vw] -translate-x-1/2 flex-col items-center gap-2.5 text-center transition-opacity duration-1000 ease-linear"
        >
          <p className="chapter-kicker mb-2 text-warm-gold opacity-70">
            Chapter I
          </p>
          <h2 className="chapter-heading text-foreground">{event.chapter}</h2>
          {/* <div className="w-15 h-px bg-warm-gold my-3.5 mx-auto opacity-50" /> */}
          <p className="font-jost tracking-widest text-foreground uppercase opacity-45">
            Scroll to begin
          </p>
        </div>

        {/* Meeting moment text */}
        <div
          className="pointer-events-none absolute top-[30vh] left-1/2 z-6 w-[min(600px,88vw)] -translate-x-1/2 text-center transition-all duration-900 ease-linear"
          style={{
            opacity: showMeetText ? 1 : 0,
            transform: `translateY(${showMeetText ? 0 : 12}px)`,
          }}
        >
          <p className="story-copy tracking-[0.04em] text-foreground italic opacity-85">
            {event.title}
          </p>
        </div>

        {/* Midnight reveal text */}
        <div
          className="pointer-events-none absolute top-[30vh] left-1/2 z-6 w-[min(700px,90vw)] -translate-x-1/2 text-center transition-all duration-1200 ease-linear"
          style={{
            opacity: showRevealText ? 1 : 0,
            transform: `translateY(${showRevealText ? 0 : 16}px)`,
          }}
        >
          <p className="reveal-kicker mb-4 text-warm-gold opacity-80">
            {event.date}
          </p>

          <h3 className="reveal-heading mb-5 text-foreground">
            {event.description}
          </h3>

          {/* <div className="w-10 h-px bg-warm-gold mx-auto opacity-60" /> */}
        </div>

        {/* Fireworks canvas */}
        <Fireworks active={showFireworks} />
      </div>
    </div>
  );
}
