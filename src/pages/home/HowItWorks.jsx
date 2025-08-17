import React from "react";
import { FaSearch, FaShoppingCart, FaCreditCard, FaCheckCircle } from "react-icons/fa";

const HowItWorks = () => {
    const steps = [
        {
            icon: <FaSearch className="text-3xl text-blue-600" />,
            title: "1. Browse Medicines",
            description: "Search or explore a wide range of genuine medicines and healthcare products.",
        },
        {
            icon: <FaShoppingCart className="text-3xl text-green-600" />,
            title: "2. Add to Cart",
            description: "Easily add your desired items to the cart and manage quantities.",
        },
        {
            icon: <FaCreditCard className="text-3xl text-purple-600" />,
            title: "3. Make Payment",
            description: "Pay securely via Stripe, cards, or mobile wallets.",
        },
        {
            icon: <FaCheckCircle className="text-3xl text-red-600" />,
            title: "4. Get Delivery",
            description: "Sit back and relax while we deliver your order to your doorstep.",
        },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-10">How It Works</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300"
                        >
                            <div className="mb-4 flex justify-center">{step.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">{step.title}</h3>
                            <p className="text-gray-600 text-sm">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
