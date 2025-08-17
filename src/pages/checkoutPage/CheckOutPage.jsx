import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect } from 'react';
import PaymentForm from './PaymentForm';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../components/ui/Loading';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const CheckOutPage = () => {
    useEffect(() => {
        document.title = 'Check Out';
    }, []);
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();

    const { data: order, isLoading } = useQuery({
        queryKey: ["single-order", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/single-order/${id}`);
            return res.data;
        }
    });

    if (isLoading) return <Loading />;

    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK)

 

    return (
        <div className="p-4">
            {/* <h2 className="text-xl font-bold mb-4">Pay for {order.name}</h2> */}
            <div className="max-w-xl mx-auto shadow p-4 rounded">
                <Elements stripe={stripePromise}>
                    <PaymentForm order={order} />
                </Elements>
            </div>
        </div>
    );
};

export default CheckOutPage;