import CommonWrapper from "@/common/CommonWrapper";
import { AudioLines, Dot, MoveRight } from "lucide-react";
import CountUp from 'react-countup';

import ChyrHylnPhoneUI from "./ChyrHylnPhoneUI";
import ChyrDemoAudioPlayer from "./ChyrDemoAudioPlayer";
import BookDemoModal from "@/pages/BookDemoModal";
import { useState } from "react";
// import DemoAudioPlayer from "./DemoAudioPlayer";
// import HylnPhoneUI from "./HylnPhoneUI";

import { useLandingConfig } from "@/contexts/LandingConfigContext";

const ChyrTryLiveDemo = () => {
  const { config } = useLandingConfig();
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const Button1Icon = config.texts.tryLiveDemo.button1Icon;
  //const Button2Icon = config.texts.tryLiveDemo.button2Icon;

  return (
    <section className=" bg-[#0A0A0A] overflow-hidden">
      <CommonWrapper>
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          {/* Left Card - Try Hyln AI */}
          <div
            data-aos="fade-right"
            className="w-full lg:w-1/2 min-h-min lg:min-h-[852px] rounded-[20px] bg-[rgba(10, 10, 10, 0.80)] backdrop-blur-[12px] p-2 sm:p-10 lg:pt-[47px] lg:px-[49px] lg:pb-[117px] flex flex-col items-center"
          >
            <div className="w-full flex justify-start mb-10 lg:mb-20">
              <button
                className={`inline-flex items-center gap-2.5 p-2.5 rounded-[10px] mx-auto md:mx-0 border border-[${config.colors.brandColorHex}] text-[${config.colors.brandColorHex}] text-base font-normal`}
                style={{ borderColor: config.colors.brandColorHex, color: config.colors.brandColorHex }}
              >
                <Button1Icon size={24} />
                {config.texts.tryLiveDemo.button1Text}
              </button>
            </div>
            <div className="w-full flex justify-center">
              <ChyrHylnPhoneUI />
            </div>
          </div>

          {/* Right Card - Live Demo */}
          <div
            data-aos="fade-left"
            className="w-full lg:w-1/2 min-h-min lg:min-h-[852px] rounded-[20px] bg-[rgba(10, 10, 10, 0.80)] backdrop-blur-[12px] p-2 sm:p-10 lg:pt-[47px] lg:px-[49px] lg:pb-[117px] flex flex-col items-center"
          >
            <div className="w-full flex justify-start mt-6 md:mt-0 mb-3 md:mb-10 lg:mb-15">
              <button
                className={`inline-flex items-center gap-2.5 px-2 py-1 md:p-2.5 rounded-[10px] mx-auto md:mx-0 border border-[${config.colors.brandColorHex}] text-[${config.colors.brandColorHex}] text-[14px] md:text-base font-normal`}
                style={{ borderColor: config.colors.brandColorHex, color: config.colors.brandColorHex }}
              >
                <AudioLines size={24} className="hidden md:block" />
                <AudioLines size={15} className="md:hidden" />
                {config.texts.tryLiveDemo.button2Text}
              </button>
            </div>

            <div className="w-full space-y-10 lg:space-y-[20px] flex flex-col items-center">
              <h3 className="hidden md:block text-[#CDCDCD] text-[20px] sm:text-[24px] md:text-lg font-normal leading-relaxed text-left lg:text-left w-full font-geist">
                {config.texts.tryLiveDemo.description}
              </h3>
              <h2 className="md:hidden text-white text-center text-xl "
                style={{ fontWeight: 700 }}
              >
                Hear {config.brandName} <br />
                <span style={{ color: config.colors.brandColorHex }}>in Action</span>
              </h2>
              <div className="w-full flex justify-center">
                <ChyrDemoAudioPlayer
                  src="/demoCallSound.mp3"
                  title="Sample call recording"
                  label={`Hear ${config.brandName} In Action`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="w-full flex justify-center mt-4 md:mt-1 px-2" onClick={() => setIsBookModalOpen(true)}>
          <button className={`${config.colors.brandColor} md:bg-white text-white md:text-black  w-full max-w-[200px] md:max-w-[327px] sm:w-auto px-8 py-3 md:py-4 rounded-xl text-sm md:text-lg font-medium flex items-center justify-center gap-3 hover:opacity-90 transition-colors cursor-pointer group`}>
            Book a Demo
            <MoveRight
              size={24}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
        <p className="md:hidden text-gray-400 text-xs text-center py-3 mr-3 flex items-center justify-center">
            <Dot className={`text-green-600 animate-pulse`} size={30}/> 
            <div className="flex gap-1">
            <CountUp end={27} duration={10}/> {"  "}operators booked a call this week
            </div>
          </p>
      </CommonWrapper>
      <BookDemoModal open={isBookModalOpen} setOpen={setIsBookModalOpen} />
    </section>
  );
};

export default ChyrTryLiveDemo;
