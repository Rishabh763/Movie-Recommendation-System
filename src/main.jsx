import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./Context/AuthContext"; 
import {BookmarkProvider} from "./Context/BookmarkContext.jsx"
import './index.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider> 
      <BookmarkProvider>
        <App />
      </BookmarkProvider>
    </AuthProvider>
  </React.StrictMode>
);
