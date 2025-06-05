
import React from "react";
import Navbar from "../Components/Navbar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import LoginModal from "../Components/Login";

function Layout() {
  const { currentUser } = useAuth();

  return (
    <div className="content-grid text-white">
          {!currentUser && <LoginModal />}
        <div className="flex flex-col lg:flex-row gap-4  bg-[#10141E] ">

          <Navbar />
          <div className="flex-1 md:p-4">
            <Outlet />
          </div>
        </div>
    </div>
  );
}

export default Layout;
