// src/App.jsx
import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Pages/Layout";
import MainContent from "./Pages/MainContent";
import { BookmarkProvider } from "./Context/BookmarkContext";
import Movies from "./Pages/Movies";
import TVSeries from "./Pages/TVSeries";
import Bookedmark from "./Pages/Bookedmark";
import Nopage from "./Pages/Nopage";

import ScrollToTop from "./Components/ScrollToTop"; 

function App() {
  return (
    <BookmarkProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<MainContent />} />
            <Route path="Movies" element={<Movies />} />
            <Route path="TVSeries" element={<TVSeries />} />
            <Route path="Bookmarked" element={<Bookedmark />} />
            <Route path="*" element={<Nopage />} />
          </Route>
        </Routes>
      </Router>
    </BookmarkProvider>
  );
}

export default App;
