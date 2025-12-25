import { useMemo, useState } from "react";
import { slides as mockSlides } from "./slides.mock";
import Slide from "./Slide";

export default function WrappedPlayer() {
  const slides = useMemo(() => mockSlides, []);
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => Math.min(i + 1, slides.length - 1));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

return (
  <div
    style={{
      minHeight: "100vh",
      background: "#1f1f1f",
      padding: 24,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
  style={{
    width: "100%",
    maxWidth: "100%",
  }}
>


      {/* Progress bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {slides.map((_, i) => (
          <div
            key={i}
            style={{
              height: 6,
              flex: 1,
              borderRadius: 999,
              background: i <= index ? "white" : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>

      <Slide slide={slides[index]} />

      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        <button onClick={prev} disabled={index === 0}>
          Back
        </button>
        <button onClick={next} disabled={index === slides.length - 1}>
          Next
        </button>
      </div>
    </div>
    </div>
  );
}
