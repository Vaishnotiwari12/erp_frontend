import { Routes, Route, Navigate } from "react-router-dom";

import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/dashboard/Dashboard";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}