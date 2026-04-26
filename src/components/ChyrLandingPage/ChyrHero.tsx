
// animation with  text animation
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// import heroImage from "@/assets/images/chyrImage/chyrHelobg.png";
import CommonWrapper from "@/common/CommonWrapper";
import ChyrHeroCallWidget from "./ChyrHeroCallWidget";
import BookDemoModal from "@/pages/BookDemoModal";

import { useLandingConfig } from "@/contexts/LandingConfigContext";

const STARS = [
  { top: "5%", left: "10%", size: "w-3 h-3" },
  { top: "12%", left: "30%", size: "w-5 h-5" },
  { top: "8%", right: "15%", size: "w-4 h-4" },
  { top: "20%", left: "5%", size: "w-2 h-2" },
  { top: "25%", right: "10%", size: "w-4 h-4" },
  { top: "35%", left: "18%", size: "w-3 h-3" },
  { top: "40%", right: "25%", size: "w-5 h-5" },
  { top: "53%", left: "8%", size: "w-4 h-4" },
  { top: "45%", right: "8%", size: "w-2 h-2" },
  { top: "2%", left: "25%", size: "w-4 h-4" },
  { top: "20%", right: "20%", size: "w-4 h-4" },
  { bottom: "20%", left: "12%", size: "w-5 h-5" },
  { bottom: "15%", right: "18%", size: "w-6 h-6" },
  { bottom: "8%", left: "35%", size: "w-4 h-4" },
  { bottom: "5%", right: "5%", size: "w-3 h-3" },

];

const starStyle = {
  clipPath: "polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)"
};

const ChyrHero = () => {
  const { config } = useLandingConfig();
  const ROTATING_WORDS = config.texts.hero.rotatingWords;
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const wordIndexRef = useRef(0);
  const preserveRef = useRef<HTMLSpanElement | null>(null);

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([leftRef.current, rightRef.current], {
        opacity: 0,
        y: 50,
      });

      const tl = gsap.timeline({ delay: 0.2 });

      tl.to(leftRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      }).to(
        rightRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
        },
        "-=0.6",
      );
    }, sectionRef);

    const el = preserveRef.current;
    if (!el) return;

    // ✅ no gsap.set() — text fully visible from the start
    // ✅ no entrance animation — just wait then start rotating

    const rotateWord = () => {
      const next = (wordIndexRef.current + 1) % ROTATING_WORDS.length;

      // EXIT — flip up and back
      gsap.to(el, {
        rotationX: 80,
        opacity: 0,
        duration: 0.42,
        ease: "power2.in",
        transformPerspective: 800,
        transformOrigin: "50% 50% -30px",
        onComplete: () => {
          el.textContent = ROTATING_WORDS[next];
          wordIndexRef.current = next;

          // ENTER — flip in from below/behind
          gsap.fromTo(
            el,
            {
              rotationX: -80,
              opacity: 0,
              transformPerspective: 800,
              transformOrigin: "50% 50% -30px",
            },
            {
              rotationX: 0,
              opacity: 1,
              duration: 0.55,
              ease: "back.out(1.4)",
              transformPerspective: 800,
              transformOrigin: "50% 50% -30px",
            },
          );
        },
      });
    };

    // ✅ first rotation starts after 2.5s — user sees "appointment." first
    const interval = setInterval(rotateWord, 2500);

    return () => {
      clearInterval(interval);
      ctx.revert();
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full min-h-screen overflow-hidden flex items-center bg-black pt-16"
      >
        {/* this background will show if user is in desktop screen  */}
        <div className="absolute inset-0 z-0 hidden md:block">
          <video
            src={config.assets.heroBgVideo}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
          {/* <video
            src="/Video Project 3.mp4"
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          /> */}

          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-purple-600/10"></div>
        </div>
        {/* this background will show if user is in mobile screen  */}
        <div className="absolute inset-0 md:hidden z-0">

          {STARS.map((star, i) => (
            <div
              key={i}
              className={`absolute ${star.size} ${config.colors.brandColor} opacity-70`}
              style={{
                ...star,
                ...starStyle,
                animation: `twinkle ${2 + i % 3}s ease-in-out infinite, float ${4 + i % 4}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}

        </div>

        {/* main content of hero section  */}
        <div className="relative z-10 w-full">
          <CommonWrapper className="!py-0">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 py-6 sm:py-[72px] lg:py-[96px] flex-wrap lg:flex-nowrap w-full">
              {/* LEFT — Text */}
              <div
                ref={leftRef}
                className="w-full lg:w-auto flex flex-col items-center lg:items-start text-center lg:text-left mr-0 lg:mr-22"
              >
                <h1 className="text-white text-[42px]/12 sm:text-[48px] md:text-[56px] lg:text-4xl xl:text-[70px] font-black">
                  Never miss <br></br>another
                </h1>

                {/* 3D rotating word */}
                <h1
                  className={`${config.colors.primaryHost} text-[42px]/12 sm:text-[48px] md:text-[56px] lg:text-4xl xl:text-[70px] font-black`}
                  style={{ perspective: "800px", display: "block" }}
                >
                  <span
                    ref={preserveRef}
                    style={{
                      display: "inline-block",
                      transformStyle: "preserve-3d",
                      willChange: "transform, opacity",
                    }}
                  >
                    {config.texts.hero.finalWord}
                  </span>
                </h1>
                <p className="text-base md:text-lg text-white/80 max-w-[420px] leading-relaxed  mt-6 sm:mt-8 mb-5 sm:mb-10 px-2">
                  {config.texts.hero.description}
                </p>

                {/* Buttons */}
                <div className="w-full px-2 md:px-0 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-4">
                  <button
                    className={`relative hidden md:flex group w-full sm:w-auto px-6 py-3  justify-center items-center gap-3.5 rounded-[14px] shadow-[0_4px_6px_0_rgba(255,255,255,0.19)] cursor-pointer text-white text-lg font-normal leading-normal hover:opacity-90 transition-all whitespace-nowrap overflow-hidden ${config.brandName === "Avriance" ? "border border-white/20" : ""}`}
                    style={{
                      borderRadius: "20px",
                      border: config.brandName === "CHYR" ? "1px solid rgba(255, 255, 255, 0.19)" : "none",
                      background: config.colors.buttonGradientBorder,
                      boxShadow: config.colors.buttonShadow,
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 w-full h-[1.5px] opacity-70"
                      style={{
                        background:
                          "linear-gradient(to right, #6b7280, #FFFFFF, #6b7280)",
                      }}
                    />
                    <div
                      className="absolute bottom-0 left-0 w-full h-[1.5px] opacity-70"
                      style={{
                        borderRadius: "20px",
                        border: "1px solid rgba(255, 255, 255, 0.19)",
                        background: config.colors.buttonGradientBorder,
                        boxShadow: config.colors.buttonShadow,
                        display: config.brandName === "CHYR" ? "block" : "none"
                      }}
                    ></div>
                    Start Free Trial
                    <span
                      className="px-3 py-1.5 rounded-full text-white text-sm font-medium"
                      style={{
                        backgroundColor: config.colors.primaryHex,
                        backdropFilter: config.brandName === "Avriance" ? "blur(12px)" : "none",
                        border: config.brandName === "Avriance" ? "1px solid rgba(255,255,255,0.3)" : "none"
                      }}
                    >
                      14 days free
                    </span>
                  </button>
                  <button
                    className={`relative flex md:hidden group w-full sm:w-auto px-6 py-2  justify-center items-center gap-3.5 rounded-[14px] shadow-[0_4px_6px_0_rgba(255,255,255,0.19)] cursor-pointer text-white text-lg font-normal leading-normal hover:opacity-90 transition-all whitespace-nowrap overflow-hidden ${config.colors.brandColor} ${config.brandName === "Avriance" ? "border border-white/20" : ""}`}
                  >

                    Start Free Trial
                    {/* <span
                      className="px-3 py-1.5 rounded-full text-white text-sm font-medium"
                      style={{
                        backdropFilter: config.brandName === "Avriance" ? "blur(12px)" : "none",
                        border: config.brandName === "Avriance" ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.3)"
                      }}
                    >
                      14 days free
                    </span> */}
                  </button>


                  <button
                    onClick={() => setIsBookModalOpen(true)}
                    className=" w-full sm:w-auto  flex md:hidden items-center justify-center gap-2 px-7 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 hover:border-white/40 transition-all cursor-pointer font-body text-[15px]">Book a demo</button>
                  <button onClick={() => setIsBookModalOpen(true)} className="hidden md:block w-full md:w-auto px-6 py-3.5 rounded-[14px] border-2 border-white/50 text-white backdrop-blur-2xl text-lg font-medium cursor-pointer hover:bg-white/10 transition-colors">
                    Book a Demo
                  </button>
                </div>

                {/* Feature list */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6">
                  {/* {[
                    "No credit card required",
                    "Setup in 5 minutes",
                    "Works with any calendar",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-white/80 text-sm md:text-base whitespace-nowrap"
                    >
                      <Check size={16} className="text-white/80 shrink-0" />
                      {item}
                    </div>
                  ))} */}
                  <p className="text-white/80 text-sm md:text-base whitespace-nowrap">Set up in 1 minute • Onboard with one call</p>
                </div>
              </div>

              {/* RIGHT — Widget */}
              <div
                ref={rightRef}
                className="w-full lg:w-auto flex justify-center lg:justify-end"
              >
                <ChyrHeroCallWidget />
              </div>
            </div>
          </CommonWrapper>
        </div>
      </section>
      <BookDemoModal open={isBookModalOpen} setOpen={setIsBookModalOpen} />
    </>
  );
};

export default ChyrHero;
