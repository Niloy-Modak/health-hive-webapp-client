import React from 'react';
import { Outlet } from 'react-router';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
    return (
        <>
          <header>
            <NavBar/>
          </header>  
          <main className='mt-16 lg:mt-[74px] min-h-[calc(100vh-264px)] max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-6'>
            <Outlet/>
          </main>
          <Footer/>
        </>
    );
};

export default MainLayout;