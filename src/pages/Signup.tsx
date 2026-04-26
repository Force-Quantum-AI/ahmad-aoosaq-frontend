import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FiUserPlus } from "react-icons/fi";
import signupImg from "@/assets/auth/login.png";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormInputs = z.infer<typeof signupSchema>;

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
  });

  const navigate = useNavigate();

  const onSubmit = (data: SignupFormInputs) => {
    console.log("Signup Data:", data);
    navigate("/login");
  };

  return (
    <div className="flex bg-white font-sans w-full">
      <div className="w-full md:w-1/2 hidden md:block">
        <img
          src={signupImg}
          alt="AI Voice Assistant Illustration"
          className="w-full object-cover p-5"
        />
      </div>

      {/* Right Section - Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-10 relative">

        <div className="w-full md:w-[400px]">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-[54px] font-bold text-[#5D5FEF] tracking-tight">SOW</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {/* First Name Field */}
              <div className="relative">
                <div className="absolute left-4 -top-2.5 px-1.5 bg-white z-10">
                  <label className="text-[14px] lg:text-xs font-normal text-pure-black leading-normal">First name</label>
                </div>
                <input
                  type="text"
                  placeholder="First name"
                  {...register("firstName")}
                  className="w-full p-3 border border-input-border rounded-[10px] bg-white focus:border-[#5B63F1] focus:outline-none transition-all placeholder:text-input-placeholder text-pure-black font-poppins"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-[10px] mt-1 ml-4 absolute">{errors.firstName.message}</p>
                )}
              </div>

              {/* Last Name Field */}
              <div className="relative">
                <div className="absolute left-4 -top-2.5 px-1.5 bg-white z-10">
                  <label className="text-[14px] lg:text-xs font-normal text-pure-black leading-normal">Last name</label>
                </div>
                <input
                  type="text"
                  placeholder="Last name"
                  {...register("lastName")}
                  className="w-full p-3 border border-input-border rounded-[10px] bg-white focus:border-[#5B63F1] focus:outline-none transition-all placeholder:text-input-placeholder text-pure-black font-poppins"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-[10px] mt-1 ml-4 absolute">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="relative">
              <div className="absolute left-4 -top-2.5 px-1.5 bg-white z-10">
                <label className="text-[14px] lg:text-xs font-normal text-pure-black leading-normal">Email</label>
              </div>
              <input
                type="email"
                placeholder="testing123456789@gamil.com"
                {...register("email")}
                className="w-full p-3.5 border border-input-border rounded-[10px] bg-white focus:border-[#5B63F1] focus:outline-none transition-all placeholder:text-input-placeholder text-pure-black font-poppins"
              />
              {errors.email && (
                <p className="text-red-500 text-[10px] mt-1 ml-4 absolute">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative pt-2">
              <div className="absolute left-4 top-0 px-1.5 bg-white z-10">
                <label className="text-[14px] lg:text-xs font-normal text-pure-black leading-normal">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  {...register("password")}
                  className="w-full p-3.5 border border-input-border rounded-[10px] bg-white focus:border-[#5B63F1] focus:outline-none transition-all placeholder:text-input-placeholder pr-12 text-pure-black font-poppins"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5B63F1] hover:text-[#4A51D1] transition-colors cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={22} /> : <EyeClosed size={22} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-[10px] mt-1 ml-4 absolute">{errors.password.message}</p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#5B63F1] hover:bg-[#5D5FEF] text-white p-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-100 group cursor-pointer"
              >
                Sign Up
                <FiUserPlus size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute w-full border-t border-gray-100"></div>
              <span className="relative px-4 bg-white text-gray-300 text-[10px] uppercase tracking-[0.2em] font-bold">OR</span>
            </div>

            <button
              type="button"
              className="w-full border border-gray-100 py-3.5 rounded-2xl text-gray-600 font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm cursor-pointer"
            >
              Continue with <FcGoogle size={20} />
            </button>

            <p className="text-center text-[13px] text-gray-400 font-medium pt-2">
              Already have an account ?{" "}
              <Link to="/login" className="text-[#5B63F1] font-bold hover:underline transition-all cursor-pointer">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
