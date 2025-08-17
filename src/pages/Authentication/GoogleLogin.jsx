import React from 'react';
import Swal from 'sweetalert2';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const GoogleLogin = () => {
    const { signInWithGoogle } = useAuth(); // Should return Firebase login popup
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithGoogle();
            const user = result.user;
        
            const userData = {
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
                role: "user",
                status: "user",
                applying_for: "user",
                created_time: new Date().toISOString(),
                last_login_time: new Date().toISOString(),
            };

            // Step 1: check if user exists
            const res = await axiosSecure.get(`/users/check/${user.email}`);
            const exists = res?.data?.exists;

            if (!exists) {
                // First-time login → insert user
                await axiosSecure.post("/users/request", userData);
            } else {
                // Existing user → just update login time
                await axiosSecure.put(`/users/update-login-time/${user.email}`, {
                    last_login_time: new Date().toISOString(),
                });
            }

            // Success alert
            Swal.fire({
                icon: 'success',
                title: 'Login Successful!',
                showConfirmButton: false,
                timer: 1500,
            });

            // Redirect to home
            navigate('/');

        } catch (error) {
           
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.message || 'Something went wrong',
            });
        }
    };

    return (
        <div className="mt-4 text-center">
            <button
                onClick={handleGoogleSignIn}
                className="btn btn-outline w-full flex items-center gap-2 justify-center"
            >
                <FcGoogle className="text-xl" />
                Continue with Google
            </button>
        </div>
    );
};

export default GoogleLogin;
