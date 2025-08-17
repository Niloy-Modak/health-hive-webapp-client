import React from 'react';
import { Outlet } from 'react-router';
import AuthNavbar from '../components/AuthNavbar';

const AuthLayout = () => {
    return (
        <div> 
            <div>
                <AuthNavbar/>
            </div>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default AuthLayout;