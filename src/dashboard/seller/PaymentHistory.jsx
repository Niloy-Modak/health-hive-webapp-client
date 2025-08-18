import React, { useEffect, useState, Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Dialog, Transition } from "@headlessui/react";
import { FaEye } from "react-icons/fa";
import NoPaymentHistoryPage from "../../pages/NoPaymentHistoryPage";
import Loading from "../../components/ui/Loading";

const PaymentHistory = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        document.title = 'Seller Dashboard - Payment History';
    }, []);

    const { data: payments = [], isLoading, error } = useQuery({
        queryKey: ["sellerPaymentHistory", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/seller/payment-history/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    const openModal = (payment) => {
        setSelectedPayment(payment);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedPayment(null);
    };

    if (isLoading) return <Loading/>;
    if (error) return <div>Error loading data: {error.message}</div>;
    if (!payments.length) return <NoPaymentHistoryPage />;


    return (
        <section className="w-[90%] lg:w-[85%] mx-auto">
            <div className="overflow-x-auto rounded-xl shadow-md border mt-6 border-gray-200">
                <table className="min-w-full bg-white text-sm text-gray-700">
                    <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-gray-700 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3 text-left">Medicine Image</th>
                            <th className="px-4 py-3 text-left">Medicine Name</th>
                            <th className="px-4 py-3 text-left hidden md:table-cell">Customer Email</th>
                            <th className="px-4 py-3 text-left hidden md:table-cell">Quantity</th>
                            <th className="px-4 py-3 text-left hidden md:table-cell">Payment</th>
                            <th className="px-4 py-3 text-left hidden lg:table-cell">Transaction ID</th>
                            <th className="px-4 py-3 text-left ">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {payments.map((payment, index) => (
                            <tr key={payment._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}>
                                <td className="px-4 py-3">
                                    <img
                                        src={payment.image}
                                        alt={payment.medicine_name}
                                        className="w-14 h-14 object-cover rounded border"
                                    />
                                </td>
                                <td className="px-4 py-3 font-medium">{payment.name}</td>
                                <td className="px-4 py-3 text-sm hidden md:table-cell">{payment.customer_email}</td>
                                <td className="px-4 py-3 hidden md:table-cell">{payment.quantity}</td>
                                <td className="px-4 py-3 font-semibold text-green-600 hidden md:table-cell">
                                    ৳{payment.payment}
                                </td>
                                <td className="px-4 py-3 text-xs break-all text-gray-600 hidden lg:table-cell">
                                    {payment.transactionId}
                                </td>
                                <td className="px-4 py-3 ">
                                    <button onClick={() => openModal(payment)} className="text-green-600 cursor-pointer p-4 hover:text-green-800 transition">
                                        <FaEye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for mobile / details */}
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-200"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-150"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title className="text-lg font-bold text-gray-800 mb-4">
                                        Payment Details
                                    </Dialog.Title>
                                    {selectedPayment && (
                                        <div className="space-y-4 text-sm text-gray-700">
                                            <img
                                                src={selectedPayment.image}
                                                alt={selectedPayment.medicine_name}
                                                className="w-24 h-24 object-cover rounded mx-auto"
                                            />
                                            <div><strong>Medicine:</strong> {selectedPayment.name}</div>
                                            <div><strong>Company:</strong> {selectedPayment.company}</div>
                                            <div><strong>Category:</strong> {selectedPayment.category}</div>
                                            <div><strong>Quantity:</strong> {selectedPayment.quantity}</div>
                                            <div><strong>Payment:</strong> ৳{selectedPayment.payment}</div>
                                            <div><strong>Customer Email:</strong> {selectedPayment.customer_email}</div>
                                            <div><strong>Transaction ID:</strong> <span className="break-words px-1">{selectedPayment.transactionId}</span></div>
                                            <div><strong>Payment Status:</strong> <span className="text-green-600 font-semibold">{selectedPayment.payment_status}</span></div>
                                            <div><strong>Payment Time:</strong>
                                                <span className="px-2">
                                                    {new Date(selectedPayment.payment_time).toLocaleString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                        hour: "numeric",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="mt-6 text-right">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                                            onClick={closeModal}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </section>
    );
};

export default PaymentHistory;
