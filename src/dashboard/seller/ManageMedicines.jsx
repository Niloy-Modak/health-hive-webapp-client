import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import AddMedicine from './AddMedicine';
import SellerAddedMedicines from './SellerAddedMedicines';

const ManageMedicines = () => {
    useEffect(() => {
        document.title = 'Seller Dashboard - Manage Medicines';
    }, []);

    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const [searchText, setSearchText] = useState('');

    return (
        <div className="px-4 md:px-8 py-6">
            {/* Top Nav */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <div className="w-full md:w-1/2 flex">
                    <input
                        type="text"
                        placeholder="Search by medicine name..."
                        className="input input-bordered w-full rounded-r-none outline-none focus:outline-none ring-0 focus:ring-0"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button
                        className="btn btn-primary rounded-l-none"
                        onClick={() => { }} // optional logic if needed
                    >
                        Search
                    </button>
                </div>

                <button onClick={openModal} className="btn btn-primary">
                    + Add Medicine
                </button>
            </div>


            {/* Medicines Table */}
            <SellerAddedMedicines searchText={searchText} />

            {/* Add Modal */}
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-150"
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
                                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white p-6 text-left shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-bold mb-4">
                                        Add New Medicine
                                    </Dialog.Title>
                                    <AddMedicine closeModal={closeModal} />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default ManageMedicines;
