import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import GoogleLogin from "./GoogleLogin";

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { logIn } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = 'Login page';
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            // Sign in user
            const result = await logIn(data.email, data.password);
            const user = result.user;

            // Update last login time in DB
            const updateTime = {
                last_login_time: new Date().toISOString(),
            };
            await axiosSecure.put(`/users/update-login-time/${user.email}`, updateTime);

            // Success alert
            Swal.fire({
                icon: 'success',
                title: 'Login Successful!',
                showConfirmButton: false,
                timer: 1500,
            });

            // Redirect
            navigate("/");

        } catch (err) {
           
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: "Something went wrong. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
            <div className="w-full max-w-sm bg-base-100 shadow-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold text-center mb-6">Login Now!</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Email Input */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Email address</span>
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="input input-bordered focus:outline-0"
                            {...register("email", { required: "Email is required" })}
                        />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password Input */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Password</span>
                        </label>
                        <input
                            type="current-password"
                            placeholder="••••••••"
                            className="input input-bordered focus:outline-0"
                            {...register("password", { required: "Password is required" })}
                        />
                        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                        <label className="label justify-end">
                            <a href="#" className="label-text-alt link link-hover">
                                Forgot password?
                            </a>
                        </label>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Signup Link */}
                <p className="mt-6 text-center text-sm">
                    Don’t have an account?{" "}
                    <Link to="/auth/sign-up" className="link link-primary font-medium">
                        Sign up
                    </Link>
                </p>
                <div>
                    <GoogleLogin/>
                </div>
            </div>
        </div>
    );
};

export default Login;
