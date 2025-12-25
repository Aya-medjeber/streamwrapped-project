import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const setToken = (token) => localStorage.setItem("sw_token", token);
  const setUser = (user) =>
    localStorage.setItem("sw_user", JSON.stringify(user || {}));

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      if (API_BASE) {
        const url =
          mode === "login"
            ? `${API_BASE}/auth/login/`
            : `${API_BASE}/auth/register/`;

        const body =
          mode === "login"
            ? { email, password }
            : { name, email, password };

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error("Authentication failed");

        const data = await res.json();
        const token = data.access || data.token || "demo-token";
        setToken(token);
        setUser(data.user || { name: name || "User", email });
        navigate("/upload");
        return;
      }

      await new Promise((r) => setTimeout(r, 450));
      setToken("demo-token");
      setUser({ name: name || "User", email });
      navigate("/upload");
    } catch (e2) {
      setErr(e2.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.left}>
          <div style={{ maxWidth: 520 }}>
            <div style={styles.badge}>StreamWrapped</div>
            <h1 style={styles.h1}>
              {mode === "login" ? "Welcome back." : "Create your account."}
            </h1>
            <p style={styles.p}>
              Log in to upload your watch history and generate your <b>Wrapped</b>.
            </p>

            <form onSubmit={handleSubmit} style={styles.form}>
              {mode === "register" && (
                <div style={styles.field}>
                  <label style={styles.label}>Name</label>
                  <input
                    style={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
              )}

              <div style={styles.field}>
                <label style={styles.label}>Email</label>
                <input
                  style={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <input
                  style={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  required
                />
              </div>

              {err && <div style={styles.error}>{err}</div>}

              <button disabled={loading} style={styles.primaryBtn}>
                {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
              </button>

              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                style={styles.ghostBtn}
              >
                {mode === "login"
                  ? "New here? Create an account"
                  : "Already have an account? Login"}
              </button>
            </form>
          </div>
        </div>

        <div style={styles.right}>
          <div style={styles.previewCard}>
            <div style={styles.previewTitle}>Your Wrapped preview</div>
            <div style={styles.previewLine} />
            <div style={styles.previewStat}>
              <span>Total Hours</span>
              <b>1,240 hrs</b>
            </div>
            <div style={styles.previewStat}>
              <span>Top Genre</span>
              <b>Drama</b>
            </div>
            <div style={styles.previewStat}>
              <span>Binge Streak</span>
              <b>7 days</b>
            </div>
            <div style={styles.previewHint}>
              Login → Upload → Dashboard → Wrapped
            </div>
          </div>
        </div>
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

    /* 🔥 SAME GRADIENT AS DASHBOARD */
    background:
      "linear-gradient(135deg, #ff5fa2 0%, #d946ef 30%, #7c3aed 55%, #0b0b12 100%)",

    color: "#fff",
  },
  shell: {
    width: "min(1200px, 94vw)",
    minHeight: "min(720px, 88vh)",
    borderRadius: 24,
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(12px)",
  },
  left: {
    padding: "56px",
    display: "flex",
    alignItems: "center",
  },
  right: {
    padding: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.05)",
  },
  badge: {
    display: "inline-flex",
    padding: "6px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.12)",
    marginBottom: 18,
    fontWeight: 700,
  },
  h1: {
    fontSize: "clamp(34px, 4vw, 54px)",
    margin: "0 0 10px 0",
    fontWeight: 900,
  },
  p: { opacity: 0.85, margin: "0 0 28px 0", lineHeight: 1.45 },
  form: { display: "grid", gap: 16 },
  field: { display: "grid", gap: 8 },
  label: { fontSize: 13, opacity: 0.85 },
  input: {
    height: 46,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    padding: "0 14px",
    outline: "none",
  },
  primaryBtn: {
    height: 46,
    borderRadius: 12,
    border: "none",
    fontWeight: 800,
    cursor: "pointer",

    /* pink button */
    background: "linear-gradient(135deg, #ff5fa2, #d946ef)",
    color: "#fff",
  },
  ghostBtn: {
    height: 46,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.25)",
    fontWeight: 700,
    cursor: "pointer",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
  },
  error: {
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(239,68,68,0.2)",
    border: "1px solid rgba(239,68,68,0.45)",
    color: "#fecaca",
    fontSize: 14,
  },
  previewCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 20,
    padding: 22,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(0,0,0,0.35)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
  },
  previewTitle: { fontWeight: 900, fontSize: 16, opacity: 0.9 },
  previewLine: {
    height: 1,
    background: "rgba(255,255,255,0.18)",
    margin: "14px 0",
  },
  previewStat: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    opacity: 0.95,
  },
  previewHint: { marginTop: 12, fontSize: 13, opacity: 0.75 },
};
