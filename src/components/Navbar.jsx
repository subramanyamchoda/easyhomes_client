import React, { useState } from "react";
import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";

const Navbar = ({ user, userType, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    ...(user && userType !== "renter" ? [{ to: "/search", label: "Search" }] : []),
    ...(userType === "user" ? [{ to: "/dashboard", label: "Dashboard" }] : []),
    ...(userType === "renter"
      ? [
          { to: "/renter", label: "Renter" },
          { to: "/rdashboard", label: "Dashboard" },
        ]
      : []),
  ];

  const handleLogout = () => {
    onLogout();               // clear user data (from context/localStorage etc.)
    setMenuOpen(false);       // close mobile menu
    navigate("/home", { replace: true }); // go to home
  };

  return (
    <>
      <nav className="bg-gray-900 text-white shadow-md font-sans text-[15px] tracking-wide">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 py-3 md:py-4">
          {/* Logo */}
          <RouterNavLink to="/" className="flex items-center space-x-3">
            <img src="/home.png" className="h-10 rounded-xl" alt="Logo" />
            <span className="text-2xl font-semibold text-white">Easy Homes</span>
          </RouterNavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 font-medium text-xl">
            {navLinks.map((link) => (
              <NavItem key={link.to} {...link} />
            ))}

            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
              >
                Logout
              </button>
            ) : (
              <NavItem
                to="/login"
                label="Login"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              />
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col items-center bg-gray-900 py-4 space-y-3 border-t border-gray-700 z-50">
            {navLinks.map((link) => (
              <NavItem
                key={link.to}
                {...link}
                onClick={() => setMenuOpen(false)}
                className="w-full text-center"
              />
            ))}

            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white w-11/12 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <NavItem
                to="/login"
                label="Login"
                onClick={() => setMenuOpen(false)}
                className="bg-blue-500 text-white w-11/12 py-2 rounded-lg hover:bg-blue-600 transition text-center"
              />
            )}
          </div>
        )}
      </nav>
      <hr className="border-white border-2 " />
    </>
  );
};

// Reusable NavItem
const NavItem = ({ to, label, className = "", onClick }) => {
  return (
    <div className="w-full">
      <RouterNavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          `block transition px-3 py-1 duration-200 rounded-md ${
            isActive
              ? "text-blue-400 font-semibold border-b-2 border-white"
              : "text-white hover:text-blue-300"
          } ${className}`
        }
      >
        {label}
      </RouterNavLink>
    </div>
  );
};

export default Navbar;
