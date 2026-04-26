import CommonWrapper from "@/common/CommonWrapper";
import bgImage from "@/assets/images/chyrImage/revuneBg.png";
import { useLandingConfig } from "@/contexts/LandingConfigContext";

const ChyrRevenueCTA = () => {
  const { config } = useLandingConfig();
  return (
    <section
      className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Background Atmosphere */}

      <CommonWrapper>
        <div
          className="relative z-10 text-center flex flex-col items-center"
          data-aos="zoom-in"
        >
          <h2 className="font-dm-sans font-medium text-2xl md:text-[40px] lg:text-[48px] text-white mb-6 leading-tight text-center px-4">
            Ready to stop losing revenue?
          </h2>

          <p className="font-dm-sans text-base md:text-xl lg:text-2xl text-[#9E9E9E] max-w-[900px] mb-10 md:mb-12 leading-normal text-center px-4">
            Get set up within minutes and start answering every call, capturing
            every lead, and maximizing your business potential.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-5 mb-6 md:mb-8 w-full sm:w-auto">
            <button
              className="relative group w-full sm:w-auto px-6 py-2 md:py-4 hidden  md:flex justify-center items-center gap-3.5 rounded-[14px]  shadow-[0_4px_6px_0_rgba(255,255,255,0.19)] cursor-pointer text-white text-lg font-normal leading-normal hover:opacity-90 transition-all whitespace-nowrap overflow-hidden"
              style={{
                borderRadius: "20px",
                border: config.brandName === "CHYR" ? "1px solid rgba(255, 255, 255, 0.19)" : "none",
                background: config.colors.revenueCTAGradient,
                boxShadow: "0 4px 18px 0 rgba(99, 5, 113, 0.50)",
              }}
            >
              {/* TOP BORDER GRADIENT */}
              <div
                className="absolute top-0 left-0 w-full h-[2px] opacity-70 "
                style={{
                  background:
                    "linear-gradient(to right, #6b7280, #FFFFFF, #6b7280)",
                }}
              />
              Start Free Trial
            </button>

            <button className="hidden md:flex w-full sm:w-auto px-8 md:px-10 py-2 md:py-3.5 rounded-full md:rounded-[12px] border-2 border-white/50 bg-white/10 backdrop-blur-md text-white font-dm-sans font-bold text-base md:text-lg hover:bg-white/20 transition-all active:scale-95 min-w-[200px] cursor-pointer">
              Talk to Sales
            </button>


            {/* for phone  */}
            <button
                    className={`relative flex md:hidden group w-full sm:w-auto px-6 py-2  justify-center items-center gap-3.5 rounded-full shadow-[0_4px_6px_0_rgba(255,255,255,0.19)] cursor-pointer text-white text-lg font-normal leading-normal hover:opacity-90 hover:shadow-none transition-all whitespace-nowrap overflow-hidden ${config.colors.brandColor} ${config.brandName === "Avriance" ? "border border-white/20" : ""}`}
                  >

                    Start Free Trial

                  </button>
            <button
              className="w-full sm:w-auto  flex md:hidden items-center justify-center gap-2 px-7 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 hover:border-white/40 transition-all cursor-pointer font-body text-[15px]">Talk to Sales</button>
          </div>

          <p className="text-white/80 font-geist text-sm md:text-base drop-shadow-sm text-center px-4">
            Get set up instantly · Cancel anytime
          </p>
        </div>
      </CommonWrapper>
    </section>
  );
};

export default ChyrRevenueCTA;
