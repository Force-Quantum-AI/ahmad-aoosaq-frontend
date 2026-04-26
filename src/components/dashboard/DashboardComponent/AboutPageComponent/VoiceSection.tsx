// "use client";

// import { useState } from "react";
// import { Check, Headphones } from "lucide-react";
// import robot from "@/assets/images/robo.png";
// import AgentConfigHeader from "./AgentConfigHeader";

// const voices = [
//   {
//     id: "1",
//     name: "Kora",
//     gender: "Female",
//     description: "Warm, expressive California voice",
//   },
//   {
//     id: "2",
//     name: "Colton Rivers",
//     gender: "Male",
//     description: "Friendly Southern Texas voice",
//   },
//   {
//     id: "3",
//     name: "Ito",
//     gender: "Male",
//     description: "Natural, conversational male voice",
//   },
//   {
//     id: "4",
//     name: "Inspiring Woman",
//     gender: "Female",
//     description: "Motivational voice",
//   },
//   {
//     id: "5",
//     name: "Kora",
//     gender: "Male",
//     description: "Warm, expressive California voice",
//   },
//   {
//     id: "6",
//     name: "Colton Rivers",
//     gender: "Male",
//     description: "Friendly Southern Texas voice",
//   },
//   {
//     id: "7",
//     name: "Ito",
//     gender: "Male",
//     description: "Natural, conversational male voice",
//   },
//   {
//     id: "8",
//     name: "Inspiring Woman",
//     gender: "Male",
//     description: "Motivational voice",
//   },
// ];

// export default function VoiceSection() {
//   const [selectedVoice, setSelectedVoice] = useState<string>("1");

//   const handlePreview = (e: React.MouseEvent, id: string) => {
//     e.stopPropagation();
//     console.log(`Preview voice ${id}`);
//   };

//   return (
//     <main className="mt-8 px-8">
//       <div className="p-2">
//         <AgentConfigHeader />

//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h2 className="text-2xl font-semibold text-white mb-2">Voice</h2>
//             <p className="text-base text-[#9E9E9E]">
//               Choose your agent's voice
//             </p>
//           </div>
//         </div>

//         {/* Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {voices.map((voice) => {
//             const isActive = selectedVoice === voice.id;

//             return (
//               <div
//                 key={voice.id}
//                 onClick={() => setSelectedVoice(voice.id)}
//                 className={`
//                   relative overflow-hidden rounded-[20px] p-6 cursor-pointer
//                   transition-all duration-300 group
//                   ${isActive
//                     ? "border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.30)] bg-[#0a1a12]"
//                     : "border border-[#323232] hover:border-[#555] hover:shadow-[0_4px_18px_rgba(255,255,255,0.07)] hover:-translate-y-0.5"
//                   }
//                 `}
//               >
//                 {/* Active checkmark overlay — top-left badge */}
//                 {isActive && (
//                   <div className="absolute top-3 left-3 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center z-20 shadow-md">
//                     <Check size={11} strokeWidth={3} className="text-white" />
//                   </div>
//                 )}

//                 {/* Gradient hover overlay (only when NOT active) */}
//                 {!isActive && (
//                   <div
//                     className="absolute inset-0 bg-[linear-gradient(109deg,#AD34EB_4.38%,#E77FB2_27.77%,#FC979A_39.14%,#E43055_56.69%,#B828A6_77.33%,#9688F6_109.04%)]
//                       opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[20px]"
//                   />
//                 )}

//                 <div className="relative z-10 flex gap-3">
//                   <div className="flex-1">
//                     <h3 className="text-xl font-medium text-white mb-1">
//                       {voice.name}{" "}
//                       <span
//                         className={`border text-xs p-1 rounded-full ${
//                           isActive ? "border-emerald-500/50" : "border-[#323232]"
//                         }`}
//                       >
//                         <span className="font-medium px-2 py-[2px] rounded-full text-[#9E9E9E]">
//                           {voice.gender}
//                         </span>
//                       </span>
//                     </h3>

//                     <p className="text-base mt-4 text-[#9E9E9E] group-hover:text-gray-100 transition-colors duration-300">
//                       {voice.description}
//                     </p>
//                   </div>

//                   {/* Robot avatar */}
//                   <div className="flex flex-col items-center gap-2">
//                     <div
//                       className="w-16 h-16 flex items-center justify-center transition-all duration-300"
//                       style={{
//                         borderRadius: "16px",
//                         border: isActive
//                           ? "1px solid rgba(16,185,129,0.4)"
//                           : "1px solid rgba(213, 243, 249, 0.35)",
//                       }}
//                     >
//                       <img
//                         src={robot}
//                         alt=""
//                         className="h-9 w-9 transition-colors duration-300"
//                       />
//                     </div>

//                     {/* Headphone button — proper circular dark button */}
//                     <button
//                       onClick={(e) => handlePreview(e, voice.id)}
//                       title="Preview voice"
//                       className={`
//                         w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
//                         ${isActive
//                           ? "bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400"
//                           : "bg-[#1e1e1e] hover:bg-[#2a2a2a] text-gray-400 hover:text-white"
//                         }
//                         shadow-sm border border-white/10
//                       `}
//                     >
//                       <Headphones size={14} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </main>
//   );
// }


"use client";

import { useState, useRef } from "react";
import { Check, Headphones, Loader2 } from "lucide-react";
import robot from "@/assets/images/robo.png";
import AgentConfigHeader from "./AgentConfigHeader";
import { useGetAllAgentQuery, useSelectAgentMutation } from "@/store/features/agent/agent.api";
import { toast } from "sonner";

interface Agent {
  id: number;
  voice: {
    id: string;
    name: string;
    gender: string;
    language: string;
    description: string;
  };
  is_active: boolean;
}

export default function VoiceSection() {
  const { data: agentData = [], isLoading } = useGetAllAgentQuery({});
  const [selectAgent, { isLoading: isSelecting }] = useSelectAgentMutation();

  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get currently active agent
  const activeAgent = agentData.find((agent: Agent) => agent.is_active);
  const selectedVoiceId = activeAgent?.voice.id;
  console.log(selectedVoiceId);
  // Handle voice selection
  const handleSelectVoice = async (agent: Agent) => {
    if (isSelecting || agent.is_active) return;

    try {
      await selectAgent({
        data: {
          id: agent.id,
          is_active: true,
        },
      }).unwrap();
      toast.success(`${agent.voice.name} selected successfully!`);
    } catch (error) {
      console.error("Error selecting agent:", error);
      toast.error("Failed to select agent");
    }
  };

  // Handle voice preview
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

  const handlePreview = (e: React.MouseEvent, voiceId: string) => {
    e.stopPropagation();
    togglePreview(voiceId);
  };

  return (
    <main className="mt-8 px-8">
      <div className="p-2">
        <AgentConfigHeader />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">Voice</h2>
            <p className="text-base text-[#9E9E9E]">
              Choose your agent's voice
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#5D5FEF] animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && agentData.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#323232] p-12 text-center bg-[#0d0d0d]/40">
            <p className="text-[#9E9E9E]">No voices available</p>
          </div>
        )}

        {/* Voice Cards */}
        {!isLoading && agentData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agentData.map((agent: Agent) => {
              const isActive = agent.is_active;
              const playing = playingId === agent.voice.id;

              return (
                <div
                  key={agent.id}
                  onClick={() => handleSelectVoice(agent)}
                  className={`
                    relative overflow-hidden rounded-[20px] p-6 cursor-pointer
                    transition-all duration-300 group
                    ${
                      isActive
                        ? "border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.30)] bg-[#0a1a12]"
                        : "border border-[#323232] hover:border-[#555] hover:shadow-[0_4px_18px_rgba(255,255,255,0.07)] hover:-translate-y-0.5"
                    }
                    ${isSelecting ? "opacity-50 pointer-events-none" : ""}
                  `}
                >
                  {/* Active checkmark overlay — top-left badge */}
                  {isActive && (
                    <div className="absolute top-3 left-3 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center z-20 shadow-md">
                      <Check size={11} strokeWidth={3} className="text-white" />
                    </div>
                  )}

                  {/* Gradient hover overlay (only when NOT active) */}
                  {!isActive && (
                    <div
                      className="absolute inset-0 bg-[linear-gradient(109deg,#AD34EB_4.38%,#E77FB2_27.77%,#FC979A_39.14%,#E43055_56.69%,#B828A6_77.33%,#9688F6_109.04%)]
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[20px]"
                    />
                  )}

                  <div className="relative z-10 flex gap-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-white mb-1">
                        {agent.voice.name}{" "}
                        <span
                          className={`border text-xs p-1 rounded-full ${
                            isActive
                              ? "border-emerald-500/50"
                              : "border-[#323232]"
                          }`}
                        >
                          <span className="font-medium px-2 py-[2px] rounded-full text-[#9E9E9E]">
                            {agent.voice.gender}
                          </span>
                        </span>
                      </h3>

                      <p className="text-base mt-4 text-[#9E9E9E] group-hover:text-gray-100 transition-colors duration-300">
                        {agent.voice.description}
                      </p>
                    </div>

                    {/* Robot avatar */}
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className="w-16 h-16 flex items-center justify-center transition-all duration-300"
                        style={{
                          borderRadius: "16px",
                          border: isActive
                            ? "1px solid rgba(16,185,129,0.4)"
                            : "1px solid rgba(213, 243, 249, 0.35)",
                        }}
                      >
                        <img
                          src={robot}
                          alt=""
                          className="h-9 w-9 transition-colors duration-300"
                        />
                      </div>

                      {/* Headphone button — proper circular dark button */}
                      <button
                        onClick={(e) => handlePreview(e, agent.voice.id)}
                        title="Preview voice"
                        disabled={isSelecting}
                        className={`
                          w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
                          ${
                            isActive
                              ? "bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400"
                              : "bg-[#1e1e1e] hover:bg-[#2a2a2a] text-gray-400 hover:text-white"
                          }
                          shadow-sm border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                      >
                        {playing ? (
                          <svg
                            className="w-3.5 h-3.5 animate-pulse"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <rect x="6" y="4" width="2" height="16" />
                            <rect x="12" y="4" width="2" height="16" />
                            <rect x="18" y="4" width="2" height="16" />
                          </svg>
                        ) : (
                          <Headphones size={14} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Playing indicator */}
                  {playing && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5 items-end h-3">
                      {[1, 2, 3, 4].map((b) => (
                        <div
                          key={b}
                          className="w-0.5 bg-emerald-500 rounded-full animate-pulse"
                          style={{
                            height: `${[8, 12, 6, 10][b - 1]}px`,
                            animationDelay: `${b * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}