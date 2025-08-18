import React, { useEffect } from "react";
import { Link } from "react-router"; // fixed to react-router-dom

const ErrorPage = () => {
  useEffect(() => {
    document.title = "404 - Page Not Found";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 px-6 text-center">
      {/* Big 404 Text */}
      <h1 className="text-9xl font-extrabold text-secondary drop-shadow-lg animate-bounce">
        404
      </h1>

      {/* Message */}
      <h2 className="mt-4 text-2xl md:text-3xl font-bold text-primary">
        Oops! Page Not Found
      </h2>
      <p className="mt-2 text-gray-600 max-w-md">
        The page you are looking for doesn’t exist or may have been moved.
      </p>

      {/* Action Button */}
      <Link
        to="/"
        className="mt-6 inline-block bg-secondary font-medium text-white px-6 py-3 rounded-lg shadow-md hover:bg-sky-600 hover:shadow-lg transition-all duration-300"
      >
        Go Back Home
      </Link>

      {/* Extra touch */}
      <div className="mt-10">
        <p className="text-sm text-gray-500">© {new Date().getFullYear()} Your Website</p>
      </div>
    </div>
  );
};

export default ErrorPage;
