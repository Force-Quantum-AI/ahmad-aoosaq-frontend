import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { User, Mail, Building2, Phone, Globe, MessageSquare, Send, CheckCircle2, Loader2 } from "lucide-react";
import Navbar from "@/Layout/Navbar";

// ─── Schema ────────────────────────────────────────────────────────────────────
const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    businessName: z.string().min(2, "Business name is required"),
    phone: z.string().optional(),
    website: z.string().url("Enter a valid URL (e.g. https://...)").optional().or(z.literal("")),
    needs: z.string().optional(),
});

type ContactFormInputs = z.infer<typeof contactSchema>;

// ─── Types for API integration ─────────────────────────────────────────────────
// When you're ready to wire up an API, call `submitContactForm(data)` inside onSubmit.
// The function signature and return type are defined here for easy integration.
export type ContactPayload = ContactFormInputs;
export type ContactResponse = { success: boolean; message?: string };

// Placeholder — replace with your real API call
async function submitContactForm(data: ContactPayload): Promise<ContactResponse> {
    // Example:
    // const res = await fetch("/api/contact", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data),
    // });
    // return res.json();

    // Simulated delay for now
    console.log(data);
    await new Promise((r) => setTimeout(r, 1500));
    return { success: true };
}

// ─── Dot grid background ───────────────────────────────────────────────────────
const DOTS = Array.from({ length: 280 }, () => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    opacity: Math.random() * 0.22 + 0.04,
}));

// ─── Reusable field wrapper ────────────────────────────────────────────────────
interface FieldProps {
    label: string;
    optional?: boolean;
    required?: boolean;
    error?: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const Field = ({ label, optional, required, error, icon, children }: FieldProps) => (
    <div className="flex flex-col gap-1.5">
        <label
            className="text-sm text-white/50"
            style={{ fontFamily: "Geist, sans-serif" }}
        >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
            {optional && (
                <span className="text-[#5a5a5a] ml-1 font-normal">(optional)</span>
            )}
        </label>
        <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#434343]">
                {icon}
            </span>
            {children}
        </div>
        {error && (
            <p className="text-red-400 text-[11px] ml-1" style={{ fontFamily: "Geist, sans-serif" }}>
                {error}
            </p>
        )}
    </div>
);

const inputClass =
    "w-full h-[52px] pl-10 pr-4 bg-black border border-white/30 rounded-[10px] text-[#c0c0c0] placeholder:text-white/30 text-sm focus:outline-none focus:border-white/60 transition-colors"
    + " " + "font-[Geist,sans-serif]";

// ─── Component ─────────────────────────────────────────────────────────────────
const ContactUs = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormInputs>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormInputs) => {
        setIsSubmitting(true);
        setServerError(null);
        try {
            const result = await submitContactForm(data);
            if (result.success) {
                setIsSuccess(true);
                reset();
            } else {
                setServerError(result.message ?? "Something went wrong. Please try again.");
            }
        } catch {
            setServerError("Network error. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className=" bg-[#0A0A0A] font-sans flex flex-col relative overflow-hidden ">
            <Navbar />
            {/* Dot grid */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {DOTS.map((dot, i) => (
                    <div
                        key={i}
                        className="absolute w-[3px] h-[3px] rounded-full bg-white"
                        style={{ top: dot.top, left: dot.left, opacity: dot.opacity }}
                    />
                ))}
            </div>

            {/* Page content */}
            <div className="relative z-10 flex flex-col min-h-screen px-6 md:px-[82px] py-20 max-w-5xl mx-auto w-full">

                {/* Logo */}
                {/* <div className="flex items-center gap-3 mb-14">
                    <div className="w-[48px] h-[48px] border border-white rounded-[10px] flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <polyline points="13,20 26,20 26,28" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                            <polyline points="21,28 21,36 34,36" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="text-white text-[22px] font-semibold tracking-tight" style={{ fontFamily: "Inter, sans-serif" }}>
                        Spontaine
                    </span>
                </div> */}

                {/* Heading */}
                <div className="mb-10">
                    {/* <p className="text-white/50 text-center text-sm font-semibold uppercase tracking-widest mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Get In Touch
                    </p> */}
                    <h1 className="text-white text-center text-[34px] font-bold leading-tight mb-3" style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>
                        Contact Us
                    </h1>
                    <p className="text-white/50 text-center text-sm leading-relaxed" style={{ fontFamily: "Geist, sans-serif" }}>
                        See how Spontaine can transform your customer communications. Fill out the form below and we'll be in touch shortly.
                    </p>
                </div>

                {/* Success state */}
                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-5 text-center">
                        <div className="w-16 h-16 rounded-full border border-[#43434380] flex items-center justify-center">
                            <CheckCircle2 size={32} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-white text-xl font-semibold mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                Message sent!
                            </h2>
                            <p className="text-[#434343] text-sm" style={{ fontFamily: "Geist, sans-serif" }}>
                                Thanks for reaching out. We'll get back to you shortly.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsSuccess(false)}
                            className="mt-4 text-[#9E9E9E] underline text-sm hover:text-white transition-colors cursor-pointer"
                            style={{ fontFamily: "Geist, sans-serif" }}
                        >
                            Send another message
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>

                        {/* Your Name */}
                        <Field label="Your Name" required error={errors.name?.message} icon={<User size={16} />}>
                            <input
                                type="text"
                                placeholder="John Smith"
                                {...register("name")}
                                className={inputClass}
                            />
                        </Field>

                        {/* Email */}
                        <Field label="Email Address" required error={errors.email?.message} icon={<Mail size={16} />}>
                            <input
                                type="email"
                                placeholder="john@company.com"
                                {...register("email")}
                                className={inputClass}
                            />
                        </Field>

                        {/* Business Name */}
                        <Field label="Business Name" required error={errors.businessName?.message} icon={<Building2 size={16} />}>
                            <input
                                type="text"
                                placeholder="Acme Inc."
                                {...register("businessName")}
                                className={inputClass}
                            />
                        </Field>

                        {/* Phone */}
                        <Field label="Phone Number" optional error={errors.phone?.message} icon={<Phone size={16} />}>
                            <input
                                type="tel"
                                placeholder="(555) 123-4567"
                                {...register("phone")}
                                className={inputClass}
                            />
                        </Field>

                        {/* Website */}
                        <Field label="Website" optional error={errors.website?.message} icon={<Globe size={16} />}>
                            <input
                                type="url"
                                placeholder="https://yourcompany.com"
                                {...register("website")}
                                className={inputClass}
                            />
                        </Field>

                        {/* Needs / message */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm text-white/50" style={{ fontFamily: "Geist, sans-serif" }}>
                                Tell us about your needs
                                <span className="text-[#5a5a5a] ml-1">(optional)</span>
                            </label>
                            <div className="relative">
                                <MessageSquare size={16} className="absolute left-4 top-4 text-white/50" />
                                <textarea
                                    rows={4}
                                    placeholder="What challenges are you looking to solve? How many calls does your business receive daily?"
                                    {...register("needs")}
                                    className="w-full pl-10 pr-4 pt-3.5 pb-3.5 bg-[#9E9E9E0D] border border-[#43434380] rounded-[10px] text-[#c0c0c0] placeholder:text-[#434343] text-sm focus:outline-none focus:border-[#6b6b6b] transition-colors resize-none"
                                    style={{ fontFamily: "Geist, sans-serif" }}
                                />
                            </div>
                        </div>

                        {/* Server error */}
                        {serverError && (
                            <p className="text-red-400 text-sm text-center" style={{ fontFamily: "Geist, sans-serif" }}>
                                {serverError}
                            </p>
                        )}

                        {/* Submit */}
                        <div className="mt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-[52px] bg-white rounded-[10px] text-black font-semibold text-base flex items-center justify-center gap-2 hover:bg-[#f0f0f0] transition-all group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{ fontFamily: "Geist, sans-serif" }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Sending…
                                    </>
                                ) : (
                                    <>
                                        Request Demo
                                        <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Disclaimer */}
                        <p className="text-center text-[#434343] text-xs mt-1" style={{ fontFamily: "Geist, sans-serif" }}>
                            By submitting, you agree to receive communications from Spontaine.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ContactUs;