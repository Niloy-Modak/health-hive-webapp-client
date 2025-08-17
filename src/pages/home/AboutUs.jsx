import React from "react";

const AboutUs = () => {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Text Section */}
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        About HealthHive
                    </h2>
                    <p className="text-gray-600 text-lg mb-4">
                        HealthHive is your trusted online pharmacy, committed to providing
                        easy access to genuine medicines, healthcare products, and wellness
                        essentials. We aim to improve lives by offering a simple, secure,
                        and fast medicine ordering experience.
                    </p>
                    <p className="text-gray-600 text-md">
                        Our platform connects users with verified sellers, ensures
                        transparent pricing, and offers multiple payment options for your
                        convenience. Whether you’re looking for regular prescriptions or
                        over-the-counter products, HealthHive is here to serve you with care.
                    </p>
                </div>

                {/* Image Section */}
                <div className="flex justify-center">
                    <img
                        src="https://img.freepik.com/free-vector/online-doctor-concept-illustration_114360-5806.jpg?w=826&t=st=1718640382~exp=1718640982~hmac=efe118f33422dc593f8efacb8aaeaefaf4ec9d16dcb6d4c35ff29a3c65076df3"
                        alt="About HealthHive"
                        className="rounded-xl shadow-lg w-full max-w-md"
                    />
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
