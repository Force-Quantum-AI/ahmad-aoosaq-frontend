"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { FiMic, FiMicOff, FiPhoneOff, FiCheck } from "react-icons/fi";
import { ChevronLeft, Loader2, Pause } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setBusinessId, setBusinessNameAndDescription } from "@/store/features/business/business.slice";
import { useCreateBusinessMutation, useCreateBusinessServicesMutation, useCreateBusinessHoursMutation } from "@/store/features/business/business.api";
import { toast } from "react-toastify";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Message {
    id: string;
    role: "ai" | "user";
    text: string;
    time: string;
}

interface CollectedData {
    businessName?: string;
    businessType?: string;
    services?: string;
    hours?: string;
    description?: string;
}

interface StepThreeProps {
    setStep: (step: number) => void;
    onDataCollected?: (data: CollectedData) => void;
}

// ── AI Conversation Script ─────────────────────────────────────────────────────
const AI_SCRIPT = [
    {
        question: "Hi! I'm your Bizzy AI assistant. I'm here to set up your AI phone agent. This will take just a few minutes. Ready to get started? What's the name of your business?",
        field: "businessName" as keyof CollectedData,
    },
    {
        question: "Great! What type of business is it? For example: home repair, restaurant, medical clinic, etc.",
        field: "businessType" as keyof CollectedData,
    },
    {
        question: "What services or products do you offer? You can list a few of the main ones.",
        field: "services" as keyof CollectedData,
    },
    {
        question: "What are your business hours? For example: Monday to Friday, 9 AM to 6 PM.",
        field: "hours" as keyof CollectedData,
    },
    {
        question: "Finally, give me a short description of your business — who you serve and where you're located.",
        field: "description" as keyof CollectedData,
    },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const getTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const uid = () => Math.random().toString(36).slice(2);

type SpeechRecognition = any;

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

// ── Component ─────────────────────────────────────────────────────────────────
const StepThree = ({ setStep, onDataCollected }: StepThreeProps) => {
    const dispatch = useDispatch();
    const businessDataRedux = useSelector((state: any) => state.business);

    const [createBusiness] = useCreateBusinessMutation();
    const [createBusinessServices] = useCreateBusinessServicesMutation();
    const [createBusinessHours] = useCreateBusinessHoursMutation();

    const [messages, setMessages] = useState<Message[]>([]);
    const [transcript, setTranscript] = useState("");
    const [isMuted, setIsMuted] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [scriptIndex, setScriptIndex] = useState(0);
    const [collectedData, setCollectedData] = useState<CollectedData>({});
    const [callEnded, setCallEnded] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const awaitingUserRef = useRef(false);
    const transcriptRef = useRef("");

    const isMutedRef = useRef(isMuted);
    isMutedRef.current = isMuted;

    const isPausedRef = useRef(isPaused);
    isPausedRef.current = isPaused;

    const isAiSpeakingRef = useRef(isAiSpeaking);
    isAiSpeakingRef.current = isAiSpeaking;

    const isAiTypingRef = useRef(isAiTyping);
    isAiTypingRef.current = isAiTyping;

    const callEndedRef = useRef(callEnded);
    callEndedRef.current = callEnded;

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, transcript, isAiTyping, isAiSpeaking]);

    // TTS — AI speaks
    const speak = useCallback((text: string, onDone?: () => void) => {
        if (!window.speechSynthesis) { onDone?.(); return; }
        window.speechSynthesis.cancel();
        setIsAiSpeaking(true);
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 1.05;
        utter.pitch = 1;
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(
            (v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("female")
        ) || voices.find((v) => v.lang.startsWith("en")) || voices[0];
        if (preferred) utter.voice = preferred;
        
        utter.onstart = () => setIsAiSpeaking(true);
        utter.onend = () => {
            setIsAiSpeaking(false);
            onDone?.();
        };
        utter.onerror = () => {
            setIsAiSpeaking(false);
            onDone?.();
        };
        window.speechSynthesis.speak(utter);
    }, []);

    // Push AI message
    const pushAiMessage = useCallback(
        (text: string, afterDone?: () => void) => {
            setIsAiTyping(true);
            const delay = Math.min(1800, Math.max(800, text.length * 18));
            setTimeout(() => {
                if (callEndedRef.current || isPausedRef.current) {
                    setIsAiTyping(false);
                    return;
                }
                setIsAiTyping(false);
                setMessages((prev) => [
                    ...prev,
                    { id: uid(), role: "ai", text, time: getTime() },
                ]);
                speak(text, afterDone);
            }, delay);
        },
        [speak]
    );

    // Submit collected voice data to the API (mirrors ManualAiAgent logic)
    const submitVoiceDataToApi = useCallback(
        async (data: CollectedData) => {
            setIsSubmitting(true);
            try {
                // ── Step 1: Create Business ──────────────────────────────────
                const businessPayload = {
                    name: data.businessName || "My Business",
                    business_type: data.businessType || "general",
                    description: data.description || "",
                    business_email: businessDataRedux.business_email,
                    business_website: businessDataRedux.business_website,
                };
                const businessResponse = await createBusiness(businessPayload).unwrap();
                const businessId = businessResponse?.id;

                dispatch(setBusinessId(businessId));
                dispatch(
                    setBusinessNameAndDescription({
                        business_name: data.businessName || "",
                        business_description: data.description || "",
                    })
                );
                console.log("[Voice] Created business. ID:", businessId);

                // ── Step 2: Create Services ──────────────────────────────────
                if (data.services) {
                    const servicePayload = {
                        name: data.services,
                        category: "Serving",
                    };
                    await createBusinessServices({ business_id: businessId, data: servicePayload }).unwrap();
                    console.log("[Voice] Created business services.");
                }

                // ── Step 3: Create Business Hours (Mon–Fri 9AM–5PM defaults) ─
                // Natural-language hours from voice are hard to parse reliably,
                // so we create a sensible default range the user can edit later.
                const defaultDays = [0, 1, 2, 3, 4]; // Monday – Friday
                await Promise.all(
                    defaultDays.map((day) =>
                        createBusinessHours({
                            business_id: businessId,
                            data: {
                                business: businessId,
                                day: day.toString(),
                                open_time: "09:00:00",
                                close_time: "17:00:00",
                                is_closed: false,
                            },
                        }).unwrap()
                    )
                );
                console.log("[Voice] Created business hours.");
            } catch (error) {
                console.error("[Voice] Failed to save business data:", error);
                toast.error("Failed to save business data. You can update it from the dashboard.");
            } finally {
                setIsSubmitting(false);
            }
        },
        [businessDataRedux, createBusiness, createBusinessServices, createBusinessHours, dispatch]
    );

    // End call
    const handleEndCall = useCallback(
        (auto = false, isError = false) => {
            window.speechSynthesis?.cancel();
            recognitionRef.current?.abort();
            setIsListening(false);
            setCallEnded(true);
            setIsAiSpeaking(false);
            setIsAiTyping(false);
            setTimeout(async () => {
                onDataCollected?.(collectedData);
                if (isError) {
                    setStep(4);
                } else {
                    await submitVoiceDataToApi(collectedData);
                    setStep(5);
                }
            }, auto ? 500 : 1200);
        },
        [collectedData, onDataCollected, setStep, submitVoiceDataToApi]
    );

    // Handle user's spoken answer
    const handleUserAnswerRef = useRef<(text: string) => void>(() => {});
    const handleUserAnswer = useCallback(
        (text: string) => {
            setMessages((prev) => [
                ...prev,
                { id: uid(), role: "user", text, time: getTime() },
            ]);

            const field = AI_SCRIPT[scriptIndex]?.field;
            if (field) {
                setCollectedData((prev) => ({ ...prev, [field]: text }));
            }

            const nextIndex = scriptIndex + 1;

            if (nextIndex < AI_SCRIPT.length) {
                setScriptIndex(nextIndex);
                pushAiMessage(AI_SCRIPT[nextIndex].question, () => {
                    awaitingUserRef.current = false;
                    try { startListening(); } catch(e){}
                });
            } else {
                pushAiMessage(
                    "Perfect! I have everything I need. Your AI agent is being set up now. You'll be able to review and edit everything on the next screen.",
                    () => {
                        awaitingUserRef.current = false;
                        setTimeout(() => handleEndCall(true), 1500);
                    }
                );
            }
        },
        [scriptIndex, pushAiMessage, handleEndCall]
    );
    handleUserAnswerRef.current = handleUserAnswer;

    // Start listening
    const startListening = useCallback(() => {
        if (isMutedRef.current || isPausedRef.current || callEndedRef.current) return;
        
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { setSpeechSupported(false); return; }

        if (recognitionRef.current) {
            try { recognitionRef.current.abort(); } catch (e) {}
        }

        const recognition = new SR();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (e: any) => {
            let interim = "";
            let final = "";
            for (let i = e.resultIndex; i < e.results.length; i++) {
                const t = e.results[i][0].transcript;
                if (e.results[i].isFinal) final += t;
                else interim += t;
            }
            const currentTranscript = final || interim;
            setTranscript(currentTranscript);
            transcriptRef.current = currentTranscript;
        };

        recognition.onend = () => {
            setIsListening(false);
            const spoken = transcriptRef.current.trim();
            if (spoken && !awaitingUserRef.current) {
                awaitingUserRef.current = true;
                handleUserAnswerRef.current?.(spoken);
                transcriptRef.current = "";
                setTranscript("");
            } else if (!spoken && !isMutedRef.current && !isPausedRef.current && !callEndedRef.current && !awaitingUserRef.current) {
                setTimeout(() => {
                    if (!isMutedRef.current && !isPausedRef.current && !isAiSpeakingRef.current && !isAiTypingRef.current && !callEndedRef.current && !awaitingUserRef.current) {
                        try { startListening(); } catch(e){}
                    }
                }, 300);
            }
        };

        recognition.onerror = (e: any) => {
            if (e.error !== "no-speech" && e.error !== "aborted") {
                console.warn("STT error:", e.error);
                handleEndCall(false, true);
            }
            setIsListening(false);
        };

        try { recognition.start(); } catch(e) {}
    }, [handleEndCall]);

    // Boot
    useEffect(() => {
        synthRef.current = window.speechSynthesis;
        window.speechSynthesis?.getVoices();
        window.speechSynthesis?.addEventListener?.("voiceschanged", () => { });

        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
            setSpeechSupported(false);
        }

        pushAiMessage(AI_SCRIPT[0].question, () => {
            awaitingUserRef.current = false;
            try { startListening(); } catch(e){}
        });

        return () => {
            window.speechSynthesis?.cancel();
            recognitionRef.current?.abort();
            callEndedRef.current = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Mute / Unmute
    const handleMuteToggle = () => {
        setIsMuted((prev) => {
            const next = !prev;
            isMutedRef.current = next;
            if (next) {
                recognitionRef.current?.abort();
                setIsListening(false);
            } else {
                if (!isAiTypingRef.current && !isAiSpeakingRef.current && !isPausedRef.current && !callEndedRef.current) {
                    try { startListening(); } catch(e){}
                }
            }
            return next;
        });
    };

    // Pause / Resume / Save
    const handlePause = () => {
        setIsPaused(true);
        isPausedRef.current = true;
        window.speechSynthesis?.cancel();
        recognitionRef.current?.abort();
        setIsListening(false);
        setIsAiTyping(false);
        setIsAiSpeaking(false);
    };

    const handleResume = () => {
        setIsPaused(false);
        isPausedRef.current = false;
        
        let question = AI_SCRIPT[scriptIndex]?.question;
        // Resume by restating the current question
        if (question && !awaitingUserRef.current && scriptIndex < AI_SCRIPT.length) {
            pushAiMessage("Let's continue. " + question, () => {
                awaitingUserRef.current = false;
                try { startListening(); } catch(e){}
            });
        } else {
            // Already awaiting user or completed script
            try { startListening(); } catch(e){}
        }
    };

    const handleSave = () => {
        handleEndCall(false, false);
    };

    // Manual text input
    const [manualInput, setManualInput] = useState("");
    const handleManualSend = () => {
        const text = manualInput.trim();
        if (!text || awaitingUserRef.current) return;
        setManualInput("");
        awaitingUserRef.current = true;
        
        if (isAiSpeakingRef.current) {
            window.speechSynthesis?.cancel();
            setIsAiSpeaking(false);
        }
        if (recognitionRef.current) {
            try { recognitionRef.current.abort(); } catch(e){}
            setIsListening(false);
            transcriptRef.current = "";
            setTranscript("");
        }
        
        handleUserAnswer(text);
    };

    const progress = Math.round((scriptIndex / AI_SCRIPT.length) * 100);

    return (
        <div className="w-full min-h-screen text-center relative z-10 flex flex-col items-center justify-between transition-all duration-700 animate-in fade-in overflow-hidden">
            {/* Saving overlay shown while API calls are in-flight */}
            {isSubmitting && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm gap-4">
                    <Loader2 size={40} className="text-[#5D5FEF] animate-spin" />
                    <p className="text-white text-sm font-medium">Setting up your agent…</p>
                </div>
            )}
            <div className="pt-8 md:pt-12 px-6 w-full max-w-5xl mx-auto">
                <h2 className="text-[26px] md:text-[32px] font-medium mb-2 font-geist text-white">
                    Tell me about your business
                </h2>
                <p className="text-gray-600 text-sm md:text-base font-geist leading-normal">
                    Just speak naturally — I'll gather what I need
                </p>

                <div className="mt-5 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[#5015EF] to-[#9F1DF5] rounded-full transition-all duration-700"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-gray-600 text-[11px] mt-1.5 text-right">
                    {scriptIndex}/{AI_SCRIPT.length} questions answered
                </p>
                <div className="w-full py-2 flex justify-center mb-2 bg-black z-999 relative">
                    <img
                        src="/VoiceIcon.png"
                        alt="AI"
                        className="w-[80px] md:w-[200px] object-contain opacity-90 z-10"
                    />

                    {((isAiSpeaking || (isListening && transcript.trim().length > 0)) && !isPaused && !callEnded) && (
                        <>
                            <img
                                src="/VoiceIcon.png"
                                alt="AI"
                                className="w-[80px] md:w-[200px] object-contain opacity-90 animate-pulse z-10 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
                            />
                            <img
                                src="/VoiceIcon.png"
                                alt="AI"
                                className="w-[40px] md:w-[100px] object-contain opacity-90 animate-ping z-0 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
                            />
                            <img
                                src="/VoiceIcon.png"
                                alt="AI"
                                className="w-[50px] md:w-[130px] object-contain opacity-90 animate-ping z-0 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
                            />
                        </>
                    )}
                </div>
                <div className="flex items-center justify-center gap-2 mb-3">
                    {callEnded ? (
                        <>
                            <span className="w-2 h-2 rounded-full bg-gray-500" />
                            <span className="text-gray-500 text-xs tracking-wider">Ended</span>
                        </>
                    ) : isPaused ? (
                        <>
                            <span className="w-2 h-2 rounded-full bg-yellow-400" />
                            <span className="text-yellow-400 text-xs tracking-wider">Paused</span>
                        </>
                    ) : isAiSpeaking ? (
                        <>
                            <span className="w-2 h-2 rounded-full bg-[#8E8FF4] animate-pulse" />
                            <span className="text-[#8E8FF4] text-xs tracking-wider">AI is speaking…</span>
                        </>
                    ) : isAiTyping ? (
                        <>
                            <span className="w-2 h-2 rounded-full bg-[#8E8FF4] animate-pulse" />
                            <span className="text-[#8E8FF4] text-xs tracking-wider">AI is typing…</span>
                        </>
                    ) : isMuted ? (
                        <>
                            <span className="w-2 h-2 rounded-full bg-red-400" />
                            <span className="text-red-400 text-xs tracking-wider">Muted</span>
                        </>
                    ) : isListening ? (
                        <>
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-green-400 text-xs tracking-wider">Listening…</span>
                        </>
                    ) : (
                        <>
                            <span className="w-2 h-2 rounded-full bg-white/30" />
                            <span className="text-gray-500 text-xs tracking-wider">Waiting…</span>
                        </>
                    )}
                </div>
            </div>

            <div
                ref={scrollRef}
                className="relative flex-1 w-full max-w-5xl mx-auto px-4 py-4 overflow-y-auto flex flex-col gap-4"
                style={{ maxHeight: "20vh", minHeight: 240 }}
            >
                {messages.map((msg) =>
                    msg.role === "ai" ? (
                        <div key={msg.id} className="flex justify-start">
                            <div className="bg-[#1C1C1E] border border-white/10 rounded-[18px] rounded-tl-[4px] px-5 py-4 text-left max-w-[85%] shadow-md relative">
                                <p
                                    className="text-sm font-normal leading-relaxed"
                                    style={{
                                        background: "linear-gradient(91deg, #5015EF 5.91%, #9F1DF5 47.87%, #6203DF 93.09%)",
                                        backgroundClip: "text",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    {msg.text}
                                </p>
                                <p className="text-[#8E8FF4] text-[10px] mt-2 font-medium">{msg.time}</p>
                            </div>
                        </div>
                    ) : (
                        <div key={msg.id} className="flex justify-end">
                            <div className="bg-[#5D5FEF] rounded-[18px] rounded-tr-[4px] px-5 py-4 text-left max-w-[80%] shadow-md">
                                <p className="text-white text-sm leading-relaxed">{msg.text}</p>
                                <p className="text-white/50 text-[10px] mt-2">{msg.time}</p>
                            </div>
                        </div>
                    )
                )}

                {isAiTyping && !isPaused && (
                    <div className="flex justify-start">
                        <div className="bg-[#1C1C1E] border border-white/10 rounded-[18px] rounded-tl-[4px] px-5 py-4 shadow-md flex items-center gap-2">
                            <Loader2 size={14} className="text-[#5D5FEF] animate-spin" />
                            <span className="text-[#8E8FF4] text-xs">Bizzy is typing…</span>
                        </div>
                    </div>
                )}

                {isListening && transcript && !isPaused && (
                    <div className="flex justify-end">
                        <div className="bg-[#5D5FEF]/20 border border-[#5D5FEF]/30 rounded-[18px] rounded-tr-[4px] px-5 py-3 max-w-[80%]">
                            <p className="text-white/70 text-sm italic">{transcript}</p>
                            <p className="text-[#8E8FF4] text-[10px] mt-1">Speaking…</p>
                        </div>
                    </div>
                )}

                {callEnded && (
                    <div className="flex justify-center">
                        <div className="bg-white/5 border border-white/10 rounded-full px-5 py-2">
                            <p className="text-gray-500 text-xs">Call ended · Forwarding to review…</p>
                        </div>
                    </div>
                )}
            </div>

            {!speechSupported && (
                <div className="w-full max-w-5xl mx-auto px-4 mb-4">
                    <div className="flex gap-2 bg-white/5 border border-white/10 rounded-2xl p-2">
                        <input
                            value={manualInput}
                            onChange={(e) => setManualInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleManualSend()}
                            placeholder="Type your answer and press Enter…"
                            className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-600 outline-none px-3"
                            disabled={callEnded || isPaused}
                        />
                        <button
                            onClick={handleManualSend}
                            disabled={!manualInput.trim() || awaitingUserRef.current || callEnded || isPaused}
                            className="bg-[#5D5FEF] text-white text-xs font-semibold px-4 py-2 rounded-xl disabled:opacity-40 transition-opacity"
                        >
                            Send
                        </button>
                    </div>
                    <p className="text-gray-600 text-[10px] mt-1.5 text-center">
                        Your browser doesn't support voice input — type your answers above.
                    </p>
                </div>
            )}

            {speechSupported && (
                <div className="w-full max-w-5xl mx-auto px-4 mb-3">
                    <div className="flex gap-2 bg-white/5 border border-white/8 rounded-2xl p-2">
                        <input
                            value={manualInput}
                            onChange={(e) => setManualInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleManualSend()}
                            placeholder="Or type your answer here…"
                            disabled={isAiTyping || callEnded || isPaused}
                            className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-600 outline-none px-3 disabled:opacity-40"
                        />
                        <button
                            onClick={handleManualSend}
                            disabled={!manualInput.trim() || isAiTyping || callEnded || isPaused || awaitingUserRef.current}
                            className="bg-[#5D5FEF] text-white text-xs font-semibold px-4 py-2 rounded-xl disabled:opacity-40 hover:bg-[#4a4ce0] transition-all"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}

            <div className="pb-10 flex flex-col items-center justify-center w-full gap-4">
                <div className="rounded-[60px] border-2 border-white/20 bg-white/5 backdrop-blur-sm px-4 py-3 flex items-center gap-4 shadow-xl">
                    <div className="flex flex-col items-center gap-1">
                        <button
                            onClick={handleMuteToggle}
                            disabled={callEnded}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all group active:scale-95 cursor-pointer shadow-md disabled:opacity-40 ${isMuted
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-white hover:bg-gray-100"
                                }`}
                        >
                            {isMuted ? (
                                <FiMicOff size={18} className="text-white" />
                            ) : (
                                <FiMic size={18} className="text-[#5D5FEF] transition-transform group-hover:scale-110" />
                            )}
                        </button>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <button
                            onClick={() => handleEndCall(false, false)}
                            disabled={callEnded}
                            className="w-10 h-10 rounded-full bg-white hover:bg-red-50 flex items-center justify-center transition-all group active:scale-95 cursor-pointer shadow-md disabled:opacity-40"
                        >
                            <FiPhoneOff
                                size={18}
                                className="text-[#EF5D5D] transition-transform group-hover:rotate-12"
                            />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-8 mb-6 h-10">
                <button
                    className="text-white text-sm font-sans flex items-center gap-2 cursor-pointer hover:text-[#8E8FF4] transition-colors"
                    onClick={() => {
                        window.speechSynthesis?.cancel();
                        recognitionRef.current?.abort();
                        setStep(2);
                    }}
                >
                    <ChevronLeft size={16} /> Back
                </button>
                
                {isPaused ? (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleResume}
                            className="bg-green-500/20 text-green-400 border border-green-500/30 text-sm font-sans flex items-center gap-2 cursor-pointer hover:bg-green-500/30 transition-colors px-4 py-2 rounded-full"
                        >
                            <FiMic size={15} /> Resume
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-[#5D5FEF]/20 text-[#8E8FF4] border border-[#5D5FEF]/30 text-sm font-sans flex items-center gap-2 cursor-pointer hover:bg-[#5D5FEF]/30 transition-colors px-4 py-2 rounded-full"
                        >
                            <FiCheck size={15} /> Save
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handlePause}
                        disabled={callEnded}
                        className="text-white text-sm font-sans flex items-center gap-2 cursor-pointer hover:text-[#8E8FF4] transition-colors disabled:opacity-40"
                    >
                        <Pause size={17} /> Pause
                    </button>
                )}
            </div>
        </div>
    );
};

export default StepThree;