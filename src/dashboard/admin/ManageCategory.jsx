import React, { useEffect, useState, Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Dialog, Transition } from "@headlessui/react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import UpdateAdminMed from "./UpdateAdminMed";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/ui/Loading";

const ManageCategory = () => {
    useEffect(() => {
        document.title = 'Admin Dashboard - Manage Category';
    }, []);

    const { user } = useAuth();

    const axiosSecure = useAxiosSecure();
    const [activeTab, setActiveTab] = useState("all");
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [editMedicine, setEditMedicine] = useState(null);

    const { data: medicines = [], isLoading, error, refetch } = useQuery({
        queryKey: ["allMedicinesForCategory"],
        queryFn: async () => {
            const res = await axiosSecure.get("/medicines");
            return res.data;
        }
    });

    const filteredMedicines =
        activeTab === "all"
            ? medicines
            : medicines.filter((med) => med.category.toLowerCase() === activeTab);

    const openModal = (medicine) => {
        setSelectedMedicine(medicine);
        setIsOpen(true);
    };

    const closeViewModal = () => {
        setIsOpen(false);
        setSelectedMedicine(null);
    };

    const closeEditModal = () => {
        setEditMedicine(null);
    };

    const handleDelete = async (id, refetch) => {
        const confirmResult = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the medicine.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (!confirmResult.isConfirmed) return;

        try {
            const res = await axiosSecure.delete(`/admin/medicine/delete/${id}?email=${user.email}`);

            if (res.data?.message === "Medicine deleted successfully.") {
                await Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "Medicine has been deleted.",
                    timer: 1500,
                    showConfirmButton: false,
                });

                refetch();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed!",
                    text: res.data?.message || "Something went wrong.",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data?.message || "Internal Server Error",
                timer: 1500,
                showConfirmButton: false,
            });
        }
    };



    const categoryTabs = ["all", "tablet", "syrup", "ointment"];

    return (
        <div className="w-[90%] lg:w-[85%] mx-auto mt-6">

            {/* Tabs */}
            <div className="flex flex-wrap gap-3 mb-6">
                {categoryTabs.map((tab) => (
                    <button
                        key={tab}
                        className={`capitalize px-4 py-2 rounded font-medium border ${activeTab === tab
                            ? "bg-sky-600 text-white"
                            : "bg-white border-sky-500 text-sky-600"
                            }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === "all" ? "All Medicines" : tab}
                    </button>
                ))}
            </div>

            {/* Table */}
            {isLoading ? (
                <Loading />
            ) : error ? (
                <p className="text-red-500">Error: {error.message}</p>
            ) : filteredMedicines.length === 0 ? (
                <p>No medicines found for selected category.</p>
            ) : (
                <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
                    <table className="min-w-full bg-white text-sm text-gray-700">
                        <thead className="bg-gradient-to-r from-sky-100 to-blue-200 text-xs uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left">Image</th>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left hidden md:table-cell">Company</th>
                                <th className="px-4 py-3 text-left hidden md:table-cell">Category</th>
                                <th className="px-4 py-3 text-left hidden md:table-cell">Price</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredMedicines.map((med) => (
                                <tr key={med._id}>
                                    <td className="px-4 py-3">
                                        <img src={med.image} alt={med.name} className="w-14 h-14 object-cover rounded border" />
                                    </td>
                                    <td className="px-4 py-3 font-medium">{med.name}</td>
                                    <td className="px-4 py-3 hidden md:table-cell">{med.company}</td>
                                    <td className="px-4 py-3 capitalize hidden md:table-cell">{med.category}</td>
                                    <td className="px-4 py-3 font-semibold text-green-600 hidden md:table-cell">
                                        {med.discount > 0 ? (
                                            <div className="space-y-1">
                                                <p className="line-through text-gray-400 text-xs">৳{med.price.toFixed(2)} <span className="text-xs text-red-500">-{med.discount}%</span></p>
                                                <p>৳{(med.price - (med.price * med.discount) / 100).toFixed(2)}</p>

                                            </div>
                                        ) : (
                                            <>৳{med.price.toFixed(2)}</>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 flex flex-col md:flex-row items-center gap-3 text-green-700">
                                        <button onClick={() => openModal(med)} className="hover:text-green-900 btn"><FaEye /></button>
                                        <button onClick={() => setEditMedicine(med)} className="bg-sky-400 text-white hover:bg-blue-600 btn"><FaEdit /></button>
                                        <button onClick={() => handleDelete(med._id, refetch)} className="bg-red-400 text-white hover:bg-red-600 btn"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* View Modal */}
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeViewModal}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="scale-95 opacity-0" enterTo="scale-100 opacity-100" leave="ease-in duration-200" leaveFrom="scale-100 opacity-100" leaveTo="scale-95 opacity-0">
                                <Dialog.Panel className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-xl">
                                    <Dialog.Title className="text-lg font-bold mb-4">Medicine Details</Dialog.Title>
                                    {selectedMedicine && (
                                        <div className="space-y-2 text-sm text-gray-700">
                                            <img src={selectedMedicine.image} alt={selectedMedicine.name} className="w-32 h-32 rounded border mb-4 object-cover" />
                                            <p><strong>Name:</strong> {selectedMedicine.name}</p>
                                            <p><strong>Company:</strong> {selectedMedicine.company}</p>
                                            <p><strong>Category:</strong> {selectedMedicine.category}</p>
                                            <p><strong>Description:</strong> {selectedMedicine.description}</p>
                                            <p><strong>Mass Unit:</strong> {selectedMedicine.mass_unit}</p>
                                            {selectedMedicine.discount > 0 ? (
                                                <>
                                                    <p><strong>Price:</strong> <span className="line-through text-gray-400">৳{selectedMedicine.price.toFixed(2)}</span></p>
                                                    <p><strong>Discount:</strong> {selectedMedicine.discount}%</p>
                                                    <p><strong>Total Price:</strong> <span className="text-green-600 font-semibold">৳{(selectedMedicine.price - (selectedMedicine.price * selectedMedicine.discount) / 100).toFixed(2)}</span></p>
                                                </>
                                            ) : (
                                                <p><strong>Price:</strong> ৳{selectedMedicine.price.toFixed(2)}</p>
                                            )}

                                            <p><strong>Seller:</strong> {selectedMedicine.seller_name} ({selectedMedicine.seller_email})</p>
                                            <p><strong>Created:</strong> {new Date(selectedMedicine.created_time).toLocaleString()}</p>
                                            <p><strong>Updated:</strong> {new Date(selectedMedicine.updated_time).toLocaleString()}</p>
                                        </div>
                                    )}
                                    <div className="mt-6 text-right">
                                        <button onClick={closeViewModal} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Close</button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Update Modal */}
            <Transition appear show={!!editMedicine} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeEditModal}>
                    <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="scale-95 opacity-0" enterTo="scale-100 opacity-100" leave="ease-in duration-200" leaveFrom="scale-100 opacity-100" leaveTo="scale-95 opacity-0">
                                <Dialog.Panel className="w-full max-w-xl bg-white p-6 rounded-xl shadow-xl">
                                    <Dialog.Title className="text-lg font-bold mb-4">Update Medicine</Dialog.Title>
                                    <UpdateAdminMed medicine={editMedicine} closeModal={closeEditModal} refetch={refetch} />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default ManageCategory;
