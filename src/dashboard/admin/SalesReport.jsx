import React, { useEffect, useState, Fragment, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, Transition } from "@headlessui/react";
import { FaEye } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DownloadTableExcel } from "react-export-table-to-excel";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import NoPaymentHistoryPage from "../../pages/NoPaymentHistoryPage";
import Loading from "../../components/ui/Loading";

const SalesReport = () => {
    const { user } = useAuth();
    const { role, isLoading: roleLoading } = useRole();
    const axiosSecure = useAxiosSecure();

    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const tableRef = useRef(null);

    useEffect(() => {
        document.title = 'Admin Dashboard - Sales Reports';
    }, []);

    const { data: payments = [], isLoading, error } = useQuery({
        queryKey: ["allConfirmedSales", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/admin/payments/all-confirmed?email=${user.email}`);
            return res.data;
        },
        enabled: !!user?.email && role === "admin" && !roleLoading,
    });

    const openModal = (payment) => {
        setSelectedPayment(payment);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedPayment(null);
    };

    // Filter by date range
    const filteredPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.payment_time);
        return (!startDate || paymentDate >= startDate) && (!endDate || paymentDate <= endDate);
    });

    const totalSales = filteredPayments.reduce((acc, cur) => acc + (cur.quantity || 0), 0);

    if (roleLoading || isLoading) return <Loading/>;
    if (error) return <div>Error loading data: {error.message}</div>;
    if (!payments.length) return <NoPaymentHistoryPage />;

    const handleExportPDF = () => {
        const doc = new jsPDF();

        doc.text("Sales Report", 14, 15);

        const tableColumn = [
            "Medicine Name",
            "Buyer Email",
            "Seller Email",
            "Quantity",
            "Payment (৳)",
            "Transaction ID",
        ];

        const tableRows = filteredPayments.map((payment) => [
            payment.name,
            payment.customer_email,
            payment.seller_email,
            payment.quantity,
            payment.payment,
            payment.transactionId,
        ]);

        // Use autoTable like this
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 8 },
        });

        doc.save("sales_report.pdf");
    };

    return (
        <section className="w-[90%] lg:w-[85%] mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-6 mb-4">
                Total Sales: {totalSales}
            </h2>

            {/* Filters + Export */}
            <div className="flex flex-col md:flex-row justify-between gap-4 items-center mb-4">
                <div className="flex flex-col md:flex-row gap-2 items-center">
                    <label className="font-medium text-sm">From:</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        className="border p-1 rounded-md text-sm"
                        placeholderText="Start date"
                    />
                    <label className="font-medium text-sm">To:</label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        className="border p-1 rounded-md text-sm"
                        placeholderText="End date"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleExportPDF}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                    >
                        Export PDF
                    </button>
                    <DownloadTableExcel
                        filename="sales_report"
                        sheet="SalesReport"
                        currentTableRef={tableRef.current}
                    >
                        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
                            Export Excel
                        </button>
                    </DownloadTableExcel>
                </div>
            </div>

            {/* Sales Table */}
            <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
                <table ref={tableRef} className="min-w-full bg-white text-sm text-gray-700">
                    <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-gray-700 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3 text-left">Image</th>
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left hidden lg:table-cell">Buyer</th>
                            <th className="px-4 py-3 text-left hidden lg:table-cell">Seller</th>
                            <th className="px-4 py-3 text-left hidden lg:table-cell">Qty</th>
                            <th className="px-4 py-3 text-left hidden md:table-cell">Income</th>
                            <th className="px-4 py-3 text-left hidden md:table-cell">Transaction</th>
                            <th className="px-4 py-3 text-left md:hidden">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredPayments.map((payment, index) => (
                            <tr key={payment._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="px-4 py-3">
                                    <img
                                        src={payment.image}
                                        alt={payment.name}
                                        className="w-14 h-14 object-cover rounded border"
                                    />
                                </td>
                                <td className="px-4 py-3 font-medium">{payment.name}</td>
                                <td className="px-4 py-3 text-sm hidden lg:table-cell">{payment.customer_email}</td>
                                <td className="px-4 py-3 text-sm hidden lg:table-cell">{payment.seller_email}</td>
                                <td className="px-4 py-3 hidden lg:table-cell">{payment.quantity}</td>
                                <td className="px-4 py-3 font-semibold text-green-600 hidden md:table-cell">
                                    ৳{payment.payment}
                                </td>
                                <td className="px-4 py-3 text-xs break-all hidden md:table-cell">{payment.transactionId}</td>
                                <td className="px-4 py-3 md:hidden">
                                    <button onClick={() => openModal(payment)} className="text-green-600 hover:text-green-800 transition">
                                        <FaEye />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Modal */}
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title className="text-lg font-bold text-gray-800 mb-4">
                                        Payment Details
                                    </Dialog.Title>
                                    {selectedPayment && (
                                        <div className="space-y-4 text-sm text-gray-700">
                                            <img src={selectedPayment.image} alt={selectedPayment.name} className="w-24 h-24 object-cover rounded mx-auto" />
                                            <div><strong>Medicine:</strong> {selectedPayment.name}</div>
                                            <div><strong>Quantity:</strong> {selectedPayment.quantity}</div>
                                            <div><strong>Buyer:</strong> {selectedPayment.customer_email}</div>
                                            <div><strong>Seller:</strong> {selectedPayment.seller_email}</div>
                                            <div><strong>Payment:</strong> ৳{selectedPayment.payment}</div>
                                            <div><strong>Payment Time:</strong> {new Date(selectedPayment.payment_time).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                                hour12: true,
                                            })}</div>
                                            <div><strong>Transaction ID:</strong> <span className="break-words">{selectedPayment.transactionId}</span></div>
                                            <div><strong>Status:</strong> <span className="text-green-600 font-semibold">{selectedPayment.payment_status}</span></div>
                                        </div>
                                    )}
                                    <div className="mt-6 text-right">
                                        <button onClick={closeModal} className="bg-green-600 px-4 py-2 text-sm font-medium text-white rounded hover:bg-green-700">
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

export default SalesReport;
