import { Plus, Trash2, Edit2, Loader2 } from "lucide-react";
import { useState } from "react";
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
  useGetBusinessAdditionalInformationQuery,
  useAddBusinessAdditionalInformationMutation,
  useUpdateBusinessAdditionalInformationMutation,
  useDeleteBusinessAdditionalInformationMutation,
} from "@/store/features/business/business.api";

interface AdditionalInfo {
  id: number;
  content: string;
}

interface AdditionalInformationProps {
  business_id: string | number;
}

export default function AdditionalInformation({ business_id }: AdditionalInformationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInfo, setEditingInfo] = useState<AdditionalInfo | null>(null);
  const [content, setContent] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string>("");

  // RTK Query hooks
  const { data: items = [], isLoading, isError } = useGetBusinessAdditionalInformationQuery({ business_id });
  const [addInfo, { isLoading: isAddingInfo }] = useAddBusinessAdditionalInformationMutation();
  const [updateInfo, { isLoading: isUpdatingInfo }] = useUpdateBusinessAdditionalInformationMutation();
  const [deleteInfo, { isLoading: isDeletingInfo }] = useDeleteBusinessAdditionalInformationMutation();

  // Handle modal open for new info
  const handleAddInfo = () => {
    setEditingInfo(null);
    setContent("");
    setFormError("");
    setIsModalOpen(true);
  };

  // Handle modal open for edit
  const handleEditInfo = (info: AdditionalInfo) => {
    setEditingInfo(info);
    setContent(info.content);
    setFormError("");
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setContent("");
    setFormError("");
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!content.trim()) {
      setFormError("Information content is required");
      return;
    }

    try {
      if (editingInfo) {
        // Update existing info
        await updateInfo({
          business_id,
          data: { id: editingInfo.id, content },
        }).unwrap();
      } else {
        // Add new info
        await addInfo({
          business_id,
          data: { content },
        }).unwrap();
      }
      handleModalClose();
    } catch (error) {
      console.error("Error saving information:", error);
      setFormError("Failed to save information. Please try again.");
    }
  };

  // Handle delete
  const handleDelete = async (infoId: number) => {
    try {
      await deleteInfo({
        business_id,
        data: { id: infoId },
      }).unwrap();
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting information:", error);
    }
  };

  return (
    <div className="mt-16">
      <div
        className="rounded-3xl overflow-hidden relative"
        style={{
          background: `radial-gradient(ellipse 70% 60% at top right, rgba(80, 80, 80, 0.45) 0%, #000000 70%)`,
        }}
      >
        {/* Header */}
        <div className="p-6 pb-0 mb-6">
          <h2 className="text-2xl font-semibold text-white">
            Additional Information
          </h2>
          <p className="text-sm text-[#9E9E9E] mt-1">
            Anything else your agent should know about your business
          </p>
        </div>

        <div className="rounded-2xl p-6">
          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={32} className="text-[#0E7DFA] animate-spin mb-3" />
              <p className="text-sm text-[#9E9E9E]">Loading information...</p>
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="rounded-2xl border border-red-500/20 p-6 flex flex-col items-center justify-center text-center bg-red-500/5 mb-4">
              <p className="text-sm text-red-400">Failed to load information. Please try again.</p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#3a3a3a] p-8 flex flex-col items-center justify-center text-center min-h-[200px] mb-4 bg-[#0d0d0d]/40 transition-all hover:border-[#555] hover:bg-[#0d0d0d]/60">
              <div className="w-12 h-12 rounded-2xl bg-[#1e1e1e] flex items-center justify-center mb-4">
                <Plus size={24} className="text-[#555]" />
              </div>
              <p className="text-sm font-medium text-[#9E9E9E] mb-1">
                No additional information yet
              </p>
              <p className="text-xs text-[#666] max-w-[220px] leading-relaxed">
                Add details that help your agent better understand your business
              </p>
            </div>
          )}

          {/* Grid */}
          {!isLoading && !isError && items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {items.map((item:any, index:any) => (
                <div
                  key={item.id}
                  className="group flex items-start gap-3 bg-[#19191A] rounded-xl px-4 py-4 transition-all hover:bg-[#1f1f20] hover:shadow-lg hover:shadow-blue-500/10 border border-transparent hover:border-[#3a3a3a]"
                >
                  {/* Number Badge */}
                  <span className="shrink-0 w-10 h-10 rounded-full bg-[#0e2a4a] border border-blue-500/20 text-[#60a5fa] text-sm font-semibold flex items-center justify-center mt-0.5">
                    {index + 1}
                  </span>

                  {/* Content */}
                  <span className="flex-1 text-sm text-white leading-relaxed break-words pt-0.5">
                    {item.content}
                  </span>

                  {/* Action Buttons */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                    <button
                      onClick={() => handleEditInfo(item)}
                      disabled={isUpdatingInfo}
                      className="p-2 rounded-lg bg-[#1e1e1e] hover:bg-[#2a2a2a] text-[#9E9E9E] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Edit information"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(item.id)}
                      disabled={isDeletingInfo}
                      className="p-2 rounded-lg bg-[#1e1e1e] hover:bg-red-500/20 text-[#9E9E9E] hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete information"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Button */}
          <div className="flex justify-center">
            <button
              onClick={handleAddInfo}
              disabled={isLoading}
              className="flex items-center gap-2 bg-[#0E7DFA] hover:bg-blue-600 text-white text-sm font-medium px-5 py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={18} />
              Add Information
            </button>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-md bg-[#1a1a1a] border border-[#3a3a3a] text-white">
          <DialogHeader>
            <DialogTitle>{editingInfo ? "Edit Information" : "Add New Information"}</DialogTitle>
            <DialogDescription className="text-[#9E9E9E]">
              {editingInfo
                ? "Update the information about your business"
                : "Add details that help your agent understand your business better"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {formError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-400">{formError}</p>
              </div>
            )}

            {/* Content Input */}
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium text-[#9E9E9E]">
                Information Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter information about your business..."
                rows={4}
                className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-[#3a3a3a] text-white placeholder-[#666] focus:outline-none focus:border-[#0E7DFA] focus:ring-1 focus:ring-[#0E7DFA] transition-colors resize-none"
              />
              <p className="text-xs text-[#666]">
                {content.length}/500 characters
              </p>
            </div>

            {/* Action Buttons */}
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
                disabled={isAddingInfo || isUpdatingInfo}
                className="flex-1 px-4 py-2 rounded-lg bg-[#0E7DFA] hover:bg-blue-600 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAddingInfo || isUpdatingInfo ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : editingInfo ? (
                  "Update Information"
                ) : (
                  "Add Information"
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent className="bg-[#1a1a1a] border border-[#3a3a3a] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Information</AlertDialogTitle>
            <AlertDialogDescription className="text-[#9E9E9E]">
              Are you sure you want to delete this information? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel className="bg-[#0d0d0d] border-[#3a3a3a] text-white hover:bg-[#1e1e1e] hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(deleteConfirmId!)}
              disabled={isDeletingInfo}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isDeletingInfo ? (
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