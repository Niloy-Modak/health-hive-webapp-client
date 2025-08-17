import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';
import useRole from '../../hooks/useRole';

const UpdateMedicine = ({ medicine, closeModal, refetch }) => {
    const { user } = useAuth(); //  Get current user
    const axios = useAxios(); //  non-token axios
    const { role } = useRole();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: medicine?.name || '',
            generic_name: medicine?.generic_name || '',
            description: medicine?.description || '',
            category: medicine?.category || '',
            company: medicine?.company || '',
            mass_unit: medicine?.mass_unit || '',
            price: medicine?.price || 0,
            discount: medicine?.discount || 0,
        }
    });

    useEffect(() => {
        reset({
            name: medicine?.name || '',
            generic_name: medicine?.generic_name || '',
            description: medicine?.description || '',
            category: medicine?.category || '',
            company: medicine?.company || '',
            mass_unit: medicine?.mass_unit || '',
            price: medicine?.price || 0,
            discount: medicine?.discount || 0,
        });
    }, [medicine, reset]);

    const onSubmit = async (data) => {
        // Check if the user is a seller
        if (role !== "seller") {
            Swal.fire("Access Denied", "Only sellers can update medicines.", "error");
            return;
        }

        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This will update the medicine information.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#16a34a",
            cancelButtonColor: "#dc2626",
        });

        if (!confirm.isConfirmed) return;

        try {
            let imageURL = medicine.image; // keep existing image by default

            // If a new image is selected, upload it
            if (data.image && data.image[0]) {
                const imageFile = data.image[0];
                const formData = new FormData();
                formData.append("image", imageFile);

                const imgRes = await axios.post(
                    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
                    formData
                );
                imageURL = imgRes.data.data.url;
            }

            const updatedData = {
                ...data,
                image: imageURL, // Use uploaded or default image
                seller_email: user.email,
                price: parseFloat(data.price),
                discount: parseFloat(data.discount || 0),
            };

            const res = await axios.put(`/medicine/update/${medicine._id}`, updatedData);

            if (res.data?.modifiedCount > 0) {
                Swal.fire({
                    title: "Updated!",
                    text: "Medicine updated successfully.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                });
                closeModal(); // Close modal
                refetch();    // Refresh medicine data
            } else {
                Swal.fire("Info", "No changes were made to the medicine.", "info");
            }
        } catch (err) {
            Swal.fire("Error", err.response?.data?.message || "Failed to update medicine.", "error");
        }
    };



    const inputClass = (field) => `input input-bordered w-full ${errors[field] ? 'border-red-500' : ''}`;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
                <label className="label">Medicine Name</label>
                <input {...register('name', { required: 'Name is required' })} className={inputClass('name')} />
                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            </div>

            {/* Generic Name */}
            <div>
                <label className="label">Generic Name</label>
                <input {...register('generic_name', { required: 'Generic name is required' })} className={inputClass('generic_name')} />
                {errors.generic_name && <span className="text-red-500 text-sm">{errors.generic_name.message}</span>}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
                <label className="label">Description</label>
                <textarea {...register('description', { required: 'Description is required' })} className="textarea textarea-bordered w-full"></textarea>
                {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
            </div>

            {/* Category */}
            <div>
                <label className="label">Category</label>
                <select {...register('category', { required: true })} className={inputClass('category')}>
                    <option value="">Select</option>
                    <option value="tablet">Tablet</option>
                    <option value="syrup">Syrup</option>
                    <option value="ointment">Ointment</option>
                </select>
            </div>

            {/* Company */}
            <div>
                <label className="label">Company</label>
                <select {...register('company', { required: true })} className={inputClass('company')}>
                    <option value="">Select</option>
                    <option value="Square">Square</option>
                    <option value="Beximco">Beximco</option>
                    <option value="ACI">ACI</option>
                    <option value="Renata">Renata</option>
                    <option value="Incepta">Incepta</option>
                </select>
            </div>

            <div>
                <label className="label">Leave empty Or Update image</label>
                <input
                    type="file"
                    {...register("image")}
                    className="file-input file-input-bordered w-full"
                    accept="image/*"
                />
            </div>

            {/* Mass Unit */}
            <div>
                <label className="label">Mass Unit</label>
                <select {...register('mass_unit', { required: true })} className={inputClass('mass_unit')}>
                    <option value="">Select</option>
                    <option value="mg">mg</option>
                    <option value="ml">ml</option>
                </select>
            </div>

            {/* Price */}
            <div>
                <label className="label">Price</label>
                <input
                    type="number"
                    step="0.01"
                    {...register('price', {
                        required: 'Price is required',
                        valueAsNumber: true,
                        validate: (v) => v >= 0 || 'Must be non-negative'
                    })}
                    className={inputClass('price')}
                    onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                />
            </div>

            {/* Discount */}
            <div>
                <label className="label">Discount (%)</label>
                <input
                    type="number"
                    {...register('discount', {
                        valueAsNumber: true,
                        validate: (v) => v >= 0 || 'Discount must be positive'
                    })}
                    className={inputClass('discount')}
                    min={0}
                    max={100}
                    step={1}
                    onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                />
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 text-right mt-4">
                <button type="submit" className="btn btn-success mr-2">Update</button>
                <button type="button" className="btn" onClick={closeModal}>Cancel</button>
            </div>
        </form>
    );
};

export default UpdateMedicine;
