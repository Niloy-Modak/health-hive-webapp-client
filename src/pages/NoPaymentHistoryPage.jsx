import React from 'react';
import { MdPayment } from 'react-icons/md';

const NoPaymentHistoryPage = () => {
    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-base-200 px-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white dark:bg-base-100 p-8 rounded-2xl shadow-xl">
                    <div className="text-primary mb-4">
                        <MdPayment className="mx-auto text-6xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-base-content mb-2">
                        No Payment History Found
                    </h2>
                    <p className="text-base-content/70 mb-6">
                        You haven’t made any transactions yet. Once you do, your payment history will show up here.
                    </p>
                    
                </div>
            </div>
        </div>
    );
};

export default NoPaymentHistoryPage;