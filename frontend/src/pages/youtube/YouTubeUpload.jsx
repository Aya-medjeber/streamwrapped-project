import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function YouTubeUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | done

  const onUpload = () => {
    if (!file) return;
    setStatus("uploading");

    // MVP: fake upload delay. Later: call backend POST /takeout/upload
    setTimeout(() => {
      setStatus("done");
      navigate("/youtube/processing");
    }, 900);
  };

  return (
    <div style={pageWrap}>
      <div style={container}>
        <h1 style={title}>Upload your Takeout</h1>
        <p style={subtitle}>
          Upload the file you downloaded from Google Takeout (ZIP recommended). We’ll process your
          YouTube activity and generate your Wrapped.
        </p>

        <div style={card}>
          <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 10 }}>
            Choose file
          </div>

          <input
            type="file"
            accept=".zip,.json,.html"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            style={fileInput}
          />

          {file && (
            <div style={{ marginTop: 12, opacity: 0.9 }}>
              Selected: <b>{file.name}</b>
            </div>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
            <button style={primaryBtn} onClick={onUpload} disabled={!file || status === "uploading"}>
              {status === "uploading" ? "Uploading..." : "Upload & Generate"}
            </button>

            <button style={secondaryBtn} onClick={() => navigate("/youtube/connect")}>
              Back
            </button>
          </div>

          <div style={footnote}>
            Tip: If your Takeout is split into multiple ZIPs, upload the one containing YouTube
            activity first (we’ll improve multi-file support later).
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

const fileInput = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.25)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
};

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

const footnote = { marginTop: 14, opacity: 0.65, fontSize: 12, lineHeight: 1.4 };
