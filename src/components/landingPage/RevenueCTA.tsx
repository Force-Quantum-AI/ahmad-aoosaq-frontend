import CommonWrapper from "@/common/CommonWrapper";
import bgImage from "@/assets/images/ready.png";

const RevenueCTA = () => {
  return (
    <section
      className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Background Atmosphere */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-50"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 w-full h-full blur-[100px] transform translate-x-[20%] scale-110"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #983E90 20%, #2C50A1 50%, #52C0D8 100%)",
          }}
        />
      </div>

      <CommonWrapper>
        <div className="relative z-10 text-center flex flex-col items-center" data-aos="zoom-in">
          <h2 className="font-dm-sans font-medium text-[28px] md:text-[40px] lg:text-[48px] text-black mb-6 leading-tight text-center px-4">
            Ready to stop losing revenue?
          </h2>

          <p className="font-dm-sans text-lg md:text-xl lg:text-2xl text-[#555] max-w-[900px] mb-10 md:mb-12 leading-normal text-center px-4">
            Get set up within minutes and start answering every call, capturing
            every lead, and maximizing your business potential.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-5 mb-6 md:mb-8 w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 rounded-[12px] bg-[linear-gradient(270deg,#00EEFF_0%,#1B4ED8_100%)] text-white font-dm-sans font-bold text-base md:text-lg hover:shadow-lg transition-all active:scale-95 min-w-[200px] cursor-pointer">
              Start Free Trial
            </button>

            <button className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 rounded-[12px] border-2 border-white bg-white/10 backdrop-blur-md text-white font-dm-sans font-bold text-base md:text-lg hover:bg-white/20 transition-all active:scale-95 min-w-[200px] cursor-pointer">
              Talk to Sales
            </button>
          </div>

          <p className="text-white font-geist text-sm md:text-base drop-shadow-sm text-center px-4">
            Get set up instantly · Cancel anytime
          </p>
        </div>
      </CommonWrapper>
    </section>
  );
};

export default RevenueCTA;