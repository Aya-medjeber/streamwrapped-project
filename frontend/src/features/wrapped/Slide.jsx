import React from "react";

export default function Slide({
  title,
  subtitle,
  children,
  step,
  totalSteps,
  onNext,
  onBack,
  theme = ["#111827", "#000000"],
  isLast = false,
}) {
  const bg = `radial-gradient(1200px 600px at 20% 20%, rgba(255,255,255,0.14), rgba(255,255,255,0) 55%),
              linear-gradient(135deg, ${theme[0]} 0%, ${theme[1]} 100%)`;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: bg,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Progress */}
      <div style={{ padding: "22px 64px 0" }}>
        <div style={{ display: "flex", gap: 12 }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 6,
                borderRadius: 999,
                background: i < step ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.28)",
                boxShadow: i < step ? "0 0 18px rgba(255,255,255,0.25)" : "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 64px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1400,
          }}
        >
          <h1
            style={{
              fontSize: "clamp(48px, 5vw, 88px)",
              fontWeight: 900,
              lineHeight: 1.02,
              margin: 0,
              letterSpacing: "-0.03em",
              textShadow: "0 10px 40px rgba(0,0,0,0.25)",
            }}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              style={{
                fontSize: "clamp(16px, 1.3vw, 20px)",
                opacity: 0.9,
                marginTop: 18,
                marginBottom: 0,
                maxWidth: 720,
              }}
            >
              {subtitle}
            </p>
          )}

          <div style={{ marginTop: 36 }}>{children}</div>
        </div>
      </div>

      {/* Nav */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "26px 64px",
          background: "rgba(0,0,0,0.18)",
          backdropFilter: "blur(10px)",
        }}
      >
        <button
          onClick={onBack}
          disabled={step === 1}
          style={{
            background: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.22)",
            padding: "12px 18px",
            borderRadius: 12,
            color: "#fff",
            opacity: step === 1 ? 0.35 : 1,
            cursor: step === 1 ? "default" : "pointer",
            fontWeight: 600,
          }}
        >
          Back
        </button>

        <button
          onClick={onNext}
          disabled={isLast}
          style={{
            background: "rgba(255,255,255,0.92)",
            color: "#000",
            border: "none",
            padding: "12px 22px",
            borderRadius: 12,
            fontWeight: 800,
            cursor: isLast ? "default" : "pointer",
            opacity: isLast ? 0.45 : 1,
          }}
        >
          {isLast ? "Done" : "Next"}
        </button>
      </div>
    </div>
  );
}
