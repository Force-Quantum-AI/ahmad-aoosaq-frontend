import { DarkButton, DarkCard } from "@/pages/Dashboard/DashboardSettings";
import {
    CheckCircle2,
    CircleDollarSign,
    Loader2,
    AlertCircle,
    Zap,
    CalendarDays,
} from "lucide-react";
import { useState } from "react";
import BillingDialog from "./BillingDialog";
import BuyPlanDialog from "./BuyPlanDialog";
import {
    useGetAllPlansQuery,
    useGetUserCurrentSubscriptionQuery,
} from "@/store/features/subscription/subscription.api";

// ─── Types  ──

interface FeatureDetail {
    id: number;
    name: string;
    feature_identifier: string;
    description: string;
    have_limit: boolean;
    value: string;
    overage_price: string;
    price: string;
    currency: string;
    interval: string;
    marketing_features: string[];
    active: boolean;
    stripe_product_id: string;
    stripe_price_id: string;
    created_at: string;
    updated_at: string;
}

interface FeatureAndUsage {
    feature: FeatureDetail;
    usage: unknown[];
    total_usage: number;
}

interface AddOn {
    id: number;
    active: boolean;
    cancel_at_period_end: boolean;
    created_at: string;
    updated_at: string;
    subscription: number;
    feature: number; // feature id
}

interface Plan {
    id: number;
    name: string;
    description: string | null;
    interval: string;
    price: string;
    currency: string;
    trial_period_days: number;
    active: boolean;
    features_details: FeatureDetail[];
    marketing_features: string[];
    stripe_product_id: string;
    stripe_price_id: string;
}

interface Subscription {
    id: number;
    active: boolean;
    status: string;
    is_trial: boolean;
    trial_end: string | null;
    current_period_start: string | null;
    current_period_end: string | null;
    provider: string;
    provider_subscription_id: string | null;
    created_at: string;
    updated_at: string;
    business: number;
    plan: number;
    cancel_at_period_end: boolean;
}

interface SubscriptionData {
    subscription: Subscription;
    features_and_usage: FeatureAndUsage[];
    plan: Plan;
    add_ons: AddOn[];
}

// ─── Helpers  

const fmt = (price: string | number, currency = "usd") =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.toUpperCase(),
        minimumFractionDigits: 0,
    }).format(Number(price));

const formatDateShort = (iso: string | null) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// ─── Sub-components   

const UsageBar = ({
    used,
    total,
}: {
    used: number;
    total: number;
}) => {
    const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
    const color =
        pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : "bg-emerald-500";
    return (
        <div className="w-full h-1 bg-white/8 rounded-full overflow-hidden mt-2">
            <div
                className={`h-full rounded-full transition-all duration-500 ${color}`}
                style={{ width: `${pct}%` }}
            />
        </div>
    );
};

// ─── Main Component   

const Billing = () => {
    const { data: plans } = useGetAllPlansQuery({});
    const {
        data: subscriptionResponse,
        isLoading,
        isError,
    } = useGetUserCurrentSubscriptionQuery({});

    const [isBillingDialogOpen, setIsBillingDialogOpen] = useState(false);
    const [isBuyPlanDialogOpen, setIsBuyPlanDialogOpen] = useState(false);

    const subData: SubscriptionData | undefined = subscriptionResponse?.data;

    // const [isPlanPresent, setIsPlanPresent] = useState(false);
    // !!subData?.subscription?.active || subData?.subscription.status==="paused" && setIsPlanPresent(true)

    // when doing this then displaying subscription with status pending 
    // const isPlanPresent = !subData?.subscription?.active ? (subData?.subscription.status === "active" || subData?.subscription.status === "paused") && true : false;
    // when doing this then not displaying subscription , but where status active 
    // const isPlanPresent = subData?.subscription?.active ? (subData?.subscription.status === "active" || subData?.subscription.status === "paused") && true : false;
    const isPlanPresent = subData?.subscription.status === "active" || subData?.subscription.status === "paused" ? true : false;
    console.log("is act: " ,isPlanPresent);

    // ── Derive active add-on feature objects 
    const activeAddOnFeatures: FeatureDetail[] = (subData?.add_ons ?? [])
        .filter((a) => a.active)
        .map((addon) => {
            const match = subData?.features_and_usage.find(
                (fu) => fu.feature.id === addon.feature
            );
            return match?.feature ?? null;
        })
        .filter(Boolean) as FeatureDetail[];

    // ── Derive plan-base features (exclude add-on features) 
    const planFeatureIds = new Set(subData?.plan.features_details.map((f) => f.id) ?? []);
    const addOnFeatureIds = new Set(activeAddOnFeatures.map((f) => f.id));

    // ── Find call_limit feature for the primary stat 
    const callFeature = subData?.features_and_usage.find(
        (fu) => fu.feature.feature_identifier === "call_limit"
    );

    const plan = subData?.plan;
    const sub = subData?.subscription;

    console.log(sub);
    console.log(sub?.cancel_at_period_end);
    
    

    // ─── Loading   ──
    if (isLoading) {
        return (
            <DarkCard>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white text-lg font-semibold">Billing</h2>
                </div>
                <div className="flex items-center justify-center py-16 gap-3 text-gray-500">
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-sm">Loading subscription…</span>
                </div>
            </DarkCard>
        );
    }

    // ─── Error   ─────
    if (isError) {
        return (
            <DarkCard>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white text-lg font-semibold">Billing</h2>
                </div>
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                    <AlertCircle size={22} className="text-red-400" />
                    <p className="text-gray-400 text-sm">
                        Failed to load subscription. Please refresh.
                    </p>
                </div>
            </DarkCard>
        );
    }

    return (
        <DarkCard>
            {/* ── Card Header ── */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-lg font-semibold">Billing</h2>
                {isPlanPresent && sub && (
                    <span
                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border ${
                            sub.is_trial
                                ? "bg-[#2a2000] border-yellow-600/30 text-yellow-400"
                                : sub.status === "active"
                                ? "bg-[#001a0d] border-emerald-600/30 text-emerald-400"
                                : "bg-[#1a1a1a] border-white/10 text-gray-400"
                        }`}
                    >
                        <CheckCircle2 size={13} />
                        {sub.is_trial
                            ? "Trialing"
                            : sub.status === "active"
                            ? "Active"
                            : sub.status}
                    </span>
                )}
            </div>

            {isPlanPresent && plan && sub ? (
                <div className="flex flex-col gap-4">
                    {/* ── Current Plan Card ── */}
                    <div className="bg-[#1a1a1a] border border-white/8 rounded-xl p-4">
                        <p className="text-gray-500 text-xs mb-3">Current Plan</p>
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <p className="text-white text-base font-semibold capitalize">
                                    {plan.name} — {fmt(plan.price, plan.currency)}/mo
                                </p>
                                {/* Show call_limit feature details if present */}
                                {callFeature ? (
                                    <p className="text-sm mt-0.5">
                                        <span className="text-white font-medium">
                                            {Number(callFeature.feature.value).toLocaleString()}
                                        </span>
                                        <span className="text-gray-500"> calls included • </span>
                                        <span className="text-white font-medium">
                                            {fmt(callFeature.feature.overage_price, callFeature.feature.currency)}
                                        </span>
                                        <span className="text-gray-500">/call after</span>
                                    </p>
                                ) : (
                                    <p className="text-gray-500 text-sm mt-0.5">
                                        {plan.features_details.length} feature
                                        {plan.features_details.length !== 1 ? "s" : ""} included
                                    </p>
                                )}
                                {/* Add-ons badge */}
                                {activeAddOnFeatures.length > 0 && (
                                    <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/20 rounded-full px-2 py-0.5">
                                        <Zap size={9} />
                                        {activeAddOnFeatures.length} add-on
                                        {activeAddOnFeatures.length !== 1 ? "s" : ""} active
                                    </span>
                                )}
                            </div>
                            <DarkButton onClick={() => setIsBillingDialogOpen(true)}>
                                Manage
                            </DarkButton>
                        </div>

                        {/* Trial or period banner */}
                        {sub.is_trial && sub.trial_end ? (
                            <div className="bg-[#2a1f00] border border-yellow-700/30 rounded-xl py-2.5 text-center text-yellow-400 text-sm font-medium">
                                Trial ends {formatDateShort(sub.trial_end)}
                            </div>
                        ) : sub.current_period_end ? (
                            <div className="bg-[#0d1a0d] border border-emerald-700/20 rounded-xl py-2.5 text-center text-emerald-400/80 text-sm">
                                Renews {formatDateShort(sub.current_period_end)}
                            </div>
                        ) : null}
                    </div>

                    {/* ── Stats grid ── */}
                    <div
                        className={`grid gap-3 ${
                            subData.features_and_usage.length > 0
                                ? "grid-cols-2"
                                : "grid-cols-2"
                        }`}
                    >
                        {/* Billing period */}
                        <div className="bg-[#1a1a1a] border border-white/6 rounded-xl p-4">
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <CalendarDays size={11} />
                                Period End
                            </p>
                            <p className="text-white text-xl font-semibold">
                                {formatDateShort(sub.current_period_end ?? sub.trial_end)}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                                {sub.is_trial ? "trial ends" : "next billing"}
                            </p>
                        </div>

                        {/* Features count */}
                        <div className="bg-[#1a1a1a] border border-white/6 rounded-xl p-4">
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">
                                Features
                            </p>
                            <p className="text-white text-xl font-semibold">
                                {subData.features_and_usage.length}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                                {planFeatureIds.size} base
                                {activeAddOnFeatures.length > 0
                                    ? ` + ${activeAddOnFeatures.length} add-on`
                                    : ""}
                            </p>
                        </div>
                    </div>

                    {/* ── Feature usage list ── */}
                    {subData.features_and_usage.length > 0 && (
                        <div className="bg-[#1a1a1a] border border-white/6 rounded-xl p-4">
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">
                                Feature Usage
                            </p>
                            <div className="flex flex-col gap-3">
                                {subData.features_and_usage.map(({ feature, total_usage }) => {
                                    const limit = feature.have_limit ? Number(feature.value) : null;
                                    const isAddon = addOnFeatureIds.has(feature.id);
                                    return (
                                        <div key={feature.id}>
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    {isAddon && (
                                                        <Zap
                                                            size={10}
                                                            className="text-blue-400 flex-shrink-0"
                                                        />
                                                    )}
                                                    <span className="text-gray-300 text-xs truncate">
                                                        {feature.name}
                                                    </span>
                                                </div>
                                                <span className="text-gray-500 text-xs flex-shrink-0">
                                                    {limit !== null
                                                        ? `${total_usage} / ${limit.toLocaleString()}`
                                                        : `${total_usage} used`}
                                                </span>
                                            </div>
                                            {limit !== null && (
                                                <UsageBar used={total_usage} total={limit} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {sub.is_trial && (
                        <p className="text-gray-600 text-xs text-center">
                            Usage tracking is active during your trial period
                        </p>
                    )}

                    {/* <button className="flex items-center justify-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                        <SquareArrowOutUpRight size={15} /> View invoices
                    </button> */}
                </div>
            ) : (
                /* ── No Plan State ── */
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <CircleDollarSign className="text-primary" size={44} />
                    </div>
                    <h3 className="text-white font-medium text-lg">No Active Plan</h3>
                    <p className="text-gray-400 text-sm mt-1 mb-6 px-1 md:px-3">
                        Choose a subscription plan to unlock full calling features and scale your
                        business.
                    </p>
                    <DarkButton
                        className="w-full sm:w-auto px-8 bg-blue-500 text-white"
                        onClick={() => setIsBuyPlanDialogOpen(true)}
                    >
                        View Subscription Plans
                    </DarkButton>
                </div>
            )}

            {/* ── Dialogs ── */}
            {isPlanPresent && plan && sub && (
                <BillingDialog
                    open={isBillingDialogOpen}
                    setOpen={setIsBillingDialogOpen}
                    planId={plan.id}
                    subscriptionId={sub.id}
                    subscriptionStatus={sub.status}
                    plan={{
                        id: plan.id,
                        name: plan.name,
                        price: plan.price,
                        currency: plan.currency,
                        interval: plan.interval,
                        trial_period_days: plan.trial_period_days,
                        features_details: plan.features_details,
                        marketing_features: plan.marketing_features,
                    }}
                    activeAddOns={activeAddOnFeatures}
                    isTrialing={sub.is_trial}
                    isPaused={sub.status === "paused"}
                    cancel_at_period_end={sub.cancel_at_period_end}
                />
            )}

            <BuyPlanDialog
                open={isBuyPlanDialogOpen}
                setOpen={setIsBuyPlanDialogOpen}
                plans={plans || []}
            />
        </DarkCard>
    );
};

export default Billing;