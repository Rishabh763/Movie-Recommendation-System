
import React from "react";
import Navbar from "../Components/Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="content-grid text-white">
        <div className="flex flex-col lg:flex-row gap-4  bg-[#10141E] ">
          <Navbar />
          <div className="flex-1 p-4">
            <Outlet />
          </div>
        </div>
    </div>
  );
}

export default Layout;
