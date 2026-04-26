import CommonWrapper from "@/common/CommonWrapper";
import { ShieldCheck, FileCheck, Award } from "lucide-react";
import { useLandingConfig } from "@/contexts/LandingConfigContext";

const ChyrSecurityCompliance = () => {
  const { config } = useLandingConfig();
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
    <section className="pb-20 bg-[#0a0a0a]">
      <CommonWrapper>
        <div className="text-center mb-12 lg:mb-20">
          <h2
            data-aos="fade-up"
            className="font-dm-sans font-medium text-[32px] md:text-[48px] leading-tight text-center mb-6 max-w-[800px] mx-auto text-white"
          >Enterprise-Grade
            <span className={`font-dm-sans  font-medium leading-normal bg-gradient-to-r from-[#ffffff] ${config.colors.securityGradientTarget} bg-clip-text text-transparent`}> Security & </span>
            <span className={config.colors.primaryHost}>
              Compliance
            </span>
          </h2>
          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-[#9E9E9E] font-dm-sans text-base md:text-2xl font-normal text-center max-w-[800px] mx-auto leading-normal"
          >
            Built for higher education with the security and compliance
            standards you require
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {standards.map((item, idx) => (
            <div
              key={idx}
              data-aos="fade-up"
              data-aos-delay={idx * 300}
              className="w-full sm:w-[338px] min-h-[260px] border-6 border-[#1e1713] flex flex-col items-center justify-center p-8 bg-[rgba(22, 22, 22, 0.50)] rounded-[15.141px] shadow-[0_0_14px_0_rgba(0,0,0,0.02)] transition-transform hover:scale-[1.02] hover:bg-[#201f1f] duration-300"
            >
              {/* Icon Container */}
              <div className="w-[66px] h-[66px] bg-[#2a2929] rounded-[15px] flex items-center justify-center mb-6 shadow-[0_4px_10px_rgba(0,0,0,0.02)]">
                <item.Icon
                  className={config.colors.primaryStyle}
                  style={{ width: "29.621px", height: "36.932px" }}
                  strokeWidth={1.5}
                />
              </div>

              {/* Name */}
              <h3 className="font-dm-sans font-medium text-[28px] text-white mb-1">
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

export default ChyrSecurityCompliance;
