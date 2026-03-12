import React from "react";
import { ClipboardList, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">CV</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`
                }
              >
                <ClipboardList className="w-4 h-4 mr-2" />
                Submit Application
              </NavLink>
              <NavLink
                to="/list"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`
                }
              >
                <Users className="w-4 h-4 mr-2" />
                Applications
              </NavLink>
              <NavLink
                to="/form-sheet"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`
                }
              >
                <Users className="w-4 h-4 mr-2" />
                Form Sheet
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      
      <div className="sm:hidden flex flex-row w-full bg-gray-50 border-t border-gray-200">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex-1 py-3 text-sm font-medium flex items-center justify-center ${
              isActive
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <ClipboardList className="w-4 h-4 mr-2" />
          Form
        </NavLink>
        <NavLink
          to="/list"
          className={({ isActive }) =>
            `flex-1 py-3 text-sm font-medium flex items-center justify-center border-l border-gray-200 ${
              isActive
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <Users className="w-4 h-4 mr-2" />
          Submissions
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
