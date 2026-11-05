// src/App.jsx
// AuthProvider and LibraryProvider are mounted once, in main.jsx.
import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Pages/Layout";
import MainContent from "./Pages/MainContent";

import Bookedmark from "./Pages/Bookedmark";
import Nopage from "./Pages/Nopage";
import Login from "./Components/Login";
import ScrollToTop from "./Components/ScrollToTop";
import Recommendation from "./Pages/Recommendation";
import MovieDetail from "./Pages/MovieDetail";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MainContent />} />
          <Route path="Bookmarked" element={<Bookedmark />} />
          <Route path="Recommendations" element={<Recommendation />} />
          <Route path="movie/:id" element={<MovieDetail />} />
          <Route path="*" element={<Nopage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
