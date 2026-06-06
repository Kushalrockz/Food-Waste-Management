import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLeaf, FaRecycle, FaCheck, FaRoute, FaTruck,
  FaSignOutAlt, FaCheckCircle, FaClock, FaTimesCircle,
  FaBell, FaCog, FaSearch, FaArrowUp, FaArrowDown,
  FaEllipsisH, FaBoxOpen, FaMapMarkerAlt, FaChartBar,
  FaExclamationTriangle, FaClipboardList, FaThLarge,
} from "react-icons/fa";
import { api } from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

/* ── Sample Data ── */
const BASE_STATS = [
  { label: "Available Waste",     suffix: "",    icon: <FaBoxOpen />,    color: "#38bdf8", field: "availableWaste"  },
  { label: "Accepted Requests",   suffix: "",    icon: <FaCheck />,      color: "#22c55e", field: "acceptedRequests"  },
  { label: "Completed Today",     suffix: "",    icon: <FaCheckCircle />,color: "#4ade80", field: "completedToday"  },
  { label: "Total Collected",     suffix: " kg", icon: <FaRecycle />,    color: "#a78bfa", field: "totalCollected"  },
];

const ROUTE_STOPS = [
  { stop: 1, donor: "Taj Hotel",     location: "Andheri",  time: "9:00 AM",  status: "Done"    },
  { stop: 2, donor: "Green Café",    location: "Bandra",   time: "10:30 AM", status: "Active"  },
  { stop: 3, donor: "Marina Hotel",  location: "Juhu",     time: "12:00 PM", status: "Pending" },
  { stop: 4, donor: "City School",   location: "Dadar",    time: "2:00 PM",  status: "Pending" },
];

const STATUS_COLOR = {
  Completed:     { bg: "rgba(34,197,94,0.15)",  border: "rgba(34,197,94,0.3)",  text: "#4ade80",  icon: <FaCheckCircle size={10} /> },
  Approved:      { bg: "rgba(34,197,94,0.15)",  border: "rgba(34,197,94,0.3)",  text: "#4ade80",  icon: <FaCheckCircle size={10} /> },
  Rejected:      { bg: "rgba(239,68,68,0.15)",  border: "rgba(239,68,68,0.3)",  text: "#f87171",  icon: <FaTimesCircle size={10} /> },
  "In Progress": { bg: "rgba(167,139,250,0.15)",border: "rgba(167,139,250,0.3)",text: "#a78bfa",  icon: <FaClock size={10} /> },
  Scheduled:     { bg: "rgba(56,189,248,0.15)", border: "rgba(56,189,248,0.3)", text: "#38bdf8",  icon: <FaClock size={10} /> },
  Pending:       { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)", text: "#fbbf24",  icon: <FaClock size={10} /> },
  Cancelled:     { bg: "rgba(239,68,68,0.15)",  border: "rgba(239,68,68,0.3)",  text: "#f87171",  icon: <FaTimesCircle size={10} /> },
  Done:          { bg: "rgba(34,197,94,0.15)",  border: "rgba(34,197,94,0.3)",  text: "#4ade80",  icon: <FaCheckCircle size={10} /> },
  Active:        { bg: "rgba(167,139,250,0.15)",border: "rgba(167,139,250,0.3)",text: "#a78bfa",  icon: <FaClock size={10} /> },
};

const URGENCY_COLOR = {
  High:   { bg: "rgba(239,68,68,0.12)",   text: "#f87171",  border: "rgba(239,68,68,0.25)"   },
  Medium: { bg: "rgba(245,158,11,0.12)",  text: "#fbbf24",  border: "rgba(245,158,11,0.25)"  },
  Low:    { bg: "rgba(34,197,94,0.12)",   text: "#4ade80",  border: "rgba(34,197,94,0.25)"   },
};

const NAV_ITEMS = [
  { id: "dashboard",   label: "Dashboard",       icon: <FaThLarge />      },
  { id: "available",   label: "Available Waste", icon: <FaBoxOpen />      },
  { id: "collections", label: "My Collections",  icon: <FaClipboardList />},
  { id: "route",       label: "Track Route",     icon: <FaRoute />        },
  { id: "analytics",   label: "Analytics",       icon: <FaChartBar />     },
];

export default function RecyclerDashboard() {
  const navigate = useNavigate();
  const [tab, setTab]       = useState("dashboard");
  const [search, setSearch] = useState("");
  const [sideOpen, setSideOpen] = useState(true);
  const [accepted, setAccepted] = useState({});
  const [requests, setRequests] = useState([]);
  const [foodEntries, setFoodEntries] = useState([]);
  const [acceptedFoodEntries, setAcceptedFoodEntries] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const user = JSON.parse(localStorage.getItem("user")) || { name: "Recycler", role: "recycler" };

  const getCollectorName = (collectorId) => {
    const collector = users.find((u) => u.id === collectorId);
    return collector?.name || `Collector #${collectorId || "?"}`;
  };

  const normalizeStatus = (status) => String(status || "PENDING").trim().toUpperCase();

  const getFoodDetails = (foodId) => {
    // First check regular food entries
    const entry = foodEntries.find((e) => e.id === foodId);
    if (entry) {
      return `${entry.foodItemName || "Food Item"} · ${entry.quantity || "—"}`;
    }
    
    // Then check accepted food entries
    const acceptedEntry = acceptedFoodEntries.find((e) => e.id === foodId);
    if (acceptedEntry) {
      return `${acceptedEntry.foodItemName || "Food Item"} · ${acceptedEntry.quantity || "—"}`;
    }
    
    return `Food #${foodId || "?"}`;
  };

  const fetchRequests = async () => {
    setLoadingRequests(true);
    try {
      const res = await api.get(ENDPOINTS.collectionRequest);
      setRequests(res.data || []);
    } catch (error) {
      console.error("Failed to load collection requests:", error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const fetchFoodEntries = async () => {
    try {
      const res = await api.get(ENDPOINTS.foodWasteEntry);
      setFoodEntries(res.data || []);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Failed to load waste entries:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get(ENDPOINTS.user);
      setUsers(res.data || []);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const handleAccept = async (id) => {
    const request = requests.find((item) => item.id === id);
    if (!request) return;

    try {
      const updatedRequest = { ...request, collectionStatus: "APPROVED" };
      const res = await api.put(`${ENDPOINTS.collectionRequest}/${id}`, updatedRequest);
      setRequests((prev) => prev.map((item) => (item.id === id ? res.data : item)));
      setAccepted((prev) => ({ ...prev, [id]: true }));
    } catch (error) {
      console.error("Failed to accept request:", error);
    }
  };

  const handleAcceptFoodEntry = async (entryId) => {
    try {
      const entry = foodEntries.find(e => e.id === entryId);
      if (!entry) return;

      // Mark entry as unavailable (accepted)
      const updatedEntry = { ...entry, isAvailable: false };
      const res = await api.put(`${ENDPOINTS.foodWasteEntry}/${entryId}`, updatedEntry);
      
      // Update food entries state
      setFoodEntries(prev => prev.map(e => e.id === entryId ? res.data : e));
      
      // Add to accepted food entries for My Collections
      const acceptedEntry = {
        ...res.data,
        collectionStatus: "ACCEPTED",
        acceptedDate: new Date().toISOString(),
        recyclerId: user.userId
      };
      setAcceptedFoodEntries(prev => [acceptedEntry, ...prev]);
      
    } catch (error) {
      console.error("Failed to accept food entry:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchFoodEntries();
    fetchUsers();
    
    // Auto-refresh food entries every 10 seconds to see new donor entries
    const interval = setInterval(() => {
      fetchFoodEntries();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const availableWaste = requests.filter((r) => normalizeStatus(r.collectionStatus) === "PENDING");
  const myCollections = [
    ...requests.filter((r) => ["APPROVED", "ACCEPTED", "COMPLETED", "DONE"].includes(normalizeStatus(r.collectionStatus))),
    ...acceptedFoodEntries.map(entry => ({
      id: entry.id,
      collectorId: entry.donorId,
      foodId: entry.id,
      collectionStatus: normalizeStatus(entry.collectionStatus),
      requestDate: entry.acceptedDate,
      pickupDate: entry.acceptedDate,
      type: 'food_entry'
    }))
  ];

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
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
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500;
          color: #86efac; cursor: pointer;
          transition: all 0.2s; border: none; background: transparent;
          width: 100%; text-align: left; letter-spacing: 0.02em;
        }
        .nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .nav-item.active {
          background: linear-gradient(135deg,rgba(34,197,94,0.2),rgba(22,163,74,0.15));
          color: #fff; border: 1px solid rgba(34,197,94,0.25);
        }

        .search-input {
          background: transparent; border: none; outline: none;
          color: #e2faf0; font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; width: 100%;
        }
        .search-input::placeholder { color: rgba(134,239,172,0.4); }

        .accept-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 50px; border: none;
          background: linear-gradient(135deg,#22c55e,#16a34a);
          color: #fff; font-family: 'DM Sans',sans-serif;
          font-size: 12px; font-weight: 600; cursor: pointer;
          box-shadow: 0 4px 12px rgba(34,197,94,0.3);
          transition: transform 0.15s, box-shadow 0.15s;
          letter-spacing: 0.03em;
        }
        .accept-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(34,197,94,0.45); }
        .accepted-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 14px; border-radius: 50px;
          background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25);
          color: #4ade80; font-family: 'DM Sans',sans-serif;
          font-size: 12px; font-weight: 600;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.2); border-radius: 4px; }
      `}</style>

      {/* Blobs */}
      <div style={s.bg}>
        <div className="ambient" style={s.blob1} />
        <div className="ambient" style={s.blob2} />
      </div>

      {/* ══ SIDEBAR ══ */}
      <motion.aside
        style={{ ...s.sidebar, width: sideOpen ? "240px" : "72px" }}
        animate={{ width: sideOpen ? 240 : 72 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Logo */}
        <div style={s.sideTop}>
          <div style={s.logoIcon}><FaLeaf size={13} color="#071a0e" /></div>
          <AnimatePresence>
            {sideOpen && (
              <motion.span style={s.logoText}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
              >
                WasteSys
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Role badge */}
        <AnimatePresence>
          {sideOpen && (
            <motion.div style={s.roleBadge}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <FaRecycle size={10} color="#4ade80" /> Recycler Portal
            </motion.div>
          )}
        </AnimatePresence>

        <div style={s.sideDivider} />

        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-item${tab === item.id ? " active" : ""}`}
              onClick={() => setTab(item.id)}
              title={!sideOpen ? item.label : ""}
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
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button onClick={() => setSideOpen((v) => !v)} style={s.collapseBtn}>
          {sideOpen ? "◀" : "▶"}
        </button>
      </motion.aside>

      {/* ══ MAIN ══ */}
      <div style={{ ...s.main, marginLeft: sideOpen ? "240px" : "72px" }}>

        {/* TOPBAR */}
        <header style={s.topbar}>
          <div style={s.searchBox}>
            <FaSearch size={13} color="#4ade8066" />
            <input className="search-input" placeholder="Search waste, collections..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={s.iconBtn}><FaBell size={15} color="#86efac" /><div style={s.notifDot} /></div>
            <div style={s.iconBtn}><FaCog size={15} color="#86efac" /></div>
            <div style={s.profileChip}>
              <div style={s.avatar}>{user.name?.[0]?.toUpperCase()}</div>
              <div style={{ lineHeight: 1.3 }}>
                <div style={s.profileName}>{user.name}</div>
                <div style={s.profileRole}>Recycler</div>
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
                    <h1 style={s.pageTitle}>Recycler Dashboard</h1>
                    <p style={s.pageSub}>Good morning, {user.name}. You have {availableWaste.length} waste requests available.</p>
                  </div>
                  <div style={s.dateBadge}>📅 April 06, 2026</div>
                </div>

                {/* Stats */}
                <div style={s.statsGrid}>
                  {BASE_STATS.map((stat, i) => {
                    let value = "0";
                    if (stat.field === "availableWaste") value = String(foodEntries.filter(e => e.isAvailable !== false).length);
                    else if (stat.field === "acceptedRequests") value = String(myCollections.length);
                    else if (stat.field === "completedToday") value = String(requests.filter(r => r.collectionStatus === "COMPLETED" || r.collectionStatus === "DONE").length);
                    else if (stat.field === "totalCollected") value = "860";
                    
                    return (
                      <motion.div key={stat.label} style={{ ...s.statCard, borderColor: `${stat.color}30` }}
                        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ ...s.statIcon, background: `${stat.color}22`, color: stat.color }}>{stat.icon}</div>
                        </div>
                        <div style={s.statValue}>{value}<span style={s.statSuffix}>{stat.suffix}</span></div>
                        <div style={s.statLabel}>{stat.label}</div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Two columns */}
                <div style={s.twoCol}>
                  {/* Top available waste */}
                  <div style={s.panel}>
                    <div style={s.panelHeader}>
                      <h3 style={s.panelTitle}>Top Available Food Waste</h3>
                      <button style={s.viewAllBtn} onClick={() => setTab("available")}>View All</button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {foodEntries.filter(e => e.isAvailable !== false).slice(0, 4).map((entry) => {
                        const donor = users.find(u => u.id === entry.donorId) || { name: `Donor #${entry.donorId}` };
                        return (
                          <div key={entry.id} style={s.requestRow}>
                            <div style={s.requestId}>{entry.id}</div>
                            <div style={{ flex: 1 }}>
                              <div style={s.requestDonor}>{donor.name}</div>
                              <div style={s.requestMeta}><FaBoxOpen size={9} style={{ marginRight: 4 }} />{entry.foodItemName || "Food Waste"}</div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                              <div style={{ ...s.statusPill, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", color: "#4ade80" }}>
                                Available
                              </div>
                              <div style={s.requestDate}>{entry.quantity || "—"}</div>
                            </div>
                          </div>
                        );
                      })}
                      {foodEntries.filter(e => e.isAvailable !== false).length === 0 && (
                        <div style={{ padding: "12px", textAlign: "center", color: "#86efac", fontSize: "13px" }}>
                          No food waste available
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right column */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Today's route */}
                    <div style={s.panel}>
                      <h3 style={{ ...s.panelTitle, marginBottom: "16px" }}>Today's Route</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {ROUTE_STOPS.slice(0, 3).map((stop) => {
                          const sc = STATUS_COLOR[stop.status];
                          return (
                            <div key={stop.stop} style={s.routeRow}>
                              <div style={{ ...s.stopNum, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                                {stop.stop}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={s.requestDonor}>{stop.donor}</div>
                                <div style={s.requestMeta}>{stop.location} · {stop.time}</div>
                              </div>
                              <div style={{ ...s.statusPill, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>
                                {sc.icon} {stop.status}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Alert */}
                    <div style={s.alertBox}>
                      <FaExclamationTriangle size={16} color="#fbbf24" />
                      <div>
                        <div style={s.alertTitle}>2 High-Urgency Pickups</div>
                        <div style={s.alertSub}>Taj Hotel & Marina Hotel need urgent collection</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── AVAILABLE WASTE ── */}
            {tab === "available" && (
              <motion.div key="available"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
              >
                <div style={s.pageHeader}>
                  <div>
                    <h1 style={s.pageTitle}>Available Waste</h1>
                    <p style={s.pageSub}>Browse and accept waste collection requests and donor entries near you.</p>
                     <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", marginTop: "12px" }}>
                       {loadingRequests && <span style={{ color: "#38bdf8", fontSize: "12px" }}>Refreshing requests…</span>}
                       <span style={s.dateBadge}>Last refresh: {lastRefresh.toLocaleTimeString()}</span>
                     </div>
                   </div>
                 </div>
                <div style={s.panel}>
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={s.panelTitle}>Available Food Waste Entries</h3>
                    <p style={{ fontSize: "12px", color: "#86efac", marginTop: "6px" }}>Waste entries added by donors</p>
                  </div>
                  <div style={{ ...s.tableRow4, background: "rgba(255,255,255,0.04)", borderRadius: "10px", marginBottom: "8px" }}>
                    {["Entry ID", "Donor", "Food Item", "Qty", "Accept"].map((h) => (
                      <div key={h} style={{ ...s.tableCell, color: "#4ade80", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</div>
                    ))}
                  </div>
                  {foodEntries && foodEntries.length > 0 ? (
                    foodEntries
                      .filter(entry => entry.isAvailable !== false && (search === "" || 
                        (entry.foodItemName && entry.foodItemName.toLowerCase().includes(search.toLowerCase())) ||
                        (entry.description && entry.description.toLowerCase().includes(search.toLowerCase())) ||
                        (users.find(u => u.id === entry.donorId)?.name || "").toLowerCase().includes(search.toLowerCase())))
                      .map((entry, i) => {
                        const donor = users.find(u => u.id === entry.donorId) || { name: `Donor #${entry.donorId}` };
                        return (
                          <motion.div key={entry.id} style={{ ...s.tableRow4, borderBottom: i < Math.min(foodEntries.length - 1, 20) ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25, delay: i * 0.05 }}
                            whileHover={{ background: "rgba(255,255,255,0.02)" }}
                          >
                            <div style={{ ...s.tableCell, color: "#4ade80", fontWeight: 600, fontSize: "13px" }}>{entry.id}</div>
                            <div style={{ ...s.tableCell, color: "#e2faf0", fontWeight: 500 }}>{donor.name}</div>
                            <div style={{ ...s.tableCell, color: "#86efac" }}>{entry.foodItemName || "—"}</div>
                            <div style={{ ...s.tableCell, color: "#86efac" }}>{entry.quantity || "—"}</div>
                            <div style={s.tableCell}>
                              <button className="accept-btn" onClick={() => handleAcceptFoodEntry(entry.id)}><FaCheck size={10} /> Accept</button>
                            </div>
                          </motion.div>
                        );
                      })
                  ) : (
                    <div style={{ padding: "20px", textAlign: "center", color: "#86efac", fontSize: "14px" }}>
                      No waste entries available at the moment.
                    </div>
                  )}
                </div>

                <div style={s.panel}>
                  {/* Table header */}
                  <div style={{ ...s.tableRow7, background: "rgba(255,255,255,0.04)", borderRadius: "10px", marginBottom: "8px" }}>
                    {["Request ID", "Collector", "Food", "Status", "Requested", "Pickup", "Action"].map((h) => (
                      <div key={h} style={{ ...s.tableCell, color: "#4ade80", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</div>
                    ))}
                  </div>

                  {availableWaste
                    .filter(w => search === "" || getCollectorName(w.collectorId).toLowerCase().includes(search.toLowerCase()) || getFoodDetails(w.foodId).toLowerCase().includes(search.toLowerCase()))
                    .map((w, i) => {
                      const statusKey = normalizeStatus(w.collectionStatus || w.status || "PENDING");
                      const readableStatus = statusKey.charAt(0).toUpperCase() + statusKey.slice(1).toLowerCase();
                      const sc = STATUS_COLOR[readableStatus] || STATUS_COLOR.Pending;
                      const isAccepted = accepted[w.id] || normalizeStatus(w.collectionStatus) === "APPROVED";
                      return (
                        <motion.div key={w.id} style={{ ...s.tableRow7, borderBottom: i < availableWaste.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25, delay: i * 0.05 }}
                          whileHover={{ background: "rgba(255,255,255,0.02)" }}
                        >
                          <div style={{ ...s.tableCell, color: "#4ade80", fontWeight: 600, fontSize: "13px" }}>{w.id}</div>
                          <div style={{ ...s.tableCell, color: "#e2faf0", fontWeight: 500 }}>{getCollectorName(w.collectorId)}</div>
                          <div style={{ ...s.tableCell, color: "#86efac" }}>{getFoodDetails(w.foodId)}</div>
                          <div style={{ ...s.tableCell, color: sc.text, background: sc.bg, borderRadius: "999px", padding: "6px 10px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            {sc.icon} {readableStatus}
                          </div>
                          <div style={{ ...s.tableCell, color: "#86efac", fontSize: "12px" }}>{w.requestDate || "—"}</div>
                          <div style={{ ...s.tableCell, color: "#86efac", fontSize: "12px" }}>{w.pickupDate || "—"}</div>
                          <div style={s.tableCell}>
                            {isAccepted
                              ? <div className="accepted-badge"><FaCheckCircle size={10} /> Accepted</div>
                              : <button className="accept-btn" onClick={() => handleAccept(w.id)}><FaCheck size={10} /> Accept</button>
                            }
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              </motion.div>
            )}

            {/* ── MY COLLECTIONS ── */}
            {tab === "collections" && (
              <motion.div key="collections"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
              >
                <div style={s.pageHeader}>
                  <div>
                    <h1 style={s.pageTitle}>My Collections</h1>
                    <p style={s.pageSub}>Track all your accepted and completed collections.</p>
                  </div>
                </div>

                <div style={s.panel}>
                  <div style={{ ...s.tableRow6, background: "rgba(255,255,255,0.04)", borderRadius: "10px", marginBottom: "8px" }}>
                    {["Collection ID", "Collector", "Food", "Requested", "Status", "Pickup"].map((h) => (
                      <div key={h} style={{ ...s.tableCell, color: "#4ade80", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</div>
                    ))}
                  </div>
                  {myCollections
                    .filter(c => search === "" || getCollectorName(c.collectorId).toLowerCase().includes(search.toLowerCase()) || getFoodDetails(c.foodId).toLowerCase().includes(search.toLowerCase()))
                    .map((c, i) => {
                      const statusKey = normalizeStatus(c.collectionStatus || c.status);
                      const sc = STATUS_COLOR[statusKey] || STATUS_COLOR.Pending;
                      const readableStatus = statusKey.charAt(0).toUpperCase() + statusKey.slice(1).toLowerCase();
                      return (
                        <motion.div key={c.id} style={{ ...s.tableRow6, borderBottom: i < myCollections.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25, delay: i * 0.06 }}
                          whileHover={{ background: "rgba(255,255,255,0.02)" }}
                        >
                          <div style={{ ...s.tableCell, color: "#4ade80", fontWeight: 600, fontSize: "13px" }}>{c.id}</div>
                          <div style={{ ...s.tableCell, color: "#e2faf0", fontWeight: 500 }}>{getCollectorName(c.collectorId)}</div>
                          <div style={{ ...s.tableCell, color: "#86efac" }}>{getFoodDetails(c.foodId)}</div>
                          <div style={{ ...s.tableCell, color: "#86efac", fontSize: "12px" }}>{c.requestDate || "—"}</div>
                          <div style={s.tableCell}>
                            <div style={{ ...s.statusPill, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>{sc.icon} {readableStatus}</div>
                          </div>
                          <div style={{ ...s.tableCell, color: "#86efac", fontSize: "12px" }}>{c.pickupDate || "—"}</div>
                        </motion.div>
                      );
                    })}
                </div>
              </motion.div>
            )}

            {/* ── ROUTE TRACKING ── */}
            {tab === "route" && (
              <motion.div key="route"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
              >
                <div style={s.pageHeader}>
                  <div>
                    <h1 style={s.pageTitle}>Track Collection Route</h1>
                    <p style={s.pageSub}>Today's optimized pickup schedule across all stops.</p>
                  </div>
                  <div style={s.dateBadge}>🚛 4 Stops Today</div>
                </div>

                <div style={s.twoCol}>
                  {/* Stop cards */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {ROUTE_STOPS.map((stop, i) => {
                      const sc = STATUS_COLOR[stop.status];
                      return (
                        <motion.div key={stop.stop} style={{ ...s.panel, display: "flex", alignItems: "center", gap: "18px", padding: "20px 24px", borderColor: `${sc.text}22` }}
                          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          whileHover={{ y: -3, transition: { duration: 0.2 } }}
                        >
                          {/* Step number */}
                          <div style={{ ...s.bigStopNum, background: sc.bg, border: `2px solid ${sc.border}`, color: sc.text }}>
                            {stop.stop}
                          </div>
                          {/* Connector line */}
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                <div style={s.requestDonor}>{stop.donor}</div>
                                <div style={{ ...s.requestMeta, marginTop: "4px" }}>
                                  <FaMapMarkerAlt size={10} style={{ marginRight: 5 }} />{stop.location}
                                </div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ ...s.statusPill, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>{sc.icon} {stop.status}</div>
                                <div style={{ ...s.requestMeta, marginTop: "6px" }}><FaClock size={9} style={{ marginRight: 4 }} />{stop.time}</div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Route summary */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={s.panel}>
                      <h3 style={{ ...s.panelTitle, marginBottom: "18px" }}>Route Summary</h3>
                      {[
                        { label: "Total Stops",      value: "4",       icon: <FaMapMarkerAlt size={13} />, color: "#38bdf8" },
                        { label: "Completed",        value: "1",       icon: <FaCheckCircle size={13} />,  color: "#22c55e" },
                        { label: "Remaining",        value: "3",       icon: <FaClock size={13} />,        color: "#f59e0b" },
                        { label: "Est. Total Waste", value: "455 kg",  icon: <FaBoxOpen size={13} />,      color: "#a78bfa" },
                        { label: "Est. Completion",  value: "3:30 PM", icon: <FaRoute size={13} />,        color: "#4ade80" },
                      ].map((item) => (
                        <div key={item.label} style={s.summaryRow}>
                          <div style={{ color: item.color, display: "flex", alignItems: "center" }}>{item.icon}</div>
                          <span style={{ flex: 1, fontSize: "13px", color: "#86efac", fontFamily: "'DM Sans',sans-serif" }}>{item.label}</span>
                          <span style={{ fontSize: "14px", fontWeight: 600, color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>{item.value}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ ...s.alertBox, borderColor: "rgba(56,189,248,0.25)", background: "rgba(56,189,248,0.07)" }}>
                      <FaTruck size={16} color="#38bdf8" />
                      <div>
                        <div style={{ ...s.alertTitle, color: "#38bdf8" }}>Next Stop: Green Café</div>
                        <div style={s.alertSub}>Bandra · ETA 10:30 AM · 45 kg organic</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── ANALYTICS ── */}
            {tab === "analytics" && (
              <motion.div key="analytics"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
              >
                <div style={s.pageHeader}>
                  <div>
                    <h1 style={s.pageTitle}>My Analytics</h1>
                    <p style={s.pageSub}>Your personal impact metrics and performance overview.</p>
                  </div>
                </div>

                <div style={{ ...s.statsGrid, marginBottom: "24px" }}>
                  {[
                    { label: "Carbon Saved",     value: "1.8 T",  icon: "🌿", desc: "CO₂ equivalent this month" },
                    { label: "Collections Done", value: "21",     icon: "✅", desc: "Total completed this month" },
                    { label: "Avg Pickup Speed", value: "1.8 hr", icon: "⏱", desc: "Request to collection time" },
                    { label: "Waste Recycled",   value: "860 kg", icon: "♻️", desc: "Total this month" },
                  ].map((m, i) => (
                    <motion.div key={m.label} style={s.statCard}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <div style={{ fontSize: "28px", marginBottom: "10px" }}>{m.icon}</div>
                      <div style={s.statValue}>{m.value}</div>
                      <div style={s.statLabel}>{m.label}</div>
                      <div style={{ fontSize: "11px", color: "#4ade8055", marginTop: "4px" }}>{m.desc}</div>
                    </motion.div>
                  ))}
                </div>

                <div style={s.twoCol}>
                  <div style={s.panel}>
                    <h3 style={{ ...s.panelTitle, marginBottom: "20px" }}>Collection Status Breakdown</h3>
                    {[
                      { label: "Completed",   pct: 67, color: "#22c55e" },
                      { label: "Scheduled",   pct: 14, color: "#38bdf8" },
                      { label: "In Progress", pct: 10, color: "#a78bfa" },
                      { label: "Pending",     pct: 9,  color: "#f59e0b" },
                    ].map((item, i) => (
                      <div key={item.label} style={{ marginBottom: "14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ fontSize: "13px", color: "#d1fae5", fontFamily: "'DM Sans',sans-serif" }}>{item.label}</span>
                          <span style={{ fontSize: "13px", color: item.color, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>{item.pct}%</span>
                        </div>
                        <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
                          <motion.div style={{ height: "100%", borderRadius: "4px", background: item.color }}
                            initial={{ width: 0 }} animate={{ width: `${item.pct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={s.panel}>
                    <h3 style={{ ...s.panelTitle, marginBottom: "20px" }}>Waste Types Collected (kg)</h3>
                    {[
                      { type: "Food Waste", kg: 380, color: "#22c55e" },
                      { type: "Organic",    kg: 220, color: "#84cc16" },
                      { type: "Paper",      kg: 140, color: "#38bdf8" },
                      { type: "Plastic",    kg: 80,  color: "#f59e0b" },
                      { type: "Mixed",      kg: 40,  color: "#a78bfa" },
                    ].map((item, i) => (
                      <div key={item.type} style={{ marginBottom: "14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ fontSize: "13px", color: "#d1fae5", fontFamily: "'DM Sans',sans-serif" }}>{item.type}</span>
                          <span style={{ fontSize: "13px", color: item.color, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>{item.kg} kg</span>
                        </div>
                        <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
                          <motion.div style={{ height: "100%", borderRadius: "4px", background: item.color }}
                            initial={{ width: 0 }} animate={{ width: `${(item.kg / 380) * 100}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    ))}
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
  shell: {
    minHeight: "100vh", background: "#071a0e",
    display: "flex", fontFamily: "'DM Sans', sans-serif",
    color: "#e2faf0", position: "relative", overflow: "hidden",
  },
  bg: { position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" },
  blob1: {
    position: "absolute", top: "-10%", right: "10%",
    width: "500px", height: "500px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(34,197,94,0.14) 0%, transparent 70%)",
    filter: "blur(60px)",
  },
  blob2: {
    position: "absolute", bottom: "0%", left: "20%",
    width: "400px", height: "400px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)",
    filter: "blur(50px)",
  },

  sidebar: {
    position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100,
    background: "rgba(7,26,14,0.9)", backdropFilter: "blur(24px)",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    display: "flex", flexDirection: "column",
    padding: "24px 12px", gap: "8px", overflow: "hidden",
  },
  sideTop: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "4px", overflow: "hidden",
  },
  roleBadge: {
    display: "flex", alignItems: "center", gap: "6px",
    background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)",
    borderRadius: "50px", padding: "4px 12px",
    fontSize: "11px", fontWeight: "600", color: "#4ade80",
    letterSpacing: "0.06em", whiteSpace: "nowrap",
    fontFamily: "'DM Sans', sans-serif",
  },
  logoIcon: {
    width: "32px", height: "32px", borderRadius: "9px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, boxShadow: "0 4px 14px rgba(34,197,94,0.3)",
  },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "18px", fontWeight: "700", color: "#fff", whiteSpace: "nowrap",
  },
  sideDivider: { height: "1px", background: "rgba(255,255,255,0.06)", margin: "8px 0" },
  collapseBtn: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px", padding: "6px", color: "#4ade80",
    cursor: "pointer", fontSize: "11px", marginTop: "4px", textAlign: "center",
  },

  main: { flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative", zIndex: 1, transition: "margin-left 0.3s ease" },

  topbar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 32px",
    background: "rgba(7,26,14,0.7)", backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    position: "sticky", top: 0, zIndex: 10, gap: "16px",
  },
  searchBox: {
    display: "flex", alignItems: "center", gap: "10px",
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    padding: "9px 16px", borderRadius: "50px", width: "280px",
  },
  iconBtn: {
    width: "36px", height: "36px", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", position: "relative",
  },
  notifDot: {
    position: "absolute", top: "8px", right: "8px",
    width: "7px", height: "7px", borderRadius: "50%",
    background: "#f87171", border: "1.5px solid #071a0e",
  },
  profileChip: {
    display: "flex", alignItems: "center", gap: "10px",
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    padding: "6px 14px 6px 6px", borderRadius: "50px",
  },
  avatar: {
    width: "30px", height: "30px", borderRadius: "50%",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Playfair Display', serif", fontSize: "13px", fontWeight: "700",
    color: "#fff", flexShrink: 0,
  },
  profileName: { fontSize: "13px", fontWeight: "600", color: "#fff" },
  profileRole: { fontSize: "11px", color: "#4ade80" },

  content: { padding: "32px", flex: 1, overflowY: "auto" },

  pageHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    flexWrap: "wrap", gap: "12px", marginBottom: "28px",
  },
  pageTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "28px", fontWeight: "700", color: "#fff", letterSpacing: "-0.02em",
  },
  pageSub: { fontSize: "13px", fontWeight: "300", color: "#86efac", marginTop: "4px" },
  dateBadge: {
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
    padding: "8px 16px", borderRadius: "50px", fontSize: "13px", color: "#86efac",
  },

  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" },
  statCard: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px", padding: "24px", backdropFilter: "blur(16px)", cursor: "default",
  },
  statIcon: { width: "40px", height: "40px", borderRadius: "11px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", marginBottom: "16px" },
  statValue: { fontFamily: "'Playfair Display', serif", fontSize: "30px", fontWeight: "700", color: "#fff", lineHeight: "1", marginBottom: "6px" },
  statSuffix: { fontSize: "18px", color: "#4ade80" },
  statLabel: { fontSize: "12px", fontWeight: "500", color: "#86efac", letterSpacing: "0.04em" },
  trendBadge: { display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", borderRadius: "50px", fontSize: "11px", fontWeight: "600" },

  twoCol: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) 340px", gap: "20px", alignItems: "start" },

  panel: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "24px", backdropFilter: "blur(16px)" },
  panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", gap: "12px" },
  panelTitle: { fontFamily: "'Playfair Display', serif", fontSize: "17px", fontWeight: "700", color: "#fff" },
  viewAllBtn: {
    padding: "7px 16px", borderRadius: "50px", border: "1px solid rgba(34,197,94,0.3)",
    background: "rgba(34,197,94,0.08)", color: "#4ade80",
    fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: "600",
    cursor: "pointer",
  },

  requestRow: { display: "flex", alignItems: "center", gap: "14px", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" },
  requestId: { fontSize: "11px", fontWeight: "700", color: "#4ade80", letterSpacing: "0.06em", minWidth: "60px" },
  requestDonor: { fontSize: "13.5px", fontWeight: "500", color: "#e2faf0" },
  requestMeta: { fontSize: "12px", color: "#86efac", marginTop: "2px", display: "flex", alignItems: "center", flexWrap: "wrap" },
  requestDate: { fontSize: "11px", color: "#4ade8066" },
  statusPill: { display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "50px", fontSize: "11px", fontWeight: "600", whiteSpace: "nowrap" },

  routeRow: { display: "flex", alignItems: "center", gap: "12px", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" },
  stopNum: { width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "12px", flexShrink: 0 },
  bigStopNum: { width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontWeight: "700", fontSize: "18px", flexShrink: 0 },

  summaryRow: { display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" },

  tableRow7: { display: "grid", gridTemplateColumns: "90px minmax(180px, 1.6fr) 120px 100px 150px 110px 110px", alignItems: "center", padding: "12px 10px", borderRadius: "10px", transition: "background 0.15s", gridGap: "10px" },
  tableRow6: { display: "grid", gridTemplateColumns: "100px minmax(180px, 1.6fr) 120px 90px 140px 90px", alignItems: "center", padding: "12px 10px", borderRadius: "10px", transition: "background 0.15s", gridGap: "10px" },
  tableRow4: { display: "grid", gridTemplateColumns: "100px minmax(180px, 1.6fr) 140px 100px 120px", alignItems: "center", padding: "12px 10px", borderRadius: "10px", transition: "background 0.15s", gridGap: "10px" },
  tableCell: { fontSize: "13.5px", fontFamily: "'DM Sans', sans-serif", paddingRight: "10px", minWidth: 0, maxWidth: "100%", wordBreak: "break-word", whiteSpace: "normal", overflowWrap: "break-word" },

  alertBox: { display: "flex", alignItems: "center", gap: "12px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "14px", padding: "16px" },
  alertTitle: { fontSize: "13px", fontWeight: "600", color: "#fbbf24", fontFamily: "'DM Sans', sans-serif" },
  alertSub: { fontSize: "12px", color: "#86efac", fontFamily: "'DM Sans', sans-serif", marginTop: "2px" },
};
