import { SquarePen, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  useGetUserBusinessQuery, 
  useUpdateBusinessHoursMutation,
  useCreateBusinessHoursMutation,
  useDeleteBusinessHoursMutation
} from "@/store/features/business/business.api";

interface BusinessHour {
  id?: number;
  business: number;
  day: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

interface EditingHour extends BusinessHour {
  open_time_formatted: string;
  close_time_formatted: string;
}

export default function BusinessHoursSection({
  business_id,
}: {
  business_id?: number | string;
}) {
  const { data: businesses } = useGetUserBusinessQuery({});
  const [updateHours, { isLoading: isUpdating }] = useUpdateBusinessHoursMutation();
  const [createHours, { isLoading: isCreating }] = useCreateBusinessHoursMutation();
  const [deleteHours, { isLoading: isDeleting }] = useDeleteBusinessHoursMutation();

  const business = businesses
    ? businesses.find((b: any) => b.id === business_id)
    : null;
  const hours = business?.hours || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHour, setEditingHour] = useState<EditingHour | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayAbbreviations = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Convert 24-hour format to 12-hour format for display
  const formatTimeTo12Hour = (time: string): string => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").slice(0, 2);
    const hour = parseInt(hours);
    const meridiem = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${String(displayHour).padStart(2, "0")}:${minutes} ${meridiem}`;
  };

  // Handle edit modal open
  const handleOpenEditModal = (hour: BusinessHour) => {
    setEditingHour({
      ...hour,
      open_time_formatted: hour.open_time ? hour.open_time.substring(0, 5) : "09:00",
      close_time_formatted: hour.close_time ? hour.close_time.substring(0, 5) : "17:00",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle create modal open
  const handleOpenCreateModal = () => {
    setEditingHour({
      business: Number(business_id),
      day: 0,
      open_time: "09:00:00",
      close_time: "17:00:00",
      open_time_formatted: "09:00",
      close_time_formatted: "17:00",
      is_closed: false,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHour(null);
    setFormErrors({});
  };

  // Handle delete
  const handleDelete = async () => {
    if (!editingHour?.id) return;
    try {
      await deleteHours({
        business_id,
        data: { id: editingHour.id }
      }).unwrap();
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting hours:", error);
      setFormErrors({ submit: "Failed to delete hours." });
    }
  };

  // Handle save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingHour) return;

    if (!editingHour.is_closed) {
      if (!editingHour.open_time_formatted) {
        setFormErrors({ open_time: "Required" });
        return;
      }
      if (!editingHour.close_time_formatted) {
        setFormErrors({ close_time: "Required" });
        return;
      }
    }

    try {
      const payload = {
        id: editingHour.id,
        business: business_id,
        day: editingHour.day,
        open_time: editingHour.is_closed
          ? "00:00:00"
          : `${editingHour.open_time_formatted}:00`,
        close_time: editingHour.is_closed
          ? "00:00:00"
          : `${editingHour.close_time_formatted}:00`,
        is_closed: editingHour.is_closed,
      };

      if (editingHour.id) {
        await updateHours({
          business_id,
          data: payload,
        }).unwrap();
      } else {
        await createHours({
          business_id,
          data: payload,
        }).unwrap();
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving hours:", error);
      setFormErrors({ submit: "Failed to save hours. Please try again." });
    }
  };

  const isSaving = isUpdating || isCreating;

  return (
    <>
      <div>
        <div
          className="rounded-3xl p-6"
          style={{
            background: `radial-gradient(ellipse 70% 60% at top right, rgba(80, 80, 80, 0.45) 0%, #000000 70%)`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Business Hours
              </h2>
              <p className="text-sm text-[#9E9E9E] mt-1">
                When your business is open
              </p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              disabled={isSaving}
              className="flex items-center gap-1.5 cursor-pointer bg-[#0E7DFA] hover:bg-blue-600 text-white text-xs font-medium px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={14} />
              Add Hours
            </button>
          </div>

          <div className="space-y-6">
            <div
              className="p-5 rounded-2xl"
              style={{
                background: `radial-gradient(ellipse 70% 60% at top right, rgba(80, 80, 80, 0.45) 0%, #000000 70%)`,
              }}
            >
              <label className="block text-sm font-medium text-white mb-2">
                Operating Hours
              </label>

              {hours.length === 0 ? (
                <div className="bg-[#1E1E1E] rounded-2xl px-6 py-6 min-h-[40px] flex items-center justify-center">
                  <p className="text-sm text-[#9E9E9E]">
                    No business hours configured
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {hours.map((h: BusinessHour) => {
                    const timeString = h.is_closed
                      ? "Closed"
                      : `${formatTimeTo12Hour(h.open_time)} - ${formatTimeTo12Hour(h.close_time)}`;
                    return (
                      <div
                        key={h.id}
                        className="bg-[#1E1E1E] rounded-xl px-5 py-4 flex items-center justify-between border border-transparent hover:border-[#3a3a3a] transition-all group cursor-pointer"
                        onClick={() => handleOpenEditModal(h)}
                      >
                        <p className="text-sm text-[#bbb]">
                          <span className="font-semibold text-white w-16 inline-block">
                            {dayAbbreviations[h.day]}:
                          </span>
                          {timeString}
                        </p>
                        <SquarePen
                          size={14}
                          className="text-[#676767] group-hover:text-white transition-colors"
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="text-xs text-gray-500 mt-3">
                Click any day to edit hours. Our AI will understand your business
                schedule.
              </p>

            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md bg-[#1a1a1a] border border-[#3a3a3a] text-white">
          <DialogHeader>
            <DialogTitle>
              {editingHour?.id ? `Edit Hours - ${dayMap[editingHour.day]}` : "Add Hours"}
            </DialogTitle>
            <DialogDescription className="text-[#9E9E9E]">
              {editingHour?.id ? "Update the operating hours for this day" : "Set operating hours for a new day"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Error Message */}
            {formErrors.submit && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-400">{formErrors.submit}</p>
              </div>
            )}

            {/* Day Selector (Only for creation) */}
            {editingHour && !editingHour.id && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#9E9E9E]">Day</label>
                <select
                  value={editingHour.day}
                  onChange={(e) => setEditingHour({...editingHour, day: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-[#3a3a3a] text-white focus:outline-none focus:border-[#0E7DFA] cursor-pointer"
                >
                  {dayMap.map((d, i) => (
                    <option key={i} value={i}>{d}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Is Closed Toggle */}
            <div className="flex items-center justify-between bg-[#0d0d0d] p-3 rounded-lg border border-[#3a3a3a]">
              <label className="text-sm font-medium text-[#9E9E9E]">
                Closed {editingHour ? (editingHour.id ? `on ${dayMap[editingHour.day]}` : "") : ""}
              </label>
              <button
                type="button"
                onClick={() => {
                  if (editingHour) {
                    setEditingHour({
                      ...editingHour,
                      is_closed: !editingHour.is_closed,
                    });
                    setFormErrors({});
                  }
                }}
                className={`relative w-11 h-6 rounded-full transition ${
                  editingHour?.is_closed ? "bg-red-500" : "bg-[#0E7DFA]"
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition transform ${
                    editingHour?.is_closed ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>

            {/* Open Time */}
            {editingHour && !editingHour.is_closed && (
              <div className="space-y-2">
                <label htmlFor="open_time" className="text-sm font-medium text-[#9E9E9E]">
                  Open Time *
                </label>
                <input
                  id="open_time"
                  type="time"
                  value={editingHour.open_time_formatted}
                  onChange={(e) => {
                    setEditingHour({
                      ...editingHour,
                      open_time_formatted: e.target.value,
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-[#3a3a3a] text-white focus:outline-none focus:border-[#0E7DFA] focus:ring-1 focus:ring-[#0E7DFA] transition-colors [color-scheme:dark]"
                />
                {formErrors.open_time && (
                  <p className="text-xs text-red-400">{formErrors.open_time}</p>
                )}
              </div>
            )}

            {/* Close Time */}
            {editingHour && !editingHour.is_closed && (
              <div className="space-y-2">
                <label htmlFor="close_time" className="text-sm font-medium text-[#9E9E9E]">
                  Close Time *
                </label>
                <input
                  id="close_time"
                  type="time"
                  value={editingHour.close_time_formatted}
                  onChange={(e) => {
                    setEditingHour({
                      ...editingHour,
                      close_time_formatted: e.target.value,
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-[#3a3a3a] text-white focus:outline-none focus:border-[#0E7DFA] focus:ring-1 focus:ring-[#0E7DFA] transition-colors [color-scheme:dark]"
                />
                {formErrors.close_time && (
                  <p className="text-xs text-red-400">{formErrors.close_time}</p>
                )}
              </div>
            )}

            {/* Closed Message */}
            {editingHour && editingHour.is_closed && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">
                  This business is closed {editingHour.id ? `on ${dayMap[editingHour.day]}` : "on this day"}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-[#3a3a3a]">
              {editingHour?.id ? (
                <button
                  type="button"
                  disabled={isDeleting || isSaving}
                  onClick={handleDelete}
                  className="px-3 py-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors flex items-center justify-center disabled:opacity-50"
                  title="Delete hours"
                >
                  {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 rounded-lg bg-[#0d0d0d] border border-[#3a3a3a] text-white text-sm font-medium hover:bg-[#1e1e1e] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-4 py-2 rounded-lg bg-[#0E7DFA] hover:bg-blue-600 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
