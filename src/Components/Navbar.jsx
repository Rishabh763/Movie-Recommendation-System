import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Bookmark, Film, Tv } from "lucide-react"; // optional icons

function Navbar() {
  return (
    <div className="sticky top-0 h-auto lg:h-screen p-0 md:p-4">
      <div className="bg-[#19213c] h-full rounded-none md:rounded-md px-6 py-4 flex flex-col justify-between items-center">
        {/* Logo */}
        <div className="grid gap-6 items-center">
          <img src="/assets/svg_files/logo.svg" alt="Logo" className="w-8 h-8" />
        </div>

        {/* Nav Links */}
        <div className="flex flex-row lg:flex-col items-center gap-6 mt-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-white ${isActive ? "opacity-100" : "opacity-50"}`
            }
          >
            <Home />
          </NavLink>

          <NavLink
            to="/Movies"
            className={({ isActive }) =>
              `text-white ${isActive ? "opacity-100" : "opacity-50"}`
            }
          >
            <Film />
          </NavLink>

          <NavLink
            to="/TVSeries"
            className={({ isActive }) =>
              `text-white ${isActive ? "opacity-100" : "opacity-50"}`
            }
          >
            <Tv />
          </NavLink>

          <NavLink
            to="/Bookmarked"
            className={({ isActive }) =>
              `text-white ${isActive ? "opacity-100" : "opacity-50"}`
            }
          >
            <Bookmark />
          </NavLink>
        </div>

        {/* User Avatar */}
        <div className="mt-6">
          <img
            src="/assets/image-avatar.png"
            alt="User"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
