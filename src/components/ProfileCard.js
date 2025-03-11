import React from "react";
import SocialButtons from "./SocialButtons";

export default function ProfileCard() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0a192f]">
      <div className="bg-black p-6 rounded-2xl shadow-lg text-white w-80 text-center grid gap-4">
        <img
          src="/th.jpeg" 
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto border-4 border-green-500"
        />


        <div>
          <h2 className="text-2xl font-bold">I am David Oludoyin</h2>
          <p className="text-gray-400">A Front-end developer</p>
          <p className="text-gray-400">Follow me on social media</p>
        </div>


        <SocialButtons />
      </div>
    </div>
  );
}



