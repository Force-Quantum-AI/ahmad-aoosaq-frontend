import { useState } from "react";
import CommonWrapper from "@/common/CommonWrapper";
import { Plus, Minus } from "lucide-react";

import { useLandingConfig } from "@/contexts/LandingConfigContext";

const ChyrFAQ = () => {
  const { config } = useLandingConfig();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = config.texts.faq.list.map((item) => ({
    question: item.trigger,
    answer: item.content
  }));

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-6 md:py-10 bg-[#0a0a0a] overflow-hidden">
      <CommonWrapper>
        <div className="text-center mb-16 lg:mb-20" data-aos="fade-up">
          <h2 className="font-dm-sans font-medium text-[32px] md:text-[48px] leading-tight text-center mb-6">
            <span className="text-white">Frequently </span>
            <span className={`text-[${config.colors.secondaryHex}]`} style={{ color: config.colors.secondaryHex }}>Asked Questions</span>
          </h2>
          <p className="text-[#9E9E9E] font-dm-sans text-base md:text-2xl font-normal text-center max-w-[900px] mx-auto leading-normal px-4">
            {config.texts.faq.subtitle}
          </p>
        </div>

        <div className="w-full mx-auto px-2 space-y-4" data-aos="fade-up">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="px-4 md:px-5 border-2 border-[#F0F0F0]/10 rounded-[20px] "
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full py-4 md:py-9 flex items-center justify-between text-left group transition-all cursor-pointer"
              >
                <span
                  className={`text-[14px] md:text-[24px] font-dm-sans  transition-colors ${openIndex === idx ? `text-[${config.colors.secondaryHex}]` : "text-white"}`}
                  style={openIndex === idx ? { color: config.colors.secondaryHex } : {}}
                >
                  {faq.question}
                </span>
                <div className="flex-shrink-0 ml-4">
                  {openIndex === idx ? (
                    <Minus className={`text-[${config.colors.secondaryHex}]`} style={{ color: config.colors.secondaryHex }} size={24} />
                  ) : (
                    <Plus
                      className={`text-[${config.colors.secondaryHex}] hover:text-[${config.colors.secondaryHex}] transition-colors`}
                      style={{ color: config.colors.secondaryHex }}
                      size={24}
                    />
                  )}
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx
                  ? "max-h-[500px] opacity-100 pb-8 md:pb-10"
                  : "max-h-0 opacity-0"
                  }`}
              >
                <p className="text-[#555] font-dm-sans text-xs md:text-xl leading-relaxed max-w-[1000px]">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CommonWrapper>
    </section>
  );
};

export default ChyrFAQ;
