import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const SidebarIcon = ({ to, Icon, label, animate }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center justify-center p-1 md:p-2 rounded-md transition-colors ${
          isActive ? "bg-white text-black" : "text-white hover:bg-gray-700"
        }`
      }
      alt={label}
    >
      {({ isActive }) => (
        <motion.div
          animate={!isActive && animate ? animate : {}}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon className="w-6 h-6" />
        </motion.div>
      )}
    </NavLink>
  );
};

export default SidebarIcon;

