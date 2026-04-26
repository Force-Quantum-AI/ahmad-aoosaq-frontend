import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import {
  useAddServicesMutation,
  useUpdateServicesMutation,
} from "@/store/features/business/business.api";

interface EditServiceModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  business_id: string | number;
  editingService?: any;
}

export default function EditServiceModal({
  isOpen,
  setIsOpen,
  business_id,
  editingService,
}: EditServiceModalProps) {
  const [addService, { isLoading: isAdding }] = useAddServicesMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServicesMutation();
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "",
    allow_booking: false,
  });

  useEffect(() => {
    if (editingService) {
      setForm({
        name: editingService.name || "",
        description: editingService.description || "",
        price: editingService.price || "",
        duration: editingService.duration || "",
        category: editingService.category_name || "",
        allow_booking: editingService.allow_booking || false,
      });
    } else {
      setForm({
        name: "",
        description: "",
        price: "",
        duration: "",
        category: "",
        allow_booking: false,
      });
    }
    setFormError("");
  }, [editingService, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setFormError("");
    if (!form.name.trim()) {
      setFormError("Service Name is required");
      return;
    }

    const payload = {
      ...form,
      price: form.price ? Number(form.price) : null,
      duration: form.duration ? Number(form.duration) : null,
    };

    try {
      if (editingService) {
        await updateService({
          business_id,
          data: { id: editingService.id, ...payload },
        }).unwrap();
      } else {
        await addService({
          business_id,
          data: payload,
        }).unwrap();
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to save service:", error);
      setFormError("Failed to save service. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1a1a1a] shadow-2xl border border-[#3a3a3a] rounded-3xl w-full max-w-xl overflow-hidden text-white">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <h2 className="text-xl font-semibold tracking-tight">
              {editingService ? "Edit Service" : "Add Service"}
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center cursor-pointer justify-center rounded-full bg-[#1e1e1e] hover:bg-[#2a2a2a] transition-colors text-gray-400 hover:text-white"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-4 space-y-5">
            {formError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-400">{formError}</p>
              </div>
            )}

            {/* Service Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#9E9E9E] flex items-center gap-1.5">
                Service Name
                <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Commercial Design"
                className="w-full bg-[#0d0d0d] border border-[#3a3a3a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#666] outline-none focus:border-[#0E7DFA] transition"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#9E9E9E] flex items-center gap-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the service..."
                rows={3}
                className="w-full bg-[#0d0d0d] border border-[#3a3a3a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#666] outline-none focus:border-[#0E7DFA] transition resize-none"
              />
            </div>

            {/* Price + Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#9E9E9E] flex items-center gap-1.5">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full bg-[#0d0d0d] border border-[#3a3a3a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#666] outline-none focus:border-[#0E7DFA] transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#9E9E9E] flex items-center gap-1.5">
                  Duration (min)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="30"
                  className="w-full bg-[#0d0d0d] border border-[#3a3a3a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#666] outline-none focus:border-[#0E7DFA] transition"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5 min-w-0">
              <label className="text-sm font-medium text-[#9E9E9E] flex items-center gap-1.5">
                Category
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-[#0d0d0d] border border-[#3a3a3a] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#0E7DFA] transition appearance-none cursor-pointer"
                >
                  <option value="" disabled className="text-[#666]">Select a category</option>
                  {[
                    "design",
                    "repairs",
                    "upgrades",
                    "installations",
                    "serving",
                    "maintenance",
                    "consultation",
                    "other"
                  ].map((c) => (
                    <option key={c} value={c} className="bg-[#1a1a1a]">
                      {c.charAt(0) + c.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer group mt-2">
              <div
                onClick={() => setForm(f => ({ ...f, allow_booking: !f.allow_booking }))}
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  form.allow_booking
                    ? "bg-[#0E7DFA] border-[#0E7DFA]"
                    : "bg-[#0d0d0d] border-[#3a3a3a] group-hover:border-[#555]"
                }`}
              >
                {form.allow_booking && (
                  <svg
                    width="11"
                    height="9"
                    viewBox="0 0 11 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 4L4 7L10 1"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm text-[#9E9E9E] select-none">
                Allow customers to book this service
              </span>
            </label>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 pt-2 flex gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 rounded-2xl border border-[#3a3a3a] bg-[#0d0d0d] cursor-pointer text-white font-medium text-sm hover:bg-[#1e1e1e] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isAdding || isUpdating}
              className="flex-1 py-3 rounded-2xl cursor-pointer bg-[#0E7DFA] text-white font-medium text-sm hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAdding || isUpdating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
