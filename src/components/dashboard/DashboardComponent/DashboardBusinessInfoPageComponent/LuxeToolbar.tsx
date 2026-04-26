import {
  RefreshCw,
  Phone,
  Save,
  Eye,
  SquarePen,
} from "lucide-react";
import TestCallPopup from "../../TestCallPopup";
import { useState } from "react";

export default function LuxeToolbar() {
  const [isTestCallModalOpen, setIsTestCallModalOpen] = useState(false);
  return (
    <div className=" flex items-center justify-center mt-6 ">
      <div className="w-full  rounded-2xl ">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#9E9E9E] text-lg font-normal">
            What{" "}
            <span className="font-bold text-white">
              Luxe Home Services Assistant
            </span>{" "}
            knows about your business
          </span>
          <button className="text-zinc-400 hover:text-white transition-colors">
            <SquarePen className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          {/* Left: Import */}
          <div className=""></div>
          

          {/* Right: Action buttons */}
          <div className="flex items-center gap-2">
            {/* Refresh */}
            <button className="flex items-center cursor-pointer gap-2 px-4 py-3 rounded-xl border border-zinc-700 text-[#9E9E9E] hover:border-zinc-500 hover:text-white transition-all text-sm font-medium" onClick={() => window.location.reload()}>
              <RefreshCw size={15} />
              Refresh
            </button>

            {/* Talk To Agent - blue primary */}
            <button className="flex items-center cursor-pointer gap-2 px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white transition-all text-sm font-normal shadow-lg shadow-blue-500/20"
            onClick={() => setIsTestCallModalOpen(true)}
            >
              <Phone size={15} />
              Talk To Agent
            </button>

            {/* Save Changes */}
            {/* <button className="flex items-center cursor-pointer gap-2 px-4 py-3 rounded-xl bg-[#33384D] hover:bg-zinc-600 text-white transition-all text-sm font-medium">
              <Save size={15} />
              Save Changes
            </button> */}

            {/* Preview Voice */}
            <button className="flex items-center cursor-pointer gap-2 px-4 py-3 rounded-xl bg-transparent border border-zinc-800 hover:bg-zinc-600 text-white transition-all text-sm font-medium">
              <Eye size={15} />
              Preview Voice
            </button>
          </div>
        </div>
      </div>
      {isTestCallModalOpen && <TestCallPopup onClose={() => setIsTestCallModalOpen(false)} />}
    </div>
  );
}
