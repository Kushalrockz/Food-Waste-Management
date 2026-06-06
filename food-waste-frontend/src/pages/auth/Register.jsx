import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";
import FormCard from "../../components/FormCard";
import {
  FaUser, FaEnvelope, FaLock, FaLeaf,
  FaArrowRight, FaEye, FaEyeSlash, FaCheckCircle, FaPhone,
} from "react-icons/fa";
import { validateName, validateEmail, getEmailProviderMessage, validatePassword, validateContact } from "../../utils/validation";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", contact: "", role: "donor" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const fieldStatus = {
    name: form.name ? (validateName(form.name) ? "valid" : "invalid") : undefined,
    email: form.email ? (validateEmail(form.email) ? "valid" : "invalid") : undefined,
    password: form.password ? (validatePassword(form.password) ? "valid" : "invalid") : undefined,
    contact: form.contact ? (validateContact(form.contact) ? "valid" : "invalid") : undefined,
  };

  const getFieldBorder = (status) => {
    if (status === "valid") return { borderColor: "#22c55e", background: "rgba(34,197,94,0.05)" };
    if (status === "invalid") return { borderColor: "#ef4444", background: "rgba(248,113,113,0.08)" };
    return {};
  };

  const getStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };
  const strength = getStrength(form.password);
  const strengthLabel = ["", "Weak", "Medium", "Strong", "Strong"][strength];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#84cc16", "#22c55e"][strength];

  const onSubmit = async (e) => {
    e.preventDefault();
    const trimmedForm = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      contact: form.contact.trim(),
      role: form.role,
    };

    if (!trimmedForm.name || !trimmedForm.email || !trimmedForm.password || !trimmedForm.contact) {
      setError("Please fill in all fields.");
      return;
    }

    if (!validateName(trimmedForm.name)) {
      setError("Name must be at least 3 characters and contain no numbers.");
      return;
    }

    if (!trimmedForm.email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(trimmedForm.email)) {
      setError(getEmailProviderMessage(trimmedForm.email));
      return;
    }

    if (!validatePassword(trimmedForm.password)) {
      setError("Password must contain: Uppercase, Lowercase, Number, Special Character");
      return;
    }

    if (!validateContact(trimmedForm.contact)) {
      setError("Contact must be exactly 10 digits.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post(ENDPOINTS.register, trimmedForm);
      
      if (response.data.error) {
        const raw = response.data.error.toString().toLowerCase();
        if (raw.includes("already registered") || raw.includes("duplicate")) {
          setError("Email already registered");
        } else {
          setError(response.data.error);
        }
        return;
      }

      setSuccess(true);
      setForm({ name: "", email: "", password: "", contact: "", role: "donor" });
    } catch (err) {
      console.error(err);
      const serverError = err.response?.data?.error?.toString()?.toLowerCase();
      if (serverError) {
        if (serverError.includes("already registered") || serverError.includes("duplicate")) {
          setError("Email already registered");
        } else {
          setError(err.response.data.error);
        }
      } else {
        setError("Registration failed. Please try again.");
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
          border: none; outline: none;
          background: transparent;
          color: #e2faf0;
          width: 100%;
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px; font-weight: 400;
        }
        .field-input::placeholder { color: rgba(134,239,172,0.45); }

        .submit-btn {
          width: 100%; padding: 14px; border: none;
          border-radius: 50px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 600; letter-spacing: 0.04em;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 8px 28px rgba(34,197,94,0.35);
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          margin-top: 4px;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(34,197,94,0.5);
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .login-link { color: #4ade80; font-weight: 600; text-decoration: none; transition: color 0.2s; }
        .login-link:hover { color: #86efac; }

        @keyframes bgPulse { 0%,100%{opacity:.45} 50%{opacity:.65} }
        .ambient { animation: bgPulse 8s ease-in-out infinite; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes shimmer {
          0%{background-position:-200% center} 100%{background-position:200% center}
        }
        .badge {
          background: linear-gradient(90deg,rgba(34,197,94,.15),rgba(74,222,128,.3),rgba(34,197,94,.15));
          background-size: 200% auto; animation: shimmer 3s linear infinite;
          border: 1px solid rgba(74,222,128,.25); color: #4ade80;
          font-family: 'DM Sans',sans-serif; font-size: 11px; font-weight: 600;
          letter-spacing: .12em; text-transform: uppercase;
          padding: 5px 14px; border-radius: 50px; display: inline-block; margin-bottom: 14px;
        }

        @keyframes popIn { 0%{transform:scale(.8);opacity:0} 100%{transform:scale(1);opacity:1} }
        .success-icon { animation: popIn 0.4s cubic-bezier(.34,1.56,.64,1) forwards; }
      `}</style>

      {/* Ambient blobs */}
      <div style={s.bg}>
        <div className="ambient" style={s.blob1} />
        <div className="ambient" style={s.blob2} />
        <div className="ambient" style={s.blob3} />
      </div>
      <div style={s.grid} />

      {/* ── LEFT PANEL ── */}
      <motion.div
        style={s.leftPanel}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <div style={s.logo}>
            <div style={s.logoIcon}><FaLeaf size={13} color="#071a0e" /></div>
            <span style={s.logoText}>WasteSys</span>
          </div>
        </Link>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={s.leftEyebrow}>Join the movement</p>
          <h1 style={s.leftTitle}>Start your<br /><span style={s.leftAccent}>green journey.</span></h1>
          <p style={s.leftSub}>Become part of a growing network of donors, recyclers, and changemakers building a cleaner world.</p>

          {/* Perks */}
          <div style={s.perks}>
            {[
              "Free account, no credit card needed",
              "Real-time waste tracking dashboard",
              "Connect with recyclers instantly",
              "Measure your environmental impact",
            ].map((perk) => (
              <div key={perk} style={s.perk}>
                <FaCheckCircle size={13} color="#22c55e" style={{ flexShrink: 0 }} />
                <span style={s.perkText}>{perk}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={s.leftFooter}>© 2026 WasteSys — Built for Smart Cities 🌍</p>
      </motion.div>

      {/* ── RIGHT PANEL ── */}
      <motion.div
        style={s.rightPanel}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
      >
        <div style={s.card}>
          <div style={s.cardGlow} />

          <AnimatePresence mode="wait">
            {success ? (
              /* ── SUCCESS STATE ── */
              <motion.div
                key="success"
                style={s.successWrap}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="success-icon" style={s.successIcon}>
                  <FaCheckCircle size={48} color="#22c55e" />
                </div>
                <h2 style={{ ...s.cardTitle, marginBottom: "10px" }}>You're in! 🎉</h2>
                <p style={{ ...s.cardSub, marginBottom: "28px" }}>
                  Your account has been created successfully. Start making an impact today.
                </p>
                <Link to="/login" className="submit-btn" style={{
                  background: "linear-gradient(135deg,#22c55e,#16a34a)",
                  color: "#fff", padding: "14px 32px", borderRadius: "50px",
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
                  fontSize: "15px", display: "inline-flex", alignItems: "center", gap: "8px",
                  textDecoration: "none", boxShadow: "0 8px 28px rgba(34,197,94,0.35)",
                  transition: "transform 0.2s",
                }}>
                  Sign In Now <FaArrowRight size={12} />
                </Link>
              </motion.div>
            ) : (
              /* ── FORM STATE ── */
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                  <div style={s.cardLogoWrap}>
                    <div style={s.logoIcon}><FaLeaf size={16} color="#071a0e" /></div>
                  </div>
                  <div className="badge">Free Account</div>
                  <h2 style={s.cardTitle}>Create Account</h2>
                  <p style={s.cardSub}>Join thousands building a greener future</p>
                </div>

                <form onSubmit={onSubmit} style={s.form}>

                  {/* Full Name */}
                  <div>
                    <label style={s.label}>Full Name</label>
                    <motion.div
                      style={{ ...s.inputBox, ...(focusedField === "name" ? s.inputBoxFocused : {}), ...getFieldBorder(fieldStatus.name) }}
                      animate={{ scale: focusedField === "name" ? 1.01 : 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      <FaUser size={13} color={focusedField === "name" ? "#4ade80" : "#4ade8066"} style={{ flexShrink: 0 }} />
                      <input
                        className="field-input"
                        name="name"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={onChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField("")}
                        autoComplete="name"
                      />
                      {fieldStatus.name === "valid" && <FaCheckCircle size={14} color="#22c55e" />}
                    </motion.div>
                  </div>

                  {/* Email */}
                  <div>
                    <label style={s.label}>Email Address</label>
                    <motion.div
                      style={{ ...s.inputBox, ...(focusedField === "email" ? s.inputBoxFocused : {}), ...getFieldBorder(fieldStatus.email) }}
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

                  {/* Contact */}
                  <div>
                    <label style={s.label}>Contact Number</label>
                    <motion.div
                      style={{ ...s.inputBox, ...(focusedField === "contact" ? s.inputBoxFocused : {}), ...getFieldBorder(fieldStatus.contact) }}
                      animate={{ scale: focusedField === "contact" ? 1.01 : 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      <FaPhone size={13} color={focusedField === "contact" ? "#4ade80" : "#4ade8066"} style={{ flexShrink: 0 }} />
                      <input
                        className="field-input"
                        name="contact"
                        type="tel"
                        placeholder="Enter your 10-digit phone number"
                        value={form.contact}
                        onChange={onChange}
                        onFocus={() => setFocusedField("contact")}
                        onBlur={() => setFocusedField("")}
                        autoComplete="tel"
                        maxLength={10}
                      />
                      {fieldStatus.contact === "valid" && <FaCheckCircle size={14} color="#22c55e" />}
                    </motion.div>
                  </div>

                  {/* Password */}
                  <div>
                    <label style={s.label}>Password</label>
                    <motion.div
                      style={{ ...s.inputBox, ...(focusedField === "password" ? s.inputBoxFocused : {}), ...getFieldBorder(fieldStatus.password) }}
                      animate={{ scale: focusedField === "password" ? 1.01 : 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      <FaLock size={13} color={focusedField === "password" ? "#4ade80" : "#4ade8066"} style={{ flexShrink: 0 }} />
                      <input
                        className="field-input"
                        name="password"
                        type={showPass ? "text" : "password"}
                        placeholder="Create a password"
                        value={form.password}
                        onChange={onChange}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField("")}
                        autoComplete="new-password"
                      />
                      {fieldStatus.password === "valid" && <FaCheckCircle size={14} color="#22c55e" />}
                      <button type="button" onClick={() => setShowPass((v) => !v)} style={s.eyeBtn}>
                        {showPass
                          ? <FaEyeSlash size={14} color="#4ade8088" />
                          : <FaEye size={14} color="#4ade8088" />}
                      </button>
                    </motion.div>

                    {/* Password strength bar */}
                    <AnimatePresence>
                      {form.password.length > 0 && (
                        <motion.div
                          style={s.strengthWrap}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div style={s.strengthBar}>
                            {[1, 2, 3, 4].map((i) => (
                              <motion.div
                                key={i}
                                style={{
                                  ...s.strengthSegment,
                                  background: i <= strength ? strengthColor : "rgba(255,255,255,0.08)",
                                }}
                                animate={{ background: i <= strength ? strengthColor : "rgba(255,255,255,0.08)" }}
                                transition={{ duration: 0.3 }}
                              />
                            ))}
                          </div>
                          <span style={{ ...s.strengthLabel, color: strengthColor }}>{strengthLabel}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Error */}
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
                    {loading
                      ? <><div className="spinner" /> Creating account...</>
                      : <>Create Account <FaArrowRight size={12} /></>}
                  </button>

                  {/* Login link */}
                  <p style={s.loginText}>
                    Already have an account?{" "}
                    <Link to="/login" className="login-link">Sign in here</Link>
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

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
    position: "absolute", top: "-5%", right: "-10%",
    width: "500px", height: "500px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)",
    filter: "blur(50px)",
  },
  blob2: {
    position: "absolute", bottom: "0%", left: "-5%",
    width: "400px", height: "400px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 70%)",
    filter: "blur(40px)",
  },
  blob3: {
    position: "absolute", top: "40%", left: "45%",
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
    display: "none",
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
    lineHeight: "1.1", letterSpacing: "-0.02em", marginBottom: "20px",
  },
  leftAccent: {
    background: "linear-gradient(135deg, #4ade80, #22c55e, #bbf7d0)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  leftSub: {
    fontSize: "15px", fontWeight: "300", color: "#86efac",
    lineHeight: "1.7", maxWidth: "380px", marginBottom: "36px",
  },

  perks: { display: "flex", flexDirection: "column", gap: "14px" },
  perk: { display: "flex", alignItems: "flex-start", gap: "10px" },
  perkText: {
    fontSize: "14px", fontWeight: "400", color: "#d1fae5", lineHeight: "1.5",
  },

  leftFooter: {
    fontSize: "12px", color: "rgba(134,239,172,0.35)", letterSpacing: "0.04em",
  },

  /* RIGHT PANEL */
  rightPanel: {
    width: "100%", maxWidth: "480px",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "40px 24px",
    position: "relative", zIndex: 1,
    margin: "0 auto",
  },

  card: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "28px",
    padding: "44px 36px",
    backdropFilter: "blur(24px)",
    position: "relative", overflow: "hidden",
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

  form: { display: "flex", flexDirection: "column", gap: "20px" },

  label: {
    display: "block", fontSize: "12px", fontWeight: "600",
    color: "#4ade80", letterSpacing: "0.08em",
    textTransform: "uppercase", marginBottom: "8px",
  },

  inputBox: {
    display: "flex", alignItems: "center", gap: "12px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "13px 16px", borderRadius: "14px",
    backdropFilter: "blur(8px)",
    transition: "border-color 0.2s, background 0.2s",
  },
  helpText: {
    fontSize: "12px",
    marginTop: "8px",
    color: "rgba(255,255,255,0.75)",
    lineHeight: 1.45,
  },
  inputBoxFocused: {
    borderColor: "rgba(34,197,94,0.5)",
    background: "rgba(34,197,94,0.05)",
    boxShadow: "0 0 0 3px rgba(34,197,94,0.08)",
  },

  eyeBtn: {
    background: "transparent", border: "none", cursor: "pointer",
    padding: "0", display: "flex", alignItems: "center", flexShrink: 0,
  },

  /* Password strength */
  strengthWrap: {
    display: "flex", alignItems: "center", gap: "10px", marginTop: "8px", overflow: "hidden",
  },
  strengthBar: { display: "flex", gap: "4px", flex: 1 },
  strengthSegment: {
    flex: 1, height: "4px", borderRadius: "2px", transition: "background 0.3s",
  },
  strengthLabel: {
    fontSize: "11px", fontWeight: "600", letterSpacing: "0.06em",
    textTransform: "uppercase", flexShrink: 0,
  },

  errorBox: {
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: "12px", padding: "11px 16px",
    fontSize: "13px", color: "#fca5a5", fontWeight: "500", overflow: "hidden",
  },

  loginText: {
    textAlign: "center", fontSize: "13px",
    fontWeight: "400", color: "#86efac",
  },

  /* Success state */
  successWrap: {
    textAlign: "center", padding: "16px 0",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
  },
  successIcon: {
    width: "80px", height: "80px", borderRadius: "50%",
    background: "rgba(34,197,94,0.12)",
    border: "1px solid rgba(34,197,94,0.25)",
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: "20px",
  },
};
