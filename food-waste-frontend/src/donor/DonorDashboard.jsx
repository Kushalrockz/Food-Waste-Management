import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLeaf, FaPlus, FaBox, FaTruck, FaSignOutAlt,
  FaCheckCircle, FaClock, FaTimesCircle, FaBell,
  FaCog, FaSearch, FaArrowUp, FaArrowDown, FaEllipsisH,
  FaBoxOpen, FaMapMarkerAlt, FaChartBar, FaRecycle,
  FaThLarge, FaClipboardList, FaExclamationTriangle,
  FaTrash, FaArrowRight,
} from "react-icons/fa";
import { api } from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

/* ── Sample Data ── */
const STATS = [
  { label: "Waste Entries",      value: "12",    suffix: "",    icon: <FaBoxOpen />,   color: "#38bdf8", trend: "+3",   up: true  },
  { label: "Pickup Requests",    value: "8",     suffix: "",    icon: <FaTruck />,     color: "#22c55e", trend: "+2",   up: true  },
  { label: "Completed Pickups",  value: "19",    suffix: "",    icon: <FaCheckCircle />,color:"#4ade80", trend: "+5",   up: true  },
  { label: "Total Donated",      value: "540",   suffix: " kg", icon: <FaRecycle />,   color: "#a78bfa", trend: "+12%", up: true  },
];

const MY_WASTE = [
  { id: "WE-01", type: "Food Waste",  qty: "80 kg",  status: "Available",  date: "Apr 06", desc: "Leftover from catering event" },
  { id: "WE-02", type: "Organic",     qty: "30 kg",  status: "Picked Up",  date: "Apr 05", desc: "Kitchen organic scraps" },
  { id: "WE-03", type: "Paper",       qty: "15 kg",  status: "Available",  date: "Apr 04", desc: "Office paper waste" },
  { id: "WE-04", type: "Plastic",     qty: "10 kg",  status: "Requested",  date: "Apr 04", desc: "Packaging materials" },
  { id: "WE-05", type: "Food Waste",  qty: "120 kg", status: "Picked Up",  date: "Apr 03", desc: "Weekly restaurant surplus" },
];
const formatEntry = (entry) => {
  const rawQty = entry.quantity?.toString() || "0";
  const qty = /[a-zA-Z]/.test(rawQty) ? rawQty : `${rawQty} kg`;
  const date = entry.expiryDate || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const available = entry.isAvailable !== undefined ? entry.isAvailable : entry.available;
  return {
    id: entry.id ? `WE-${entry.id}` : `WE-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    type: entry.foodItemName || "Food Waste",
    desc: entry.description || "",
    qty,
    status: available ? "Available" : "Accepted",
    date,
    raw: entry,
  };
};
const MY_PICKUPS = [
  { id: "PK-101", recycler: "Eco Recycler Co.",  type: "Food Waste", qty: "80 kg",  status: "Pending",    date: "Apr 07", time: "10:00 AM" },
  { id: "PK-102", recycler: "GreenCycle Ltd.",   type: "Organic",    qty: "30 kg",  status: "Completed",  date: "Apr 05", time: "2:00 PM"  },
  { id: "PK-103", recycler: "CleanEarth Inc.",   type: "Paper",      qty: "15 kg",  status: "Scheduled",  date: "Apr 08", time: "9:30 AM"  },
  { id: "PK-104", recycler: "Eco Recycler Co.",  type: "Plastic",    qty: "10 kg",  status: "In Progress",date: "Apr 06", time: "11:00 AM" },
];

const IMPACT = [
  { label: "Carbon Offset",   value: "0.9 T",  icon: "🌿", desc: "CO₂ saved this month"       },
  { label: "Landfill Saved",  value: "98%",    icon: "🏭", desc: "Waste diverted from landfill" },
  { label: "Recyclers Used",  value: "3",      icon: "🤝", desc: "Unique partner recyclers"     },
  { label: "Eco Score",       value: "A+",     icon: "⭐", desc: "Based on your recycling rate" },
];

const WASTE_TYPES = [
  { type: "Food Waste", kg: 200, color: "#22c55e" },
  { type: "Organic",    kg: 130, color: "#84cc16" },
  { type: "Paper",      kg: 90,  color: "#38bdf8" },
  { type: "Plastic",    kg: 70,  color: "#f59e0b" },
  { type: "Mixed",      kg: 50,  color: "#a78bfa" },
];

const STATUS_COLOR = {
  Available:     { bg: "rgba(56,189,248,0.15)",  border: "rgba(56,189,248,0.3)",  text: "#38bdf8", icon: <FaBoxOpen size={10} />    },
  Requested:     { bg: "rgba(245,158,11,0.15)",  border: "rgba(245,158,11,0.3)",  text: "#fbbf24", icon: <FaClock size={10} />      },
  Accepted:      { bg: "rgba(34,197,94,0.15)",   border: "rgba(34,197,94,0.3)",   text: "#4ade80", icon: <FaCheckCircle size={10} />},
  "Picked Up":   { bg: "rgba(34,197,94,0.15)",   border: "rgba(34,197,94,0.3)",   text: "#4ade80", icon: <FaCheckCircle size={10} />},
  Pending:       { bg: "rgba(245,158,11,0.15)",  border: "rgba(245,158,11,0.3)",  text: "#fbbf24", icon: <FaClock size={10} />      },
  Completed:     { bg: "rgba(34,197,94,0.15)",   border: "rgba(34,197,94,0.3)",   text: "#4ade80", icon: <FaCheckCircle size={10} />},
  Scheduled:     { bg: "rgba(56,189,248,0.15)",  border: "rgba(56,189,248,0.3)",  text: "#38bdf8", icon: <FaClock size={10} />      },
  "In Progress": { bg: "rgba(167,139,250,0.15)", border: "rgba(167,139,250,0.3)", text: "#a78bfa", icon: <FaClock size={10} />      },
  Cancelled:     { bg: "rgba(239,68,68,0.15)",   border: "rgba(239,68,68,0.3)",   text: "#f87171", icon: <FaTimesCircle size={10} />},
};

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",      icon: <FaThLarge />      },
  { id: "waste",     label: "My Waste",       icon: <FaBoxOpen />      },
  { id: "pickups",   label: "Pickup Requests",icon: <FaTruck />        },
  { id: "impact",    label: "My Impact",      icon: <FaChartBar />     },
];

/* ── Add Waste Modal ── */
function AddWasteModal({ onClose, onSave }) {
  const [form, setForm] = useState({ type: "", qty: "", desc: "" });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.type || !form.qty) {
      setError("Waste type and quantity are required.");
      return;
    }
    setError("");
    setSaving(true);
    const result = await onSave(form);
    setSaving(false);
    if (result.success) {
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1200);
    } else {
      setError(result.error || "Failed to save waste entry.");
    }
  };

  return (
    <motion.div style={s.modalOverlay}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div style={s.modal}
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }} transition={{ duration: 0.25 }}
      >
        <div style={s.modalGlow} />
        <div style={s.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={s.modalIcon}><FaPlus size={14} color="#071a0e" /></div>
            <h3 style={s.modalTitle}>Add New Waste Entry</h3>
          </div>
          <button onClick={onClose} style={s.closeBtn}><FaTimesCircle size={18} color="#4ade8066" /></button>
        </div>

        <AnimatePresence mode="wait">
          {saved ? (
            <motion.div key="saved" style={{ textAlign: "center", padding: "24px 0" }}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            >
              <FaCheckCircle size={40} color="#22c55e" style={{ marginBottom: "12px" }} />
              <p style={{ color: "#4ade80", fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>Waste entry added!</p>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={s.label}>Waste Type</label>
                <div style={s.inputBox}>
                  <FaRecycle size={12} color="#4ade8066" style={{ flexShrink: 0 }} />
                  <select name="type" value={form.type} onChange={onChange}
                    style={{ flex: 1, border: "none", outline: "none", background: "transparent", color: form.type ? "#e2faf0" : "rgba(134,239,172,0.4)", fontFamily: "'DM Sans',sans-serif", fontSize: "14px" }}>
                    <option value="" disabled>Select waste type</option>
                    {["Food Waste","Organic","Paper","Plastic","Mixed Waste","Electronic"].map(t => (
                      <option key={t} value={t} style={{ background: "#0d2b1a" }}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label style={s.label}>Quantity (kg)</label>
                <div style={s.inputBox}>
                  <FaBoxOpen size={12} color="#4ade8066" style={{ flexShrink: 0 }} />
                  <input name="qty" type="number" placeholder="e.g. 50"
                    value={form.qty} onChange={onChange}
                    style={{ flex: 1, border: "none", outline: "none", background: "transparent", color: "#e2faf0", fontFamily: "'DM Sans',sans-serif", fontSize: "14px" }} />
                </div>
              </div>
              <div>
                <label style={s.label}>Description</label>
                <div style={{ ...s.inputBox, alignItems: "flex-start" }}>
                  <FaClipboardList size={12} color="#4ade8066" style={{ flexShrink: 0, marginTop: 3 }} />
                  <textarea name="desc" placeholder="Brief description of waste..."
                    value={form.desc} onChange={onChange} rows={3}
                    style={{ flex: 1, border: "none", outline: "none", background: "transparent", color: "#e2faf0", fontFamily: "'DM Sans',sans-serif", fontSize: "14px", resize: "none" }} />
                </div>
              </div>
              {error && <div style={s.modalError}>{error}</div>}
              <button type="submit" style={{ ...s.submitBtn, opacity: saving ? 0.75 : 1 }} disabled={saving}>
                {saving ? "Saving..." : "Add Waste Entry"} <FaArrowRight size={12} />
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Component ── */
export default function DonorDashboard() {
  const navigate    = useNavigate();
  const [tab, setTab]       = useState("dashboard");
  const [search, setSearch] = useState("");
  const [sideOpen, setSideOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [wasteEntries, setWasteEntries] = useState(MY_WASTE);

  const user = JSON.parse(localStorage.getItem("user")) || { name: "Donor", role: "donor", userId: null };

  const logout = () => { localStorage.removeItem("user"); navigate("/login"); };

  useEffect(() => {
    const fetchWaste = async () => {
      try {
        const res = await api.get(ENDPOINTS.foodWasteEntry);
        if (Array.isArray(res.data) && res.data.length > 0) {
          const entries = res.data.map(formatEntry);
          setWasteEntries(entries);
        }
      } catch (err) {
        console.error("Failed to load donor waste entries:", err);
      }
    };
    fetchWaste();
    
    // Auto-refresh waste entries every 10 seconds to see status changes
    const interval = setInterval(() => {
      fetchWaste();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSaveWaste = async (formData) => {
    try {
      const payload = {
        donorId: user.userId ? Number(user.userId) : null,
        foodItemName: formData.type,
        description: formData.desc,
        quantity: formData.qty,
        expiryDate: "",
        pickupAddress: "",
        pickupCity: "",
        isAvailable: true,
      };
      const res = await api.post(ENDPOINTS.foodWasteEntry, payload);
      const newEntry = formatEntry(res.data);
      setWasteEntries((prev) => [newEntry, ...prev]);
      return { success: true };
    } catch (err) {
      console.error("Could not save waste entry:", err);
      return { success: false, error: "Unable to add waste entry. Please try again." };
    }
  };

  return (
    <div style={s.shell}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #071a0e; }

        @keyframes bgPulse { 0%,100%{opacity:.35} 50%{opacity:.55} }
        .ambient { animation: bgPulse 8s ease-in-out infinite; }

        .nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 16px; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          color: #86efac; cursor: pointer; transition: all 0.2s;
          border: none; background: transparent; width: 100%; text-align: left;
        }
        .nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .nav-item.active {
          background: linear-gradient(135deg,rgba(34,197,94,0.2),rgba(22,163,74,0.15));
          color: #fff; border: 1px solid rgba(34,197,94,0.25);
        }

        .search-input {
          background: transparent; border: none; outline: none;
          color: #e2faf0; font-family: 'DM Sans', sans-serif; font-size: 13.5px; width: 100%;
        }
        .search-input::placeholder { color: rgba(134,239,172,0.4); }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.2); border-radius: 4px; }

        select option { background: #0d2b1a; color: #e2faf0; }
      `}</style>

      {/* Blobs */}
      <div style={s.bg}>
        <div className="ambient" style={s.blob1} />
        <div className="ambient" style={s.blob2} />
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && <AddWasteModal onClose={() => setShowModal(false)} onSave={handleSaveWaste} />}
      </AnimatePresence>

      {/* ══ SIDEBAR ══ */}
      <motion.aside
        style={{ ...s.sidebar, width: sideOpen ? "240px" : "72px" }}
        animate={{ width: sideOpen ? 240 : 72 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div style={s.sideTop}>
          <div style={s.logoIcon}><FaLeaf size={13} color="#071a0e" /></div>
          <AnimatePresence>
            {sideOpen && (
              <motion.span style={s.logoText}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
              >WasteSys</motion.span>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {sideOpen && (
            <motion.div style={s.roleBadge}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <FaLeaf size={10} color="#4ade80" /> Donor Portal
            </motion.div>
          )}
        </AnimatePresence>

        <div style={s.sideDivider} />

        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <button key={item.id}
              className={`nav-item${tab === item.id ? " active" : ""}`}
              onClick={() => setTab(item.id)} title={!sideOpen ? item.label : ""}
            >
              <span style={{ fontSize: "15px", flexShrink: 0 }}>{item.icon}</span>
              <AnimatePresence>
                {sideOpen && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </nav>

        <div style={s.sideDivider} />

        <button className="nav-item" onClick={logout} style={{ color: "#fca5a5" }} title={!sideOpen ? "Logout" : ""}>
          <span style={{ fontSize: "15px", flexShrink: 0 }}><FaSignOutAlt /></span>
          <AnimatePresence>
            {sideOpen && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>Logout</motion.span>
            )}
          </AnimatePresence>
        </button>

        <button onClick={() => setSideOpen(v => !v)} style={s.collapseBtn}>{sideOpen ? "◀" : "▶"}</button>
      </motion.aside>

      {/* ══ MAIN ══ */}
      <div style={{ ...s.main, marginLeft: sideOpen ? "240px" : "72px" }}>

        {/* TOPBAR */}
        <header style={s.topbar}>
          <div style={s.searchBox}>
            <FaSearch size={13} color="#4ade8066" />
            <input className="search-input" placeholder="Search waste entries, pickups..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Add Waste CTA */}
            <motion.button
              style={s.addBtn} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowModal(true)}
            >
              <FaPlus size={11} /> Add Waste
            </motion.button>
            <div style={s.iconBtn}><FaBell size={15} color="#86efac" /><div style={s.notifDot} /></div>
            <div style={s.iconBtn}><FaCog size={15} color="#86efac" /></div>
            <div style={s.profileChip}>
              <div style={s.avatar}>{user.name?.[0]?.toUpperCase()}</div>
              <div style={{ lineHeight: 1.3 }}>
                <div style={s.profileName}>{user.name}</div>
                <div style={s.profileRole}>Donor</div>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main style={s.content}>
          <AnimatePresence mode="wait">

            {/* ── DASHBOARD ── */}
            {tab === "dashboard" && (
              <motion.div key="dashboard"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
              >
                <div style={s.pageHeader}>
                  <div>
                    <h1 style={s.pageTitle}>Donor Dashboard</h1>
                    <p style={s.pageSub}>Welcome, {user.name}. You've donated <span style={{ color: "#4ade80", fontWeight: 600 }}>540 kg</span> of waste this month.</p>
                  </div>
                  <div style={s.dateBadge}>📅 April 06, 2026</div>
                </div>

                {/* Stats */}
                <div style={s.statsGrid}>
                  {STATS.map((stat, i) => (
                    <motion.div key={stat.label} style={{ ...s.statCard, borderColor: `${stat.color}30` }}
                      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ ...s.statIcon, background: `${stat.color}22`, color: stat.color }}>{stat.icon}</div>
                        <div style={{ ...s.trendBadge, background: "rgba(34,197,94,0.12)", color: "#4ade80" }}>
                          <FaArrowUp size={9} /> {stat.trend}
                        </div>
                      </div>
                      <div style={s.statValue}>{stat.value}<span style={s.statSuffix}>{stat.suffix}</span></div>
                      <div style={s.statLabel}>{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Two col */}
                <div style={s.twoCol}>
                  {/* Recent waste */}
                  <div style={s.panel}>
                    <div style={s.panelHeader}>
                      <h3 style={s.panelTitle}>Recent Waste Entries</h3>
                      <button style={s.viewAllBtn} onClick={() => setTab("waste")}>View All</button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {wasteEntries.slice(0, 4).map((w) => {
                        const sc = STATUS_COLOR[w.status];
                        return (
                          <div key={w.id} style={s.requestRow}>
                            <div style={s.requestId}>{w.id}</div>
                            <div style={{ flex: 1 }}>
                              <div style={s.requestDonor}>{w.type}</div>
                              <div style={s.requestMeta}>{w.desc}</div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                              <div style={{ ...s.statusPill, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>
                                {sc.icon} {w.status}
                              </div>
                              <div style={s.requestDate}>{w.qty}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right col */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Recent pickups */}
                    <div style={s.panel}>
                      <h3 style={{ ...s.panelTitle, marginBottom: "16px" }}>Recent Pickups</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {MY_PICKUPS.slice(0, 3).map((p) => {
                          const sc = STATUS_COLOR[p.status];
                          return (
                            <div key={p.id} style={s.requestRow}>
                              <div style={{ flex: 1 }}>
                                <div style={s.requestDonor}>{p.recycler}</div>
                                <div style={s.requestMeta}>{p.type} · {p.date}</div>
                              </div>
                              <div style={{ ...s.statusPill, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>
                                {sc.icon} {p.status}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick add CTA */}
                    <motion.div style={s.ctaCard} whileHover={{ y: -3, transition: { duration: 0.2 } }}
                      onClick={() => setShowModal(true)}
                    >
                      <div style={s.ctaCardGlow} />
                      <FaPlus size={20} color="#22c55e" style={{ marginBottom: "10px" }} />
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>
                        Add New Waste
                      </div>
                      <div style={{ fontSize: "12px", color: "#86efac", fontWeight: 300 }}>
                        Log waste quickly and request a pickup
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── MY WASTE ── */}
            {tab === "waste" && (
              <motion.div key="waste"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
              >
                <div style={s.pageHeader}>
                  <div>
                    <h1 style={s.pageTitle}>My Waste Entries</h1>
                    <p style={s.pageSub}>All your logged waste ready for collection.</p>
                  </div>
                  <motion.button style={s.addBtn} whileHover={{ scale: 1.04 }} onClick={() => setShowModal(true)}>
                    <FaPlus size={11} /> Add Waste
                  </motion.button>
                </div>

                <div style={s.panel}>
                  <div style={{ ...s.tableRow6, background: "rgba(255,255,255,0.04)", borderRadius: "10px", marginBottom: "8px" }}>
                    {["Entry ID", "Type", "Description", "Quantity", "Status", "Date"].map(h => (
                      <div key={h} style={{ ...s.tableCell, color: "#4ade80", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</div>
                    ))}
                  </div>
                  {wasteEntries
                    .filter(w => search === "" || w.type.toLowerCase().includes(search.toLowerCase()) || w.desc.toLowerCase().includes(search.toLowerCase()))
                    .map((w, i, arr) => {
                      const sc = STATUS_COLOR[w.status];
                      return (
                        <motion.div key={w.id}
                          style={{ ...s.tableRow6, borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25, delay: i * 0.05 }}
                          whileHover={{ background: "rgba(255,255,255,0.02)" }}
                        >
                          <div style={{ ...s.tableCell, color: "#4ade80", fontWeight: 600, fontSize: "13px" }}>{w.id}</div>
                          <div style={{ ...s.tableCell, color: "#e2faf0", fontWeight: 500 }}>{w.type}</div>
                          <div style={{ ...s.tableCell, color: "#86efac", fontSize: "12px" }}>{w.desc}</div>
                          <div style={{ ...s.tableCell, color: "#86efac" }}>{w.qty}</div>
                          <div style={s.tableCell}>
                            <div style={{ ...s.statusPill, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>{sc.icon} {w.status}</div>
                          </div>
                          <div style={{ ...s.tableCell, color: "#86efac", fontSize: "12px" }}>{w.date}</div>
                        </motion.div>
                      );
                    })}
                </div>
              </motion.div>
            )}

            {/* ── PICKUPS ── */}
            {tab === "pickups" && (
              <motion.div key="pickups"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
              >
                <div style={s.pageHeader}>
                  <div>
                    <h1 style={s.pageTitle}>Pickup Requests</h1>
                    <p style={s.pageSub}>Track all your scheduled and completed pickups.</p>
                  </div>
                </div>

                <div style={s.panel}>
                  <div style={{ ...s.tableRow6, background: "rgba(255,255,255,0.04)", borderRadius: "10px", marginBottom: "8px" }}>
                    {["Pickup ID", "Recycler", "Type", "Qty", "Status", "Date & Time"].map(h => (
                      <div key={h} style={{ ...s.tableCell, color: "#4ade80", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</div>
                    ))}
                  </div>
                  {MY_PICKUPS
                    .filter(p => search === "" || p.recycler.toLowerCase().includes(search.toLowerCase()) || p.type.toLowerCase().includes(search.toLowerCase()))
                    .map((p, i) => {
                      const sc = STATUS_COLOR[p.status];
                      return (
                        <motion.div key={p.id}
                          style={{ ...s.tableRow6, borderBottom: i < MY_PICKUPS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25, delay: i * 0.06 }}
                          whileHover={{ background: "rgba(255,255,255,0.02)" }}
                        >
                          <div style={{ ...s.tableCell, color: "#4ade80", fontWeight: 600, fontSize: "13px" }}>{p.id}</div>
                          <div style={{ ...s.tableCell, color: "#e2faf0", fontWeight: 500 }}>{p.recycler}</div>
                          <div style={{ ...s.tableCell, color: "#86efac" }}>{p.type}</div>
                          <div style={{ ...s.tableCell, color: "#86efac" }}>{p.qty}</div>
                          <div style={s.tableCell}>
                            <div style={{ ...s.statusPill, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>{sc.icon} {p.status}</div>
                          </div>
                          <div style={{ ...s.tableCell, color: "#86efac", fontSize: "12px" }}>
                            <FaClock size={9} style={{ marginRight: 5 }} />{p.date} · {p.time}
                          </div>
                        </motion.div>
                      );
                    })}
                </div>

                {/* Pending alert */}
                <div style={{ ...s.alertBox, marginTop: "20px" }}>
                  <FaExclamationTriangle size={16} color="#fbbf24" />
                  <div>
                    <div style={s.alertTitle}>1 Pickup Pending Confirmation</div>
                    <div style={s.alertSub}>PK-101 with Eco Recycler Co. is awaiting recycler confirmation for Apr 07</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── IMPACT ── */}
            {tab === "impact" && (
              <motion.div key="impact"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
              >
                <div style={s.pageHeader}>
                  <div>
                    <h1 style={s.pageTitle}>My Environmental Impact</h1>
                    <p style={s.pageSub}>See the difference your donations are making.</p>
                  </div>
                </div>

                {/* Impact KPIs */}
                <div style={{ ...s.statsGrid, marginBottom: "24px" }}>
                  {IMPACT.map((m, i) => (
                    <motion.div key={m.label} style={s.statCard}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    >
                      <div style={{ fontSize: "28px", marginBottom: "10px" }}>{m.icon}</div>
                      <div style={s.statValue}>{m.value}</div>
                      <div style={s.statLabel}>{m.label}</div>
                      <div style={{ fontSize: "11px", color: "#4ade8055", marginTop: "4px" }}>{m.desc}</div>
                    </motion.div>
                  ))}
                </div>

                <div style={s.twoCol}>
                  {/* Waste breakdown */}
                  <div style={s.panel}>
                    <h3 style={{ ...s.panelTitle, marginBottom: "20px" }}>Waste by Type Donated (kg)</h3>
                    {WASTE_TYPES.map((item, i) => (
                      <div key={item.type} style={{ marginBottom: "14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ fontSize: "13px", color: "#d1fae5", fontFamily: "'DM Sans',sans-serif" }}>{item.type}</span>
                          <span style={{ fontSize: "13px", color: item.color, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>{item.kg} kg</span>
                        </div>
                        <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
                          <motion.div style={{ height: "100%", borderRadius: "4px", background: item.color }}
                            initial={{ width: 0 }} animate={{ width: `${(item.kg / 200) * 100}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Monthly summary */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={s.panel}>
                      <h3 style={{ ...s.panelTitle, marginBottom: "18px" }}>Monthly Summary</h3>
                      {[
                        { label: "Waste Donated",  value: "540 kg", color: "#22c55e" },
                        { label: "Pickups Done",   value: "19",     color: "#38bdf8" },
                        { label: "Recyclers Used", value: "3",      color: "#a78bfa" },
                        { label: "Avg per Pickup", value: "28 kg",  color: "#f59e0b" },
                        { label: "Eco Score",      value: "A+",     color: "#4ade80" },
                      ].map((item) => (
                        <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <span style={{ fontSize: "13px", color: "#86efac", fontFamily: "'DM Sans',sans-serif" }}>{item.label}</span>
                          <span style={{ fontSize: "15px", fontWeight: 700, color: item.color, fontFamily: "'Playfair Display',serif" }}>{item.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Green badge */}
                    <div style={{ ...s.alertBox, background: "rgba(34,197,94,0.07)", borderColor: "rgba(34,197,94,0.25)" }}>
                      <FaLeaf size={16} color="#22c55e" />
                      <div>
                        <div style={{ ...s.alertTitle, color: "#4ade80" }}>Top Contributor 🌿</div>
                        <div style={s.alertSub}>You're in the top 10% of donors this month!</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

/* ── Styles ── */
const s = {
  shell: { minHeight: "100vh", background: "#071a0e", display: "flex", fontFamily: "'DM Sans',sans-serif", color: "#e2faf0", position: "relative", overflow: "hidden" },
  bg: { position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" },
  blob1: { position: "absolute", top: "-10%", right: "10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.14) 0%, transparent 70%)", filter: "blur(60px)" },
  blob2: { position: "absolute", bottom: "0%", left: "20%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)", filter: "blur(50px)" },

  sidebar: { position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100, background: "rgba(7,26,14,0.9)", backdropFilter: "blur(24px)", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", padding: "24px 12px", gap: "8px", overflow: "hidden" },
  sideTop: { display: "flex", alignItems: "center", gap: "10px", padding: "4px", overflow: "hidden" },
  roleBadge: { display: "flex", alignItems: "center", gap: "6px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "50px", padding: "4px 12px", fontSize: "11px", fontWeight: 600, color: "#4ade80", letterSpacing: "0.06em", whiteSpace: "nowrap", fontFamily: "'DM Sans',sans-serif" },
  logoIcon: { width: "32px", height: "32px", borderRadius: "9px", background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 14px rgba(34,197,94,0.3)" },
  logoText: { fontFamily: "'Playfair Display',serif", fontSize: "18px", fontWeight: 700, color: "#fff", whiteSpace: "nowrap" },
  sideDivider: { height: "1px", background: "rgba(255,255,255,0.06)", margin: "8px 0" },
  collapseBtn: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "6px", color: "#4ade80", cursor: "pointer", fontSize: "11px", marginTop: "4px", textAlign: "center" },

  main: { flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative", zIndex: 1, transition: "margin-left 0.3s ease" },

  topbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", background: "rgba(7,26,14,0.7)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 10, gap: "16px" },
  searchBox: { display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "9px 16px", borderRadius: "50px", width: "260px" },
  addBtn: { display: "flex", alignItems: "center", gap: "7px", padding: "9px 18px", borderRadius: "50px", border: "none", background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 14px rgba(34,197,94,0.3)", letterSpacing: "0.03em" },
  iconBtn: { width: "36px", height: "36px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" },
  notifDot: { position: "absolute", top: "8px", right: "8px", width: "7px", height: "7px", borderRadius: "50%", background: "#f87171", border: "1.5px solid #071a0e" },
  profileChip: { display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "6px 14px 6px 6px", borderRadius: "50px" },
  avatar: { width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontSize: "13px", fontWeight: 700, color: "#fff", flexShrink: 0 },
  profileName: { fontSize: "13px", fontWeight: 600, color: "#fff" },
  profileRole: { fontSize: "11px", color: "#4ade80" },

  content: { padding: "32px", flex: 1, overflowY: "auto" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "28px" },
  pageTitle: { fontFamily: "'Playfair Display',serif", fontSize: "28px", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" },
  pageSub: { fontSize: "13px", fontWeight: 300, color: "#86efac", marginTop: "4px" },
  dateBadge: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", padding: "8px 16px", borderRadius: "50px", fontSize: "13px", color: "#86efac" },

  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "16px", marginBottom: "24px" },
  statCard: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "24px", backdropFilter: "blur(16px)", cursor: "default" },
  statIcon: { width: "40px", height: "40px", borderRadius: "11px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", marginBottom: "16px" },
  statValue: { fontFamily: "'Playfair Display',serif", fontSize: "30px", fontWeight: 700, color: "#fff", lineHeight: 1, marginBottom: "6px" },
  statSuffix: { fontSize: "18px", color: "#4ade80" },
  statLabel: { fontSize: "12px", fontWeight: 500, color: "#86efac", letterSpacing: "0.04em" },
  trendBadge: { display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", borderRadius: "50px", fontSize: "11px", fontWeight: 600 },

  twoCol: { display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px", alignItems: "start" },
  panel: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "24px", backdropFilter: "blur(16px)" },
  panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  panelTitle: { fontFamily: "'Playfair Display',serif", fontSize: "17px", fontWeight: 700, color: "#fff" },
  viewAllBtn: { padding: "7px 16px", borderRadius: "50px", border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.08)", color: "#4ade80", fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: 600, cursor: "pointer" },

  requestRow: { display: "flex", alignItems: "center", gap: "14px", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" },
  requestId: { fontSize: "11px", fontWeight: 700, color: "#4ade80", letterSpacing: "0.06em", minWidth: "52px" },
  requestDonor: { fontSize: "13.5px", fontWeight: 500, color: "#e2faf0" },
  requestMeta: { fontSize: "12px", color: "#86efac", marginTop: "2px" },
  requestDate: { fontSize: "11px", color: "#4ade8066" },
  statusPill: { display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "50px", fontSize: "11px", fontWeight: 600, whiteSpace: "nowrap" },

  ctaCard: { background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "20px", padding: "28px 24px", textAlign: "center", cursor: "pointer", position: "relative", overflow: "hidden" },
  ctaCardGlow: { position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%,rgba(34,197,94,0.12) 0%,transparent 70%)", pointerEvents: "none" },

  tableRow6: { display: "grid", gridTemplateColumns: "90px 1fr 1fr 80px 130px 120px", alignItems: "center", padding: "12px 10px", borderRadius: "10px", transition: "background 0.15s" },
  tableCell: { fontSize: "13.5px", fontFamily: "'DM Sans',sans-serif", paddingRight: "10px" },

  alertBox: { display: "flex", alignItems: "center", gap: "12px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "14px", padding: "16px" },
  alertTitle: { fontSize: "13px", fontWeight: 600, color: "#fbbf24", fontFamily: "'DM Sans',sans-serif" },
  alertSub: { fontSize: "12px", color: "#86efac", fontFamily: "'DM Sans',sans-serif", marginTop: "2px" },

  /* Modal */
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" },
  modal: { width: "100%", maxWidth: "460px", background: "rgba(7,26,14,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "32px", position: "relative", overflow: "hidden" },
  modalGlow: { position: "absolute", top: 0, left: 0, right: 0, height: "150px", background: "radial-gradient(ellipse at 50% 0%,rgba(34,197,94,0.14) 0%,transparent 70%)", pointerEvents: "none" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  modalIcon: { width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(34,197,94,0.3)" },
  modalTitle: { fontFamily: "'Playfair Display',serif", fontSize: "20px", fontWeight: 700, color: "#fff" },
  modalError: { color: "#fda4af", background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: "12px", padding: "10px 14px", fontSize: "12px", marginBottom: "12px" },
  closeBtn: { background: "transparent", border: "none", cursor: "pointer", padding: 0, display: "flex" },
  label: { display: "block", fontSize: "11px", fontWeight: 600, color: "#4ade80", letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: "7px" },
  inputBox: { display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "12px 14px", borderRadius: "12px" },
  submitBtn: { width: "100%", padding: "13px", border: "none", borderRadius: "50px", background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 8px 24px rgba(34,197,94,0.3)", letterSpacing: "0.04em" },
};
