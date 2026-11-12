import "./App.css";

import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import GrievanceList from "./pages/admin/GrievanceList";
import GrievanceDetails from "./pages/admin/GrievanceDetails";
import OfficerGrievanceDetails from "./pages/officer/officerGrievanceDetails";
import OfficerDashboard from "./pages/officer/officerDashboard";
import Login from "./pages/auth/Login";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import Register from "./pages/auth/Register";
import TrackGrievance from "./pages/citizen/TrackGrievance";
import SubmitGrievance from "./pages/citizen/SubmitGrievance";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import HowItWorks from "./pages/public/HowItWorks";
import Departments from "./pages/public/Departments";
import Contact from "./pages/public/Contact";
import FAQ from "./pages/public/FAQ";

function App() {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="grievances" element={<GrievanceList />} />
          <Route path="grievances/:id" element={<GrievanceDetails />} />
        </Route>
      </Route>

      {/* Officer Routes */}
      <Route element={<ProtectedRoute allowedRoles={["officer"]} />}>
        <Route path="/officer/dashboard" element={<OfficerDashboard />} />
        <Route path="/officer/grievances/:id" element={<OfficerGrievanceDetails />} />
      </Route>

      {/* Citizen Routes */}
      <Route element={<ProtectedRoute allowedRoles={["citizen"]} />}>
        <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
        <Route path="/citizen/submit" element={<SubmitGrievance />} />
        <Route path="/citizen/track" element={<TrackGrievance />} />
      </Route>
      {/* Default Route */}
      {/* <Route path="/" element={<Navigate to="/admin/dashboard" replace />} /> */}
      <Route path="/about" element={<About />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/departments" element={<Departments />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />

    </Routes>
  );
}

export default App;