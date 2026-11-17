import { useState } from "react";
import CommonWrapper from "@/common/CommonWrapper";
import { Check, Volume2 } from "lucide-react";
import mindIcon from "@/assets/icon/mind.png";
import calendarIcon from "@/assets/icon/calendar.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StaticSwitch = ({
  defaultChecked = true,
}: {
  defaultChecked?: boolean;
}) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div
      onClick={() => setChecked(!checked)}
      className={`h-[34px] w-[62px] px-[3px] rounded-[20px] transition-all cursor-pointer flex items-center ${checked
        ? "bg-[radial-gradient(169.18%_110.09%_at_71.56%_88.75%,_#00C7D5_18.27%,_#0011ED_99.62%)] justify-end"
        : "bg-[#9E9E9E] justify-start"
        }`}
    >
      <div className="size-[28px] rounded-full bg-white transition-all shadow-sm" />
    </div>
  );
};

const CustomizeHyln = () => {
  const [activeTab, setActiveTab] = useState("Voice & Greeting");

  const tabs = ["Voice & Greeting", "Services", "FAQ", "Settings"];

  return (
    <section className="pb-20 bg-white overflow-hidden">
      <CommonWrapper>
        <div data-aos="zoom-in" className="flex flex-col lg:flex-row items-center gap-[50px] p-4 sm:p-10 bg-[#FAFBFB] rounded-[20px] shadow-[0_0_14px_0_rgba(0,0,0,0.06)]">
          {/* Left Section - Description */}
          <div className="w-full lg:w-5/12" data-aos="fade-right" data-aos-delay="600">
            <span className="text-[#0BEFFF] text-lg font-medium mb-4 block">
              Step 2
            </span>
            <h2 className="font-dm-sans font-medium text-[32px] md:text-[48px] leading-tight text-black mb-6">
              Customize how Hyln answers
            </h2>
            <p className="text-[#555] font-dm-sans text-lg mb-10 leading-relaxed">
              Choose your voice, set your greeting, and tell Hyln what to ask
              callers — so every call sounds exactly like your front desk.
            </p>

            <div className="space-y-6">
              {[
                {
                  title: "Pick your voice — ",
                  content: "Friendly, professional, or somewhere in between",
                },
                {
                  title: "Add intake questions — ",
                  content:
                    "Ask about allergies, preferences, or anything you need",
                },
                {
                  title: "Connect integrations — ",
                  content: "MindBody, Square, Vagaro, and more",
                },
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <div className="w-5 h-5 rounded-full bg-[#E8FEFF] flex items-center justify-center">
                      <Check
                        className="text-[#0BEFFF]"
                        size={14}
                        strokeWidth={3}
                      />
                    </div>
                  </div>
                  <p className="font-dm-sans text-lg leading-snug">
                    <span className="text-black font-medium">{step.title}</span>
                    <span className="text-[#555]">{step.content}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section - Settings Card */}
          <div data-aos="fade-left" data-aos-delay="600" className="w-full lg:w-[800px] max-h-[650px]! bg-[#FBF4FF] rounded-[20px] p-3 sm:p-6 flex flex-col">
            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-[#E0E0E0] mb-4 pb-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-geist text-lg font-normal pb-4 relative transition-colors cursor-pointer ${activeTab === tab
                    ? "bg-[radial-gradient(169.18%_110.09%_at_71.56%_88.75%,_#00C7D5_18.27%,_#0011ED_99.62%)] bg-clip-text text-transparent"
                    : "text-[#9E9E9E]"
                    }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0011ED]"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Settings Content */}
            <div className="space-y-2 flex-grow">
              {/* Voice Selection */}
              <div className="space-y-4">
                <label className="block text-[#0011ED] text-base font-medium">
                  Voice
                </label>
                <Select defaultValue="kora">
                  <SelectTrigger className="w-full bg-white border-none rounded-[30px] h-[54px] px-6 text-lg font-geist text-black shadow-sm focus:ring-0">
                    <div className="flex items-center gap-3">
                      <Volume2 size={20} className="text-[#9E9E9E]" />
                      <SelectValue placeholder="Select a voice" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="kora">Kora</SelectItem>
                    <SelectItem value="james">James</SelectItem>
                    <SelectItem value="emma">Emma</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Greeting */}
              <div className="space-y-4">
                <label className="block text-black text-lg font-medium font-geist">
                  Greeting sdfwerwe
                </label>
                <div className="bg-white p-6 rounded-[20px] shadow-sm">
                  <p className="text-[#555] text-lg font-geist leading-relaxed">
                    “Thank you for calling [Clinic Name]. This is [Name]. How
                    may I assist you today?”
                  </p>
                </div>
              </div>

              {/* Services */}
              <div className="space-y-4">
                <label className="block text-black text-lg font-medium font-geist">
                  Services
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    "Book Appointment",
                    "Prescription Refill",
                    "Lab Results",
                    "Billing",
                    "Doctor Availability",
                  ].map((service) => (
                    <button
                      key={service}
                      className="bg-[#212121] text-white px-[14px] py-[10px] rounded-[30px] text-lg font-geist flex items-center gap-1 cursor-pointer hover:bg-black transition-colors"
                    >
                      {service}
                    </button>
                  ))}
                  <button className="bg-[#F0F0F0] text-[#9E9E9E] px-[14px] py-[10px] rounded-[30px] text-lg font-geist">
                    +4 more
                  </button>
                </div>
              </div>

              {/* Intake Questions */}
              <div className="space-y-4">
                <label className="block text-black text-lg font-medium font-geist">
                  Intake Questions
                </label>
                <div className="space-y-3">
                  {[
                    "1. Have you visited us before?",
                    "2. What symptoms are you experiencing?",
                  ].map((q, i) => (
                    <div
                      key={i}
                      className="bg-white px-5 py-[10px] rounded-[20px] flex items-center border border-[#D0D0D0]/30 shadow-sm"
                    >
                      <p className="text-[#555] text-[20px] font-geist font-normal">
                        {q}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-black text-lg font-medium font-geist">
                  Call Transfer
                </label>
                <div className="flex items-center justify-between px-6 py-8 border border-[#DADADA] rounded-[20px] bg-white/50">
                  <p className="text-[#555] text-lg font-geist">
                    Transfer urgent calls to (555) 123-4567
                  </p>
                  <StaticSwitch />
                </div>
              </div>

              {/* Integrations */}
              <div className="space-y-4 pt-4 border-t border-[#E0E0E0]">
                <label className="block text-black text-lg font-medium font-geist">
                  Integrations
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="bg-white px-[14px] py-[10px] rounded-[30px] flex items-center gap-2.5 shadow-sm border border-[#F0F0F0]">
                    <img
                      src={mindIcon}
                      alt="Mindbody"
                      className="w-6 h-6 object-contain"
                    />
                    <span className="text-black text-lg font-geist">
                      Mindbody
                    </span>
                    <div className="w-5 h-5 rounded-full border border-black flex items-center justify-center">
                      <Check size={12} className="text-black" strokeWidth={3} />
                    </div>
                  </div>
                  <div className="bg-white px-[14px] py-[10px] rounded-[30px] flex items-center gap-2.5 shadow-sm border border-[#F0F0F0]">
                    <img
                      src={calendarIcon}
                      alt="Google calendar"
                      className="w-6 h-6 object-contain"
                    />
                    <span className="text-black text-lg font-geist">
                      Google calendar
                    </span>
                  </div>
                  <div className="bg-[#F0F0F0] text-[#9E9E9E] px-4 py-2 rounded-[30px] text-lg font-geist">
                    +4
                  </div>
                </div>
              </div>

              {/* Spam Filter & Recording */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex items-center justify-between p-4 border border-[#DADADA] rounded-[20px] bg-white/50">
                  <span className="text-[#555] text-lg font-geist">
                    Spam Filter
                  </span>
                  <StaticSwitch />
                </div>
                <div className="flex-1 flex items-center justify-between p-4 border border-[#DADADA] rounded-[20px] bg-white/50">
                  <span className="text-[#555] text-lg font-geist">
                    Recording
                  </span>
                  <StaticSwitch />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CommonWrapper>
    </section>
  );
};

export default CustomizeHyln;
