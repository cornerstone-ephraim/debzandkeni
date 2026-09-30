"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { decemberLetter as letter } from "@/data/letters";
import { HeartGate } from "./heart-gate";
import { SceneFallback } from "./scene-fallback";
import "./letters.css";
import { Pause, Play } from "lucide-react";

const LondonScene = dynamic(() => import("./london-scene"), { ssr: false });
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function LettersExperience() {
  const [open, setOpen] = useState(false);
  const [pauseOverride, setPauseOverride] = useState<boolean | null>(null);
  const [activePassage, setActivePassage] = useState(0);
  const reduced = useReducedMotion();
  // Respect the device preference initially, but let an explicit Play override it.
  const paused = pauseOverride ?? !!reduced;
  const showLiveScene = !reduced || pauseOverride !== null;
  const scrollContainer = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    container: scrollContainer,
  });
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setActivePassage(Math.round(progress * (letter.paragraphs.length - 1)));
  });
  useEffect(() => {
    if (open) {
      heading.current?.focus({ preventScroll: true });
      return;
    }
    const previous = document.body.style.overflow;
    const restoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    document.body.style.overflow = "hidden";
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => {
      document.body.style.overflow = previous;
      window.history.scrollRestoration = restoration;
    };
  }, [open]);
  return (
    <main
      className={`letters-experience ${open ? "is-open" : "is-sealed"}`}
      data-world-motion={paused ? "paused" : "playing"}
    >
      <div className="letter-stage" inert={!open} aria-hidden={!open}>
        <header className="letter-header">
          <span>
            Debz <i>&</i> Keni
          </span>
          <span className="header-dedication">
            A little world, just for you.
          </span>
        </header>
        <div className="winter-moon" aria-hidden="true" />
        <article
          ref={scrollContainer}
          className="letter-scroll"
          aria-label="December letter from Keniye to Debz"
          tabIndex={0}
        >
          {letter.paragraphs.map((_, index) => (
            <div className="letter-chapter" key={index} aria-hidden="true" />
          ))}
          <div
            className="letter-copy-stage"
            aria-live="polite"
            aria-atomic="true"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.section
                key={activePassage}
                className="love-letter"
                aria-label={`Passage ${activePassage + 1} of ${letter.paragraphs.length}`}
                initial={{
                  opacity: 0,
                  transform: reduced ? "none" : "translateY(18px)",
                }}
                animate={{
                  opacity: 1,
                  transform: reduced ? "none" : "translateY(0px)",
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: reduced ? 0.15 : 0.35,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                {activePassage === 0 && (
                  <>
                    <p className="letter-date">{letter.date}</p>
                    <h1 id="letter-greeting" ref={heading} tabIndex={-1}>
                      {letter.greeting}
                    </h1>
                  </>
                )}
                <p className="letter-paragraph">
                  {letter.paragraphs[activePassage]}
                </p>
                {activePassage === letter.paragraphs.length - 1 && (
                  <p className="letter-signoff">
                    {letter.signoff}
                    <br />
                    {letter.closing}
                    <span>{letter.signature}</span>
                  </p>
                )}
                {activePassage === 0 && (
                  <p className="scroll-invitation">
                    Scroll to unfold the letter ↓
                  </p>
                )}
              </motion.section>
            </AnimatePresence>
          </div>
        </article>
        <div
          className="london-landscape"
          role="img"
          aria-label="Early winter night in London: snow falls over Tower Bridge and the Thames, with red buses and glowing windows."
        >
          <SceneFallback />
          {showLiveScene && (
            <SceneBoundary>
              <LondonScene
                progress={scrollYProgress}
                paused={paused || !open}
              />
            </SceneBoundary>
          )}
        </div>
        <div
          className="snowfall"
          aria-hidden="true"
          style={{ animationPlayState: paused || !open ? "paused" : "running" }}
        >
          {Array.from({ length: 48 }, (_, i) => (
            <span
              key={i}
              style={{
                left: `${(i * 37) % 101}%`,
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
                animationDuration: `${12 + (i % 13)}s`,
                animationDelay: `${-((i * 7) % 25)}s`,
              }}
            />
          ))}
        </div>
        <footer className="letter-footer">
          <WorldControl paused={paused} setPaused={setPauseOverride} />
        </footer>
      </div>
      {!open && <HeartGate onOpen={() => setOpen(true)} />}
    </main>
  );
}

const WorldControl = ({
  paused,
  setPaused,
}: {
  paused: boolean;
  setPaused: (paused: boolean) => void;
}) => {
  return (
    <button
      onClick={() => setPaused(!paused)}
      aria-pressed={paused}
      aria-label={paused ? "Play the world" : "Pause the world"}
    >
      {paused ? (
        <span className="flex items-center justify-center gap-2">
          <Play className="w-3" />
          Play the world
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <Pause className="w-3" />
          Pause the world
        </span>
      )}
    </button>
  );
};
