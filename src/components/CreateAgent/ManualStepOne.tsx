import { useLandingConfig } from "@/contexts/LandingConfigContext";
// import { FiMic, FiCheck } from "react-icons/fi";
import { FiMic } from "react-icons/fi";

// const businessTypes = [
//     "Salon & Spa",
//     "Medical Practice",
//     "Real Estate",
//     "Law Firm",
// ];

interface ManualStepOneProps {
    data: {
        businessName: string;
        businessType: string;
        description: string;
    };
    onChange: (field: string, value: string) => void;
}

const ManualStepOne = ({ data, onChange }: ManualStepOneProps) => {
    const { config } = useLandingConfig();
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Business Name Field */}
            <div className="relative">
                <div className="absolute left-4 -top-2.5 px-1.5 bg-[#121214] z-10">
                    <label className="text-[14px] lg:text-xs font-normal text-white/80 leading-normal">Business Name</label>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        value={data.businessName}
                        required
                        onChange={(e) => onChange("businessName", e.target.value)}
                        placeholder="e.g. Acme Corp"
                        className="w-full p-3.5 border border-white/10 rounded-[10px] bg-transparent focus:border-[#5B63F1] focus:outline-none transition-all placeholder:text-gray-500 text-white font-poppins pr-10"
                    />
                    <FiMic size={18} className="absolute right-4 top-1/2 -translate-y-1/2  cursor-pointer" style={{ color: config?.colors.brandColorHex }} />
                </div>
            </div>

            {/* Business Type Section */}
            {/* <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">Business Type</label>
                <div className="grid grid-cols-2 gap-3">
                    {businessTypes.map((type) => {
                        const isActive = data.businessType === type;

                        return (
                            <button
                                key={type}
                                type="button"
                                onClick={() => onChange("businessType", type)}
                                className={`p-3 rounded-[10px] border text-sm font-medium transition-all flex items-center justify-between cursor-pointer
        ${isActive
                                        ? "border-[var(--brand-color)] text-[var(--brand-color)]"
                                        : "border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                                    }`}
                                style={
                                    isActive
                                        ? { "--brand-color": config.colors.brandColorHex } as React.CSSProperties
                                        : undefined
                                }
                            >
                                {type}
                                {isActive && <FiCheck style={{ color: config.colors.brandColorHex }} />}
                            </button>
                        );
                    })}
                </div>
            </div> */}

            {/* Brief Description Field */}
            <div className="relative">
                <div className="absolute left-4 -top-2.5 px-1.5 bg-[#121214] z-10">
                    <label className="text-[14px] lg:text-xs font-normal text-white/80 leading-normal">Brief Description</label>
                </div>
                <div className="relative">
                    <textarea
                        value={data.description}
                        onChange={(e) => onChange("description", e.target.value)}
                        placeholder="Describe your business services and what you do..."
                        className="w-full p-3.5 pt-4 border border-white/10 rounded-[10px] bg-transparent focus:border-[#5B63F1] focus:outline-none transition-all placeholder:text-gray-500 text-white font-poppins min-h-[120px] resize-none pr-10"
                    />
                    <FiMic size={18} className="absolute right-4 top-5 cursor-pointer" style={{ color: config.colors.brandColorHex }} />
                </div>
            </div>
        </div>
    );
};

export default ManualStepOne;
