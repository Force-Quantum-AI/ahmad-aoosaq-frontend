// import {
//   Phone,
//   Mic,
//   CircleCheck,
// } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import gsap from "gsap";
// import { useLandingConfig } from "@/contexts/LandingConfigContext";

// const glassGradient =
//   "radial-gradient(169.18% 110.09% at 71.56% 88.75%, rgba(174, 53, 47, 0.40) 18.27%, rgba(85, 62, 148, 0.40) 99.62%)";

// export default function ChyrHeroCallWidget() {
//   const { config } = useLandingConfig();
//   const [activeCard, setActiveCard] = useState<"live" | "listening">("live");
//   const leftCard1 = useRef<HTMLDivElement>(null);
//   const leftCard2 = useRef<HTMLDivElement>(null);
//   const leftCard3 = useRef<HTMLDivElement>(null);
//   const leftCard4 = useRef<HTMLDivElement>(null);
//   const leftCard5 = useRef<HTMLDivElement>(null);

//   // OUTER wrapper — only receives the entrance animation (opacity + y slide-in)
//   const rightCard = useRef<HTMLDivElement>(null);
//   // INNER wrapper — only receives the float loop animation
//   // This separation is the key fix: entrance and float never fight each other
//   const rightCardInner = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       // Set initial hidden state — only on OUTER wrappers, NOT on rightCardInner
//       gsap.set(
//         [
//           rightCard.current,
//           leftCard1.current,
//           leftCard2.current,
//           leftCard3.current,
//           leftCard4.current,
//           leftCard5.current,
//         ],
//         { opacity: 0, y: 40 },
//       );

//       const tl = gsap.timeline({ delay: 0.3 });

//       // 1️⃣ RIGHT CARD entrance — moves OUTER wrapper only
//       tl.to(rightCard.current, {
//         opacity: 1,
//         y: 0,
//         duration: 0.8,
//         ease: "power3.out",
//       })

//         // 2️⃣ LEFT MAIN CARD entrance
//         .to(
//           leftCard1.current,
//           {
//             opacity: 1,
//             y: 0,
//             duration: 1.0,
//             ease: "power3.out",
//           },
//           "-=0.3",
//         )

//         // 3️⃣ Arrow + feature cards — wave stagger
//         .to(
//           [
//             leftCard2.current,
//             leftCard3.current,
//             leftCard4.current,
//             leftCard5.current,
//           ],
//           {
//             opacity: 1,
//             y: 0,
//             duration: 0.5,
//             ease: "sine.out",
//             stagger: 0.15,
//           },
//           "-=0.5",
//         )

//         // 4️⃣ After entrance completes, start the smooth float on the INNER wrapper
//         // Because rightCardInner is a CHILD div that has never been moved by the
//         // entrance animation, there is no y-position conflict — zero vibration.
//         .call(() => {
//           gsap.to(rightCardInner.current, {
//             y: -18,
//             duration: 3,
//             ease: "sine.inOut",
//             repeat: -1,
//             yoyo: true,
//             force3D: true, // keeps element on GPU layer throughout loop
//             overwrite: "auto", // prevents any tween conflicts
//           });
//         });
//     });

//     return () => ctx.revert();
//   }, []);

//   return (
//     <div className="flex flex-col md:flex-row gap-6 items-center justify-center lg:justify-between py-0 md:py-3 mx-auto w-full max-w-[550px]">
//       {/* LEFT COLUMN */}
//       <div className="w-full px-2 md:px-0 flex flex-col items-center gap-4">
//         {/* Talk Live Card */}
//         <div
//           className="flex w-full max-w-full md:max-w-[248px] p-[22px_27px] flex-col justify-center items-center gap-3 rounded-[20px] backdrop-blur-[52px]"
//           style={{ background: glassGradient }}
//           ref={leftCard1}
//         >
//           {activeCard === "listening" ? (
//             <>
//               <h3 className="text-white text-center font-['Geist',sans-serif] text-[18px] font-semibold leading-normal m-0">
//                 Listening...
//               </h3>

//               {/* Animated Mic */}
//               {/* <div className="flex w-[63px] h-[63px] p-[18px_17px] justify-center items-center gap-[10px] rounded-[39.5px] bg-gradient-to-br from-[#a78bfa] to-[#60a5fa] shadow-[0_0_64px_0_#9D4B2A] box-border">
//                 <Mic className="text-white w-7 h-7" />
//               </div> */}
//               <div
//                 className="flex w-[63px] h-[63px] justify-center items-center rounded-full 
//              shadow-[0_0_64px_0_#9D4B2A]"
//                 style={{
//                   background: "radial-gradient(circle at 30% 30%, #FFCD72, #60a5fa)",
//                 }}
//               >
//                 <Mic className="text-white w-7 h-7" />
//               </div>

//               {/* Timer */}
//               <p className="text-white font-['Geist',sans-serif] text-sm font-normal leading-normal m-0">
//                 0:07
//               </p>

//               {/* Controls */}
//               <div className="flex items-center gap-3">
//                 <div className="flex w-10 h-10 justify-center items-center rounded-full bg-[#d1fae5]">
//                   <Mic className="text-[#22c55e] w-5 h-5" />
//                 </div>
//                 <div
//                   onClick={() => setActiveCard("live")}
//                   className="flex w-10 h-10 justify-center items-center rounded-full bg-[#ef4444] cursor-pointer"
//                 >
//                   <span className="text-white text-lg font-bold leading-none">
//                     ✕
//                   </span>
//                 </div>
//               </div>

//               <p className="text-[#9E9E9E] font-['Geist',sans-serif] text-sm font-normal leading-normal text-center m-0">
//                 {config.texts.heroCallWidget.askAnything}
//               </p>
//             </>
//           ) : (
//             <>
//               <h3 className="text-white text-center font-['Geist',sans-serif] text-[18px] font-semibold leading-normal m-0">
//                 {config.texts.heroCallWidget.title}
//               </h3>

//               <div
//                 onClick={() => setActiveCard("listening")}
//                 className="flex w-[80px] h-[80px] p-[18px_17px] justify-center items-center rounded-[39.5px] cursor-pointer"
//                 style={{
//                   background: `radial-gradient(circle at 30% 30%, #e5dffe, #231466 98%, #231466)`,
//                   boxShadow: "0 0 124px 0 #231466",
//                   transition: "box-shadow 0.3s ease",
//                 }}
//                 onMouseEnter={(e) =>
//                   (e.currentTarget.style.boxShadow = "0 0 64px 0 #a78bfa")
//                 }
//                 onMouseLeave={(e) =>
//                   (e.currentTarget.style.boxShadow = "0 0 64px 0 #9D4B2A")
//                 }
//               >
//                 <Mic className="text-white w-7 h-7" />
//               </div>
//               {/* Tap to start */}
//               <p className="flex items-center gap-1.5 m-0 text-white font-['Geist',sans-serif] text-base font-normal leading-normal">
//                 <span className="w-2 h-2 rounded-full bg-[#37D906] shrink-0" />
//                 Tap to start.
//               </p>

//               <p className="text-[#9E9E9E] font-['Geist',sans-serif] text-sm font-normal leading-normal text-center">
//                 Or call{" "}
//                 <span className="text-white font-semibold">(650) 719-1267</span>
//               </p>

//               {/* Ask Hyln Button */}
//               <div className={`flex p-[10px_0] justify-center items-center gap-2.5 self-stretch rounded-[10px] ${config.texts.heroCallWidget.cardColor}`}>
//                 <span className=" text-white text-center font-['Geist',sans-serif] text-lg md:text-base font-normal text-wrap px-2">
//                   {config.texts.heroCallWidget.askAnything}
//                 </span>
//               </div>

//               {/* Natural Voice + Instant Response */}
//               <div className="flex flex-row w-full justify-center lg:justify-between items-center gap-3">
//                 <div className="flex items-center gap-1.5">
//                   <CircleCheck className="w-[18px] h-[18px] shrink-0 text-white/70" />
//                   <span className="text-white font-['Geist',sans-serif] text-sm font-normal leading-normal">
//                     Natural voice
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-1.5">
//                   <CircleCheck className="w-[18px] h-[18px] shrink-0 text-white/70" />
//                   <span className="text-white font-['Geist',sans-serif] text-sm font-normal leading-normal">
//                     Instant response
//                   </span>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Arrow Down */}
//         <div className="hidden md:flex justify-center relative" ref={leftCard2}>
//           <svg width="24" height="40" viewBox="0 0 24 40" fill="none">
//             <path
//               d="M12 0v30"
//               stroke="#FFF"
//               strokeWidth="2"
//               strokeDasharray="4 4"
//             />
//             <path
//               d="M7 25l5 5 5-5"
//               stroke="#FFF"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         </div>

//         {/* Feature Cards */}
//         <div className="hidden md:flex flex-col gap-3 w-full max-w-[248px]">
//           {config.texts.heroCallWidget.features.map(({ Icon, title, sub }, idx) => {
//             const refArr = [leftCard3, leftCard4, leftCard5];
//             const refSubCard = refArr[idx % refArr.length];
//             return (
//               <div
//                 key={title}
//                 className="flex items-center gap-3 p-3 px-4 rounded-[20px] backdrop-blur-[52px]"
//                 style={{ background: glassGradient }}
//                 ref={refSubCard}
//               >
//                 <Icon className="text-white w-5 h-5 shrink-0" />
//                 <div>
//                   <p className="m-0 text-white font-['Geist',sans-serif] text-base font-normal leading-normal">
//                     {title}
//                   </p>
//                   <p className="m-0 text-[#9E9E9E] font-['Geist',sans-serif] text-sm font-normal leading-normal">
//                     {sub}
//                   </p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* RIGHT CARD — OUTER: entrance animation target only (opacity + slide-in) */}
//       <div
//         ref={rightCard}
//         className="w-full max-w-[265px] hidden md:block"
//       // No visual styling here — it's just a transparent entrance wrapper
//       >
//         {/* RIGHT CARD — INNER: float animation target only (y loop) */}
//         {/* will-change + translateZ forces GPU layer → zero jitter on backdrop-blur */}
//         <div
//           ref={rightCardInner}
//           className="flex flex-col items-start gap-2.5 w-full p-3 rounded-[20px] backdrop-blur-[52px]"
//           style={{
//             background: glassGradient,
//             willChange: "transform",
//             transform: "translateZ(0)",
//           }}
//         >
//           <div className="flex flex-col w-full gap-2.5">
//             <h3 className="text-white text-center font-['Geist',sans-serif] text-[18px] font-normal leading-normal m-0 w-full">
//               Live Call Activity
//             </h3>

//             {/* Phone Icon */}
//             <div
//               className="flex w-[80px] h-[80px] p-[18px_17px] justify-center items-center rounded-[39.5px] cursor-pointer mx-auto"
//               style={{
//                 background: `radial-gradient(circle at 30% 30%, #e5dffe, #231466 98%, #231466)`,
//                 boxShadow: "0 0 124px 0 #231466",
//                 transition: "box-shadow 0.3s ease",
//               }}
//             >
//               <Phone className="text-white w-[26px] h-[26px]" />
//             </div>

//             <p className="animate-pulse flex items-center gap-1.5 m-0 text-white font-['Geist',sans-serif] text-base font-normal leading-normal self-center">
//               <span className="w-2 h-2 rounded-full bg-[#37D906]/60 shrink-0" />
//               Processing call...
//             </p>

//             <p className="m-0 text-[#555555] font-['Geist',sans-serif] text-sm font-normal leading-normal self-center">
//               <span data-aos="fade-up" data-aos-delay="500">10</span> calls handled today
//             </p>

//             {/* Recent Activity Box */}
//             <div className={`flex w-full p-4 flex-col items-start gap-2.5 rounded-[20px] ${config.texts.heroCallWidget.cardColor} box-border`}>
//               <h4 className="m-0 text-white font-['Geist',sans-serif] text-[18px] font-normal leading-normal">
//                 Recent activity
//               </h4>
//               {config.texts.heroCallWidget.activities.map(({ name, status }) => (
//                 <div
//                   key={name}
//                   className="flex justify-between items-center w-full"
//                 >
//                   <div className="flex items-center gap-1.5">
//                     <CircleCheck className="w-4 h-4 text-white" />
//                     <span className="text-white font-['Geist',sans-serif] text-sm font-normal">
//                       {name}
//                     </span>
//                   </div>
//                   <span className="text-white/70 font-['Geist',sans-serif] text-sm font-normal">
//                     {status}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             {/* Bottom Status */}
//             <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-3 md:gap-6 px-3">
//               <div className="flex items-center gap-1.5">
//                 <CircleCheck className="w-[18px] h-[18px] text-white/70" />
//                 <span className="text-[#D0D8F5] font-['Geist',sans-serif] text-sm font-normal">
//                   Always on
//                 </span>
//               </div>
//               <div className="flex items-center gap-1.5">
//                 <CircleCheck className="w-[18px] h-[18px] text-white/70" />
//                 <span className="text-[#D0D8F5] font-['Geist',sans-serif] text-sm font-normal">
//                   No missed calls
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// ------------- this is dynamic chat with ai by voice part -----------

import { Phone, Mic, CircleCheck } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useLandingConfig } from "@/contexts/LandingConfigContext";

const glassGradient =
  "radial-gradient(169.18% 110.09% at 71.56% 88.75%, rgba(174, 53, 47, 0.40) 18.27%, rgba(85, 62, 148, 0.40) 99.62%)";

// ---------------------------------------------------------------------------
// Dummy AI knowledge base
// ---------------------------------------------------------------------------
const DUMMY_KB: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["price", "cost", "pricing", "plan", "subscription", "fee", "how much"],
    answer:
      "We offer flexible plans starting at just twenty nine dollars per month. Our Pro plan at seventy nine dollars includes unlimited calls and advanced analytics. Enterprise pricing is available on request.",
  },
  {
    keywords: ["feature", "features", "what can", "what do", "capability", "do you", "able to"],
    answer:
      "Our AI handles inbound and outbound calls twenty four seven, provides instant responses, schedules appointments, qualifies leads, and gives you detailed call analytics with a natural sounding voice.",
  },
  {
    keywords: ["trial", "free", "try", "demo", "test"],
    answer:
      "Absolutely! We offer a fourteen day free trial with no credit card required. You can set up your AI receptionist in under five minutes and start taking calls right away.",
  },
  {
    keywords: ["integration", "integrate", "crm", "hubspot", "salesforce", "zapier"],
    answer:
      "We integrate natively with HubSpot, Salesforce, Zoho, and Zapier. You can push call summaries and leads directly into your CRM in real time.",
  },
  {
    keywords: ["language", "languages", "english", "spanish", "french"],
    answer:
      "Currently we support English, Spanish, and French. More languages are on our roadmap and should be available next quarter.",
  },
  {
    keywords: ["setup", "set up", "get started", "begin", "onboard", "how do i"],
    answer:
      "Getting started is simple. Sign up, tell us about your business, and our AI is live within minutes. No technical knowledge required.",
  },
  {
    keywords: ["missed", "miss", "always", "available", "offline", "after hours"],
    answer:
      "Our AI is always on, twenty four hours a day, seven days a week including holidays. You will never miss another call.",
  },
  {
    keywords: ["human", "agent", "transfer", "escalate", "real person", "live"],
    answer:
      "Yes! If a caller needs to speak with a human agent, the AI can seamlessly transfer the call or take a detailed message so your team can follow up.",
  },
  {
    keywords: ["data", "privacy", "secure", "security", "gdpr", "compliance", "safe"],
    answer:
      "We take data privacy very seriously. All calls are encrypted in transit and at rest. We are fully GDPR compliant and SOC 2 certified.",
  },
  {
    keywords: ["cancel", "cancellation", "refund", "money back"],
    answer:
      "You can cancel anytime with no long term commitment. We also offer a thirty day money back guarantee if you are not satisfied.",
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"],
    answer:
      "Hi there! I am the AI assistant. I can tell you about our pricing, features, integrations, or anything else. What would you like to know?",
  },
  {
    keywords: ["who are you", "what are you", "your name", "about you", "tell me about"],
    answer:
      "I am AI voice assistant, available around the clock to answer your questions. Ask me anything about our service!",
  },
  {
    keywords: ["phone", "number", "contact", "reach"],
    answer:
      "You can reach our team directly at six five zero, seven one nine, one two six seven. Or keep chatting with me — I am happy to help!",
  },
];

const FALLBACK_ANSWER =
  "That is a great question! Our team would love to walk you through that. You can reach us at six five zero, seven one nine, one two six seven, or I can connect you with someone right now.";

// function getDummyAnswer(transcript: string): string {
//   const lower = transcript.toLowerCase();
//   for (const entry of DUMMY_KB) {
//     if (entry.keywords.some((kw) => lower.includes(kw))) return entry.answer;
//   }
//   return FALLBACK_ANSWER;
// }
function getDummyAnswer(transcript: string): string {
  const lower = transcript.toLowerCase();

  let bestMatch = null;
  let maxScore = 0;

  for (const entry of DUMMY_KB) {
    let score = 0;

    for (const kw of entry.keywords) {
      if (lower.includes(kw)) {
        score += kw.length; // longer keywords = stronger intent
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = entry;
    }
  }

  return bestMatch ? bestMatch.answer : FALLBACK_ANSWER;
}

// ---------------------------------------------------------------------------
// Pick best female voice
// ---------------------------------------------------------------------------
function pickFemaleVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const preferred = [
    "samantha", "karen", "victoria", "moira", "tessa", "fiona",
    "google us english", "google uk english female",
    "microsoft aria", "microsoft jenny", "microsoft sonia", "zira",
  ];

  for (const name of preferred) {
    const v = voices.find((v) => v.name.toLowerCase().includes(name));
    if (v) return v;
  }

  const femaleInName = voices.find((v) => v.name.toLowerCase().includes("female"));
  if (femaleInName) return femaleInName;

  const maleWords = ["male", "david", "mark", "george", "daniel", "fred", "alex", "tom", "guy", "james", "paul"];
  const nonMale = voices.find(
    (v) => v.lang.startsWith("en") && !maleWords.some((m) => v.name.toLowerCase().includes(m))
  );
  if (nonMale) return nonMale;

  return voices.find((v) => v.lang.startsWith("en")) ?? voices[0];
}

// ---------------------------------------------------------------------------
// Core speak function — returns a Promise that resolves when speech ends
// All callbacks are set BEFORE calling .speak() to avoid any race condition
// ---------------------------------------------------------------------------
function speakText(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve();
      return;
    }

    // Cancel anything currently playing
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1.2;
    utterance.volume = 1;

    // Assign female voice
    const voice = pickFemaleVoice();
    if (voice) utterance.voice = voice;

    // Set ALL callbacks before calling speak()
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve(); // resolve even on error so loop continues

    // Chrome has a known bug where long utterances get cut off silently.
    // This keepalive ping prevents that.
    const keepAlive = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      } else {
        clearInterval(keepAlive);
      }
    }, 10000);

    utterance.onend = () => {
      clearInterval(keepAlive);
      resolve();
    };
    utterance.onerror = () => {
      clearInterval(keepAlive);
      resolve();
    };

    window.speechSynthesis.speak(utterance);
  });
}

// ---------------------------------------------------------------------------
// Voice chat hook
// ---------------------------------------------------------------------------
type VoiceStatus = "idle" | "listening" | "processing" | "speaking";

function useVoiceChat() {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recRef = useRef<any>(null);
  const activeRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  // Timer while listening
  useEffect(() => {
    if (status === "listening") {
      setElapsedSeconds(0);
      timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    } else {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status]);

  // Preload voices on mount (browsers load them async)
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    // Trigger voice list load
    window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener("voiceschanged", () => {
      window.speechSynthesis.getVoices(); // cache internally
    });
  }, []);

  // Single listen → answer cycle
  const listenOnce = useCallback(() => {
    if (!activeRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SR) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec: any = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    recRef.current = rec;

    let captured = "";

    rec.onstart = () => {
      if (activeRef.current) setStatus("listening");
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) captured += e.results[i][0].transcript;
      }
    };

    rec.onend = async () => {
      if (!activeRef.current) return;

      const text = captured.trim();
      if (!text) {
        // Nothing heard — just listen again
        setTimeout(() => listenOnce(), 300);
        return;
      }

      // Show "processing" while we prepare the answer
      setStatus("processing");
      const answer = getDummyAnswer(text);

      // Small delay so "Thinking..." is visible
      await new Promise((r) => setTimeout(r, 400));
      if (!activeRef.current) return;

      setStatus("speaking");
      await speakText(answer);

      if (!activeRef.current) return;

      // After speaking, listen again automatically
      setTimeout(() => listenOnce(), 300);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onerror = (e: any) => {
      if (!activeRef.current) return;
      if (e.error === "no-speech" || e.error === "aborted") {
        setTimeout(() => listenOnce(), 300);
      } else {
        // Permission denied or other fatal error
        activeRef.current = false;
        setStatus("idle");
      }
    };

    try { rec.start(); } catch { /* already started */ }
  }, []);

  const startSession = useCallback(() => {
    if (!isSupported) return;
    activeRef.current = true;
    listenOnce();
  }, [isSupported, listenOnce]);

  const endSession = useCallback(() => {
    activeRef.current = false;
    try { recRef.current?.abort(); } catch { /* ignore */ }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setStatus("idle");
  }, []);

  return { status, elapsedSeconds, startSession, endSession, isSupported };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ChyrHeroCallWidget() {
  const { config } = useLandingConfig();
  const [activeCard, setActiveCard] = useState<"live" | "listening">("live");
  const { status, elapsedSeconds, startSession, endSession, isSupported } = useVoiceChat();

  const statusLabel =
    status === "processing" ? "Thinking..." :
    status === "speaking"   ? "Speaking..."  :
                              "Listening...";

  const micGradient =
    status === "speaking"   ? "radial-gradient(circle at 30% 30%, #6ee7b7, #059669)" :
    status === "processing" ? "radial-gradient(circle at 30% 30%, #fde68a, #d97706)" :
                              "radial-gradient(circle at 30% 30%, #FFCD72, #60a5fa)";

  // GSAP refs — identical to original
  const leftCard1  = useRef<HTMLDivElement>(null);
  const leftCard2  = useRef<HTMLDivElement>(null);
  const leftCard3  = useRef<HTMLDivElement>(null);
  const leftCard4  = useRef<HTMLDivElement>(null);
  const leftCard5  = useRef<HTMLDivElement>(null);
  const rightCard      = useRef<HTMLDivElement>(null);
  const rightCardInner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(
        [rightCard.current, leftCard1.current, leftCard2.current,
         leftCard3.current, leftCard4.current, leftCard5.current],
        { opacity: 0, y: 40 },
      );
      const tl = gsap.timeline({ delay: 0.3 });
      tl.to(rightCard.current,  { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        .to(leftCard1.current,   { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" }, "-=0.3")
        .to(
          [leftCard2.current, leftCard3.current, leftCard4.current, leftCard5.current],
          { opacity: 1, y: 0, duration: 0.5, ease: "sine.out", stagger: 0.15 },
          "-=0.5",
        )
        .call(() => {
          gsap.to(rightCardInner.current, {
            y: -18, duration: 3, ease: "sine.inOut",
            repeat: -1, yoyo: true, force3D: true, overwrite: "auto",
          });
        });
    });
    return () => ctx.revert();
  }, []);

  const handleMicClick = () => {
    setActiveCard("listening");
    if (isSupported) startSession();
  };

  const handleEndCall = () => {
    endSession();
    setActiveCard("live");
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center justify-center lg:justify-between py-0 md:pt-9 mx-auto w-full max-w-[550px]">

      {/* LEFT COLUMN */}
      <div className="w-full px-2 md:px-0 flex flex-col items-center gap-4">

        <div
          className="flex w-full max-w-full md:max-w-[248px] p-[22px_27px] flex-col justify-center items-center gap-4 md:gap-6 rounded-[20px] backdrop-blur-[52px]"
          style={{ background: glassGradient }}
          ref={leftCard1}
        >
          {activeCard === "listening" ? (
            <>
              <h3 className="text-white text-center font-['Geist',sans-serif] text-[18px] font-semibold leading-normal m-0">
                {statusLabel}
              </h3>

              <div
                className={`flex w-[63px] h-[63px] justify-center items-center rounded-full shadow-[0_0_64px_0_#9D4B2A] transition-all duration-500 ${
                  status === "listening" ? "animate-pulse" : ""
                }`}
                style={{ background: micGradient }}
              >
                <Mic className="text-white w-7 h-7" />
              </div>

              <p className="text-white font-['Geist',sans-serif] text-sm font-normal leading-normal m-0 min-h-[20px]">
                {status === "listening" ? formatTime(elapsedSeconds) : "\u00A0"}
              </p>

              <div className="flex items-center gap-3">
                <div
                  onClick={handleEndCall}
                  className="flex w-10 h-10 justify-center items-center rounded-full bg-[#ef4444] cursor-pointer"
                  title="End call"
                >
                  <span className="text-white text-lg font-bold leading-none">✕</span>
                </div>
              </div>

              <p className="text-[#9E9E9E] font-['Geist',sans-serif] text-sm font-normal leading-normal text-center m-0">
                {config.texts.heroCallWidget.askAnything}
              </p>
            </>
          ) : (
            <>
              <h3 className="text-white text-center font-['Geist',sans-serif] text-[19px] font-semibold mt-2">
                {config.texts.heroCallWidget.title}
              </h3>

              <div
                onClick={handleMicClick}
                className=" flex md:hidden w-[78px] h-[78px] md:w-[63px] md:h-[63px]  md:mt-4 p-[18px_17px] justify-center items-center rounded-[39.5px] cursor-pointer"
                style={{
                  background: `radial-gradient(circle at 30% 30%, #FFFFFF, ${config.colors.brandColorHex} 98%, ${config.colors.brandColorHex})`,
                  boxShadow: "0 0 124px 0 #231466",
                  transition: "box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 64px 0 #a78bfa")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 64px 0 #9D4B2A")}
              >
                <Mic className={`text-gray-600 w-7 h-7`} />
              </div>
              <div
                onClick={handleMicClick}
                className="hidden md:flex w-[78px] h-[78px] md:w-[63px] md:h-[63px]  md:mt-4 p-[18px_17px] justify-center items-center rounded-[39.5px] cursor-pointer"
                style={{
                  background: `radial-gradient(circle at 30% 30%, #e5dffe, #231466 98%, #231466)`,
                  boxShadow: "0 0 124px 0 #231466",
                  transition: "box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 64px 0 #a78bfa")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 64px 0 #9D4B2A")}
              >
                <Mic className="text-white w-7 h-7" />
              </div>

              <div className="flex flex-col items-center gap-2">
              <p className="flex items-center gap-1.5 m-0 text-white font-['Geist',sans-serif] text-[13px] md:text-base font-normal leading-normal">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] shrink-0 animate-pulse" />
                Tap to start.
              </p>

              <p className="text-[#9E9E9E] font-['Geist',sans-serif] text-[13px] md:text-base font-normal leading-normal text-center">
                Or {" "}
                <span className="text-white font-semibold">call {config.brandName}</span>
              </p>
              </div>

              <div className={`hidden md:flex p-[10px_0] justify-center items-center gap-2.5 self-stretch rounded-[10px] ${config.texts.heroCallWidget.cardColor}`}>
                <span className="text-white text-center font-['Geist',sans-serif] text-lg md:text-base font-normal text-wrap px-2">
                  {config.texts.heroCallWidget.askAnything}
                </span>
              </div>

              <div className={`flex md:hidden p-[20px_0] justify-center items-center gap-2.5 self-stretch rounded-[10px] ${config.colors.brandColor}`}>
                <span className="text-white text-center font-['Geist',sans-serif] text-[15px] md:text-base font-normal text-wrap px-2">
                  Ask {config.brandName} anything and try it out for<br/>yourself
                </span>
              </div>

              <div className="flex flex-row w-full justify-center lg:justify-between items-center gap-7">
                <div className="flex items-center gap-1.5">
                  <CircleCheck className="w-[18px] h-[18px] shrink-0 text-white/70" />
                  <span className="text-white font-['Geist',sans-serif] text-sm font-normal leading-normal">
                    Natural voice
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CircleCheck className="w-[18px] h-[18px] shrink-0 text-white/70" />
                  <span className="text-white font-['Geist',sans-serif] text-sm font-normal leading-normal">
                    Instant response
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Arrow Down */}
        <div className="hidden md:flex justify-center relative" ref={leftCard2}>
          <svg width="24" height="40" viewBox="0 0 24 40" fill="none">
            <path d="M12 0v30" stroke="#FFF" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M7 25l5 5 5-5" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Feature Cards */}
        <div className="hidden md:flex flex-col gap-3 w-full max-w-[248px]">
          {config.texts.heroCallWidget.features.map(({ Icon, title, sub }, idx) => {
            const refArr = [leftCard3, leftCard4, leftCard5];
            return (
              <div
                key={title}
                className="flex items-center gap-3 p-3 px-4 rounded-[20px] backdrop-blur-[52px]"
                style={{ background: glassGradient }}
                ref={refArr[idx % refArr.length]}
              >
                <Icon className="text-white w-5 h-5 shrink-0" />
                <div>
                  <p className="m-0 text-white font-['Geist',sans-serif] text-base font-normal leading-normal">{title}</p>
                  <p className="m-0 text-[#9E9E9E] font-['Geist',sans-serif] text-sm font-normal leading-normal">{sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT CARD — unchanged */}
      <div ref={rightCard} className="w-full max-w-[265px] hidden md:block">
        <div
          ref={rightCardInner}
          className="flex flex-col items-start gap-2.5 w-full p-3 rounded-[20px] backdrop-blur-[52px]"
          style={{ background: glassGradient, willChange: "transform", transform: "translateZ(0)" }}
        >
          <div className="flex flex-col w-full gap-2.5">
            <h3 className="text-white text-center font-['Geist',sans-serif] text-[18px] font-normal leading-normal m-0 w-full">
              Live Call Activity
            </h3>

            <div
              className="flex w-[80px] h-[80px]  md:w-[63px] md:h-[63px] mt-4 p-[18px_17px] justify-center items-center rounded-[39.5px] cursor-pointer mx-auto"
              style={{
                background: `radial-gradient(circle at 30% 30%, #e5dffe, #231466 98%, #231466)`,
                boxShadow: "0 0 124px 0 #231466",
                transition: "box-shadow 0.3s ease",
              }}
            >
              <Phone className="text-white w-[26px] h-[26px]" />
            </div>

            <p className="animate-pulse flex items-center gap-1.5 m-0 text-white font-['Geist',sans-serif] text-base font-normal leading-normal self-center">
              <span className="w-2 h-2 rounded-full bg-[#37D906]/60 shrink-0" />
              Processing call...
            </p>

            <p className="m-0 text-[#555555] font-['Geist',sans-serif] text-sm font-normal leading-normal self-center">
              <span data-aos="fade-up" data-aos-delay="500">10</span> calls handled today
            </p>

            <div className={`flex w-full p-4 flex-col items-start gap-2.5 rounded-[20px] ${config.texts.heroCallWidget.cardColor} box-border`}>
              <h4 className="m-0 text-white font-['Geist',sans-serif] text-[18px] font-normal leading-normal">
                Recent activity
              </h4>
              {config.texts.heroCallWidget.activities.map(({ name, status: actStatus }) => (
                <div key={name} className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-1.5">
                    <CircleCheck className="w-4 h-4 text-white" />
                    <span className="text-white font-['Geist',sans-serif] text-sm font-normal">{name}</span>
                  </div>
                  <span className="text-white/70 font-['Geist',sans-serif] text-sm font-normal">{actStatus}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-3 md:gap-6 px-3">
              <div className="flex items-center gap-1.5">
                <CircleCheck className="w-[18px] h-[18px] text-white/70" />
                <span className="text-[#D0D8F5] font-['Geist',sans-serif] text-sm font-normal">Always on</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CircleCheck className="w-[18px] h-[18px] text-white/70" />
                <span className="text-[#D0D8F5] font-['Geist',sans-serif] text-sm font-normal">No missed calls</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
