
import { useState } from "react";
import { HelpCircle, Plus, Trash2, Edit2, Loader2 } from "lucide-react";
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
import { useAddBusinessFAQMutation, useDeleteBusinessFAQMutation, useGetBusinessFAQQuery, useUpdateBusinessFAQMutation } from "@/store/features/business/business.api";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface BussinessFAQSectionProps {
  business_id: string | number;
}

export default function BussinessFAQSection({ business_id }: BussinessFAQSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({ question: "", answer: "" });
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string>("");

  // RTK Query hooks
  const { data: faqs = [], isLoading, isError } = useGetBusinessFAQQuery({ business_id });
  const [addFAQ, { isLoading: isAddingFAQ }] = useAddBusinessFAQMutation();
  const [updateFAQ, { isLoading: isUpdatingFAQ }] = useUpdateBusinessFAQMutation();
  const [deleteFAQ, { isLoading: isDeletingFAQ }] = useDeleteBusinessFAQMutation();

  // Handle modal open for new FAQ
  const handleAddFAQ = () => {
    setEditingFAQ(null);
    setFormData({ question: "", answer: "" });
    setFormError("");
    setIsModalOpen(true);
  };

  // Handle modal open for edit
  const handleEditFAQ = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFormData({ question: faq.question, answer: faq.answer });
    setFormError("");
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({ question: "", answer: "" });
    setFormError("");
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.question.trim()) {
      setFormError("Question is required");
      return;
    }
    if (!formData.answer.trim()) {
      setFormError("Answer is required");
      return;
    }

    try {
      if (editingFAQ) {
        // Update existing FAQ
        await updateFAQ({
          business_id,
          faq_id: editingFAQ.id,
          data: formData,
        }).unwrap();
      } else {
        // Add new FAQ
        await addFAQ({
          business_id,
          data: formData,
        }).unwrap();
      }
      handleModalClose();
    } catch (error) {
      console.error("Error saving FAQ:", error);
      setFormError("Failed to save FAQ. Please try again.");
    }
  };

  // Handle delete
  const handleDelete = async (faqId: number) => {
    try {
      await deleteFAQ({
        business_id,
        faq_id: faqId,
      }).unwrap();
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  return (
    <div>
      <div
        className="rounded-3xl p-6 overflow-hidden relative"
        style={{
          background: `radial-gradient(ellipse 70% 60% at top right, rgba(80, 80, 80, 0.45) 0%, #000000 70%)`,
        }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#9E9E9E] mt-1">
            Common questions your agent can answer
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="rounded-2xl border border-[#3a3a3a] p-8 flex flex-col items-center justify-center text-center min-h-[200px] mb-4 bg-[#0d0d0d]/40">
            <Loader2 size={28} className="text-[#0E7DFA] animate-spin mb-3" />
            <p className="text-sm text-[#9E9E9E]">Loading FAQs...</p>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="rounded-2xl border border-red-500/20 p-6 flex flex-col items-center justify-center text-center mb-4 bg-red-500/5">
            <p className="text-sm text-red-400">Failed to load FAQs. Please try again.</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && faqs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#3a3a3a] p-8 flex flex-col items-center justify-center text-center min-h-[200px] mb-4 bg-[#0d0d0d]/40 transition-all hover:border-[#555] hover:bg-[#0d0d0d]/60">
            <div className="w-12 h-12 rounded-2xl bg-[#1e1e1e] flex items-center justify-center mb-4">
              <HelpCircle size={24} className="text-[#555]" />
            </div>
            <p className="text-sm font-medium text-[#9E9E9E] mb-1">
              No FAQs added yet
            </p>
            <p className="text-xs text-[#666] max-w-[220px] leading-relaxed">
              Add common questions your AI will answer for callers
            </p>
          </div>
        )}

        {/* FAQ List */}
        {!isLoading && !isError && faqs.length > 0 && (
          <div className="space-y-3 mb-6">
            {faqs.map((faq:any) => (
              <div
                key={faq.id}
                className="group rounded-xl border border-[#3a3a3a] bg-[#0d0d0d]/40 p-4 hover:border-[#555] hover:bg-[#0d0d0d]/60 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white mb-2 break-words">
                      {faq.question}
                    </p>
                    <p className="text-xs text-[#9E9E9E] leading-relaxed break-words">
                      {faq.answer}
                    </p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                    <button
                      onClick={() => handleEditFAQ(faq)}
                      disabled={isUpdatingFAQ}
                      className="p-2 rounded-lg bg-[#1e1e1e] hover:bg-[#2a2a2a] text-[#9E9E9E] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Edit FAQ"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(faq.id)}
                      disabled={isDeletingFAQ}
                      className="p-2 rounded-lg bg-[#1e1e1e] hover:bg-red-500/20 text-[#9E9E9E] hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete FAQ"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Button */}
        <button
          onClick={handleAddFAQ}
          className="flex items-center justify-center gap-2 bg-[#0E7DFA] hover:bg-blue-600 text-white text-sm font-medium px-4 py-3 rounded-xl w-full transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          <Plus size={18} />
          <span>Add FAQ</span>
        </button>
      </div>

      {/* Modal Dialog */}
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-md bg-[#1a1a1a] border border-[#3a3a3a] text-white">
          <DialogHeader>
            <DialogTitle>{editingFAQ ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
            <DialogDescription className="text-[#9E9E9E]">
              {editingFAQ ? "Update the question and answer" : "Create a new FAQ for your business"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {formError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-400">{formError}</p>
              </div>
            )}

            {/* Question Input */}
            <div className="space-y-2">
              <label htmlFor="question" className="text-sm font-medium text-[#9E9E9E]">
                Question
              </label>
              <input
                id="question"
                type="text"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="What is your question?"
                className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-[#3a3a3a] text-white placeholder-[#666] focus:outline-none focus:border-[#0E7DFA] focus:ring-1 focus:ring-[#0E7DFA] transition-colors"
              />
            </div>

            {/* Answer Input */}
            <div className="space-y-2">
              <label htmlFor="answer" className="text-sm font-medium text-[#9E9E9E]">
                Answer
              </label>
              <textarea
                id="answer"
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Provide the answer..."
                rows={4}
                className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-[#3a3a3a] text-white placeholder-[#666] focus:outline-none focus:border-[#0E7DFA] focus:ring-1 focus:ring-[#0E7DFA] transition-colors resize-none"
              />
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
                disabled={isAddingFAQ || isUpdatingFAQ}
                className="flex-1 px-4 py-2 rounded-lg bg-[#0E7DFA] hover:bg-blue-600 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAddingFAQ || isUpdatingFAQ ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : editingFAQ ? (
                  "Update FAQ"
                ) : (
                  "Add FAQ"
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
            <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
            <AlertDialogDescription className="text-[#9E9E9E]">
              Are you sure you want to delete this FAQ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel className="bg-[#0d0d0d] border-[#3a3a3a] text-white hover:bg-[#1e1e1e] hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(deleteConfirmId!)}
              disabled={isDeletingFAQ}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isDeletingFAQ ? (
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