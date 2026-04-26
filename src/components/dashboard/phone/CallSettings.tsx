import { Check, CircleCheck, Copy, PhoneCall, RefreshCw, Settings2, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import CallForwordingModal from "./CallForwordingModal";
import CallForwardingSetupModal from "./CallForwardingSetupModal";
import { copyText } from "@/lib/copyText";
import { useDeleteCallForwordingMutation, useGetPhonePageAllInfoQuery, useUpdatePhonePageInfoMutation } from "@/store/features/phone/phone.api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";
import TestCallPopup from "../TestCallPopup";
import RecentCalls from "./RecentCalls";

// ── Types    
interface ForwardingOption {
    title: string;
    description: string;
    label: string;
    needsSetup?: boolean;
}

// ── Data    ─
const forwardingOptions: ForwardingOption[] = [
    { title: "Always", label: "always", description: "Answer all calls 24 / 7" },
    { title: "After Hours", label: "after hours", description: "Outside business hours" },
    { title: "Business Hours", label: "business hours", description: "Only during set hours" },
    {
        title: "When I don't answer", label: "when i don't answer",
        description: "Forward your existing number",
        needsSetup: true,
    },
];

export default function CallSettings() {
    const [isForwardingModalOpen, setIsForwardingModalOpen] = useState(false);
    const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
    const [isTestCallModalOpen, setIsTestCallModalOpen] = useState(false);

    const { data: phonePageAllInfo, isLoading: isPhonePageAllInfoLoading } = useGetPhonePageAllInfoQuery({});
    const [updatePhonePageInfo, { isLoading: isUpdatePhonePageInfoLoading }] = useUpdatePhonePageInfoMutation();
    const [deleteCallForwording, { isLoading: isDeleteCallForwordingLoading }] = useDeleteCallForwordingMutation();

    const handleWhenToAnswerOptionChange = async (option: string, id: number) => {
            await updatePhonePageInfo({ data: { when_to_answer: option }, id });
    }
    const handleDelete = async (id:number, forwordId:number)=>{
        toast.loading("Deleting call forwarding...");
        await deleteCallForwording(forwordId);
        await updatePhonePageInfo({ data: { when_to_answer: "always" }, id });
        toast.dismiss();
        toast.success("Call forwarding deleted successfully");
    }

    return (
        <div className="min-h-screen bg-black text-white px-4 md:px-6 py-4 flex flex-col gap-6">

            {/* ── Page header ──────── */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <p className="text-lg md:text-xl xl:text-2xl text-gray-400">
                    Manage your{" "}
                    <span className="font-semibold text-white hover:text-blue-400 transition-colors cursor-pointer underline" onClick={() => setIsForwardingModalOpen(true)}>Phone setting</span>{" "}
                    and call routing.
                </p>

                <div className="flex items-center gap-2">
                    {/* SOW number badge */}
                    <button
                        onClick={() => copyText(phonePageAllInfo?.[0]?.phone_number)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition-colors text-white text-sm font-medium px-4 py-2 rounded-xl"
                    >
                        <Copy size={14} />
                        {phonePageAllInfo?.[0]?.phone_number}
                    </button>
                </div>
            </div>

            {/* Action buttons row */}
            <div className="flex justify-start md:justify-end gap-2">
                <button className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-white text-sm px-4 py-2 rounded-xl transition-colors" onClick={() => window.location.reload()}>
                    <RefreshCw size={14} />
                    Refresh
                </button>
                {/* <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30  text-white text-sm px-4 py-2 rounded-xl transition-colors">
                    <Save size={14} />
                    Save Changes
                </button> */}
            </div>

            {/* ── Top two-column grid          */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* LEFT — SOW Number + Call Forwarding */}
                {isPhonePageAllInfoLoading ? (
                    <Skeleton className="w-full h-100  rounded-2xl bg-[#111111]" />
                ) : (
                    <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 flex flex-col gap-8">

                        {/* SOW Number — compact, content-fit sub-card */}
                        {!phonePageAllInfo?.[0]?.phone_number ? (
                            <div className="bg-[#0d0d0d] border border-dashed border-white/20 rounded-xl px-6 py-10 flex flex-col items-center text-center transition-all">
                                {/* Subtle Icon Background */}
                                <div className="w-14 h-14 rounded-full bg-blue-600/5 border border-blue-600/20 flex items-center justify-center mb-5">
                                    <PhoneCall className="text-blue-500/50" size={24} />
                                </div>

                                <div className="max-w-[280px]">
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                                        SOW Number Inactive
                                    </p>
                                    <h3 className="text-white text-lg font-semibold mb-2">
                                        Ready to start taking calls?
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-6">
                                        Assign a dedicated phone number to activate your AI assistant.
                                    </p>
                                </div>

                                <button
                                    onClick={() => setIsForwardingModalOpen(true)}
                                    className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm px-6 py-3 rounded-xl transition-all font-bold hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] active:scale-95"
                                >
                                    <span className="relative">Set Phone Number</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                                </button>
                            </div>
                        ) : (
                            <div className="bg-[#0d0d0d] border border-white/8 rounded-xl px-5 py-5">
                                <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-3">Your SOW Number</p>
                                <h2 className="text-3xl font-semibold tracking-tight mb-1 leading-none">
                                    {/* <span className="text-white">(650) 250–</span>
                            <span className="text-blue-400">0287</span> */}
                                    <span className="text-blue-400">{phonePageAllInfo?.[0]?.phone_number}</span>
                                </h2>
                                <p className="text-gray-500 text-xs mt-2 mb-4">
                                    Customers call this number to reach your AI assistant
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => copyText(phonePageAllInfo?.[0]?.phone_number)}
                                        className="flex items-center gap-2 bg-[#1e1e1e] hover:bg-[#262626] border border-white/10 text-white text-sm px-4 py-2.5 rounded-xl transition-colors font-medium"
                                    >
                                        <Copy size={14} />
                                        Copy Number
                                    </button>
                                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2.5 rounded-xl transition-colors font-medium"
                                    onClick={() => setIsTestCallModalOpen(true)}
                                    >
                                        <PhoneCall size={14} />
                                        Test Call
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="border-t border-white/8" />

                        {/* Call Forwarding */}
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-white text-lg font-semibold">Call Forwarding</h3>
                                <span className="text-xs border border-white/20 text-gray-400 px-2.5 py-0.5 rounded-full">
                                    Optional
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm mb-5">
                                Forward your existing number to CHYR via your carrier
                            </p>

                            {/* Configure forwarding — compact inline card, not a big empty box */}
                            {phonePageAllInfo?.[0]?.when_to_answer === "when i don't answer" ? (
                                <div className="border border-white/10 bg-[#0d0d0d] rounded-xl px-5 py-8 2xl:py-12 flex items-center justify-between gap-6 cursor-pointer hover:bg-[#141414] hover:border-white/20 transition-all group">
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
                                            Forwarding Number
                                        </span>
                                        <p className="text-blue-400 text-xl font-mono mt-1 truncate">
                                            {phonePageAllInfo?.[0]?.call_forwarding?.current_number}
                                        </p>
                                    </div>

                                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-wider opacity-80 hover:opacity-100 hover:bg-red-500/20 transition-all border border-red-500/20"
                                    onClick={()=> handleDelete(phonePageAllInfo?.[0]?.id,phonePageAllInfo?.[0]?.call_forwarding?.id)}
                                    >
                                        <Trash2 size={14} />
                                        {isDeleteCallForwordingLoading ? "Removing...":"Remove"}
                                    </button>
                                </div>
                            ) : (
                                <div className="border border-white/10 bg-[#0d0d0d] rounded-xl px-4 py-3.5 flex items-center gap-4 cursor-pointer hover:bg-[#141414] transition-colors"
                                >
                                    <div className="w-9 h-9 bg-[#1a1a1a] rounded-lg flex items-center justify-center shrink-0">
                                        <PhoneCall size={16} className="text-gray-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-medium">Configure Forwarding</p>
                                        <p className="text-gray-500 text-xs mt-0.5 truncate">
                                            Setup call forwarding from your existing number
                                        </p>
                                    </div>
                                    <button onClick={() => setIsSetupModalOpen(true)} className="flex items-center gap-1.5 bg-[#1e1e1e] hover:bg-[#282828] border border-white/10 text-blue-400 text-xs px-3 py-1.5 rounded-lg transition-colors shrink-0">
                                        <Settings2 size={12} />
                                        Set up
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* RIGHT — When To Answer */}
                {isPhonePageAllInfoLoading ? (
                    <Skeleton className="w-full h-100  rounded-2xl bg-[#111111]" />
                ) : (
                    <div className="bg-[#111111] border border-white/8 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
                            <h3 className="text-white text-lg font-semibold">When To Answer</h3>
                            <div className="flex items-center gap-1.5 bg-[#1a1a1a] border border-white/10 text-white text-sm px-3 py-1.5 rounded-xl">
                                <Check size={14} className="text-gray-300" />
                                <span>{phonePageAllInfo?.[0]?.when_to_answer}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            {forwardingOptions.map((option) => {
                                if (phonePageAllInfo?.[0]?.when_to_answer === "when i don't answer") {
                                    if (option.label === "after hours" || option.label === "business hours" || option.label==="always") {
                                        return null;
                                    }
                                }
                                return (
                                    <div
                                        key={option.title}
                                        onClick={() => {
                                            if (option.needsSetup) setIsSetupModalOpen(true);
                                            else handleWhenToAnswerOptionChange(option.label, phonePageAllInfo?.[0]?.id)
                                        }}
                                        className={`flex items-center justify-between rounded-xl px-5 py-4 cursor-pointer transition-colors ${phonePageAllInfo?.[0]?.when_to_answer === option.label
                                            ? "bg-[#1a1a1a] border border-white/15"
                                            : "bg-transparent hover:bg-[#141414] border border-transparent"
                                            }`}
                                    >
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-white text-sm font-medium">{option.title}</p>
                                                {option.needsSetup && (
                                                    <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                                                        Setup needed
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-500 text-xs mt-0.5">{option.description}</p>
                                        </div>
                                        {phonePageAllInfo?.[0]?.when_to_answer === option.label && (
                                            isUpdatePhonePageInfoLoading ? <Loader2 size={18} className="text-blue-400 shrink-0 ml-3 animate-spin" /> : <CircleCheck size={18} className="text-blue-400 shrink-0 ml-3" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Recent Calls         ─────── */}
            <RecentCalls />

            {/* ── Modals   */}
            {isForwardingModalOpen && (
                <CallForwordingModal
                    isOpen={isForwardingModalOpen}
                    setIsOpen={setIsForwardingModalOpen}
                    setForwardingModalOpen={setIsSetupModalOpen}
                />
            )}
            {isSetupModalOpen && (
                <CallForwardingSetupModal
                    isOpen={isSetupModalOpen}
                    setIsOpen={setIsSetupModalOpen}
                    id={phonePageAllInfo?.[0]?.id}
                />
            )}
            {isTestCallModalOpen && <TestCallPopup onClose={() => setIsTestCallModalOpen(false)} />}
        </div>
    );
}