import React from "react";
import { Link } from "react-router";
import mdiBanner from "../../assets/banner/SS-banner.png";

const MediSection1 = () => {
  return (
    <section className="relative min-h-[500px] flex items-center justify-start">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={mdiBanner}
          alt="Medicine Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 bg-opacity-50 "></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl px-6 lg:px-12 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Trusted Medicines at Your Doorstep
        </h1>
        <p className="text-lg mb-8 leading-relaxed">
          Get genuine and affordable medicines from HealthHive.
          Fast delivery, verified sellers, and 24/7 support for your healthcare needs.
        </p>
        <Link
          to="/shop-page"
          className="px-6 py-3 btn btn-primary rounded-full font-medium transition duration-300"
        >
          Shop Medicines Now
        </Link>
      </div>
    </section>
  );
};

export default MediSection1;
