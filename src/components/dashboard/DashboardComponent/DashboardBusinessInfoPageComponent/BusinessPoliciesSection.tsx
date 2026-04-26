import { useState } from "react";
import { Plus, Trash2, Edit2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useGetBusinessPoliciesQuery,
  useAddBusinessPoliciesMutation,
  useUpdateBusinessPoliciesMutation,
  useDeleteBusinessPoliciesMutation,
} from "@/store/features/business/business.api";

interface Policy {
  id: number;
  policy_type: string;
  policy_title: string;
  content: string;
}

interface BusinessPoliciesSectionProps {
  business_id?: number | string;
}

export default function BusinessPoliciesSection({ business_id }: BusinessPoliciesSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [formData, setFormData] = useState({ policy_type: "cancellation", policy_title: "", content: "" });
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string>("");

  // RTK Query hooks
  const { data: policies = [], isLoading, isError } = useGetBusinessPoliciesQuery({ business_id }, { skip: !business_id });
  const [addPolicy, { isLoading: isAddingPolicy }] = useAddBusinessPoliciesMutation();
  const [updatePolicy, { isLoading: isUpdatingPolicy }] = useUpdateBusinessPoliciesMutation();
  const [deletePolicy, { isLoading: isDeletingPolicy }] = useDeleteBusinessPoliciesMutation();

  // Handle modal open for new Policy
  const handleAddPolicy = () => {
    setEditingPolicy(null);
    setFormData({ policy_type: "cancellation", policy_title: "", content: "" });
    setFormError("");
    setIsModalOpen(true);
  };

  // Handle modal open for edit
  const handleEditPolicy = (policy: Policy) => {
    setEditingPolicy(policy);
    setFormData({ policy_type: policy.policy_type, policy_title: policy.policy_title, content: policy.content });
    setFormError("");
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({ policy_type: "cancellation", policy_title: "", content: "" });
    setFormError("");
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.policy_title.trim()) {
      setFormError("Policy Title is required");
      return;
    }
    if (!formData.content.trim()) {
      setFormError("Policy Content is required");
      return;
    }

    try {
      if (editingPolicy) {
        // Update existing Policy
        await updatePolicy({
          business_id,
          data: { id: editingPolicy.id, ...formData },
        }).unwrap();
      } else {
        // Add new Policy
        await addPolicy({
          business_id,
          data: formData,
        }).unwrap();
      }
      handleModalClose();
    } catch (error) {
      console.error("Error saving policy:", error);
      setFormError("Failed to save policy. Please try again.");
    }
  };

  // Handle delete
  const handleDelete = async (policyId: number) => {
    try {
      await deletePolicy({
        business_id,
        policy_id: policyId,
      }).unwrap();
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting policy:", error);
    }
  };

  return (
    <div>
      <div
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{
          background: `radial-gradient(ellipse 70% 60% at top right, rgba(80, 80, 80, 0.45) 0%, #000000 70%)`,
        }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white">Business Policies</h2>
          <p className="text-sm text-[#9E9E9E] mt-1">
            Important policies your agent should know
          </p>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 size={24} className="text-[#0E7DFA] animate-spin mb-3" />
            <p className="text-sm text-[#9E9E9E]">Loading policies...</p>
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-500/20 p-6 flex flex-col items-center justify-center text-center bg-red-500/5 mb-4">
            <p className="text-sm text-red-400">Failed to load policies. Please try again.</p>
          </div>
        )}

        {!isLoading && !isError && policies?.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#3a3a3a] p-8 flex flex-col items-center justify-center text-center min-h-[150px] mb-4 bg-[#0d0d0d]/40">
            <p className="text-sm font-medium text-[#9E9E9E]">No policies added yet</p>
            <p className="text-xs text-[#666] mt-1">Specify important rules for your store or service</p>
          </div>
        )}

        {!isLoading && !isError && policies?.length > 0 && (
          <div className="space-y-4 mb-6">
            {policies.map((p: any) => (
              <div key={p.id} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-white capitalize break-words">
                    {p.policy_title || p.policy_type} Policy
                  </label>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEditPolicy(p)}
                      disabled={isUpdatingPolicy}
                      className="p-1.5 rounded-lg bg-[#1e1e1e] hover:bg-[#2a2a2a] text-[#9E9E9E] hover:text-white transition-colors disabled:opacity-50"
                      title="Edit Policy"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(p.id)}
                      disabled={isDeletingPolicy}
                      className="p-1.5 rounded-lg bg-[#1e1e1e] hover:bg-red-500/20 text-[#9E9E9E] hover:text-red-400 transition-colors disabled:opacity-50"
                      title="Delete Policy"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="rounded-xl px-4 py-4 bg-[rgba(25,25,26,0.60)] border border-transparent hover:border-[#3a3a3a] transition-all">
                  <p className="text-sm text-gray-300 leading-relaxed break-words">
                    {p.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && (
          <button
            onClick={handleAddPolicy}
            className="flex items-center justify-center gap-2 bg-[#0E7DFA] hover:bg-blue-600 text-white text-sm font-medium px-4 py-3 rounded-xl w-full transition-all hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
            disabled={isLoading}
          >
            <Plus size={18} />
            <span>Add Policy</span>
          </button>
        )}
      </div>

      {/* Modal Dialog for Add/Edit */}
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-md bg-[#1a1a1a] border border-[#3a3a3a] text-white">
          <DialogHeader>
            <DialogTitle>{editingPolicy ? "Edit Policy" : "Add New Policy"}</DialogTitle>
            <DialogDescription className="text-[#9E9E9E]">
              {editingPolicy ? "Update your business policy" : "Create a new policy for your business"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-400">{formError}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#9E9E9E]">Policy Type</label>
              <select
                value={formData.policy_type}
                onChange={(e) => setFormData({ ...formData, policy_type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-[#3a3a3a] text-white focus:outline-none focus:border-[#0E7DFA] focus:ring-1 focus:ring-[#0E7DFA] transition-colors"
                style={{ WebkitAppearance: 'none' }}
              >
                <option value="cancellation">Cancellation</option>
                <option value="deposit">Deposit</option>
                <option value="payment">Payment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#9E9E9E]">Policy Title</label>
              <input
                type="text"
                value={formData.policy_title}
                onChange={(e) => setFormData({ ...formData, policy_title: e.target.value })}
                placeholder="e.g. 24-Hour Notice Cancellation"
                className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-[#3a3a3a] text-white placeholder-[#666] focus:outline-none focus:border-[#0E7DFA] focus:ring-1 focus:ring-[#0E7DFA] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#9E9E9E]">Policy Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Detail your policy here..."
                rows={4}
                className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-[#3a3a3a] text-white placeholder-[#666] focus:outline-none focus:border-[#0E7DFA] focus:ring-1 focus:ring-[#0E7DFA] transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleModalClose}
                className="flex-1 px-4 py-2 rounded-lg bg-[#0d0d0d] border border-[#3a3a3a] text-white text-sm font-medium hover:bg-[#1e1e1e] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAddingPolicy || isUpdatingPolicy}
                className="flex-1 px-4 py-2 rounded-lg bg-[#0E7DFA] hover:bg-blue-600 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAddingPolicy || isUpdatingPolicy ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : editingPolicy ? (
                  "Update Policy"
                ) : (
                  "Add Policy"
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Dialog for Delete Confirmation */}
      <AlertDialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent className="bg-[#1a1a1a] border border-[#3a3a3a] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Policy</AlertDialogTitle>
            <AlertDialogDescription className="text-[#9E9E9E]">
              Are you sure you want to delete this policy? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel className="bg-[#0d0d0d] border-[#3a3a3a] text-white hover:bg-[#1e1e1e] hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(deleteConfirmId!)}
              disabled={isDeletingPolicy}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 flex items-center gap-2"
            >
              {isDeletingPolicy ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
