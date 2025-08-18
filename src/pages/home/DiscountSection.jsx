import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../components/ui/Loading';
import { FaCartShopping } from "react-icons/fa6";
import { Link } from "react-router"; // fix if using react-router-dom => 'react-router-dom'
import { FaLongArrowAltRight } from "react-icons/fa";
import Swal from 'sweetalert2';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';
import { IoClose } from "react-icons/io5";

const DiscountSection = () => {
    const axiosPublic = useAxios();
    const { user } = useAuth();
    const { role } = useRole();
    const [selectedMedicine, setSelectedMedicine] = useState(null);

    const { data: discountedMedicines = [], isLoading } = useQuery({
        queryKey: ['discountedMedicines'],
        queryFn: async () => {
            const res = await axiosPublic.get('/medicines/discount');
            return res.data;
        }
    });

    const handleSelect = async (medicine) => {
        if (!user) {
            Swal.fire({
                icon: 'info',
                title: 'Login Required',
                text: 'Please login to order medicine.',
                timer: 1500,
                showConfirmButton: false,
            });
            return;
        }

        const discountedPrice = medicine.discount
            ? parseFloat((medicine.price - (medicine.price * medicine.discount) / 100).toFixed(2))
            : medicine.price;

        const order = {
            name: medicine.name,
            image: medicine.image,
            company: medicine.company,
            category: medicine.category,
            generic_name: medicine.generic_name,
            mass_unit: medicine.mass_unit,
            price: discountedPrice,
            discount: medicine.discount || 0,
            seller_name: medicine.seller_name,
            seller_email: medicine.seller_email,
            customer_name: user.displayName,
            customer_email: user.email,
            quantity: 1,
            order_status: "pending",
            payment_status: "pending",
            payment: 0,
        };

        try {
            const res = await axiosPublic.post("/order-medicine", order);
            if (res.data.insertedId) {
                Swal.fire({
                    icon: "success",
                    title: "Medicine ordered successfully",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Order failed",
                text: err?.response?.data?.message || "Please try again later.",
                timer: 1500,
                showConfirmButton: false,
            });
        }
    };

    if (isLoading) return <Loading />;
    if (discountedMedicines.length === 0) return null;

    return (
        <div className="my-10 px-4 pb-8 md:px-8 bg-sky-50 rounded-2xl">
            <div className='flex justify-between py-8'>
                <h1 className='text-xl md:text-3xl font-semibold'>Discount Medicines</h1>
                <Link to="/shop-page" className='text-lg md:text-2xl text-sky-600 hover:text-sky-500 flex gap-1 items-center border-b-2'>
                    View All <FaLongArrowAltRight />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {discountedMedicines.slice(0, 4).map((item) => {
                    const discountedPrice = item.discount
                        ? parseFloat((item.price - (item.price * item.discount) / 100).toFixed(2))
                        : item.price;

                    return (
                        <div
                            key={item._id}
                            className="w-full max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
                        >
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
                                    <h2 className="text-xl font-semibold line-clamp-2">
                                        {item.name}
                                    </h2>

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
                                            <span className="text-gray-400 line-through">
                                                {item.price}৳
                                            </span>
                                        )}
                                        <span className={`font-semibold ${item.discount > 0 ? "text-green-600" : "text-black"}`}>
                                            {discountedPrice}৳
                                        </span>
                                        {item.discount > 0 && (
                                            <span className="text-blue-600 text-sm font-medium">
                                                ({item.discount}% off)
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => setSelectedMedicine(item)}
                                        className="block flex-1 bg-primary text-white py-2 rounded-full text-center font-medium hover:bg-sky-600 transition-colors cursor-pointer"
                                    >
                                        View details
                                    </button>
                                    <button className="flex-1">
                                        <FaCartShopping
                                            size={18}
                                            onClick={() => role !== "admin" && role !== "seller" && handleSelect(item)}
                                            className={`w-full h-10 p-2 rounded-full text-white ${role === "admin" || role === "seller"
                                                ? "bg-gray-300 cursor-not-allowed"
                                                : "bg-secondary hover:bg-sky-500 cursor-pointer"
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {selectedMedicine && (
                <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                        <button
                            onClick={() => setSelectedMedicine(null)}
                            className="absolute top-3 right-3 text-gray-600 hover:text-black"
                        >
                            <IoClose size={24} />
                        </button>

                        <div className="flex flex-col items-center text-center space-y-4">
                            <img src={selectedMedicine.image} alt={selectedMedicine.name} className="h-40 object-contain" />
                            <h2 className="text-2xl font-semibold">{selectedMedicine.name}</h2>
                            <p className="text-gray-600">
                                <span className='text-primary font-medium'>Category: </span> {selectedMedicine.category}

                            </p>
                            <p className="text-gray-600">
                                <span className='text-primary font-medium'>Company: </span> {selectedMedicine.company}
                            </p>
                            <p className="text-gray-600">
                                <span className='text-primary font-medium'>Generic: </span> {selectedMedicine.generic_name}
                            </p>

                            <div className="flex gap-2 justify-center items-center">
                                <span className='text-primary font-medium'>Price</span>
                                {selectedMedicine.discount > 0 && (
                                    <span className="text-gray-400 line-through">{selectedMedicine.price}৳</span>
                                )}
                                <span className="text-green-600 font-bold">
                                    {selectedMedicine.discount > 0
                                        ? parseFloat((selectedMedicine.price - (selectedMedicine.price * selectedMedicine.discount) / 100).toFixed(2))
                                        : selectedMedicine.price
                                    }৳
                                </span>
                                {selectedMedicine.discount > 0 && (
                                    <span className="text-blue-600 text-sm font-medium">({selectedMedicine.discount}% off)</span>
                                )}
                            </div>
                            <div className='flex gap-3'>
                                <button
                                    onClick={() => handleSelect(selectedMedicine)}
                                    disabled={role === "admin" || role === "seller"}
                                    className={`px-4 py-2 rounded transition flex justify-center items-center gap-2 ${role === "admin" || role === "seller"
                                        ? "bg-gray-400 cursor-not-allowed text-white"
                                        : "bg-secondary hover:bg-sky-500 rounded-full cursor-pointer text-white"}`}
                                >
                                    Add to Cart <FaCartShopping />
                                </button>
                                <button  onClick={() => setSelectedMedicine(null)} className='btn btn-error rounded-full text-white'>
                                    Close
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscountSection;
