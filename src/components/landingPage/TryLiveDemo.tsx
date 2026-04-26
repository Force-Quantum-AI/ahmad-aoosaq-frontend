import CommonWrapper from "@/common/CommonWrapper";
import { MoveRight, PhoneCall, Mic2 } from "lucide-react";
import DemoAudioPlayer from "./DemoAudioPlayer";
import HylnPhoneUI from "./HylnPhoneUI";

const TryLiveDemo = () => {
    return (
        <section className="py-10 bg-white overflow-hidden">
            <CommonWrapper>
                <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                    {/* Left Card - Try Hyln AI */}
                    <div data-aos="fade-right" className="w-full lg:w-1/2 min-h-min lg:min-h-[852px] rounded-[20px] bg-[rgba(242,244,245,0.40)] backdrop-blur-[12px] p-6 sm:p-10 lg:pt-[47px] lg:px-[49px] lg:pb-[117px] flex flex-col items-center">
                        <div className="w-full flex justify-start mb-10 lg:mb-20">
                            <button className="inline-flex items-center gap-2.5 p-2.5 rounded-[10px] border border-[#0BEFFF] text-[#0BEFFF] text-base font-normal">
                                <PhoneCall size={24} />
                                Try Hyln AI
                            </button>
                        </div>
                        <div className="w-full flex justify-center">
                            <HylnPhoneUI />
                        </div>
                    </div>

                    {/* Right Card - Live Demo */}
                    <div data-aos="fade-left" className="w-full lg:w-1/2 min-h-min lg:min-h-[852px] rounded-[20px] bg-[rgba(242,244,245,0.40)] backdrop-blur-[12px] p-6 sm:p-10 lg:pt-[47px] lg:px-[49px] lg:pb-[117px] flex flex-col items-center">
                        <div className="w-full flex justify-start mb-10 lg:mb-15">
                            <button className="inline-flex items-center gap-2.5 p-2.5 rounded-[10px] border border-[#0BEFFF] text-[#0BEFFF] text-base font-normal">
                                <Mic2 size={24} />
                                live demo
                            </button>
                        </div>

                        <div className="w-full space-y-10 lg:space-y-[60px] flex flex-col items-center">
                            <h3 className="text-black text-[20px] sm:text-[24px] font-normal leading-relaxed text-left lg:text-left w-full font-geist">
                                Experience how naturally our AI answer calls, take reservations, and capture every order — exactly like a trained staff member would.
                            </h3>

                            <div className="w-full flex justify-center">
                                <DemoAudioPlayer
                                    src="/demoCallSound.mp3"
                                    title="Sample call recording"
                                    label="Hear HyIn In Action"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="w-full flex justify-center mt-12">
                    <button className="bg-black text-white w-full max-w-[327px] sm:w-auto px-8 py-4 rounded-[10px] text-lg font-medium flex items-center justify-center gap-3 hover:bg-gray-900 transition-colors cursor-pointer group">
                        Book a Demo
                        <MoveRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </CommonWrapper>
        </section>
    );
};

export default TryLiveDemo;
