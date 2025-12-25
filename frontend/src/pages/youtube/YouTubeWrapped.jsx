import React, { useMemo, useState } from "react";
import Slide from "../../features/wrapped/Slide";
import { AnimatePresence, motion } from "framer-motion";

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 240 : -240,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -240 : 240,
    opacity: 0,
    scale: 0.98,
  }),
};

export default function YouTubeWrapped() {
  const slides = useMemo(
    () => [
      {
        title: "Your YouTube Wrapped 2025",
        subtitle: "Let’s recap your year on YouTube.",
        theme: ["#ff5fa2", "#0b0b12"],
      },
      {
        title: "Total Watch Time",
        subtitle: "Time well spent 😌",
        value: "— hrs",
        hint: "(Estimated from activity data)",
        theme: ["#ff5fa2", "#0b0b12"],
      },
      {
        title: "Total Videos Watched",
        subtitle: "You were outside? barely.",
        value: "— videos",
        theme: ["#ff5fa2", "#0b0b12"],
      },
      {
        title: "Top Category",
        subtitle: "Your comfort zone:",
        value: "—",
        theme: ["#ff5fa2", "#0b0b12"],
      },
      {
        title: "Top Channel",
        subtitle: "You kept coming back to:",
        value: "—",
        theme: ["#ff5fa2", "#0b0b12"],
      },
      {
        title: "Most Replayed Video",
        subtitle: "You ran this one back:",
        value: "—",
        theme: ["#ff5fa2", "#0b0b12"],
      },
      {
        title: "Longest Watch Streak",
        subtitle: "No breaks 😭",
        value: "— days",
        theme: ["#ff5fa2", "#0b0b12"],
      },
      {
        title: "That’s a wrap!",
        subtitle: "Upload your Takeout to generate real stats.",
        theme: ["#ff5fa2", "#0b0b12"],
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const totalSteps = slides.length;
  const current = slides[index];

  const onNext = () => {
    setDirection(1);
    setIndex((i) => Math.min(i + 1, totalSteps - 1));
  };

  const onBack = () => {
    setDirection(-1);
    setIndex((i) => Math.max(i - 1, 0));
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={index}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ height: "100%" }}
      >
        <Slide
          title={current.title}
          subtitle={current.subtitle}
          step={index + 1}
          totalSteps={totalSteps}
          onNext={onNext}
          onBack={onBack}
          theme={current.theme}
        >
          {current.value && (
            <div style={{ marginTop: 16 }}>
              <div
                style={{
                  fontSize: "clamp(48px, 6vw, 86px)",
                  fontWeight: 900,
                }}
              >
                {current.value}
              </div>

              {current.hint && (
                <div style={{ marginTop: 10, opacity: 0.8, fontSize: 14 }}>
                  {current.hint}
                </div>
              )}
            </div>
          )}

          {/* small disclaimer on all slides (optional) */}
          <div style={{ marginTop: 18, opacity: 0.55, fontSize: 12 }}>
            Based on Google Takeout YouTube activity. Some insights may be estimated.
          </div>
        </Slide>
      </motion.div>
    </AnimatePresence>
  );
}
