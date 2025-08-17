import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const SellerHomePage = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        document.title = "Seller Dashboard - Home";
    }, []);

    // Fetch seller's own added products
    const { data: myProducts = [] } = useQuery({
        queryKey: ["mySellerProducts", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/medicine/seller/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    // Fetch seller's payment history (confirmed orders)
    const { data: soldProducts = [] } = useQuery({
        queryKey: ["sellerSoldProducts", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/seller/payment-history/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    // Calculate total income
    const totalIncome = soldProducts.reduce((sum, item) => sum + (item.payment || 0), 0);

    // Chart data: you can customize this (e.g., category wise income)
    const chartData = [
        {
            name: "My Products",
            count: myProducts.length,
        },
        {
            name: "Sold Products",
            count: soldProducts.length,
        },
        {
            name: "Income",
            count: totalIncome,
        },
    ];

    return (
        <div className="w-[90%] lg:w-[85%] mx-auto mt-6 space-y-8">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow-md rounded-xl p-6 border">
                    <h2 className="text-xl font-bold text-gray-700">My Products</h2>
                    <p className="text-3xl text-blue-600 font-semibold mt-2">{myProducts.length}</p>
                </div>
                <div className="bg-white shadow-md rounded-xl p-6 border">
                    <h2 className="text-xl font-bold text-gray-700">Products Sold</h2>
                    <p className="text-3xl text-green-600 font-semibold mt-2">{soldProducts.length}</p>
                </div>
                <div className="bg-white shadow-md rounded-xl p-6 border">
                    <h2 className="text-xl font-bold text-gray-700">Total Income</h2>
                    <p className="text-3xl text-emerald-600 font-semibold mt-2">৳{totalIncome.toFixed(2)}</p>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md border">
                <h2 className="text-lg font-bold mb-4 text-gray-700">Sales Overview</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#34d399" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SellerHomePage;
