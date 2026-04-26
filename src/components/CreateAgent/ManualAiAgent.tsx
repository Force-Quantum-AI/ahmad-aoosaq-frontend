import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import ManualStepOne from "./ManualStepOne";
import ManualStepTwo from "./ManualStepTwo";
import { FiMic } from "react-icons/fi";
import { Play } from "lucide-react";
import ManualStepThree from "./ManualStepThree";
import { toast } from "react-toastify";
import { useLandingConfig } from "@/contexts/LandingConfigContext";
import { useDispatch, useSelector } from "react-redux";
import { setBusinessId, setBusinessNameAndDescription } from "@/store/features/business/business.slice";
import { useCreateBusinessHoursMutation, useCreateBusinessMutation, useCreateBusinessServicesMutation } from "@/store/features/business/business.api";

interface ManualAiAgentProps {
    onBack: () => void;
    onVoiceClick: () => void;
    onComplete: (data: FormData) => void;
}

const TOTAL_STEPS = 3;

interface FormData {
    businessName: string;
    businessType: string;
    description: string;
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
    bookingSystem: string;
    otherBooking: string;
}

const ManualAiAgent = ({ onBack, onVoiceClick, onComplete }: ManualAiAgentProps) => {
    const dispatch = useDispatch();
    const businessData = useSelector((state: any) => state.business);

    const [createBusiness, { isLoading: createBusinessLoading1 }] = useCreateBusinessMutation();
    const [createBusinessServices, { isLoading: createBusinessServicesLoading }] = useCreateBusinessServicesMutation();
    const [createBusinessHours] = useCreateBusinessHoursMutation();

    const [currentStep, setCurrentStep] = useState(1);
    const {config} = useLandingConfig();
    const [formData, setFormData] = useState<FormData>({
        businessName: "",
        businessType: "salon & spa",
        description: "",
        services: "",
        category: "Serving",
        hours: {
            fromDay: "0",
            toDay: "4",
            openTime: "8:00",
            openAmPm: "AM",
            closeTime: "5:00",
            closeAmPm: "PM",
        },
        bookingSystem: "Mindbody",
        otherBooking: "",
    });

    const updateFormData = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const progressValue = (currentStep / TOTAL_STEPS) * 100;

    const handleNext = async () => {
        if (currentStep === 1) {
            if (!formData.businessName || !formData.businessType || !formData.description) {
                toast.error("Please fill all the fields");
                return;
            }
            dispatch(setBusinessNameAndDescription({business_name: formData.businessName, business_description: formData.description}));

            // api call for these 4 data to create buiseness only , then i will insert policies, services etc in this business 
            const data = {
                name: formData.businessName,
                business_type: formData.businessType,
                description: formData.description,
                business_email: businessData.business_email,
                business_website: businessData.business_website,    
            };
            
            try {
                const response = await createBusiness(data).unwrap();
                const id = response?.id;

                dispatch(setBusinessId(id));

                // Note: The 'businessData' from useSelector holds the state from the current render cycle.
                // It won't show the newly dispatched 'id' immediately here (it will show 'null').
                // The new state will be available in the next render cycle across all components.
                console.log("Created business. Dispatching ID to store:", id);
            } catch (error) {
                console.error("Failed to create business:", error);
                toast.error("Failed to create business. Please try again.");
                return;
            }
        }
        if (currentStep === 2) {
            const { fromDay, toDay, openTime, closeTime, openAmPm, closeAmPm } = formData.hours;
            if (!formData.services || !formData.category || !openTime || !closeTime) {
                toast.error("Please fill all the fields");
                return;
            }
            const serviceData = {
                name: formData.services,
                category: formData.category,
            };
            try {
                const response = await createBusinessServices({business_id: businessData.id, data: serviceData}).unwrap();
                console.log("Created business services. Dispatching ID to store:", response);
                
                let start = parseInt(fromDay);
                let end = parseInt(toDay);
                
                const daysToCreate = [];
                if (start <= end) {
                    for (let i = start; i <= end; i++) daysToCreate.push(i);
                } else {
                    for (let i = start; i <= 6; i++) daysToCreate.push(i);
                    for (let i = 0; i <= end; i++) daysToCreate.push(i);
                }

                const formatTimeTo24Hour = (timeStr: string, ampm: string) => {
                    let [hours, minutes] = timeStr.split(':');
                    if (!minutes) minutes = "00"; // fallback
                    let hrsInt = parseInt(hours, 10);
                    if (isNaN(hrsInt)) hrsInt = 0;
                    
                    if (ampm === "PM" && hrsInt < 12) {
                        hrsInt += 12;
                    } else if (ampm === "AM" && hrsInt === 12) {
                        hrsInt = 0;
                    }
                    
                    const hoursFormatted = hrsInt.toString().padStart(2, '0');
                    const minutesFormatted = minutes.padStart(2, '0');
                    return `${hoursFormatted}:${minutesFormatted}:00`;
                };

                await Promise.all(daysToCreate.map(day => {
                    const hourData = {
                        business: businessData.id,
                        day: day.toString(),
                        open_time: formatTimeTo24Hour(openTime, openAmPm),
                        close_time: formatTimeTo24Hour(closeTime, closeAmPm),
                        is_closed: false
                    };
                    return createBusinessHours({business_id: businessData.id, data: hourData}).unwrap();
                }));
                console.log("Created business hours.");
            } catch (error) {
                console.error("Failed to create business services or hours:", error);
                toast.error("Failed to save services or hours. Please try again.");
                return;
            }
        }
        if (currentStep === 3) {
            if (!formData.bookingSystem || !formData.otherBooking) {
                toast.error("Please fill all the fields");
                return;
            }
        }
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep(currentStep + 1);
        } else {
            console.log("Final Agent Data:", formData);
            onComplete(formData);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            onBack();
        }
    };

    return (
        <div className="relative w-full flex items-center overflow-hidden">

            {/* ── Decorative blobs ── */}
            {/* <div
                className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-60"
                style={{ background: "#D7B2FF66", filter: "blur(137px)" }}
            />
            <div
                className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-60"
                style={{ background: "#D7B2FF66", filter: "blur(137px)" }}
            />
            <div
                className="pointer-events-none absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-60"
                style={{ background: "#E6FBFF", filter: "blur(137px)" }}
            /> */}

            {/* ── Main content ── */}
            <div className="relative z-10 flex w-full items-center justify-center font-sans mx-auto">

                {/* Left – illustration */}
                {/* <div className="w-1/2 hidden md:flex items-center justify-center p-8">
                    <img
                        src={aiAgentImg}
                        alt="AI Agent Illustration"
                        className="w-full h-auto"
                    />
                </div> */}

                {/* Right – form card */}
                <div className="w-full md:w-1/2 flex items-center justify-center py-10 px-4">
                    <div className="w-full max-w-[750px] bg-[#121214] border-11 border-white/5 rounded-[20px] p-8 lg:p-12 shadow-2xl transition-all duration-500 animate-in fade-in zoom-in-95 flex flex-col gap-8 h-fit">

                        {/* Header */}
                        <div>
                            <h1 className="text-2xl md:text-[32px] font-medium text-white font-geist">Create Your AI Agent</h1>
                            <div className="mt-6">
                                <div className="flex justify-end items-center mb-2">
                                    <span className=" text-xs font-medium" style={{color: config.colors.brandColorHex}}>Step {currentStep}/{TOTAL_STEPS}</span>
                                </div>
                                <Progress
                                    value={progressValue}
                                    className="h-[6px] bg-white/10 overflow-hidden"
                                    indicatorClassName={config.colors.brandColor}
                                />
                            </div>
                        </div>

                        {/* Step content */}
                        <div className="min-h-[320px]">
                            {currentStep === 1 && (
                                <ManualStepOne
                                    data={{
                                        businessName: formData.businessName,
                                        businessType: formData.businessType,
                                        description: formData.description
                                    }}
                                    onChange={updateFormData}
                                />
                            )}
                            {currentStep === 2 && (
                                <ManualStepTwo
                                    data={{
                                        services: formData.services,
                                        category: formData.category,
                                        hours: formData.hours
                                    }}
                                    onChange={updateFormData}
                                />
                            )}
                            {currentStep === 3 && (
                                <ManualStepThree
                                    data={{
                                        bookingSystem: formData.bookingSystem,
                                        otherBooking: formData.otherBooking
                                    }}
                                    onChange={updateFormData}
                                />
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col items-center gap-7 pt-4">
                            <div className="w-full flex items-center justify-between">
                                <button
                                    onClick={handleBack}
                                    className="text-gray-400 text-sm font-medium hover:text-[#5D5FEF] transition-all flex items-center gap-1 cursor-pointer"
                                >
                                    &lt; Back
                                </button>
                                <button
                                    onClick={handleNext}
                                    className=" text-white px-4 md:px-10 py-3 md:py-3.5 rounded-full font-poppins font-medium transition-all shadow-lg flex items-center gap-3 text-sm md:text-base group active:scale-95 cursor-pointer hover:opacity-90"
                                    style={{ background: config.colors.buttonGradientBorder}}
                                >
                                    {createBusinessLoading1 || createBusinessServicesLoading ? "Creating..." : "Continue Conversation"} <Play size={18} className="fill-white group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            <button
                                onClick={onVoiceClick}
                                className=" text-sm font-medium hover:underline flex items-center gap-2 cursor-pointer"
                                style={{ color: config?.colors.brandColorHex }}
                            >
                                <FiMic size={16} />
                                Prefer to set up by voice?
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default ManualAiAgent;
