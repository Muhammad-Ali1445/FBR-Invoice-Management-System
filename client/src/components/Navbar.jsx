import { Link } from "react-router-dom";
import {
  MonitorCog,
  BadgePlus,
  TicketCheck,
  Key,
  LogIn,
  Signpost,
} from "lucide-react";

function Navbar() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  console.log("Navbar user:", user);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/sign-in";
  };

  return (
    <nav className="bg-indigo-600 text-white px-6 py-6 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold flex justify-center items-center gap-2">
        <MonitorCog className="w-7 h-7 " /> Invoice Management System
      </h1>

      <div className="flex items-center justify-center gap-8">
        {/* Always visible */}
        <Link to="/" className="flex items-center gap-2 hover:underline">
          <BadgePlus className="w-5 h-5" /> Home
        </Link>

        {/* Role based links */}
        {user?.role && ["Admin", "Manager", "Staff"].includes(user.role) && (
          <>
            <Link
              to="/create-invoice"
              className="flex items-center gap-2 hover:underline"
            >
              <BadgePlus className="w-5 h-5" /> Create Invoice
            </Link>

            <Link
              to="/validate"
              className="flex items-center gap-2 hover:underline"
            >
              <TicketCheck className="w-5 h-5" /> Validate Invoice
            </Link>
          </>
        )}

        {/* Auth links */}
        {!user ? (
          <>
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
          </>
        ) : (
          <Link
            className="flex items-center gap-2 hover:underline"
            onClick={handleSignOut}
          >
            <LogIn className="w-5 h-5" /> Sign Out
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
