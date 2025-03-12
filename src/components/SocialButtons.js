import React from "react";

const SocialButtons = () => {
  const socialPlatforms = [
    {
      name: "Facebook",
      url: "https://img.icons8.com/ios-filled/30/1877F2/facebook.png",
    },
    {
      name: "X",
      url: "https://img.icons8.com/ios-filled/30/000000/twitterx.png",
    },
    {
      name: "LinkedIn",
      url: "https://img.icons8.com/ios-filled/30/0A66C2/linkedin.png",
    },
  ];

  return (
    <div className="text-center">
      <p className="text-sm text-gray-500 mb-2">Or login with</p>
      <div className="flex justify-center space-x-4">
        {socialPlatforms.map((platform, index) => (
          <button
            key={index}
            className="p-2 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition"
          >

            <img src={platform.url} alt={platform.name} className="w-6 h-6" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SocialButtons;

