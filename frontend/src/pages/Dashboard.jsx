import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: "Total Hours", value: "1,240 hrs" },
    { label: "Top Genre", value: "Drama" },
    { label: "Most Watched", value: "Breaking Bad" },
    { label: "Binge Streak", value: "7 days" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background:
          "linear-gradient(135deg, #ff5fa2 0%, #d946ef 30%, #7c3aed 55%, #0b0b12 100%)",
        color: "#fff",
        padding: "40px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: 48, margin: 0, fontWeight: 900 }}>
          Dashboard
        </h1>
        <p style={{ opacity: 0.85, marginTop: 10 }}>
          Quick summary before your Wrapped.
        </p>

        {/* Stats cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
            marginTop: 22,
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                padding: 18,
                borderRadius: 16,
                background: "rgba(0,0,0,0.35)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div style={{ opacity: 0.8, fontSize: 14 }}>{s.label}</div>
              <div style={{ fontSize: 34, fontWeight: 900, marginTop: 6 }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 26,
            flexWrap: "wrap",
          }}
        >
          <button onClick={() => navigate("/wrapped")} style={primaryBtn}>
            Movies Wrapped
          </button>

          <button
            onClick={() => navigate("/youtube")}
            style={youtubeBtn}
          >
            YouTube Wrapped 
          </button>

          <button onClick={() => navigate("/upload")} style={secondaryBtn}>
            Back to Upload
          </button>
        </div>
      </div>
    </div>
  );
}

/* Button styles */
const primaryBtn = {
  padding: "12px 16px",
  borderRadius: 12,
  border: "none",
  background: "#fff",
  color: "#000",
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "12px 16px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.25)",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const youtubeBtn = {
  padding: "12px 16px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.25)",
  background: "linear-gradient(135deg, #ff5fa2, #7c3aed)",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};
