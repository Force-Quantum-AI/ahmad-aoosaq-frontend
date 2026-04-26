import { useState, useRef } from "react";
import { FiCheck } from "react-icons/fi";
import { Play, Pause, Mic, Loader2 } from "lucide-react";
import { useGetAllAgentQuery, useSelectAgentMutation } from "@/store/features/agent/agent.api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export interface VoicePersonality {
    voiceId: string;
    voiceName: string;
    tone: string;
    personality: string;
    speed: number;
    language: string;
}


interface VoicePersonalityModalProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
}

export function VoicePersonalityModal({ open, onOpenChange }: VoicePersonalityModalProps) {
    const { data: agentData, isLoading } = useGetAllAgentQuery({});
    const [selectAgent, { isLoading: isSelecting }] = useSelectAgentMutation();

    const [playingId, setPlayingId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePreview = (voiceId: string) => {
        if (!audioRef.current) {
            audioRef.current = new Audio("/demoCallSound.mp3");
        }

        const audio = audioRef.current;

        // If same voice clicked -> pause
        if (playingId === voiceId) {
            audio.pause();
            audio.currentTime = 0;
            setPlayingId(null);
            return;
        }

        // Stop any currently playing audio
        audio.pause();
        audio.currentTime = 0;

        // Play again
        audio.play();

        setPlayingId(voiceId);

        // Reset when audio finishes
        audio.onended = () => {
            setPlayingId(null);
        };
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="mx-w-[95%] 2xl:max-w-7xl bg-[#121214] border border-white/10 w-full" style={{ display: "flex", flexDirection: "column", padding: 0 }}>
                <DialogHeader className="px-8 pt-7 pb-4 border-b border-white/10 shrink-0">
                    <DialogTitle className="text-xl font-semibold text-white font-geist">Voice & Personality</DialogTitle>
                    <p className="text-[#9E9E9E] text-xs mt-0.5">Customize how your AI agent sounds and behaves during calls</p>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-10">

                    {/* ── Voice Selection ──────────────────────────────────────────── */}
                    <section>
                        <div className="flex items-center gap-2 mb-1">
                            <Mic size={16} className="text-[#5D5FEF]" />
                            <h3 className="text-base font-semibold text-white">Choose Voice</h3>
                        </div>
                        <p className="text-[#9E9E9E] text-xs mb-4">Click play to preview each voice</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {isLoading ? (
                                <div className="col-span-full flex justify-center py-10">
                                    <Loader2 className="w-8 h-8 text-[#5D5FEF] animate-spin" />
                                </div>
                            ) : (
                                agentData?.map((agent: any) => {
                                    const selected = agent.is_active;
                                    const playing = playingId === agent.voice.id;
                                    const voiceColor = "#5D5FEF"; // Default color or you could map based on voice name

                                    return (
                                        <div
                                            key={agent.id}
                                            onClick={async () => {
                                                try {
                                                    await selectAgent({ 
                                                        data: { 
                                                            id: agent.id, 
                                                            is_active: true 
                                                        } 
                                                    }).unwrap();
                                                    toast.success(`${agent.voice.name} selected successfully!`);
                                                } catch (error) {
                                                    toast.error("Failed to select agent");
                                                }
                                            }}
                                            className={`relative flex items-center gap-4 p-4 rounded-[16px] border-2 cursor-pointer transition-all ${selected ? "border-[#5D5FEF] bg-[#5D5FEF]/8 shadow-sm" : "border-transparent bg-[#5D5FEF]/5 hover:border-[#5D5FEF]/30"
                                                } ${isSelecting ? "opacity-50 pointer-events-none" : ""}`}
                                        >
                                            {/* Avatar */}
                                            <div
                                                className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                                                style={{ background: voiceColor }}
                                            >
                                                {agent.voice.name[0]}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-white">{agent.voice.name}</span>
                                                    {selected && <FiCheck size={13} className="text-[#5D5FEF]" />}
                                                </div>
                                                <p className="text-[11px] text-[#9E9E9E]">{agent.voice.gender} · {agent.voice.language}</p>
                                                <p className="text-[11px] text-[#5D5FEF] italic">{agent.voice.description}</p>
                                            </div>

                                            {/* Preview button */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); togglePreview(agent.voice.id); }}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${playing ? "bg-[#5D5FEF] text-white shadow-md" : "bg-[#1C1C1E] text-[#5D5FEF] shadow-sm hover:shadow-md"
                                                    }`}
                                            >
                                                {playing ? <Pause size={13} /> : <Play size={13} className="translate-x-0.5" />}
                                            </button>

                                            {/* Playing indicator */}
                                            {playing && (
                                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5 items-end h-3">
                                                    {[1, 2, 3, 4].map((b) => (
                                                        <div
                                                            key={b}
                                                            className="w-0.5 bg-[#5D5FEF] rounded-full animate-pulse"
                                                            style={{ height: `${[8, 12, 6, 10][b - 1]}px`, animationDelay: `${b * 0.1}s` }}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="shrink-0 px-8 py-5 border-t border-white/10 flex items-center justify-end bg-[#121214]">
                    <div className="flex gap-3">
                        <button onClick={() => onOpenChange(false)} className="px-5 py-2 rounded-full text-sm text-gray-300 border border-white/10 hover:bg-white/10 transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}