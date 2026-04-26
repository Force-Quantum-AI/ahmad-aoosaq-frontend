import CommonWrapper from "@/common/CommonWrapper";

// import healthLogos from "@/assets/images/health.png";
import Marquee from "react-fast-marquee";

const images: string[] = [
  "https://cdn.prod.website-files.com/694d1ac7dc0a1e269d102252/69567904d94b315853c6836d_9yAkNdlJs00OuBIBLdcEoOjY3wk.avif",
  "https://cdn.prod.website-files.com/694d1ac7dc0a1e269d102252/6956786885464d08f8514735_j8LlUKTJVsvmFQxYNEKVm6wcqA0.avif",
  "https://cdn.prod.website-files.com/694d1ac7dc0a1e269d102252/69803bfb0b2dbf2dc7e218fe_image%20(13)%201-p-1600.png",
];

import { useLandingConfig } from "@/contexts/LandingConfigContext";

const ChyrBusinessMiss = () => {
  const { config } = useLandingConfig();

  return (
    <>
      {/* Top Text Segment */}
      <div className=" bg-black py-8 md:py-4 text-center">
        <p className="px-3 font-geist text-[14px] md:text-[18px] font-normal leading-relaxed md:leading-normal text-[#9E9E9E]">
          {config.texts.businessMiss.sentence}
        </p>
      </div>

      <section className="py-10 md:py-20 bg-[#0A0A0A] hidden md:block">
        <CommonWrapper>
          <div className="flex flex-col items-center text-center space-y-10 md:space-y-[60px]">

            {/* Bottom Text Segment */}
            <div className="hidden md:block">
              <h2 className="text-xl md:text-[24px] font-normal leading-tight md:leading-normal text-white font-geist">
                {config.texts.businessMiss.title}
              </h2>
            </div>

            {/* Logos Image */}
            <Marquee
              gradient
              gradientColor="#0A0A0A"
              gradientWidth={200}
              pauseOnHover
              autoFill
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className="h-[100px] w-[100px] flex items-center justify-center mx-6"
                >
                  <img
                    src={image}
                    alt=""
                    className="w-full h-full object-contain  invert"
                  />
                </div>
              ))}
            </Marquee>
          </div>
        </CommonWrapper>
      </section>
    </>
  );
};

export default ChyrBusinessMiss;
