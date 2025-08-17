import React from "react";
import { Link } from "react-router";
import MainLogo from "../assets/logo/main-logo.png"; // adjust path if needed

const AuthNavbar = () => {
  return (
    <nav className="bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left: Logo & Name */}
        <div className="flex items-center gap-2">
          <img src={MainLogo} alt="Logo" className="w-8 md:w-10" />
          <span className="text-lg md:text-xl font-bold text-gray-800">HealthHive</span>
        </div>

        {/* Right: Back to Home */}
        <Link
          to="/"
          className="text-sm md:text-base text-blue-600 font-medium hover:underline"
        >
          ⬅ Back to Home
        </Link>
      </div>
    </nav>
  );
};

export default AuthNavbar;
