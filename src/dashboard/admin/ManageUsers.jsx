import React, { useEffect, useState } from 'react';
import PendingUser from './PendingUser';
import SellersList from './SellersList';
import AllUsers from './AllUsers';

const ManageUsers = () => {
    const [activeTab, setActiveTab] = useState('allUsers'); // default tab
    useEffect(() => {
        document.title = 'Admin Dashboard - Manage Users';
    }, []);
    
    return (
        <section className="p-4">
            {/* Tabs */}
            <div className="flex justify-center gap-4  md:mb-3 px-3 md:px-8 pt-2">
                <button
                    className={`btn ${activeTab === 'allUsers' ? 'btn-primary btn-xs md:btn-sm' : 'btn-outline btn-xs md:btn-sm'}`}
                    onClick={() => setActiveTab('allUsers')}
                >
                    All Users
                </button>

                <button
                    className={`btn ${activeTab === 'pendingSellers' ? 'btn-primary btn-xs md:btn-sm' : 'btn-outline btn-xs md:btn-sm'}`}
                    onClick={() => setActiveTab('pendingSellers')}
                >
                    Pending Sellers
                </button>

                <button
                    className={`btn ${activeTab === 'sellersList' ? 'btn-primary btn-xs md:btn-sm' : 'btn-outline btn-xs md:btn-sm'}`}
                    onClick={() => setActiveTab('sellersList')}
                >
                    Sellers List
                </button>
            </div>

            {/* Render components conditionally */}
            {activeTab === 'allUsers' && <AllUsers />}
            {activeTab === 'pendingSellers' && <PendingUser />}
            {activeTab === 'sellersList' && <SellersList />}
        </section>
    );
};

export default ManageUsers;
