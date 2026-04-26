import CommonWrapper from "@/common/CommonWrapper";
import { ShieldCheck, FileCheck, Award } from "lucide-react";

const SecurityCompliance = () => {
    const standards = [
        {
            name: "NPHIES",
            status: "Ready",
            Icon: ShieldCheck,
        },
        {
            name: "PDPL",
            status: "Compliant",
            Icon: FileCheck,
        },
        {
            name: "ISO 27001",
            status: "Certified",
            Icon: Award,
        },
    ];

    return (
        <section className="pb-20 bg-white">
            <CommonWrapper>
                <div className="text-center mb-12 lg:mb-20">
                    <h2 data-aos="fade-up" className="font-dm-sans font-medium text-[32px] md:text-[48px] leading-tight text-center mb-6">
                        <span className="text-black">Enterprise-Grade </span>
                        <span className="bg-[linear-gradient(90deg,#000_52.77%,#00C7D5_68.58%)] bg-clip-text text-transparent">
                            Security & Compliance
                        </span>
                    </h2>
                    <p data-aos="fade-up" data-aos-delay="200" className="text-[#555] font-dm-sans text-xl md:text-2xl font-normal text-center max-w-[800px] mx-auto leading-normal">
                        Built for higher education with the security and compliance standards you require
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                    {standards.map((item, idx) => (
                        <div
                            key={idx}
                            data-aos="fade-up"
                            data-aos-delay={idx * 300}
                            className="w-full sm:w-[338px] min-h-[260px] flex flex-col items-center justify-center p-8 bg-[#FAFBFB] rounded-[15.141px] shadow-[0_0_14px_0_rgba(0,0,0,0.02)] transition-transform hover:scale-[1.02]"
                        >
                            {/* Icon Container */}
                            <div className="w-[66px] h-[66px] bg-white rounded-[15px] flex items-center justify-center mb-6 shadow-[0_4px_10px_rgba(0,0,0,0.02)]">
                                <item.Icon
                                    className="text-[#0BEFFF]"
                                    style={{ width: "29.621px", height: "36.932px" }}
                                    strokeWidth={1.5}
                                />
                            </div>

                            {/* Name */}
                            <h3 className="font-dm-sans font-medium text-[28px] text-black mb-1">
                                {item.name}
                            </h3>

                            {/* Status */}
                            <p className="font-geist font-normal text-lg text-[#9E9E9E]">
                                {item.status}
                            </p>
                        </div>
                    ))}
                </div>
            </CommonWrapper>
        </section>
    );
};

export default SecurityCompliance;
