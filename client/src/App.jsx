import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import InvoiceForm from "./pages/InvoiceForm";
import InvoiceValidator from "./pages/InvoiceValidate";
import HomePage from "./pages/HomePage";
import FBRAuthPortal from "./components/FBRAuthPortal";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import RBACDashboard from "./pages/RBACDashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar */}

        <Navbar />

        {/* Routes */}
        <main className="p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<RBACDashboard />} />
            <Route path="/sign-in" element={<FBRAuthPortal isLogin={true} />} />
            <Route
              path="/sign-up"
              element={<FBRAuthPortal isLogin={false} />}
            />
            <Route path="/validate" element={<InvoiceValidator />} />

            <Route
              path="/create-invoice"
              element={
                <ProtectedRoute
                  allowedRoles={["super-admin", "manager", "staff"]}
                >
                  <InvoiceForm />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {/* Toast Notifications */}
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </Router>
  );
}

export default App;
