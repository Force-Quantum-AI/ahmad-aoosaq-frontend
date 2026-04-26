import CommonWrapper from "@/common/CommonWrapper";
import epicLogo from "@/assets/logo/epic.png";
import cernerLogo from "@/assets/logo/cerner.png";
import simpleLogo from "@/assets/logo/simple.png";
import zocdocLogo from "@/assets/logo/zocdoc.png";
import chronoLogo from "@/assets/logo/chrono.png";
import athenaLogo from "@/assets/logo/athena.png";
import hylnLogo from "@/assets/logo/hyln.png";
import { Sparkles } from "lucide-react";
import Marquee from "react-fast-marquee";

const Integrations = () => {
    const logos = [
        { src: zocdocLogo, alt: "Zocdoc" },
        { src: chronoLogo, alt: "Dr Chrono" },
        { src: athenaLogo, alt: "Athena Health" },
    ];
    const logos2 = [
        { src: epicLogo, alt: "Epic" },
        { src: cernerLogo, alt: "Cerner" },
        { src: simpleLogo, alt: "Simple Practice" },
    ];

    return (
        <section className="py-10 bg-white overflow-hidden">
            <CommonWrapper>
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-10 px-4">
                    <div className="flex items-center gap-2 px-4.5 py-2.5 rounded-[20px] border border-[#1BF0FF] mb-6 shadow-[0_0_10px_rgba(27,240,255,0.1)]" data-aos="fade-up" data-aos-delay="300">
                        <Sparkles size={16} className="text-[#1BF0FF]" />
                        <span className="text-[#1BF0FF] font-geist font-medium text-base">Integrations</span>
                    </div>

                    <h2 data-aos="fade-up" data-aos-delay="500" className="font-dm-sans font-medium text-[32px] md:text-[48px] leading-tight text-black max-w-[800px]">
                        Integrates With All Major{" "}
                        <span className="text-[#0BEFFF]">Healthcare Systems</span>
                    </h2>
                </div>

                {/* Logos Layout */}
                <div className="relative flex items-center justify-center min-h-[400px]">

                    {/* Healthcare Logo Cards - Horizontal row with scroll on mobile */}
                    <div className="flex items-center py-10 w-full justify-between">
                        <Marquee pauseOnHover autoFill speed={20} direction="right">
                            {logos.map((logo, idx) => (
                                <div
                                    key={idx}
                                    className="mx-2 my-3 w-[198px] h-[168px] flex-shrink-0 border border-[#A6F7EF] rounded-[15.141px] bg-white flex items-center justify-center p-6 shadow-[0_0_14px_0_rgba(166,247,239,0.1)] transition-transform hover:scale-105"
                                >
                                    <img src={logo.src} alt={logo.alt} className="max-w-full max-h-full object-contain" />
                                </div>
                            ))}
                        </Marquee>
                        <Marquee pauseOnHover autoFill speed={20} direction="left">
                            {logos2.map((logo, idx) => (
                                <div
                                    key={idx}
                                    className="mx-2 my-3 w-[198px] h-[168px] flex-shrink-0 border border-[#A6F7EF] rounded-[15.141px] bg-white flex items-center justify-center p-6 shadow-[0_0_14px_0_rgba(166,247,239,0.1)] transition-transform hover:scale-105"
                                >
                                    <img src={logo.src} alt={logo.alt} className="max-w-full max-h-full object-contain" />
                                </div>
                            ))}
                        </Marquee>
                    </div>

                    {/* Central Hyln Logo Overlay */}
                    <div data-aos="zoom-out" className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 hover:scale-105 transition-all duration-500 z-20 ">
                        <img
                            src={hylnLogo}
                            alt="Hyln"
                            className="w-[280px] h-[280px] md:w-[315px] md:h-[315px] object-contain drop-shadow-[0_20px_50px_rgba(93,95,239,0.3)]"
                        />
                    </div>
                </div>
            </CommonWrapper>
        </section>
    );
};

export default Integrations;
