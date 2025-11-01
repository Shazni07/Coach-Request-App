import { Link, useLocation } from "react-router-dom";
import { Bus, LogIn, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { pathname } = useLocation();
  const link = "flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-100 transition";
  const active = "bg-blue-600 text-white";

  return (
    <nav className="flex items-center justify-between bg-white shadow-sm px-6 py-3">
      <div className="flex items-center gap-2 text-blue-600 font-semibold">
        <Bus size={25} /> Coach Request
      </div>
      <div className="flex gap-2">
        <Link to="/" className={`${link} ${pathname === "/" ? active : ""}`}>
          Customer
        </Link>
        <Link to="/login" className={`${link} ${pathname === "/login" ? active : ""}`}>
          <LogIn size={16} /> Login
        </Link>
        <Link to="/admin" className={`${link} ${pathname === "/admin" ? active : ""}`}>
          <LayoutDashboard size={16} /> Dashboard
        </Link>
      </div>
    </nav>
  );
}
