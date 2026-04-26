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
import { useLoginMutation } from "@/store/features/auth/auth.api";
import { toast } from "react-toastify";
import { useLazyGetUserBusinessQuery } from "@/store/features/business/business.api";
import { AVRIANCEIcon, CHYRIcon, NOHMIcon } from "@/assets/logo/BrandLogoNew";

const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginCHYR = () => {
    const [login, { isLoading }] = useLoginMutation();
    const [getUserBusiness, { isFetching }] = useLazyGetUserBusinessQuery();
    const { projectName } = useAppSelector((state) => state.projectIdentifier);
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            const res = await login(data)
            console.log("res is comming :", res);
            if (res) {
                dispatch(setUser(res?.data));
                
                try {
                    const businessData = await getUserBusiness({}).unwrap();

                    let hasBusinessEmail = false;

                    if (Array.isArray(businessData) && businessData.length > 0) {
                        hasBusinessEmail = !!businessData[0]?.business_email || !!businessData[0]?.has_business_email || !!businessData[0]?.id;
                    } else if (businessData && !Array.isArray(businessData)) {
                        hasBusinessEmail = !!businessData.business_email || !!businessData.has_business_email || !!businessData.id;
                    }
                    toast.success("Login Successful");

                    //  User has NO business → block dashboard
                    if (!hasBusinessEmail) {
                        navigate("/create-agent")
                    } else {
                        navigate("/dashboard")
                    }
                } catch(e) {
                    navigate("/dashboard") // Fallback
                }

            } else {
                toast.error("Login Failed");
            }

        } catch (error) {
            console.log("Login Error:", error);
            toast.error("Login Failed");
        }
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
                            {projectName==="CHYR"? <CHYRIcon /> : projectName==="AVRIANCE"? <AVRIANCEIcon /> : <NOHMIcon />}
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
                            Welcome back
                        </h1>
                        <p className="text-[#434343] text-sm" style={{ fontFamily: "Geist, sans-serif" }}>
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-[#9E9E9E] font-semibold underline hover:text-white transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                        {/* Email */}
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Work email"
                                {...register("email")}
                                className="w-full h-[58px] px-[28px] bg-black border border-[#43434380] rounded-[10px] text-white placeholder:text-[#434343] text-sm focus:outline-none focus:border-white transition-colors"
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
                                type="submit"
                                className="w-full h-[52px] bg-white rounded-[10px] text-black font-semibold text-base flex items-center justify-center gap-2 hover:bg-[#f0f0f0] transition-all group cursor-pointer"
                                style={{ fontFamily: "Geist, sans-serif" }}
                            >
                                {isLoading || isFetching ? <Loader2 size={18} className="animate-spin" /> : "Sign in"}
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
                        <Link to="/terms" className="text-[#9E9E9E] font-semibold underline hover:text-white transition-colors">
                            Terms
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy-policy" className="text-[#9E9E9E] font-semibold underline hover:text-white transition-colors">
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
        </div>
    );
};

export default LoginCHYR;
