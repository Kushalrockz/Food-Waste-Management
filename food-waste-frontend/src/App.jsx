import Navbar from "./components/Navbar.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <div style={{ padding: "16px" }}>
        <AppRoutes />
      </div>
    </>
  );
}