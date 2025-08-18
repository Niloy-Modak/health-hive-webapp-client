import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const UserInfo = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // Fetch user payment history
    const { data: paymentHistoryData, isLoading } = useQuery({
        queryKey: ["paymentHistory", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments/history/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    // Ensure it's always an array
    const paymentHistory = Array.isArray(paymentHistoryData)
        ? paymentHistoryData
        : paymentHistoryData?.payments || [];

    // Transform data for chart
    const chartData = paymentHistory.map((item, index) => ({
        name: item.date
            ? new Date(item.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            })
            : `#${index + 1}`,
        amount: item.payment || 0,
    }));

    return (
        <div className="w-[90%] lg:w-[85%] mx-auto mt-6 space-y-8">
            {/* User Profile Section */}
            <div className="bg-white shadow-md rounded-xl p-6 border flex flex-col sm:flex-row items-center gap-6">
                {/* Profile Image */}
                <img
                    src={user?.photoURL || "https://via.placeholder.com/150"}
                    alt={user?.displayName}
                    className="w-28 h-28 rounded-full border-4 border-secondary object-cover"
                />

                {/* Info */}
                <div className="text-center sm:text-left">
                    <h1 className="text-2xl font-bold text-gray-700">
                        {user?.displayName || "User"}
                    </h1>
                    <p className="text-gray-500 mt-1">{user?.email}</p>
                    <span className="mt-2 inline-block px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full font-medium">
                        User Dashboard
                    </span>
                </div>
            </div>

            {/* Payment History Graph */}
            <div className="bg-white p-6 rounded-xl shadow-md border">
                <h2 className="text-lg font-bold mb-4 text-gray-700">
                    Payment History
                </h2>
                {isLoading ? (
                    <p className="text-gray-500">Loading payments...</p>
                ) : paymentHistory.length === 0 ? (
                    <p className="text-gray-500">No payment history found.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default UserInfo;
