import { useState } from "react";
import CommonWrapper from "@/common/CommonWrapper";
import { ArrowRight, Check, Copy, Phone, PhoneCall } from "lucide-react";
import { useLandingConfig } from "@/contexts/LandingConfigContext";

const StaticSwitch = ({
  defaultChecked = true,
}: {
  defaultChecked?: boolean;
}) => {
  const [checked, setChecked] = useState(defaultChecked);
  const { config } = useLandingConfig();
  return (
    <>
    <div
      onClick={() => setChecked(!checked)}
      className={`hidden  h-[34px] w-[62px] px-[3px] rounded-[20px] transition-all cursor-pointer md:flex items-center ${checked
        ? "bg-[linear-gradient(to_right,_#F1A34C_18.27%,_#543597_99.62%)] justify-end"
        : "bg-[#9E9E9E] justify-start"
        }`}
    >
      <div className="size-[28px] rounded-full bg-white transition-all shadow-sm" />
    </div>
    <div
      onClick={() => setChecked(!checked)}
      className={`flex  h-[34px] w-[62px] px-[3px] rounded-[20px] transition-all cursor-pointer md:hidden items-center ${checked
        ? `${config.colors.brandColor} justify-end`
        : "bg-[#9E9E9E] justify-start"
        }`}
    >
      <div className="size-[28px] rounded-full bg-white transition-all shadow-sm" />
    </div>
    </>
  );
};

const ChyrForwardCalls = () => {
  const { config } = useLandingConfig();

  return (
    <section className="py-8 md:py-24 bg-[#0a0a0a] overflow-hidden">
      <CommonWrapper>
        <div
          data-aos="zoom-in"
          className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16 p-2 sm:p-10 bg-[rgba(16,16,16,0.80)] rounded-[20px] shadow-[0_0_14px_0_rgba(0,0,0,0.06)] max-w-6xl mx-auto"
        >
          {/* Left Section - Interactive UI (Mockup LEFT) */}
          <div
            data-aos="fade-right"
            data-aos-delay="300"
            className="w-full max-w-[480px] mx-auto pointer-events-none order-2 lg:order-1 bg-[rgba(16,16,16,0.80)] rounded-[20px] p-6 sm:p-8 flex flex-col gap-5 border border-white/5"
          >
            {/* Your Hyln Number Card */}
            <div
              className="flex flex-col gap-2 p-[10px_20px] justify-between items-center rounded-[20px] self-stretch"
              style={{
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.19)",
                background:
                  "radial-gradient(circle at 70% 30%, rgba(241,163,76,0.3) 0%, rgba(84,53,151,0.3) 70%)",
              }}
            >
              <span className="text-[#9E9E9E] font-geist text-sm font-normal leading-normal">
                {config.texts.forwardCalls.numberTitle}
              </span>
              <div className="flex items-center gap-3">
                <span className="hidden md:block font-dm-sans text-[24px] md:text-[28px] font-medium leading-normal bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  (555) 123-4567
                </span>
                <span className={`${config.colors.primaryStyle} md:hidden font-dm-sans text-[24px] md:text-[28px] font-medium leading-normal `}>
                  (555) 123-4567
                </span>

                <Copy className="w-5 h-5 text-white cursor-pointer" />
              </div>
              <span className="text-white font-geist text-sm md:text-[16px] font-normal leading-normal text-center">
                Forward your calls to this number
              </span>
            </div>

            {/* Forward calls from business line */}
            <div className="flex flex-col gap-2">
              <span className="text-[#555] font-geist text-sm md:text-base font-normal leading-normal ">
                Forward calls from your business line
              </span>
              <div className="flex flex-row items-center justify-center gap-3 sm:gap-5 py-3 px-4 rounded-[20px] bg-[#161616] self-stretch text-center sm:text-left">
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-[#9E9E9E] font-geist text-xs md:text-sm">
                    {config.texts.forwardCalls.businessLabel}
                  </span>
                  <span className="text-white font-dm-sans text-base md:text-xl font-medium">
                    (650) 250-0287
                  </span>
                </div>
                {/* <MoveRight className={`${config.colors.primaryHost} w-6 h-6 hidden sm:block rotate-90 sm:rotate-0`} /> */}
                <ArrowRight className={`${config.colors.primaryHost} h-4 md:h-6`} />
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-[#9E9E9E] font-geist text-xs md:text-sm">
                    {config.texts.forwardCalls.numberTitle}
                  </span>
                  <span className="hidden md:block font-dm-sans text-base md:text-xl font-medium bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                    (555) 123-4567
                  </span>
                  <span className={`${config.colors.primaryStyle} md:hidden font-dm-sans text-base md:text-xl font-medium `}>
                    (555) 123-4567
                  </span>
                </div>
              </div>
            </div>

            {/* Incoming call section */}
            <div className="flex flex-col gap-3">
              <span className="text-[#555] font-geist text-sm md:text-base font-normal leading-normal">
                Live Activity
              </span>

              {/* Call row 1 */}
              <div className="flex px-4 py-3 justify-between items-center rounded-[16px] bg-[rgba(31,131,0,0.10)] self-stretch border border-green-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1FB300] rounded-full flex items-center justify-center shrink-0 animate-pulse">
                    <PhoneCall className="text-white w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-dm-sans text-base font-medium">
                      {config.texts.forwardCalls.activity1}
                    </span>
                    <span className="text-[#1FB300] font-geist text-xs md:text-sm ">
                      {config.texts.forwardCalls.activity1Sub}
                    </span>
                  </div>
                </div>
                <span className="text-[#555] font-geist text-sm">0:23</span>
              </div>

              {/* Call row 2 */}
              <div className="flex px-4 py-3 justify-between items-center rounded-[16px] bg-[#1a1a1a] self-stretch shadow-sm border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#333] rounded-full flex items-center justify-center shrink-0">
                    <Phone className="text-white w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-dm-sans text-base font-medium">
                      {config.texts.forwardCalls.activity2}
                    </span>
                    <span className="text-[#9E9E9E] font-geist text-xs md:text-sm">
                      Completed successfully
                    </span>
                  </div>
                </div>
                <span className="text-[#9E9E9E] font-geist text-sm">
                  2m ago
                </span>
              </div>
            </div>

            {/* Transfer urgent row */}
            <div className="flex items-center justify-between px-5 py-3 rounded-[16px] border border-white/10 bg-[#121212]">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-white" />
                <span className="text-white font-geist text-sm md:text-base">
                  {config.texts.forwardCalls.alertText}
                </span>
              </div>
              <StaticSwitch />
            </div>
          </div>

          {/* Right Section - Content (Text RIGHT) */}
          <div
            data-aos="fade-left"
            data-aos-delay="600"
            className="w-full max-w-[480px] mx-auto order-1 lg:order-2"
          >
            <span className={`${config.colors.primaryHost} text-sm md:text-lg font-medium mb-4 block font-geist`}>
              Step 3
            </span>
            <h2 className="font-dm-sans font-medium text-[28px] md:text-[36px] leading-tight text-white mb-6">
              {config.texts.forwardCalls.title}
            </h2>
            <p className="text-[#9E9E9E] font-dm-sans text-base md:text-lg mb-10 leading-relaxed">
              {config.texts.forwardCalls.desc}
            </p>

            <div className="space-y-6">
              {config.texts.forwardCalls.steps.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <div className={`w-5 h-5 rounded-full border border-[${config.colors.secondaryHex}] flex items-center justify-center`} style={{ borderColor: config.colors.secondaryHex }}>
                      <Check
                        className={config.colors.primaryStyle}
                        size={12}
                        strokeWidth={3}
                      />
                    </div>
                  </div>
                  <p className="font-dm-sans text-base md:text-lg leading-snug">
                    <span className="text-white font-medium">{step.title}</span>
                    <span className="text-[#9E9E9E]">{step.content}</span>
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

export default ChyrForwardCalls;
