

import { useForm } from "react-hook-form";
import { useState } from "react";
import StepOne from "@/components/CreateAgent/StepOne";
import StepTwo from "@/components/CreateAgent/StepTwo";
import StepThree from "@/components/CreateAgent/StepThree";
import ResumeOnboarding from "@/components/CreateAgent/ResumeOnboarding";
import ManualAiAgent from "@/components/CreateAgent/ManualAiAgent";
import AgentReady from "@/components/CreateAgent/AgentReady";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mic, Settings2, ChevronRight } from "lucide-react";

interface CreateAgentInputs {
    email: string;
    website?: string;
}

export const STARS = [
    { top: "5%", left: "10%", size: "w-3 h-3" },
    { top: "12%", left: "30%", size: "w-5 h-5" },
    { top: "8%", right: "15%", size: "w-4 h-4" },
    { top: "20%", left: "5%", size: "w-2 h-2" },
    { top: "25%", right: "10%", size: "w-4 h-4" },
    { top: "35%", left: "18%", size: "w-3 h-3" },
    { top: "40%", right: "25%", size: "w-5 h-5" },
    { top: "50%", left: "8%", size: "w-4 h-4" },
    { top: "55%", right: "8%", size: "w-2 h-2" },
    { top: "65%", left: "25%", size: "w-4 h-4" },
    { top: "70%", right: "20%", size: "w-4 h-4" },
    { bottom: "20%", left: "12%", size: "w-5 h-5" },
    { bottom: "15%", right: "18%", size: "w-6 h-6" },
    { bottom: "8%", left: "35%", size: "w-4 h-4" },
    { bottom: "5%", right: "5%", size: "w-3 h-3" },
];

export const starStyle = {
    clipPath: "polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)"
};

const AgentModeModal = ({
    open,
    setOpen,
    setAgentCreationMode,
    setStep,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    setAgentCreationMode: (mode: boolean) => void;
    setStep: (step: number) => void;
}) => {
    const handleSelect = (mode: boolean) => {
        setAgentCreationMode(mode);
        setStep(2);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-[#121214] border-white/10 sm:max-w-[440px] p-8 rounded-[32px]">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-semibold text-white text-center">
                        Create New Agent
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 text-center text-sm">
                        Select how you would like to configure your AI assistant
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => handleSelect(false)}
                        className="group w-full p-5 flex items-center justify-between bg-[#1C1C1E] hover:bg-[#252529] border border-white/5 rounded-2xl transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Mic size={24} />
                            </div>
                            <div className="text-left">
                                <p className="text-white font-medium text-lg">Voice Clone</p>
                                <p className="text-gray-500 text-xs">Configure via voice commands</p>
                            </div>
                        </div>
                        <ChevronRight className="text-gray-700 group-hover:text-white transition-colors" size={20} />
                    </button>

                    <button
                        onClick={() => handleSelect(true)}
                        className="group w-full p-5 flex items-center justify-between bg-[#1C1C1E] hover:bg-[#252529] border border-white/5 rounded-2xl transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                <Settings2 size={24} />
                            </div>
                            <div className="text-left">
                                <p className="text-white font-medium text-lg">Manual Setup</p>
                                <p className="text-gray-500 text-xs">Step-by-step technical config</p>
                            </div>
                        </div>
                        <ChevronRight className="text-gray-700 group-hover:text-white transition-colors" size={20} />
                    </button>
                </div>

                <p className="mt-6 text-center text-[11px] text-gray-600">
                    You can change these settings later in the agent dashboard.
                </p>
            </DialogContent>
        </Dialog>
    );
};  

const CreateAgent = () => {
    const [step, setStep] = useState(1);
    const [isManualFlow, setIsManualFlow] = useState(true);
    const [agentData, setAgentData] = useState<any>({});
    const [isSelectAgentCreationModalOpen, setIsSelectAgentCreationModalOpen] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<CreateAgentInputs>();

    const onSubmitStepOne = (data: CreateAgentInputs) => {
        setIsSelectAgentCreationModalOpen(true);
        setAgentData((prev: any) => ({ ...prev, ...data }));
    };
    
    return (
        <>
            <div className="min-h-screen w-full relative flex items-center justify-center overflow-x-hidden pt-10 pb-10 md:pt-0 md:pb-0 font-sans bg-black">

                {/* Stars */}
                {STARS.map((star, i) => (
                    <div
                        key={i}
                        className={`absolute ${star.size} bg-white animate-pulse opacity-80`}
                        style={{ ...star, ...starStyle }}
                    />
                ))}

                {step === 1 && (
                    <StepOne
                        register={register}
                        errors={errors}
                        onSubmit={handleSubmit(onSubmitStepOne)}
                    />
                )}

                {step > 1 && (
                    isManualFlow ? (
                        step === 2 ? (
                            <ManualAiAgent
                                onBack={() => setStep(1)}
                                onVoiceClick={() => setIsManualFlow(false)}
                                onComplete={(data) => {
                                    setAgentData((prev: any) => ({ ...prev, ...data }));
                                    setStep(3);
                                }}
                            />
                        ) : (
                            <AgentReady
                                formData={agentData}
                                onTalkToAgent={() => console.log("Talking to agent...")}
                            />
                        )
                    ) : (
                        <>
                            {step === 2 && <StepTwo setStep={setStep} />}

                            {step === 3 && (
                                <StepThree
                                    setStep={setStep}
                                    onDataCollected={(data) => {
                                        // Merge AI-collected data into agentData so AgentReady shows it
                                        setAgentData((prev: any) => ({ ...prev, ...data }));
                                    }}
                                />
                            )}

                            {step === 4 && (
                                <ResumeOnboarding onContinue={() => setStep(2)} />
                            )}

                            {step === 5 && (
                                <AgentReady
                                    formData={agentData}
                                    onTalkToAgent={() => console.log("Talking to agent...")}
                                />
                            )}
                        </>
                    )
                )}

                <style>{`
                    @keyframes wave {
                        0% { transform: translateX(-10%); }
                        50% { transform: translateX(10%); }
                        100% { transform: translateX(-10%); }
                    }
                    .animate-wave { animation: wave 4s ease-in-out infinite; }
                `}</style>
            </div>

            <AgentModeModal
                open={isSelectAgentCreationModalOpen}
                setOpen={setIsSelectAgentCreationModalOpen}
                setAgentCreationMode={setIsManualFlow}
                setStep={setStep}
            />
        </>
    );
};

export default CreateAgent;