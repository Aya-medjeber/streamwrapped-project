import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function YouTubeProcessing() {
  const navigate = useNavigate();

  useEffect(() => {
    // MVP: fake processing delay. Later: poll backend job status.
    const t = setTimeout(() => navigate("/youtube/wrapped"), 1600);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div style={pageWrap}>
      <div style={container}>
        <h1 style={title}>Processing your YouTube history…</h1>
        <p style={subtitle}>We’re generating your Wrapped slides. This won’t take long.</p>

        <div style={card}>
          <div style={spinnerRow}>
            <div style={spinner} />
            <div>
              <div style={{ fontWeight: 900, fontSize: 16 }}>Working on it</div>
              <div style={{ opacity: 0.8, marginTop: 6 }}>
                Parsing activity • Enriching video details • Building insights
              </div>
            </div>
          </div>

          <div style={footnote}>
            If this takes longer, it may be a large Takeout file — we’ll optimize this later.
          </div>
        </div>
      </div>
    </div>
  );
}

const pageWrap = {
  minHeight: "100vh",
  width: "100vw",
  background:
    "linear-gradient(135deg, #ff5fa2 0%, #d946ef 30%, #7c3aed 55%, #0b0b12 100%)",
  color: "#fff",
  padding: "40px",
};

const container = { maxWidth: 900, margin: "0 auto" };

const title = { fontSize: 44, margin: 0, fontWeight: 900 };

const subtitle = { opacity: 0.85, marginTop: 10, fontSize: 16, lineHeight: 1.5 };

const card = {
  marginTop: 20,
  padding: 18,
  borderRadius: 16,
  background: "rgba(0,0,0,0.35)",
  border: "1px solid rgba(255,255,255,0.15)",
  backdropFilter: "blur(8px)",
};

const spinnerRow = { display: "flex", gap: 14, alignItems: "center" };

const spinner = {
  width: 18,
  height: 18,
  borderRadius: "50%",
  border: "3px solid rgba(255,255,255,0.25)",
  borderTopColor: "#fff",
  animation: "spin 0.9s linear infinite",
};

const footnote = { marginTop: 16, opacity: 0.65, fontSize: 12, lineHeight: 1.4 };
