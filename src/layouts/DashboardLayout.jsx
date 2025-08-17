import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';  // note: use 'react-router-dom'
import SideBar from '../components/SideBar';
import DashboardNav from '../dashboard/dashboardNavBar/DashboardNav';
import useRole from '../hooks/useRole';
import Loading from '../components/ui/Loading';

const DashboardLayout = () => {
    const { role, isLoading } = useRole();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isLoading) {
            // Only redirect if user is on /dashboard exactly (no subpath)
            if (location.pathname === '/dashboard') {
                if (role === 'admin') {
                    navigate('/dashboard/admin-dashboard', { replace: true });
                } else if (role === 'seller') {
                    navigate('/dashboard/seller-homepage', { replace: true });
                } else {
                    navigate('/forbidden', { replace: true });
                }
            }
        }
    }, [role, isLoading, navigate, location.pathname]);

    if (isLoading) return <Loading />;

    return (
        <div className="flex min-h-screen">
            {/* Sidebar - fixed position */}
            <div className="md:fixed h-full md:w-64">
                <SideBar />
            </div>

            {/* Main content - offset by sidebar width */}
            <main className="flex-1 ">
                <DashboardNav />
                <section className="md:ml-64">
                    <Outlet />
                </section>
            </main>
        </div>
    );
};

export default DashboardLayout;
