
import React from "react";
import Navbar from "../Components/Navbar";
import { Outlet } from "react-router-dom";

function Layout() {

  return (
    <div className="content-grid text-white">
        <div className="flex flex-col lg:flex-row gap-4  bg-[#10141E] ">

          <Navbar />
          <div className="flex-1 md:p-4 flex flex-col min-h-screen">
            <div className="flex-1">
              <Outlet />
            </div>
            <footer className="mt-12 py-6 border-t border-white/10 text-xs text-gray-500 flex flex-wrap items-center gap-3">
              <span>
                Posters and overviews from{" "}
                <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" className="underline">
                  TMDB
                </a>
                . This product uses the TMDB API but is not endorsed or
                certified by TMDB. Ratings data: MovieLens 32M (GroupLens Research).
              </span>
            </footer>
          </div>
        </div>
    </div>
  );
}

export default Layout;
