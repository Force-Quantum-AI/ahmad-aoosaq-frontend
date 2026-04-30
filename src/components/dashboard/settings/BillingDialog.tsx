
// export default BillingDialog;
import React, { useState, useEffect } from "react";
import {
    CheckCircle2,
    Loader2,
    Plus,
    Trash2,
    X,
    ChevronDown,
    ChevronUp,
    Sparkles,
    AlertTriangle,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
    useGetFinalPlanModalInfoQuery,
    useAddOnsFeaturesMutation,
    useRemoveAddOnsFeaturesMutation,
    usePauseAndResumeAndDeleteSubscriptionMutation,
    useChangeSubscriptionPlanMutation,
} from "@/store/features/subscription/subscription.api";
import { toast } from "react-toastify";
import DeleteSubscriptionModal from "./DeleteSubscriptionModal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeatureDetail {
    id: number;
    name: string;
    feature_identifier: string;
    description: string;
    have_limit: boolean;
    value: string; // API returns "453.00" as string
    overage_price: string;
    price: string;
    currency: string;
    interval: string;
    marketing_features?: string[];
    active?: boolean;
}

interface Plan {
    id: number;
    name: string;
    price: string;
    currency: string;
    interval: string;
    trial_period_days?: number;
    marketing_features?: string[];
    features_details: FeatureDetail[];
}

interface BillingDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    planId?: number;
    subscriptionId?: number;
    subscriptionStatus: string;
    plan?: Plan;
    activeAddOns?: FeatureDetail[];
    isTrialing?: boolean;
    isPaused: boolean;
    add_ons: any[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (price: string | number, currency = "usd") =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.toUpperCase(),
        minimumFractionDigits: 0,
    }).format(Number(price));

// ─── Small sub-components ─────────────────────────────────────────────────────

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2.5">
        {children}
    </p>
);

const Divider = () => <div className="border-t border-gray-100 my-4" />;

interface ConfirmRemoveProps {
    feature: FeatureDetail;
    onConfirm: () => void;
    onCancel: () => void;
    loading: boolean;
    add_ons: any[];
}

const ConfirmRemove = ({ feature, add_ons, onConfirm, onCancel, loading }: ConfirmRemoveProps) => {
    console.log("add_ons",add_ons);
    const isCancelAtPeriodEnd = add_ons.find((addOn: any) => addOn.feature === feature.id)?.cancel_at_period_end;

    if (isCancelAtPeriodEnd) {
        return (
            <div className="rounded-xl border border-red-100 bg-red-50 p-3.5 flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-start gap-2">
                    <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-700 leading-relaxed">
                        You already have a request to remove <span className="font-black">{feature.name}</span>. Your {feature.name} feature will be cancelled at the end of your current billing cycle.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 text-xs font-medium border border-gray-200 bg-white text-gray-700 rounded-lg py-1.5 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        I Understood
                    </button>
                </div>
            </div>
        )
    } else {
        return (
            <div className="rounded-xl border border-red-100 bg-red-50 p-3.5 flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-start gap-2">
                    <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-700 leading-relaxed">
                        Remove <span className="font-semibold">{feature.name}</span>? This will take
                        effect at the end of your billing cycle.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 text-xs font-medium border border-gray-200 bg-white text-gray-700 rounded-lg py-1.5 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Keep it
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 text-xs font-semibold bg-red-500 hover:bg-red-600 text-white rounded-lg py-1.5 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                        Remove
                    </button>
                </div>
            </div>
        )
    }

};

// ─── Main Component ───────────────────────────────────────────────────────────

const BillingDialog: React.FC<BillingDialogProps> = ({
    open,
    setOpen,
    planId,
    subscriptionId,
    subscriptionStatus,
    plan,
    activeAddOns = [],
    isTrialing = false,
    isPaused = false,
    add_ons = []
}) => {

    const [featuresExpanded, setFeaturesExpanded] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedToAdd, setSelectedToAdd] = useState<number[]>([]);
    const [confirmRemoveId, setConfirmRemoveId] = useState<number | null>(null);
    const [addSuccess, setAddSuccess] = useState(false);

    const [pauseAndResumeAndDeleteSubscription, { isLoading: isPauseAndResumeAndDeleteSubscriptionLoading }] = usePauseAndResumeAndDeleteSubscriptionMutation();
    const [changeSubscriptionPlan, { isLoading: isChangeSubscriptionPlanLoading }] = useChangeSubscriptionPlanMutation();

    // Reset state when dialog closes
    useEffect(() => {
        if (!open) {
            setFeaturesExpanded(false);
            setSelectedToAdd([]);
            setConfirmRemoveId(null);
            setAddSuccess(false);
        }
    }, [open]);

    // Fetch eligible (addable) features — only fires when the accordion is open
    const { data: eligibleResponse, isLoading: loadingEligible } = useGetFinalPlanModalInfoQuery(
        {
            eligible_for: "subscription",
            id: subscriptionId,
        },
        { skip: !open || !featuresExpanded || !planId }
    );
    const eligibleFeatures: FeatureDetail[] = eligibleResponse?.data?.features ?? [];

    const [addOns, { isLoading: isAdding }] = useAddOnsFeaturesMutation();
    const [removeAddOns, { isLoading: isRemoving }] = useRemoveAddOnsFeaturesMutation();

    // ── Handlers ─────────────────────────────────────────────────────────────

    const toggleToAdd = (id: number) =>
        setSelectedToAdd((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );

    const handleAddFeatures = async () => {
        if (!subscriptionId || selectedToAdd.length === 0) return;
        try {
            await addOns({
                subscription_id: subscriptionId,
                add_on_ids: selectedToAdd,
                provider: "stripe",
            }).unwrap();
            setSelectedToAdd([]);
            setAddSuccess(true);
            toast.success("Added successfully");
            setTimeout(() => setAddSuccess(false), 3000);
            setOpen(false);
        } catch (err) {
            console.error("Add-ons error:", err);
            toast.error("Failed to add add-ons");
        }
    };

    const handleRemoveFeature = async (featureId: number) => {
        if (!subscriptionId) return;
        try {
            await removeAddOns({
                subscription_id: subscriptionId,
                add_on_ids: [featureId],
            }).unwrap();
            setConfirmRemoveId(null);
            toast.success("Removed successfully");
        } catch (err) {
            console.error("Remove add-on error:", err);
            toast.error("Failed to remove add-on");
        }
    };

    const handlePauseAndResumeSubscription = async (action: "pause" | "resume") => {
        try {
            await pauseAndResumeAndDeleteSubscription({
                subscription_id: subscriptionId,
                action
            }).unwrap();
            toast.success(`Subscription ${action} successfully`);
            setOpen(false);
        } catch (err) {
            console.error("Pause and resume subscription error:", err);
            toast.error(`Failed to ${action} subscription`);
        }
    };

    const handleChangeSubscriptionPlan = async () => {
        try {
            const res = await changeSubscriptionPlan({
                return_url: window.location.href
            }).unwrap();
            window.location.href = res?.data?.url;
        } catch (err) {
            console.error("Change subscription plan error:", err);
            toast.error("Failed to change subscription plan");
        }
    };

    // Guard: don't render without a plan
    if (!plan) return null;

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTitle></DialogTitle>
                <DialogContent className="w-full max-w-lg bg-white rounded-2xl shadow-xl border-none p-0 overflow-hidden">

                    {/* ── Header ── */}
                    <div className="px-5 pt-5 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-5">
                            <h2 className="text-base font-semibold text-gray-900">Subscription</h2>
                            <span
                                className={cn(
                                    "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg",
                                    isTrialing || isPaused
                                        ? "bg-yellow-50 text-yellow-600 border border-yellow-200"
                                        : "bg-green-50 text-green-600 border border-green-200"
                                )}
                            >
                                <CheckCircle2 size={12} />
                                {isPaused ? "Paused" : isTrialing ? "Trial" : "Active"}
                            </span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">
                            Manage your subscription and add-ons.
                        </p>
                    </div>

                    <div className="px-5 py-4 flex flex-col gap-4 max-h-[72vh] overflow-y-auto">

                        {/* ── Plan Info Card ── */}
                        <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="text-gray-900 text-xl font-bold capitalize">
                                        {plan.name}
                                    </h3>
                                    <div className="flex items-baseline gap-1 mt-0.5">
                                        <span className="text-gray-900 text-base font-semibold">
                                            {fmt(plan.price, plan.currency)}
                                        </span>
                                        <span className="text-gray-400 text-xs">/{plan.interval}</span>
                                    </div>
                                </div>
                                {activeAddOns.length > 0 && (
                                    <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 rounded-full px-2 py-0.5 font-medium whitespace-nowrap">
                                        +{activeAddOns.length} add-on{activeAddOns.length !== 1 ? "s" : ""}
                                    </span>
                                )}
                            </div>

                            {/* Base plan features */}
                            {plan.features_details.map((f) => (
                                <div
                                    key={f.id}
                                    className="mt-3 pt-3 border-t border-gray-200 flex flex-col gap-0.5"
                                >
                                    <p className="text-gray-800 text-xs font-medium">{f.name}</p>
                                    {f.have_limit && (
                                        <p className="text-gray-700 text-xs">
                                            <span className="font-semibold">
                                                {Number(f.value).toLocaleString()}
                                            </span>{" "}
                                            <span className="text-gray-500">included</span>
                                        </p>
                                    )}
                                    {f.overage_price && (
                                        <p className="text-gray-700 text-xs">
                                            <span className="font-semibold">
                                                {fmt(f.overage_price, f.currency)}
                                            </span>
                                            <span className="text-gray-500">
                                                /overage after{" "}
                                                {f.have_limit ? Number(f.value).toLocaleString() : "—"}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            ))}

                            {isTrialing && (
                                <div className="mt-3 pt-3 border-t border-yellow-200 bg-yellow-50 -mx-1 px-2 pb-1 rounded-b-lg">
                                    <p className="text-yellow-700 text-xs flex items-center gap-1.5 py-1">
                                        <Sparkles size={11} />
                                        Trial active — billing starts after trial ends
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* ── Manage Features Accordion ── */}
                        <div className="border border-gray-100 rounded-xl overflow-y-auto">
                            <button
                                onClick={() => setFeaturesExpanded((v) => !v)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                            >
                                <span className="text-sm font-semibold text-gray-800">
                                    Manage Features
                                </span>
                                <div className="flex items-center gap-2">
                                    {activeAddOns.length > 0 && (
                                        <span className="text-[10px] font-medium bg-black text-white rounded-full w-4 h-4 flex items-center justify-center">
                                            {activeAddOns.length}
                                        </span>
                                    )}
                                    {featuresExpanded ? (
                                        <ChevronUp size={15} className="text-gray-400" />
                                    ) : (
                                        <ChevronDown size={15} className="text-gray-400" />
                                    )}
                                </div>
                            </button>

                            {featuresExpanded && (
                                <div className="px-4 py-4 flex flex-col gap-4 bg-white animate-in fade-in slide-in-from-top-2 duration-150">

                                    {/* Active Add-ons */}
                                    {activeAddOns.length > 0 && (
                                        <div>
                                            <SectionLabel>Active Add-ons</SectionLabel>
                                            <div className="flex flex-col gap-2">
                                                {activeAddOns.map((f) => (
                                                    <div key={f.id}>
                                                        {confirmRemoveId === f.id ? (
                                                            <ConfirmRemove
                                                                feature={f}
                                                                onConfirm={() => handleRemoveFeature(f.id)}
                                                                onCancel={() => setConfirmRemoveId(null)}
                                                                loading={isRemoving}
                                                                add_ons={add_ons}
                                                            />
                                                        ) : (
                                                            <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 gap-3">
                                                                <div className="min-w-0">
                                                                    <p className="text-xs font-medium text-gray-900 truncate">
                                                                        {f.name}
                                                                    </p>
                                                                    {f.have_limit && (
                                                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                                                            {Number(f.value).toLocaleString()} included ·{" "}
                                                                            {fmt(f.overage_price, f.currency)}/extra
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                                    <span className="text-xs font-semibold text-gray-700">
                                                                        {fmt(f.price, f.currency)}
                                                                        <span className="text-gray-400 font-normal text-[10px]">
                                                                            /{f.interval}
                                                                        </span>
                                                                    </span>
                                                                    <button
                                                                        onClick={() => setConfirmRemoveId(f.id)}
                                                                        className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                                                        aria-label={`Remove ${f.name}`}
                                                                    >
                                                                        <X size={13} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeAddOns.length > 0 && <Divider />}

                                    {/* Available to Add */}
                                    <div>
                                        <SectionLabel>Available to Add</SectionLabel>

                                        {loadingEligible ? (
                                            <div className="flex items-center justify-center py-6 gap-2 text-gray-400">
                                                <Loader2 size={15} className="animate-spin" />
                                                <span className="text-xs">Loading features…</span>
                                            </div>
                                        ) : eligibleFeatures.length === 0 ? (
                                            <div className="flex flex-col items-center py-5 text-center">
                                                <CheckCircle2 size={20} className="text-green-400 mb-1.5" />
                                                <p className="text-xs text-gray-500">
                                                    You have all available features on this plan.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                {eligibleFeatures.map((f) => {
                                                    const isSelected = selectedToAdd.includes(f.id);
                                                    return (
                                                        <button
                                                            key={f.id}
                                                            onClick={() => toggleToAdd(f.id)}
                                                            className={cn(
                                                                "w-full flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-150",
                                                                isSelected
                                                                    ? "border-black bg-black"
                                                                    : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
                                                            )}
                                                        >
                                                            {/* Custom checkbox */}
                                                            <span
                                                                className={cn(
                                                                    "w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all",
                                                                    isSelected
                                                                        ? "bg-white border-white"
                                                                        : "bg-transparent border-gray-300"
                                                                )}
                                                            >
                                                                {isSelected && (
                                                                    <svg
                                                                        viewBox="0 0 10 8"
                                                                        className="w-2.5 h-2 fill-none stroke-black stroke-2"
                                                                    >
                                                                        <polyline points="1,4 4,7 9,1" />
                                                                    </svg>
                                                                )}
                                                            </span>

                                                            <div className="flex-1 min-w-0">
                                                                <p
                                                                    className={cn(
                                                                        "text-xs font-medium truncate",
                                                                        isSelected ? "text-white" : "text-gray-800"
                                                                    )}
                                                                >
                                                                    {f.name}
                                                                </p>
                                                                {f.have_limit && (
                                                                    <p
                                                                        className={cn(
                                                                            "text-[10px] mt-0.5",
                                                                            isSelected ? "text-gray-300" : "text-gray-400"
                                                                        )}
                                                                    >
                                                                        {Number(f.value).toLocaleString()} included
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="flex-shrink-0 text-right">
                                                                <span
                                                                    className={cn(
                                                                        "text-xs font-bold",
                                                                        isSelected ? "text-white" : "text-gray-700"
                                                                    )}
                                                                >
                                                                    {fmt(f.price, f.currency)}
                                                                </span>
                                                                <span
                                                                    className={cn(
                                                                        "text-[10px] block",
                                                                        isSelected ? "text-gray-300" : "text-gray-400"
                                                                    )}
                                                                >
                                                                    /{f.interval}
                                                                </span>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* Add button */}
                                    {selectedToAdd.length > 0 && (
                                        <button
                                            onClick={handleAddFeatures}
                                            disabled={isAdding}
                                            className="w-full mt-1 flex items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white text-xs font-semibold rounded-xl py-2.5 transition-colors disabled:opacity-60"
                                        >
                                            {isAdding ? (
                                                <>
                                                    <Loader2 size={13} className="animate-spin" />
                                                    Adding…
                                                </>
                                            ) : (
                                                <>
                                                    <Plus size={13} />
                                                    Add {selectedToAdd.length} Feature
                                                    {selectedToAdd.length !== 1 ? "s" : ""}
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {/* Success toast */}
                                    {addSuccess && (
                                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl px-3 py-2.5 animate-in fade-in duration-200">
                                            <CheckCircle2 size={13} />
                                            Features added successfully!
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ── Action Buttons ── */}
                        <div className="flex flex-col gap-2.5">
                            {/* <button
                            onClick={handleAddFeatures}
                            disabled={isAdding}
                            className="w-full bg-black hover:bg-gray-900 text-white text-sm font-semibold rounded-xl py-2.5 transition-colors cursor-pointer"
                        >
                            {selectedToAdd.length > 0 ? isAdding ? "Updating…" : "Update Plan" : "Add Features"}
                        </button> */}
                            {subscriptionStatus === "active" ? (
                                <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 text-sm font-semibold rounded-xl py-2.5 transition-colors cursor-pointer"
                                    onClick={() => handlePauseAndResumeSubscription("pause")}
                                >
                                    {isPauseAndResumeAndDeleteSubscriptionLoading ? "Pausing..." : "Pause Subscription"}
                                </button>
                            ) : subscriptionStatus === "paused" && (
                                <button className="w-full bg-green-700 text-white hover:bg-green-600 text-sm font-semibold rounded-xl py-2.5 transition-colors cursor-pointer"
                                    onClick={() => handlePauseAndResumeSubscription("resume")}
                                >
                                    {isPauseAndResumeAndDeleteSubscriptionLoading ? "Resuming..." : "Resume Subscription"}
                                </button>
                            )}
                            <button className="w-full bg-black text-white hover:bg-gray-900 text-sm font-medium py-2 rounded-xl transition-colors cursor-pointer" onClick={handleChangeSubscriptionPlan} disabled={isChangeSubscriptionPlanLoading}>
                                {isChangeSubscriptionPlanLoading ? "Loading..." : "Change Subscription Plan"}
                            </button>
                            <button className="w-full bg-red-700 text-white hover:bg-red-600 text-sm font-medium py-2 rounded-xl transition-colors cursor-pointer" onClick={() => setIsDeleteModalOpen(true)}>
                                Cancel Subscription
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <DeleteSubscriptionModal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} subscription_id={subscriptionId} />
        </>
    );
};

export default BillingDialog;