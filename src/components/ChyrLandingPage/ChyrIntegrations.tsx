import CommonWrapper from "@/common/CommonWrapper";
import epicLogo from "@/assets/logo/epic.png";
import cernerLogo from "@/assets/logo/cerner.png";
import simpleLogo from "@/assets/logo/simple.png";
import zocdocLogo from "@/assets/logo/zocdoc.png";
import chronoLogo from "@/assets/logo/chrono.png";
import athenaLogo from "@/assets/logo/athena.png";
// import hylnLogo from "@/assets/images/chyrImage/momo.png";
import { Sparkles } from "lucide-react";
import Marquee from "react-fast-marquee";
import { useLandingConfig } from "@/contexts/LandingConfigContext";

import { CHYRIcon, AVRIANCEIcon, NOHMIcon } from "@/assets/logo/BrandLogoNew";

const IntegrationCenterLogo = () => {
  const { config } = useLandingConfig();

  const renderLogo = () => {
    if (config.brandName === "Chyr") return <CHYRIcon />;
    if (config.brandName === "Avriance") return <AVRIANCEIcon />;
    if (config.brandName === "Nohm") return <NOHMIcon />;
    return null;
  };

  return (
    <div className="relative flex items-center justify-center">
      
      {/* Outer Glow Ring */}
      <div className={`absolute w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-full blur-2xl`} />

      {/* Middle Ring */}
      {/* <div className="absolute w-[240px] h-[240px] md:w-[280px] md:h-[280px] rounded-full border border-[#f59e0b]/30" /> */}

      {/* Inner Ring */}
      <div className="absolute w-[200px] h-[200px] md:w-[240px] md:h-[240px] bg-black rounded-full border-3 border-[#F1B4481A]" />

      {/* Main Circle */}
      <div className="relative w-[160px] h-[160px] md:w-[200px] md:h-[200px] rounded-full bg-black border-3 border-[#F1B4481A] flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.15)]">


        {/* Logo */}
        <div className="scale-90 md:scale-100 relative p-2">
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gray-400" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gray-400" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-gray-400" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gray-400" />
          {renderLogo()}
        </div>
      </div>
    </div>
  );
};


const ChyrIntegrations = () => {
  const { config } = useLandingConfig();

  const logos = [
    { src: zocdocLogo, alt: "Foodics" },
    { src: chronoLogo, alt: "Square" },
    { src: athenaLogo, alt: "Toast" },
    { src: epicLogo, alt: "Google Calendar" },
  ];
  const logos2 = [
    { src: cernerLogo, alt: "WhatsApp" },
    { src: simpleLogo, alt: "OpenTable" },
    { src: zocdocLogo, alt: "Resy" },
    { src: chronoLogo, alt: "Zapier" },
  ];

  return (
    <section className="py-0 md:py-10 bg-[#0a0a0a] overflow-hidden">
      <CommonWrapper>
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-0 md:mb-10 px-4">
          <div
            className={`flex items-center gap-2 px-4.5 py-2 md:py-2.5 rounded-[20px] border border-[${config.colors.primaryHex}] mb-6 shadow-[0_0_10px_rgba(27,240,255,0.1)]`} style={{ borderColor: config.colors.primaryHex }}
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <Sparkles size={16} className={config.colors.primaryStyle} />
            <span className={`${config.colors.primaryHost} font-geist font-medium text-xs md:text-base`}>
              Integrations
            </span>
          </div>

          <h2
            data-aos="fade-up"
            data-aos-delay="500"
            className="font-dm-sans font-medium text-[32px] md:text-[48px] leading-tight text-white max-w-[800px]"
          >
            Works with your{" "}
            <span className={config.colors.primaryHost}>{config.texts.integrations.titleSuffix}</span>
          </h2>
        </div>

        {/* Logos Layout */}
        <div className="relative flex items-center justify-center min-h-[250px] md:min-h-[400px]">
          {/* Restaurant Logo Cards - Horizontal row with scroll on mobile */}
          <div className="flex items-center py-3 md:py-10 w-full justify-between">
            <Marquee pauseOnHover autoFill speed={15} direction="right">
              {logos.map((logo, idx) => (
                <div
                  key={idx}
                  className="mx-2 my-3 w-[100px] h-[80px] md:w-[198px] md:h-[168px] shrink-0 border-2 border-[#F1B4481A] rounded-[15.141px] bg-[rgba(22, 22, 22, 0.50)] flex items-center justify-center p-6  transition-transform hover:scale-105"
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="max-w-full max-h-full object-contain invert"
                  />
                </div>
              ))}
            </Marquee>
            <Marquee pauseOnHover autoFill speed={15} direction="left">
              {logos2.map((logo, idx) => (
                <div
                  key={idx}
                  className="mx-2 my-3 w-[100px] h-[80px] md:w-[198px] md:h-[168px] shrink-0 border-2 border-[#F1B4481A] rounded-[15.141px] bg-[rgba(22, 22, 22, 0.50)] flex items-center justify-center p-6  transition-transform hover:scale-105"
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="max-w-full max-h-full object-contain invert"
                  />
                </div>
              ))}
            </Marquee>
          </div>

          {/* Central Logo Overlay here */}
          {/* <div
            data-aos="zoom-out"
            className="absolute left-1/2 top-1/2  -translate-x-1/2 -translate-y-1/2 hover:scale-105 transition-all duration-500 z-20 "
          >
            <img
              src={config.assets.integrationImg}
              alt="Hyln"
              className="w-[280px] h-[280px] md:w-[315px] md:h-[315px] object-contain "
            />
            <img
              src={hylnLogo}
              alt="Hyln"
              className="w-[280px] h-[280px] md:w-[315px] md:h-[315px] object-contain "
            /> 
          </div> */}
          <div
  data-aos="zoom-out"
  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hover:scale-105 transition-all duration-500 z-20"
>
  <IntegrationCenterLogo />
</div>
        </div>
      </CommonWrapper>
    </section>
  );
};

export default ChyrIntegrations;
