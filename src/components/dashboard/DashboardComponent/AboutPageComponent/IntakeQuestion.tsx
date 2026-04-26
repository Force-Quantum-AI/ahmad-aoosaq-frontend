import { Plus, Trash2, Edit2, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
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
  useGetIntakeQuestionQuery,
  useCreateIntakeQuestionMutation,
  useUpdateIntakeQuestionMutation,
  useDeleteIntakeQuestionMutation,
} from "@/store/features/agent/agent.api";
import { useGetServicesQuery } from "@/store/features/business/business.api";
import IntakeQuestionModal from "./IntakeQuestionModal";

interface DisqualificationRule {
  id?: number;
  disqualifying_value: string;
  message_to_caller: string;
}

interface IntakeQuestionData {
  id: number;
  question: string;
  answer_type: string;
  when_to_ask: string;
  specific_services: number[];
  specific_categories: number[];
  is_required: boolean;
  is_active: boolean;
  disqualification_rules: DisqualificationRule[];
}

interface Service {
  id: number;
  name: string;
  category_name: string;
}

interface DisqualificationRuleForm {
  disqualifying_value: string;
  message_to_caller: string;
}

const IntakeQuestion = () => {
  const businessId = useSelector((state: any) => state.business?.businessId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<IntakeQuestionData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    question: "",
    answer_type: "yes_no",
    when_to_ask: "specific_services",
    specific_services: [] as number[],
    specific_categories: [] as number[],
    is_required: true,
    is_active: true,
    disqualification_rules: [] as DisqualificationRuleForm[],
  });

  const [newRule, setNewRule] = useState<DisqualificationRuleForm>({
    disqualifying_value: "",
    message_to_caller: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // RTK Query hooks
  const { data: intakeQuestions = [], isLoading: questionsLoading } =
    useGetIntakeQuestionQuery({});
  const { data: services = [] } = useGetServicesQuery({ business_id: businessId });
  const [createQuestion, { isLoading: isCreating }] =
    useCreateIntakeQuestionMutation();
  const [updateQuestion, { isLoading: isUpdating }] =
    useUpdateIntakeQuestionMutation();
  const [deleteQuestion, { isLoading: isDeleting }] =
    useDeleteIntakeQuestionMutation();

  // Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.question.trim()) {
      errors.question = "Question is required";
    }

    if (
      formData.when_to_ask === "specific_services" &&
      formData.specific_services.length === 0
    ) {
      errors.specific_services = "Select at least one service";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle modal open for new question
  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setFormData({
      question: "",
      answer_type: "yes_no",
      when_to_ask: "on-all-calls",
      specific_services: [],
      specific_categories: [],
      is_required: true,
      is_active: true,
      disqualification_rules: [],
    });
    setNewRule({ disqualifying_value: "", message_to_caller: "" });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle modal open for edit
  const handleEditQuestion = (question: IntakeQuestionData) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      answer_type: question.answer_type,
      when_to_ask: question.when_to_ask,
      specific_services: question.specific_services,
      specific_categories: question.specific_categories,
      is_required: question.is_required,
      is_active: question.is_active,
      disqualification_rules: question.disqualification_rules.map((rule) => ({
        disqualifying_value: rule.disqualifying_value,
        message_to_caller: rule.message_to_caller,
      })),
    });
    setNewRule({ disqualifying_value: "", message_to_caller: "" });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
    setFormData({
      question: "",
      answer_type: "yes_no",
      when_to_ask: "on-all-calls",
      specific_services: [],
      specific_categories: [],
      is_required: true,
      is_active: true,
      disqualification_rules: [],
    });
    setNewRule({ disqualifying_value: "", message_to_caller: "" });
    setFormErrors({});
  };

  // Handle add disqualification rule
  const handleAddRule = () => {
    if (!newRule.disqualifying_value.trim() || !newRule.message_to_caller.trim()) {
      alert("Please fill in all rule fields");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      disqualification_rules: [...prev.disqualification_rules, newRule],
    }));
    setNewRule({ disqualifying_value: "", message_to_caller: "" });
  };

  // Handle remove disqualification rule
  const handleRemoveRule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      disqualification_rules: prev.disqualification_rules.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // Handle service selection
  const handleServiceToggle = (serviceId: number) => {
    setFormData((prev) => ({
      ...prev,
      specific_services: prev.specific_services.includes(serviceId)
        ? prev.specific_services.filter((id) => id !== serviceId)
        : [...prev.specific_services, serviceId],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        question: formData.question,
        answer_type: formData.answer_type,
        when_to_ask: formData.when_to_ask,
        specific_services: formData.specific_services,
        specific_categories: formData.specific_categories,
        is_required: formData.is_required,
        is_active: formData.is_active,
        disqualification_rules: formData.disqualification_rules,
      };

      if (editingQuestion) {
        await updateQuestion({
          data: { ...payload, id: editingQuestion.id },
        }).unwrap();
      } else {
        await createQuestion({ data: payload }).unwrap();
      }

      handleModalClose();
    } catch (error) {
      console.error("Error saving question:", error);
      alert("Failed to save question. Please try again.");
    }
  };

  // Handle delete
  const handleDelete = async (questionId: number) => {
    try {
      await deleteQuestion({ data: { id: questionId } }).unwrap();
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question. Please try again.");
    }
  };

  // Get service name by ID
  const getServiceName = (serviceId: number) => {
    return services.find((s: Service) => s.id === serviceId)?.name || `Service ${serviceId}`;
  };

  return (
    <>
      <div
        className="rounded-3xl p-8 shadow-sm overflow-hidden"
        style={{
          background: `radial-gradient(ellipse 70% 60% at top right, rgba(80, 80, 80, 0.45) 0%, #000000 70%)`,
        }}
      >
        <div className="mb-6 flex items-center justify-between border-b border-[#333]/50 pb-4">
          <div>
            <h3 className="text-2xl font-normal text-white">
              Intake Questions
            </h3>
            <p className="text-gray-400 text-lg mt-1">
              Questions your agent asks during booking calls
            </p>
          </div>
          <button
            onClick={handleAddQuestion}
            disabled={questionsLoading}
            className="flex items-center gap-2 px-6 py-3 text-base bg-[#0D7EFD] hover:bg-blue-600 text-white rounded-xl cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            Add Questions
          </button>
        </div>

        {/* Loading state */}
        {questionsLoading && (
          <div className="flex flex-col items-center justify-center py-12 bg-[#0D0D0D] rounded-2xl border border-[rgba(50,50,50,0.2)]">
            <Loader2 size={32} className="text-[#0E7DFA] animate-spin mb-3" />
            <p className="text-sm text-[#9E9E9E]">Loading questions...</p>
          </div>
        )}

        {/* Empty State */}
        {!questionsLoading && intakeQuestions.length === 0 && (
          <div className="bg-[#0D0D0D] rounded-2xl p-16 text-center border border-[rgba(50,50,50,0.2)]">
            <p className="text-[#9E9E9E] text-lg font-medium mb-2">
              No Intake questions configured yet
            </p>
            <p className="text-[#9E9E9E] text-sm">
              Add questions your agent will ask during booking calls
            </p>
          </div>
        )}

        {/* Questions List */}
        {!questionsLoading && intakeQuestions.length > 0 && (
          <div className="space-y-3 mb-6">
            {intakeQuestions.map((question: IntakeQuestionData) => (
              <div
                key={question.id}
                className="group rounded-xl border border-[#3a3a3a] bg-[#0d0d0d]/40 p-4 hover:border-[#555] hover:bg-[#0d0d0d]/60 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-semibold text-[#0E7DFA] bg-[#0e2a4a] px-2.5 py-1 rounded-md">
                        {question.answer_type.replace(/_/g, " ").toUpperCase()}
                      </span>
                      {!question.is_active && (
                        <span className="text-xs font-semibold text-gray-500 bg-[#2a2a2a] px-2.5 py-1 rounded-md">
                          INACTIVE
                        </span>
                      )}
                      {question.is_required && (
                        <span className="text-xs font-semibold text-yellow-500 bg-[#2a2500] px-2.5 py-1 rounded-md">
                          REQUIRED
                        </span>
                      )}
                    </div>

                    {/* Question Text */}
                    <p className="text-sm font-medium text-white break-words mb-2">
                      {question.question}
                    </p>

                    {/* Meta Info */}
                    <p className="text-xs text-[#9E9E9E] mb-2">
                      When: {question.when_to_ask === "on-all-calls" ? "On all calls" : "Specific services"}
                    </p>

                    {/* Services */}
                    {question.when_to_ask === "specific_services" && question.specific_services.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {question.specific_services.map((serviceId) => (
                          <span
                            key={serviceId}
                            className="text-xs bg-[#1e1e1e] text-[#9E9E9E] px-2 py-1 rounded"
                          >
                            {getServiceName(serviceId)}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Disqualification Rules */}
                    {question.disqualification_rules.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#3a3a3a] space-y-1">
                        {question.disqualification_rules.map((rule, idx) => (
                          <div key={idx} className="text-xs text-[#9E9E9E]">
                            <span className="text-red-400">If answer is "{rule.disqualifying_value}":</span>{" "}
                            {rule.message_to_caller}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                    <button
                      onClick={() => handleEditQuestion(question)}
                      disabled={isUpdating}
                      className="p-2 hidden rounded-lg bg-[#1e1e1e] hover:bg-[#2a2a2a] text-[#9E9E9E] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Edit question"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(question.id)}
                      disabled={isDeleting}
                      className="p-2 rounded-lg bg-[#1e1e1e] hover:bg-red-500/20 text-[#9E9E9E] hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete question"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Dialog */}
       <Dialog open={isEditModalOpen}>
        <DialogContent className="sm:max-w-2xl bg-[#1a1a1a] border border-[#3a3a3a] text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion ? "Edit Intake Question" : "Add New Intake Question"}
            </DialogTitle>
            <DialogDescription className="text-[#9E9E9E]">
              {editingQuestion
                ? "Update the question and its settings"
                : "Create a new intake question to qualify leads"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-2">
              <label htmlFor="question" className="text-sm font-medium text-[#9E9E9E]">
                Question Text *
              </label>
              <input
                id="question"
                type="text"
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                placeholder="e.g., Do you have any allergies?"
                className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-[#3a3a3a] text-white placeholder-[#666] focus:outline-none focus:border-[#0E7DFA] focus:ring-1 focus:ring-[#0E7DFA] transition-colors"
              />
              {formErrors.question && (
                <p className="text-xs text-red-400">{formErrors.question}</p>
              )}
            </div>


            <div className="space-y-2">
              <label className="text-sm font-medium text-[#9E9E9E]">
                Answer Type *
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "yes_no", label: "Yes/No" },
                  { value: "text", label: "Text" },
                  { value: "multiple_choice", label: "Multiple Choice" },
                  { value: "number", label: "Number" },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, answer_type: type.value })
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      formData.answer_type === type.value
                        ? "bg-[#0E7DFA] text-white"
                        : "bg-[#1e1e1e] text-[#9E9E9E] hover:bg-[#2a2a2a]"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>


            <div className="space-y-3">
              <label className="text-sm font-medium text-[#9E9E9E]">
                When to Ask *
              </label>
              <div className="space-y-2">
                {[
                  { value: "specific_services", label: "Only for specific services" },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="when_to_ask"
                      value={option.value}
                      checked={formData.when_to_ask === option.value}
                      onChange={(e) =>
                        setFormData({ ...formData, when_to_ask: e.target.value })
                      }
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-white">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>


            {formData.when_to_ask === "specific_services" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#9E9E9E]">
                  Select Services *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#0d0d0d] p-3 rounded-lg max-h-48 overflow-y-auto border border-[#3a3a3a]">
                  {services.map((service: Service) => (
                    <label
                      key={service.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-[#1e1e1e] p-2 rounded transition"
                    >
                      <input
                        type="checkbox"
                        checked={formData.specific_services.includes(service.id)}
                        onChange={() => handleServiceToggle(service.id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs text-white truncate">
                        {service.name}
                      </span>
                    </label>
                  ))}
                </div>
                {formErrors.specific_services && (
                  <p className="text-xs text-red-400">
                    {formErrors.specific_services}
                  </p>
                )}
              </div>
            )}


            <div className="flex items-center justify-between bg-[#0d0d0d] p-3 rounded-lg border border-[#3a3a3a]">
              <label className="text-sm font-medium text-[#9E9E9E]">
                Required Question
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, is_required: !formData.is_required })
                }
                className={`relative w-11 h-6 rounded-full transition ${
                  formData.is_required ? "bg-[#0E7DFA]" : "bg-[#3a3a3a]"
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition transform ${
                    formData.is_required ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>


            <div className="flex items-center justify-between bg-[#0d0d0d] p-3 rounded-lg border border-[#3a3a3a]">
              <label className="text-sm font-medium text-[#9E9E9E]">
                Active
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, is_active: !formData.is_active })
                }
                className={`relative w-11 h-6 rounded-full transition ${
                  formData.is_active ? "bg-[#0E7DFA]" : "bg-[#3a3a3a]"
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition transform ${
                    formData.is_active ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#3a3a3a]">
              <label className="text-sm font-medium text-[#9E9E9E]">
                Disqualification Rules (Optional)
              </label>
              <p className="text-xs text-[#666]">
                If the caller gives a specific answer, the agent will take a message.
              </p>


              {formData.disqualification_rules.length > 0 && (
                <div className="space-y-2 bg-[#0d0d0d] p-3 rounded-lg border border-[#3a3a3a]">
                  {formData.disqualification_rules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-2 text-xs bg-[#1e1e1e] p-3 rounded border border-[#3a3a3a]"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[#9E9E9E] mb-1">
                          If: <span className="text-red-400 font-semibold">"{rule.disqualifying_value}"</span>
                        </p>
                        <p className="text-[#666] break-words">
                          {rule.message_to_caller}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveRule(idx)}
                        className="text-red-400 hover:text-red-300 flex-shrink-0"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}


              <div className="space-y-2 bg-[#0d0d0d] p-3 rounded-lg border border-[#3a3a3a]">
                <div>
                  <label className="text-xs text-[#9E9E9E] block mb-1">
                    Disqualifying Answer
                  </label>
                  <input
                    type="text"
                    value={newRule.disqualifying_value}
                    onChange={(e) =>
                      setNewRule({
                        ...newRule,
                        disqualifying_value: e.target.value,
                      })
                    }
                    placeholder="e.g., yes"
                    className="w-full px-2 py-1 rounded text-xs bg-[#1e1e1e] border border-[#3a3a3a] text-white placeholder-[#666] focus:outline-none focus:border-[#0E7DFA]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9E9E9E] block mb-1">
                    Message to Caller
                  </label>
                  <textarea
                    value={newRule.message_to_caller}
                    onChange={(e) =>
                      setNewRule({
                        ...newRule,
                        message_to_caller: e.target.value,
                      })
                    }
                    placeholder="e.g., Please consult a doctor first"
                    rows={2}
                    className="w-full px-2 py-1 rounded text-xs bg-[#1e1e1e] border border-[#3a3a3a] text-white placeholder-[#666] focus:outline-none focus:border-[#0E7DFA] resize-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddRule}
                  className="w-full px-3 py-2 text-xs rounded bg-[#0E7DFA] hover:bg-blue-600 text-white transition font-medium"
                >
                  Add Rule
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#3a3a3a]">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-[#0d0d0d] border border-[#3a3a3a] text-white text-sm font-medium hover:bg-[#1e1e1e] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="flex-1 px-4 py-2 rounded-lg bg-[#0E7DFA] hover:bg-blue-600 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCreating || isUpdating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : editingQuestion ? (
                  "Update Question"
                ) : (
                  "Add Question"
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <IntakeQuestionModal isOpen={isModalOpen} onClose={handleModalClose}/>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent className="bg-[#1a1a1a] border border-[#3a3a3a] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Question</AlertDialogTitle>
            <AlertDialogDescription className="text-[#9E9E9E]">
              Are you sure you want to delete this intake question? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel className="bg-[#0d0d0d] border-[#3a3a3a] text-white hover:bg-[#1e1e1e] hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(deleteConfirmId!)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isDeleting ? (
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
    </>
  );
};

export default IntakeQuestion;