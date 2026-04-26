import { useState } from "react";
import {
  RefreshCw,
  Phone,
  Plus,
  ChevronDown,
  Circle,
  SquarePen,
} from "lucide-react";
import { Link } from "react-router-dom";
import TestCallPopup from "../../TestCallPopup";

export default function AgentConfigHeader() {
  const [agentName] = useState("Luxe Home Services Assistant");
  const [isTalkToAgentModalOpen, setIsTalkToAgentModalOpen] = useState(false);

  return (
    <div className="   font-sans">
      {/* Top Nav Bar */}
      <div className="flex items-center justify-between mb-8">
        {/* Left: Agent Selector */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 cursor-pointer hover:bg-zinc-800 transition-colors">
          <Circle className="w-3 h-3 fill-emerald-500 text-emerald-500" />
          <span className="text-white text-sm font-medium">{agentName}</span>
          <span className="text-zinc-500 text-sm">{agentName}</span>
          <ChevronDown className="w-4 h-4 text-zinc-400 ml-1" />
        </div>

        {/* Right: New Agent Button */}
        <Link to="/create-agent" className="flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          New Agent
        </Link>
      </div>

      {/* Configure Section */}
      <div className="flex items-start justify-between">
        {/* Left: Title + Subtitle */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-white text-2xl font-semibold tracking-tight">
              Configure {agentName}
            </h1>
            <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
              <SquarePen className="w-5 h-5" />
            </button>
          </div>
          <div className="mb-10 mt-4">
            <p className="text-base text-[#9E9E9E]">
              Define your agent's personality, voice. and conversation flow.
              Changes auto-save after you stop typing.
            </p>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 ml-6 shrink-0">
          <button className="flex items-center gap-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button onClick={() => setIsTalkToAgentModalOpen(true)} className="flex items-center gap-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Phone className="w-4 h-4" />
            Talk To Agent
          </button>
          {/* <button className="flex items-center gap-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Save className="w-4 h-4" />
            Save Changes
          </button> */}
        </div>
      </div>
      {isTalkToAgentModalOpen && (
        <TestCallPopup
          onClose={() => setIsTalkToAgentModalOpen(false)}
        />
      )}
    </div>
  );
}
