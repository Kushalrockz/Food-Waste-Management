import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  FaHome,
  FaUserPlus,
  FaSignInAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaTachometerAlt,
  FaLeaf,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    setMobileOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .nav-link-item {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 16px;
          border-radius: 50px;
          text-decoration: none;
          color: #86efac;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: 0.03em;
          transition: all 0.22s ease;
          position: relative;
          white-space: nowrap;
        }
        .nav-link-item:hover {
          color: #fff;
          background: rgba(255,255,255,0.06);
        }
        .nav-link-item.active {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #fff;
          font-weight: 600;
          box-shadow: 0 4px 18px rgba(34,197,94,0.35);
        }
        .nav-link-item .nav-icon {
          font-size: 13px;
          opacity: 0.85;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.3);
          padding: 9px 16px;
          border-radius: 50px;
          color: #fca5a5;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          letter-spacing: 0.03em;
          transition: all 0.22s ease;
          white-space: nowrap;
        }
        .logout-btn:hover {
          background: rgba(239,68,68,0.22);
          border-color: rgba(239,68,68,0.55);
          color: #fff;
          box-shadow: 0 4px 16px rgba(239,68,68,0.2);
        }

        /* Mobile menu */
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 12px;
          text-decoration: none;
          color: #86efac;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .mobile-nav-link:hover, .mobile-nav-link.active {
          background: rgba(34,197,94,0.12);
          color: #4ade80;
        }
        .mobile-nav-link.active {
          background: linear-gradient(135deg, rgba(34,197,94,0.2), rgba(22,163,74,0.15));
          color: #fff;
        }

        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-hamburger { display: none !important; }
        }
      `}</style>

      <motion.nav
        style={s.navbar}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        {/* ── LOGO ── */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <motion.div
            style={s.logo}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.2 }}
          >
            <div style={s.logoIcon}>
              <FaLeaf size={13} color="#071a0e" />
            </div>
            <span style={s.logoText}>WasteSys</span>
          </motion.div>
        </Link>

        {/* ── DESKTOP LINKS ── */}
        <div className="nav-desktop" style={s.links}>
          <NavItem to="/" icon={<FaHome />} label="Home" location={location} />

          {!user && (
            <>
              <NavItem to="/register" icon={<FaUserPlus />} label="Register" location={location} />
              <NavItem to="/login" icon={<FaSignInAlt />} label="Login" location={location} />
            </>
          )}

          {user && (
            <>
              {user.role === "admin" && (
                <NavItem to="/admin" icon={<FaTachometerAlt />} label="Admin" location={location} />
              )}
              {user.role === "donor" && (
                <NavItem to="/donor" icon={<FaTachometerAlt />} label="Donor" location={location} />
              )}
              {user.role === "recycler" && (
                <NavItem to="/recycler" icon={<FaTachometerAlt />} label="Recycler" location={location} />
              )}

              {/* Divider */}
              <div style={s.divider} />

              {/* Profile chip */}
              <div style={s.profileChip}>
                <div style={s.profileAvatar}>
                  {user.name?.[0]?.toUpperCase() || <FaUserCircle />}
                </div>
                <span style={s.profileName}>{user.name}</span>
              </div>

              {/* Logout */}
              <motion.button
                className="logout-btn"
                onClick={logout}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <FaSignOutAlt size={12} /> Logout
              </motion.button>
            </>
          )}
        </div>

        {/* ── HAMBURGER (mobile) ── */}
        <motion.button
          className="nav-hamburger"
          style={s.hamburger}
          onClick={() => setMobileOpen((v) => !v)}
          whileTap={{ scale: 0.92 }}
        >
          {mobileOpen ? <FaTimes size={18} color="#4ade80" /> : <FaBars size={18} color="#4ade80" />}
        </motion.button>
      </motion.nav>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            style={s.mobileMenu}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <MobileItem to="/" icon={<FaHome />} label="Home" location={location} close={() => setMobileOpen(false)} />

            {!user && (
              <>
                <MobileItem to="/register" icon={<FaUserPlus />} label="Register" location={location} close={() => setMobileOpen(false)} />
                <MobileItem to="/login" icon={<FaSignInAlt />} label="Login" location={location} close={() => setMobileOpen(false)} />
              </>
            )}

            {user && (
              <>
                {user.role === "admin" && <MobileItem to="/admin" icon={<FaTachometerAlt />} label="Admin" location={location} close={() => setMobileOpen(false)} />}
                {user.role === "donor" && <MobileItem to="/donor" icon={<FaTachometerAlt />} label="Donor" location={location} close={() => setMobileOpen(false)} />}
                {user.role === "recycler" && <MobileItem to="/recycler" icon={<FaTachometerAlt />} label="Recycler" location={location} close={() => setMobileOpen(false)} />}

                <div style={s.mobileDivider} />

                <div style={s.mobileProfile}>
                  <div style={s.profileAvatar}>{user.name?.[0]?.toUpperCase()}</div>
                  <div>
                    <div style={{ color: "#fff", fontSize: "14px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{user.name}</div>
                    <div style={{ color: "#4ade80", fontSize: "11px", fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize" }}>{user.role}</div>
                  </div>
                </div>

                <button className="logout-btn" onClick={logout} style={{ width: "100%", justifyContent: "center" }}>
                  <FaSignOutAlt size={13} /> Logout
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Desktop Nav Item ── */
function NavItem({ to, icon, label, location }) {
  const isActive = location.pathname === to;
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
      <Link to={to} className={`nav-link-item${isActive ? " active" : ""}`}>
        <span className="nav-icon">{icon}</span>
        {label}
      </Link>
    </motion.div>
  );
}

/* ── Mobile Nav Item ── */
function MobileItem({ to, icon, label, location, close }) {
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`mobile-nav-link${isActive ? " active" : ""}`} onClick={close}>
      <span style={{ fontSize: "15px", opacity: 0.8 }}>{icon}</span>
      {label}
    </Link>
  );
}

/* ── Styles ── */
const s = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 40px",
    backdropFilter: "blur(20px)",
    background: "rgba(7,26,14,0.75)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  logoIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "20px",
    fontWeight: "700",
    color: "#fff",
    letterSpacing: "0.02em",
  },

  links: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  divider: {
    width: "1px",
    height: "22px",
    background: "rgba(255,255,255,0.12)",
    margin: "0 8px",
  },

  profileChip: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "7px 14px 7px 8px",
    borderRadius: "50px",
  },
  profileAvatar: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Playfair Display', serif",
    fontSize: "13px",
    fontWeight: "700",
    color: "#fff",
    flexShrink: 0,
  },
  profileName: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: "500",
    color: "#d1fae5",
  },

  /* Mobile */
  hamburger: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    padding: "9px 11px",
    cursor: "pointer",
    display: "none",
  },
  mobileMenu: {
    position: "fixed",
    top: "69px",
    left: 0,
    right: 0,
    zIndex: 999,
    background: "rgba(7,26,14,0.97)",
    backdropFilter: "blur(24px)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    padding: "16px 20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  mobileDivider: {
    height: "1px",
    background: "rgba(255,255,255,0.07)",
    margin: "8px 0",
  },
  mobileProfile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 16px",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "12px",
    marginBottom: "4px",
  },
};
