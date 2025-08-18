import React from 'react';
import { FaCapsules, FaTruck, FaCreditCard, FaUserShield } from 'react-icons/fa';

const FeaturesSection = () => {
    const features = [
        {
            icon: <FaCapsules className="text-4xl text-blue-600" />,
            title: "Wide Range of Medicines",
            description: "Explore a large collection of prescription and non-prescription medicines from trusted brands and categories.",
        },
        {
            icon: <FaTruck className="text-4xl text-green-600" />,
            title: "Fast Delivery",
            description: "Get your medicines delivered quickly and safely right to your doorstep anywhere in the country.",
        },
        {
            icon: <FaCreditCard className="text-4xl text-purple-600" />,
            title: "Secure Payment",
            description: "We offer secure and multiple payment methods including cards, mobile payments, and Stripe checkout.",
        },
        {
            icon: <FaUserShield className="text-4xl text-red-600" />,
            title: "Verified Sellers",
            description: "All medicines are sold by verified and approved sellers ensuring trust and quality for every order.",
        },
    ];

    return (
        <section className="py-12 my-12 px-4 bg-gray-100 rounded-2xl">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-8 text-gray-800">Why Choose HealthHive?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                            <div className="mb-4 flex justify-center">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2 text-primary">{feature.title}</h3>
                            <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
