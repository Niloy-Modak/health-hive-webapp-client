import React from 'react';
import { Link } from 'react-router';
import useAuth from '../../hooks/useAuth';

const DashboardNav = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
      {/* Left: Dashboard title */}
      <div className="text-2xl font-semibold text-gray-800">
        <Link to="/dashboard"></Link>
      </div>

      {/* Right: User info */}
      <div className="flex items-center space-x-3">
        {user ? (
          <>
            <p className="hidden sm:block font-medium text-gray-700">{user.displayName}</p>
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-10 h-10 rounded-full object-cover"
              title={user.displayName}
            />
          </>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default DashboardNav;
