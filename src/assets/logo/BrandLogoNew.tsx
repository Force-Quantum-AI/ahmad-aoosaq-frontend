export const CHYRIcon = () => (
  <div className="flex items-center gap-2 md:gap-3">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chyr-g" x1="20" y1="4" x2="20" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FFCD73" />
          <stop offset="50%" stop-color="#E07B9B" />
          <stop offset="100%" stop-color="#C06CB4" />
        </linearGradient>
      </defs>
      <path d="M20 4C20 4 26 10 26 16C26 19 24 20 20 20C16 20 14 19 14 16C14 10 20 4 20 4Z" fill="url(#chyr-g)" />
      <path d="M10 16C10 16 8 24 12 28C14.5 30.5 17 28 18 25C15 23 12 20 10 16Z" fill="url(#chyr-g)" opacity="0.4" />
      <path d="M30 16C30 16 32 24 28 28C25.5 30.5 23 28 22 25C25 23 28 20 30 16Z" fill="url(#chyr-g)" opacity="0.4" />
    </svg>

    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: "22px", fontWeight: 700, letterSpacing: "3px", color: "#fff" }}>CHYR</span>
    </div>
  </div>
);
export const AVRIANCEIcon = () => (
  <div className="flex items-center gap-2 md:gap-3">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="av-g" x1="6" y1="8" x2="34" y2="32">
          <stop offset="0%" stopColor="#FF8A8A" />
          <stop offset="50%" stopColor="#E64C4C" />
          <stop offset="100%" stopColor="#A03030" />
        </linearGradient>

        <linearGradient id="av-gs" x1="10" y1="20" x2="30" y2="34">
          <stop offset="0%" stopColor="#FF8A8A" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#A03030" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      <path d="M6 8L36 18L20 22L14 36L6 8Z" fill="url(#av-g)" />
      <path d="M20 22L36 18L14 36L20 22Z" fill="url(#av-gs)" />

      <line
        x1="6"
        y1="8"
        x2="20"
        y2="22"
        stroke="white"
        strokeWidth="0.8"
        opacity="0.3"
      />
    </svg>

    <span className="text-white text-[22px] font-bold tracking-[3px]">
      AVRIANCE
    </span>
  </div>
);
export const NOHMIcon = () => (
  <div className="flex items-center gap-2 md:gap-3">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="nm-g" x1="12" y1="4" x2="28" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FF5C80" />
          <stop offset="50%" stop-color="#F00B4F" />
          <stop offset="100%" stop-color="#A00838" />
        </linearGradient>
        <linearGradient id="nm-gk" x1="24" y1="4" x2="30" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FF5C80" stop-opacity="0.6" />
          <stop offset="100%" stop-color="#A00838" stop-opacity="0.3" />
        </linearGradient>
      </defs>

      <path d="M11 4V14C11 16 12 17.5 14 17.5V36" stroke="url(#nm-g)" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <line x1="11" y1="4" x2="11" y2="12" stroke="url(#nm-g)" stroke-width="2.5" stroke-linecap="round" />
      <line x1="14" y1="4" x2="14" y2="12" stroke="url(#nm-g)" stroke-width="2.5" stroke-linecap="round" />
      <line x1="17" y1="4" x2="17" y2="12" stroke="url(#nm-g)" stroke-width="2.5" stroke-linecap="round" />
      <path d="M17 14C17 16 16 17.5 14 17.5" stroke="url(#nm-g)" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M26 4C26 4 30 4 30 10C30 14 28 16 26 17V36" stroke="url(#nm-gk)" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M26 4C26 4 30 4 30 10C30 14 28 16 26 17V4Z" fill="url(#nm-gk)" opacity="0.3" />
    </svg>
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: "22px", fontWeight: 700, letterSpacing: "3px", color: "#fff" }}>NOHM</span>
    </div>
  </div>
);

export const CHYRIconWithoutText = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="chyr-g" x1="20" y1="4" x2="20" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#FFCD73" />
        <stop offset="50%" stop-color="#E07B9B" />
        <stop offset="100%" stop-color="#C06CB4" />
      </linearGradient>
    </defs>
    <path d="M20 4C20 4 26 10 26 16C26 19 24 20 20 20C16 20 14 19 14 16C14 10 20 4 20 4Z" fill="url(#chyr-g)" />
    <path d="M10 16C10 16 8 24 12 28C14.5 30.5 17 28 18 25C15 23 12 20 10 16Z" fill="url(#chyr-g)" opacity="0.4" />
    <path d="M30 16C30 16 32 24 28 28C25.5 30.5 23 28 22 25C25 23 28 20 30 16Z" fill="url(#chyr-g)" opacity="0.4" />
  </svg>
);
export const AVRIANCEIconWithoutText = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <defs>
      <linearGradient id="av-g" x1="6" y1="8" x2="34" y2="32">
        <stop offset="0%" stopColor="#FF8A8A" />
        <stop offset="50%" stopColor="#E64C4C" />
        <stop offset="100%" stopColor="#A03030" />
      </linearGradient>

      <linearGradient id="av-gs" x1="10" y1="20" x2="30" y2="34">
        <stop offset="0%" stopColor="#FF8A8A" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#A03030" stopOpacity="0.15" />
      </linearGradient>
    </defs>

    <path d="M6 8L36 18L20 22L14 36L6 8Z" fill="url(#av-g)" />
    <path d="M20 22L36 18L14 36L20 22Z" fill="url(#av-gs)" />

    <line
      x1="6"
      y1="8"
      x2="20"
      y2="22"
      stroke="white"
      strokeWidth="0.8"
      opacity="0.3"
    />
  </svg>
);
export const NOHMIconWithoutText = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="nm-g" x1="12" y1="4" x2="28" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#FF5C80" />
        <stop offset="50%" stop-color="#F00B4F" />
        <stop offset="100%" stop-color="#A00838" />
      </linearGradient>
      <linearGradient id="nm-gk" x1="24" y1="4" x2="30" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#FF5C80" stop-opacity="0.6" />
        <stop offset="100%" stop-color="#A00838" stop-opacity="0.3" />
      </linearGradient>
    </defs>

    <path d="M11 4V14C11 16 12 17.5 14 17.5V36" stroke="url(#nm-g)" stroke-width="2.5" stroke-linecap="round" fill="none" />
    <line x1="11" y1="4" x2="11" y2="12" stroke="url(#nm-g)" stroke-width="2.5" stroke-linecap="round" />
    <line x1="14" y1="4" x2="14" y2="12" stroke="url(#nm-g)" stroke-width="2.5" stroke-linecap="round" />
    <line x1="17" y1="4" x2="17" y2="12" stroke="url(#nm-g)" stroke-width="2.5" stroke-linecap="round" />
    <path d="M17 14C17 16 16 17.5 14 17.5" stroke="url(#nm-g)" stroke-width="2.5" stroke-linecap="round" fill="none" />
    <path d="M26 4C26 4 30 4 30 10C30 14 28 16 26 17V36" stroke="url(#nm-gk)" stroke-width="2.5" stroke-linecap="round" fill="none" />
    <path d="M26 4C26 4 30 4 30 10C30 14 28 16 26 17V4Z" fill="url(#nm-gk)" opacity="0.3" />
  </svg>
);