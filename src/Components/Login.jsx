// pages/Login.jsx
import React, { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { signInWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-[#0e1323] flex items-center justify-center px-4">
      <div className="bg-[#1f1f2e] rounded-2xl p-8 max-w-sm w-full text-center text-white shadow-2xl flex flex-col gap-4 items-center">
        <img
          src="/assets/svg_files/logo.svg"
          alt="Logo"
          className="w-12 h-12 mb-2"
        />
        <h2 className="text-2xl font-semibold">Welcome to Movie Recommendation</h2>
        <p className="text-gray-400 mb-6">Sign in with Google to continue</p>
        <button
          onClick={signInWithGoogle}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded-full"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
