import { Check } from "lucide-react";
import HeroCallWidget from "./HeroCallWidget";
import heroImage from "@/assets/images/hero.png";
import CommonWrapper from "@/common/CommonWrapper";

const Hero = () => {
    return (
        <section className="relative w-full min-h-screen overflow-hidden flex items-center">
            <img
                src={heroImage}
                alt="Hero Background"
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* Content inside CommonWrapper */}
            <div className="relative z-10 w-full">
                <CommonWrapper className="!py-0">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-10 py-[72px] lg:py-[96px] flex-wrap w-full">
                        {/* LEFT — Text */}
                        <div data-aos="fade-right" className="w-full lg:w-auto flex flex-col items-center lg:items-start text-center lg:text-left">
                            <h1 className="text-black text-[34px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-semibold leading-tight">
                                Never miss another
                            </h1>
                            <h1 className="text-[#00E6F6] text-[34px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-semibold leading-tight">
                                patient call.
                            </h1>

                            <p className="text-[#3F3F3F] text-base sm:text-lg md:text-xl lg:text-2xl font-medium mt-6 sm:mt-8 mb-8 sm:mb-10 w-full md:max-w-162.5">
                                HyIn answers calls, books appointments, verifies insurance, and handles patient
                                inquiries while you focus on care.
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                                {/* Start Free Trial */}
                                {/* <button className="w-full sm:w-auto px-6 py-3 flex justify-center items-center gap-3.5 rounded-[14px]  bg-[radial-gradient(169.18%_110.09%_at_71.56%_88.75%,_#00C7D5_18.27%,_#0011ED_99.62%)] shadow-[0_4px_6px_0_rgba(255,255,255,0.19)] cursor-pointer text-white text-lg font-normal leading-normal hover:opacity-90 transition-opacity whitespace-nowrap">
                                    Start Free Trial
                                    <span className="px-3 py-1.5 rounded-full bg-[#0BEFFF] text-white text-sm font-medium">
                                        14 days free
                                    </span>
                                </button> */}
                                <button className="relative group w-full sm:w-auto px-6 py-3 flex justify-center items-center gap-3.5 rounded-[14px] bg-[radial-gradient(169.18%_110.09%_at_71.56%_88.75%,_#00C7D5_18.27%,_#0011ED_99.62%)] shadow-[0_4px_6px_0_rgba(255,255,255,0.19)] cursor-pointer text-white text-lg font-normal leading-normal hover:opacity-90 transition-all whitespace-nowrap overflow-hidden">

                                    {/* TOP BORDER GRADIENT */}
                                    <div
                                        className="absolute top-0 left-0 w-full h-[1.5px] opacity-70"
                                        style={{ background: 'linear-gradient(to right, #6b7280, #FFFFFF, #6b7280)' }}
                                    />

                                    {/* BOTTOM BORDER GRADIENT */}
                                    <div
                                        className="absolute bottom-0 left-0 w-full h-[1.5px] opacity-70"
                                        style={{ background: 'linear-gradient(to right, #6b7280, #FFFFFF, #6b7280)' }}
                                    />

                                    Start Free Trial
                                    <span className="px-3 py-1.5 rounded-full bg-[#0BEFFF] text-white text-sm font-medium">
                                        14 days free
                                    </span>
                                </button>

                                {/* Book a Demo */}
                                <button className="w-full sm:w-auto px-6 py-3.5 rounded-[14px] border-2 border-white text-white text-lg font-medium cursor-pointer hover:bg-white/10 transition-colors">
                                    Book a Demo
                                </button>
                            </div>

                            {/* Feature list */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6">
                                {["No credit card required", "Setup in 5 minutes", "Works with any calendar"].map(
                                    (item) => (
                                        <div
                                            key={item}
                                            className="flex items-center gap-2 text-white text-sm md:text-base whitespace-nowrap"
                                        >
                                            <Check size={16} className="text-white shrink-0" />
                                            {item}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* RIGHT — Widget */}
                        <div data-aos="fade-left" className="w-full lg:w-auto flex justify-center lg:justify-end">
                            <HeroCallWidget />
                        </div>
                    </div>
                </CommonWrapper>
            </div>
        </section>
    );
};

export default Hero;
