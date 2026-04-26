import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { Play } from "lucide-react";
import { useLandingConfig } from "@/contexts/LandingConfigContext";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setBusinessEmailAndWebsite } from "@/store/features/business/business.slice";

interface StepOneProps {
    register: UseFormRegister<{
        email: string;
        website?: string | undefined;
    }>;
    errors: FieldErrors<{
        email: string;
        website?: string | undefined;
    }>;
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

const bgColor = "bg-linear-to-t from-black to-white/10 border border-[#A7A8F4]/25 border-blur-sm";
const textColor = "text-white";
const inputBoxClass = "w-full p-3.5 border border-[#A7A8F4]/25 rounded-[10px]  focus:border-[#5B63F1] focus:outline-none transition-all placeholder:text-white/50 text-white font-poppins";
// const buttonClass = "bg-white hover:bg-[#5D5FEF] text-black";

const StepOne = ({ register, errors, onSubmit }: StepOneProps) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [website, setWebsite] = useState("");
    const {config} = useLandingConfig();
    return (
        <>
            {/* Background Image */}
            {/* <div className="absolute inset-0 z-0 blur-[4px]">
                <img src={loginImg} alt="Background" className="w-full h-full object-cover rounded-[20px]" />
            </div> */}

            <div className={`w-[95%] md:w-[750px] ${bgColor}  rounded-[20px] p-8 lg:p-14 shadow-2xl relative z-10 transition-all duration-500 animate-in fade-in zoom-in-95 flex flex-col justify-center`}>
                <div className="text-center mb-10">
                    <h1 className={`text-xl md:text-[34px] font-medium ${textColor} mb-2`}>Create Your AI Agent</h1>
                    <p className={`text-[#9E9E9E] text-sm md:text-base ${textColor}`}>Your voice-powered booking agent is just a few minutes away.</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6 w-full md:w-[400px] mx-auto">
                    <div className="relative">
                        {/* <div className="absolute left-4 -top-2.5 px-1.5 bg-white z-10">
                            <label className="text-[14px] lg:text-xs font-normal text-pure-black leading-normal">Email address*</label>
                        </div> */}
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            {...register("email")}
                            className={inputBoxClass}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-[10px] mt-1 ml-4 absolute">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="relative pt-2">

                        <input
                            type="text"
                            placeholder="Enter your website address"
                            {...register("website")}
                            className={inputBoxClass}
                            required
                            onChange={(e) => setWebsite(e.target.value)}
                        />
                        {errors.website && (
                            <p className="text-red-500 text-[10px] mt-1 ml-4 absolute">{errors.website.message}</p>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className={`a w-full  p-4 rounded-[10px] transition-all flex items-center justify-center gap-3  group cursor-pointer text-base md:text-lg bg-white hover:opacity-90 hover:${config?.colors.brandColor}`}
                            onClick={() => dispatch(setBusinessEmailAndWebsite({ business_email: email, business_website: website}))}
                        >
                            Create Agent <Play size={24} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="text-center space-y-4 pt-2">
                        <p className="text-gray-400 text-sm font-medium">
                            Already have an account ?{" "}
                            <Link to="/login" className={` font-bold hover:underline transition-all cursor-pointer`} style={{color: config?.colors.brandColorHex}}>Sign In</Link>
                        </p>
                        <button type="button" className="text-gray-400 text-xs font-bold flex items-center justify-center gap-1 mx-auto group hover:text-gray-600 cursor-pointer">
                            DON'T HAVE A WEBSITE ? <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default StepOne;
