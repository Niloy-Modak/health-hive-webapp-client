import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../components/ui/Loading';
import { FaCartShopping } from "react-icons/fa6";
import { Link } from "react-router"; // fix router import
import { FaLongArrowAltRight } from "react-icons/fa";
import Swal from 'sweetalert2';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';

const DiscountSection = () => {
    const axiosPublic = useAxios();
    const { user } = useAuth();
    const { role } = useRole()
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
                <h1 className='text-2xl md:text-3xl font-semibold'>Discount Medicines</h1>
                <Link to="/shop-page" className='text-xl md:text-2xl text-sky-600 hover:text-sky-500 flex gap-1 items-center border-b-2'>
                    View All <FaLongArrowAltRight />
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {discountedMedicines.slice(0, 4).map((med) => {
                    const discountedPrice = med.discount
                        ? parseFloat((med.price - (med.price * med.discount) / 100).toFixed(2))
                        : med.price;

                    return (
                        <div
                            key={med._id}
                            className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between"
                        >
                            <img
                                src={med.image}
                                alt={med.name}
                                className="h-40 object-contain mb-3"
                            />
                            <h3 className="text-lg font-semibold">{med.name}</h3>
                            <p className="text-gray-700 mb-2">
                                {med.discount ? (
                                    <>
                                        <span className="text-red-500 font-bold">${discountedPrice}</span>
                                        <span className="line-through text-gray-400 ml-2">${med.price}</span>
                                        <span className="ml-2 text-green-600 text-sm">({med.discount}% off)</span>
                                    </>
                                ) : (
                                    <>${med.price}</>
                                )}
                            </p>
                            <button
                                onClick={() => handleSelect(med)}
                                disabled={role === 'admin' || role === 'seller'}
                                className={`px-4 py-2 rounded transition flex justify-center items-center gap-2 
                                          ${role === 'admin' || role === 'seller'
                                        ? 'bg-gray-400 cursor-not-allowed text-white'
                                        : 'bg-sky-500 hover:bg-sky-600 text-white'}`}
                            >
                                Add to Cart <FaCartShopping />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DiscountSection;
