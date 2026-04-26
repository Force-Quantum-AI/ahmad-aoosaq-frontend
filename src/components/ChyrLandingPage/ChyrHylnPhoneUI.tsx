import { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { gsap } from "gsap";
import { useLandingConfig } from "@/contexts/LandingConfigContext";
import { AVRIANCEIcon, CHYRIcon, NOHMIcon } from "@/assets/logo/BrandLogoNew";
import { ChevronDown } from "lucide-react";

// ── Phone number input with country code ──────────────────────────────────────
// const UAE_FLAG = "🇦🇪";

interface FormState {
  name: string;
  phone: string;
  submitted: boolean;
  loading: boolean;
  error: string;
}

// const COUNTRIES = [
//   { code: "+1", flag: "🇺🇸", name: "USA" },
//   { code: "+44", flag: "🇬🇧", name: "UK" },
//   { code: "+1", flag: "🇨🇦", name: "CAN" },
//   { code: "+971", flag: "🇦🇪", name: "UAE" },
//   { code: "+61", flag: "🇦🇺", name: "AUS" },
//   { code: "+49", flag: "🇩🇪", name: "GER" },
//   { code: "+33", flag: "🇫🇷", name: "FRA" },
//   { code: "+39", flag: "🇮🇹", name: "ITA" },
//   { code: "+34", flag: "🇪🇸", name: "ESP" },
//   { code: "+81", flag: "🇯🇵", name: "JPN" },
//   { code: "+86", flag: "🇨🇳", name: "CHN" }
// ];

const COUNTRIES = [
  { code: "+974", flag: "🇶🇦", name: "QAT" },   // Qatar
  { code: "+966", flag: "🇸🇦", name: "KSA" },   // Saudi Arabia
  { code: "+968", flag: "🇴🇲", name: "OMN" },   // Oman
  { code: "+965", flag: "🇰🇼", name: "KWT" },   // Kuwait
  { code: "+971", flag: "🇦🇪", name: "UAE" },   // United Arab Emirates
  { code: "+973", flag: "🇧🇭", name: "BHR" },   // Bahrain
];

export default function ChyrHylnPhoneUI() {
  const { config } = useLandingConfig();
  const arrowRef = useRef<SVGSVGElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    submitted: false,
    loading: false,
    error: "",
  });

  // ── GSAP: animate the curved arrow ────────────────────────────────────────
  useEffect(() => {
    if (!arrowRef.current) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });

    // Arrow bounces down toward the button repeatedly
    tl.to(arrowRef.current, {
      y: 10,
      duration: 0.45,
      ease: "power1.inOut",
    })
      .to(arrowRef.current, {
        y: 0,
        duration: 0.35,
        ease: "power1.inOut",
      })
      .to(arrowRef.current, {
        y: 8,
        duration: 0.38,
        ease: "power1.inOut",
      })
      .to(arrowRef.current, {
        y: 0,
        duration: 0.32,
        ease: "power2.out",
      });

    // Subtle opacity pulse in sync
    gsap.to(arrowRef.current, {
      opacity: 0.5,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      tl.kill();
      gsap.killTweensOf(arrowRef.current);
    };
  }, []);

  // ── GSAP: button press animation ──────────────────────────────────────────
  const animateButton = () => {
    if (!buttonRef.current) return;
    gsap.fromTo(
      buttonRef.current,
      { scale: 1 },
      {
        scale: 0.96,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
      },
    );
  };

  // ── Form submit ────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const { name, phone } = form;
    // i have to replace the phone with this fullPhone during api integration 
    const fullPhone = `${selectedCountry.code}${form.phone}`;
    console.log(fullPhone);


    if (!name.trim()) {
      setForm((f) => ({ ...f, error: "Please enter your name." }));
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 7) {
      setForm((f) => ({ ...f, error: "Please enter a valid phone number." }));
      return;
    }

    animateButton();
    setForm((f) => ({ ...f, loading: true, error: "" }));

    // Simulate API call — replace with your actual endpoint
    await new Promise((r) => setTimeout(r, 1800));

    setForm((f) => ({ ...f, loading: false, submitted: true }));
  };

  const handleReset = () =>
    setForm({
      name: "",
      phone: "",
      submitted: false,
      loading: false,
      error: "",
    });

  return (
    /* iPhone shell */
    <div
      ref={cardRef}
      className="relative mx-auto select-none"
      style={{ width: 300, minHeight: 520 }}
    >
      {/* ── Outer phone body ──────────────────────────────────────────────── */}
      <div
        className="relative rounded-[44px] overflow-hidden"
        style={{
          background: "#000",
          boxShadow:
            "0 0 0 10px #1a1a1a, 0 0 0 11px #333, 0 30px 80px rgba(0,0,0,0.6)",
          minHeight: 560,
        }}
      >
        {/* Status bar */}
        <div className="hidden md:flex items-center justify-between px-6 pt-4 pb-1">
          <span className="text-white text-xs font-semibold">4:19</span>
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10"
            style={{ boxShadow: "0 0 0 2px #2a2a2a" }}
          />
          <div className="flex items-center gap-1">
            {/* signal bars */}
            <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
              <rect x="0" y="7" width="3" height="5" rx="0.5" />
              <rect x="4.5" y="4.5" width="3" height="7.5" rx="0.5" />
              <rect x="9" y="2" width="3" height="10" rx="0.5" />
              <rect
                x="13.5"
                y="0"
                width="2.5"
                height="12"
                rx="0.5"
                opacity="0.3"
              />
            </svg>
            {/* wifi */}
            <svg width="14" height="12" viewBox="0 0 24 18" fill="white">
              <path d="M12 14a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
              <path
                d="M7.2 10.6a6.5 6.5 0 0 1 9.6 0"
                strokeWidth="1.8"
                stroke="white"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M3.5 7a11.5 11.5 0 0 1 17 0"
                strokeWidth="1.8"
                stroke="white"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            {/* battery */}
            <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
              <rect
                x="0.5"
                y="0.5"
                width="18"
                height="11"
                rx="3"
                stroke="white"
                strokeWidth="1"
              />
              <rect x="2" y="2" width="14" height="8" rx="2" fill="white" />
              <path d="M20 4v4a2 2 0 0 0 0-4z" fill="white" opacity="0.4" />
            </svg>
          </div>
        </div>

        {/* ── Screen content ────────────────────────────────────────────── */}
        <div className="px-7 pb-10 pt-2 flex flex-col items-center justify-between">
          {/* Logo */}
          <div className="mt-10 mb-13 flex flex-col items-center gap-2">
            <div className="relative">
              {/* <img
                src={config.assets.phoneUILogo}
                alt="HYLN"
                className="object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              /> */}
              {config.brandName === "Chyr" && <CHYRIcon />}
              {config.brandName === "Avriance" && <AVRIANCEIcon />}
              {config.brandName === "Nohm" && <NOHMIcon />}
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-6">
            <p className="text-white text-[15px] font-semibold leading-snug">
              Don't Trust The Tech,
            </p>
            <p
              className="text-[15px] font-semibold leading-snug"
              style={{ color: config.colors.brandColorHex }}
            >
              Try It Yourself
            </p>
            <p className="text-gray-400 text-[11px] mt-2 leading-relaxed px-2">
              Enter your details and our AI will call you within minutes.
            </p>
          </div>

          {!form.submitted ? (
            <>
              {/* Name input */}
              <div className="w-full mb-3">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value, error: "" }))
                  }
                  placeholder="Noor Al-Harbi"
                  className="w-full bg-[#1c1c1e] border border-[#2c2c2e] text-white placeholder:text-gray-600 text-sm rounded-2xl px-4 py-3 outline-none focus:border-[#3a3a3c] transition-colors"
                />
              </div>

              {/* Phone input */}
              <div className="w-full mb-1">
                <div className="flex items-center bg-[#1c1c1e] border border-[#2c2c2e] rounded-2xl px-4 py-3 gap-2 focus-within:border-[#3a3a3c] transition-colors">
                  <DropdownMenu>

                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-1 shrink-0 focus:outline-none">
                        <span className="text-base leading-none">
                          {selectedCountry.flag}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {selectedCountry.code}
                        </span>
                        <ChevronDown className="w-3 h-3 text-gray-400 ml-1" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="start"
                      className="bg-[#1c1c1e] border border-[#2c2c2e] text-white rounded-xl"
                    >
                      {COUNTRIES.map((country) => (
                        country.name != selectedCountry.name && (
                        <DropdownMenuItem
                          key={country.code}
                          onClick={() => setSelectedCountry(country)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <span>{country.flag}</span>
                          <span>{country.name}</span>
                          <span className="ml-auto text-gray-400 text-xs">
                            {country.code}
                          </span>
                        </DropdownMenuItem>
                        )
                      ))}
                    </DropdownMenuContent>

                  </DropdownMenu>
                  {/* <div className="w-px h-4 bg-[#3a3a3c] shrink-0" /> */}

                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        phone: e.target.value.replace(/[^\d\s\-()]/g, ""),
                        error: "",
                      }))
                    }
                    placeholder="Phone number"
                    className="flex-1 bg-transparent text-white placeholder:text-gray-600 text-sm outline-none min-w-0"
                  />
                </div>
              </div>


              {/* Error */}
              {form.error && (
                <p className="text-red-400 text-[11px] w-full mb-1 px-1">
                  {form.error}
                </p>
              )}

              {/* Animated arrow */}
              {/* <div className="w-full flex justify-center mt-3 mb-1 h-8 items-start">
                                <svg
                                    ref={arrowRef}
                                    width="44"
                                    height="30"
                                    viewBox="0 0 44 30"
                                    fill="none"
                                    className="opacity-80"
                                >
                                    <path
                                        d="M4 4 C 4 18, 22 22, 38 18"
                                        stroke="white"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        fill="none"
                                    />
                                    <path
                                        d="M33 12 L38 18 L44 14"
                                        stroke="white"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        fill="none"
                                    />
                                </svg>
                            </div> */}
              <div className="w-full flex justify-center mt-3 mb-1 h-8 items-start relative">
                <img
                  src="https://cdn.prod.website-files.com/694d1ac7dc0a1e269d102252/6958f1b82378acf2b54b3c5b_ezgif-643df4017c51a72f.gif"
                  alt=""
                  className="rotate-160 w-25 absolute -top-3 left-30 filter invert brightness-200"
                />
              </div>

              {/* Call Me button */}
              <button
                ref={buttonRef}
                onClick={handleSubmit}
                disabled={form.loading}
                className="hidden md:block w-full py-3.5 rounded-2xl text-white text-sm font-semibold tracking-wide transition-opacity disabled:opacity-70 hover:cursor-pointer"
                style={{
                  borderRadius: "20px",
                  border: "0px solid rgba(255, 255, 255, 0.19)",
                  background: config.colors.buttonGradientBorder,
                  boxShadow: config.colors.buttonShadow,
                }}
              >
                {form.loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeWidth="3"
                        strokeDasharray="30 60"
                      />
                    </svg>
                    Calling…
                  </span>
                ) : (
                  "Call Me"
                )}
              </button>

              <button
                ref={buttonRef}
                onClick={handleSubmit}
                disabled={form.loading}
                className="md:hidden w-full py-3.5 rounded-2xl text-white text-sm font-semibold tracking-wide transition-opacity disabled:opacity-70 hover:cursor-pointer hover:opacity-90"
                style={{
                  borderRadius: "20px",
                  border: "0px solid rgba(255, 255, 255, 0.19)",
                  background: config.colors.brandColorHex,
                  boxShadow: config.colors.buttonShadow,
                }}
              >
                {form.loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeWidth="3"
                        strokeDasharray="30 60"
                      />
                    </svg>
                    Calling…
                  </span>
                ) : (
                  "Call Me"
                )}
              </button>
            </>
          ) : (
            /* Success state */
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="#4ade80"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-semibold">
                  You'll receive a call shortly!
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Our AI is dialing {form.name}…
                </p>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-gray-500 hover:text-gray-300 underline underline-offset-2 transition-colors"
              >
                Try again
              </button>
            </div>
          )}
        </div>

        {/* Home indicator */}
        <div className="hidden md:flex justify-center pb-3">
          <div className="w-24 h-1 bg-white/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
