import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import Loading from "../../components/ui/Loading";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";

const SellersList = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const { user: currentUser } = useAuth();
  const { role: currentRole } = useRole();

  const { data: sellers = [], isLoading, refetch } = useQuery({
    queryKey: ["approved-sellers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/sellers/all");
      return res.data;
    },
  });

  const handleReject = async (user) => {
    const result = await Swal.fire({
      title: "Reject Seller?",
      text: `Are you sure you want to reject ${user.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, reject!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch("/user/approval", {
          email: user.email,
          role: "user",
          status: "rejected",
        });

        Swal.fire({
          icon: "success",
          title: "Seller rejected successfully!",
          timer: 1500,
          showConfirmButton: false,
        });

        refetch();
      } catch (err) {
        Swal.fire("Error", "Something went wrong", "error");
      }
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "user":
        return "bg-sky-400";
      case "pending":
        return "bg-green-500";
      case "approved":
        return "bg-blue-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="px-4 md:px-8 py-6">
      <h2 className="text-2xl font-bold mb-4">All Sellers</h2>

      <div className="overflow-x-auto">
        <table className="table w-full border border-gray-400 rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th className="hidden md:table-cell">Email</th>
              <th className="hidden md:table-cell">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((user) => (
              <tr key={user._id} className="odd:bg-white even:bg-gray-100">
                <td>
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="font-medium">{user.name}</td>
                <td className="hidden md:table-cell">{user.email}</td>
                <td className="capitalize hidden md:table-cell">
                  <span className={`text-white px-2 py-1 rounded-full text-xs ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="flex items-center gap-2 justify-center">
                  <button
                    onClick={() => openModal(user)}
                    className="btn btn-xs btn-neutral"
                    title="View Details"
                  >
                    <FaEye />
                  </button>

                  <button
                    onClick={() => handleReject(user)}
                    className="btn btn-sm btn-error text-white"
                    disabled={
                      currentRole !== "admin" || user.email === currentUser?.email
                    }
                  >
                    Reject Seller
                  </button>
                </td>
              </tr>
            ))}
            {sellers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No sellers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
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
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="scale-95 opacity-0"
                enterTo="scale-100 opacity-100"
                leave="ease-in duration-200"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-95 opacity-0"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-bold mb-4">
                    Seller Details
                  </Dialog.Title>
                  {selectedUser && (
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <img
                          src={selectedUser.photo}
                          alt="Profile"
                          className="w-20 h-20 rounded-full border object-cover"
                        />
                      </div>
                      <p><strong>Name:</strong> {selectedUser.name}</p>
                      <p><strong>Email:</strong> {selectedUser.email}</p>
                      <p><strong>Status:</strong> {selectedUser.status}</p>
                      <p><strong>Applying For:</strong> {selectedUser.applying_for}</p>
                      <p><strong>Created:</strong> {new Date(selectedUser.created_time).toLocaleString()}</p>
                    </div>
                  )}
                  <div className="mt-6 text-right">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
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
    </div>
  );
};

export default SellersList;
