import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { FaRecycle, FaTruck, FaUsers, FaStar, FaLeaf, FaArrowRight } from "react-icons/fa";

/* ─── Animated Counter ─── */
function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const num = parseInt(target);
    const step = Math.ceil(num / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(start);
    }, 20);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Floating Leaf ─── */
function FloatingLeaf({ style }) {
  const [duration] = useState(() => 6 + Math.random() * 4);
  return (
    <motion.div
      style={{ position: "absolute", opacity: 0.07, fontSize: "60px", color: "#4ade80", ...style }}
      animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      <FaLeaf />
    </motion.div>
  );
}

/* ─── Main Component ─── */
export default function Home() {
  return (
    <div style={s.page}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #071a0e; }
        a { text-decoration: none; }

        .nav-link { color: #a7f3c0; font-family: 'DM Sans', sans-serif; font-size: 14px; letter-spacing: 0.04em; transition: color 0.2s; }
        .nav-link:hover { color: #fff; }

        .btn-primary {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #fff;
          padding: 14px 32px;
          border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 0.04em;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 32px rgba(34,197,94,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(34,197,94,0.5); }

        .btn-secondary {
          border: 1.5px solid rgba(167,243,192,0.5);
          color: #a7f3c0;
          padding: 14px 32px;
          border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 15px;
          letter-spacing: 0.04em;
          transition: all 0.2s;
          backdrop-filter: blur(8px);
          background: rgba(255,255,255,0.04);
        }
        .btn-secondary:hover { background: rgba(167,243,192,0.1); border-color: #a7f3c0; }

        .nav-register {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #fff !important;
          padding: 9px 20px;
          border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.05em;
          transition: box-shadow 0.2s, transform 0.2s;
          box-shadow: 0 4px 16px rgba(34,197,94,0.3);
        }
        .nav-register:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(34,197,94,0.45); }

        .feature-card:hover .feat-icon { transform: scale(1.2) rotate(-8deg); }

        .step-line::after {
          content: '';
          position: absolute;
          top: 36px;
          left: 100%;
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, #22c55e, transparent);
        }

        @keyframes bgPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }
        .ambient { animation: bgPulse 8s ease-in-out infinite; }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .badge {
          background: linear-gradient(90deg, rgba(34,197,94,0.2), rgba(74,222,128,0.4), rgba(34,197,94,0.2));
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
          border: 1px solid rgba(74,222,128,0.3);
          color: #4ade80;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 6px 18px;
          border-radius: 50px;
          display: inline-block;
          margin-bottom: 20px;
        }

        .divider {
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #22c55e, #4ade80);
          border-radius: 2px;
          margin: 0 auto 20px;
        }
      `}</style>

      {/* ── Ambient Background Blobs ── */}
      <div style={s.bg}>
        <div className="ambient" style={s.blob1} />
        <div className="ambient" style={s.blob2} />
        <div className="ambient" style={s.blob3} />
      </div>

      {/* ── Floating Leaves ── */}
      <FloatingLeaf style={{ top: "15%", left: "5%", fontSize: "80px" }} />
      <FloatingLeaf style={{ top: "35%", right: "8%", fontSize: "50px" }} />
      <FloatingLeaf style={{ top: "65%", left: "10%", fontSize: "40px" }} />
      <FloatingLeaf style={{ top: "80%", right: "12%", fontSize: "70px" }} />

      {/* ══════════════════════════════════
          NAVBAR
      ══════════════════════════════════ */}
      <motion.nav
        style={s.navbar}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div style={s.logo}>
          <div style={s.logoIcon}><FaLeaf size={14} color="#071a0e" /></div>
          <span style={s.logoText}>WasteSys</span>
        </div>

        <div style={s.navLinks}>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-register">Get Started</Link>
        </div>
      </motion.nav>

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section style={s.hero}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          style={{ textAlign: "center" }}
        >
          <div className="badge">🌿 Smart Food Waste Management</div>

          <h1 style={s.heroTitle}>
            Reduce Waste.<br />
            <span style={s.heroAccent}>Rebuild Tomorrow.</span>
          </h1>

          <p style={s.heroSub}>
            Connect donors, recyclers & communities to build<br />
            a cleaner, smarter, and more sustainable future.
          </p>

          <div style={s.heroButtons}>
            <Link to="/login" className="btn-primary">
              Get Started <FaArrowRight size={12} />
            </Link>
            <Link to="/register" className="btn-secondary">
              Create Account
            </Link>
          </div>

          {/* Trust badges */}
          <div style={s.trustRow}>
            {["ISO Certified", "100% Secure", "Real-time Tracking"].map((t) => (
              <div key={t} style={s.trustBadge}>
                <span style={{ color: "#22c55e", marginRight: "6px" }}>✓</span>
                <span style={s.trustText}>{t}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════
          STATS
      ══════════════════════════════════ */}
      <section style={s.statsSection}>
        <motion.div
          style={s.statsGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {[
            { value: "1200", suffix: "+ kg", label: "Waste Managed", icon: "♻️" },
            { value: "150", suffix: "+", label: "Active Donors", icon: "🤝" },
            { value: "85", suffix: "%", label: "Recycling Rate", icon: "📈" },
            { value: "40", suffix: "+", label: "Partner Cities", icon: "🌍" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              style={s.statCard}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div style={s.statEmoji}>{stat.icon}</div>
              <div style={s.statValue}>
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <div style={s.statLabel}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ══════════════════════════════════
          FEATURES
      ══════════════════════════════════ */}
      <section style={s.section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="badge">Features</div>
          <h2 style={s.sectionTitle}>Everything You Need</h2>
          <div className="divider" />
        </motion.div>

        <div style={s.featGrid}>
          {[
            {
              icon: <FaRecycle />,
              title: "Smart Tracking",
              desc: "Real-time monitoring of waste collection, sorting, and recycling with intelligent dashboards.",
              color: "#22c55e",
            },
            {
              icon: <FaTruck />,
              title: "Easy Pickup",
              desc: "Schedule and manage pickups seamlessly. Drivers get optimized routes for faster service.",
              color: "#f59e0b",
            },
            {
              icon: <FaUsers />,
              title: "Connect Network",
              desc: "Bridge the gap between donors, NGOs, and recycling facilities in one unified platform.",
              color: "#38bdf8",
            },
            {
              icon: <FaLeaf />,
              title: "Eco Reports",
              desc: "Measure your environmental impact with detailed analytics and carbon footprint savings.",
              color: "#a78bfa",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              className="feature-card"
              style={s.featCard}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div
                className="feat-icon"
                style={{
                  ...s.featIcon,
                  background: `${f.color}22`,
                  color: f.color,
                  transition: "transform 0.3s ease",
                }}
              >
                {f.icon}
              </div>
              <h3 style={s.featTitle}>{f.title}</h3>
              <p style={s.featDesc}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════ */}
      <section style={{ ...s.section, background: "rgba(255,255,255,0.015)", borderRadius: "32px", padding: "60px 20px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="badge">Process</div>
          <h2 style={s.sectionTitle}>How It Works</h2>
          <div className="divider" />
        </motion.div>

        <div style={s.stepsGrid}>
          {[
            { num: "01", title: "Create Account", desc: "Sign up in 60 seconds. No credit card required.", icon: "👤" },
            { num: "02", title: "Add Waste / Request", desc: "List your waste or schedule a pickup instantly.", icon: "📦" },
            { num: "03", title: "We Handle Rest", desc: "Our network connects you with the right recycler.", icon: "🔗" },
            { num: "04", title: "Track & Measure", desc: "See your positive environmental impact in real time.", icon: "📊" },
          ].map((step, i) => (
            <motion.div
              key={step.num}
              style={s.stepCard}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
            >
              <div style={s.stepNum}>{step.num}</div>
              <div style={s.stepEmoji}>{step.icon}</div>
              <h3 style={s.stepTitle}>{step.title}</h3>
              <p style={s.stepDesc}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════ */}
      <section style={s.section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="badge">Testimonials</div>
          <h2 style={s.sectionTitle}>Trusted by Leaders</h2>
          <div className="divider" />
        </motion.div>

        <div style={s.testimonialsGrid}>
          {[
            { name: "Taj Hotel", role: "Hospitality Partner", text: "WasteSys helped us reduce food waste by 40%. The pickup system is flawless and the reports are incredibly insightful.", stars: 5 },
            { name: "Eco Recycler", role: "Recycling Partner", text: "The most efficient waste pickup platform we've used. Driver routing alone saves us 3 hours every single day.", stars: 5 },
            { name: "NGO Trust", role: "Social Impact Partner", text: "Connecting communities to recyclers has created amazing social impact. Highly recommend to every organization.", stars: 5 },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              style={s.testimonialCard}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div style={s.stars}>
                {Array(t.stars).fill(0).map((_, si) => <FaStar key={si} color="#f59e0b" size={13} />)}
              </div>
              <p style={s.testimonialText}>"{t.text}"</p>
              <div style={s.testimonialAuthor}>
                <div style={s.avatar}>{t.name[0]}</div>
                <div>
                  <div style={s.authorName}>{t.name}</div>
                  <div style={s.authorRole}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          CTA BANNER
      ══════════════════════════════════ */}
      <section style={s.ctaSection}>
        <motion.div
          style={s.ctaInner}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div style={s.ctaGlow} />
          <h2 style={s.ctaTitle}>Ready to Make an Impact?</h2>
          <p style={s.ctaSub}>Join 150+ organizations already building a sustainable tomorrow.</p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" className="btn-primary">Start for Free <FaArrowRight size={12} /></Link>
            <Link to="/login" className="btn-secondary">Sign In</Link>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════
          FOOTER
      ══════════════════════════════════ */}
      <footer style={s.footer}>
        <div style={s.footerTop}>
          <div style={s.logo}>
            <div style={s.logoIcon}><FaLeaf size={12} color="#071a0e" /></div>
            <span style={s.logoText}>WasteSys</span>
          </div>
          <p style={s.footerTagline}>Building Smart Cities, One Pickup at a Time 🌍</p>
        </div>
        <div style={s.footerDivider} />
        <p style={s.footerCopy}>© 2026 WasteSys. Crafted with 💚 for a greener planet.</p>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const s = {
  page: {
    minHeight: "100vh",
    background: "#071a0e",
    color: "#e2faf0",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
  },

  /* Ambient blobs */
  bg: { position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" },
  blob1: {
    position: "absolute", top: "-10%", left: "-15%",
    width: "600px", height: "600px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)",
    filter: "blur(40px)",
  },
  blob2: {
    position: "absolute", top: "40%", right: "-10%",
    width: "500px", height: "500px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
    filter: "blur(40px)",
  },
  blob3: {
    position: "absolute", bottom: "10%", left: "30%",
    width: "400px", height: "400px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%)",
    filter: "blur(40px)",
  },

  /* NAVBAR */
  navbar: {
    position: "relative", zIndex: 10,
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "20px 48px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    backdropFilter: "blur(20px)",
    background: "rgba(7,26,14,0.7)",
  },
  logo: { display: "flex", alignItems: "center", gap: "10px" },
  logoIcon: {
    width: "30px", height: "30px", borderRadius: "8px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "20px", fontWeight: "700",
    color: "#fff", letterSpacing: "0.02em",
  },
  navLinks: { display: "flex", alignItems: "center", gap: "24px" },

  /* HERO */
  hero: {
    position: "relative", zIndex: 1,
    padding: "120px 20px 80px",
    textAlign: "center",
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(44px, 7vw, 80px)",
    fontWeight: "800",
    lineHeight: "1.1",
    color: "#fff",
    marginBottom: "24px",
    letterSpacing: "-0.02em",
  },
  heroAccent: {
    background: "linear-gradient(135deg, #4ade80, #22c55e, #bbf7d0)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSub: {
    fontSize: "18px", fontWeight: "300",
    color: "#86efac",
    lineHeight: "1.7",
    marginBottom: "40px",
  },
  heroButtons: {
    display: "flex", justifyContent: "center",
    gap: "16px", flexWrap: "wrap",
    marginBottom: "48px",
  },
  trustRow: {
    display: "flex", justifyContent: "center",
    gap: "24px", flexWrap: "wrap",
  },
  trustBadge: {
    display: "flex", alignItems: "center",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "50px",
    padding: "6px 16px",
  },
  trustText: {
    fontSize: "12px", fontWeight: "500",
    color: "#86efac", letterSpacing: "0.04em",
  },

  /* STATS */
  statsSection: {
    position: "relative", zIndex: 1,
    padding: "0 20px 80px",
    maxWidth: "900px", margin: "0 auto",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
  },
  statCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "28px 20px",
    textAlign: "center",
    backdropFilter: "blur(16px)",
    cursor: "default",
  },
  statEmoji: { fontSize: "28px", marginBottom: "10px" },
  statValue: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "36px", fontWeight: "700",
    color: "#4ade80",
    lineHeight: "1",
  },
  statLabel: {
    fontSize: "13px", fontWeight: "500",
    color: "#86efac", marginTop: "6px",
    letterSpacing: "0.04em",
  },

  /* SECTIONS */
  section: {
    position: "relative", zIndex: 1,
    maxWidth: "1200px", margin: "0 auto",
    padding: "80px 20px",
    textAlign: "center",
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(28px, 4vw, 42px)",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "14px",
    letterSpacing: "-0.02em",
  },

  /* FEATURES */
  featGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "24px",
    marginTop: "48px",
  },
  featCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "36px 28px",
    textAlign: "left",
    backdropFilter: "blur(16px)",
    cursor: "default",
  },
  featIcon: {
    width: "52px", height: "52px", borderRadius: "14px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "22px", marginBottom: "20px",
  },
  featTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "20px", fontWeight: "700",
    color: "#fff", marginBottom: "10px",
  },
  featDesc: {
    fontSize: "14px", fontWeight: "300",
    color: "#86efac", lineHeight: "1.7",
  },

  /* STEPS */
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "48px",
  },
  stepCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "20px",
    padding: "32px 24px",
    cursor: "default",
    position: "relative",
  },
  stepNum: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "52px", fontWeight: "800",
    color: "rgba(34,197,94,0.15)",
    lineHeight: "1",
    position: "absolute", top: "16px", right: "20px",
  },
  stepEmoji: { fontSize: "32px", marginBottom: "14px" },
  stepTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "18px", fontWeight: "700",
    color: "#fff", marginBottom: "8px",
  },
  stepDesc: {
    fontSize: "13px", fontWeight: "300",
    color: "#86efac", lineHeight: "1.65",
  },

  /* TESTIMONIALS */
  testimonialsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    marginTop: "48px",
  },
  testimonialCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "32px",
    textAlign: "left",
    backdropFilter: "blur(16px)",
    cursor: "default",
  },
  stars: { display: "flex", gap: "4px", marginBottom: "16px" },
  testimonialText: {
    fontSize: "14px", fontWeight: "300",
    color: "#d1fae5", lineHeight: "1.75",
    marginBottom: "24px",
    fontStyle: "italic",
  },
  testimonialAuthor: { display: "flex", alignItems: "center", gap: "12px" },
  avatar: {
    width: "40px", height: "40px", borderRadius: "50%",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Playfair Display', serif",
    fontSize: "18px", fontWeight: "700", color: "#fff",
    flexShrink: 0,
  },
  authorName: {
    fontSize: "14px", fontWeight: "600", color: "#fff",
  },
  authorRole: {
    fontSize: "12px", fontWeight: "400", color: "#4ade80",
    marginTop: "2px",
  },

  /* CTA */
  ctaSection: {
    position: "relative", zIndex: 1,
    padding: "40px 20px 80px",
    maxWidth: "800px", margin: "0 auto",
  },
  ctaInner: {
    background: "rgba(34,197,94,0.08)",
    border: "1px solid rgba(34,197,94,0.25)",
    borderRadius: "32px",
    padding: "64px 40px",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
    backdropFilter: "blur(20px)",
  },
  ctaGlow: {
    position: "absolute", inset: 0,
    background: "radial-gradient(ellipse at center top, rgba(34,197,94,0.15) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  ctaTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(28px, 4vw, 40px)",
    fontWeight: "800", color: "#fff",
    marginBottom: "16px", letterSpacing: "-0.02em",
  },
  ctaSub: {
    fontSize: "16px", fontWeight: "300",
    color: "#86efac", marginBottom: "36px",
    lineHeight: "1.6",
  },

  /* FOOTER */
  footer: {
    position: "relative", zIndex: 1,
    borderTop: "1px solid rgba(255,255,255,0.06)",
    padding: "40px 48px",
    background: "rgba(0,0,0,0.3)",
    backdropFilter: "blur(20px)",
  },
  footerTop: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", flexWrap: "wrap", gap: "12px",
    marginBottom: "20px",
  },
  footerTagline: {
    fontSize: "13px", color: "#4ade80", fontWeight: "400",
  },
  footerDivider: {
    height: "1px",
    background: "rgba(255,255,255,0.05)",
    marginBottom: "20px",
  },
  footerCopy: {
    fontSize: "12px", color: "#4ade8066",
    textAlign: "center", letterSpacing: "0.04em",
  },
};
