import React, { useState } from "react";
import { ClipboardList, Users, Menu, X, LogOut, CircleUserRound } from "lucide-react";
import type { User } from "firebase/auth";
import { NavLink } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Application Form", icon: ClipboardList },
  // { to: "/form-sheet", label: "Form Sheet", icon: FileText },
  // { to: "/", label: "Form Sheet", icon: ClipboardList }
  { to: "/list", label: "Applications", icon: Users },
];

interface NavbarProps {
  user: User;
  isAdmin: boolean;
  onSignOut: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, isAdmin, onSignOut }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const visibleLinks = navLinks.filter(({ to }) => to !== "/list" || isAdmin);

  return (
    <nav className="bg-white border-b border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-blue-600">CV</span>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <CircleUserRound className="w-4 h-4 text-blue-600" />
              <span className="max-w-60 truncate">{user.displayName || user.email}</span>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {visibleLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16 ${
                      isActive
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>

          <button
            onClick={onSignOut}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>

          <button
            className="sm:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200 shadow-lg">
          {visibleLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium border-l-4 ${
                  isActive
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <Icon className="w-4 h-4 mr-3" />
              {label}
            </NavLink>
          ))}
          <button
            onClick={onSignOut}
            className="flex w-full items-center px-4 py-3 text-sm font-medium border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign out
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
