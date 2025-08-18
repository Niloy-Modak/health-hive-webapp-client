import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

const AdminHomepage = () => {
    useEffect(() => {
        document.title = 'Admin Dashboard – Home';
    }, []);

    const { user } = useAuth();
    const { role } = useRole();
    const axiosSecure = useAxiosSecure();

    // 1. Fetch all medicines
    const { data: medicines = [] } = useQuery({
        queryKey: ['all-medicines'],
        queryFn: async () => {
            const res = await axiosSecure.get('/medicines');
            return res.data;
        },
        enabled: !!user?.email && role === 'admin',
    });

    // 2. Fetch confirmed payments
    const { data: payments = [] } = useQuery({
        queryKey: ['admin-confirmed-payments', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/admin/payments/all-confirmed?email=${user.email}`
            );
            return res.data;
        },
        enabled: !!user?.email && role === 'admin',
    });

    const totalProducts = medicines.length;
    const totalSales = payments.length;
    const totalIncome = payments.reduce((acc, item) => acc + (item.payment || 0), 0);

    const chartData = [
        { name: 'Total Products', value: totalProducts },
        { name: 'Products Sold', value: totalSales },
        { name: 'Total Income', value: totalIncome },
    ];

    return (
        <section className="w-[90%] lg:w-[85%] mx-auto mt-6 space-y-8">
            {/* Admin Info Section */}
            <div className="bg-white shadow-md rounded-xl p-6 border flex flex-col sm:flex-row items-center gap-6">
                <img
                    src={user?.photoURL || 'https://via.placeholder.com/150'}
                    alt={user?.displayName || 'Admin'}
                    className="w-28 h-28 rounded-full border-4 border-blue-500 object-cover"
                />
                <div className="text-center sm:text-left">
                    <h1 className="text-2xl font-bold text-gray-700">
                        {user?.displayName || 'Admin User'}
                    </h1>
                    <p className="text-gray-500">{user?.email}</p>
                    <span className="mt-2 inline-block px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full font-medium">
                        {role?.toUpperCase() || 'ADMIN'}
                    </span>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                <div className="bg-blue-500 p-6 rounded-lg shadow">
                    <h2 className="text-sm font-semibold">Total Medicines</h2>
                    <p className="text-2xl font-bold">{totalProducts}</p>
                </div>
                <div className="bg-green-500 p-6 rounded-lg shadow">
                    <h2 className="text-sm font-semibold">Total Sold</h2>
                    <p className="text-2xl font-bold">{totalSales}</p>
                </div>
                <div className="bg-yellow-500 p-6 rounded-lg shadow">
                    <h2 className="text-sm font-semibold">Total Income</h2>
                    <p className="text-2xl font-bold">৳{totalIncome.toFixed(2)}</p>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Admin Overview Chart
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
};

export default AdminHomepage;
