// components/Login.jsx
import React from "react";
import { useAuth } from "../Context/AuthContext";

const LoginModal = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#1f1f2e] rounded-2xl p-8 max-w-sm w-full text-center text-white shadow-xl flex flex-col gap-4 items-center">
        <h2 className="text-2xl font-semibold mb-4">Welcome to Movie Recommendation System</h2>
        <p className="mb-6 text-gray-300">Sign in with Google to continue</p>
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

export default LoginModal;
