import React, { useEffect } from 'react';
import Banner from '../../components/Banner';
import FeaturesSection from './FeaturesSection';
import AboutUs from './AboutUs';
import MissionSection from './MissionSection';
import HowItWorks from './HowItWorks';
import DiscountSection from './DiscountSection';

const Home = () => {
    useEffect(() => {
        document.title = 'HealthHive - Online Medicine Store (home page)';
    }, []);

    return (
        <div>
            <Banner/>
            <FeaturesSection/>
            <DiscountSection/>
            <AboutUs/>
            <HowItWorks/>
            <MissionSection/>
        </div>
    );
};

export default Home;