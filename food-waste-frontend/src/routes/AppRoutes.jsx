import { Routes, Route } from "react-router-dom";

import Home from "../pages/auth/Home.jsx";
import Register from "../pages/auth/Register.jsx";
import Login from "../pages/auth/Login.jsx";
import AdminDashboard from "../admin/AdminDashboard.jsx";
import RecyclerDashboard from "../recycler/RecyclerDashboard.jsx";
import DonorDashboard from "../donor/DonorDashboard.jsx";

import WasteCategoryForm from "../pages/auth/wasteCategory/WasteCategoryForm.jsx";
import FoodDonorForm from "../pages/auth/foodDonor/FoodDonorForm.jsx";   
import FoodWasteEntryForm from "../pages/auth/foodWasteEntry/FoodWasteEntryForm.jsx";
import CollectionRequestForm from "../pages/auth/collectionRequest/CollectionRequestForm.jsx";
import RecyclingCenterForm from "../pages/auth/recyclingCenter/RecyclingCenterForm.jsx";
import WasteDisposalForm from "../pages/auth/wasteDisposal/WasteDisposalForm.jsx";
import ReportForm from "../pages/auth/report/ReportForm.jsx";
import FeedbackForm from "../pages/auth/feedback/FeedbackForm.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/recycler" element={<RecyclerDashboard />} />
      <Route path="/donor" element={<DonorDashboard />} />

      <Route path="/waste-categories/new" element={<WasteCategoryForm />} />
      <Route path="/donors/new" element={<FoodDonorForm />} />
      <Route path="/waste-entries/new" element={<FoodWasteEntryForm />} />
      <Route path="/collection-requests/new" element={<CollectionRequestForm />} />
      <Route path="/recycling-centers/new" element={<RecyclingCenterForm />} />
      <Route path="/waste-disposals/new" element={<WasteDisposalForm />} />
      <Route path="/reports/new" element={<ReportForm />} />
      <Route path="/feedback/new" element={<FeedbackForm />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}