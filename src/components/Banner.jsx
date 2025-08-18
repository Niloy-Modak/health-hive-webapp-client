import React from 'react';
import BannerImg from '../assets/banner/banner_1.png'

const Banner = () => {
    return (
        <div className="w-full max-w-7xl mx-auto ">
            <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                    src={BannerImg}
                    alt="Pharmacy Banner"
                    className="w-full h-auto object-cover"
                />
            </div>
        </div>
    );
};

export default Banner;
