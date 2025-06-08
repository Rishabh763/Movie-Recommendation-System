import React, { useState, useRef, useEffect } from "react";
import { Home, Bookmark, Sparkles, Wand, CircleUserRound } from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import SidebarIcon from "../Components/SidebarIcon";

function Navbar() {
  const { currentUser, logout } = useAuth();
  const [togglePopup, setTogglePopup] = useState(false);
  const popupRef = useRef(null);
  const userAvatarRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        userAvatarRef.current &&
        !userAvatarRef.current.contains(event.target)
      ) {
        setTogglePopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const wandAnimation = {
    scale: [1, 1.2, 1],
    rotate: [0, 10, -10, 0],
    transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
  };

  return (
    <div className="sticky top-0 h-auto lg:h-screen py-4 md:p-4 z-40">
      <div className="bg-[#19213c] h-full rounded-md px-3 py-2 md:px-6 md:py-4 flex lg:flex-col justify-between items-center">
        {/* Logo */}
        <Link to="/" className="grid gap-6 items-center">
          <img
            src="/assets/svg_files/logo.svg"
            alt="Logo"
            className="w-8 h-8"
          />
        </Link>

        {/* Nav Links */}
        <div className="flex flex-row lg:flex-col items-center gap-4 lg:mt-6">
          <SidebarIcon to="/" Icon={Home} label="Home" />
          <SidebarIcon
            to="/Recommendations"
            Icon={Sparkles}
            label="Recommendations"
            animate={wandAnimation}
          />
          <SidebarIcon to="/Bookmarked" Icon={Bookmark} label="Bookmarked" />
        </div>

        {/* User Avatar */}
        <div className="lg:mt-6 relative z-50">
          <button
            onClick={() => setTogglePopup(!togglePopup)}
            className="aspect-square"
            ref={userAvatarRef}
            aria-label="User Avatar"
          >
            <CircleUserRound className="size-8 md:size-12" strokeWidth={1} />
          </button>

          {togglePopup && (
            <div
              ref={popupRef}
              className="absolute lg:top-1/2 lg:left-[110%] top-[110%] left-1/2 -translate-x-1/2 lg:translate-x-0 lg:-translate-y-1/2 text-white rounded-md shadow-md  z-50"
            >
              {currentUser && (
                <button
                  onClick={() => {
                    logout();
                    setTogglePopup(false);
                    navigate("/login");
                  }}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 w-full"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
