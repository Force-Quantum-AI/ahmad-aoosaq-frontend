"use client";

import { useState, useEffect } from "react";
import { FiEdit2, FiPlus, FiSave } from "react-icons/fi";
import { Shield } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { 
    useAddBusinessPoliciesMutation, 
    useUpdateBusinessPoliciesMutation 
} from "@/store/features/business/business.api";
import { useSelector } from "react-redux";

export interface Policy {
    id: string;
    policy_title: string;
    policy_type: string;
    content: string;
}

const POLICY_CATEGORIES = ["deposit", "payment", "refund", "cancellation", "other"];

interface PoliciesModalProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    policies: Policy[];
}

const emptyPolicy = (): Policy => ({
    id: "",
    policy_title: "",
    content: "",
    policy_type: "other",
});

export function PoliciesModal({ open, onOpenChange, policies }: PoliciesModalProps) {
    const businessDataRedux = useSelector((state: any) => state.business);
    const [addBusinessPolicies] = useAddBusinessPoliciesMutation();
    const [updateBusinessPolicies] = useUpdateBusinessPoliciesMutation();

    const [local, setLocal] = useState<Policy[]>(policies);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newPolicy, setNewPolicy] = useState<Policy>(emptyPolicy());

    // Update local state when policies prop changes
    useEffect(() => {
        setLocal(policies);
    }, [policies]);

    const updateLocal = (id: string, field: keyof Policy, value: string) => {
        setLocal((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    };

    const handleAddPolicy = async () => {
        if (!newPolicy.policy_title.trim()) {
            toast.error("Please enter a policy title");
            return;
        }
        if (!businessDataRedux?.id) {
            toast.error("Business ID not found");
            return;
        }

        try {
            const payload = {
                policy_type: newPolicy.policy_type,
                policy_title: newPolicy.policy_title,
                content: newPolicy.content
            };
            await addBusinessPolicies({ business_id: businessDataRedux.id, data: payload }).unwrap();
            setNewPolicy(emptyPolicy());
            setShowAddForm(false);
            toast.success("Policy added!");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to add policy");
            console.error(err);
        }
    };

    const handleUpdatePolicy = async (id: string) => {
        const policy = local.find(p => p.id === id);
        if (!policy) return;

        try {
            const payload = {
                id: policy.id,
                policy_type: policy.policy_type,
                policy_title: policy.policy_title,
                content: policy.content
            };
            await updateBusinessPolicies({ business_id: businessDataRedux.id, data: payload }).unwrap();
            setEditingId(null);
            toast.success("Policy updated!");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update policy");
            console.error(err);
        }
    };

    const handleSave = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-7xl! bg-[#121214] border border-white/10 w-full" style={{ height: "90vh", display: "flex", flexDirection: "column", padding: 0 }}>
                <DialogHeader className="px-8 pt-7 pb-4 border-b border-white/10 shrink-0">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold text-white font-geist">Business Policies</DialogTitle>
                        <p className="text-[#9E9E9E] text-xs">{local.length} polic{local.length !== 1 ? "ies" : "y"}</p>
                    </div>
                    <p className="text-[#9E9E9E] text-xs mt-0.5">Help customers understand your cancellation, payment, and deposit policies</p>
                </DialogHeader>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                    {/* Existing policies grid */}
                    {local.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {local.map((policy) => (
                                <div
                                    key={policy.id}
                                    className={`relative bg-[#5D5FEF]/5 border-2 rounded-[16px] p-5 transition-all ${editingId === policy.id ? "border-[#5D5FEF]/50 shadow-md" : "border-transparent hover:border-[#5D5FEF]/20"
                                        }`}
                                >
                                    {/* Actions */}
                                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                                        <button
                                            onClick={() => setEditingId(editingId === policy.id ? null : policy.id)}
                                            className="w-7 h-7 bg-[#1C1C1E] rounded-full shadow-sm flex items-center justify-center text-[#5D5FEF] hover:bg-[#5D5FEF] hover:text-white transition-all"
                                        >
                                            <FiEdit2 size={12} />
                                        </button>
                                    </div>

                                    {editingId === policy.id ? (
                                        <div className="flex flex-col gap-3 pt-5">
                                            <div>
                                                <label className="text-[10px] font-medium text-[#A7A8F4] uppercase tracking-wider">Type</label>
                                                <select
                                                    value={policy.policy_type}
                                                    onChange={(e) => updateLocal(policy.id, "policy_type", e.target.value)}
                                                    className="w-full mt-1 text-sm text-white bg-transparent border border-[#5D5FEF]/30 rounded-lg px-3 py-2 outline-none focus:border-[#5D5FEF]"
                                                >
                                                    {POLICY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-medium text-[#A7A8F4] uppercase tracking-wider">Title</label>
                                                <input
                                                    autoFocus
                                                    value={policy.policy_title}
                                                    onChange={(e) => updateLocal(policy.id, "policy_title", e.target.value)}
                                                    className="w-full mt-1 text-sm text-white bg-transparent border border-[#5D5FEF]/30 rounded-lg px-3 py-2 outline-none focus:border-[#5D5FEF]"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-medium text-[#A7A8F4] uppercase tracking-wider">Policy Details</label>
                                                <textarea
                                                    value={policy.content}
                                                    onChange={(e) => updateLocal(policy.id, "content", e.target.value)}
                                                    rows={4}
                                                    className="w-full mt-1 text-sm text-white bg-transparent border border-[#5D5FEF]/30 rounded-lg px-3 py-2 outline-none focus:border-[#5D5FEF] resize-none"
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleUpdatePolicy(policy.id)}
                                                className="self-end text-xs bg-[#5D5FEF] text-white px-4 py-1.5 rounded-full hover:bg-[#4a4ce0] transition-colors"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="pt-4 space-y-2">
                                            <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-[#5D5FEF] bg-[#5D5FEF]/10 px-2 py-0.5 rounded-full">
                                                {policy.policy_type}
                                            </span>
                                            <h3 className="text-sm font-semibold text-white pr-14">
                                                {policy.policy_title || <span className="text-gray-400 italic">Untitled</span>}
                                            </h3>
                                            <p className="text-[11px] text-[#9E9E9E] leading-relaxed line-clamp-4">
                                                {policy.content || <span className="italic">No details added</span>}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {local.length === 0 && !showAddForm && (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <Shield size={40} className="text-[#5D5FEF]/30" />
                            <p className="text-sm font-medium text-gray-400">No policies added yet</p>
                            <p className="text-xs text-gray-300 text-center max-w-[260px]">Add cancellation, payment, and deposit policies to inform your customers.</p>
                        </div>
                    )}

                    {/* Add policy section */}
                    <div className="border-t border-dashed border-[#5D5FEF]/20 pt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FiPlus className="text-[#5D5FEF]" size={16} />
                            <h3 className="text-sm font-semibold text-white">Add New Policy</h3>
                        </div>

                        {!showAddForm ? (
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="flex items-center gap-2 bg-[#5D5FEF]/5 border-2 border-dashed border-[#5D5FEF]/25 rounded-[16px] px-6 py-4 text-sm font-medium text-[#5D5FEF] hover:bg-[#5D5FEF]/10 hover:border-[#5D5FEF]/50 transition-all w-full justify-center"
                            >
                                <FiPlus size={16} /> Click to add a policy
                            </button>
                        ) : (
                            <div className="bg-[#5D5FEF]/5 border border-[#5D5FEF]/25 rounded-[16px] p-6 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-medium text-[#A7A8F4] uppercase tracking-wider">Type</label>
                                        <select
                                            value={newPolicy.policy_type}
                                            onChange={(e) => setNewPolicy((p) => ({ ...p, policy_type: e.target.value }))}
                                            className="w-full mt-1 text-sm text-white bg-transparent border border-[#5D5FEF]/30 rounded-lg px-3 py-2 outline-none focus:border-[#5D5FEF]"
                                        >
                                            {POLICY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-medium text-[#A7A8F4] uppercase tracking-wider">Policy Title *</label>
                                        <input
                                            autoFocus
                                            value={newPolicy.policy_title}
                                            onChange={(e) => setNewPolicy((p) => ({ ...p, policy_title: e.target.value }))}
                                            placeholder="e.g. 24-Hour Cancellation Policy"
                                            className="w-full mt-1 text-sm text-white bg-transparent border border-[#5D5FEF]/30 rounded-lg px-3 py-2 outline-none focus:border-[#5D5FEF]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-medium text-[#A7A8F4] uppercase tracking-wider">Policy Details</label>
                                    <textarea
                                        value={newPolicy.content}
                                        onChange={(e) => setNewPolicy((p) => ({ ...p, content: e.target.value }))}
                                        placeholder="Describe the policy in detail so customers and the AI agent understand it clearly…"
                                        rows={4}
                                        className="w-full mt-1 text-sm text-white bg-transparent border border-[#5D5FEF]/30 rounded-lg px-3 py-2 outline-none focus:border-[#5D5FEF] resize-none"
                                    />
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => { setShowAddForm(false); setNewPolicy(emptyPolicy()); }}
                                        className="text-sm px-4 py-2 rounded-full border border-white/10 text-gray-300 hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddPolicy}
                                        className="text-sm px-5 py-2 rounded-full bg-[#5D5FEF] text-white font-medium hover:bg-[#4a4ce0] transition-colors flex items-center gap-2"
                                    >
                                        <FiPlus size={14} /> Add Policy
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="shrink-0 px-8 py-5 border-t border-white/10 flex items-center justify-between bg-[#121214]">
                    <p className="text-xs text-[#9E9E9E]">Changes are saved when you click Save</p>
                    <div className="flex gap-3">
                        <button onClick={() => onOpenChange(false)} className="px-5 py-2 rounded-full text-sm text-gray-300 border border-white/10 hover:bg-white/10 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="px-6 py-2 rounded-full text-sm font-semibold text-white bg-[#5D5FEF] hover:bg-[#4a4ce0] transition-colors flex items-center gap-2 shadow-md">
                            <FiSave size={14} /> Save Changes
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}