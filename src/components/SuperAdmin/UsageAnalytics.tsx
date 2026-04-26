import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";

interface BusinessUsage {
    name: string;
    industry: string;
    calls: number;
    mins: number;
    rank: number;
}

interface UsageAnalyticsProps {
    callData: { d: string; v: number }[];
    minsData: { d: string; v: number }[];
    topBusinesses: BusinessUsage[];
}

export const UsageAnalytics: React.FC<UsageAnalyticsProps> = ({
    callData,
    minsData,
    topBusinesses,
}) => {
    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1: return "text-[#f59e0b]"; // Gold
            case 2: return "text-[#94a3b8]"; // Silver
            case 3: return "text-[#b45309]"; // Bronze
            default: return "text-[#475569]"; // Gray
        }
    };

    return (
        <div id="usage" className="space-y-6 cursor-pointer group">
            <h2 className="text-xl font-bold text-white tracking-tight">Usage Analytics</h2>

            {/* CHARTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Call Volume Bar Chart */}
                <div className="bg-[#0f1423]/60 backdrop-blur-[20px] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                    <p className="text-sm font-medium text-[#64748B] mb-6">Call Volume (This Week)</p>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={callData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis
                                    dataKey="d"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#64748b", fontSize: 11 }}
                                    ticks={[0, 500, 1000, 1500, 2000, 2500, 3000]}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#1a1f2e", border: "1px solid #2a3040", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5)" }}
                                    itemStyle={{ color: "#f1f5f9" }}
                                    cursor={{ fill: "#ffffff05" }}
                                />
                                <Bar
                                    dataKey="v"
                                    fill="#10b981"
                                    radius={[4, 4, 0, 0]}
                                    barSize={32}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Minutes Area Chart */}
                <div className="bg-[#0f1423]/60 backdrop-blur-[20px] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                    <p className="text-sm font-medium text-[#64748B] mb-6">Minutes Used (This Week)</p>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={minsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMins" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis
                                    dataKey="d"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#64748b", fontSize: 11 }}
                                    ticks={[0, 500, 1000, 1500, 2000, 2500, 3000]}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#1a1f2e", border: "1px solid #2a3040", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5)" }}
                                    itemStyle={{ color: "#f1f5f9" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="v"
                                    stroke="#06b6d4"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorMins)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* TOP BUSINESSES SECTION */}
            <div className="bg-[#0f1423]/60 backdrop-blur-[20px] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <h3 className="text-[#64748B] text-sm font-medium mb-8">Top 5 Businesses by Usage</h3>
                <div className="space-y-6">
                    {topBusinesses.map((biz, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between group/item">
                            <div className="flex items-center gap-4">
                                <span className={`text-sm font-bold w-6 ${getRankColor(biz.rank)}`}>
                                    #{biz.rank}
                                </span>
                                <span className="text-white font-semibold text-sm group-hover/item:text-green-400 transition-colors">
                                    {biz.name}
                                </span>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-8 mt-2 sm:mt-0 ml-10 sm:ml-0">
                                <span className="text-xs text-gray-500 font-medium sm:w-24">{biz.industry}</span>
                                <div className="flex items-center gap-6 min-w-[120px] justify-end">
                                    <span className="text-green-400 text-sm font-bold">{biz.calls.toLocaleString()} calls</span>
                                    <span className="text-gray-500 text-xs font-medium w-16 text-right whitespace-nowrap">{biz.mins.toLocaleString()} min</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
