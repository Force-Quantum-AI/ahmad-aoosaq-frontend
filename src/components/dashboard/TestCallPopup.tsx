import { useState, useEffect, useRef, useCallback } from "react";
import { PhoneOff, Mic, MicOff, X, PhoneCall, Loader2 } from "lucide-react";
import GradientButton from "@/common/GradientButton";
import {
  useStartTestVoiceMutation,
  useTestVoiceTurnMutation,
  useEndTestVoiceMutation,
} from "@/store/features/agent/aiVoice.api";
import { useSelector } from "react-redux";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type CallState = "ready" | "connecting" | "listening" | "processing" | "agent-speaking";

export default function TestCallPopup({ onClose }: { onClose: () => void }) {
  const [startTestVoice] = useStartTestVoiceMutation();
  const [testVoiceTurn] = useTestVoiceTurnMutation();
  const [endTestVoice] = useEndTestVoiceMutation();

  const [callState, setCallState] = useState<CallState>("ready");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [agentStartingMessage, setAgentStartingMessage] = useState("");

  const [sessionId, setSessionId] = useState("123");
  const sessionIdRef = useRef("");
  const businessId = useSelector((state: any) => state.business.id); // here business id means agent id
  console.log(sessionId);
  


  // Refs to avoid stale closures in async callbacks
  const callStateRef = useRef<CallState>("ready");
  const mutedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const startListeningRef = useRef<() => void>(() => { });
  const activeRef = useRef(false);
  const lastTranscriptRef = useRef<string>("");

  const updateCallState = useCallback((s: CallState) => {
    callStateRef.current = s;
    setCallState(s);
  }, []);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  // Timer — only ticks while call is active
  useEffect(() => {
    if (callState === "ready" || callState === "connecting") return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [callState === "ready" || callState === "connecting"]);

  /** Play base64 or URL audio, resolves when done */
  const playAudio = useCallback((audioUrl: string): Promise<void> => {
    return new Promise((resolve) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
      audio.play().catch(() => resolve());
    });
  }, []);

  /** Tear everything down and call end API */
  const endCall = useCallback(async () => {
    activeRef.current = false;

    // Stop mic
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { }
      recognitionRef.current = null;
    }
    isListeningRef.current = false;

    // Stop audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }

    // Call end API — fire and forget, don't block UI
    endTestVoice({
      data: {
        session_id: sessionIdRef.current,
        text: lastTranscriptRef.current,
        agent_id: `${businessId}`,
      },
    }).catch(() => { });
    sessionIdRef.current = "";
    updateCallState("ready");
    setSeconds(0);
    lastTranscriptRef.current = "";
  }, [endTestVoice, updateCallState]);

  const handleEndCall = endCall;

  /** Send transcript to API, play response, then resume listening */
  const sendTurn = useCallback(
    async (transcript: string) => {
      lastTranscriptRef.current = transcript; // always track last user text
      if (!activeRef.current) return;

      updateCallState("processing");
      try {
        const res: any = await testVoiceTurn({
          data: { session_id: sessionIdRef.current, text: transcript, agent_id: `${businessId}` },
        });

        if (!activeRef.current) return;
        sessionIdRef.current = res?.data?.session_id;

        const { audio_url, is_active } = res?.data ?? {};

        if (audio_url) {
          updateCallState("agent-speaking");
          await playAudio(audio_url);
        }

        if (!activeRef.current) return;

        if (is_active !== false) {
          // Session still alive — keep listening
          updateCallState("listening");
          startListeningRef.current();
        } else {
          // Agent naturally ended the session
          await endCall();
        }
      } catch {
        if (activeRef.current) {
          updateCallState("listening");
          startListeningRef.current();
        }
      }
    },
    [testVoiceTurn, playAudio, updateCallState, endCall]
  );

  /** Initialise and start one recognition cycle */
  const startListening = useCallback(() => {
    if (!activeRef.current || mutedRef.current || isListeningRef.current) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognitionRef.current = recognition;
    isListeningRef.current = true;

    recognition.onresult = (event: any) => {
      isListeningRef.current = false;
      const transcript: string = event.results[0]?.[0]?.transcript?.trim();
      if (transcript) {
        sendTurn(transcript);
      } else if (activeRef.current) {
        updateCallState("listening");
        startListeningRef.current();
      }
    };

    recognition.onerror = () => {
      isListeningRef.current = false;
      if (activeRef.current) {
        updateCallState("listening");
        setTimeout(() => startListeningRef.current(), 300);
      }
    };

    recognition.onend = () => {
      isListeningRef.current = false;
    };

    try {
      recognition.start();
      updateCallState("listening");
    } catch {
      isListeningRef.current = false;
    }
  }, [sendTurn, updateCallState]);

  // Keep ref always pointing to latest startListening
  useEffect(() => {
    startListeningRef.current = startListening;
  }, [startListening]);

  // Cleanup on unmount
  useEffect(() => () => { endCall(); }, [endCall]);

  /** Kick off the call */
  const handleStartCall = async () => {
    updateCallState("connecting");
    activeRef.current = true;
    setSeconds(0);
    setMuted(false);
    mutedRef.current = false;
    lastTranscriptRef.current = "";

    try {
      const res: any = await startTestVoice({ agent_id: `${businessId}` });
      setAgentStartingMessage(res?.data?.text ?? "");
      const sId = res?.data?.session_id;
      setSessionId(sId);
      sessionIdRef.current = sId;


      if (!activeRef.current) return;

      if (res?.data?.audio_url) {
        updateCallState("agent-speaking");
        await playAudio(res.data.audio_url);
      }

      if (!activeRef.current) return;
      updateCallState("listening");
      startListeningRef.current();
    } catch {
      if (activeRef.current) {
        updateCallState("listening");
        startListeningRef.current();
      }
    }
  };

  /** Toggle mute — stops/resumes recognition */
  const handleMute = () => {
    const next = !muted;
    setMuted(next);
    mutedRef.current = next;

    if (next) {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch { }
        recognitionRef.current = null;
      }
      isListeningRef.current = false;
    } else {
      // Unmuting: resume listening if we were in that state
      if (callStateRef.current === "listening" && activeRef.current) {
        setTimeout(() => startListeningRef.current(), 100);
      }
    }
  };

  /* ─── UI helpers ─────────────────────────────────────── */

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const isConnected = callState !== "ready" && callState !== "connecting";

  const statusMap: Record<CallState, { label: string; color: string }> = {
    ready: { label: "Ready", color: "text-gray-500" },
    connecting: { label: "Connecting…", color: "text-yellow-500" },
    listening: { label: muted ? "Muted" : "Listening…", color: muted ? "text-gray-400" : "text-blue-500" },
    processing: { label: "Processing…", color: "text-yellow-500" },
    "agent-speaking": { label: "Agent speaking", color: "text-green-500" },
  };
  const { label: statusLabel, color: statusColor } = statusMap[callState];

  const WaveBars = ({ color }: { color: string }) => (
    <div className="flex items-center gap-[3px] h-6">
      {[12, 20, 8, 18, 10, 22, 14].map((h, i) => (
        <div
          key={i}
          className={`w-[5px] rounded-full animate-pulse ${color}`}
          style={{ height: h, animationDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
      <div
        className="w-96 p-5 relative bg-white"
        style={{
          borderRadius: "20px",
          boxShadow: "0 0 34px 0 rgba(0,0,0,0.25)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mb-5 space-y-3">
          <div
            className={`w-16 h-16 flex items-center justify-center border-2 border-gray-200 transition-colors duration-500 ${isConnected ? "bg-green-500/20" : "bg-gray-100"
              }`}
            style={{ borderRadius: "20px", boxShadow: "0 8px 14px 0 rgba(78,78,78,0.35)" }}
          >
            <PhoneCall
              size={28}
              className={`transition-colors duration-500 ${isConnected ? "text-green-500" : "text-gray-500"}`}
            />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Test Call</h2>
            <p className="text-sm text-gray-500 mt-0.5">Luxe Home Services Assistant</p>
          </div>
        </div>

        {/* Body */}
        {!isConnected ? (
          <>
            <p className="text-center text-base font-medium text-gray-700 mb-5">
              {callState === "connecting" ? "Connecting…" : "Ready to make a test call"}
            </p>
            <GradientButton
              onClick={handleStartCall}
              disabled={callState === "connecting"}
              className="w-full mb-5"
            >
              {callState === "connecting" ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Connecting…
                </span>
              ) : (
                "Start Call"
              )}
            </GradientButton>
          </>
        ) : (
          <>
            {/* Status + Timer */}
            <div className="flex flex-col items-center mb-5 gap-1">
              <span className={`text-xs font-semibold uppercase tracking-wider ${statusColor}`}>
                {statusLabel}
              </span>
              <span className="text-gray-900 font-bold text-3xl tracking-[6px] tabular-nums">
                {formatTime(seconds)}
              </span>

              {/* Visual indicators */}
              <div className="mt-2 h-7 flex items-center">
                {callState === "listening" && !muted && (
                  <WaveBars color="bg-blue-500" />
                )}
                {callState === "agent-speaking" && (
                  <WaveBars color="bg-green-500" />
                )}
                {callState === "processing" && (
                  <Loader2 size={18} className="text-yellow-500 animate-spin" />
                )}
                {muted && callState === "listening" && (
                  <MicOff size={18} className="text-gray-400" />
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 mb-5">
              <button
                onClick={handleMute}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border text-sm font-semibold transition-all cursor-pointer ${muted
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                  }`}
              >
                {muted ? <MicOff size={16} /> : <Mic size={16} />}
                {muted ? "Unmute" : "Mute"}
              </button>
              <button
                onClick={handleEndCall}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                <PhoneOff size={16} />
                End Call
              </button>
            </div>
          </>
        )}

        {/* Agent Details */}
        <div className="bg-[#F2F4F5] rounded-xl p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Agent Details
          </p>
          <ul className="space-y-1 list-disc pl-4">
            <li className="text-sm text-gray-400">
              <span className="font-semibold text-gray-900">Business:</span> Luxe Home Services
            </li>
            <li className="text-sm text-gray-400">
              <span className="font-semibold text-gray-700">Type:</span> Home repair and handyman services
            </li>
          </ul>
          {agentStartingMessage && (
            <p className="text-xs text-gray-600 italic mt-3 border-t border-gray-200 pt-2">
              "{agentStartingMessage}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}