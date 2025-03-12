import React from "react";
import SignupLink from "./SignupLink";
import SocialButtons from "./SocialButtons";

const LoginCard = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[384px]">
        <h2 className="text-xl font-bold text-center mb-2">LOGIN</h2>
        <p className="text-gray-500 text-center text-sm mb-6">
          Welcome to the private area. Please provide your login credentials to proceed.
        </p>


        <div className="mb-4">
          <input
            type="text"
            placeholder="myUser"
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>


        <div className="mb-2">
          <input
            type="password"
            placeholder="********"
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>


        <div className="text-right text-sm text-blue-500 cursor-pointer hover:underline mb-4">
          Forgot Password?
        </div>

        <button className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg shadow-md hover:opacity-90 transition">
          LOGIN
        </button>


        <SocialButtons />

        <SignupLink />
      </div>
    </div>
  );
};

export default LoginCard;




