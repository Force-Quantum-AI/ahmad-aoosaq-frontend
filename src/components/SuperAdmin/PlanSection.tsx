import React, { useState } from 'react';
import { PlusIcon, Pencil, Trash2, AlertCircle, Loader2, TriangleAlert, CheckCircle2 } from 'lucide-react';
import { useGetPlanQuery, useDeletePlanMutation } from '@/store/features/plan/plan.api';
import { Skeleton } from '@/components/ui/skeleton';
import { Plan } from '@/store/features/plan/plan.types';
import { toast } from 'sonner';
import AddPlanModal from './AddPlanModal';

const PlanSection: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);

    const { data: plans, isLoading, isError } = useGetPlanQuery();
    const [deletePlan, { isLoading: isDeleting }] = useDeletePlanMutation();

    const handleOpenAddModal = () => {
        setSelectedPlanId(null);
        setIsModalOpen(true);
    };

    const handleEdit = (id: number) => {
        setSelectedPlanId(id);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (plan: Plan) => {
        setPlanToDelete(plan);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!planToDelete) return;

        try {
            await deletePlan(planToDelete.id).unwrap();
            toast.success(`Plan "${planToDelete.name}" deleted successfully`);
            setIsDeleteModalOpen(false);
            setPlanToDelete(null);
        } catch (error: any) {
            console.error('Failed to delete plan:', error);
            const errorMessage = error?.data?.detail || error?.data?.message || 'Failed to delete plan. Please try again.';
            toast.error(errorMessage);
        }
    };

    const PlanSkeleton = () => (
        <>
            {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b border-gray-800">
                    <td className="px-6 py-4">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex gap-2">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <Skeleton className="h-5 w-16" />
                    </td>
                    <td className="px-6 py-4">
                        <Skeleton className="h-5 w-20 mb-1" />
                        <Skeleton className="h-3 w-12" />
                    </td>
                    <td className="px-6 py-4">
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );

    return (
        <div className="p-6 bg-background min-h-screen text-gray-200">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-100">Manage Plan</h2>
                        <p className="text-sm text-gray-500">Create and manage your subscription plans.</p>
                    </div>
                    <button
                        onClick={handleOpenAddModal}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm active:scale-95"
                    >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Plan
                    </button>
                </div>

                {/* Table Section */}
                <div className="bg-background rounded-xl shadow-xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-800/50 border-b border-gray-700">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Plan Details</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Features</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Trial</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Pricing</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {isLoading ? (
                                    <PlanSkeleton />
                                ) : isError ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-red-400">
                                                <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
                                                <p className="text-sm font-medium">Failed to load plans</p>
                                                <p className="text-xs text-gray-500 mt-1">Please try refreshing the page</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : plans?.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            No plans found. Add your first plan to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    plans?.map((plan: Plan) => (
                                        <tr key={plan.id} className="hover:bg-gray-800/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-100 capitalize">{plan.name}</div>
                                                <div className="text-xs text-gray-500">ID: {plan.stripe_product_id}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {plan.marketing_features.slice(0, 3).map((feature, idx) => (
                                                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px]">
                                                            {feature}
                                                        </span>
                                                    ))}
                                                    {plan.marketing_features.length > 3 && (
                                                        <span className="text-[10px] text-gray-500">+{plan.marketing_features.length - 3} more</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-300">
                                                    {plan.trial_period_days} Days
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-white">
                                                    {plan.price} <span className="uppercase text-[10px] text-gray-500 font-normal">{plan.currency}</span>
                                                </div>
                                                <div className="text-[11px] text-gray-500 capitalize">per {plan.interval}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {plan.active ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-gray-700 text-gray-400 border border-gray-600">
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(plan.id)}
                                                        className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors"
                                                        title="Edit Plan"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(plan)}
                                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                        title="Delete Plan"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Edit/Add Modal */}
                <AddPlanModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    setIsModalOpen={setIsModalOpen}
                    planId={selectedPlanId}
                />

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-4 text-red-500">
                                    <div className="p-3 bg-red-400/10 rounded-full font-bold">
                                        <TriangleAlert className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Delete Plan</h3>
                                </div>
                                <p className="text-gray-400 mb-6">
                                    Are you sure you want to delete the plan <span className="text-gray-100 font-semibold">"{planToDelete?.name}"</span>?
                                    This will affect all current subscriptions under this plan.
                                </p>
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        disabled={isDeleting}
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={isDeleting}
                                        onClick={confirmDelete}
                                        className="inline-flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {isDeleting ? 'Deleting...' : 'Delete Plan'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlanSection;