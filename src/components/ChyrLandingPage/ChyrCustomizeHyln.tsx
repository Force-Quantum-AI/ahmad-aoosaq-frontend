
import { useState } from "react";
import CommonWrapper from "@/common/CommonWrapper";
import { Check, CircleAlert, Volume2 } from "lucide-react";
import calendarIcon from "@/assets/images/chyrImage/google.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      className={`hidden h-[20px] md:h-[26px] w-[40px] md:w-[48px] px-[2px] rounded-[20px] transition-all cursor-pointer md:flex items-center ${checked
        ? "justify-end"
        : "bg-[#9E9E9E] justify-start"
        }`}
      style={checked ? { background: "linear-gradient(to right, #F1A34C 18.27%, #543597 99.62%)" } : {}}
    >
      <div className="h-[16px] md:h-[22px] w-[16px] md:w-[22px] rounded-full bg-white transition-all shadow-sm" />
    </div>
    <div
      onClick={() => setChecked(!checked)}
      className={`flex h-[20px] md:h-[26px] w-[40px] md:w-[48px] px-[2px] rounded-[20px] transition-all cursor-pointer md:hidden items-center ${checked
        ? "justify-end"
        : "bg-[#9E9E9E] justify-start"
        }`}
      style={checked ? { background: config.colors.brandColorHex } : {}}
    >
      <div className="h-[16px] md:h-[22px] w-[16px] md:w-[22px] rounded-full bg-white transition-all shadow-sm" />
    </div>
    </>
  );
};

const ChyrCustomizeHyln = () => {
  const { config } = useLandingConfig();
  const [activeTab, setActiveTab] = useState("Voice & Greeting");

  const tabs = ["Voice & Greeting", "Questions", "Menu", "Settings"];

  return (
    <section className=" bg-[#0a0a0a] overflow-hidden">
      <CommonWrapper>
        <div
          data-aos="zoom-in"
          className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16 p-2 sm:p-10 bg-[rgba(16,16,16,0.80)] rounded-[20px] shadow-[0_0_14px_0_rgba(0,0,0,0.06)] max-w-6xl mx-auto"
        >
          {/* Left Section - Description (Text LEFT) */}
          <div
            className="w-full max-w-[480px] mx-auto order-1 lg:order-1"
            data-aos="fade-right"
            data-aos-delay="600"
          >
            <span className={`${config.colors.primaryHost} text-sm md:text-lg font-medium mb-4 block`}>
              Step 2
            </span>
            <h2 className="font-dm-sans font-medium text-[28px] md:text-[36px] leading-tight text-white mb-6">
              {config.texts.customizeHyln.title}
            </h2>
            <p className="text-[#9E9E9E] font-dm-sans text-base md:text-lg mb-10 leading-relaxed">
              {config.texts.customizeHyln.desc}
            </p>

            <div className="space-y-6">
              {config.texts.customizeHyln.steps.map((step, idx) => (
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

          {/* Right Section - Settings Card (Mockup RIGHT) */}
          <div
            data-aos="fade-left"
            data-aos-delay="600"
            className="w-full max-w-[420px] mx-auto order-2 lg:order-2 bg-[#121214] rounded-[20px] p-5 sm:p-6 flex flex-col shadow-[inset_0_-18px_52px_0_#190F48] pointer-events-none"
          >
            {/* Tabs */}
            <div className=" flex items-center gap-3 border-b border-[#333] mb-4 pb-0.5 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <>
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`hidden md:block font-geist text-xs font-normal pb-2.5 relative transition-colors cursor-pointer whitespace-nowrap ${activeTab === tab
                    ? "bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent"
                    : "text-[#9E9E9E]"
                    }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400"></div>
                  )}
                </button>
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={` md:hidden font-geist text-xs font-normal pb-2.5 relative transition-colors cursor-pointer whitespace-nowrap ${activeTab === tab
                    ? config.colors.primaryStyle
                    : "text-[#9E9E9E]"
                    }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className={`absolute bottom-0 left-0 w-full h-[2px] ${config.colors.primaryStyle}`}></div>
                  )}
                </button>
                </>
              ))}
            </div>

            {/* Settings Content */}
            <div className="space-y-4 flex-grow overflow-hidden">
              {/* Voice Selection */}
              <div className="space-y-1.5">
                <label className="hidden md:inline-block bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent text-xs font-medium">
                  Voice
                </label>
                <label className={`${config.colors.primaryStyle} md:hidden  text-xs font-medium`}>
                  Voice
                </label>
                <Select defaultValue="kora">
                  <SelectTrigger className="w-full bg-[#212121] border-none rounded-[14px] h-[40px] px-4 text-sm font-geist text-white shadow-sm focus:ring-0">
                    <div className="flex items-center gap-2">
                      <Volume2 size={14} className="text-white" />
                      <SelectValue placeholder="Select a voice" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="kora">Kora (Friendly)</SelectItem>
                    <SelectItem value="james">James</SelectItem>
                    <SelectItem value="emma">Emma</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Greeting */}
              <div className="space-y-1.5">
                <label className="block text-white text-xs font-medium font-geist">
                  Greeting
                </label>
                <div className="bg-[#212121] p-3.5 rounded-[14px] shadow-sm">
                  <p className="text-[#9E9E9E] text-xs font-geist leading-relaxed">
                    {config.texts.customizeHyln.greeting}
                  </p>
                </div>
              </div>

              {/* Services / Menu */}
              <div className="space-y-1.5">
                <label className="block text-white text-xs font-medium font-geist">
                  {config.texts.customizeHyln.servicesLabel}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {config.texts.customizeHyln.services.map((service) => (
                    <button
                      key={service}
                      className="bg-[#212121] text-white px-3 py-1.5 rounded-[14px] text-xs font-geist flex items-center gap-1 cursor-pointer hover:bg-black transition-colors"
                    >
                      {service}
                    </button>
                  ))}
                  <button className="bg-[#212121] text-[#9E9E9E] px-3 py-1.5 rounded-[14px] text-xs font-geist">
                    +2 more
                  </button>
                </div>
              </div>

              {/* Intake Questions */}
              <div className="space-y-1.5">
                <label className="block text-white text-xs font-medium font-geist">
                  Intake Questions
                </label>
                <div className="space-y-1.5">
                  {config.texts.customizeHyln.intakeQuestions.map((q, i) => (
                    <div
                      key={i}
                      className="bg-transparent px-3.5 py-2.5 rounded-[12px] flex items-center border border-[#21184B] shadow-sm"
                    >
                      <p className="text-[#9E9E9E] text-xs font-geist font-normal">
                        {q}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-white text-xs font-medium font-geist">
                  Call Transfer
                </label>
                <div className="flex items-center justify-between px-3.5 py-2.5 border border-white/10 rounded-[12px] bg-transparent">
                  <p className="flex items-center text-[#9E9E9E] text-xs font-geist gap-1.5">
                    <CircleAlert size={13} className={config.colors.primaryStyle} />{" "}
                    {config.texts.customizeHyln.transferText}
                  </p>
                  <StaticSwitch />
                </div>
              </div>

              {/* Integrations */}
              <div className="space-y-1.5 pt-3 border-t border-white/10">
                <label className="block text-white text-xs font-medium font-geist">
                  Integrations
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="bg-[#212121]/30 text-white px-3 py-1.5 rounded-[14px] flex items-center gap-1.5 shadow-sm">
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                    <span className="text-[#9E9E9E] text-xs font-geist">
                      {config.texts.customizeHyln.integration1Name}
                    </span>
                    <div className="w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center ml-1">
                      <Check size={8} className="text-white" strokeWidth={3} />
                    </div>
                  </div>
                  <div className="bg-[#212121]/30 text-white px-3 py-1.5 rounded-[14px] flex items-center gap-1.5 shadow-sm whitespace-nowrap">
                    <img
                      src={calendarIcon}
                      alt="Google calendar"
                      className="w-4 h-4 object-contain"
                    />
                    <span className="text-[#9E9E9E] text-xs font-geist">
                      Calendar
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-white text-[12px]">
                <div className="flex justify-between items-center bg-black p-2 rounded-[12px]">
                  Spam Filter <StaticSwitch />
                </div>
                <div className="flex justify-between items-center bg-black p-2 rounded-[12px]">
                  Recording <StaticSwitch />
                </div>
              </div>

            </div>
          </div>
        </div>
      </CommonWrapper>
    </section>
  );
};

export default ChyrCustomizeHyln;