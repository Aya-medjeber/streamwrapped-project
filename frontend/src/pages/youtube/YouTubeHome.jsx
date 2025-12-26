import React from "react";
import { useNavigate } from "react-router-dom";

export default function YouTubeHome() {
  const navigate = useNavigate();

  return (
    <div style={pageWrap}>
      <div style={container}>
        <h1 style={title}>YouTube Wrapped</h1>
        <p style={subtitle}>
          Generate a fun recap of your YouTube viewing — using your official Google Takeout
          export for privacy.
        </p>

        <div style={card}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>How it works</div>
          <ul style={list}>
            <li>Sign in with Google (identity)</li>
            <li>Open Google Takeout and export YouTube activity</li>
            <li>Upload the file here</li>
            <li>We generate your Wrapped slides</li>
          </ul>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
          <button style={primaryBtn} onClick={() => navigate("/youtube/connect")}>
            Continue
          </button>

          <button style={secondaryBtn} onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>

        <div style={footnote}>
          Note: Viewer watch history isn’t accessible via public APIs. Takeout is the safe method.
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

const title = { fontSize: 56, margin: 0, fontWeight: 900 };

const subtitle = { opacity: 0.85, marginTop: 10, fontSize: 16, lineHeight: 1.5 };

const card = {
  marginTop: 20,
  padding: 18,
  borderRadius: 16,
  background: "rgba(0,0,0,0.35)",
  border: "1px solid rgba(255,255,255,0.15)",
  backdropFilter: "blur(8px)",
};

const list = { marginTop: 10, opacity: 0.9, lineHeight: 1.7 };

const primaryBtn = {
  padding: "12px 16px",
  borderRadius: 12,
  border: "none",
  background: "#fff",
  color: "#000",
  fontWeight: 900,
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "12px 16px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.25)",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};

const footnote = { marginTop: 18, opacity: 0.65, fontSize: 12 };
