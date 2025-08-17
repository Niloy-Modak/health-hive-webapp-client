import React, { useState } from 'react';
import {
  FiMenu, FiX, FiHome, FiPlusCircle, FiShield, FiBarChart,
  FiPackage, FiCreditCard
} from 'react-icons/fi';
import { MdArrowBackIosNew } from 'react-icons/md';
import { Link, NavLink } from 'react-router';
import MainLogo from '../assets/logo/main-logo.png';
import useRole from '../hooks/useRole';
import Loading from './ui/Loading';


const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { role, isLoading } = useRole();

  const adminNavItems = [
    { id: 1, to: "/dashboard/admin-dashboard", label: 'Admin Dashboard', icon: <FiHome /> },
    { id: 2, to: '/dashboard/admin-manege-users', label: 'Manage Users', icon: <FiShield /> },
    { id: 3, to: '/dashboard/admin-manage-category', label: 'Manage Category', icon: <FiPlusCircle /> },
    { id: 4, to: '/dashboard/admin-sales-report', label: 'Sales Report', icon: <FiBarChart /> },
  ];

  const sellersNavItems = [
    { id: 1, to: '/dashboard/seller-homepage', label: 'Seller Home page', icon: <FiHome /> },
    { id: 2, to: '/dashboard/manage-medicines', label: 'Manage Medicines', icon: <FiPackage /> },
    { id: 3, to: '/dashboard/payment-history', label: 'Payment History', icon: <FiCreditCard /> },
  ];
  const userNavItems = [
    { id: 1, to: '/dashboard/user-payment-history', label: 'Payment History', icon: <FiCreditCard /> },
  ];

  const getNavItems = () => {
    if (!role) return [];
    if (role.toLowerCase() === 'admin') return adminNavItems;
    if (role.toLowerCase() === 'seller') return sellersNavItems;
    if (role.toLowerCase() === 'user') return userNavItems;
    return [];
  };

  if (isLoading) return <Loading />;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-lg"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-transparent z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 shadow-md z-50 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}
      >
        {/* Header */}
        <div className="p-4 flex items-center gap-3 border-gray-200">
          <img src={MainLogo} className='w-11' alt="Logo" />
          <h2 className="text-xl font-bold text-gray-700">HealthHive</h2>
        </div>

        {/* Nav Items */}
        <nav className="p-4 text-sm space-y-6">
          <div>
            <h3 className="text-xs uppercase font-bold text-gray-400 mb-2 px-2">
              Dashboard Management
            </h3>
            <ul className="space-y-1">
              {getNavItems().map((item) => (
                <li key={item.id}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'}`
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <Link to="/" className="btn btn-secondary text-white rounded-full flex items-center gap-1">
            <MdArrowBackIosNew />
            <span>Back to Home</span>
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default SideBar;
