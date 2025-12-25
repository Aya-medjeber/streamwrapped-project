import React, { useMemo, useState } from "react";
import { isValidEmail, validatePassword } from "../utils/validation";
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
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const setToken = (token) => localStorage.setItem("sw_token", token);
  const setUser = (user) =>
    localStorage.setItem("sw_user", JSON.stringify(user || {}));

  const pwCheck = useMemo(() => validatePassword(password), [password]);

  function runValidation() {
    setErr("");

    if (!isValidEmail(email)) {
      setEmailErr("Enter a valid email address.");
      return false;
    }

    const pw = validatePassword(password);
    if (!pw.ok) {
      setPasswordErr(`Password must have: ${pw.errors.join(", ")}`);
      return false;
    }

    if (mode === "register" && !name.trim()) {
      setErr("Please enter your name.");
      return false;
    }

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setEmailErr("");
    setPasswordErr("");

    if (!runValidation()) return;

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
        setToken(data.access || data.token || "demo-token");
        setUser(data.user || { name: name || "User", email });
        navigate("/upload");
        return;
      }

      // Demo mode
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
                  style={{
                    ...styles.input,
                    ...(emailErr ? styles.inputError : {}),
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  required
                />
                {emailErr && <div style={styles.fieldError}>{emailErr}</div>}
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <input
                  style={{
                    ...styles.input,
                    ...(passwordErr ? styles.inputError : {}),
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  required
                />
                {passwordErr && (
                  <div style={styles.fieldError}>{passwordErr}</div>
                )}
              </div>

              {mode === "register" && password.length > 0 && (
                <div style={styles.pwBox}>
                  <div style={{ fontWeight: 800, marginBottom: 8 }}>
                    Password requirements
                  </div>
                  <ul style={styles.pwList}>
                    {[
                      "At least 8 characters",
                      "At least 1 lowercase letter",
                      "At least 1 uppercase letter",
                      "At least 1 number",
                      "At least 1 special character",
                    ].map((req) => (
                      <li key={req} style={styles.pwItem}>
                        {pwCheck.errors.includes(req) ? "•" : "✓"} {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {err && <div style={styles.error}>{err}</div>}

              <button disabled={loading} style={styles.primaryBtn}>
                {loading
                  ? "Please wait..."
                  : mode === "login"
                  ? "Login"
                  : "Create account"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setMode(mode === "login" ? "register" : "login")
                }
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

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    width: "100vw",
    display: "grid",
    placeItems: "center",
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
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(12px)",
  },
  left: { padding: "56px", display: "flex", alignItems: "center" },
  right: {
    padding: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.05)",
  },
  badge: {
    padding: "6px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.12)",
    marginBottom: 18,
    fontWeight: 700,
    display: "inline-block",
  },
  h1: { fontSize: 48, fontWeight: 900, marginBottom: 10 },
  p: { opacity: 0.85, marginBottom: 28 },
  form: { display: "grid", gap: 16 },
  field: { display: "grid", gap: 6 },
  label: { fontSize: 13, opacity: 0.85 },
  input: {
    height: 46,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    padding: "0 14px",
  },
  inputError: {
    border: "1px solid rgba(239,68,68,0.8)",
  },
  fieldError: { fontSize: 12, color: "#fecaca" },
  primaryBtn: {
    height: 46,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #ff5fa2, #d946ef)",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },
  ghostBtn: {
    height: 46,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  error: {
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(239,68,68,0.2)",
    border: "1px solid rgba(239,68,68,0.45)",
    color: "#fecaca",
    fontSize: 14,
  },
  pwBox: {
    padding: 12,
    borderRadius: 12,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.16)",
  },
  pwList: { paddingLeft: 16, display: "grid", gap: 6 },
  pwItem: { fontSize: 12 },
  previewCard: {
    width: 360,
    padding: 22,
    borderRadius: 20,
    background: "rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.16)",
  },
  previewTitle: { fontWeight: 900 },
  previewLine: {
    height: 1,
    background: "rgba(255,255,255,0.18)",
    margin: "14px 0",
  },
  previewStat: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
  },
  previewHint: { marginTop: 12, fontSize: 13, opacity: 0.75 },
};
