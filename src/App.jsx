// src/App.jsx
import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Pages/Layout";
import MainContent from "./Pages/MainContent";
import { BookmarkProvider } from "./Context/BookmarkContext";

import Bookedmark from "./Pages/Bookedmark";
import Nopage from "./Pages/Nopage";
import Login from "./Components/Login";
import ScrollToTop from "./Components/ScrollToTop";
import Recommendation from "./Pages/Recommendation";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <BookmarkProvider>
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
            <Route path="*" element={<Nopage />} />
          </Route>
        </Routes>
      </Router>
    </BookmarkProvider>
  );
}

export default App;
