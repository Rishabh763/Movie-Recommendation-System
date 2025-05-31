import React from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err) {
      alert("Google Sign-In failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#10141E] text-white">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold">Sign in to Continue</h1>
        <button
          onClick={handleGoogleSignIn}
          className="bg-white text-black px-6 py-2 rounded shadow-md hover:bg-gray-200"
        >
          <img
            src="/assets/svg_files/google-icon.svg"
            alt="Google"
            className="inline-block w-5 mr-2"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
