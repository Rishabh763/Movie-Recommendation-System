import React from "react";
import { useAuth } from "../Context/AuthContext";

const SignInButton = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <button
      onClick={signInWithGoogle}
      className="bg-white text-black py-2 px-4 rounded-md flex items-center gap-2 shadow-md hover:bg-gray-100"
    >
      
      Sign in
    </button>
  );
};

export default SignInButton;
