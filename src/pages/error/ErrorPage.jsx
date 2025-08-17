import React, { useEffect } from "react";
import { Link } from "react-router";

const ErrorPage = () => {
    useEffect(() => {
        document.title = "404 - Page Not Found";
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
            
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops! Page Not Found</h1>
            <p className="text-gray-600 mb-6">
                The page you are looking for doesn’t exist or has been moved.
            </p>
            <Link
                to="/"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
            >
                Go Home
            </Link>
        </div>
    );
};

export default ErrorPage;
