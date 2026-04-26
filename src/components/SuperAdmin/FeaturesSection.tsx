import React, { useState } from 'react';
import { PlusIcon, Pencil, Trash2, AlertCircle, Loader2, TriangleAlert } from 'lucide-react';
import AddFeatureModal from './AddFeatureModal';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useDeleteFeatureMutation, useGetFeaturesQuery } from '@/store/features/subscription/plan.api';

const FeatureSection: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFeatureId, setSelectedFeatureId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [featureToDelete, setFeatureToDelete] = useState<any>(null);

    const { data: features, isLoading, isError } = useGetFeaturesQuery({});
    const [deleteFeature, { isLoading: isDeleting }] = useDeleteFeatureMutation();

    const handleOpenAddModal = () => {
        setSelectedFeatureId(null);
        setIsModalOpen(true);
    };

    const handleEdit = (id: number) => {
        setSelectedFeatureId(id);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (feature: any) => {
        setFeatureToDelete(feature);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!featureToDelete) return;

        try {
            await deleteFeature(featureToDelete.id).unwrap();
            toast.success(`Feature "${featureToDelete.name}" deleted successfully`);
            setIsDeleteModalOpen(false);
            setFeatureToDelete(null);
        } catch (error: any) {
            console.error('Failed to delete feature:', error);
            const errorMessage = error?.data?.detail || error?.data?.message || 'Failed to delete feature. Please try again.';
            toast.error(errorMessage);
        }
    };

    const FeatureSkeleton = () => (
        <>
            {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b border-gray-800">
                    <td className="px-6 py-4">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-3 w-48" />
                    </td>
                    <td className="px-6 py-4">
                        <Skeleton className="h-6 w-24 rounded-md" />
                    </td>
                    <td className="px-6 py-4">
                        <Skeleton className="h-5 w-16" />
                    </td>
                    <td className="px-6 py-4">
                        <Skeleton className="h-5 w-20 mb-1" />
                        <Skeleton className="h-3 w-12" />
                    </td>
                    <td className="px-6 py-4">
                        <Skeleton className="h-5 w-24" />
                    </td>
                    <td className="px-6 py-4">
                        <Skeleton className="h-5 w-16 rounded-full" />
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
                        <h2 className="text-2xl font-bold text-gray-100">Features</h2>
                        <p className="text-sm text-gray-500">Manage your product features and usage limits.</p>
                    </div>
                    <button
                        onClick={handleOpenAddModal}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm active:scale-95"
                    >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Feature
                    </button>
                </div>

                {/* Table Section */}
                <div className="bg-background rounded-xl shadow-xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-800/50 border-b border-gray-700">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Feature Details</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Identifier</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Limit / Value</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Overage</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {isLoading ? (
                                    <FeatureSkeleton />
                                ) : isError ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-red-400">
                                                <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
                                                <p className="text-sm font-medium">Failed to load features</p>
                                                <p className="text-xs text-gray-500 mt-1">Please try refreshing the page</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : features?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            No features found. Add your first feature to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    features?.map((feature: any) => (
                                        <tr key={feature.id} className="hover:bg-gray-800/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-100">{feature.name}</div>
                                                <div className="text-xs text-gray-500 truncate max-w-xs">{feature.description}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-900 border border-gray-700 text-xs font-mono text-indigo-400">
                                                    {feature.feature_identifier}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">
                                                    {feature.have_limit ? `${feature.value} units` : 'Unlimited'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold">
                                                    {feature.price} <span className="uppercase text-[10px] text-gray-500">{feature.currency}</span>
                                                </div>
                                                <div className="text-xs text-gray-500 capitalize">per {feature.interval}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">
                                                    ${feature.overage_price}
                                                    <span className="text-xs text-gray-500 ml-1">/ extra unit</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {feature.active ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-400 border border-gray-600">
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(feature.id)}
                                                        className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors"
                                                        title="Edit Feature"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(feature)}
                                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                        title="Delete Feature"
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
                <AddFeatureModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    featureId={selectedFeatureId}
                />

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-4 text-red-400">
                                    <div className="p-3 bg-red-400/10 rounded-full">
                                        <TriangleAlert className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Delete Feature</h3>
                                </div>
                                <p className="text-gray-400 mb-6">
                                    Are you sure you want to delete <span className="text-gray-100 font-semibold">"{featureToDelete?.name}"</span>? 
                                    This action cannot be undone and may affect active subscriptions.
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
                                        {isDeleting ? 'Deleting...' : 'Delete Feature'}
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

export default FeatureSection;