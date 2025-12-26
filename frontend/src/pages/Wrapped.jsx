import React, { useMemo, useState } from "react";
import Slide from "../features/wrapped/Slide";
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

export default function Wrapped() {
  const slides = useMemo(
    () => [
      {
        title: "Your StreamWrapped 2025",
        subtitle: "Let’s recap your year.",
        theme: ["#ff5fa2", "#0b0b12"], // pink → black
      },
      {
        title: "Total Hours Watched",
        subtitle: "You really showed up.",
        value: "1,240 hrs",
        theme: ["#ff5fa2", "#0b0b12"],
      },
      {
        title: "Top Genre",
        subtitle: "Your comfort zone:",
        value: "Drama",
        theme: ["#ff5fa2", "#0b0b12"],
      },
      {
        title: "Most Watched",
        subtitle: "Your #1 pick:",
        value: "Breaking Bad",
        theme: ["#ff5fa2", "#0b0b12"],
      },
      {
        title: "Longest Binge Streak",
        subtitle: "No sleep? 😭",
        value: "7 days",
        theme: ["#ff5fa2", "#0b0b12"],
      },
      {
        title: "That’s a wrap!",
        subtitle: "Share your StreamWrapped.",
        theme: ["#ff5fa2", "#0b0b12"],
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = back

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
            <div
              style={{
                fontSize: "clamp(48px, 6vw, 86px)",
                fontWeight: 900,
                marginTop: 16,
              }}
            >
              {current.value}
            </div>
          )}
        </Slide>
      </motion.div>
    </AnimatePresence>
  );
}
