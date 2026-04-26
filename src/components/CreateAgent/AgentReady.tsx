import { useState } from "react";
import { Home, SquareChevronRight } from "lucide-react";
import { FiEdit2, FiPlus, FiMic, FiCheck } from "react-icons/fi";
import { Service, ServicesModal } from "./ServicesModal";
import { PoliciesModal, Policy } from "./PoliciesModal";
import { VoicePersonality, VoicePersonalityModal } from "./VoicePersonalityModal";
import TestCallPopup from "../dashboard/TestCallPopup";
import { useNavigate } from "react-router-dom";
import { useLandingConfig } from "@/contexts/LandingConfigContext";



const DEFAULT_VOICE: VoicePersonality = {
    voiceId: "aria",
    voiceName: "Aria",
    tone: "Professional",
    personality: "Professional",
    speed: 1.0,
    language: "English (US)",
};

const DEFAULT_GREETING =
    "Thank you for calling Luxe Home Services, your trusted partner for home repairs and upgrades. How can we assist you today?";

// ── Props ─────────────────────────────────────────────────────────────────────
interface AgentReadyProps {
    formData: {
        businessName: string;
        businessType: string;
        description: string;
        services: string;
        hours: string;
        bookingSystem: string;
        otherBooking: string;
    };
    onTalkToAgent: () => void;
}

const AddServiceButton = ({ setServicesModalOpen }: { setServicesModalOpen: (v: boolean) => void }) => {
    return (
        <div className="relative p-4 z-10 flex flex-col items-center gap-3 bg-[#5D5FEF]/5 rounded-[20px] border border-[#5D5FEF]/20 cursor-pointer hover:bg-[#5D5FEF]/8 transition-all group" onClick={() => setServicesModalOpen(true)}>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shadow-md">
                <FiPlus size={20} className="text-[#5D5FEF]" />
            </div>
            <p className="text-sm font-medium text-white">Add Services</p>
            <p className="text-[#9E9E9E] text-[10px] text-center px-4 max-w-[250px]">Add services your business offers with pricing</p>
            <button className="bg-[#1C1C1E] text-white border border-white/10 text-[12px] font-medium px-8 py-2.5 rounded-full mt-2 hover:bg-[#252529] transition-all shadow-lg active:scale-95">
                Add Services
            </button>
        </div>
    )
}

const AddPolicyButton = ({ setPoliciesModalOpen }: { setPoliciesModalOpen: (v: boolean) => void }) => {
    return (
        <div className="relative p-4 z-10 flex flex-col items-center gap-3 bg-[#5D5FEF]/5 rounded-[20px] border border-[#5D5FEF]/20 cursor-pointer hover:bg-[#5D5FEF]/8 transition-all group">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shadow-md">
                <FiPlus size={20} className="text-[#5D5FEF]" />
            </div>
            <p className="text-sm font-medium text-white">Add Policies</p>
            <p className="text-[#9E9E9E] text-[10px] text-center px-4 max-w-[250px]">Help customers understand your cancellation, payment, and deposit policies</p>
            <button onClick={() => setPoliciesModalOpen(true)} className="bg-[#1C1C1E] text-white border border-white/10 text-[12px] font-medium px-8 py-2.5 rounded-full mt-2 hover:bg-[#252529] transition-all shadow-lg active:scale-95">
                Add Policies
            </button>
        </div>
    )
}
const AddVoiceButton = ({ setVoiceModalOpen }: { setVoiceModalOpen: (v: boolean) => void }) => {
    return (
        <div className="relative p-4 z-10 flex flex-col items-center gap-3 bg-[#5D5FEF]/5 rounded-[20px] border border-[#5D5FEF]/20 cursor-pointer hover:bg-[#5D5FEF]/8 transition-all">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shadow-md">
                <FiPlus size={20} className="text-[#5D5FEF]" />
            </div>
            <p className="text-sm font-medium text-white">Customize Voice</p>
            <p className="text-[#9E9E9E] text-[10px] text-center px-4 max-w-[250px]">Choose from multiple voice options and personalize your agent's personality</p>
            <button onClick={() => setVoiceModalOpen(true)} className="bg-[#1C1C1E] text-white border border-white/10 text-[12px] font-medium px-8 py-2.5 rounded-full mt-2 hover:bg-[#252529] transition-all shadow-lg active:scale-95">
                Add Voice Agent
            </button>
        </div>
    )
}

// ── Component ─────────────────────────────────────────────────────────────────
import { useSelector } from "react-redux";
import { 
    useGetBusinessQuery, 
    useGetServicesQuery, 
    useGetBusinessPoliciesQuery,
} from "@/store/features/business/business.api";
import { useGetAgentQuery, useGetAllAgentQuery } from "@/store/features/agent/agent.api";

const AgentReady = ({ formData, onTalkToAgent }: AgentReadyProps) => {
    const businessDataRedux = useSelector((state: any) => state.business);
    const { data: businessInfo, isLoading } = useGetBusinessQuery({ business_id: businessDataRedux?.id }, {
        skip: !businessDataRedux?.id
    });
    const { data: servicesData } = useGetServicesQuery({ business_id: businessDataRedux?.id }, {
        skip: !businessDataRedux?.id
    });
    const { data: policiesData } = useGetBusinessPoliciesQuery({ business_id: businessDataRedux?.id }, {
        skip: !businessDataRedux?.id
    });

    const {data: agentGreeting} = useGetAgentQuery({})
    const { data: agentData } = useGetAllAgentQuery({});
    const activeAgent = agentData?.find((agent: any) => agent.is_active);
    
    // State
    const [greeting, setGreeting] = useState(DEFAULT_GREETING);
    const [isEditingGreeting, setIsEditingGreeting] = useState(false);
    const [greetingDraft, setGreetingDraft] = useState(greeting);

    const [servicesModalOpen, setServicesModalOpen] = useState(false);

    const [policiesModalOpen, setPoliciesModalOpen] = useState(false);

    const [voiceModalOpen, setVoiceModalOpen] = useState(false);

    const [testCallModalOpen, setTestCallModalOpen] = useState(false);

    const navigate = useNavigate();

    // Greeting handlers
    const handleSaveGreeting = () => {
        setGreeting(greetingDraft);
        setIsEditingGreeting(false);
    };

    // Services: show max 4 on the card
    const VISIBLE_SERVICES = 4;
    
    // We override dummy services if API returns services (mapping to Service interface)
    const activeServices: Service[] = Array.isArray(servicesData) && servicesData.length > 0 
        ? servicesData.map((s: any) => ({
            id: s.id.toString(),
            name: s.name,
            price: s.price || "",
            description: s.description || ""
        }))
        : (businessInfo?.services && businessInfo.services.length > 0 
            ? businessInfo.services.map((s: any) => ({
                id: s.id.toString(),
                name: s.name,
                price: s.price || "",
                description: s.description || ""
            })) 
            : []);

    const visibleServices = activeServices.slice(0, VISIBLE_SERVICES);
    const extraCount = Math.max(0, activeServices.length - VISIBLE_SERVICES);

    // Policies: override if API has items
    const activePolicies: Policy[] = Array.isArray(policiesData) && policiesData.length > 0
        ? policiesData.map((p: any) => ({
            id: p.id ? p.id.toString() : Date.now().toString(),
            policy_title: p.policy_title || "",
            content: p.content || "",
            policy_type: p.policy_type || "other"
        }))
        : [];

    const visiblePolicies = activePolicies.slice(0, VISIBLE_SERVICES);
    const extraPolicies = Math.max(0, activePolicies.length - VISIBLE_SERVICES);

    // Save Handlers
    // Save Handlers


    const {config} = useLandingConfig();

    const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const formatTime12 = (timeStr: string) => {
        if (!timeStr) return "";
        const [h, m] = timeStr.split(":");
        const hour = parseInt(h, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${m} ${ampm}`;
    };

    const formatBusinessHours = (hoursList: any[]) => {
        if (!hoursList || hoursList.length === 0) return null;
        
        return hoursList.map((h: any) => {
            const dayName = DAY_NAMES[h.day] || "Day";
            if (h.is_closed) return `${dayName}: Closed`;
            return `${dayName}: ${formatTime12(h.open_time)} – ${formatTime12(h.close_time)}`;
        }).join("\n");
    };

    return (
        <div className="relative w-full min-h-screen flex flex-col items-center py-10 px-4 font-sans overflow-x-hidden">
            {/* Decorative blobs */}
            {/* <div className="pointer-events-none absolute -top-40 -left-20 w-[600px] h-[600px] rounded-full opacity-60" style={{ background: "#D7B2FF66", filter: "blur(137px)" }} />
            <div className="pointer-events-none absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full opacity-60" style={{ background: "#D7B2FF66", filter: "blur(137px)" }} />
            <div className="pointer-events-none absolute -bottom-40 -right-20 w-[600px] h-[600px] rounded-full opacity-60" style={{ background: "#E6FBFF", filter: "blur(137px)" }} /> */}

            <div className="relative z-10 w-full max-w-[800px] bg-[#121214] border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl flex flex-col gap-10">

                {/* ── Header ────────────────────────────────────────────────────── */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 xl:gap-4">
                        <h1 className="text-2xl md:text-[32px] font-medium text-white font-geist">Your agent is ready to test</h1>
                        <SquareChevronRight className="text-gray-300 h-6 w-6 xl:h-7 xl:w-7 active:scale-95 transition-all cursor-pointer" onClick={() => setTestCallModalOpen(true)} />
                    </div>
                    <p className="text-sm md:text-base leading-relaxed max-w-[600px]" style={{color: config.colors.brandColorHex}}>
                        Review your agent's configuration below. You can test the conversation flow by talking to the agent directly or requesting a call.
                    </p>
                </div>

                {/* ── Business Information ───────────────────────────────────────── */}
                <div className="space-y-4">
                    <h2 className="text-xl font-medium text-white font-geist">Business Information</h2>
                    <div className="bg-[#5D5FEF]/5 rounded-[20px] p-6 md:p-8 space-y-6 relative">
                        {isLoading && <p className="text-sm text-gray-400 absolute top-6 right-14">Loading...</p>}
                        <button className="absolute top-6 right-6 hover:scale-105 hover:cursor-pointer transition-all"  style={{color: config.colors.brandColorHex}}>
                            <FiEdit2 size={18} />
                        </button>
                        {[
                            { label: "Business Name", value: businessInfo?.name || formData.businessName || "Luxe Home Services" },
                            { label: "Business Type", value: businessInfo?.business_type || formData.businessType || "Home repair and handyman services" },
                            { label: "Services", value: (businessInfo?.services?.length > 0 ? businessInfo.services.map((s: any) => s.name).join(", ") : formData.services) || "Design, Repair" },
                            { label: "Business Hours", value: formatBusinessHours(businessInfo?.hours) || "Monday – Friday: 8:00 AM – 5:00 PM\nSaturday: Closed  Sunday: Closed" },
                            { label: "Description", value: businessInfo?.description || formData.description || "Professional home repair services for homeowners, real estate professionals, and interior designers in Alpharetta, Georgia and surrounding areas" },
                        ].map(({ label, value }) => (
                            <div key={label} className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 items-start">
                                <span className=" text-[13px] font-medium"  style={{color: config.colors.brandColorHex}}>{label}:</span>
                                <span className="text-white text-sm whitespace-pre-line">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border border-[#A7A8F4]/20 rounded-[20px] space-y-4">


                    {/* ── UIUX Assistant ─────────────────────────────────────────────── */}
                    <div className="flex items-center justify-between relative">
                        <div className="flex items-center gap-4 ">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-white/20" />
                            </div>
                            <div className="">
                                {activeAgent ? (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-white">{activeAgent.voice.name}</span>
                                            <FiEdit2 size={14} className="cursor-pointer"  style={{color: config.colors.brandColorHex}} onClick={() => { setVoiceModalOpen(true); }} />
                                            <span className="bg-[#E6FFFA] text-[#00C2A0] text-[10px] px-2 py-0.5 rounded-full font-medium absolute top-0 right-0">Active</span>
                                        </div>
                                        <p className="text-[#9E9E9E] text-xs">Voice - enabled AI agent - {activeAgent.voice.language}</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-white">{DEFAULT_VOICE.voiceName}</span>
                                            <FiEdit2 size={14} className="cursor-pointer"  style={{color: config.colors.brandColorHex}} onClick={() => { setVoiceModalOpen(true); }} />
                                        </div>
                                        <p className="text-[#9E9E9E] text-xs">Voice - enabled AI agent - {DEFAULT_VOICE.language}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Agent Greeting ─────────────────────────────────────────────── */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-medium text-white">Agent Greeting</h2>
                            {!isEditingGreeting && (
                                <button onClick={() => { setGreetingDraft(greeting); setIsEditingGreeting(true); }} className=" hover:text-[#4a4ce0] transition-colors">
                                    <FiEdit2 size={16} style={{color: config.colors.brandColorHex}} />
                                </button>
                            )}
                        </div>

                        {isEditingGreeting ? (
                            <div className="space-y-3">
                                <textarea
                                    autoFocus
                                    value={greetingDraft}
                                    onChange={(e) => setGreetingDraft(e.target.value)}
                                    rows={4}
                                    className="w-full bg-[#5D5FEF]/5 border-2 border-[#5D5FEF]/30 rounded-[12px] p-4  text-xs leading-relaxed outline-none focus:border-[#5D5FEF] resize-none transition-colors"  style={{color: config.colors.brandColorHex}}
                                />
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setIsEditingGreeting(false)}
                                        className="text-xs px-4 py-2 rounded-full border border-white/10 text-gray-400 hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveGreeting}
                                        className="text-xs px-5 py-2 rounded-full  text-white font-medium hover:bg-[#4a4ce0] transition-colors flex items-center gap-1.5"
                                        style={{backgroundColor: config.colors.brandColorHex}}
                                    >
                                        <FiCheck size={12} /> Save Greeting
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#5D5FEF]/5 rounded-[12px] p-4  text-xs leading-relaxed border border-[#5D5FEF]/10"  style={{color: config.colors.brandColorHex}}>
                                {agentGreeting?.greeting_message ? agentGreeting?.greeting_message : "No greeting message set, Please edit to add greeting message"}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Services ───────────────────────────────────────────────────── */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-medium text-white font-geist">Services</h2>
                        <button onClick={() => setServicesModalOpen(true)} className="text-[#5D5FEF] hover:text-[#4a4ce0] transition-colors" style={{color: config.colors.brandColorHex}}>
                            <FiEdit2 size={20} />
                        </button>
                    </div>
                    <p className="text-[#9E9E9E] text-[10px]">Services your business offers with pricing</p>

                    {activeServices.length === 0 ? (
                        <AddServiceButton setServicesModalOpen={setServicesModalOpen} />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {visibleServices.map((service) => (
                                    <div key={service.id} className="bg-[#5D5FEF]/5 rounded-[12px] p-4 space-y-1 border border-transparent hover:border-[#5D5FEF]/20 transition-all">
                                        <h3 className="text-sm font-medium text-white">{service.name}</h3>
                                        <p className={`text-[10px] font-medium uppercase tracking-wider`} style={{color: service.price ? config.colors.brandColorHex : "#00C2A0"}}>
                                            {service.price || "Price not set"}
                                        </p>
                                        {service.description && <p className="text-[10px] text-[#9E9E9E] line-clamp-1">{service.description}</p>}
                                    </div>
                                ))}
                            </div>

                            {extraCount > 0 && (
                                <button
                                    onClick={() => setServicesModalOpen(true)}
                                    className="text-sm font-medium text-[#5D5FEF] hover:text-[#4a4ce0] underline underline-offset-2 transition-colors" style={{color: config.colors.brandColorHex}}
                                >
                                    +{extraCount} more service{extraCount > 1 ? "s" : ""}
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* ── Business Policies ──────────────────────────────────────────── */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-medium text-white font-geist">Business Policies</h2>
                        <button onClick={() => setPoliciesModalOpen(true)} className="text-[#5D5FEF] hover:text-[#4a4ce0] transition-colors" style={{color: config.colors.brandColorHex}}>
                            <FiEdit2 size={20} />
                        </button>
                    </div>
                    <p className="text-[#9E9E9E] text-[10px]">Important policies for customers</p>

                    {activePolicies.length === 0 ? (
                        /* Empty state — click to add */
                        <AddPolicyButton setPoliciesModalOpen={setPoliciesModalOpen} />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {visiblePolicies.map((policy) => (
                                    <div key={policy.id} className="bg-[#5D5FEF]/5 rounded-[12px] p-4 space-y-1.5 border border-transparent hover:border-[#5D5FEF]/20 transition-all">
                                        <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-[#5D5FEF] bg-[#5D5FEF]/10 px-2 py-0.5 rounded-full"  style={{color: config.colors.brandColorHex}}>
                                            {policy.policy_type}
                                        </span>
                                        <h3 className="text-sm font-medium text-white">{policy.policy_title}</h3>
                                        <p className="text-[10px] text-[#9E9E9E] line-clamp-2">{policy.content}</p>
                                    </div>
                                ))}
                            </div>
                            {extraPolicies > 0 && (
                                <button onClick={() => setPoliciesModalOpen(true)} className="text-sm font-medium text-[#5D5FEF] hover:text-[#4a4ce0] underline underline-offset-2 transition-colors block mx-auto" style={{color: config.colors.brandColorHex}}>
                                    +{extraPolicies} more polic{extraPolicies > 1 ? "ies" : "y"}
                                </button>
                            )}
                            <AddPolicyButton setPoliciesModalOpen={setPoliciesModalOpen} />
                        </>
                    )}
                </div>

                {/* ── Voice & Personality ────────────────────────────────────────── */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-medium text-white font-geist">Voice & Personality</h2>
                        <button onClick={() => setVoiceModalOpen(true)} className="text-[#5D5FEF] hover:text-[#4a4ce0] transition-colors" style={{color: config.colors.brandColorHex}}>
                            <FiEdit2 size={20} />
                        </button>
                    </div>
                    <p className="text-[#9E9E9E] text-[10px]">Customize how your agent sounds</p>

                    {!activeAgent ? (
                        <AddVoiceButton setVoiceModalOpen={setVoiceModalOpen} />
                    ) : (
                        /* Voice summary card */
                        <div
                            onClick={() => setVoiceModalOpen(true)}
                            className="bg-[#5D5FEF]/5 rounded-[20px] p-6 border border-[#5D5FEF]/15 cursor-pointer hover:border-[#5D5FEF]/35 transition-all group"
                        >
                            <div className="flex items-center gap-4 flex-wrap">
                                {/* Voice avatar */}
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg `} style={{background: config.colors.buttonGradientBorder}}>
                                    {activeAgent.voice.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold text-white text-sm">{activeAgent.voice.name}</span>
                                        <span className="text-[10px] bg-[#5D5FEF]/10 text-[#5D5FEF] px-2 py-0.5 rounded-full capitalize" style={{color: config.colors.brandColorHex}}>{activeAgent.voice.description}</span>
                                        <span className="text-[10px] bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">{activeAgent.voice.gender}</span>
                                        {/* <span className="text-[10px] bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">{voice.speed}x speed</span> */}
                                    </div>
                                    <p className="text-[11px] text-[#9E9E9E] mt-1">{activeAgent.voice.language}</p>
                                </div>
                                <FiEdit2 size={16} className="text-[#5D5FEF] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Bottom CTA ────────────────────────────────────────────────── */}
                <div className="mt-6 flex flex-col items-center gap-4">
                    <button
                        onClick={() => setTestCallModalOpen(true)}
                        className={`w-full  text-white py-4 rounded-full font-semibold shadow-2xl flex items-center justify-center gap-3 hover:opacity-90 active:opacity-80 transition-all cursor-pointer text-lg`}
                        style={{background: config.colors.buttonGradientBorder}}
                    >
                        <FiMic size={22} className="fill-white/20" onClick={onTalkToAgent} />
                        Talk To Your Agent
                    </button>
                    <p className="text-[#5D5FEF] text-[11px] font-medium opacity-80"  style={{color: config.colors.brandColorHex}}>Test your agent's responses in real-time.</p>
                    <button onClick={() => navigate("/dashboard")} className="h-10 w-10 rounded-full flex justify-center items-center p-2 hover:bg-white/10 duration-500 hover:cursor-pointer">
                        <Home className="text-gray-400" />
                    </button>
                </div>
            </div>

            {/* ── Modals ─────────────────────────────────────────────────────── */}
            <ServicesModal
                open={servicesModalOpen}
                onOpenChange={setServicesModalOpen}
            />
            <PoliciesModal
                open={policiesModalOpen}
                onOpenChange={setPoliciesModalOpen}
                policies={activePolicies}
            />
            <VoicePersonalityModal
                open={voiceModalOpen}
                onOpenChange={setVoiceModalOpen}
            />
            {testCallModalOpen && (
                <TestCallPopup onClose={() => setTestCallModalOpen(false)} />
            )}
        </div>
    );
};

export default AgentReady;