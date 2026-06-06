import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";
import FormCard from "../../components/FormCard";
import { validateEmail } from "../../utils/validation";
import { FaUser, FaLock, FaLeaf, FaArrowRight, FaEye, FaEyeSlash, FaEnvelope, FaCheckCircle } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState("");

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const fieldStatus = {
    email: form.email ? (validateEmail(form.email) ? "valid" : "invalid") : undefined,
    password: form.password ? "valid" : undefined,
  };

  const getFieldBorder = (status) => {
    if (status === "valid") return { borderColor: "#22c55e", background: "rgba(34,197,94,0.05)" };
    if (status === "invalid") return { borderColor: "#ef4444", background: "rgba(248,113,113,0.08)" };
    return {};
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = form.email.trim();
    const trimmedPassword = form.password;

    if (!trimmedEmail || !trimmedPassword) {
      setError("Invalid Email or Password");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError("Invalid Email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post(ENDPOINTS.login, { email: trimmedEmail, password: trimmedPassword });
      const userData = res.data;

      if (userData.error) {
        setError("Invalid Email or Password");
        return;
      }

      const role = userData.role;
      const name = userData.name;
      const userId = userData.userId;
      const email = userData.email;

      localStorage.setItem("user", JSON.stringify({ name, role, email, userId }));

      if (role === "admin") navigate("/admin");
      else if (role === "donor") navigate("/donor");
      else if (role === "recycler") navigate("/recycler");

      setForm({ email: "", password: "" });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        setError("Invalid Email or Password");
      } else {
        setError("Connection error. Please check if backend is running on http://localhost:8080");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .field-input {
          border: none;
          outline: none;
          background: transparent;
          color: #e2faf0;
          width: 100%;
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px;
          font-weight: 400;
        }
        .field-input::placeholder { color: rgba(134,239,172,0.45); }

        .submit-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 50px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 8px 28px rgba(34,197,94,0.35);
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          margin-top: 4px;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(34,197,94,0.5);
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .reg-link {
          color: #4ade80;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }
        .reg-link:hover { color: #86efac; }

        .left-panel { display: none; }
        @media (min-width: 900px) {
          .left-panel { display: flex; }
        }

        @keyframes bgPulse {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 0.65; }
        }
        .ambient { animation: bgPulse 8s ease-in-out infinite; }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .badge {
          background: linear-gradient(90deg, rgba(34,197,94,0.15), rgba(74,222,128,0.3), rgba(34,197,94,0.15));
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
          border: 1px solid rgba(74,222,128,0.25);
          color: #4ade80;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 50px;
          display: inline-block;
          margin-bottom: 14px;
        }
      `}</style>

      {/* Ambient blobs */}
      <div style={s.bg}>
        <div className="ambient" style={s.blob1} />
        <div className="ambient" style={s.blob2} />
        <div className="ambient" style={s.blob3} />
      </div>

      {/* Decorative grid lines */}
      <div style={s.grid} />

      {/* ── LEFT PANEL (decorative, hidden on small screens) ── */}
      <motion.div
        className="left-panel"
        style={s.leftPanel}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <div style={s.logo}>
            <div style={s.logoIcon}><FaLeaf size={13} color="#071a0e" /></div>
            <span style={s.logoText}>WasteSys</span>
          </div>
        </Link>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={s.leftEyebrow}>Welcome back</p>
          <h1 style={s.leftTitle}>Sign in to<br /><span style={s.leftAccent}>your dashboard.</span></h1>
          <p style={s.leftSub}>Track waste, manage pickups, and measure your environmental impact — all in one place.</p>

          {/* Stats row */}
          <div style={s.leftStats}>
            {[
              { value: "1200+", label: "kg Managed" },
              { value: "85%", label: "Recycling Rate" },
              { value: "150+", label: "Active Donors" },
            ].map((stat) => (
              <div key={stat.label} style={s.leftStat}>
                <span style={s.leftStatVal}>{stat.value}</span>
                <span style={s.leftStatLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={s.leftFooter}>© 2026 WasteSys — Built for Smart Cities 🌍</p>
      </motion.div>

      {/* ── RIGHT PANEL (login form) ── */}
      <motion.div
        style={s.rightPanel}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
      >
        <div style={s.card}>
          {/* Card glow */}
          <div style={s.cardGlow} />

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={s.cardLogoWrap}>
              <div style={s.logoIcon}><FaLeaf size={16} color="#071a0e" /></div>
            </div>
            <div className="badge">Secure Login</div>
            <h2 style={s.cardTitle}>Welcome Back</h2>
            <p style={s.cardSub}>Enter your credentials to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} style={s.form}>

            {/* Email */}
            <div>
              <label style={s.label}>Email Address</label>
              <motion.div
                style={{
                  ...s.inputBox,
                  ...(focusedField === "email" ? s.inputBoxFocused : {}),
                  ...getFieldBorder(fieldStatus.email),
                }}
                animate={{ scale: focusedField === "email" ? 1.01 : 1 }}
                transition={{ duration: 0.15 }}
              >
                <FaEnvelope size={13} color={focusedField === "email" ? "#4ade80" : "#4ade8066"} style={{ flexShrink: 0 }} />
                <input
                  className="field-input"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={onChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  autoComplete="email"
                />
                {fieldStatus.email === "valid" && <FaCheckCircle size={14} color="#22c55e" />}
              </motion.div>
            </div>

            {/* Password */}
            <div>
              <label style={s.label}>Password</label>
              <motion.div
                style={{
                  ...s.inputBox,
                  ...(focusedField === "password" ? s.inputBoxFocused : {}),
                  ...getFieldBorder(fieldStatus.password),
                }}
                animate={{ scale: focusedField === "password" ? 1.01 : 1 }}
                transition={{ duration: 0.15 }}
              >
                <FaLock size={13} color={focusedField === "password" ? "#4ade80" : "#4ade8066"} style={{ flexShrink: 0 }} />
                <input
                  className="field-input"
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={onChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  autoComplete="current-password"
                />
                {fieldStatus.password === "valid" && <FaCheckCircle size={14} color="#22c55e" />}
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  style={s.eyeBtn}
                >
                  {showPass ? <FaEyeSlash size={14} color="#4ade8088" /> : <FaEye size={14} color="#4ade8088" />}
                </button>
              </motion.div>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  style={s.errorBox}
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  ⚠ {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? (
                <><div className="spinner" /> Signing in...</>
              ) : (
                <>Sign In <FaArrowRight size={12} /></>
              )}
            </button>

            {/* Register link */}
            <p style={s.regText}>
              Don't have an account?{" "}
              <Link to="/register" className="reg-link">Create one free</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Styles ── */
const s = {
  page: {
    minHeight: "100vh",
    background: "#071a0e",
    display: "flex",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
  },

  bg: { position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" },
  blob1: {
    position: "absolute", top: "-5%", left: "-10%",
    width: "500px", height: "500px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)",
    filter: "blur(50px)",
  },
  blob2: {
    position: "absolute", bottom: "0%", right: "-5%",
    width: "400px", height: "400px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 70%)",
    filter: "blur(40px)",
  },
  blob3: {
    position: "absolute", top: "50%", left: "45%",
    width: "300px", height: "300px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)",
    filter: "blur(40px)",
  },

  grid: {
    position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
    backgroundImage: `
      linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)
    `,
    backgroundSize: "48px 48px",
  },

  /* LEFT PANEL */
  leftPanel: {
    flex: "1",
    flexDirection: "column",
    padding: "40px 56px",
    position: "relative",
    zIndex: 1,
    borderRight: "1px solid rgba(255,255,255,0.05)",
  },

  logo: { display: "flex", alignItems: "center", gap: "10px" },
  logoIcon: {
    width: "32px", height: "32px", borderRadius: "9px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "20px", fontWeight: "700", color: "#fff",
  },

  leftEyebrow: {
    fontSize: "13px", fontWeight: "600", letterSpacing: "0.12em",
    textTransform: "uppercase", color: "#22c55e", marginBottom: "16px",
  },
  leftTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(36px, 3.5vw, 52px)",
    fontWeight: "800", color: "#fff",
    lineHeight: "1.1", letterSpacing: "-0.02em",
    marginBottom: "20px",
  },
  leftAccent: {
    background: "linear-gradient(135deg, #4ade80, #22c55e, #bbf7d0)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  leftSub: {
    fontSize: "15px", fontWeight: "300", color: "#86efac",
    lineHeight: "1.7", maxWidth: "380px", marginBottom: "40px",
  },

  leftStats: {
    display: "flex", gap: "28px",
  },
  leftStat: {
    display: "flex", flexDirection: "column", gap: "4px",
  },
  leftStatVal: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "26px", fontWeight: "700", color: "#4ade80",
  },
  leftStatLabel: {
    fontSize: "12px", fontWeight: "500",
    color: "#86efac", letterSpacing: "0.04em",
  },

  leftFooter: {
    fontSize: "12px", color: "rgba(134,239,172,0.35)",
    letterSpacing: "0.04em",
  },

  /* RIGHT PANEL */
  rightPanel: {
    width: "100%",
    maxWidth: "480px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
    position: "relative",
    zIndex: 1,
    margin: "0 auto",
  },

  card: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "28px",
    padding: "44px 36px",
    backdropFilter: "blur(24px)",
    position: "relative",
    overflow: "hidden",
  },
  cardGlow: {
    position: "absolute", top: 0, left: 0, right: 0, height: "200px",
    background: "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
  },

  cardLogoWrap: {
    display: "flex", justifyContent: "center", marginBottom: "18px",
  },

  cardTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "28px", fontWeight: "700", color: "#fff",
    letterSpacing: "-0.02em", marginBottom: "8px",
  },
  cardSub: {
    fontSize: "13.5px", fontWeight: "300",
    color: "#86efac", lineHeight: "1.5",
  },

  form: {
    display: "flex", flexDirection: "column", gap: "20px",
  },

  label: {
    display: "block",
    fontSize: "12px", fontWeight: "600",
    color: "#4ade80", letterSpacing: "0.08em",
    textTransform: "uppercase", marginBottom: "8px",
  },

  inputBox: {
    display: "flex", alignItems: "center", gap: "12px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "13px 16px",
    borderRadius: "14px",
    backdropFilter: "blur(8px)",
    transition: "border-color 0.2s, background 0.2s",
  },
  inputBoxFocused: {
    border: "1px solid rgba(34,197,94,0.5)",
    background: "rgba(34,197,94,0.05)",
    boxShadow: "0 0 0 3px rgba(34,197,94,0.08)",
  },

  eyeBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "0",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
  },

  errorBox: {
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: "12px",
    padding: "11px 16px",
    fontSize: "13px",
    color: "#fca5a5",
    fontWeight: "500",
    overflow: "hidden",
  },

  regText: {
    textAlign: "center",
    fontSize: "13px", fontWeight: "400",
    color: "#86efac",
  },
};