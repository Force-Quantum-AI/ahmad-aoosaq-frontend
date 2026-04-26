import CommonWrapper from "@/common/CommonWrapper";
import tellLogo from "@/assets/images/chyrImage/golla.png";
import { Check, Globe } from "lucide-react";
import { useLandingConfig } from "@/contexts/LandingConfigContext";

const ChyrHylnSteps = () => {
  const { config } = useLandingConfig();

  return (
    <section className="py-8 md:py-24 bg-[#0b0b0b] overflow-hidden">
      <CommonWrapper>
        <div className="text-center mb-4 md:mb-8 lg:mb-20 px-2 md:px-4" data-aos="fade-up">
          <h2 className="font-dm-sans font-medium text-[30px] md:text-[48px] leading-tight text-white">
            {config.brandName} is ready to answer your <br className="hidden md:block" />
            <span className={config.colors.primaryHost}>
              {config.texts.hylnSteps.titlePart1} <span className="text-white">{config.texts.hylnSteps.titlePart2}</span> 3 simple
              steps:
            </span>
          </h2>
        </div>

        {/* Card Section */}
        <div
          data-aos="zoom-in"
          className="bg-transparent rounded-2xl p-2 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto"
        >
          {/* Left Section - Interactive Area (Mockup) */}
          <div
            data-aos="fade-right"
            data-aos-delay="300"
            className="w-full max-w-[480px] mx-auto pointer-events-none border-[#210c1f] rounded-2xl overflow-hidden shadow-[inset_0_-18px_52px_0_#2F0F2C] order-2 md:order-1"
            style={{ borderTopWidth: 0 }}
          >
            <div className="w-full rounded-2xl p-6 sm:p-8 flex flex-col">
              {/* Import from website */}
              <div className="mb-8">
                <label className="block font-geist text-base md:text-lg text-white mb-4">
                  {config.texts.hylnSteps.importLabel}
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow flex items-center gap-3 p-4 md:p-5 rounded-[20px] bg-[#121214]">
                    <Globe className="text-[#9E9E9E]" size={20} />
                    <input
                      type="text"
                      placeholder={config.texts.hylnSteps.importPlaceholder}
                      className="bg-transparent border-none outline-none text-base md:text-lg text-[#9E9E9E] w-full"
                    />
                  </div>
                  <button className="bg-white text-black px-6 md:px-8 py-2.5 md:py-4 rounded-[20px] text-sm md:text-base font-medium hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer">
                    Import
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[1px] flex-grow bg-[#9E9E9E]/30"></div>
                <span className="text-[#9E9E9E] text-sm md:text-base uppercase font-medium">
                  or
                </span>
                <div className="h-[1px] flex-grow bg-[#9E9E9E]/30"></div>
              </div>

              {/* Tell me about business */}
              <div className="flex flex-col items-center text-center">
                <div className=" mb-6">
                  <img
                    src={tellLogo}
                    alt="CHYR Logo"
                    className="hidden md:block w-[60px] h-[60px] md:w-[80px] md:h-[80px] object-contain"
                  />
                  <div className={`block md:hidden w-[60px] h-[60px] md:w-[80px] md:h-[80px] bg-transparent rounded-full p-1.5`}
                  style={{
                    border: `1px solid ${config.colors.brandColorHex}`,
                  }}
                  >
                    <div className={`h-full w-full ${config.colors.brandColor} rounded-full`}></div>
                  </div>
                </div>
                <h3 className="hidden md:block text-[20px] md:text-[24px] font-medium mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  {config.texts.hylnSteps.tellMeAbout}
                </h3>
                <h3 className={`${config.colors.primaryHost} md:hidden text-[20px] md:text-[24px] font-medium mb-3  `}>
                  {config.texts.hylnSteps.tellMeAbout}
                </h3>
                <p className="text-[#9E9E9E] text-sm md:text-base mb-8">
                  {config.texts.hylnSteps.tellMeSub}
                </p>
                <button
                  className="hidden md:block px-6 md:px-8 py-3 rounded-[20px] text-white font-medium hover:opacity-90 transition-opacity cursor-pointer text-sm md:text-base"
                  style={{
                    borderRadius: "20px",
                    border: config.brandName === "CHYR" ? "none" : "1px solid rgba(255, 255, 255, 0.19)",
                    background: config.colors.buttonGradientBorder,
                    boxShadow: config.colors.buttonShadow,
                  }}
                >
                  Start Conversation
                </button>
                <button
                  className="block md:hidden px-6 md:px-8 py-3 rounded-[20px] text-white font-medium hover:opacity-90 transition-opacity cursor-pointer text-sm md:text-base"
                  style={{
                    borderRadius: "20px",
                    border: config.brandName === "CHYR" ? "none" : "1px solid rgba(255, 255, 255, 0.19)",
                    background: config.colors.brandColorHex,
                    boxShadow: config.colors.buttonShadow,
                  }}
                >
                  Start Conversation
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Steps Info (Text) */}
          <div
            data-aos="fade-left"
            data-aos-delay="600"
            className="w-full max-w-[480px] mx-auto flex flex-col justify-center order-1 md:order-2"
          >
            <span className={`${config.colors.primaryHost} text-sm md:text-lg font-medium mb-2`}>
              Step 1
            </span>
            <h3 className="text-white text-[28px] md:text-[36px] font-medium mb-4">
              {config.texts.hylnSteps.step1Title}
            </h3>
            <p className="text-[#9E9E9E] font-dm-sans text-base md:text-lg mb-8 leading-relaxed">
              {config.texts.hylnSteps.step1Desc}
            </p>

            <div className="space-y-6">
              {config.texts.hylnSteps.step1List.map((step, idx) => (
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

export default ChyrHylnSteps;
