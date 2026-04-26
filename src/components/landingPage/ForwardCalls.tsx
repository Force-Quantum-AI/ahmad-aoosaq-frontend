import { useState } from "react";
import CommonWrapper from "@/common/CommonWrapper";
import { Check, Copy, MoveRight, Phone, PhoneCall } from "lucide-react";

const StaticSwitch = ({ defaultChecked = true }: { defaultChecked?: boolean }) => {
    const [checked, setChecked] = useState(defaultChecked);
    return (
        <div
            onClick={() => setChecked(!checked)}
            className={`h-[34px] w-[62px] px-[3px] rounded-[20px] transition-all cursor-pointer flex items-center ${checked
                ? "bg-[radial-gradient(169.18%_110.09%_at_71.56%_88.75%,_#00C7D5_18.27%,_#0011ED_99.62%)] justify-end"
                : "bg-[#9E9E9E] justify-start"
                }`}
        >
            <div className="size-[28px] rounded-full bg-white transition-all shadow-sm" />
        </div>
    );
};

const ForwardCalls = () => {
    return (
        <section className="pb-20 bg-white overflow-hidden">
            <CommonWrapper>
                <div data-aos="zoom-in" className="flex flex-col lg:flex-row items-center gap-[60px] p-[20px] sm:p-[40px] bg-[#FAFBFB] rounded-[20px] shadow-[0_0_14px_0_rgba(0,0,0,0.06)]">

                    {/* Left Section - Interactive UI */}
                    <div data-aos="fade-right" data-aos-delay="600" className="w-full lg:w-1/2 bg-[#F3F4FF] rounded-[20px] p-6 sm:p-8 lg:p-10 flex flex-col gap-6">

                        {/* Your Hyln Number Card */}
                        <div className="flex flex-col gap-2 p-[10px_20px] justify-between items-center rounded-[20px] bg-[radial-gradient(169.18%_110.09%_at_71.56%_88.75%,_rgba(0,199,213,0.20)_18.27%,_rgba(0,17,237,0.20)_99.62%)] self-stretch">
                            <span className="text-[#555] font-geist text-[16px] font-normal leading-normal">Your Hyln Number</span>
                            <div className="flex items-center gap-3">
                                <span className="text-[#0011ED] font-dm-sans text-[28px] font-medium leading-normal">(555) 123-4567</span>
                                <Copy className="w-[24px] h-[24px] aspect-square text-[#555] cursor-pointer" />
                            </div>
                            <span className="text-[#555] font-geist text-[16px] font-normal leading-normal">Forward your calls to this number</span>
                        </div>

                        {/* Forward calls from business line */}
                        <div className="flex flex-col gap-3">
                            <span className="text-[#555] font-geist text-[18px] font-normal leading-normal text-center">Forward calls from your business line</span>
                            <div className="flex items-center justify-center gap-[23px] py-[10px] px-0 rounded-[20px] bg-white self-stretch">
                                <div className="flex flex-col items-start">
                                    <span className="text-[#555] font-geist text-[16px]">Business number</span>
                                    <span className="text-black font-dm-sans text-[28px] font-medium">(650) 250-0287</span>
                                </div>
                                <MoveRight className="text-[#0BEFFF] w-6 h-6" />
                                <div className="flex flex-col items-start">
                                    <span className="text-[#555] font-geist text-[16px]">Hyln Number</span>
                                    <span className="font-dm-sans text-[28px] font-medium bg-[radial-gradient(169.18%_110.09%_at_71.56%_88.75%,_#00C7D5_18.27%,_#0011ED_99.62%)] bg-clip-text text-transparent">
                                        (555) 123-4567
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Incoming call section */}
                        <div className="flex flex-col gap-3">
                            <span className="text-[#555] font-geist text-[16px] font-normal leading-normal">Incoming call</span>

                            {/* Call row 1 */}
                            <div className="flex h-[104px] px-[20px] py-[10px] justify-between items-center rounded-[20px] bg-[rgba(31,131,0,0.10)] self-stretch">
                                <div className="flex items-center gap-4">
                                    <div className="w-[48px] h-[48px] bg-[#1FB300] rounded-full flex items-center justify-center">
                                        <PhoneCall className="text-white w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-black font-dm-sans text-[20px] font-medium">Sara M.</span>
                                        <span className="text-[#1FB300] font-geist text-[16px]">Chyr answering..</span>
                                    </div>
                                </div>
                                <span className="text-[#555] font-geist text-[16px]">0.23</span>
                            </div>

                            {/* Call row 2 */}
                            <div className="flex h-[104px] px-[20px] py-[10px] justify-between items-center rounded-[20px] bg-white self-stretch shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-[48px] h-[48px] bg-[#D0D0D0] rounded-full flex items-center justify-center">
                                        <Phone className="text-white w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-black font-dm-sans text-[20px] font-medium">Faisal A.</span>
                                        <span className="text-[#555] font-geist text-[16px]">Booked appointment</span>
                                    </div>
                                </div>
                                <span className="text-[#555] font-geist text-[16px]">2m ago</span>
                            </div>
                        </div>

                        {/* Transfer urgent row */}
                        <div className="flex items-center justify-between px-6 py-[20px] rounded-[20px] bg-white border border-[#E0E7FF]">
                            <div className="flex items-center gap-3">
                                <Phone size={20} className="text-black" />
                                <span className="text-black font-geist text-[16px]">Transfer urgent to you</span>
                            </div>
                            <StaticSwitch />
                        </div>
                    </div>

                    {/* Right Section - Content */}
                    <div data-aos="fade-left" data-aos-delay="600" className="w-full lg:w-1/2">
                        <span className="text-[#0BEFFF] text-lg font-medium mb-4 block font-geist">Step 3</span>
                        <h2 className="font-dm-sans font-medium text-[32px] md:text-[48px] leading-tight text-black mb-6">
                            Forward your calls and go live
                        </h2>
                        <p className="text-[#555] font-dm-sans text-lg mb-10 leading-relaxed">
                            Forward calls from your business line to Hyln — she'll start answering, booking appointments, and keeping you in the loop instantly.
                        </p>

                        <div className="space-y-6">
                            {[
                                { title: "Get your Hyln number — ", content: "Forward calls when you're busy or after hours" },
                                { title: "See every call — ", content: "Summaries in your dashboard" },
                                { title: "Get notified — ", content: "Text or email alerts for urgent calls and new bookings" }
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

export default ForwardCalls;
