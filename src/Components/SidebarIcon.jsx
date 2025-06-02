import React from "react";
import { NavLink } from "react-router-dom";

function SidebarIcon({ to, Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative text-white transition-opacity flex items-center justify-center ${
          isActive ? "opacity-100" : "opacity-60"
        }`
      }
    >
      <Icon />

      {/* Tooltip label */}
      {label && (
        <div className="absolute left-[120%] opacity-100 top-1/2 -translate-y-1/2 bg-[#515d87] text-sm px-3 py-1 rounded-md whitespace-nowrap hidden lg:group-hover:block z-10">
          {label}
        </div>
      )}
    </NavLink>
  );
}

export default SidebarIcon;
