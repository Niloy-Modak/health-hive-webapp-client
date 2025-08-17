import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { IoCart } from 'react-icons/io5';
import { Link } from 'react-router';

const ShopCart = () => {
    return (
        <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden flex flex-col ">

            {/* Image */}
            <div className="h-[240px] w-full">
                <img
                    src={"https://www.autocar.co.nz/wp-content/uploads/2024/06/Bugatti-Tourbillon-2026-1600-01-750x375.jpg"}
                    alt={"title"}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between p-4 text-center">
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold line-clamp-2">
                       Name :
                    </h2>

                    <div className="flex flex-wrap justify-center gap-1 text-base font-medium">
                        <span className="text-[#509E2F]">Category:</span>
                       
                    </div>

                    <div className="flex items-center justify-center gap-2 text-gray-600">
                        <span className=" font-semibold">Company:</span>
                        <span>people interested</span>
                    </div>
                </div>

                {/* Button */}
                <div className="mt-4 flex gap-2">
                    <Link
                        // to={`/recipe/${_id}`}
                        className="block flex-1/2  bg-[#509E2F] text-white py-2 rounded-full text-center font-medium hover:bg-green-600 transition-colors"
                    >
                        View details
                    </Link>
                    <button className='flex-1/2'>
                        <IoCart size={16} className='w-full h-10 p-1 rounded-xl bg-blue-400 hover:bg-blue-500 cursor-pointer text-white'/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShopCart;