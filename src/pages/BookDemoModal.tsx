// ─── BookDemoModal.tsx
import { useState, useMemo } from "react";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import {
    Clock, ChevronLeft, ChevronRight, Globe, CheckCircle2,
    Loader2, User, Mail, Phone, Building2, ChevronDown,
    X,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────────
interface BookDemoModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

type Step = "calendar" | "details" | "confirm" | "success";

interface TimeSlot {
    time: string;
    available: boolean;
}

interface BookingDetails {
    name: string;
    email: string;
    phone: string;
    company: string;
}

// ─── API stub ────────────────────────────────────────────────────────────────────
// Replace this with your real booking API call
export async function bookDemoApi(payload: {
    date: string;        // ISO date string e.g. "2026-02-18"
    time: string;        // e.g. "10:00 AM"
    timezone: string;
    details: BookingDetails;
}): Promise<{ success: boolean; bookingId?: string; message?: string }> {
    console.log("Booking payload:", payload);
    await new Promise((r) => setTimeout(r, 1600));
    return { success: true, bookingId: "DEMO-" + Math.random().toString(36).slice(2, 8).toUpperCase() };
}

// ─── Constants ───────────────────────────────────────────────────────────────────
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

// Dates that have available slots (day-of-month numbers, for demo purposes)
const AVAILABLE_DAYS = new Set([3, 4, 5, 10, 11, 12, 17, 18, 19, 24, 25, 26]);

const TIME_SLOTS: TimeSlot[] = [
    { time: "9:00 AM", available: true },
    { time: "9:30 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "10:30 AM", available: false },
    { time: "11:00 AM", available: true },
    { time: "11:30 AM", available: true },
    { time: "1:00 PM", available: true },
    { time: "1:30 PM", available: false },
    { time: "2:00 PM", available: true },
    { time: "2:30 PM", available: true },
    { time: "3:00 PM", available: true },
    { time: "3:30 PM", available: false },
    { time: "4:00 PM", available: true },
    { time: "4:30 PM", available: true },
];

const TIMEZONES = [
    "Baghdad, East Africa Time (UTC+3)",
    "London, GMT (UTC+0)",
    "New York, Eastern Time (UTC-5)",
    "Los Angeles, Pacific Time (UTC-8)",
    "Dubai, Gulf Standard Time (UTC+4)",
    "Singapore, SGT (UTC+8)",
    "Tokyo, JST (UTC+9)",
    "Sydney, AEST (UTC+10)",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

const inputClass =
    "w-full h-[46px] pl-9 pr-4 bg-white/5 border border-white/20 rounded-[8px] text-white/90 placeholder:text-white/40 text-sm focus:outline-none focus:border-white/50 transition-colors";

// ─── Sub-components ───────────────────────────────────────────────────────────────

// Left info panel
const InfoPanel = () => (
    <div className="flex flex-col justify-between h-full">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
            <div className="w-[38px] h-[38px] border border-white rounded-[8px] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
                    <polyline points="13,20 26,20 26,28" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="21,28 21,36 34,36" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <span className="text-white text-lg font-semibold tracking-tight" style={{ fontFamily: "Inter, sans-serif" }}>
                Spontaine
            </span>
        </div>

        {/* Content */}
        <div className="flex-1">
            <h2 className="text-white text-[22px] font-bold leading-snug mb-5"
                style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>
                Custom AI Receptionist Demo
                <span className="text-white/60"> (Built for Your Business)</span>
            </h2>

            <div className="flex items-center gap-2 mb-6">
                <Clock size={15} className="text-white/60" />
                <span className="text-white/60 text-sm" style={{ fontFamily: "Geist, sans-serif" }}>
                    30 min
                </span>
            </div>

            <div className="space-y-3 text-white/70 text-sm leading-relaxed" style={{ fontFamily: "Geist, sans-serif" }}>
                <p>
                    On this call, we will build a custom AI receptionist for your business
                    and let you hear it handle real customer inquiries live.
                </p>
                <p>
                    You will see how Spontaine answers calls, responds to pricing and
                    service questions, and books appointments directly into your booking
                    system.
                </p>
                <p>
                    By the end of the call, you will have a working demo tailored
                    specifically to your business.
                </p>
            </div>
        </div>

        {/* What to expect */}
        <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-white/50 text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "Geist, sans-serif" }}>
                What to Expect
            </p>
            {["Live AI demo tailored to your business", "Real-time Q&A session", "Custom pricing walkthrough"].map((item) => (
                <div key={item} className="flex items-start gap-2 mb-2">
                    <div className="w-1 h-1 rounded-full bg-white/50 mt-2 shrink-0" />
                    <span className="text-white/70 text-sm" style={{ fontFamily: "Geist, sans-serif" }}>{item}</span>
                </div>
            ))}
        </div>
    </div>
);

// ─── Calendar Step ────────────────────────────────────────────────────────────────
const CalendarStep = ({
    selectedDate, setSelectedDate,
    selectedTime, setSelectedTime,
    timezone, setTimezone,
    onNext,
}: {
    selectedDate: Date | null;
    setSelectedDate: (d: Date) => void;
    selectedTime: string | null;
    setSelectedTime: (t: string) => void;
    timezone: string;
    setTimezone: (t: string) => void;
    onNext: () => void;
}) => {
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [showTz, setShowTz] = useState(false);

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const cells = useMemo(() => {
        const arr: (number | null)[] = Array(firstDay).fill(null);
        for (let d = 1; d <= daysInMonth; d++) arr.push(d);
        return arr;
    }, [firstDay, daysInMonth]);

    const isSelected = (d: number) =>
        selectedDate?.getDate() === d &&
        selectedDate?.getMonth() === viewMonth &&
        selectedDate?.getFullYear() === viewYear;

    const isToday = (d: number) =>
        d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

    const isPast = (d: number) =>
        new Date(viewYear, viewMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

    return (
        <div className="flex flex-col flex-1">
            <h3 className="text-white text-lg font-semibold mb-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Select a Date &amp; Time
            </h3>

            {/* Calendar header */}
            <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer">
                    <ChevronLeft size={16} />
                </button>
                <span className="text-white text-sm font-semibold" style={{ fontFamily: "Geist, sans-serif" }}>
                    {MONTHS[viewMonth]} {viewYear}
                </span>
                <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded border border-white/20 text-white/60 hover:border-white hover:text-white transition-colors cursor-pointer">
                    <ChevronRight size={16} />
                </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
                {DAYS.map(d => (
                    <div key={d} className="text-center text-[10px] text-white/50 font-semibold py-1" style={{ fontFamily: "Geist, sans-serif" }}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-y-1 mb-6">
                {cells.map((day, i) => {
                    if (!day) return <div key={`empty-${i}`} />;
                    const available = AVAILABLE_DAYS.has(day) && !isPast(day);
                    const past = isPast(day);
                    const sel = isSelected(day);
                    const tod = isToday(day);
                    return (
                        <button
                            key={day}
                            disabled={!available}
                            onClick={() => {
                                setSelectedDate(new Date(viewYear, viewMonth, day));
                                setSelectedTime(null as unknown as string);
                            }}
                            className={[
                                "relative mx-auto w-8 h-8 rounded-full text-sm flex items-center justify-center transition-all cursor-pointer",
                                sel ? "bg-white text-black font-semibold" :
                                    available ? "text-white hover:bg-white/10" :
                                        past ? "text-white/30 cursor-not-allowed" :
                                            "text-white/40 cursor-not-allowed",
                                tod && !sel ? "border border-white/30" : "",
                            ].join(" ")}
                            style={{ fontFamily: "Geist, sans-serif" }}
                        >
                            {day}
                            {available && !sel && (
                                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/60" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Time slots */}
            {selectedDate && (
                <div className="mb-6">
                    <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3" style={{ fontFamily: "Geist, sans-serif" }}>
                        Available Times
                    </p>
                    <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {TIME_SLOTS.map(slot => (
                            <button
                                key={slot.time}
                                disabled={!slot.available}
                                onClick={() => setSelectedTime(slot.time)}
                                className={[
                                    "h-9 rounded-[8px] text-xs font-medium transition-all cursor-pointer border",
                                    selectedTime === slot.time
                                        ? "bg-white text-black border-white"
                                        : slot.available
                                            ? "border-white/20 text-white/80 hover:border-white hover:text-white hover:bg-white/5"
                                            : "border-white/5 text-white/30 cursor-not-allowed",
                                ].join(" ")}
                                style={{ fontFamily: "Geist, sans-serif" }}
                            >
                                {slot.time}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Timezone */}
            <div className="mb-6 relative">
                <p className="text-white/60 text-xs mb-2" style={{ fontFamily: "Geist, sans-serif" }}>Time zone</p>
                <button
                    onClick={() => setShowTz(!showTz)}
                    className="flex items-center gap-2 text-white/80 text-sm hover:text-white transition-colors cursor-pointer"
                    style={{ fontFamily: "Geist, sans-serif" }}
                >
                    <Globe size={14} />
                    <span className="truncate max-w-[200px]">{timezone}</span>
                    <ChevronDown size={14} className={`transition-transform ${showTz ? "rotate-180" : ""}`} />
                </button>
                {showTz && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-[#111] border border-white/10 rounded-[8px] z-50 overflow-hidden shadow-xl">
                        {TIMEZONES.map(tz => (
                            <button
                                key={tz}
                                onClick={() => { setTimezone(tz); setShowTz(false); }}
                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 transition-colors cursor-pointer ${tz === timezone ? "text-white font-medium" : "text-white/70"}`}
                                style={{ fontFamily: "Geist, sans-serif" }}
                            >
                                {tz}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Next */}
            <div className="mt-auto pt-4">
                <button
                    onClick={onNext}
                    disabled={!selectedDate || !selectedTime}
                    className="w-full h-[46px] bg-white rounded-[10px] text-black font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#f0f0f0] transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    style={{ fontFamily: "Geist, sans-serif" }}
                >
                    Continue
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

// ─── Details Step ─────────────────────────────────────────────────────────────────
const DetailsStep = ({
    details, setDetails, onNext, onBack,
}: {
    details: BookingDetails;
    setDetails: (d: BookingDetails) => void;
    onNext: () => void;
    onBack: () => void;
}) => {
    const [errors, setErrors] = useState<Partial<BookingDetails>>({});

    const validate = () => {
        const e: Partial<BookingDetails> = {};
        if (!details.name.trim()) e.name = "Name is required";
        if (!details.email.trim() || !/\S+@\S+\.\S+/.test(details.email)) e.email = "Valid email required";
        if (!details.company.trim()) e.company = "Company is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const fields: { key: keyof BookingDetails; label: string; type: string; placeholder: string; icon: React.ReactNode; required?: boolean }[] = [
        { key: "name", label: "Your Name", type: "text", placeholder: "John Smith", icon: <User size={15} />, required: true },
        { key: "email", label: "Email Address", type: "email", placeholder: "john@company.com", icon: <Mail size={15} />, required: true },
        { key: "company", label: "Company Name", type: "text", placeholder: "Acme Inc.", icon: <Building2 size={15} />, required: true },
        { key: "phone", label: "Phone Number", type: "tel", placeholder: "(555) 123-4567", icon: <Phone size={15} /> },
    ];

    return (
        <div className="flex flex-col flex-1">
            <button onClick={onBack} className="flex items-center gap-1 text-white/60 hover:text-white text-sm mb-5 transition-colors cursor-pointer w-fit"
                style={{ fontFamily: "Geist, sans-serif" }}>
                <ChevronLeft size={15} /> Back
            </button>

            <h3 className="text-white text-lg font-semibold mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Your Details
            </h3>
            <p className="text-white/60 text-sm mb-6" style={{ fontFamily: "Geist, sans-serif" }}>
                We'll use this to send you a calendar invite and meeting link.
            </p>

            <div className="flex flex-col gap-4">
                {fields.map(f => (
                    <div key={f.key}>
                        <label className="text-sm text-white/70 block mb-1.5" style={{ fontFamily: "Geist, sans-serif" }}>
                            {f.label}{f.required && <span className="text-red-500 ml-0.5">*</span>}
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">{f.icon}</span>
                            <input
                                type={f.type}
                                placeholder={f.placeholder}
                                value={details[f.key]}
                                onChange={e => setDetails({ ...details, [f.key]: e.target.value })}
                                className={inputClass}
                                style={{ fontFamily: "Geist, sans-serif" }}
                            />
                        </div>
                        {errors[f.key] && (
                            <p className="text-red-400 text-[11px] mt-1 ml-1" style={{ fontFamily: "Geist, sans-serif" }}>{errors[f.key]}</p>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-auto pt-8">
                <button
                    onClick={() => { if (validate()) onNext(); }}
                    className="w-full h-[46px] bg-white rounded-[10px] text-black font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#f0f0f0] transition-all cursor-pointer"
                    style={{ fontFamily: "Geist, sans-serif" }}
                >
                    Review Booking
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

// ─── Confirm Step ─────────────────────────────────────────────────────────────────
const ConfirmStep = ({
    selectedDate, selectedTime, timezone, details,
    onConfirm, onBack, isSubmitting,
}: {
    selectedDate: Date;
    selectedTime: string;
    timezone: string;
    details: BookingDetails;
    onConfirm: () => void;
    onBack: () => void;
    isSubmitting: boolean;
}) => {
    const rows = [
        { label: "Date", value: selectedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
        { label: "Time", value: selectedTime },
        { label: "Duration", value: "30 minutes" },
        { label: "Time zone", value: timezone },
        { label: "Name", value: details.name },
        { label: "Email", value: details.email },
        { label: "Company", value: details.company },
        ...(details.phone ? [{ label: "Phone", value: details.phone }] : []),
    ];

    return (
        <div className="flex flex-col flex-1">
            <button onClick={onBack} className="flex items-center gap-1 text-white/60 hover:text-white text-sm mb-5 transition-colors cursor-pointer w-fit"
                style={{ fontFamily: "Geist, sans-serif" }}>
                <ChevronLeft size={15} /> Back
            </button>

            <h3 className="text-white text-lg font-semibold mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Confirm Booking
            </h3>
            <p className="text-white/60 text-sm mb-6" style={{ fontFamily: "Geist, sans-serif" }}>
                Please review your booking details before confirming.
            </p>

            <div className="flex flex-col gap-3">
                {rows.map(r => (
                    <div key={r.label} className="flex justify-between gap-4 py-2.5 border-b border-white/10">
                        <span className="text-white/60 text-sm shrink-0" style={{ fontFamily: "Geist, sans-serif" }}>{r.label}</span>
                        <span className="text-white/90 text-sm text-right font-medium" style={{ fontFamily: "Geist, sans-serif" }}>{r.value}</span>
                    </div>
                ))}
            </div>

            <div className="mt-auto pt-8">
                <button
                    onClick={onConfirm}
                    disabled={isSubmitting}
                    className="w-full h-[46px] bg-white rounded-[10px] text-black font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#f0f0f0] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    style={{ fontFamily: "Geist, sans-serif" }}
                >
                    {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Booking…</> : "Confirm Booking"}
                </button>
                <p className="text-white/50 text-xs text-center mt-3" style={{ fontFamily: "Geist, sans-serif" }}>
                    A calendar invite will be sent to <span className="text-white/80">{details.email}</span>
                </p>
            </div>
        </div>
    );
};

// ─── Success Step ─────────────────────────────────────────────────────────────────
const SuccessStep = ({ bookingId, details, selectedDate, selectedTime, onClose }: {
    bookingId: string;
    details: BookingDetails;
    selectedDate: Date;
    selectedTime: string;
    onClose: () => void;
}) => (
    <div className="flex flex-col items-center justify-center h-full text-center py-8 gap-5 min-h-[350px]">
        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center">
            <CheckCircle2 size={30} className="text-white" />
        </div>
        <div>
            <h3 className="text-white text-xl font-bold mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                You're booked!
            </h3>
            <p className="text-white/70 text-sm mb-1" style={{ fontFamily: "Geist, sans-serif" }}>
                {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at {selectedTime}
            </p>
            <p className="text-white/70 text-sm" style={{ fontFamily: "Geist, sans-serif" }}>
                A calendar invite has been sent to <span className="text-white font-medium">{details.email}</span>
            </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-[8px] px-5 py-3 text-center">
            <p className="text-white/60 text-xs mb-0.5" style={{ fontFamily: "Geist, sans-serif" }}>Booking ID</p>
            <p className="text-white font-mono text-sm font-semibold">{bookingId}</p>
        </div>
        <button
            onClick={onClose}
            className="mt-4 w-full h-[46px] bg-white rounded-[10px] text-black font-semibold text-sm hover:bg-[#f0f0f0] transition-all cursor-pointer"
            style={{ fontFamily: "Geist, sans-serif" }}
        >
            Close
        </button>
    </div>
);

// ─── Main Modal ───────────────────────────────────────────────────────────────────
export const BookDemoModal = ({ open, setOpen }: BookDemoModalProps) => {
    const [step, setStep] = useState<Step>("calendar");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [timezone, setTimezone] = useState(TIMEZONES[0]);
    const [details, setDetails] = useState<BookingDetails>({ name: "", email: "", phone: "", company: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingId, setBookingId] = useState("");
    const [serverError, setServerError] = useState<string | null>(null);

    const resetAndClose = () => {
        setOpen(false);
        setTimeout(() => {
            setStep("calendar");
            setSelectedDate(null);
            setSelectedTime(null);
            setDetails({ name: "", email: "", phone: "", company: "" });
            setBookingId("");
            setServerError(null);
        }, 300);
    };

    const handleConfirm = async () => {
        if (!selectedDate || !selectedTime) return;
        setIsSubmitting(true);
        setServerError(null);
        try {
            const result = await bookDemoApi({
                date: selectedDate.toISOString().split("T")[0],
                time: selectedTime,
                timezone,
                details,
            });
            if (result.success && result.bookingId) {
                setBookingId(result.bookingId);
                setStep("success");
            } else {
                setServerError(result.message ?? "Something went wrong. Please try again.");
            }
        } catch {
            setServerError("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const stepIndicators: Step[] = ["calendar", "details", "confirm"];
    const currentStepIndex = stepIndicators.indexOf(step as Step);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="p-0 border-0 overflow-hidden max-w-7xl! h-[90vh]! w-full rounded-[16px] bg-transparent shadow-2xl"
                style={{ maxHeight: "98vh" }}
            >
                <DialogClose asChild>
                    <button className="absolute top-4 right-4 z-10 text-white/60 hover:text-white">
                        <X size={20} />
                    </button>
                </DialogClose>
                <div className="flex h-full overflow-hidden rounded-[16px]">

                    {/* ── Left Panel ─────────────────────────────────── */}
                    <div className="hidden md:flex flex-col w-[380px] shrink-0 bg-[#0A0A0A] border-r border-[#1a1a1a] p-8  relative">
                        {/* Dot grid */}
                        {Array.from({ length: 60 }, (_, i) => (
                            <div key={i} className="absolute w-[2px] h-[2px] rounded-full bg-white"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    opacity: Math.random() * 0.15 + 0.03,
                                }} />
                        ))}
                        <div className="relative z-10 h-full">
                            <InfoPanel />
                        </div>
                    </div>

                    {/* ── Right Panel ────────────────────────────────── */}
                    <div className="flex flex-col flex-1 bg-[#0d0d0d] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <div className="p-7 min-h-full flex flex-col">

                            {/* Step progress — only show on calendar/details/confirm */}
                            {step !== "success" && (
                                <div className="flex items-center gap-2 mb-7 shrink-0">
                                    {stepIndicators.map((s, i) => (
                                        <div key={s} className="flex items-center gap-2">
                                            <div className={[
                                                "w-2 h-2 rounded-full transition-all",
                                                i < currentStepIndex ? "bg-white" :
                                                    i === currentStepIndex ? "bg-white scale-125" :
                                                        "bg-white/20",
                                            ].join(" ")} />
                                            {i < stepIndicators.length - 1 && (
                                                <div className={`h-px w-8 transition-all ${i < currentStepIndex ? "bg-white" : "bg-white/20"}`} />
                                            )}
                                        </div>
                                    ))}
                                    <span className="text-white/50 text-xs ml-2" style={{ fontFamily: "Geist, sans-serif" }}>
                                        Step {currentStepIndex + 1} of 3
                                    </span>
                                </div>
                            )}

                            {serverError && (
                                <p className="text-red-400 text-sm mb-4 text-center shrink-0" style={{ fontFamily: "Geist, sans-serif" }}>{serverError}</p>
                            )}

                            {/* Steps */}
                            {step === "calendar" && (
                                <CalendarStep
                                    selectedDate={selectedDate}
                                    setSelectedDate={setSelectedDate}
                                    selectedTime={selectedTime}
                                    setSelectedTime={setSelectedTime}
                                    timezone={timezone}
                                    setTimezone={setTimezone}
                                    onNext={() => setStep("details")}
                                />
                            )}
                            {step === "details" && (
                                <DetailsStep
                                    details={details}
                                    setDetails={setDetails}
                                    onNext={() => setStep("confirm")}
                                    onBack={() => setStep("calendar")}
                                />
                            )}
                            {step === "confirm" && selectedDate && selectedTime && (
                                <ConfirmStep
                                    selectedDate={selectedDate}
                                    selectedTime={selectedTime}
                                    timezone={timezone}
                                    details={details}
                                    onConfirm={handleConfirm}
                                    onBack={() => setStep("details")}
                                    isSubmitting={isSubmitting}
                                />
                            )}
                            {step === "success" && selectedDate && selectedTime && (
                                <SuccessStep
                                    bookingId={bookingId}
                                    details={details}
                                    selectedDate={selectedDate}
                                    selectedTime={selectedTime}
                                    onClose={resetAndClose}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BookDemoModal;