import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  MonitorCog,
  BadgePlus,
  TicketCheck,
  Key,
  LogIn,
  Signpost,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import InvoiceForm from "./pages/InvoiceForm";
import InvoiceValidator from "./pages/InvoiceValidate";
import FBRAuthPortal from "./components/FBRAuthPortal";

function App() {
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/sign-in";
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <nav className="bg-indigo-600 text-white px-6 py-6 shadow-md flex justify-between items-center">
          <h1 className="text-xl font-bold flex justify-center items-center gap-2">
            <MonitorCog className="w-7 h-7 " /> Invoice Management System
          </h1>
          <div className="flex items-center justify-center gap-8">
            <Link to="/" className="flex items-center gap-2 hover:underline">
              <BadgePlus className="w-5 h-5" /> Create Invoice
            </Link>

            <Link
              to="/validate"
              className="flex items-center gap-2 hover:underline"
            >
              <TicketCheck className="w-5 h-5" /> Validate Invoice
            </Link>

            <Link
              to="/sign-in"
              className="flex items-center gap-2 hover:underline"
            >
              <Key className="w-5 h-5" /> Sign In
            </Link>

            <Link
              to="/sign-up"
              className="flex items-center gap-2 hover:underline"
            >
              <Signpost className="w-5 h-5" /> Sign Up
            </Link>
            <Link
              className="flex items-center gap-2 hover:underline"
              onClick={handleSignOut}
            >
              <LogIn className="w-5 h-5" /> Sign Out
            </Link>
          </div>
        </nav>

        {/* Routes */}
        <main className="p-6">
          <Routes>
            <Route path="/" element={<InvoiceForm />} />
            <Route path="/validate" element={<InvoiceValidator />} />
            <Route path="/sign-in" element={<FBRAuthPortal isLogin={true} />} />
            <Route
              path="/sign-up"
              element={<FBRAuthPortal isLogin={false} />}
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
