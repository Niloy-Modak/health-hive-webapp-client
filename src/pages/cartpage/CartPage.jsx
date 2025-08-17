import { useQuery } from "@tanstack/react-query";
import { useState, Fragment, useEffect } from "react";
import { TiPlus } from "react-icons/ti";
import { FiMinus } from "react-icons/fi";
import { Dialog, Transition } from "@headlessui/react";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/ui/Loading";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router";
import EmptyCartPage from "../checkoutPage/EmptyCartPage";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const CartPage = () => {
    useEffect(() => {
        document.title = 'My Cart';
    }, []);
    
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure()
    const navigate = useNavigate();

    const [selectedItem, setSelectedItem] = useState(null);
    const [modalQuantity, setModalQuantity] = useState(1);

    const { data: cartItems = [], isLoading, refetch } = useQuery({
        queryKey: ['cart', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/cart/${user.email}`);
            return res.data;
        }
    });

    useEffect(() => {
        if (selectedItem) {
            setModalQuantity(selectedItem.quantity);
        }
    }, [selectedItem]);

    if (isLoading) return <Loading />;

    const handleQuantityChange = async (id, type, isModal = false) => {
        const item = cartItems.find(item => item._id === id);
        let updatedQty = item.quantity;

        if (type === "increase") updatedQty++;
        else if (type === "decrease" && item.quantity > 1) updatedQty--;

        const res = await axiosSecure.patch(`/cart/quantity/${id}`, { quantity: updatedQty });
        if (res.data.modifiedCount) {
            refetch();
            if (isModal) setModalQuantity(updatedQty);
        }
    };

    //clear or remove
    const handleRemove = async (id) => {
        const res = await axiosSecure.delete(`/cart/remove/${id}`);
        if (res.data.deletedCount) {
            refetch();
            if (selectedItem?._id === id) setSelectedItem(null);
        }
    };

    const handlePayment = (id) => {
        navigate(`/payment-checkout/${id}`)
    }


    return (
        <>
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold ">Your Cart ({cartItems.length})</h2>
                    {cartItems.length > 0 && (
                        <button onClick={async () => {
                            const res = await axiosSecure.delete(`/cart/clear/${user.email}`);
                            if (res.data.deletedCount) refetch();
                        }} className="btn btn-sm btn-outline btn-error">
                            Clear All
                        </button>
                    )}
                </div>

                {cartItems.length === 0 ? (
                    <EmptyCartPage/>
                ) : (
                    <div className="overflow-x-auto shadow border border-gray-300 rounded-lg">
                        <table className="table w-full table-zebra">
                            <thead className="bg-base-200 text-base text-gray-800 font-semibold">
                                <tr>
                                    <th>Image</th>
                                    <th>Medicine</th>
                                    <th className="hidden md:table-cell">Company</th>
                                    <th className="hidden md:table-cell">Price</th>
                                    <th className="hidden md:table-cell ">Quantity</th>
                                    <th className="hidden md:table-cell">Total</th>
                                    <th className="hidden md:table-cell text-center">Actions</th>
                                    <th className="md:hidden text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map(item => (
                                    <tr key={item._id}>
                                        <td><img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" /></td>
                                        <td>{item.name}</td>
                                        <td className="hidden md:table-cell">{item.company}</td>
                                        <td className="hidden md:table-cell">{item.price} ৳</td>
                                        <td className="hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleQuantityChange(item._id, "decrease")} className="btn btn-sm btn-error btn-outline hover:text-white"><FiMinus /></button>
                                                <span className="text-lg mx-1 font-medium">{item.quantity}</span>
                                                <button onClick={() => handleQuantityChange(item._id, "increase")} className="btn btn-sm btn-success btn-outline"><TiPlus /></button>
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell">{(item.price * item.quantity).toFixed(2)} ৳</td>
                                        <td className="hidden md:table-cell text-center">
                                            <div className="flex flex-col md:flex-row md:justify-center gap-2">

                                                {/* payment checkout */}
                                                <button onClick={() => handlePayment(item._id)} className="btn btn-sm btn-primary">
                                                    Checkout
                                                </button>
                                                <button onClick={() => handleRemove(item._id)} className="btn btn-sm btn-error text-white">
                                                    <FaTrashAlt size={16} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="md:hidden">
                                            <button onClick={() => setSelectedItem(item)} className="btn btn-xs btn-primary w-full">Checkout</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

             
            </div>

            {/* Checkout Modal */}
            <Transition appear show={!!selectedItem} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setSelectedItem(null)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="scale-95 opacity-0"
                                enterTo="scale-100 opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="scale-100 opacity-100"
                                leaveTo="scale-95 opacity-0"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                                    <Dialog.Title className="text-lg font-bold mb-4">
                                        Checkout Item
                                    </Dialog.Title>

                                    {selectedItem && (
                                        <>
                                            <img src={selectedItem.image} alt={selectedItem.name} className="w-24 h-24 object-cover rounded mb-4" />
                                            <p><strong>Name:</strong> {selectedItem.name}</p>
                                            <p><strong>Company:</strong> {selectedItem.company}</p>
                                            <p><strong>Price:</strong> {selectedItem.price} ৳</p>

                                            <div className="flex items-center gap-2 mt-3">
                                                <button onClick={() => handleQuantityChange(selectedItem._id, "decrease", true)} className="btn btn-sm">-</button>
                                                <span>{modalQuantity}</span>
                                                <button onClick={() => handleQuantityChange(selectedItem._id, "increase", true)} className="btn btn-sm">+</button>
                                            </div>

                                            <p className="mt-2"><strong>Total:</strong> {selectedItem.price * modalQuantity} ৳</p>

                                            <div className="mt-5 flex justify-between">
                                                <button className="btn btn-error" onClick={() => handleRemove(selectedItem._id)}>Remove</button>
                                                <button className="btn btn-primary" onClick={() => handlePayment(selectedItem._id)}>
                                                    Proceed to Pay
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    <div className="mt-4 text-right">
                                        <button className="btn btn-sm" onClick={() => setSelectedItem(null)}>Close</button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default CartPage;
