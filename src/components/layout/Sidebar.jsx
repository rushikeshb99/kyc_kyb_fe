import React from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiFolder, FiPlusCircle, FiShield } from "react-icons/fi";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FiHome className="w-5 h-5" /> },
    { name: "Applications", path: "/applications", icon: <FiFolder className="w-5 h-5" /> },
    { name: "New Application", path: "/applications/new", icon: <FiPlusCircle className="w-5 h-5" /> },
    { name: "Admin Panel", path: "/admin", icon: <FiShield className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <nav className="h-full overflow-y-auto py-6 px-3">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-cerulean-50 text-cerulean-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
