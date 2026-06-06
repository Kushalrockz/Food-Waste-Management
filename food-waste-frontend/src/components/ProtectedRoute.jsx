import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ❌ Role mismatch
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  // ✅ Allowed
  return children;
}