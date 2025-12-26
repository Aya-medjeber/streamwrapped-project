import React from "react";
import { useNavigate } from "react-router-dom";

const TAKEOUT_URL = "https://takeout.google.com/settings/takeout/custom/youtube";

export default function YouTubeConnect() {
  const navigate = useNavigate();

  return (
    <div style={pageWrap}>
      <div style={container}>
        <h1 style={title}>Connect your YouTube data</h1>
        <p style={subtitle}>
          To generate your YouTube Wrapped, we use your official YouTube activity export from
          Google Takeout. This keeps your data private and under your control.
        </p>

        <div style={card}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>Google Takeout steps</div>

          <ol style={list}>
            <li>Click <b>Open Google Takeout</b> (new tab).</li>
            <li>Select <b>YouTube and YouTube Music</b>.</li>
            <li>Make sure your activity / watch history is included.</li>
            <li>Export and download the file (usually a <b>.zip</b>).</li>
            <li>Come back here and upload it.</li>
          </ol>

          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <button
              style={youtubeBtn}
              onClick={() => window.open(TAKEOUT_URL, "_blank", "noopener,noreferrer")}
            >
              Open Google Takeout
            </button>

            <button style={primaryBtn} onClick={() => navigate("/youtube/upload")}>
              I already downloaded it
            </button>

            <button style={secondaryBtn} onClick={() => navigate("/youtube")}>
              Back
            </button>
          </div>
        </div>

        <div style={footnote}>
          We never ask for your password. You control what you export and upload.
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

const title = { fontSize: 48, margin: 0, fontWeight: 900 };

const subtitle = { opacity: 0.85, marginTop: 10, fontSize: 16, lineHeight: 1.5 };

const card = {
  marginTop: 20,
  padding: 18,
  borderRadius: 16,
  background: "rgba(0,0,0,0.35)",
  border: "1px solid rgba(255,255,255,0.15)",
  backdropFilter: "blur(8px)",
};

const list = { marginTop: 12, opacity: 0.92, lineHeight: 1.8 };

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

const youtubeBtn = {
  padding: "12px 16px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.25)",
  background: "linear-gradient(135deg, #ff5fa2, #7c3aed)",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};

const footnote = { marginTop: 18, opacity: 0.65, fontSize: 12 };
