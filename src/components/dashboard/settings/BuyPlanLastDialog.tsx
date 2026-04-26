import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Check,
    Loader2,
    Plus,
    Sparkles,
    ShieldCheck,
    ExternalLink,
    FlaskConical,
} from "lucide-react";
import { useGetFinalPlanModalInfoQuery, useCreateSubscriptionMutation } from "@/store/features/subscription/subscription.api";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeatureDetail {
    id: number;
    name: string;
    feature_identifier: string;
    description: string;
    have_limit: boolean;
    value: number;
    overage_price: string;
    price: string;
    currency: string;
    interval: string;
    marketing_features: string[];
    active: boolean;
    stripe_product_id: string;
    stripe_price_id: string;
}

interface Plan {
    id: number;
    name: string;
    price: string;
    currency: string;
    interval: string;
    trial_period_days: number;
    marketing_features: string[];
    features_details: FeatureDetail[];
}

interface EligibleData {
    is_eligible_for_trial: boolean;
    features: FeatureDetail[];
}

interface PlanDetailsDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    plan: Plan | null;
    onBack: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (price: string | number, currency = "usd") =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.toUpperCase(),
        minimumFractionDigits: 0,
    }).format(Number(price));


// ─── Sub-components ───────────────────────────────────────────────────────────

const TrialToggle = ({
    eligible,
    active,
    onChange,
    trialDays,
}: {
    eligible: boolean;
    active: boolean;
    onChange: (v: boolean) => void;
    trialDays: number;
}) => (
    <div
        className={cn(
            "flex items-center justify-between rounded-2xl border p-4 transition-all duration-300",
            eligible
                ? active
                    ? "border-yellow-500/40 bg-yellow-500/8"
                    : "border-white/10 bg-white/4 hover:border-white/20"
                : "border-white/6 bg-white/2 opacity-50 cursor-not-allowed"
        )}
    >
        <div className="flex items-center gap-3">
            <div
                className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center",
                    active ? "bg-yellow-500/20" : "bg-white/8"
                )}
            >
                <FlaskConical
                    size={17}
                    className={active ? "text-yellow-400" : "text-gray-400"}
                />
            </div>
            <div>
                <p className="text-sm font-medium text-white">
                    {trialDays}-Day Free Trial
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                    {eligible
                        ? "Try all plan features at no cost"
                        : "You've already used your free trial"}
                </p>
            </div>
        </div>

        {/* Toggle pill */}
        <button
            disabled={!eligible}
            onClick={() => eligible && onChange(!active)}
            className={cn(
                "relative w-12 h-6 rounded-full transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50",
                active ? "bg-yellow-500" : "bg-white/15",
                !eligible && "pointer-events-none"
            )}
            aria-label="Toggle free trial"
        >
            <span
                className={cn(
                    "absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-transform duration-300",
                    active && "translate-x-6"
                )}
            />
        </button>
    </div>
);

const FeatureCheckbox = ({
    feature,
    checked,
    onChange,
    disabled,
}: {
    feature: FeatureDetail;
    checked: boolean;
    onChange: (v: boolean) => void;
    disabled: boolean;
}) => (
    <button
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
            "w-full flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200",
            checked && !disabled
                ? "border-blue-500/40 bg-blue-500/8"
                : "border-white/8 bg-white/3",
            disabled && "opacity-40 cursor-not-allowed",
            !disabled && !checked && "hover:border-white/18 hover:bg-white/5"
        )}
    >
        {/* Checkbox circle */}
        <span
            className={cn(
                "mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150",
                checked && !disabled
                    ? "bg-blue-500 border-blue-500"
                    : "border-white/25 bg-transparent"
            )}
        >
            {checked && !disabled && <Check size={11} strokeWidth={3} className="text-white" />}
        </span>

        <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-white leading-tight">{feature.name}</p>
                <span className="text-sm font-semibold text-white whitespace-nowrap">
                    {fmt(feature.price, feature.currency)}
                    <span className="text-gray-500 font-normal text-xs">/{feature.interval}</span>
                </span>
            </div>
            {feature.have_limit && (
                <p className="text-xs text-gray-500 mt-1">
                    {feature.value} calls included ·{" "}
                    <span className="text-gray-400">
                        {fmt(feature.overage_price, feature.currency)}/call after
                    </span>
                </p>
            )}
        </div>
    </button>
);

const PriceRow = ({
    label,
    price,
    currency = "usd",
    muted = false,
    highlight = false,
}: {
    label: string;
    price: number;
    currency?: string;
    muted?: boolean;
    highlight?: boolean;
}) => (
    <div className={cn("flex justify-between items-center text-sm", muted && "opacity-60")}>
        <span className={highlight ? "text-white font-medium" : "text-gray-400"}>{label}</span>
        <span className={highlight ? "text-white font-bold text-base" : "text-gray-300"}>
            {fmt(price, currency)}
        </span>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const BuyPlanLastDialog = ({
    open,
    setOpen,
    plan,
    onBack,
}: PlanDetailsDialogProps) => {
    const [isTrial, setIsTrial] = useState(false);
    const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Reset state when plan changes
    useEffect(() => {
        setIsTrial(false);
        setSelectedAddons([]);
        setIsRedirecting(false);
    }, [plan?.id]);

    const { data: eligibleResponse, isLoading } = useGetFinalPlanModalInfoQuery(
        {
            eligible_for: "plan",
            id: plan?.id ?? 0,
        },
        { skip: !plan || !open }
    );

    const [createSubscription, { isLoading: isCreating }] = useCreateSubscriptionMutation();

    const eligibleData: EligibleData | undefined = eligibleResponse?.data;
    const addableFeatures = eligibleData?.features ?? [];

    // When user enables trial → clear add-ons
    const handleTrialChange = (val: boolean) => {
        setIsTrial(val);
        if (val) setSelectedAddons([]);
    };

    const toggleAddon = (id: number) => {
        setSelectedAddons((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    // ── Price summary ────────────────────────────────────────────────────────

    const basePlanPrice = parseFloat(plan?.price ?? "0");
    const currency = plan?.currency ?? "usd";

    const selectedAddonObjects = addableFeatures.filter((f) =>
        selectedAddons.includes(f.id)
    );

    const addonTotal = selectedAddonObjects.reduce(
        (acc, f) => acc + parseFloat(f.price),
        0
    );

    const grandTotal = isTrial ? 0 : basePlanPrice + addonTotal;

    // ── Existing plan features (for summary panel) ───────────────────────────

    const existingFeatures = plan?.features_details ?? [];

    // ── Submit ────────────────────────────────────────────────────────────────

    const handleBuyNow = async () => {
        if (!plan) return;
        try {
            setIsRedirecting(false);
            const result = await createSubscription({
                success_url: `${window.location.origin}/dashboard/settings`,
                cancel_url: `${window.location.origin}/dashboard/settings`,
                provider: "stripe",
                plan: plan.id,
                add_ons: selectedAddons,
                is_trial: isTrial,
            }).unwrap();

            if (result?.data?.session_url) {
                setIsRedirecting(true);
                window.open(result.data.session_url, "_blank");
                setTimeout(() => {
                    setOpen(false);
                    setIsRedirecting(false);
                }, 1500);
            }else{
                toast.error("Failed to create subscription");
            }
        } catch (err) {
            console.error("Subscription error:", err);
            toast.error("Failed to create subscription");
        }
    };

    if (!plan) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-4xl! mx-2 md:mx-0 bg-gray-900 border border-white/8 text-white max-h-[92vh] overflow-y-auto p-0">
                {/* ── Header ── */}
                <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-white/8 px-6 py-4 flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/25 transition-all"
                    >
                        <ArrowLeft size={15} />
                    </button>
                    <DialogHeader className="flex-1">
                        <DialogTitle className="text-base font-semibold capitalize text-white text-left">
                            Configure{" "}
                            <span className="text-blue-400">{plan.name}</span> Plan
                        </DialogTitle>
                    </DialogHeader>
                    <Badge className="bg-white/8 text-gray-300 border-white/10 font-mono text-xs">
                        {fmt(plan.price, currency)}/{plan.interval}
                    </Badge>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <Loader2 size={28} className="animate-spin text-blue-400" />
                        <p className="text-gray-500 text-sm">Loading plan options…</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-0 divide-y lg:divide-y-0 lg:divide-x divide-white/8">

                        {/* ── Left: Configuration ── */}
                        <div className="p-6 space-y-6">

                            {/* Trial toggle */}
                            <section>
                                <p className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-medium">
                                    Trial Option
                                </p>
                                <TrialToggle
                                    eligible={eligibleData?.is_eligible_for_trial ?? false}
                                    active={isTrial}
                                    onChange={handleTrialChange}
                                    trialDays={plan.trial_period_days ?? 7}
                                />
                                {isTrial && (
                                    <p className="text-xs text-yellow-500/80 mt-2 pl-1 flex items-center gap-1.5">
                                        <Sparkles size={11} />
                                        Add-ons are unavailable during the free trial period.
                                    </p>
                                )}
                            </section>

                            {/* Add-on features */}
                            <section>
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">
                                        Add-On Features
                                    </p>
                                    {selectedAddons.length > 0 && !isTrial && (
                                        <span className="text-xs bg-blue-500/15 text-blue-400 border border-blue-500/25 px-2 py-0.5 rounded-full">
                                            {selectedAddons.length} selected
                                        </span>
                                    )}
                                </div>

                                {addableFeatures.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 rounded-2xl border border-dashed border-white/8 text-center">
                                        <ShieldCheck size={22} className="text-gray-600 mb-2" />
                                        <p className="text-sm text-gray-500">
                                            Your plan already includes all available features.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {addableFeatures.map((feature) => (
                                            <FeatureCheckbox
                                                key={feature.id}
                                                feature={feature}
                                                checked={selectedAddons.includes(feature.id)}
                                                onChange={() => toggleAddon(feature.id)}
                                                disabled={isTrial}
                                            />
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* ── Right: Price Summary ── */}
                        <div className="p-6 flex flex-col gap-5">
                            <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">
                                Order Summary
                            </p>

                            {/* Features list */}
                            <div className="space-y-1.5">
                                <p className="text-xs text-gray-600 mb-2">Included in plan</p>
                                {existingFeatures.map((f) => (
                                    <div key={f.id} className="flex items-center gap-2 text-xs text-gray-400">
                                        <Check size={11} className="text-green-500 flex-shrink-0" />
                                        <span className="truncate">{f.name}</span>
                                        {f.have_limit && (
                                            <span className="ml-auto text-gray-600 whitespace-nowrap">
                                                {f.value} calls
                                            </span>
                                        )}
                                    </div>
                                ))}

                                {selectedAddonObjects.length > 0 && !isTrial && (
                                    <>
                                        <p className="text-xs text-gray-600 mt-3 mb-2">
                                            Add-ons
                                        </p>
                                        {selectedAddonObjects.map((f) => (
                                            <div
                                                key={f.id}
                                                className="flex items-center gap-2 text-xs text-blue-400"
                                            >
                                                <Plus size={11} className="flex-shrink-0" />
                                                <span className="truncate">{f.name}</span>
                                                <span className="ml-auto whitespace-nowrap text-gray-400">
                                                    {fmt(f.price, f.currency)}
                                                </span>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="border-t border-white/8" />

                            {/* Pricing breakdown */}
                            <div className="space-y-2">
                                {isTrial ? (
                                    <>
                                        <PriceRow
                                            label={`${plan.name} Plan`}
                                            price={basePlanPrice}
                                            currency={currency}
                                            muted
                                        />
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-yellow-400 flex items-center gap-1.5">
                                                <FlaskConical size={12} />
                                                {plan.trial_period_days}-day trial discount
                                            </span>
                                            <span className="text-yellow-400">
                                                −{fmt(basePlanPrice, currency)}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <PriceRow
                                            label={`${plan.name} Plan`}
                                            price={basePlanPrice}
                                            currency={currency}
                                        />
                                        {selectedAddonObjects.map((f) => (
                                            <PriceRow
                                                key={f.id}
                                                label={f.name}
                                                price={parseFloat(f.price)}
                                                currency={currency}
                                            />
                                        ))}
                                    </>
                                )}
                            </div>

                            {/* Total */}
                            <div className="border-t border-white/8 pt-3">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-0.5">
                                            {isTrial ? "Due today" : `Billed /${plan.interval}`}
                                        </p>
                                        <span className="text-2xl font-bold text-white">
                                            {isTrial ? "Free" : fmt(grandTotal, currency)}
                                        </span>
                                    </div>
                                    {isTrial && (
                                        <span className="text-xs text-gray-500 text-right">
                                            then {fmt(basePlanPrice, currency)}/{plan.interval}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Buy / Trial button */}
                            <Button
                                onClick={handleBuyNow}
                                disabled={isCreating || isRedirecting}
                                className={cn(
                                    "w-full h-11 font-semibold text-sm rounded-xl transition-all duration-200",
                                    isTrial
                                        ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                                        : "bg-blue-600 hover:bg-blue-500 text-white"
                                )}
                            >
                                {isCreating || isRedirecting ? (
                                    <>
                                        <Loader2 size={15} className="animate-spin mr-2" />
                                        {isRedirecting ? "Redirecting…" : "Processing…"}
                                    </>
                                ) : isTrial ? (
                                    <>
                                        <FlaskConical size={15} className="mr-2" />
                                        Start Free Trial
                                    </>
                                ) : (
                                    <>
                                        <ExternalLink size={15} className="mr-2" />
                                        Buy Now
                                    </>
                                )}
                            </Button>

                            <p className="text-xs text-gray-600 text-center leading-relaxed">
                                Powered by Stripe · Secure checkout
                            </p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default BuyPlanLastDialog;