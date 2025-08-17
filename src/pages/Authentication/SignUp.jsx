import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import GoogleLogin from "./GoogleLogin";

const Signup = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const { createUser, updateUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const imgBBApiKey = import.meta.env.VITE_IMGBB_API_KEY;

  useEffect(() => {
    document.title = "Signup Page";
  }, []);

  const onSubmit = async (data) => {
    setError("");

    const imageFile = data.profileImage[0];
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      // 1. Upload profile image
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgBBApiKey}`,
        formData
      );
      const imageUrl = res.data.data.url;

      // 2. Create user in Firebase
      const userCredential = await createUser(data.email, data.password);
      await updateUser({ displayName: data.name, photoURL: imageUrl });

      // 3. Build user info for MongoDB
      const applyingFor = data.applying_for || "user"; // user or seller
      const userInfo = {
        name: data.name,
        email: data.email,
        photo: imageUrl,
        role: "user", // always user initially
        status: applyingFor === "seller" ? "pending" : "user",
        applying_for: applyingFor === "seller" ? "seller" : "user",
        created_time: new Date().toISOString(),
        last_login_time: new Date().toISOString()
      };

      // 4. Send user data to backend
      const mongoRes = await axiosSecure.post("/users/request", userInfo);
      

      // 5. Reset and redirect
      Swal.fire({
        icon: 'success',
        title: 'Signup Successful!',
        text: 'Welcome to HealthHive!',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/");
      });
      setImagePreview(null);
      reset();

    } catch (err) {
    
      setError(err.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-sm bg-base-100 shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Name */}
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Full Name</span></label>
            <input
              type="text"
              placeholder="Your Full Name"
              className="input input-bordered focus:outline-0"
              {...register("name", { required: "Your name is required" })}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Email</span></label>
            <input
              type="email"
              placeholder="Your Email"
              className="input input-bordered focus:outline-0"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Password</span></label>
            <input
              type="current-password"
              placeholder="••••••••"
              className="input input-bordered focus:outline-0"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Applying For */}
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Apply As</span></label>
            <div className="flex gap-4">
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  value="user"
                  defaultChecked
                  {...register("applying_for")}
                  className="radio"
                />
                <span className="ml-2">User</span>
              </label>
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  value="seller"
                  {...register("applying_for")}
                  className="radio"
                />
                <span className="ml-2">Seller</span>
              </label>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Profile Picture</span></label>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered focus:outline-0"
              {...register("profileImage", { required: "Profile picture is required" })}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setImagePreview(URL.createObjectURL(file));
                else setImagePreview(null);
              }}
            />
            {errors.profileImage && <p className="text-red-500 text-sm mt-1">{errors.profileImage.message}</p>}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 w-24 h-24 object-cover rounded-full mx-auto"
              />
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-full">
            Sign Up
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mt-4 text-sm">Your have all ready and Account or Something else problem</p>}

        {/* Login Link */}
        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link to="/auth/login" className="link link-primary font-medium">Login</Link>
        </p>
        <div>
          <GoogleLogin />
        </div>
      </div>
    </div>
  );
};

export default Signup;
