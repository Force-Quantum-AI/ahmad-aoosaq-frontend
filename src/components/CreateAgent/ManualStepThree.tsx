import { useLandingConfig } from "@/contexts/LandingConfigContext";
import { FiCheck } from "react-icons/fi";

const bookingSystems = [
    "Mindbody",
    "Calendly",
    "Google Calendar",
];

interface ManualStepThreeProps {
    data: {
        bookingSystem: string;
        otherBooking: string;
    };
    onChange: (field: string, value: string) => void;
}

const ManualStepThree = ({ data, onChange }: ManualStepThreeProps) => {
    const {config} = useLandingConfig();
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Booking System Question */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">What booking system do you use?</label>
                <p className="text-[#9E9E9E] text-xs">This helps your agent assist callers with appointments.</p>

                <div className="flex flex-wrap gap-3 pt-2">
                    {bookingSystems.map((system) => {
  const isActive = data.bookingSystem === system;

  return (
    <button
      key={system}
      type="button"
      onClick={() => onChange("bookingSystem", system)}
      className={`px-5 py-2.5 rounded-[10px] border text-sm font-medium transition-all flex items-center gap-2 cursor-pointer
        ${
          isActive
            ? "border-[var(--brand-color)] text-[var(--brand-color)] bg-[color:var(--brand-color)]/5"
            : "border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
        }`}
      style={
        isActive
          ? { "--brand-color": config.colors.brandColorHex } as React.CSSProperties
          : undefined
      }
    >
      {system}
      {isActive && (
        <FiCheck className="text-[var(--brand-color)]" />
      )}
    </button>
  );
})}
                </div>
            </div>

            {/* Other/None Textarea */}
            <div className="relative">
                <div className="absolute left-4 -top-2.5 px-1.5 bg-[#121214] z-10">
                    <label className="text-[14px] lg:text-xs font-normal text-white/80 leading-normal">Other/None</label>
                </div>
                <textarea
                    value={data.otherBooking}
                    onChange={(e) => onChange("otherBooking", e.target.value)}
                    placeholder="YOUR agent will take messages and have someone call back to confirm appointments"
                    className="w-full p-3.5 pt-5 border border-white/10 rounded-[10px] bg-transparent focus:border-[#5B63F1] focus:outline-none transition-all placeholder:text-gray-500 text-white font-poppins min-h-[130px] resize-none text-sm"
                />
            </div>
        </div>
    );
};

export default ManualStepThree;
