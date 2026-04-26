("use client");

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, Dot } from "lucide-react";
import BookDemoModal from "@/pages/BookDemoModal";
import { useLandingConfig } from "@/contexts/LandingConfigContext";

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

// Generate a fixed set of bar heights that look like a real waveform
const generateBars = (count: number): number[] => {
  const seed = [
    0.15, 0.2, 0.25, 0.18, 0.35, 0.5, 0.4, 0.6, 0.75, 0.55, 0.45, 0.7, 0.9,
    0.85, 0.95, 1.0, 0.9, 0.85, 0.75, 0.8, 0.7, 0.6, 0.75, 0.65, 0.5, 0.55,
    0.45, 0.4, 0.35, 0.5, 0.6, 0.7, 0.8, 0.75, 0.65, 0.55, 0.45, 0.35, 0.3, 0.2,
    0.25, 0.3, 0.25, 0.2, 0.15, 0.18, 0.22, 0.15, 0.12, 0.1,
  ];
  return Array.from({ length: count }, (_, i) => seed[i % seed.length]);
};

const BAR_COUNT = 50;
const bars = generateBars(BAR_COUNT);

// ── Props ─────────────────────────────────────────────────────────────────────
interface AudioPlayerProps {
  /** Path relative to /public, e.g. "/demo-call.mp3" */
  src: string;
  title?: string;
  label?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ChyrDemoAudioPlayer({
  src,
  title = "Sample call recording",
  label = "Hear HyIn In Action",
}: AudioPlayerProps) {
  const { config } = useLandingConfig();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number>(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // progress 0–1
  const progress = duration > 0 ? currentTime / duration : 0;

  // ── Audio event wiring ──────────────────────────────────────────────────
  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;

    const onLoaded = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      cancelAnimationFrame(animFrameRef.current);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [src]);

  const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const check = () => setIsMobile(window.innerWidth < 768);
      check();

      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
    }, []);

    return isMobile;
  };
  const isMobile = useIsMobile();

  // ── RAF loop for smooth time update ────────────────────────────────────
  const tick = useCallback(() => {
    if (audioRef.current && !isDragging) {
      setCurrentTime(audioRef.current.currentTime);
    }
    animFrameRef.current = requestAnimationFrame(tick);
  }, [isDragging]);

  const startTick = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(tick);
  }, [tick]);

  // ── Play / Pause ────────────────────────────────────────────────────────
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      cancelAnimationFrame(animFrameRef.current);
      setIsPlaying(false);
    } else {
      await audio.play();
      startTick();
      setIsPlaying(true);
    }
  };

  // ── Seek by clicking/dragging on waveform ───────────────────────────────
  const seekTo = (clientX: number) => {
    const bar = progressRef.current;
    const audio = audioRef.current;
    if (!bar || !audio || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newTime = ratio * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    seekTo(e.clientX);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) seekTo(e.clientX);
  };

  const handlePointerUp = () => setIsDragging(false);

  return (
    <div 
      className="w-full rounded-2xl p-[3px]"
      style={{
        background: isMobile
          ? config.colors.brandColorHex
          : config.colors.buttonGradientBorder,
      }}
    >
    {/* <div className="w-full rounded-2xl p-[3px]" style={{ background: config.colors.buttonGradientBorder }}> */}
        <div className="w-full bg-[#121111] rounded-2xl shadow-lg overflow-hidden">
          {/* Card header */}
          <div className=" px-6 pt-6 pb-4">
            <h3 className="hidden md:block text-gray-300 text-xl font-semibold  tracking-tight">
              {label}
            </h3>
          </div>

          {/* Waveform area */}
          <div className="mx-4 mb-4 bg-[#1c1c1e] rounded-xl px-5 pb-5 md:py-5">
            <p className="text-gray-500 text-sm mb-14 invisible md:visible">{title}</p>

            {/* Waveform + play button */}
            <div
              ref={progressRef}
              className="relative flex items-center justify-center gap-[3px] h-[42px] md:h-[72px] cursor-pointer select-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              {bars.map((height, i) => {
                const barProgress = i / BAR_COUNT;
                const isPast = barProgress < progress;
                const isNearPlayhead = Math.abs(barProgress - progress) < 0.03;

                return (
                  <div
                    key={i}
                    className="rounded-full flex-shrink-0 transition-colors duration-75"
                    style={{
                      width: 3,
                      height: `${Math.max(6, height * 60)}px`,
                      backgroundColor: isPast
                        ? isNearPlayhead
                          ? "#1a90ff"
                          : "#555"
                        : isPlaying
                          ? `rgba(80,80,80,${0.3 + height * 0.5})`
                          : `rgba(80,80,80,${0.25 + height * 0.45})`,
                      transform:
                        isPlaying && isNearPlayhead
                          ? `scaleY(${1 + Math.sin(Date.now() / 150 + i) * 0.15})`
                          : "scaleY(1)",
                    }}
                  />
                );
              })}

              {/* Play / Pause button — centered overlay */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute w-12 h-12 rounded-full hidden md:flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 z-10"
                style={{
                  background: config.colors.revenueCTAGradient,
                  boxShadow: "0 4px 20px rgba(26,144,255,0.45)",
                }}
              >
                {isPlaying ? (
                  <Pause size={18} fill="white" color="white" />
                ) : (
                  <Play
                    size={18}
                    fill="white"
                    color="white"
                    className="translate-x-0.5"
                  />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute w-12 h-12 rounded-full flex md:hidden items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 z-10"
                style={{
                  background: config.colors.brandColorHex,
                  boxShadow: "0 4px 20px rgba(26,144,255,0.45)",
                }}
              >
                {isPlaying ? (
                  <Pause size={18} fill="white" color="white" />
                ) : (
                  <Play
                    size={18}
                    fill="white"
                    color="white"
                    className="translate-x-0.5"
                  />
                )}
              </button>
            </div>

            {/* Time row */}
            <div className="flex justify-between mt-14">
              <span className="text-gray-400 text-xs tabular-nums">
                {formatTime(currentTime)}
              </span>
              <span className="text-gray-400 text-xs tabular-nums">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Book a Demo CTA */}
          <div className="px-4 pb-5 flex flex-col items-center gap-3 mt-10">
            <button
              onClick={() => setIsBookModalOpen(true)}
              className="hidden md:block w-full py-3.5 rounded-xl text-white text-sm font-semibold tracking-wide transition-opacity hover:opacity-90 active:scale-[0.99]"
              style={{
                borderRadius: "20px",
                border: "0px solid rgba(255, 255, 255, 0.19)",
                background: config.colors.buttonGradientBorder,
                boxShadow: config.colors.buttonShadow,
              }}
            >
              Book a Demo 
            </button> 
            <p className="hidden md:flex text-gray-400 text-xs text-center py-3  items-center">
              <Dot className={`text-[${config.colors.primaryHex}]`} size={30} /> 27 operators booked a call this week
            </p>
            {/* <p className="text-gray-400 text-xs text-center italic py-3">
            "This is a real AI-generated voice, responding in real time."
          </p> */}
          </div>
        </div>
        <BookDemoModal open={isBookModalOpen} setOpen={setIsBookModalOpen} />
      </div>
      );
}
