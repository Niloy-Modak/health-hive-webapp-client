import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';
import axiosSecure from '../../hooks/useAxiosSecure'; // your secure Axios instance
import useAxios from '../../hooks/useAxios';

const AddMedicine = ({ closeModal }) => {
    const imgBBKey = import.meta.env.VITE_IMGBB_API_KEY;
    const { user } = useAuth();
    const { role, id ,isLoading } = useRole(user?.email);
    const hookAxios = useAxios();
    

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        if (isLoading) return;

        // Not Seller
        if (role !== 'seller') {
            return Swal.fire({
                icon: 'error',
                title: 'Permission Denied',
                text: 'Only sellers can add medicine.',
            });
        }

        // Confirm
        document.activeElement?.blur(); // aria fix
        const confirm = await Swal.fire({
            title: 'Confirm Medicine Details',
            html: `
                <div style="text-align:left; line-height:1.6">
                    <p><strong>Name:</strong> ${data.name}</p>
                    <p><strong>Generic Name:</strong> ${data.generic_name}</p>
                    <p><strong>Description:</strong> ${data.description}</p>
                    <p><strong>Category:</strong> ${data.category}</p>
                    <p><strong>Company:</strong> ${data.company}</p>
                    <p><strong>Mass Unit:</strong> ${data.mass_unit}</p>
                    <p><strong>Price:</strong> ${data.price} Tk</p>
                    <p><strong>Discount:</strong> ${data.discount || 0}%</p>
                </div>`,
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#dc2626',
        });

        if (!confirm.isConfirmed) return;

        // Upload image to imgBB
        const imageFile = data.image[0];
        const formData = new FormData();
        formData.append('image', imageFile);

        let imageURL;
        try {
            const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgBBKey}`, {
                method: 'POST',
                body: formData,
            });
            const imgData = await imgRes.json();
            if (!imgData.success) throw new Error('Image upload failed');
            imageURL = imgData.data.url;
        } catch (error) {
            return Swal.fire('Error', 'Image upload failed.', 'error');
        }

        // Construct post data
        const medicineData = {
            name: data.name,
            generic_name: data.generic_name,
            description: data.description,
            image: imageURL,
            category: data.category,
            company: data.company,
            mass_unit: data.mass_unit,
            price: parseFloat(data.price),
            discount: parseFloat(data.discount || 0),
            seller_id: id,
            seller_name: user.displayName,
            seller_email: user.email,
        };

        // Post to server
        try {
            const res = await hookAxios.post('/medicine/post', medicineData);
          
            if (res.status === 201 || res.data.insertedId) {
                reset();
                closeModal();
                location.reload()
                Swal.fire({
                    icon: 'success',
                    title: 'Medicine Posted!',
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        } catch (error) {
            Swal.fire('Error', 'Something went wrong while saving.', 'error');
        }
    };

    // Styling helpers
    const inputClass = (field) => `input input-bordered w-full ${errors[field] ? 'border-red-500' : ''}`;
    const selectClass = (field) => `select select-bordered w-full ${errors[field] ? 'border-red-500' : ''}`;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
                <label className="label">Medicine Name</label>
                <input {...register('name', { required: 'Medicine name is required' })}
                    className={inputClass('name')}
                    type="text"
                    placeholder="Enter Medicine Name"
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            </div>

            {/* Generic */}
            <div>
                <label className="label">Generic Name</label>
                <input {...register('generic_name', { required: 'Generic name is required' })}
                    className={inputClass('generic_name')}
                    type="text"
                    placeholder="Enter Generic Name"
                />
                {errors.generic_name && <span className="text-red-500 text-sm">{errors.generic_name.message}</span>}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
                <label className="label">Short Description</label>
                <textarea {...register('description', { required: 'Description is required' })}
                    rows="3"
                    placeholder="Write a short description..."
                    className={`textarea textarea-bordered w-full ${errors.description ? 'border-red-500' : ''}`}
                ></textarea>
                {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
            </div>

            {/* Image */}
            <div>
                <label className="label">Upload Image</label>
                <input {...register('image', { required: 'Image is required' })}
                    type="file"
                    accept="image/*"
                    className={`file-input file-input-bordered w-full ${errors.image ? 'border-red-500' : ''}`}
                />
                {errors.image && <span className="text-red-500 text-sm">{errors.image.message}</span>}
            </div>

            {/* Category */}
            <div>
                <label className="label">Category</label>
                <select {...register('category', { required: 'Category is required' })} className={selectClass('category')}>
                    <option value="">Select Category</option>
                    <option value="tablet">Tablet</option>
                    <option value="syrup">Syrup</option>
                    <option value="ointment">Ointment</option>
                </select>
                {errors.category && <span className="text-red-500 text-sm">{errors.category.message}</span>}
            </div>

            {/* Company */}
            <div>
                <label className="label">Company</label>
                <select {...register('company', { required: 'Company is required' })} className={selectClass('company')}>
                    <option value="">Select Company</option>
                    <option value="Square">Square</option>
                    <option value="Beximco">Beximco</option>
                    <option value="ACI">ACI</option>
                    <option value="Renata">Renata</option>
                    <option value="Incepta">Incepta</option>
                </select>
                {errors.company && <span className="text-red-500 text-sm">{errors.company.message}</span>}
            </div>

            {/* Mass Unit */}
            <div>
                <label className="label">Mass Unit</label>
                <select {...register('mass_unit', { required: 'Unit is required' })} className={selectClass('mass_unit')}>
                    <option value="">Select Unit</option>
                    <option value="mg">mg</option>
                    <option value="ml">ml</option>
                </select>
                {errors.mass_unit && <span className="text-red-500 text-sm">{errors.mass_unit.message}</span>}
            </div>

            {/* Price */}
            <div>
                <label className="label">Per Unit Price</label>
                <input
                    {...register('price', {
                        required: 'Price is required',
                        valueAsNumber: true,
                        validate: (v) => v >= 0 || 'Price must be non-negative',
                    })}
                    type="number"
                    step="0.01"
                    placeholder="Total Price"
                    className={inputClass('price')}
                    onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                />
                {errors.price && <span className="text-red-500 text-sm">{errors.price.message}</span>}
            </div>

            {/* Discount */}
            <div>
                <label className="label">Discount (%)</label>
                <input
                    {...register('discount', {
                        valueAsNumber: true,
                        validate: (v) => v >= 0 || 'Discount must be 0 or positive',
                    })}
                    type="number"
                    min={0}
                    max={100}
                    defaultValue={0}
                    step="1"
                    className="input input-bordered w-full"
                    onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 text-right mt-4">
                <button type="submit" className="btn btn-primary">Save Medicine</button>
            </div>
        </form>
    );
};

export default AddMedicine;
