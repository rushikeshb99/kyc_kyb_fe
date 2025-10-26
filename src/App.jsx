import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import ApplicationList from "./pages/applications/ApplicationList";
import CreateApplication from "./pages/applications/CreateApplication";
import ApplicationDetail from "./pages/applications/ApplicationDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Layout
import Layout from "./components/layout/Layout";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="applications" element={<ApplicationList />} />
            <Route path="applications/new" element={<CreateApplication />} />
            <Route path="applications/:id" element={<ApplicationDetail />} />
            <Route path="admin" element={<AdminDashboard />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
