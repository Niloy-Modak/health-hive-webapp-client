import React, { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import MainLogo from '../assets/logo/main-logo.png';
import { NavLink, useNavigate } from 'react-router'; 
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';  
import Swal from 'sweetalert2';
import blankProfile from '../assets/blankProfile/blank-profile-image.png';

const NavBar = () => {
    const { user, logOut } = useAuth();
    const { role, isLoading: isRoleLoading } = useRole();

    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const profileImg = user?.photoURL || blankProfile;

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure to Logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e65619",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, log out!"
        }).then((result) => {
            if (result.isConfirmed) {
                logOut()
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Logged out successfully',
                            showConfirmButton: false,
                            timer: 1500
                        }).then(() => {
                            navigate('/');
                        });
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Logout Failed',
                            text: error.message || 'Something went wrong'
                        });
                    });
            }
        });
    };

    // Close sidebar on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setIsOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close sidebar on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (isRoleLoading) {
        // optional: show loading state if role is loading
        return null; // or spinner
    }

    // Define nav links dynamically based on role
    const navLinks = [
        { name: "Home", to: "/" },
        { name: "Shop Page", to: "/shop-page" },
        ...(user
            ? [{
                name: "Dashboard",
                to:
                    role === "admin"
                        ? "/dashboard/admin-dashboard"
                        : role === "seller"
                            ? "/dashboard/seller-homepage"
                            : role === "user"
                                ? "/dashboard/user-payment-history"
                                : "/dashboard"
            }]
            : []),
        ...(role === "user" ? [{ name: "Cart Page", to: "/cart-page" }] : [])
    ];

    return (
        <nav className="bg-white shadow-md w-full fixed top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <img src={MainLogo} className="w-10 md:w-11" alt="logo" />
                        <span className="text-xl font-bold text-gray-800">HealthHive</span>
                    </div>

                    {/* Desktop Nav */}
                    <ul className="hidden lg:flex gap-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.to}
                                className={({ isActive }) => `${isActive ? "text-primary font-semibold rounded-none border-b-4" : ""}`}

                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </ul>

                    {/* Right side - Desktop */}
                    <div className="hidden lg:flex items-center gap-4">
                        {user ? (
                            <>
                                <img
                                    src={profileImg}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full object-cover shadow-2xs"
                                    title={user.displayName}
                                />
                                <button
                                    onClick={handleLogout}
                                    className="btn md:btn-sm lg:btn-md btn-outline btn-error"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <NavLink to="/auth/login" className="btn md:btn-sm lg:btn-md btn-primary">
                                Login
                            </NavLink>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center gap-2">
                        <div>
                            <img
                                src={profileImg}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover shadow-2xs"
                            />
                        </div>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-800 hover:text-blue-600 focus:outline-none"
                        >
                            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                ref={menuRef}
                className={`lg:hidden fixed top-16 right-0 w-64 h-[calc(100vh-4rem)] bg-white shadow-lg transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col p-4 space-y-4">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.to}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `text-gray-800 hover:bg-gray-100 hover:text-blue-600 px-4 py-2 rounded-md font-medium transition ${isActive ? 'bg-blue-100 font-semibold' : ''
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}

                    {user ? (
                        <button
                            onClick={() => {
                                handleLogout();
                                setIsOpen(false);
                            }}
                            className="btn btn-sm btn-error w-full mt-2"
                        >
                            Logout
                        </button>
                    ) : (
                        <NavLink
                            to="/auth/login"
                            onClick={() => setIsOpen(false)}
                            className="btn btn-sm btn-primary w-full"
                        >
                            Login
                        </NavLink>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
