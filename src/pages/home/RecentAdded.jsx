
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { IoCart } from 'react-icons/io5';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const RecentAdded = ({ role }) => {
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const axiosSecure = useAxiosSecure();

    // Function to calculate discounted price
    const getDiscountedPrice = (price, discount) => {
        return (price - (price * discount) / 100).toLocaleString();
    };

    // Fetch medicines
    const { data: medicines = [], isLoading } = useQuery({
        queryKey: ['medicines'],
        queryFn: async () => {
            const res = await axiosSecure.get('/medicines');
            return res.data.sort((a, b) =>
                b.createdAt ? new Date(b.createdAt) - new Date(a.createdAt) :
                    parseInt(b._id.slice(0, 8), 16) - parseInt(a._id.slice(0, 8), 16)
            );
        },
    });


    if (isLoading) return <p className="text-center py-10">Loading...</p>;

    // Take only the recent 4 items
    const recentMedicines = medicines.slice(0, 4);

    return (
        <section className="pb-10 pt-14">
            
            <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 lg:mb-10 text-center">Recently Added Medicines</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentMedicines.map((item) => (
                    <div key={item._id} className="w-full max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden flex flex-col ">
                        {/* Image */}
                        <div className="h-[240px] w-full">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between p-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold line-clamp-2">{item.name}</h2>

                                <div className="flex flex-wrap justify-center gap-1 text-base font-medium">
                                    <span className="text-[#509E2F]">Category:</span>
                                    <span className="text-gray-600">{item.category}</span>
                                </div>

                                <div className="flex items-center justify-center gap-2 text-gray-600">
                                    <span className="font-semibold">Company:</span>
                                    <span>{item.company}</span>
                                </div>

                                <div className="flex items-center gap-2 justify-center">
                                    <span className="font-semibold">Price :</span>

                                    {item.discount > 0 && (
                                        <span className="text-gray-400 line-through">{item.price}৳</span>
                                    )}

                                    <span className={`font-semibold ${item.discount > 0 ? "text-green-600" : "text-black"}`}>
                                        {item.discount > 0 ? getDiscountedPrice(item.price, item.discount) : item.price}৳
                                    </span>

                                    {item.discount > 0 && (
                                        <span className="text-blue-600 text-sm font-medium">({item.discount}% off)</span>
                                    )}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => setSelectedMedicine(item)}
                                    className="flex-1 bg-primary cursor-pointer text-white py-2 rounded-full font-medium hover:bg-sky-600 transition-colors"
                                >
                                    View details
                                </button>
                               
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for selected medicine */}
            {selectedMedicine && (
                <div className="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                        <button
                            onClick={() => setSelectedMedicine(null)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
                        >
                            ✕
                        </button>
                        <img src={selectedMedicine.image} alt={selectedMedicine.name} className="w-full h-64 object-cover rounded" />
                        <h2 className="text-xl font-bold mt-4">{selectedMedicine.name}</h2>
                        <p className="text-gray-600 mt-2">Category: {selectedMedicine.category}</p>
                        <p className="text-gray-600 mt-1">Company: {selectedMedicine.company}</p>
                        <p className="mt-2">
                            Price:
                            {selectedMedicine.discount > 0 && (
                                <span className="line-through text-gray-400 ml-1">{selectedMedicine.price}৳</span>
                            )}
                            <span className="font-semibold ml-1 text-green-600">
                                {selectedMedicine.discount > 0
                                    ? getDiscountedPrice(selectedMedicine.price, selectedMedicine.discount)
                                    : selectedMedicine.price}৳
                            </span>
                            {selectedMedicine.discount > 0 && (
                                <span className="text-blue-600 text-sm font-medium ml-1">({selectedMedicine.discount}% off)</span>
                            )}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default RecentAdded;
