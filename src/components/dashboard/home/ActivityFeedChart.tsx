import { useState } from "react";
import { ChevronDown, Funnel, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

// ── Dummy datasets 
const weeklyData = [
    { label: "Mon", calls: 0 },
    { label: "Tue", calls: 0 },
    { label: "Wed", calls: 0 },
    { label: "Thu", calls: 0 },
    { label: "Fri", calls: 0 },
    { label: "Sat", calls: 0 },
    { label: "Sun", calls: 0 }, 
];

const monthlyData = [
    { label: "Week 1", calls: 0 },
    { label: "Week 2", calls: 0 },
    { label: "Week 3", calls: 0 },
    { label: "Week 4", calls: 0 },
];

type FilterOption = "Weekly" | "Monthly";

interface ActivityFeedChartProps {
    className?: string;
    chartData?: any;
}

export default function ActivityFeedChart({ className = "", chartData }: ActivityFeedChartProps) {
    const [filter, setFilter] = useState<FilterOption>("Weekly");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const data = filter === "Weekly" ? (chartData?.chart || weeklyData) : monthlyData;

    const totalCalls = filter === "Weekly" && chartData?.total_calls !== undefined 
        ? chartData.total_calls 
        : data.reduce((sum: any, d: any) => sum + d.calls, 0);

    const lastUpdated = chartData?.updated_at 
        ? new Date(chartData.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        : "00:00 AM";

    // Compute percentage change vs previous period (mock logic)
    const pctChange = filter === "Weekly" && chartData?.percentage_change !== undefined 
        ? chartData.percentage_change 
        : (filter === "Weekly" ? 6.2 : 14.5);

    // Add ~25% headroom above the max value so the peak doesn't hit the ceiling
    const maxDataValue = data.length > 0 ? Math.max(...data.map((d: any) => d.calls)) : 0;
    const yAxisMax = Math.ceil(maxDataValue * 1.25 / 10) * 10 || 10;

    return (
        <div
            className={`relative bg-[#0f0f0f] rounded-3xl p-5 flex flex-col gap-3 border border-white/5 ${className}`}
            style={{ minHeight: 320 }}
        >
            {/*  Header row  */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-white text-lg lg:text-2xl 2xl:text-3xl font-semibold tracking-tight">
                        Activity feed
                    </h2>
                    <p className="text-gray-400 text-sm mt-0.5">{totalCalls} call today</p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Filter dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen((o) => !o)}
                            className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-white text-sm font-medium px-3 py-1.5 rounded-xl transition-colors"
                        >
                            {filter}
                            <ChevronDown
                                size={14}
                                className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-1.5 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden z-10 w-32 shadow-xl">
                                {(["Weekly", "Monthly"] as FilterOption[]).map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => {
                                            setFilter(opt);
                                            setDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${filter === opt
                                            ? "text-white bg-white/10"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Filter icon button */}
                    <button className="bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-white p-2 rounded-xl transition-colors">
                        <Funnel size={15} />
                    </button>
                </div>
            </div>

            {/* ── Positive change badge ─────────────────────────────────────────── */}
            <div className="flex justify-end -mt-1">
                <span className="flex items-center gap-1 text-[#4ade80] text-sm font-semibold">
                    <TrendingUp size={14} />
                    +{pctChange}%
                </span>
            </div>

            {/* ── Last updated row ──────────────────────────────────────────────── */}
            <div className="flex items-center gap-2 text-gray-500 text-sm -mt-1">
                {/* Calendar icon */}
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="white" strokeWidth="2" fill="none" />
                        <line x1="16" y1="2" x2="16" y2="6" stroke="white" strokeWidth="2" />
                        <line x1="8" y1="2" x2="8" y2="6" stroke="white" strokeWidth="2" />
                        <line x1="3" y1="10" x2="21" y2="10" stroke="white" strokeWidth="2" />
                    </svg>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>
                    Updated: <span className="text-white font-medium">{lastUpdated}</span>
                </span>
            </div>


            <AreaChart
                style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
                responsive
                data={data}
                margin={{
                    top: 20,
                    right: 0,
                    left: 0,
                    bottom: 0,
                }}
                onContextMenu={(_, e) => e.preventDefault()}
            >
                <XAxis dataKey="label" niceTicks="snap125" />
                {/* domain uses computed yAxisMax for ~25% headroom above the peak */}
                <YAxis dataKey="calls" width="auto" niceTicks="snap125" domain={[0, yAxisMax]} />
                <Tooltip />
                {/* fillOpacity raised from 0.2 → 0.4 for stronger visual presence */}
                <Area type="linear" dataKey="calls" stroke="#3896FF" strokeWidth={2} fill="#3896FF" fillOpacity={0.4} />
                <RechartsDevtools />
            </AreaChart>


        </div>
    );
}

export { weeklyData, monthlyData };