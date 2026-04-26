import { useLandingConfig } from "@/contexts/LandingConfigContext";
import { FiMic } from "react-icons/fi";

const DAYS = [
    { value: 0, label: "Monday" },
    { value: 1, label: "Tuesday" },
    { value: 2, label: "Wednesday" },
    { value: 3, label: "Thursday" },
    { value: 4, label: "Friday" },
    { value: 5, label: "Saturday" },
    { value: 6, label: "Sunday" },
];

interface ManualStepTwoProps {
    data: {
        services: string;
        category: string;
        hours: {
            fromDay: string;
            toDay: string;
            openTime: string;
            openAmPm: string;
            closeTime: string;
            closeAmPm: string;
        };
    };
    onChange: (field: string, value: any) => void;
}

const ManualStepTwo = ({ data, onChange }: ManualStepTwoProps) => {
    const {config} = useLandingConfig();

    const handleHoursChange = (field: keyof typeof data.hours, value: string) => {
        onChange("hours", { ...data.hours, [field]: value });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Services You Offer Field */}
            <div className="relative">
                <div className="absolute left-4 -top-2.5 px-1.5 bg-[#121214] z-10">
                    <label className="text-[14px] lg:text-xs font-normal text-white/80 leading-normal">Services You Offer</label>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        value={data.services}
                        onChange={(e) => onChange("services", e.target.value)}
                        placeholder="e.g. Haircuts"
                        className="w-full p-3.5 border border-white/10 rounded-[10px] bg-transparent focus:border-[#5B63F1] focus:outline-none transition-all placeholder:text-gray-500 text-white font-poppins pr-10"
                    />
                    <FiMic size={18} className="absolute right-4 top-1/2 -translate-y-1/2  cursor-pointer" style={{color : config.colors.brandColorHex}}/>
                </div>
                <p className="text-[#9E9E9E] text-[10px] mt-2 ml-2 leading-relaxed">
                    *List 1-2 main services your business provides.
                </p>
            </div>

            {/* category select  */}
            <div className="relative pt-4">
                <div className="absolute left-4 top-1.5 px-1.5 bg-[#121214] z-10">
                    <label className="text-[14px] lg:text-xs font-normal text-white/80 leading-normal">Category</label>
                </div>
                <div className="relative">
                    <select
                        value={data.category}
                        onChange={(e) => onChange("category", e.target.value)}
                        className="w-full p-3.5 border border-white/10 rounded-[10px] bg-transparent focus:border-[#5B63F1] focus:outline-none transition-all placeholder:text-gray-500 text-white font-poppins pr-10"
                    >
                        <option value="Serving">Serving</option>
                        <option value="Takeaway">Takeaway</option>
                        <option value="Delivery">Delivery</option>
                    </select>
                </div>
                <p className="text-[#9E9E9E] text-[10px] mt-2 ml-2 leading-relaxed">
                    *Select the category of your business.
                </p>
            </div>

            {/* Business Hours Field */}
            <div className="relative pt-4">
                <div className="absolute left-4 -top-1.5 px-1.5 bg-[#121214] z-10">
                    <label className="text-[14px] lg:text-xs font-normal text-white/80 leading-normal">Business Hours Range</label>
                </div>
                
                <div className="border border-white/10 rounded-[10px] p-4 flex flex-col gap-6">
                    {/* Days Range */}
                    <div className="flex gap-4 items-center w-full">
                        <div className="flex-1">
                            <label className="text-xs text-white/60 mb-2 block">From Day</label>
                            <select
                                value={data.hours.fromDay}
                                onChange={(e) => handleHoursChange("fromDay", e.target.value)}
                                className="w-full p-3 bg-transparent border border-white/10 rounded-lg focus:border-[#5B63F1] focus:outline-none text-white text-sm"
                            >
                                {DAYS.map(day => <option key={day.value} value={day.value} className="bg-[#121214] text-white">{day.label}</option>)}
                            </select>
                        </div>
                        <span className="text-white/50 mt-6 font-medium">to</span>
                        <div className="flex-1">
                           <label className="text-xs text-white/60 mb-2 block">To Day</label>
                           <select
                                value={data.hours.toDay}
                                onChange={(e) => handleHoursChange("toDay", e.target.value)}
                                className="w-full p-3 bg-transparent border border-white/10 rounded-lg focus:border-[#5B63F1] focus:outline-none text-white text-sm"
                            >
                                {DAYS.map(day => <option key={day.value} value={day.value} className="bg-[#121214] text-white">{day.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Time Range */}
                    <div className="flex gap-4 items-center w-full">
                        <div className="flex-1 flex gap-2">
                            <div className="flex-1">
                                <label className="text-xs text-white/60 mb-2 block">Open Time</label>
                                <input
                                    type="text"
                                    placeholder="HH:MM"
                                    value={data.hours.openTime}
                                    onChange={(e) => handleHoursChange("openTime", e.target.value)}
                                    className="w-full p-3 bg-transparent border border-white/10 rounded-lg focus:border-[#5B63F1] focus:outline-none text-white text-sm placeholder:text-white/30"
                                />
                            </div>
                            <div className="w-20">
                                <label className="text-xs text-white/60 mb-2 block">&nbsp;</label>
                                <select
                                    value={data.hours.openAmPm}
                                    onChange={(e) => handleHoursChange("openAmPm", e.target.value)}
                                    className="w-full p-3 bg-transparent border border-white/10 rounded-lg focus:border-[#5B63F1] focus:outline-none text-white text-sm text-center"
                                >
                                    <option value="AM" className="bg-[#121214] text-white">AM</option>
                                    <option value="PM" className="bg-[#121214] text-white">PM</option>
                                </select>
                            </div>
                        </div>
                        
                        <span className="text-white/50 mt-6 font-medium">to</span>

                        <div className="flex-1 flex gap-2">
                            <div className="flex-1">
                                <label className="text-xs text-white/60 mb-2 block">Close Time</label>
                                <input
                                    type="text"
                                    placeholder="HH:MM"
                                    value={data.hours.closeTime}
                                    onChange={(e) => handleHoursChange("closeTime", e.target.value)}
                                    className="w-full p-3 bg-transparent border border-white/10 rounded-lg focus:border-[#5B63F1] focus:outline-none text-white text-sm placeholder:text-white/30"
                                />
                            </div>
                            <div className="w-20">
                                <label className="text-xs text-white/60 mb-2 block">&nbsp;</label>
                                <select
                                    value={data.hours.closeAmPm}
                                    onChange={(e) => handleHoursChange("closeAmPm", e.target.value)}
                                    className="w-full p-3 bg-transparent border border-white/10 rounded-lg focus:border-[#5B63F1] focus:outline-none text-white text-sm text-center"
                                >
                                    <option value="AM" className="bg-[#121214] text-white">AM</option>
                                    <option value="PM" className="bg-[#121214] text-white">PM</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-[#9E9E9E] text-[10px] mt-2 ml-2 leading-relaxed">
                    *Select your business operating days and hours.
                </p>
            </div>
        </div>
    );
};

export default ManualStepTwo;
