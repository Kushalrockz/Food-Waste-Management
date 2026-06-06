import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLeaf, FaUsers, FaTruck, FaRecycle, FaChartBar,
  FaSignOutAlt, FaCheckCircle, FaClock, FaTimesCircle,
  FaBoxOpen, FaMapMarkerAlt, FaBell, FaCog, FaSearch,
  FaArrowUp, FaArrowDown, FaEllipsisH, FaUserCircle,
  FaTachometerAlt, FaClipboardList, FaExclamationTriangle,
} from "react-icons/fa";
import { api } from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

/* ── sample data ── */
const STATS = [
  { label: "Total Users",        value: "248",   suffix: "",    icon: <FaUsers />,    color: "#38bdf8", trend: "+12%", up: true },
  { label: "Active Collections", value: "64",    suffix: "",    icon: <FaTruck />,    color: "#22c55e", trend: "+8%",  up: true },
  { label: "Waste Managed",      value: "1,240", suffix: " kg", icon: <FaRecycle />,  color: "#a78bfa", trend: "+23%", up: true },
  { label: "Pending Requests",   value: "17",    suffix: "",    icon: <FaClipboardList />, color: "#f59e0b", trend: "-5%", up: false },
];

const STATUS_COLOR = {
  Done:          { bg: "rgba(34,197,94,0.15)",  border: "rgba(34,197,94,0.3)",  text: "#4ade80",  icon: <FaCheckCircle size={10} /> },
  Approved:      { bg: "rgba(34,197,94,0.15)",  border: "rgba(34,197,94,0.3)",  text: "#4ade80",  icon: <FaCheckCircle size={10} /> },
  Rejected:      { bg: "rgba(239,68,68,0.15)",  border: "rgba(239,68,68,0.3)",  text: "#f87171",  icon: <FaTimesCircle size={10} /> },
  Pending:       { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)", text: "#fbbf24",  icon: <FaClock size={10} /> },
  Scheduled:     { bg: "rgba(56,189,248,0.15)", border: "rgba(56,189,248,0.3)", text: "#38bdf8",  icon: <FaClock size={10} /> },
  "In Progress": { bg: "rgba(167,139,250,0.15)",border: "rgba(167,139,250,0.3)",text: "#a78bfa",  icon: <FaClock size={10} /> },
  Cancelled:     { bg: "rgba(239,68,68,0.15)",  border: "rgba(239,68,68,0.3)",  text: "#f87171",  icon: <FaTimesCircle size={10} /> },
};

const ROLE_COLOR = {
  donor:    { bg: "rgba(56,189,248,0.15)",  text: "#38bdf8" },
  recycler: { bg: "rgba(34,197,94,0.15)",   text: "#4ade80" },
  admin:    { bg: "rgba(167,139,250,0.15)", text: "#a78bfa" },
};

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",    icon: <FaTachometerAlt /> },
  { id: "requests",  label: "Requests",     icon: <FaClipboardList /> },
  { id: "users",     label: "Users",        icon: <FaUsers /> },
  { id: "analytics", label: "Analytics",   icon: <FaChartBar /> },
];

const REQUEST_FILTERS = ["All", "PENDING", "APPROVED", "REJECTED"];

export default function AdminDashboard() {
  const navigate    = useNavigate();
  const [tab, setTab]         = useState("dashboard");
  const [search, setSearch]   = useState("");
  const [sideOpen, setSideOpen] = useState(true);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [requestFilter, setRequestFilter] = useState("All");
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // Quick action modals
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [showAddWaste, setShowAddWaste] = useState(false);
  const [showRouteMap, setShowRouteMap] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || { name: "Admin", role: "admin" };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch = search === "" ||
      String(r.id).toLowerCase().includes(search.toLowerCase()) ||
      String(r.collectorId).toLowerCase().includes(search.toLowerCase()) ||
      String(r.foodId).toLowerCase().includes(search.toLowerCase()) ||
      String(r.collectionStatus).toLowerCase().includes(search.toLowerCase());

    const matchesFilter = requestFilter === "All" || r.collectionStatus === requestFilter;
    return matchesSearch && matchesFilter;
  });

  const recentRequests = requests.slice(-4).reverse();

  const requestLabel = (value) => {
    if (!value) return "Pending";
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
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

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get(ENDPOINTS.user);
      setUsers(res.data || []);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      const request = requests.find((item) => item.id === id);
      if (!request) return;
      const updated = { ...request, collectionStatus: status };
      const res = await api.put(`${ENDPOINTS.collectionRequest}/${id}`, updated);
      setRequests((prev) => prev.map((item) => (item.id === id ? res.data : item)));
    } catch (error) {
      console.error("Failed to update request status:", error);
    }
  };

  const deleteRequest = async (id) => {
    try {
      await api.delete(`${ENDPOINTS.collectionRequest}/${id}`);
      setRequests((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete request:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`${ENDPOINTS.user}/${id}`);
      setUsers((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchUsers();
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Quick Action Handlers
  const handleNewRequest = async (formData) => {
    try {
      const payload = {
        collectorId: formData.collectorId,
        foodId: formData.foodId,
        collectionStatus: "PENDING",
        requestDate: new Date().toISOString(),
        pickupDate: formData.pickupDate,
      };
      await api.post(ENDPOINTS.collectionRequest, payload);
      fetchRequests(); // Refresh the list
      return { success: true };
    } catch (error) {
      console.error("Failed to create request:", error);
      return { success: false, error: "Failed to create collection request" };
    }
  };

  const handleAddWaste = async (formData) => {
    try {
      const payload = {
        donorId: formData.donorId,
        foodItemName: formData.foodItemName,
        description: formData.description,
        quantity: formData.quantity,
        expiryDate: formData.expiryDate,
        pickupAddress: formData.pickupAddress,
        pickupCity: formData.pickupCity,
        isAvailable: true,
      };
      await api.post(ENDPOINTS.foodWasteEntry, payload);
      // Refresh collection requests to reflect new waste entry
      fetchRequests();
      return { success: true };
    } catch (error) {
      console.error("Failed to add waste:", error);
      return { success: false, error: "Failed to add waste entry" };
    }
  };

  const handleGenerateReport = () => {
    const now = new Date();
    const reportDate = now.toLocaleDateString();
    const reportTime = now.toLocaleTimeString();

    // Comprehensive data analysis
    const userStats = {
      total: users.length,
      donors: users.filter(u => u.role === 'donor').length,
      recyclers: users.filter(u => u.role === 'recycler').length,
      admins: users.filter(u => u.role === 'admin').length,
    };

    const requestStats = {
      total: requests.length,
      pending: requests.filter(r => r.collectionStatus === "PENDING").length,
      approved: requests.filter(r => r.collectionStatus === "APPROVED").length,
      rejected: requests.filter(r => r.collectionStatus === "REJECTED").length,
      completed: requests.filter(r => r.collectionStatus === "DONE").length,
      inProgress: requests.filter(r => r.collectionStatus === "In Progress").length,
      scheduled: requests.filter(r => r.collectionStatus === "Scheduled").length,
      cancelled: requests.filter(r => r.collectionStatus === "Cancelled").length,
    };

    // Time-based analysis (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const recentRequests = requests.filter(r => {
      const requestDate = new Date(r.requestDate);
      return requestDate >= thirtyDaysAgo;
    });

    const recentStats = {
      requests: recentRequests.length,
      completed: recentRequests.filter(r => r.collectionStatus === "DONE").length,
      completionRate: recentRequests.length > 0 ?
        ((recentRequests.filter(r => r.collectionStatus === "DONE").length / recentRequests.length) * 100).toFixed(1) : 0,
    };

    // System health metrics
    const systemHealth = {
      activeUsers: users.filter(u => u.role !== 'admin').length,
      pendingActions: requestStats.pending + requestStats.approved,
      completionRate: requestStats.total > 0 ?
        ((requestStats.completed / requestStats.total) * 100).toFixed(1) : 0,
      avgRequestsPerUser: userStats.donors > 0 ?
        (requestStats.total / userStats.donors).toFixed(1) : 0,
    };

    // Generate comprehensive report
    const reportContent = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                           WASTE MANAGEMENT SYSTEM REPORT                     ║
║                           ${reportDate} - ${reportTime}                       ║
╚══════════════════════════════════════════════════════════════════════════════╝

📊 EXECUTIVE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Users: ${userStats.total} | Donors: ${userStats.donors} | Recyclers: ${userStats.recyclers} | Admins: ${userStats.admins}
Total Requests: ${requestStats.total} | System Health: ${systemHealth.completionRate}% Completion Rate

🔍 USER ANALYTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Total Registered Users: ${userStats.total}
  └─ Donors: ${userStats.donors} (${userStats.total > 0 ? ((userStats.donors/userStats.total)*100).toFixed(1) : 0}%)
  └─ Recyclers: ${userStats.recyclers} (${userStats.total > 0 ? ((userStats.recyclers/userStats.total)*100).toFixed(1) : 0}%)
  └─ Administrators: ${userStats.admins} (${userStats.total > 0 ? ((userStats.admins/userStats.total)*100).toFixed(1) : 0}%)

📋 REQUEST MANAGEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Total Collection Requests: ${requestStats.total}
• Status Breakdown:
  └─ Pending: ${requestStats.pending} (${requestStats.total > 0 ? ((requestStats.pending/requestStats.total)*100).toFixed(1) : 0}%)
  └─ Approved: ${requestStats.approved} (${requestStats.total > 0 ? ((requestStats.approved/requestStats.total)*100).toFixed(1) : 0}%)
  └─ In Progress: ${requestStats.inProgress} (${requestStats.total > 0 ? ((requestStats.inProgress/requestStats.total)*100).toFixed(1) : 0}%)
  └─ Completed: ${requestStats.completed} (${requestStats.total > 0 ? ((requestStats.completed/requestStats.total)*100).toFixed(1) : 0}%)
  └─ Rejected: ${requestStats.rejected} (${requestStats.total > 0 ? ((requestStats.rejected/requestStats.total)*100).toFixed(1) : 0}%)
  └─ Scheduled: ${requestStats.scheduled} (${requestStats.total > 0 ? ((requestStats.scheduled/requestStats.total)*100).toFixed(1) : 0}%)
  └─ Cancelled: ${requestStats.cancelled} (${requestStats.total > 0 ? ((requestStats.cancelled/requestStats.total)*100).toFixed(1) : 0}%)

📈 PERFORMANCE METRICS (Last 30 Days)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Recent Requests: ${recentStats.requests}
• Recent Completions: ${recentStats.completed}
• Completion Rate: ${recentStats.completionRate}%
• Average Requests per Donor: ${systemHealth.avgRequestsPerUser}

🎯 SYSTEM HEALTH INDICATORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Active Users (Non-Admin): ${systemHealth.activeUsers}
• Pending Actions: ${systemHealth.pendingActions}
• Overall Completion Rate: ${systemHealth.completionRate}%
• System Efficiency: ${parseFloat(systemHealth.completionRate) >= 80 ? 'EXCELLENT' : parseFloat(systemHealth.completionRate) >= 60 ? 'GOOD' : 'NEEDS IMPROVEMENT'}

📅 DETAILED REQUEST LOG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${requests.slice(0, 10).map((r, i) =>
  `${String(i+1).padStart(2, '0')}. ID:${r.id} | Collector:${r.collectorId || 'Unassigned'} | Food:${r.foodId || 'N/A'} | Status:${r.collectionStatus} | Date:${r.requestDate ? new Date(r.requestDate).toLocaleDateString() : 'N/A'}`
).join('\n')}

${requests.length > 10 ? `\n... and ${requests.length - 10} more requests` : ''}

⚙️  SYSTEM INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Report Generated: ${now.toISOString()}
• Data Source: WasteSys Database
• Report Version: 2.0
• Generated By: Admin Dashboard

═══════════════════════════════════════════════════════════════════════════════
                            END OF REPORT
═══════════════════════════════════════════════════════════════════════════════
`.trim();

    // Create and download the report
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wastesys-comprehensive-report-${now.toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Also generate CSV version for data analysis
    const csvHeaders = ['ID', 'Collector ID', 'Food ID', 'Status', 'Request Date', 'Pickup Date'];
    const csvData = [
      csvHeaders.join(','),
      ...requests.map(r => [
        r.id,
        r.collectorId || 'Unassigned',
        r.foodId || 'N/A',
        r.collectionStatus,
        r.requestDate || '',
        r.pickupDate || ''
      ].join(','))
    ].join('\n');

    const csvBlob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    const csvUrl = URL.createObjectURL(csvBlob);
    const csvLink = document.createElement('a');
    csvLink.href = csvUrl;
    csvLink.download = `wastesys-data-export-${now.toISOString().split('T')[0]}.csv`;
    document.body.appendChild(csvLink);
    csvLink.click();
    document.body.removeChild(csvLink);
    URL.revokeObjectURL(csvUrl);
  };

  return (
    <div style={s.shell}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #071a0e; }

        @keyframes bgPulse { 0%,100%{opacity:.35} 50%{opacity:.55} }
        .ambient { animation: bgPulse 8s ease-in-out infinite; }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

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
          background: linear-gradient(135deg, rgba(34,197,94,0.2), rgba(22,163,74,0.15));
          color: #fff; border: 1px solid rgba(34,197,94,0.25);
        }
        .nav-item.active svg { color: #4ade80; }

        .search-input {
          background: transparent; border: none; outline: none;
          color: #e2faf0; font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; width: 100%;
        }
        .search-input::placeholder { color: rgba(134,239,172,0.4); }

        .tab-btn {
          padding: 8px 20px; border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent; color: #86efac;
        }
        .tab-btn.active {
          background: linear-gradient(135deg,#22c55e,#16a34a);
          color: #fff; border-color: transparent;
          box-shadow: 0 4px 14px rgba(34,197,94,0.3);
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.2); border-radius: 4px; }
      `}</style>

      {/* Ambient blobs */}
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
              <motion.span
                style={s.logoText}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                WasteSys
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div style={s.sideDivider} />

        {/* Nav */}
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
                  <motion.span
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </nav>

        <div style={s.sideDivider} />

        {/* Logout */}
        <button
          className="nav-item"
          onClick={logout}
          style={{ color: "#fca5a5" }}
          title={!sideOpen ? "Logout" : ""}
        >
          <span style={{ fontSize: "15px", flexShrink: 0 }}><FaSignOutAlt /></span>
          <AnimatePresence>
            {sideOpen && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setSideOpen((v) => !v)}
          style={s.collapseBtn}
          title={sideOpen ? "Collapse" : "Expand"}
        >
          {sideOpen ? "◀" : "▶"}
        </button>
      </motion.aside>

      {/* ══ MAIN ══ */}
      <div style={s.main}>

        {/* TOP BAR */}
        <header style={s.topbar}>
          {/* Search */}
          <div style={s.searchBox}>
            <FaSearch size={13} color="#4ade8066" />
            <input
              className="search-input"
              placeholder="Search requests, users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Notification */}
            <div style={s.iconBtn}>
              <FaBell size={15} color="#86efac" />
              <div style={s.notifDot} />
            </div>

            {/* Settings */}
            <div style={s.iconBtn}>
              <FaCog size={15} color="#86efac" />
            </div>

            {/* Profile */}
            <div style={s.profileChip}>
              <div style={s.avatar}>{user.name?.[0]?.toUpperCase()}</div>
              <div style={{ lineHeight: 1.3 }}>
                <div style={s.profileName}>{user.name}</div>
                <div style={s.profileRole}>Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {/* ══ CONTENT ══ */}
        <main style={s.content}>
          <AnimatePresence mode="wait">

            {/* ── DASHBOARD TAB ── */}
            {tab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
              >
                {/* Page heading */}
                <div style={s.pageHeader}>
                  <div>
                    <h1 style={s.pageTitle}>Dashboard Overview</h1>
                    <p style={s.pageSub}>Welcome back, {user.name}. Here's what's happening today.</p>
                  </div>
                  <div style={s.dateBadge}>📅 April 06, 2026</div>
                </div>

                {/* STAT CARDS */}
                <div style={s.statsGrid}>
                  {STATS.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      style={{ ...s.statCard, borderColor: `${stat.color}30` }}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ ...s.statIcon, background: `${stat.color}22`, color: stat.color }}>
                          {stat.icon}
                        </div>
                        <div style={{
                          ...s.trendBadge,
                          background: stat.up ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                          color: stat.up ? "#4ade80" : "#f87171",
                        }}>
                          {stat.up ? <FaArrowUp size={9} /> : <FaArrowDown size={9} />}
                          {stat.trend}
                        </div>
                      </div>
                      <div style={s.statValue}>{stat.value}<span style={s.statSuffix}>{stat.suffix}</span></div>
                      <div style={s.statLabel}>{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* RECENT REQUESTS + QUICK ACTIONS */}
                <div style={s.twoCol}>
                  {/* Recent Requests */}
                  <div style={s.panel}>
                    <div style={s.panelHeader}>
                      <h3 style={s.panelTitle}>Recent Collection Requests</h3>
                      <motion.button 
                        className="tab-btn active" 
                        onClick={() => setTab("requests")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View All
                      </motion.button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {recentRequests.length > 0 ? recentRequests.map((r, index) => {
                        const sc = STATUS_COLOR[requestLabel(r.collectionStatus)];
                        return (
                          <motion.div 
                            key={r.id} 
                            style={s.requestRow}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ background: "rgba(255,255,255,0.02)", scale: 1.01 }}
                          >
                            <div style={s.requestId}>#{r.id}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={s.requestDonor}>
                                Collector: {r.collectorId || "Unassigned"}
                              </div>
                              <div style={s.requestMeta}>
                                Food ID: {r.foodId || "N/A"} • Status: {requestLabel(r.collectionStatus)}
                              </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                              <div style={{ ...s.statusPill, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>
                                {sc.icon} {requestLabel(r.collectionStatus)}
                              </div>
                              <div style={s.requestDate}>
                                {r.requestDate ? new Date(r.requestDate).toLocaleDateString() : "No date"}
                              </div>
                            </div>
                          </motion.div>
                        );
                      }) : (
                        <div style={{ 
                          padding: "40px 20px", 
                          textAlign: "center", 
                          color: "#86efac",
                          fontSize: "14px"
                        }}>
                          <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.5 }}>📋</div>
                          No recent collection requests
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions + Alerts */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Quick Actions */}
                    <div style={s.panel}>
                      <div style={s.panelHeader}>
                        <h3 style={s.panelTitle}>Quick Actions</h3>
                        <div style={{ fontSize: "11px", color: "#4ade80", background: "rgba(34,197,94,0.1)", padding: "4px 8px", borderRadius: "12px", border: "1px solid rgba(34,197,94,0.2)" }}>
                          ⚡ Instant Access
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                        {[
                          { 
                            label: "New Collection Request", 
                            icon: <FaTruck size={16} />, 
                            color: "#22c55e", 
                            bgColor: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(22,163,74,0.05))",
                            borderColor: "rgba(34,197,94,0.3)",
                            action: () => setShowNewRequest(true),
                            desc: "Create pickup request"
                          },
                          { 
                            label: "Add Waste Entry",        
                            icon: <FaBoxOpen size={16} />, 
                            color: "#38bdf8", 
                            bgColor: "linear-gradient(135deg, rgba(56,189,248,0.1), rgba(14,165,233,0.05))",
                            borderColor: "rgba(56,189,248,0.3)",
                            action: () => setShowAddWaste(true),
                            desc: "Record new donation"
                          },
                          { 
                            label: "View Route Map",         
                            icon: <FaMapMarkerAlt size={16} />, 
                            color: "#f59e0b", 
                            bgColor: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(217,119,6,0.05))",
                            borderColor: "rgba(245,158,11,0.3)",
                            action: () => setShowRouteMap(true),
                            desc: "Track active routes"
                          },
                          { 
                            label: "Generate Report",        
                            icon: <FaChartBar size={16} />, 
                            color: "#a78bfa", 
                            bgColor: "linear-gradient(135deg, rgba(167,139,250,0.1), rgba(139,92,246,0.05))",
                            borderColor: "rgba(167,139,250,0.3)",
                            action: () => setShowReport(true),
                            desc: "Download analytics"
                          },
                        ].map((a, index) => (
                          <motion.button 
                            key={a.label} 
                            style={{ 
                              ...s.quickBtn, 
                              background: a.bgColor,
                              borderColor: a.borderColor,
                              position: "relative",
                              overflow: "hidden"
                            }} 
                            onClick={a.action}
                            whileHover={{ 
                              scale: 1.02, 
                              boxShadow: `0 8px 25px ${a.color}20`,
                              transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div style={{ 
                              position: "absolute", 
                              top: 0, 
                              right: 0, 
                              width: "60px", 
                              height: "60px", 
                              background: `radial-gradient(circle, ${a.color}15 0%, transparent 70%)`,
                              borderRadius: "50%",
                              transform: "translate(20px, -20px)"
                            }} />
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative", zIndex: 1 }}>
                              <div style={{ 
                                width: "40px", 
                                height: "40px", 
                                borderRadius: "12px",
                                background: `${a.color}20`,
                                border: `1px solid ${a.color}30`,
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center",
                                color: a.color,
                                boxShadow: `0 4px 12px ${a.color}15`
                              }}>
                                {a.icon}
                              </div>
                              <div style={{ textAlign: "left", flex: 1 }}>
                                <div style={{ ...s.quickLabel, fontSize: "14px", fontWeight: "600", marginBottom: "2px" }}>{a.label}</div>
                                <div style={{ fontSize: "11px", color: `${a.color}80`, fontWeight: "400" }}>{a.desc}</div>
                              </div>
                              <FaArrowUp size={12} style={{ 
                                transform: "rotate(45deg)", 
                                color: `${a.color}60`, 
                                transition: "all 0.2s",
                                marginLeft: "auto"
                              }} />
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Alert */}
                    <div style={s.alertBox}>
                      <FaExclamationTriangle size={16} color="#fbbf24" />
                      <div>
                        <div style={s.alertTitle}>17 Pending Requests</div>
                        <div style={s.alertSub}>Require attention before end of day</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── REQUESTS TAB ── */}
            {tab === "requests" && (
              <motion.div
                key="requests"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
              >
                <div style={s.pageHeader}>
                  <div>
                    <h1 style={s.pageTitle}>Collection Requests</h1>
                    <p style={s.pageSub}>Manage and track all waste collection entries.</p>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {REQUEST_FILTERS.map((filter) => (
                      <button
                        key={filter}
                        className={`tab-btn${requestFilter === filter ? " active" : ""}`}
                        style={{ fontSize: "12px", padding: "6px 14px" }}
                        onClick={() => setRequestFilter(filter)}
                      >
                        {filter === "All" ? "All" : requestLabel(filter)}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={s.panel}>
                  {/* Table header */}
                  <div style={{ 
                    ...s.tableRow, 
                    background: "rgba(255,255,255,0.04)", 
                    borderRadius: "10px", 
                    marginBottom: "8px",
                    padding: "12px 16px",
                    minWidth: "fit-content"
                  }}>
                    {[
                      { label: "Tracking #", width: "100px" },
                      { label: "Collector", width: "150px" },
                      { label: "Food Item", width: "120px" },
                      { label: "Status", width: "110px" },
                      { label: "Requested", width: "100px" },
                      { label: "Pickup", width: "100px" },
                      { label: "Action", width: "120px" }
                    ].map((h) => (
                      <div key={h.label} style={{ 
                        ...s.tableCell, 
                        color: "#4ade80", 
                        fontSize: "11px", 
                        fontWeight: 600, 
                        letterSpacing: "0.08em", 
                        textTransform: "uppercase",
                        minWidth: h.width,
                        flexShrink: 0
                      }}>
                        {h.label}
                      </div>
                    ))}
                  </div>
                  
                  {/* Table content with horizontal scroll */}
                  <div style={{ overflowX: "auto", borderRadius: "10px" }}>
                    <div style={{ minWidth: "900px" }}>
                      {filteredRequests.map((r, i) => {
                        const sc = STATUS_COLOR[requestLabel(r.collectionStatus)];
                        return (
                          <motion.div
                            key={r.id}
                            style={{ 
                              ...s.tableRow, 
                              borderBottom: i < filteredRequests.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                              padding: "14px 16px",
                              alignItems: "center"
                            }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25, delay: i * 0.05 }}
                            whileHover={{ background: "rgba(255,255,255,0.02)" }}
                          >
                            <div style={{ ...s.tableCell, color: "#4ade80", fontWeight: 600, fontSize: "13px", minWidth: "100px", flexShrink: 0 }}>
                              #{r.id}
                            </div>
                            <div style={{ ...s.tableCell, color: "#e2faf0", fontWeight: 500, minWidth: "150px", flexShrink: 0 }}>
                              {r.collectorId || "Unassigned"}
                            </div>
                            <div style={{ ...s.tableCell, color: "#86efac", minWidth: "120px", flexShrink: 0 }}>
                              {r.foodId || "N/A"}
                            </div>
                            <div style={{ ...s.tableCell, minWidth: "110px", flexShrink: 0 }}>
                              <div style={{ ...s.statusPill, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>
                                {sc.icon} {requestLabel(r.collectionStatus)}
                              </div>
                            </div>
                            <div style={{ ...s.tableCell, color: "#86efac", fontSize: "12px", minWidth: "100px", flexShrink: 0 }}>
                              {r.requestDate ? new Date(r.requestDate).toLocaleDateString() : "—"}
                            </div>
                            <div style={{ ...s.tableCell, color: "#86efac", fontSize: "12px", minWidth: "100px", flexShrink: 0 }}>
                              {r.pickupDate ? new Date(r.pickupDate).toLocaleDateString() : "—"}
                            </div>
                            <div style={{ ...s.tableCell, minWidth: "120px", flexShrink: 0 }}>
                              {r.collectionStatus === "PENDING" ? (
                                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                  <motion.button 
                                    style={{ ...s.actionBtn, fontSize: "11px", padding: "6px 10px" }} 
                                    onClick={() => updateRequestStatus(r.id, "APPROVED")}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Approve
                                  </motion.button>
                                  <motion.button 
                                    style={{ ...s.actionBtn, ...s.dangerBtn, fontSize: "11px", padding: "6px 10px" }} 
                                    onClick={() => updateRequestStatus(r.id, "REJECTED")}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Reject
                                  </motion.button>
                                </div>
                              ) : (
                                <motion.button 
                                  style={s.moreBtn} 
                                  onClick={() => deleteRequest(r.id)} 
                                  title="Remove request"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <FaEllipsisH size={12} color="#4ade80" />
                                </motion.button>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {filteredRequests.length === 0 && !loadingRequests && (
                    <div style={{ 
                      padding: "40px 20px", 
                      color: "#86efac", 
                      textAlign: "center",
                      fontSize: "14px"
                    }}>
                      <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.5 }}>📋</div>
                      No collection requests found for this filter.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── USERS TAB ── */}
            {tab === "users" && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
              >
                <div style={s.pageHeader}>
                  <div>
                    <h1 style={s.pageTitle}>User Management</h1>
                    <p style={s.pageSub}>Manage donors, recyclers, and team members.</p>
                  </div>
                </div>

                <div style={s.panel}>
                  <div style={{ ...s.tableRow, background: "rgba(255,255,255,0.04)", borderRadius: "10px", marginBottom: "8px" }}>
                    {["User", "Email", "Role", "Status", ""].map((h) => (
                      <div key={h} style={{ ...s.tableCell, color: "#4ade80", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</div>
                    ))}
                  </div>
                  {users
                    .filter(u => search === "" || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
                    .map((u, i) => {
                      const rc = ROLE_COLOR[u.role] || ROLE_COLOR.donor;
                      const status = u.role ? "Active" : "Inactive";
                      return (
                        <motion.div
                          key={u.id || u.email}
                          style={{ ...s.tableRow, borderBottom: i < users.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25, delay: i * 0.06 }}
                          whileHover={{ background: "rgba(255,255,255,0.02)" }}
                        >
                          <div style={{ ...s.tableCell, display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ ...s.avatar, width: "32px", height: "32px", fontSize: "14px" }}>{u.name?.[0] || "U"}</div>
                            <span style={{ color: "#e2faf0", fontWeight: 500, fontSize: "14px" }}>{u.name || "Unknown"}</span>
                          </div>
                          <div style={{ ...s.tableCell, color: "#86efac", fontSize: "13px" }}>{u.email || "—"}</div>
                          <div style={s.tableCell}>
                            <div style={{ ...s.statusPill, background: rc.bg, color: rc.text, border: `1px solid ${rc.text}30`, textTransform: "capitalize" }}>
                              {u.role || "user"}
                            </div>
                          </div>
                          <div style={s.tableCell}>
                            <div style={{
                              ...s.statusPill,
                              background: status === "Active" ? "rgba(34,197,94,0.12)" : "rgba(100,100,100,0.15)",
                              color: status === "Active" ? "#4ade80" : "#9ca3af",
                              border: `1px solid ${status === "Active" ? "rgba(34,197,94,0.25)" : "rgba(100,100,100,0.2)"}`,
                            }}>
                              {status === "Active" ? <FaCheckCircle size={9} /> : <FaTimesCircle size={9} />} {status}
                            </div>
                          </div>
                          <div style={s.tableCell}>
                            <button style={{ ...s.moreBtn, ...s.dangerBtn }} onClick={() => deleteUser(u.id)} title="Delete user"><FaEllipsisH size={12} color="#4ade80" /></button>
                          </div>
                        </motion.div>
                      );
                    })}
                  {users.length === 0 && !loadingUsers && (
                    <div style={{ padding: "18px 12px", color: "#94a3b8", textAlign: "center" }}>
                      No users found. Use registration to add a new account.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── ANALYTICS TAB ── */}
            {tab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
              >
                <div style={s.pageHeader}>
                  <div>
                    <h1 style={s.pageTitle}>Analytics</h1>
                    <p style={s.pageSub}>Track performance metrics and environmental impact.</p>
                  </div>
                </div>

                {/* Summary cards */}
                <div style={{ ...s.statsGrid, marginBottom: "24px" }}>
                  {[
                    { label: "Carbon Saved",    value: "3.2 T",  icon: "🌿", desc: "CO₂ equivalent this month" },
                    { label: "Avg Pickup Time", value: "2.4 hr", icon: "⏱", desc: "From request to collection" },
                    { label: "Donor Growth",    value: "+18%",   icon: "📈", desc: "New donors this quarter" },
                    { label: "Waste Diverted",  value: "94%",    icon: "♻️", desc: "From landfill this month" },
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

                {/* Status distribution */}
                <div style={s.twoCol}>
                  <div style={s.panel}>
                    <h3 style={{ ...s.panelTitle, marginBottom: "20px" }}>Request Status Breakdown</h3>
                    {[
                      { label: "Done",        pct: 52, color: "#22c55e" },
                      { label: "Pending",     pct: 20, color: "#f59e0b" },
                      { label: "Scheduled",   pct: 16, color: "#38bdf8" },
                      { label: "In Progress", pct: 8,  color: "#a78bfa" },
                      { label: "Cancelled",   pct: 4,  color: "#f87171" },
                    ].map((item, i) => (
                      <div key={item.label} style={{ marginBottom: "14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ fontSize: "13px", color: "#d1fae5", fontFamily: "'DM Sans',sans-serif" }}>{item.label}</span>
                          <span style={{ fontSize: "13px", color: item.color, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>{item.pct}%</span>
                        </div>
                        <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
                          <motion.div
                            style={{ height: "100%", borderRadius: "4px", background: item.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.pct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={s.panel}>
                    <h3 style={{ ...s.panelTitle, marginBottom: "20px" }}>Waste by Type (kg)</h3>
                    {[
                      { type: "Food Waste",  kg: 480, color: "#22c55e" },
                      { type: "Organic",     kg: 310, color: "#84cc16" },
                      { type: "Paper",       kg: 220, color: "#38bdf8" },
                      { type: "Plastic",     kg: 150, color: "#f59e0b" },
                      { type: "Mixed",       kg: 80,  color: "#a78bfa" },
                    ].map((item, i) => (
                      <div key={item.type} style={{ marginBottom: "14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ fontSize: "13px", color: "#d1fae5", fontFamily: "'DM Sans',sans-serif" }}>{item.type}</span>
                          <span style={{ fontSize: "13px", color: item.color, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>{item.kg} kg</span>
                        </div>
                        <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
                          <motion.div
                            style={{ height: "100%", borderRadius: "4px", background: item.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.kg / 480) * 100}%` }}
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

      {/* Quick Action Modals */}
      {showNewRequest && <NewRequestModal onClose={() => setShowNewRequest(false)} onSave={handleNewRequest} users={users} />}
      {showAddWaste && <AddWasteModal onClose={() => setShowAddWaste(false)} onSave={handleAddWaste} users={users} />}
      {showRouteMap && <RouteMapModal onClose={() => setShowRouteMap(false)} requests={requests} />}
      {showReport && <ReportModal onClose={() => setShowReport(false)} onGenerate={handleGenerateReport} />}
    </div>
  );
}

/* ── Quick Action Modals ── */

// New Collection Request Modal
function NewRequestModal({ onClose, onSave, users }) {
  const [form, setForm] = useState({ collectorId: "", foodId: "", pickupDate: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.collectorId || !form.foodId) {
      setError("Please fill all required fields");
      return;
    }
    setError("");
    setSaving(true);
    const result = await onSave(form);
    setSaving(false);
    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
  };

  return (
    <motion.div style={s.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div style={s.modalContent} initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
        <div style={s.modalGlow} />
        <div style={s.modalHeader}>
          <h3 style={s.modalTitle}>New Collection Request</h3>
          <motion.button 
            onClick={onClose} 
            style={s.modalClose}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            ×
          </motion.button>
        </div>
        <form onSubmit={handleSubmit} style={s.modalForm}>
          <div style={s.formGroup}>
            <label style={s.formLabel}>Collector</label>
            <select 
              value={form.collectorId} 
              onChange={(e) => setForm({ ...form, collectorId: e.target.value })}
              style={s.formSelect}
              required
            >
              <option value="">Select Collector</option>
              {users.filter(u => u.role === 'recycler').map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          <div style={s.formGroup}>
            <label style={s.formLabel}>Food Item ID</label>
            <input 
              type="text" 
              value={form.foodId} 
              onChange={(e) => setForm({ ...form, foodId: e.target.value })}
              style={s.formInput}
              placeholder="Enter food item ID"
              required
            />
          </div>
          <div style={s.formGroup}>
            <label style={s.formLabel}>Pickup Date</label>
            <input 
              type="date" 
              value={form.pickupDate} 
              onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
              style={s.formInput}
            />
          </div>
          {error && (
            <motion.div 
              style={{ 
                color: "#f87171", 
                fontSize: "14px", 
                textAlign: "center",
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.2)",
                borderRadius: "8px",
                padding: "12px"
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}
        </form>
        <div style={s.modalActions}>
          <motion.button 
            type="button" 
            onClick={onClose} 
            style={s.modalBtnSecondary}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
          <motion.button 
            type="submit" 
            onClick={handleSubmit}
            style={{ ...s.modalBtnPrimary, opacity: saving ? 0.7 : 1 }}
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {saving ? "Creating..." : "Create Request"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Add Waste Entry Modal
function AddWasteModal({ onClose, onSave, users }) {
  const [form, setForm] = useState({ 
    donorId: "", 
    foodItemName: "", 
    description: "", 
    quantity: "", 
    expiryDate: "",
    pickupAddress: "",
    pickupCity: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.donorId || !form.foodItemName || !form.quantity) {
      setError("Please fill all required fields");
      return;
    }
    setError("");
    setSaving(true);
    const result = await onSave(form);
    setSaving(false);
    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
  };

  return (
    <motion.div style={s.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div style={s.modalContent} initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
        <div style={s.modalGlow} />
        <div style={s.modalHeader}>
          <h3 style={s.modalTitle}>Add Waste Entry</h3>
          <motion.button 
            onClick={onClose} 
            style={s.modalClose}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            ×
          </motion.button>
        </div>
        <form onSubmit={handleSubmit} style={s.modalForm}>
          <div style={s.formGroup}>
            <label style={s.formLabel}>Donor</label>
            <select 
              value={form.donorId} 
              onChange={(e) => setForm({ ...form, donorId: e.target.value })}
              style={s.formSelect}
              required
            >
              <option value="">Select Donor</option>
              {users.filter(u => u.role === 'donor').map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          <div style={s.formGroup}>
            <label style={s.formLabel}>Food Item Name</label>
            <input 
              type="text" 
              value={form.foodItemName} 
              onChange={(e) => setForm({ ...form, foodItemName: e.target.value })}
              style={s.formInput}
              placeholder="e.g. Rice, Vegetables"
              required
            />
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ ...s.formGroup, flex: 1 }}>
              <label style={s.formLabel}>Quantity (kg)</label>
              <input 
                type="number" 
                value={form.quantity} 
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                style={s.formInput}
                placeholder="e.g. 50"
                required
              />
            </div>
            <div style={{ ...s.formGroup, flex: 1 }}>
              <label style={s.formLabel}>Expiry Date</label>
              <input 
                type="date" 
                value={form.expiryDate} 
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                style={s.formInput}
              />
            </div>
          </div>
          <div style={s.formGroup}>
            <label style={s.formLabel}>Description</label>
            <textarea 
              value={form.description} 
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={s.formTextarea}
              placeholder="Brief description of the waste"
            />
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ ...s.formGroup, flex: 1 }}>
              <label style={s.formLabel}>Pickup Address</label>
              <input 
                type="text" 
                value={form.pickupAddress} 
                onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
                style={s.formInput}
                placeholder="Street address"
              />
            </div>
            <div style={{ ...s.formGroup, flex: 1 }}>
              <label style={s.formLabel}>City</label>
              <input 
                type="text" 
                value={form.pickupCity} 
                onChange={(e) => setForm({ ...form, pickupCity: e.target.value })}
                style={s.formInput}
                placeholder="City name"
              />
            </div>
          </div>
          {error && (
            <motion.div 
              style={{ 
                color: "#f87171", 
                fontSize: "14px", 
                textAlign: "center",
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.2)",
                borderRadius: "8px",
                padding: "12px"
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}
        </form>
        <div style={s.modalActions}>
          <motion.button 
            type="button" 
            onClick={onClose} 
            style={s.modalBtnSecondary}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
          <motion.button 
            type="submit" 
            onClick={handleSubmit}
            style={{ ...s.modalBtnPrimary, opacity: saving ? 0.7 : 1 }}
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {saving ? "Adding..." : "Add Waste Entry"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Route Map Modal
function RouteMapModal({ onClose, requests }) {
  const activeRoutes = requests.filter(r => r.collectionStatus === "APPROVED" || r.collectionStatus === "In Progress");

  return (
    <motion.div style={s.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div style={s.modalContent} initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
        <div style={s.modalGlow} />
        <div style={s.modalHeader}>
          <h3 style={s.modalTitle}>Active Routes</h3>
          <motion.button 
            onClick={onClose} 
            style={s.modalClose}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            ×
          </motion.button>
        </div>
        <div style={{ padding: "32px" }}>
          {activeRoutes.length > 0 ? (
            <>
              <div style={s.routeMap}>
                <div style={s.routeMapBg} />
                <div style={s.routeMapContent}>
                  <div style={s.routeMapIcon}>🗺️</div>
                  <div style={s.routeMapText}>Interactive Route Map</div>
                  <div style={s.routeMapSubtext}>Real-time tracking of active collection routes</div>
                </div>
              </div>
              <div style={{ marginTop: "24px" }}>
                <h4 style={{ 
                  fontSize: "18px", 
                  fontWeight: "600", 
                  color: "#fff", 
                  marginBottom: "16px",
                  fontFamily: "'DM Sans', sans-serif"
                }}>
                  Active Routes ({activeRoutes.length})
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {activeRoutes.map((route, i) => (
                    <motion.div 
                      key={route.id} 
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        padding: "16px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "12px",
                        position: "relative",
                        overflow: "hidden"
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #22c55e, #16a34a)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: "16px",
                        fontWeight: "700",
                        flexShrink: 0
                      }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontWeight: "600", 
                          color: "#e2faf0",
                          fontSize: "16px",
                          marginBottom: "4px"
                        }}>
                          Request #{route.id}
                        </div>
                        <div style={{ 
                          fontSize: "14px", 
                          color: "#86efac",
                          display: "flex",
                          gap: "12px",
                          flexWrap: "wrap"
                        }}>
                          <span>Status: {route.collectionStatus}</span>
                          <span>•</span>
                          <span>Pickup: {route.pickupDate || "TBD"}</span>
                        </div>
                      </div>
                      <div style={{ ...s.statusPill, background: "rgba(34,197,94,0.12)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.25)" }}>
                        Active
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }}>📍</div>
              <div style={{ fontSize: "20px", color: "#e2faf0", marginBottom: "8px", fontWeight: "600" }}>
                No Active Routes
              </div>
              <div style={{ fontSize: "16px", color: "#86efac", opacity: 0.8 }}>
                All collection requests are currently pending or completed
              </div>
            </div>
          )}
        </div>
        <div style={s.modalActions}>
          <motion.button 
            onClick={onClose} 
            style={s.modalBtnSecondary}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Report Modal
function ReportModal({ onClose, onGenerate }) {
  return (
    <motion.div style={s.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div style={s.modalContent} initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
        <div style={s.modalGlow} />
        <div style={s.modalHeader}>
          <h3 style={s.modalTitle}>Generate Report</h3>
          <motion.button 
            onClick={onClose} 
            style={s.modalClose}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            ×
          </motion.button>
        </div>
        <div style={{ padding: "32px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.7 }}>📊</div>
            <div style={{
              fontSize: "20px",
              color: "#e2faf0",
              marginBottom: "8px",
              fontWeight: "600",
              fontFamily: "'DM Sans', sans-serif"
            }}>
              Comprehensive System Report
            </div>
            <div style={{
              fontSize: "16px",
              color: "#86efac",
              opacity: 0.8,
              fontFamily: "'DM Sans', sans-serif"
            }}>
              Generate detailed analytics and data export for the waste management system
            </div>
          </div>

          <div style={s.reportContent}>
            <div style={s.reportHeader}>
              <div style={s.reportTitle}>WasteSys Analytics Report</div>
              <div style={s.reportDate}>Generated on {new Date().toLocaleDateString()}</div>
            </div>

            <div style={s.reportItem}>
              <span style={s.reportLabel}>👥 User Analytics</span>
              <span style={s.reportValue}>Complete breakdown</span>
            </div>
            <div style={s.reportItem}>
              <span style={s.reportLabel}>📋 Request Management</span>
              <span style={s.reportValue}>Status & metrics</span>
            </div>
            <div style={s.reportItem}>
              <span style={s.reportLabel}>📈 Performance Metrics</span>
              <span style={s.reportValue}>30-day analysis</span>
            </div>
            <div style={s.reportItem}>
              <span style={s.reportLabel}>🎯 System Health</span>
              <span style={s.reportValue}>Efficiency indicators</span>
            </div>
            <div style={s.reportItem}>
              <span style={s.reportLabel}>📅 Request History</span>
              <span style={s.reportValue}>Detailed log</span>
            </div>
            <div style={s.reportItem}>
              <span style={s.reportLabel}>📊 Data Export</span>
              <span style={s.reportValue}>CSV format</span>
            </div>
          </div>

          <div style={{
            textAlign: "center",
            marginTop: "24px",
            padding: "16px",
            background: "rgba(34,197,94,0.05)",
            border: "1px solid rgba(34,197,94,0.1)",
            borderRadius: "12px"
          }}>
            <div style={{ fontSize: "14px", color: "#86efac", marginBottom: "8px" }}>
              📁 Two files will be downloaded:
            </div>
            <div style={{ fontSize: "12px", color: "#4ade80", opacity: 0.8 }}>
              • Comprehensive text report with analytics and insights<br/>
              • CSV data export for further analysis and reporting
            </div>
          </div>
        </div>
        <div style={s.modalActions}>
          <motion.button 
            onClick={onClose} 
            style={s.modalBtnSecondary}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
          <motion.button 
            onClick={() => { onGenerate(); onClose(); }} 
            style={s.modalBtnPrimary}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Generate & Download
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Styles ── */
const s = {
  shell: {
    minHeight: "100vh",
    background: "#071a0e",
    display: "flex",
    fontFamily: "'DM Sans', sans-serif",
    color: "#e2faf0",
    position: "relative",
    overflow: "hidden",
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

  /* SIDEBAR */
  sidebar: {
    position: "fixed", top: 0, left: 0, bottom: 0,
    zIndex: 100,
    background: "rgba(7,26,14,0.9)",
    backdropFilter: "blur(24px)",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    display: "flex", flexDirection: "column",
    padding: "24px 12px",
    gap: "8px",
    overflow: "hidden",
  },
  sideTop: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "4px 4px 4px 4px",
    overflow: "hidden",
  },
  logoIcon: {
    width: "32px", height: "32px", borderRadius: "9px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 4px 14px rgba(34,197,94,0.3)",
  },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "18px", fontWeight: "700", color: "#fff",
    whiteSpace: "nowrap",
  },
  sideDivider: {
    height: "1px", background: "rgba(255,255,255,0.06)",
    margin: "8px 0",
  },
  collapseBtn: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px", padding: "6px",
    color: "#4ade80", cursor: "pointer",
    fontSize: "11px", marginTop: "4px",
    textAlign: "center",
  },

  /* MAIN */
  main: {
    marginLeft: "240px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    position: "relative",
    zIndex: 1,
    transition: "margin-left 0.3s ease",
  },

  /* TOPBAR */
  topbar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 32px",
    background: "rgba(7,26,14,0.7)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    position: "sticky", top: 0, zIndex: 10,
    gap: "16px",
  },
  searchBox: {
    display: "flex", alignItems: "center", gap: "10px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "9px 16px", borderRadius: "50px",
    width: "280px",
  },
  iconBtn: {
    width: "36px", height: "36px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", position: "relative",
  },
  notifDot: {
    position: "absolute", top: "8px", right: "8px",
    width: "7px", height: "7px", borderRadius: "50%",
    background: "#f87171",
    border: "1.5px solid #071a0e",
  },
  profileChip: {
    display: "flex", alignItems: "center", gap: "10px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "6px 14px 6px 6px",
    borderRadius: "50px",
  },
  avatar: {
    width: "30px", height: "30px", borderRadius: "50%",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Playfair Display', serif",
    fontSize: "13px", fontWeight: "700", color: "#fff",
    flexShrink: 0,
  },
  profileName: {
    fontSize: "13px", fontWeight: "600", color: "#fff",
  },
  profileRole: {
    fontSize: "11px", color: "#4ade80",
  },

  /* CONTENT */
  content: {
    padding: "32px",
    flex: 1,
    overflowY: "auto",
  },
  pageHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", flexWrap: "wrap", gap: "12px",
    marginBottom: "28px",
  },
  pageTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "28px", fontWeight: "700",
    color: "#fff", letterSpacing: "-0.02em",
  },
  pageSub: {
    fontSize: "13px", fontWeight: "300",
    color: "#86efac", marginTop: "4px",
  },
  dateBadge: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "8px 16px", borderRadius: "50px",
    fontSize: "13px", color: "#86efac",
  },

  /* STAT CARDS */
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "24px",
    backdropFilter: "blur(16px)",
    cursor: "default",
  },
  statIcon: {
    width: "40px", height: "40px", borderRadius: "11px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "16px", marginBottom: "16px",
  },
  statValue: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "30px", fontWeight: "700",
    color: "#fff", lineHeight: "1",
    marginBottom: "6px",
  },
  statSuffix: { fontSize: "18px", color: "#4ade80" },
  statLabel: {
    fontSize: "12px", fontWeight: "500",
    color: "#86efac", letterSpacing: "0.04em",
  },
  trendBadge: {
    display: "flex", alignItems: "center", gap: "4px",
    padding: "4px 8px", borderRadius: "50px",
    fontSize: "11px", fontWeight: "600",
  },

  /* PANELS */
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: "20px",
    alignItems: "start",
  },
  panel: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "24px",
    backdropFilter: "blur(16px)",
  },
  panelHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: "20px",
  },
  panelTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "17px", fontWeight: "700", color: "#fff",
  },

  /* REQUEST ROWS */
  requestRow: {
    display: "flex", 
    alignItems: "center", 
    gap: "16px",
    padding: "16px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    transition: "all 0.2s",
    minWidth: 0, // Allow text truncation
  },
  requestId: {
    fontSize: "12px", 
    fontWeight: "700", 
    color: "#4ade80",
    letterSpacing: "0.06em", 
    minWidth: "80px",
    flexShrink: 0,
  },
  requestDonor: {
    fontSize: "14px", 
    fontWeight: "600", 
    color: "#e2faf0",
    marginBottom: "4px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  requestMeta: {
    fontSize: "12px", 
    color: "#86efac",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  requestDate: { 
    fontSize: "11px", 
    color: "#4ade8066",
    fontWeight: "500",
    textAlign: "right",
  },
  statusPill: {
    display: "inline-flex", alignItems: "center", gap: "5px",
    padding: "4px 10px", borderRadius: "50px",
    fontSize: "11px", fontWeight: "600",
    whiteSpace: "nowrap",
  },

  /* TABLE */
  tableRow: {
    display: "flex",
    alignItems: "center",
    padding: "12px 10px",
    borderRadius: "10px",
    transition: "background 0.15s",
    gap: "16px",
    minWidth: "fit-content",
  },
  tableCell: {
    fontSize: "13.5px", 
    fontFamily: "'DM Sans', sans-serif",
    color: "#e2faf0",
    flexShrink: 0,
  },
  moreBtn: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px", padding: "6px 8px",
    cursor: "pointer",
  },
  actionBtn: {
    border: "1px solid rgba(74,222,128,0.32)",
    background: "rgba(74,222,128,0.08)",
    color: "#4ade80",
    borderRadius: "999px",
    padding: "7px 12px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
  },
  dangerBtn: {
    border: "1px solid rgba(248,113,113,0.35)",
    background: "rgba(248,113,113,0.12)",
    color: "#fb7185",
  },

  /* QUICK ACTIONS */
  quickBtn: {
    display: "flex", alignItems: "center", gap: "10px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "12px",
    padding: "11px 14px",
    cursor: "pointer",
    width: "100%",
    transition: "all 0.2s",
  },
  quickLabel: {
    fontSize: "13.5px", fontWeight: "500",
    color: "#d1fae5", fontFamily: "'DM Sans', sans-serif",
  },

  /* ALERT */
  alertBox: {
    display: "flex", alignItems: "center", gap: "12px",
    background: "rgba(245,158,11,0.08)",
    border: "1px solid rgba(245,158,11,0.25)",
    borderRadius: "14px", padding: "16px",
  },
  alertTitle: {
    fontSize: "13px", fontWeight: "600", color: "#fbbf24",
    fontFamily: "'DM Sans', sans-serif",
  },
  alertSub: {
    fontSize: "12px", color: "#86efac",
    fontFamily: "'DM Sans', sans-serif", marginTop: "2px",
  },

  /* MODALS */
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(7,26,14,0.8)",
    backdropFilter: "blur(12px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modalContent: {
    background: "linear-gradient(135deg, #0f2a1a 0%, #071a0e 100%)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "24px",
    padding: "0",
    maxWidth: "520px",
    width: "100%",
    maxHeight: "90vh",
    overflow: "hidden",
    boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
    position: "relative",
  },
  modalGlow: {
    position: "absolute",
    top: "-50%",
    left: "-50%",
    right: "-50%",
    bottom: "-50%",
    background: "conic-gradient(from 0deg, transparent, rgba(34,197,94,0.1), transparent, rgba(56,189,248,0.1), transparent)",
    borderRadius: "24px",
    animation: "rotate 8s linear infinite",
    pointerEvents: "none",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "32px 32px 24px 32px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    position: "relative",
  },
  modalTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "28px",
    fontWeight: "700",
    color: "#fff",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  modalClose: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#86efac",
    fontSize: "18px",
    fontWeight: "300",
    transition: "all 0.2s",
    position: "relative",
    zIndex: 1,
  },
  modalForm: {
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    maxHeight: "calc(90vh - 120px)",
    overflowY: "auto",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  formLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#d1fae5",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.01em",
  },
  formInput: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "14px 18px",
    color: "#fff",
    fontSize: "15px",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s",
    outline: "none",
  },
  formSelect: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "14px 18px",
    color: "#fff",
    fontSize: "15px",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s",
    outline: "none",
    cursor: "pointer",
  },
  formTextarea: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "14px 18px",
    color: "#fff",
    fontSize: "15px",
    fontFamily: "'DM Sans', sans-serif",
    minHeight: "100px",
    resize: "vertical",
    transition: "all 0.2s",
    outline: "none",
  },
  modalActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    padding: "0 32px 32px 32px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    marginTop: "auto",
  },
  modalBtn: {
    padding: "14px 28px",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    border: "none",
    transition: "all 0.2s",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  modalBtnPrimary: {
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#fff",
    boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
  },
  modalBtnSecondary: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#86efac",
  },
  modalBtnDanger: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff",
    boxShadow: "0 4px 16px rgba(239,68,68,0.3)",
  },
  routeMap: {
    width: "100%",
    height: "320px",
    background: "linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  routeMapBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "radial-gradient(circle at 30% 30%, rgba(34,197,94,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(56,189,248,0.1) 0%, transparent 50%)",
  },
  routeMapContent: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    color: "#86efac",
  },
  routeMapIcon: {
    fontSize: "48px",
    marginBottom: "16px",
    opacity: 0.6,
  },
  routeMapText: {
    fontSize: "18px",
    fontWeight: "500",
    marginBottom: "8px",
  },
  routeMapSubtext: {
    fontSize: "14px",
    opacity: 0.7,
  },
  reportContent: {
    background: "linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "24px",
    color: "#d1fae5",
    fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
  },
  reportItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  reportLabel: {
    fontWeight: "500",
    color: "#e2faf0",
  },
  reportValue: {
    color: "#4ade80",
    fontWeight: "600",
    fontSize: "16px",
  },
  reportHeader: {
    textAlign: "center",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  reportTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "4px",
  },
  reportDate: {
    fontSize: "12px",
    color: "#86efac",
    opacity: 0.8,
  },
};
