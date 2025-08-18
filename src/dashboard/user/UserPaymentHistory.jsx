import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Dialog, Transition } from "@headlessui/react";
import { FaEye } from "react-icons/fa"
import { Fragment } from "react";
import NoPaymentHistoryPage from "../../pages/NoPaymentHistoryPage";
import Loading from "../../components/ui/Loading";

const UserPaymentHistory = () => {
    const { user } = useAuth();
    const { role, isLoading: roleLoading } = useRole();
    const axiosSecure = useAxiosSecure();

    const { data, isLoading, error } = useQuery({
        queryKey: ["paymentHistory", user?.email],
        queryFn: async () => {
            if (!user?.email) return { payments: [] };

            const res = await axiosSecure.get(`/payments/history/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email && !roleLoading && !!role,
    });

    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const openModal = (payment) => {
        setSelectedPayment(payment);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedPayment(null);
    };

    if (roleLoading || isLoading) return <Loading/>;
    if (error) return <div>Error loading payment history: {error.message}</div>;
    if (!data || data.payments.length === 0)
        return <NoPaymentHistoryPage />;

    return (
        <section className="w-[90%] lg:w-[85%] mx-auto">
            <div className="overflow-x-auto rounded-xl shadow-md border mt-6 border-gray-200">
                <table className="min-w-full bg-white text-sm text-gray-700">
                    <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-gray-700 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3 text-left">Medicine Image</th>
                            <th className="px-4 py-3 text-left">Medicine Name</th>
                            <th className="px-4 py-3 text-left">Payment Status</th>
                            <th className="px-4 py-3 text-left hidden md:table-cell">Price</th>
                            <th className="px-4 py-3 text-left hidden md:table-cell">Transaction ID</th>
                            <th className="px-4 py-3 text-left hidden md:table-cell">Payment Time</th>
                            <th className="px-4 py-3 text-left md:hidden">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.payments.map((payment, index) => (
                            <tr
                                key={payment._id}
                                className={index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}
                            >
                                <td className="px-4 py-3">
                                    <img
                                        src={payment.image}
                                        alt={payment.medicine_name}
                                        className="w-14 h-14 object-cover rounded border"
                                    />
                                </td>
                                <td className="px-4 py-3 font-medium">{payment.name}</td>
                                <td className="px-4 py-3">
                                    <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                        {payment.payment_status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 font-semibold text-blue-600 hidden md:table-cell">
                                    {payment.payment} ৳
                                </td>
                                <td className="px-4 py-3 break-all text-xs text-gray-600 hidden md:table-cell">
                                    {payment.transactionId}
                                </td>
                                <td className="px-4 py-3 break-all text-xs text-gray-600 hidden md:table-cell">
                                    {new Date(payment.payment_time).toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </td>
                                <td className="px-4 py-3 md:hidden">
                                    <button
                                        onClick={() => openModal(payment)}
                                        className="text-blue-600 hover:text-blue-800 transition"
                                    >
                                        <FaEye />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for mobile & details */}
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
                                            <div>
                                                <strong>Medicine:</strong> {selectedPayment.name}
                                            </div>
                                            <div>
                                                <strong>Status:</strong>{" "}
                                                <span className="text-green-600 font-semibold">
                                                    {selectedPayment.payment_status}
                                                </span>
                                            </div>
                                            <div>
                                                <strong>Price:</strong> ${selectedPayment.payment}
                                            </div>
                                            <div>
                                                <strong>Transaction ID:</strong>{" "}
                                                <span className="break-words">
                                                    {selectedPayment.transactionId}
                                                </span>
                                            </div>
                                            <div>
                                                <strong>Payment Time:</strong>{" "}
                                                <span className="break-words">
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
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
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

export default UserPaymentHistory;
