import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export default function Upload() {
  const navigate = useNavigate();
  const token = localStorage.getItem("sw_token");

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState("");
  const [genre, setGenre] = useState("");
  const [manualItems, setManualItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const canAdd = useMemo(() => {
    return title.trim() && Number(minutes) > 0;
  }, [title, minutes]);

  function addManual() {
    if (!canAdd) return;
    setManualItems((prev) => [
      ...prev,
      { title: title.trim(), minutes: Number(minutes), genre: genre.trim() || "Unknown" },
    ]);
    setTitle("");
    setMinutes("");
    setGenre("");
  }

  async function uploadCSV() {
    setMsg("");
    if (!file) return setMsg("Please select a CSV file first.");
    setLoading(true);

    try {
      if (API_BASE) {
        const fd = new FormData();
        fd.append("file", file);

        const res = await fetch(`${API_BASE}/watch-history/upload/`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: fd,
        });

        if (!res.ok) throw new Error("Upload failed");
      } else {
        await new Promise((r) => setTimeout(r, 500));
      }

      setMsg("CSV uploaded successfully ✅");
      navigate("/dashboard");
    } catch (e) {
      setMsg(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function submitManual() {
    setMsg("");
    if (manualItems.length === 0) return setMsg("Add at least one manual entry.");
    setLoading(true);

    try {
      if (API_BASE) {
        const res = await fetch(`${API_BASE}/watch-history/manual/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ items: manualItems }),
        });

        if (!res.ok) throw new Error("Manual submit failed");
      } else {
        await new Promise((r) => setTimeout(r, 450));
      }

      setMsg("Manual entries saved ✅");
      navigate("/dashboard");
    } catch (e) {
      setMsg(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("sw_token");
    localStorage.removeItem("sw_user");
    navigate("/login");
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.topRow}>
          <div>
            <h1 style={styles.h1}>Upload Watch History</h1>
            <p style={styles.p}>
              Upload a CSV or add entries manually. Then we’ll generate your dashboard + Wrapped.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => navigate("/dashboard")} style={styles.ghostBtn}>
              Go to Dashboard
            </button>
            <button onClick={logout} style={styles.dangerBtn}>
              Logout
            </button>
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>CSV Upload</div>
            <div style={styles.cardSub}>Recommended format: Title, Minutes, Genre</div>
            <div style={{ marginTop: 14 }}>
              <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} style={styles.file} />
            </div>
            <button onClick={uploadCSV} disabled={loading} style={{ ...styles.primaryBtn, marginTop: 14 }}>
              {loading ? "Uploading..." : "Upload CSV"}
            </button>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>Manual Entry</div>
            <div style={styles.cardSub}>Add a few items if you don’t have a CSV.</div>

            <div style={styles.row}>
              <div style={{ flex: 2 }}>
                <label style={styles.label}>Title</label>
                <input style={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Minutes</label>
                <input style={styles.input} value={minutes} onChange={(e) => setMinutes(e.target.value)} type="number" min="1" />
              </div>
              <div style={{ flex: 1.2 }}>
                <label style={styles.label}>Genre</label>
                <input style={styles.input} value={genre} onChange={(e) => setGenre(e.target.value)} />
              </div>
            </div>

            <button type="button" onClick={addManual} disabled={!canAdd} style={{ ...styles.ghostBtn, marginTop: 12, opacity: canAdd ? 1 : 0.4 }}>
              Add entry
            </button>

            {manualItems.length > 0 && (
              <div style={styles.list}>
                {manualItems.map((it, idx) => (
                  <div key={idx} style={styles.listItem}>
                    <div>
                      <div style={{ fontWeight: 900 }}>{it.title}</div>
                      <div style={{ opacity: 0.75, fontSize: 13 }}>
                        {it.genre} • {it.minutes} min
                      </div>
                    </div>
                    <button onClick={() => setManualItems((prev) => prev.filter((_, i) => i !== idx))} style={styles.xBtn}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button onClick={submitManual} disabled={loading} style={{ ...styles.primaryBtn, marginTop: 14 }}>
              {loading ? "Saving..." : "Save & Continue"}
            </button>
          </div>
        </div>

        {msg && <div style={styles.toast}>{msg}</div>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100vw",
    display: "grid",
    placeItems: "center",
    color: "#fff",
    background:
      "linear-gradient(135deg, #ff5fa2 0%, #d946ef 30%, #7c3aed 55%, #0b0b12 100%)",
  },
  shell: {
    width: "min(1200px, 94vw)",
    padding: "34px",
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 18,
    marginBottom: 22,
  },
  h1: { margin: 0, fontSize: "clamp(28px, 3.2vw, 40px)", fontWeight: 900 },
  p: { margin: "10px 0 0 0", opacity: 0.8, maxWidth: 680 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 },
  card: {
    borderRadius: 20,
    padding: 20,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.35)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
  },
  cardTitle: { fontWeight: 900, fontSize: 16 },
  cardSub: { opacity: 0.75, marginTop: 6, fontSize: 13 },
  label: { fontSize: 13, opacity: 0.8, display: "block", marginBottom: 6 },
  input: {
    height: 44,
    width: "100%",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    padding: "0 12px",
  },
  file: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "1px dashed rgba(255,255,255,0.25)",
    background: "rgba(0,0,0,0.25)",
    color: "#fff",
  },
  row: { display: "flex", gap: 12, marginTop: 14, alignItems: "flex-end" },
  primaryBtn: {
    height: 44,
    width: "100%",
    borderRadius: 12,
    border: "none",
    fontWeight: 900,
    cursor: "pointer",
    background: "linear-gradient(135deg, #ff5fa2, #d946ef)",
    color: "#fff",
  },
  ghostBtn: {
    height: 44,
    borderRadius: 12,
    padding: "0 14px",
    border: "1px solid rgba(255,255,255,0.25)",
    fontWeight: 800,
    cursor: "pointer",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
  },
  dangerBtn: {
    height: 44,
    borderRadius: 12,
    padding: "0 14px",
    border: "1px solid rgba(239,68,68,0.45)",
    fontWeight: 900,
    cursor: "pointer",
    background: "rgba(239,68,68,0.22)",
    color: "#fecaca",
  },
  list: { marginTop: 14, display: "grid", gap: 10, maxHeight: 220, overflow: "auto" },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.25)",
  },
  xBtn: {
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    padding: "10px 12px",
    fontWeight: 800,
  },
  toast: {
    marginTop: 16,
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(0,0,0,0.35)",
    fontWeight: 700,
  },
};
