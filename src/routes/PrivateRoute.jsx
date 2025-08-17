import React from 'react';
import { Navigate, useLocation } from 'react-router';
import Loading from '../components/ui/Loading';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (user && user?.email) {
    return children;
  }

  return <Navigate state={location.pathname} to="/auth/login" replace />;
};

export default PrivateRoute;
