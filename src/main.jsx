import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./Context/AuthContext"; 
import { LibraryProvider } from "./Context/LibraryContext.jsx";
import './index.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider> 
      <LibraryProvider>
        <App />
      </LibraryProvider>
    </AuthProvider>
  </React.StrictMode>
);
