import React from "react";

const healthData = [
    { n: "AI Response Latency", v: "1.4s", s: "green", d: "Avg last 1hr" },
    { n: "Call Success Rate", v: "98.2%", s: "green", d: "Today" },
    { n: "Failed Calls", v: "23", s: "yellow", d: "Last 24hr" },
    { n: "API Error Rate", v: "0.3%", s: "green", d: "Last 1hr" },
    { n: "Twilio Status", v: "Operational", s: "green", d: "All regions" },
    { n: "OpenAI API", v: "Operational", s: "green", d: "Realtime API" },
    { n: "ElevenLabs", v: "Degraded", s: "yellow", d: "High latency" },
    { n: "Database", v: "Healthy", s: "green", d: "MongoDB Atlas" },
];

export const SystemHealth: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white">System Health</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {healthData.map((h, i) => (
                    <div key={i} className="bg-[#0f1423]/60 backdrop-blur-[20px] border border-white/5 p-5 rounded-2xl hover:border-white/10 transition-colors group">
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px] ${getStatusColor(h.s)}`} />
                            <span className="text-[12px] font-medium text-[#64748B] group-hover:text-gray-200 transition-colors tracking-tight">
                                {h.n}
                            </span>
                        </div>

                        <div className={`text-2xl font-bold tracking-tight ${getValueColor(h.s)}`}>
                            {h.v}
                        </div>

                        <div className="text-[11px] text-gray-600 mt-2 font-medium uppercase tracking-wide">
                            {h.d}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "green": return "bg-[#10b981] shadow-[#10b98166]";
        case "yellow": return "bg-[#f59e0b] shadow-[#f59e0b66]";
        case "red": return "bg-[#ef4444] shadow-[#ef444466]";
        default: return "bg-gray-500";
    }
};

const getValueColor = (status: string) => {
    switch (status) {
        case "green": return "text-gray-100";
        case "yellow": return "text-[#f59e0b]";
        case "red": return "text-[#ef4444]";
        default: return "text-gray-500";
    }
};
