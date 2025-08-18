import React from 'react';
import logo from '../assets/logo/main-logo.png'

const Footer = () => {
    return (
        <footer className="footer footer-horizontal footer-center bg-sky-100 text-primary-content p-10">
            <aside>
                <img src={logo} className='w-16' alt="" />
                <p className="font-bold text-primary">
                    HealthHive Ltd.
                </p>
                <p className='text-gray-500'>Copyright © {new Date().getFullYear()} - All right reserved</p>
            </aside>
        
        </footer>
    );
};

export default Footer;