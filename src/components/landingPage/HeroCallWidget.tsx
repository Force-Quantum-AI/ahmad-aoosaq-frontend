import { Phone, Mic, Calendar, MessageSquare, Clock, CircleCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const glassGradient = "radial-gradient(83.7% 77.99% at 50% 27.69%, rgba(95, 214, 246, 0.40) 0%, rgba(43, 130, 200, 0.40) 75.09%, rgba(114, 43, 200, 0.40) 100%)";

export default function HeroCallWidget() {
  const leftCard1 = useRef<HTMLDivElement>(null);
  const leftCard2 = useRef<HTMLDivElement>(null);
  const leftCard3 = useRef<HTMLDivElement>(null);
  const leftCard4 = useRef<HTMLDivElement>(null);
  const leftCard5 = useRef<HTMLDivElement>(null);

  const rightCard = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      // for left side animation 
      const tl = gsap.timeline();
      tl.fromTo(
        leftCard1.current,
        { y: -20, opacity: 0 },
        {
          y: 0, opacity: 1, ease: "power2.out",
        }
      )
      // .fromTo(
      //   leftCard2.current,
      //   { y: -20, opacity: 0 },
      //   {
      //     y: 0, opacity: 1, ease: "power2.out",
      //   }
      // )
      // .fromTo(
      //   leftCard3.current,
      //   { y: -20, opacity: 0 },
      //   {
      //     y: 0, opacity: 1, ease: "power2.out",
      //   }
      // )
      // .fromTo(
      //   leftCard4.current,
      //   { y: -20, opacity: 0 },
      //   {
      //     y: 0, opacity: 1, ease: "power2.out",
      //   }
      // )
      // .fromTo(
      //   leftCard5.current,
      //   { y: -20, opacity: 0 },
      //   {
      //     y: 0, opacity: 1, ease: "power2.out",
      //   }
      // )


      // for right side animation 
      gsap.fromTo(
        rightCard.current,
        { y: 0 },
        {
          y: -22,
          duration: 3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true
        }
      );
    });

    return () => ctx.revert();
  }, [])
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center justify-center lg:justify-between py-3 mx-auto w-full max-w-[550px]">
      {/* LEFT COLUMN */}
      <div className="flex flex-col items-center gap-4">

        {/* Talk to Hyln Live Card */}
        <div
          className="flex w-full max-w-[248px] p-[22px_27px] flex-col justify-center items-center gap-3 rounded-[20px] backdrop-blur-[52px]"
          style={{ background: glassGradient }}
          ref={leftCard1}
        >
          <h3 className="text-white text-center font-['Geist',sans-serif] text-[18px] font-semibold leading-normal m-0">
            Talk to Hyln Live
          </h3>

          {/* Mic Icon */}
          <div className="flex w-[63px] h-[63px] p-[18px_17px] justify-center items-center gap-[10px] rounded-[39.5px] bg-[#D4F3FF] shadow-[0_0_64px_0_#00E6F6] box-border">
            <Mic className="text-[#0011ED] w-7 h-7" />
          </div>

          {/* Tap to start */}
          <p className="flex items-center gap-1.5 m-0 text-white font-['Geist',sans-serif] text-base font-normal leading-normal">
            <span className="w-2 h-2 rounded-full bg-[#37D906] shrink-0" />
            Tap to start.
          </p>

          <p className="text-[#555555] font-['Geist',sans-serif] text-sm font-normal leading-normal text-center">
            Or call <span className="text-white font-semibold">(650) 719-1267</span>
          </p>

          {/* Ask Hyln Button */}
          <div className="flex p-[10px_0] justify-center items-center gap-2.5 self-stretch rounded-[10px] bg-[#6AA7D8]/40">
            <span className="text-white text-center font-['Geist',sans-serif] text-sm font-normal leading-normal px-2">
              Ask Hyln anything and try it out for yourself
            </span>
          </div>

          {/* Natural Voice + Instant Response */}
          <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-3">
            <div className="flex items-center gap-1.5">
              <CircleCheck className="w-[18px] h-[18px] shrink-0 text-white/70" />
              <span className="text-[#555555] font-['Geist',sans-serif] text-sm font-normal leading-normal">
                Natural voice
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <CircleCheck className="w-[18px] h-[18px] shrink-0 text-white/70" />
              <span className="text-[#555555] font-['Geist',sans-serif] text-sm font-normal leading-normal">
                Instant response
              </span>
            </div>
          </div>
        </div>

        {/* Arrow Down */}
        <div className="flex justify-center relative" ref={leftCard2}>
          <svg width="24" height="40" viewBox="0 0 24 40" fill="none">
            <path d="M12 0v30" stroke="#FFF" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M7 25l5 5 5-5" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Feature Cards */}
        <div className="flex flex-col gap-3 w-full max-w-[248px]">
          {[
            { Icon: Calendar, title: "Book Appointments", sub: "Syncs to Square", refSubCard: leftCard3 },
            { Icon: MessageSquare, title: "Send Confirmations", sub: "Auto text reminders", refSubCard: leftCard4 },
            { Icon: Clock, title: "Works 24/7", sub: "Never misses a call", refSubCard: leftCard5 },
          ].map(({ Icon, title, sub, refSubCard }) => (
            <div
              key={title}
              className="flex items-center gap-3 p-3 px-4 rounded-[20px] backdrop-blur-[52px]"
              style={{ background: glassGradient }}
              ref={refSubCard}
            >
              <Icon className="text-white w-5 h-5 shrink-0" />
              <div>
                <p className="m-0 text-white font-['Geist',sans-serif] text-base font-normal leading-normal">
                  {title}
                </p>
                <p className="m-0 text-[#555555] font-['Geist',sans-serif] text-sm font-normal leading-normal">
                  {sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT CARD — Live Call Activity */}
      <div
        className="flex flex-col items-start gap-2.5 w-full max-w-[265px] p-5 rounded-[20px] backdrop-blur-[52px]"
        style={{ background: glassGradient }}
        ref={rightCard}
      >
        <h3 className="text-white text-center font-['Geist',sans-serif] text-[18px] font-normal leading-normal m-0 w-full">
          Live Call Activity
        </h3>

        {/* Phone Icon */}
        <div className="flex w-[63px] h-[63px] p-[18px_17px] justify-center items-center gap-2.5 rounded-[39.5px] bg-[#D4F3FF] shadow-[0_0_64px_0_#00E6F6] self-center box-border">
          <Phone className="text-[#0011ED] w-[26px] h-[26px]" />
        </div>

        <p className="flex items-center gap-1.5 m-0 text-white font-['Geist',sans-serif] text-base font-normal leading-normal self-center">
          <span className="w-2 h-2 rounded-full bg-[#37D906] shrink-0" />
          Processing call...
        </p>

        <p className="m-0 text-[#555555] font-['Geist',sans-serif] text-sm font-normal leading-normal self-center">
          10 calls handled today
        </p>

        {/* Recent Activity Box */}
        <div className="flex w-full p-4 flex-col items-start gap-2.5 rounded-[20px] bg-[#6AA7D8]/40 box-border">
          <h4 className="m-0 text-white font-['Geist',sans-serif] text-[18px] font-normal leading-normal">
            Recent activity
          </h4>
          {[
            { name: "Noura H.", status: "Booked" },
            { name: "Omar H.", status: "Booked" },
            { name: "Mohammed K.", status: "Answered" },
            { name: "Huda R.", status: "Answered" },
          ].map(({ name, status }) => (
            <div
              key={name}
              className="flex justify-between items-center w-full"
            >
              <div className="flex items-center gap-1.5">
                <CircleCheck className="w-4 h-4 text-white" />
                <span className="text-white font-['Geist',sans-serif] text-sm font-normal">
                  {name}
                </span>
              </div>
              <span className="text-white/70 font-['Geist',sans-serif] text-sm font-normal">
                {status}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Status */}
        <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-3 md:gap-6">
          <div className="flex items-center gap-1.5">
            <CircleCheck className="w-[18px] h-[18px] text-white/70" />
            <span className="text-[#555555] font-['Geist',sans-serif] text-sm font-normal">Always on</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CircleCheck className="w-[18px] h-[18px] text-white/70" />
            <span className="text-[#555555] font-['Geist',sans-serif] text-sm font-normal">No missed calls</span>
          </div>
        </div>
      </div>
    </div>
  );
}
