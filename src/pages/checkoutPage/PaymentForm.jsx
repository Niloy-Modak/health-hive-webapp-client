import React, { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';

const CARD_OPTIONS = {
    style: {
        base: {
            color: "#2D3748",
            fontSize: "16px",
            '::placeholder': { color: "#A0AEC0" },
        },
        invalid: {
            color: "#E53E3E",
        },
    },
};

const PaymentForm = ({ order }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Create Payment Intent
    useEffect(() => {
        if (order?.price && order?.quantity) {
            const totalAmount = order.price * order.quantity;
            axiosSecure.post("/create-payment-intent", { amount: totalAmount })
                .then(res => setClientSecret(res.data.clientSecret))
                .catch(err =>("Payment Intent Error:", err));
        }
    }, [order, axiosSecure]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        if (!stripe || !elements) {
            setLoading(false);
            return;
        }

        const card = elements.getElement(CardElement);
        if (!card) {
            setLoading(false);
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            setErrorMessage(error.message);
            setLoading(false);
            return;
        }

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: paymentMethod.id,
        });

        if (confirmError) {
            setErrorMessage(confirmError.message);
            setLoading(false);
            return;
        }

        // Update Backend
        try {
            const res = await axiosSecure.patch(`/cart/confirm-payment/${order._id}`, {
                payment_status: "confirmed",
                order_status: "confirmed",
                payment: paymentIntent.amount / 100,
                transactionId: paymentIntent.id
            });

            if (res.data.modifiedCount || res.data.acknowledged) {
                setSuccessMessage("Payment Successful! Order Confirmed.");

                Swal.fire({
                    icon: 'success',
                    title: 'Payment Successful!',
                    text: 'Order Confirmed.',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                }).then(() => {
                    navigate('/dashboard/user-payment-history');
                });
            }
        } catch (err) {
            setErrorMessage("Payment succeeded but updating server failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 border rounded-md shadow-sm bg-white">
                <CardElement options={CARD_OPTIONS} />
            </div>

            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

            <button
                type="submit"
                disabled={!stripe || !clientSecret || loading}
                className={`w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                {loading ? 'Processing...' : `Pay ৳${(order.price * order.quantity).toFixed(2)}`}
            </button>
        </form>
    );
};

export default PaymentForm;

