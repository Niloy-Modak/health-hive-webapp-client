import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/ui/Loading";
import UpdateMedicine from "./UpdateMedicine";
import useAxios from "../../hooks/useAxios";

const SellerAddedMedicines = ({ searchText }) => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const axiosHook = useAxios()
    const queryClient = useQueryClient();

    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [editMedicine, setEditMedicine] = useState(null);

    const { data: medicines = [], isLoading, refetch } = useQuery({
        queryKey: ['seller-medicines', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/medicine/seller/${user.email}`);
            return res.data;
        },
    });

    if (isLoading) return <Loading />;

    const filtered = medicines.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.generic_name?.toLowerCase().includes(searchText.toLowerCase())
    );

    // DELETE
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (confirm.isConfirmed) {
            try {
                // Pass seller_email only in the DELETE request body
                const res = await axiosHook.delete(`/medicine/${id}`, {
                    data: {
                        seller_email: user?.email,  // ensure user.email is defined
                    }
                });

                if (res.data.deletedCount > 0) {
                    await queryClient.invalidateQueries(['seller-medicines', user?.email]);
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Your medicine has been deleted.',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true
                    });
                }

            } catch (err) {
                Swal.fire('Error', 'Failed to delete the medicine.', 'error');
            }
        }
    };

    if (filtered.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold mb-2">No medicines found</h2>
                <p className="text-gray-500">Click on “Add Medicine” to get started.</p>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto rounded-lg shadow border border-gray-300">
                <table className="table table-zebra w-full">
                    <thead className=" text-base font-semibold bg-sky-100 text-gray-800">
                        <tr>
                            <th className="py-3">Image</th>
                            <th>Medicine</th>
                            <th className="hidden md:table-cell">Company</th>
                            <th className="hidden lg:table-cell">Category</th>
                            <th className="hidden md:table-cell">Price</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((item) => (
                            <tr key={item._id}>
                                <td className="py-2">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                </td>
                                <td>{item.name}</td>
                                <td className="hidden md:table-cell">{item.company}</td>
                                <td className="hidden lg:table-cell">{item.category}</td>
                                <td className="hidden md:table-cell">
                                    {item.discount > 0 ? (
                                        <>
                                            <span className="line-through text-gray-400 text-sm mr-1">{item.price}৳</span>
                                            <span className="text-green-600 font-semibold">
                                                {(item.price - (item.price * item.discount) / 100).toFixed(2)}৳
                                            </span>
                                            <span className="ml-1 text-xs text-primary">({item.discount}% off)</span>
                                        </>
                                    ) : (
                                        <span>{item.price}৳</span>
                                    )}
                                </td>

                                <td>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        <button
                                            onClick={() => setSelectedMedicine(item)}
                                            className="btn btn-sm btn-outline"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => setEditMedicine(item)}
                                            className="btn btn-sm btn-outline bg-green-600 border-0 text-white hover:bg-green-500"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="btn btn-sm btn-error text-white"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center text-gray-500 py-6">
                                    No medicines found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Modal */}
            <Transition appear show={!!selectedMedicine} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setSelectedMedicine(null)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="scale-95 opacity-0" enterTo="scale-100 opacity-100" leave="ease-in duration-200" leaveFrom="scale-100 opacity-100" leaveTo="scale-95 opacity-0">
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title className="text-lg font-medium text-gray-900">Medicine Details</Dialog.Title>
                                    <div className="mt-4 space-y-2">
                                        <img src={selectedMedicine?.image} alt="Medicine" className="w-32 h-32 object-cover rounded" />
                                        <p><strong>Name:</strong> {selectedMedicine?.name}</p>
                                        <p><strong>Generic Name:</strong> {selectedMedicine?.generic_name}</p>
                                        <p><strong>Description:</strong> {selectedMedicine?.description}</p>
                                        <p><strong>Company:</strong> {selectedMedicine?.company}</p>
                                        <p><strong>Category:</strong> {selectedMedicine?.category}</p>
                                        <p><strong>Mass Unit:</strong> {selectedMedicine?.mass_unit}</p>
                                        <p>
                                            <strong>Price:</strong>{" "}
                                            {selectedMedicine?.discount > 0 ? (
                                                <>
                                                    <span className="line-through text-gray-400 mr-2">
                                                        {selectedMedicine.price}৳
                                                    </span>
                                                    <span className="text-green-600 font-bold">
                                                        {(
                                                            selectedMedicine.price -
                                                            (selectedMedicine.price * selectedMedicine.discount) / 100
                                                        ).toFixed(2)}৳
                                                    </span>
                                                    <span className="ml-1 text-primary text-sm">
                                                        ({selectedMedicine.discount}% off)
                                                    </span>
                                                </>
                                            ) : (
                                                <span>{selectedMedicine?.price}৳</span>
                                            )}
                                        </p>

                                        <p><strong>Seller Name:</strong> {selectedMedicine?.seller_name}</p>
                                        <p><strong>Added:</strong> {new Date(selectedMedicine?.created_time).toLocaleString()}</p>
                                        <p><strong>Updated:</strong> {new Date(selectedMedicine?.updated_time).toLocaleString()}</p>
                                    </div>
                                    <div className="mt-6 text-right">
                                        <button className="btn btn-sm" onClick={() => setSelectedMedicine(null)}>Close</button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Update Modal */}
            <Transition appear show={!!editMedicine} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setEditMedicine(null)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="scale-95 opacity-0" enterTo="scale-100 opacity-100" leave="ease-in duration-200" leaveFrom="scale-100 opacity-100" leaveTo="scale-95 opacity-0">
                                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-xl bg-white p-6 text-left shadow-xl transition-all">
                                    <Dialog.Title className="text-lg font-bold mb-4">Update Medicine</Dialog.Title>
                                    <UpdateMedicine medicine={editMedicine} closeModal={() => setEditMedicine(null)} refetch={refetch} />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default SellerAddedMedicines;
