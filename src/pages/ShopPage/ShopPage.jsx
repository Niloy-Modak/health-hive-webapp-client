import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaEye } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";
import Loading from "../../components/ui/Loading";
import Swal from "sweetalert2";
import { IoCart, IoSearch } from "react-icons/io5";

const ShopPage = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredMedicines, setFilteredMedicines] = useState([]);
    const [sortOption, setSortOption] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const axiosPublic = useAxios();
    const { user } = useAuth();
    const { role, isLoading: roleLoading } = useRole();

    useEffect(() => {
        document.title = "Shop Page";

        axiosPublic.get("/medicines")
            .then((res) => setMedicines(res.data))
            // .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [axiosPublic]);

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

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setFilteredMedicines([]);
            setSuggestions([]);
            setSortOption("");
            return;
        }

        const filtered = medicines.filter((med) =>
            med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            med.company.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMedicines(filtered);
        setSuggestions([]);
        setSortOption("");
    };

    const handleSort = (option) => {
        setSortOption(option);

        const baseData = filteredMedicines.length ? [...filteredMedicines] : [...medicines];

        const sorted = baseData.sort((a, b) => {
            if (option === "low-to-high") return a.price - b.price;
            if (option === "high-to-low") return b.price - a.price;
            return 0;
        });

        setFilteredMedicines(sorted);
    };

    const onSearchInputChange = (value) => {
        setSearchTerm(value);

        if (!value.trim()) {
            setSuggestions([]);
            setFilteredMedicines([]);
            setSortOption("");
            return;
        }

        const matched = medicines.filter((med) =>
            med.name.toLowerCase().includes(value.toLowerCase()) ||
            med.generic_name?.toLowerCase().includes(value.toLowerCase()) ||
            med.company.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5);

        setSuggestions(matched);
    };

    const onSuggestionClick = (item) => {
        setSearchTerm(item.name);
        setFilteredMedicines([item]);
        setSuggestions([]);
        setSortOption("");
    };

    const getDiscountedPrice = (price, discount) => {
        if (!discount) return price;
        return (price - (price * discount) / 100).toFixed(2);
    };

    const displayedMedicines = (searchTerm || sortOption) ? filteredMedicines : medicines;

    if (loading || roleLoading) return <Loading />;

    return (
        <div className="overflow-x-auto p-4 min-h-screen">
            {/* Search & Sort */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                <form
                    className="relative w-full flex md:w-1/2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                    }}
                >
                    <input
                        type="text"
                        placeholder="Search medicine..."
                        className="input input-bordered w-full outline-none focus:outline-none ring-0 focus:ring-0"
                        value={searchTerm}
                        onChange={(e) => onSearchInputChange(e.target.value)}
                    />
                    <button className="p-3 text-white hover:bg-blue-700 cursor-pointer bg-sky-600 rounded-xl ml-2" type="submit"><IoSearch size={18} /></button>
                </form>

                <select
                    className="select select-bordered w-36 md:w-auto"
                    value={sortOption}
                    onChange={(e) => handleSort(e.target.value)}
                >
                    <option value="" disabled>Sort by Price</option>
                    <option value="low-to-high">Low to High</option>
                    <option value="high-to-low">High to Low</option>
                </select>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
                <ul className="absolute bg-white w-[250px] md:w-[550px] border rounded shadow mt-1 z-10 h-auto overflow-auto">
                    {suggestions.map((item) => (
                        <li
                            key={item._id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => onSuggestionClick(item)}
                        >
                            <span className="font-semibold">{item.name}</span>{" "}
                            <span className="text-sm text-gray-500">({item.company})</span>
                        </li>
                    ))}
                </ul>
            )}

            <h2 className="text-xl font-bold mb-4">All Medicines</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayedMedicines.map((item) => (
                    <div key={item._id} className="w-full max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden flex flex-col ">

                        {/* Image */}
                        <div className="h-[240px] w-full">
                            <img
                                src={item.image} alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between p-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold line-clamp-2">
                                    {item.name}
                                </h2>

                                <div className="flex flex-wrap justify-center gap-1 text-base font-medium">
                                    <span className="text-[#509E2F]">Category:</span>
                                    <span className="text-gray-600">{item.category}</span>

                                </div>

                                <div className="flex items-center justify-center gap-2 text-gray-600">
                                    <span className=" font-semibold">Company:</span>
                                    <span>{item.company}</span>
                                </div>

                                <div className="flex items-center gap-2 justify-center">
                                    <span className="font-semibold">Price :</span>

                                    {/* Original price with strikethrough */}
                                    {item.discount > 0 && (
                                        <span className="text-gray-400 line-through">
                                            {item.price}৳
                                        </span>
                                    )}

                                    {/* Discounted / Normal price */}
                                    <span
                                        className={`font-semibold ${item.discount > 0 ? "text-green-600" : "text-black"
                                            }`}
                                    >
                                        {item.discount > 0
                                            ? getDiscountedPrice(item.price, item.discount)
                                            : item.price}
                                        ৳
                                    </span>

                                    {/* Discount percentage */}
                                    {item.discount > 0 && (
                                        <span className="text-blue-600 text-sm font-medium">
                                            ({item.discount}% off)
                                        </span>
                                    )}
                                </div>


                            </div>

                            {/* Button */}
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => setSelectedMedicine(item)}
                                    className="block flex-1/2  bg-primary cursor-pointer text-white py-2 rounded-full text-center font-medium hover:bg-sky-600 transition-colors"
                                >
                                    View details
                                </button>
                                <button className='flex-1/2'>
                                    <IoCart
                                        size={16}
                                        onClick={() => role !== "admin" && role !== "seller" && handleSelect(item)}
                                        className={`w-full h-10 p-1 rounded-full text-white ${role === "admin" || role === "seller"
                                            ? "bg-gray-300 cursor-not-allowed"
                                            : "bg-secondary hover:bg-sky-500 cursor-pointer"
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            <Transition appear show={!!selectedMedicine} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setSelectedMedicine(null)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="scale-95 opacity-0" enterTo="scale-100 opacity-100" leave="ease-in duration-200" leaveFrom="scale-100 opacity-100" leaveTo="scale-95 opacity-0">
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-bold">Medicine Details</Dialog.Title>
                                    <div className="mt-4 space-y-2">
                                        <img src={selectedMedicine?.image} alt={selectedMedicine?.name} className="w-32 h-32 rounded object-cover" />
                                        <p><strong>Name:</strong> {selectedMedicine?.name}</p>
                                        <p><strong>Generic:</strong> {selectedMedicine?.generic_name}</p>
                                        <p><strong>Description:</strong> {selectedMedicine?.description}</p>
                                        <p><strong>Category:</strong> {selectedMedicine?.category}</p>
                                        <p><strong>Company:</strong> {selectedMedicine?.company}</p>
                                        <p><strong>Unit:</strong> {selectedMedicine?.mass_unit}</p>
                                        <p><strong>Seller:</strong> {selectedMedicine?.seller_name}</p>
                                        <p><strong>Price:</strong> {selectedMedicine?.discount > 0
                                            ? `${getDiscountedPrice(selectedMedicine.price, selectedMedicine.discount)}৳ (Discounted)`
                                            : `${selectedMedicine?.price}৳`
                                        }</p>
                                    </div>
                                    <div className="mt-6 text-right">
                                        <button onClick={() => setSelectedMedicine(null)} className="btn text-white btn-error btn-sm ">Close</button>
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

export default ShopPage;
