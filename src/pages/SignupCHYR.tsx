import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setUser } from "@/store/features/auth/auth.slice";
import { useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { STARS, starStyle } from "./CreateAgent";
import BookingHeroComponent from "@/components/BookingHeroComponent";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useGetOTPMutation, useRegisterClientMutation } from "@/store/features/auth/auth.api";
import { toast } from "react-toastify";
import { AVRIANCEIcon, CHYRIcon, NOHMIcon } from "@/assets/logo/BrandLogoNew";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const loginSchema = z.object({
    firstName: z.string().min(3, "Name must be at least 3 characters"),
    lastName: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const SignupCHYR = () => {
    const { projectName } = useAppSelector((state) => state.projectIdentifier);
    const [registerClient, { isLoading }] = useRegisterClientMutation();
    const [getOTP, { data: otpResponse, isLoading: isGetOTP }] = useGetOTPMutation();
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
    const {
        register,
        handleSubmit,
        trigger,
        getValues,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // const onSubmit = (data: LoginFormInputs) => {
    //     console.log("submitting data are:", data);

    //     registerClient(data).unwrap().then(() => {
    //         dispatch(setUser(data));
    //         navigate("/login");
    //     }).catch((error) => {
    //         console.log(error);
    //         toast.error("Registration failed");
    //         // toast.error(error.data.message);
    //     })
    // };
    const handleGetOtp = async () => {
        console.log("clicked");
        if (getValues("password").length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        const isValid = await trigger();
        if (isValid) {
            const email = getValues("email");
            getOTP(email).unwrap().then(() => {
                toast.success(otpResponse?.message);
                setOpen(true);
            }).catch((error) => {
                console.log(error);
                toast.error("Failed to send OTP");
            });
        }
    };

    const onSubmit = (data: LoginFormInputs) => {
        const finalOtp = otpValues.join("");
        if (finalOtp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }
        const submitData = { ...data, otp: finalOtp };
        registerClient(submitData)
            .unwrap()
            .then(() => {
                setOpen(false);
                dispatch(setUser(submitData));
                toast.success("Registration successful");
                navigate("/login");
            })
            .catch(() => {
                toast.error("Registration failed");
            });
    };

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            delay: 200
        });
        AOS.refresh();
    }, []);

    return (
        <div className="flex bg-black font-sans w-full h-screen">
            {STARS.map((star, i) => (
                <div
                    key={i}
                    className={`absolute ${star.size} bg-white animate-pulse opacity-80`}
                    style={{ ...star, ...starStyle }}
                />
            ))}
            {/* left Section - Login Form */}
            <div data-aos="fade-left" className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-10 relative">
                <div className="relative z-10 flex flex-col justify-center min-h-screen px-6 md:px-[82px] py-10 max-w-[542px] mx-auto w-full">

                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-14 hover:cursor-pointer" onClick={() => navigate("/")}>
                        <span className="text-white text-[22px] font-semibold tracking-tight" style={{ fontFamily: "Inter, sans-serif" }}>
                            {projectName === "CHYR" ? <CHYRIcon /> : projectName === "AVRIANCE" ? <AVRIANCEIcon /> : <NOHMIcon />}
                        </span>
                    </div>

                    {/* Heading */}
                    <div className="mb-10">
                        <p
                            className="text-[#434343] text-sm font-semibold uppercase tracking-widest mb-4"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            GET STATTED
                        </p>
                        <h1
                            className="text-white text-[34px] font-bold leading-tight mb-3"
                            style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}
                        >
                            Create your account
                        </h1>
                        <p className="text-[#434343] text-sm" style={{ fontFamily: "Geist, sans-serif" }}>
                            Already have one?{" "}
                            <Link
                                to="/login"
                                className="text-[#9E9E9E] font-semibold underline hover:text-white transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={(e) => { e.preventDefault(); handleGetOtp(); }} className="flex flex-col gap-4">

                        {/* Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="First name"
                                    {...register("firstName")}
                                    className="w-full h-[58px] px-[28px] bg-black border border-[#43434380] rounded-[10px] text-white placeholder:text-[#434343] text-sm focus:outline-none focus:border-white transition-colors"
                                    style={{ fontFamily: "Geist, sans-serif" }}
                                />
                                {errors.firstName && (
                                    <p className="text-red-400 text-[11px] mt-1 ml-1 absolute">{errors.firstName.message}</p>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    {...register("lastName")}
                                    className="w-full h-[58px] px-[28px] bg-black border border-[#43434380] rounded-[10px] text-white placeholder:text-[#434343] text-sm focus:outline-none focus:border-white transition-colors"
                                    style={{ fontFamily: "Geist, sans-serif" }}
                                />
                                {errors.lastName && (
                                    <p className="text-red-400 text-[11px] mt-1 ml-1 absolute">{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>
                        {/* Email */}
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Work email"
                                {...register("email")}
                                className="w-full h-[58px] px-[28px] bg-black! border border-[#43434380] rounded-[10px] text-white placeholder:text-[#434343] text-sm focus:outline-none focus:border-white transition-colors"
                                style={{ fontFamily: "Geist, sans-serif" }}
                            />
                            {errors.email && (
                                <p className="text-red-400 text-[11px] mt-1 ml-1 absolute">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    {...register("password")}
                                    minLength={8}
                                    className="w-full h-[58px] px-[28px] pr-12 bg-black border border-[#43434380] rounded-[10px] text-white placeholder:text-[#434343] text-sm focus:outline-none focus:border-white transition-colors"
                                    style={{ fontFamily: "Geist, sans-serif" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#434343] hover:text-white transition-colors cursor-pointer"
                                >
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-[11px] mt-1 ml-1 absolute">{errors.password.message}</p>
                            )}
                            {/* <div className="flex justify-end mt-2">
                                <Link
                                    to="#"
                                    className="text-[#9E9E9E] text-xs font-semibold underline hover:text-white transition-colors"
                                    style={{ fontFamily: "Geist, sans-serif" }}
                                >
                                    Forgot password?
                                </Link>
                            </div> */}
                        </div>

                        {/* Submit */}
                        <div className="mt-2">
                            <button
                                type="button"
                                onClick={handleGetOtp}
                                disabled={isGetOTP}
                                className="w-full h-[52px] bg-white rounded-[10px] text-black font-semibold text-base flex items-center justify-center gap-2 hover:bg-[#f0f0f0] transition-all group cursor-pointer disabled:opacity-50"
                                style={{ fontFamily: "Geist, sans-serif" }}
                            >
                                {isGetOTP ? <Loader2 size={18} className="animate-spin" /> : "Sign up"}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* OR Divider */}
                        <div className="flex items-center gap-4 my-2">
                            <div className="flex-1 h-px bg-[#434343]" />
                            <span
                                className="text-[#9E9E9E] text-sm"
                                style={{ fontFamily: "Geist, sans-serif" }}
                            >
                                OR
                            </span>
                            <div className="flex-1 h-px bg-[#434343]" />
                        </div>

                        {/* Google */}
                        <button
                            type="button"
                            className="w-full h-[52px] border border-[#434343] rounded-[10px] flex items-center justify-center gap-3 text-[#9E9E9E] font-semibold text-base hover:border-white hover:text-white transition-all cursor-pointer"
                            style={{ fontFamily: "Geist, sans-serif" }}
                        >
                            <FcGoogle size={22} />
                            Continue with Google
                        </button>
                    </form>

                    {/* Footer */}
                    <p
                        className="text-[#434343] text-sm mt-10"
                        style={{ fontFamily: "Geist, sans-serif" }}
                    >
                        By signing in you agree to our{" "}
                        <Link to="#" className="text-[#9E9E9E] font-semibold underline hover:text-white transition-colors">
                            Terms
                        </Link>{" "}
                        and{" "}
                        <Link to="#" className="text-[#9E9E9E] font-semibold underline hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
            <div className="w-full md:w-1/2 hidden md:flex justify-center items-center">
                <div className="w-full min-h-[80vh]">
                    <BookingHeroComponent />
                </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-black border border-[#43434380] text-white">
                    <DialogHeader>
                        <DialogTitle>Enter OTP</DialogTitle>
                        <DialogDescription>
                            <p className="text-sm">We have sent a verification code to your email address. Please enter the code to verify your account.</p>
                            {/* example otp: 398777 */}
                            {/* so place 6 input box for otp */}
                            <div className="flex justify-between gap-2 my-8">
                                {[...Array(6)].map((_, i) => (
                                    <input
                                        key={i}
                                        type="text"
                                        maxLength={1}
                                        value={otpValues[i]}
                                        className="otp-input w-12 h-12 text-center text-white bg-black border border-[#43434380] rounded-md focus:border-white outline-none"
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (!/^[0-9]?$/.test(value)) return;

                                            const newOtpValues = [...otpValues];
                                            newOtpValues[i] = value;
                                            setOtpValues(newOtpValues);

                                            const otpArray = document.querySelectorAll(".otp-input");
                                            if (value && i < 5) (otpArray[i + 1] as HTMLElement)?.focus();
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Backspace" && !otpValues[i] && i > 0) {
                                                const otpArray = document.querySelectorAll(".otp-input");
                                                (otpArray[i - 1] as HTMLElement)?.focus();
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <button type="button"
                            onClick={handleSubmit(onSubmit)}
                            disabled={isLoading}
                            className="w-full h-[52px] bg-white rounded-[10px] text-black font-semibold text-base flex items-center justify-center gap-2 hover:bg-[#f0f0f0] transition-all group cursor-pointer disabled:opacity-50">
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Verify"}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SignupCHYR;
