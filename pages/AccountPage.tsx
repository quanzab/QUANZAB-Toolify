import React from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import { useAuth } from '../contexts/AuthContext';
import { StarIcon, CreditCardIcon, UserIcon } from '../components/Icons';

const AccountPage: React.FC = () => {
    const { user } = useAuth();

    const handleManageSubscription = (action: 'change' | 'cancel') => {
        alert(`This is a demo feature. In a real app, this would take you to a billing portal to ${action} your subscription.`);
    };

    return (
        <ToolPageLayout
            title="My Account"
            description="Manage your account details, subscription, and billing information."
        >
            <div className="space-y-12">
                {/* Account Details */}
                <section>
                    <div className="flex items-center gap-4 mb-4">
                        <UserIcon className="w-8 h-8 text-primary" />
                        <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">Account Details</h2>
                    </div>
                    <div className="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                        <p className="text-slate-600 dark:text-slate-400">Email Address</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-gray-200">{user?.email}</p>
                    </div>
                </section>

                {/* Subscription Details */}
                <section>
                    <div className="flex items-center gap-4 mb-4">
                        <StarIcon className="w-8 h-8 text-yellow-400" />
                        <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">Subscription Plan</h2>
                    </div>
                    <div className="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-start flex-wrap gap-4">
                            <div>
                                <p className="text-xl font-bold text-primary">QUANZAB Pro Plan</p>
                                <p className="text-slate-500 dark:text-slate-400">Status: Active</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleManageSubscription('change')}
                                    className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-gray-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 shadow-sm"
                                >
                                    Change Plan
                                </button>
                                <button
                                    onClick={() => handleManageSubscription('cancel')}
                                    className="px-4 py-2 text-sm font-semibold bg-transparent text-red-500 rounded-md hover:bg-red-500/10"
                                >
                                    Cancel Subscription
                                </button>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                             <h4 className="font-semibold text-slate-700 dark:text-gray-300 mb-2">Your Pro plan includes:</h4>
                             <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                                 <li>Unlimited access to all 50+ tools</li>
                                 <li>Batch processing for files</li>
                                 <li>Higher limits for AI tools</li>
                                 <li>Priority email support</li>
                             </ul>
                        </div>
                    </div>
                </section>

                {/* Billing History */}
                <section>
                     <div className="flex items-center gap-4 mb-4">
                        <CreditCardIcon className="w-8 h-8 text-green-400" />
                        <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">Billing History</h2>
                    </div>
                    <div className="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b-2 border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="p-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Date</th>
                                    <th className="p-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Description</th>
                                    <th className="p-2 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t border-slate-200 dark:border-slate-700 text-slate-700 dark:text-gray-300">
                                    <td className="p-2 text-sm">2024-07-15</td>
                                    <td className="p-2 text-sm">QUANZAB Pro - Monthly Subscription</td>
                                    <td className="p-2 text-sm text-right">$9.99</td>
                                </tr>
                                <tr className="border-t border-slate-200 dark:border-slate-700 text-slate-700 dark:text-gray-300">
                                    <td className="p-2 text-sm">2024-06-15</td>
                                    <td className="p-2 text-sm">QUANZAB Pro - Monthly Subscription</td>
                                    <td className="p-2 text-sm text-right">$9.99</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </ToolPageLayout>
    );
};

export default AccountPage;