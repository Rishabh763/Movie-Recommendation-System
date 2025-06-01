import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Bookmark, Film, Tv } from "lucide-react"; // optional icons
import { useAuth } from "../Context/AuthContext";
import LoginModal from "../Components/Login";
import { Link } from "react-router-dom";
import { CircleUserRound } from 'lucide-react';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const [toggle, setToggle] = useState(false);

  const handletoggle = () => {
    setToggle(!toggle);
  }

  return (
    <div className="sticky top-0 h-auto lg:h-screen py-4 md:p-4 z-50">
      <div className="bg-[#19213c] h-full  rounded-md px-3 py-2 md:px-6 md:py-4 flex lg:flex-col  justify-between items-center">
        {/* Logo */}
        <Link to="/" className="grid gap-6 items-center">
          <img
            src="/assets/svg_files/logo.svg"
            alt="Logo"
            className="w-8 h-8"
          />
        </Link>

        {/* Nav Links */}
        <div className="flex flex-row lg:flex-col items-center gap-6 lg:mt-6">
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
        <div className="lg:mt-6 relative z-50">
          <button onClick={handletoggle} className=" aspect-square">
            <CircleUserRound  className="size-8 md:size-12"  strokeWidth={1}/>
          </button>
          <div  className={ toggle ? "block absolute lg:top-1/2 lg:left-[110%] top-[110%] left-1/2 -translate-x-1/2 lg:translate-x-0 lg:-translate-y-1/2 ": "hidden"} >
            {currentUser ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={logout}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
               <LoginModal />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
