import CommonWrapper from "@/common/CommonWrapper";
import tellLogo from "@/assets/images/tell-logo.png";
import { Check, Globe } from "lucide-react";

const HylnSteps = () => {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <CommonWrapper>
                <div className="text-center mb-12 lg:mb-20 px-4" data-aos="fade-up">
                    <h2 className="font-dm-sans font-medium text-[32px] md:text-[48px] leading-tight text-black">
                        Hyln’s ready to answer your <br className="hidden md:block" />
                        <span className="text-[#0BEFFF]">business calls <span className="text-black">in</span> 3 simple steps:</span>
                    </h2>
                </div>

                {/* Card Section */}
                <div data-aos="zoom-in" className="bg-[#FAFBFB] rounded-[20px] shadow-[0_0_14px_0_rgba(0,0,0,0.06)] p-6 md:p-10 flex flex-col lg:flex-row gap-10 items-stretch">

                    {/* Left Section - Interactive Area */}
                    <div data-aos="fade-right" data-aos-delay="600" className="w-full lg:w-1/2 bg-[#E8FEFF] rounded-[20px] p-6 sm:p-8 lg:p-10 flex flex-col">

                        {/* Import from website */}
                        <div className="mb-8">
                            <label className="block font-geist text-lg text-black mb-4">Import from your website</label>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-grow flex items-center gap-3 p-4 md:p-5 rounded-[20px] border border-[#D0D0D0] bg-[#F9F9F9]">
                                    <Globe className="text-[#9E9E9E]" size={20} />
                                    <input
                                        type="text"
                                        placeholder="https://yourbusiness.com"
                                        className="bg-transparent border-none outline-none text-lg text-[#9E9E9E] w-full"
                                    />
                                </div>
                                <button className="bg-black text-white px-8 py-4 rounded-[20px] font-medium hover:bg-gray-900 transition-colors whitespace-nowrap cursor-pointer">
                                    Import
                                </button>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-[1px] flex-grow bg-[#9E9E9E]"></div>
                            <span className="text-[#9E9E9E] text-base uppercase font-medium">or</span>
                            <div className="h-[1px] flex-grow bg-[#9E9E9E]"></div>
                        </div>

                        {/* Tell me about business */}
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-6">
                                <img
                                    src={tellLogo}
                                    alt="HYLN Logo"
                                    className="w-[70px] h-[70px] object-contain"
                                />
                            </div>
                            <h3 className="text-black text-[24px] md:text-[28px] font-medium mb-3">
                                Tell me about your business
                            </h3>
                            <p className="text-[#9E9E9E] text-base mb-8">
                                Have a conversation with Hyln to set up your account
                            </p>
                            <button className="px-8 py-3 rounded-[20px] text-white font-medium bg-[radial-gradient(169.18%_110.09%_at_71.56%_88.75%,_#00C7D5_18.27%,_#0011ED_99.62%)] hover:opacity-90 transition-opacity cursor-pointer">
                                Start Conversation
                            </button>
                        </div>
                    </div>

                    {/* Right Section - Steps Info */}
                    <div data-aos="fade-left" data-aos-delay="600" className="w-full lg:w-1/2 flex flex-col justify-center py-6 lg:pl-10">
                        <span className="text-[#0BEFFF] text-lg font-medium mb-2">Step 1</span>
                        <h3 className="text-black text-[24px] md:text-[28px] font-medium mb-4">
                            Set up Hyln in minutes
                        </h3>
                        <p className="text-[#555] font-dm-sans text-lg mb-8 leading-relaxed">
                            Import your website or have a quick conversation with Hyln — she'll learn your services, hours, and FAQs automatically.
                        </p>

                        <div className="space-y-6">
                            {[
                                { title: "Import from your website — ", content: "Hyln pulls your services, pricing, and business info instantly" },
                                { title: "Or talk to Hyln — ", content: "Have a conversation and she’ll set everything up for you" },
                                { title: "Connect your booking system — ", content: "Square, Vagaro, MindBody, and more" }
                            ].map((step, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="mt-1 flex-shrink-0">
                                        <div className="w-5 h-5 rounded-full bg-[#E8FEFF] flex items-center justify-center">
                                            <Check className="text-[#0BEFFF]" size={14} strokeWidth={3} />
                                        </div>
                                    </div>
                                    <p className="font-dm-sans text-lg leading-snug">
                                        <span className="text-black font-medium">{step.title}</span>
                                        <span className="text-[#555]">{step.content}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CommonWrapper>
        </section>
    );
};

export default HylnSteps;
