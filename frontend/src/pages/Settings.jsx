import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const token = localStorage.getItem("sw_token") || "";
  const initialUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("sw_user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const [name, setName] = useState(initialUser.name || "");
  const [email, setEmail] = useState(initialUser.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const history = useMemo(
    () => [
      { title: "Breaking Bad", type: "Series", date: "2025-11-18" },
      { title: "Interstellar", type: "Movie", date: "2025-10-05" },
      { title: "The Office", type: "Series", date: "2025-09-12" },
    ],
    []
  );

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  function saveProfile() {
    setErr("");
    setMsg("");

    if (!name.trim()) return setErr("Name cannot be empty.");
    if (!email.trim()) return setErr("Email cannot be empty.");

    const user = { ...initialUser, name: name.trim(), email: email.trim() };
    localStorage.setItem("sw_user", JSON.stringify(user));
    setMsg("Profile updated successfully ✅");
  }

  function changePassword() {
    setErr("");
    setMsg("");

    if (!oldPassword || !newPassword)
      return setErr("Fill both password fields.");
    if (newPassword.length < 6)
      return setErr("New password must be at least 6 characters.");

    setOldPassword("");
    setNewPassword("");
    setMsg("Password changed (mock) ✅");
  }

  function logout() {
    localStorage.removeItem("sw_token");
    localStorage.removeItem("sw_user");
    navigate("/login");
  }

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.h1}>Settings</h1>
            <p style={styles.sub}>Manage your profile, history, and security.</p>
          </div>

          <div style={styles.headerBtns}>
            <button style={styles.btnGhost} onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </button>
            <button style={styles.btnDanger} onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        {(err || msg) && (
          <div style={{ ...styles.notice, ...(err ? styles.noticeErr : styles.noticeOk) }}>
            {err || msg}
          </div>
        )}

        <div style={styles.grid}>
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Profile</h2>
            <div style={styles.field}>
              <label style={styles.label}>Name</label>
              <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
              <button style={styles.btnPrimary} onClick={saveProfile}>
                Save Changes
              </button>
              <button style={styles.btnGhost} onClick={() => navigate("/upload")}>
                Go to Upload
              </button>
            </div>
          </section>

          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Security</h2>
            <div style={styles.field}>
              <label style={styles.label}>Current password</label>
              <input style={styles.input} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} type="password" />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>New password</label>
              <input style={styles.input} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" />
            </div>
            <button style={{ ...styles.btnPrimary, marginTop: 14 }} onClick={changePassword}>
              Change Password
            </button>
            <p style={styles.small}>(Mock for now — backend later)</p>
          </section>

          <section style={{ ...styles.card, gridColumn: "1 / -1" }}>
            <h2 style={styles.cardTitle}>Watch History</h2>
            <div style={styles.table}>
              <div style={styles.thead}>
                <div>Title</div>
                <div>Type</div>
                <div>Date</div>
              </div>
              {history.map((h, i) => (
                <div key={i} style={styles.trow}>
                  <div style={{ fontWeight: 700 }}>{h.title}</div>
                  <div style={{ opacity: 0.85 }}>{h.type}</div>
                  <div style={{ opacity: 0.85 }}>{h.date}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100vw",
    color: "#fff",
    background:
      "linear-gradient(135deg, #ff5fa2 0%, #d946ef 30%, #7c3aed 55%, #0b0b12 100%)",
  },
  wrap: {
    width: "min(1200px, 92vw)",
    margin: "0 auto",
    padding: "44px 0 70px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    alignItems: "flex-end",
    marginBottom: 18,
  },
  h1: { margin: 0, fontSize: "clamp(34px, 4vw, 56px)", fontWeight: 900 },
  sub: { margin: "8px 0 0", opacity: 0.82 },
  headerBtns: { display: "flex", gap: 12 },

  notice: {
    padding: "12px 14px",
    borderRadius: 14,
    marginTop: 10,
    marginBottom: 16,
    border: "1px solid rgba(255,255,255,0.16)",
  },
  noticeErr: { background: "rgba(239,68,68,0.18)", color: "#fecaca" },
  noticeOk: { background: "rgba(34,197,94,0.18)", color: "#bbf7d0" },

  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },

  card: {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.35)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.55)",
    padding: 22,
    backdropFilter: "blur(10px)",
  },
  cardTitle: { margin: "0 0 14px", fontWeight: 900, fontSize: 18, opacity: 0.95 },

  field: { display: "grid", gap: 8, marginBottom: 12 },
  label: { fontSize: 13, opacity: 0.86 },
  input: {
    height: 46,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    padding: "0 14px",
  },

  btnPrimary: {
    height: 44,
    padding: "0 16px",
    borderRadius: 12,
    border: "none",
    fontWeight: 900,
    cursor: "pointer",
    background: "linear-gradient(135deg, #ff5fa2, #d946ef)",
    color: "#fff",
  },
  btnGhost: {
    height: 44,
    padding: "0 16px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.25)",
    fontWeight: 800,
    cursor: "pointer",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
  },
  btnDanger: {
    height: 44,
    padding: "0 16px",
    borderRadius: 12,
    border: "1px solid rgba(239,68,68,0.45)",
    fontWeight: 900,
    cursor: "pointer",
    background: "rgba(239,68,68,0.22)",
    color: "#fecaca",
  },

  small: { margin: "10px 0 0", fontSize: 13, opacity: 0.75 },

  table: {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.14)",
    overflow: "hidden",
  },
  thead: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    padding: "12px 14px",
    background: "rgba(255,255,255,0.08)",
    fontWeight: 900,
    opacity: 0.9,
  },
  trow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    padding: "12px 14px",
    borderTop: "1px solid rgba(255,255,255,0.12)",
  },
};
