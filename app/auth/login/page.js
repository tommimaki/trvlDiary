"use client";

import { signIn } from "next-auth/react";

const LoginPage = () => {
  const handleLogin = async (provider) => {
    await signIn(provider);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <div className="space-y-4">
        {/* Replace with your desired providers */}
        <button
          onClick={() => handleLogin("github")}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Login with GitHub
        </button>
        {/* <button
          onClick={() => handleLogin("google")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login with Google
        </button> */}
      </div>
    </div>
  );
};

export default LoginPage;
