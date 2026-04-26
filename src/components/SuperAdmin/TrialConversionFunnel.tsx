/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList,
} from "recharts";

interface FunnelItem {
    name: string;
    value: number;
    percentage: string;
    color: string;
    gradientId: string;
}

interface StatusCard {
    label: string;
    value: number | string;
    color: string;
    bg: string;
    border: string;
}

interface TrialConversionFunnelProps {
    data: FunnelItem[];
    statusCards: StatusCard[];
}

// Custom label: show big number on top
const CustomValueLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
        <text
            x={x + width / 2}
            y={y - 20}
            fill="#ffffff"
            textAnchor="middle"
            fontSize={18}
            fontWeight={700}
        >
            {value}
        </text>
    );
};

// Custom label: show percentage just below the number
const CustomPercentLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
        <text
            x={x + width / 2}
            y={y - 5}
            fill="#64748b"
            textAnchor="middle"
            fontSize={10}
            fontWeight={500}
        >
            {value}
        </text>
    );
};

export const TrialConversionFunnel: React.FC<TrialConversionFunnelProps> = ({
    data,
    statusCards,
}) => {
    return (
        <div className="space-y-6 cursor-pointer group">
            <h2 className="text-xl font-bold text-white tracking-tight">Trial Conversion Funnel</h2>

            <div className="bg-[#0f1423]/60 backdrop-blur-[20px] p-5 sm:p-6 rounded-2xl border border-white/5 transition-all">
                {/* CHART */}
                <div className="h-[240px] sm:h-[290px] w-full mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 44, right: 0, left: 0, bottom: 0 }}
                            barCategoryGap="20%"
                        >
                            <defs>
                                {data.map((item) => (
                                    <linearGradient key={item.gradientId} id={item.gradientId} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={item.color} stopOpacity={0.9} />
                                        <stop offset="100%" stopColor={item.color} stopOpacity={0.25} />
                                    </linearGradient>
                                ))}
                            </defs>

                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#64748b", fontSize: 10, fontWeight: 500 }}
                                interval={0}
                                dy={10}
                            />

                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1a1f2e",
                                    border: "1px solid #2a3040",
                                    borderRadius: "12px",
                                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5)",
                                }}
                                itemStyle={{ color: "#f1f5f9" }}
                                cursor={{ fill: "transparent" }}
                            />

                            <Bar dataKey="value" radius={[8, 8, 6, 6]}>
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={`url(#${entry.gradientId})`}
                                        stroke={`${entry.color}30`}
                                        strokeWidth={1}
                                    />
                                ))}
                                <LabelList content={<CustomValueLabel />} />
                                <LabelList dataKey="percentage" content={<CustomPercentLabel />} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* STATUS CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {statusCards.map((card, i) => (
                        <div
                            key={i}
                            className={`${card.bg} ${card.border} p-5 rounded-xl border transition-all hover:border-white/10`}
                        >
                            <p className={`text-[10px] font-bold uppercase tracking-[0.12em] ${card.color} mb-3`}>
                                {card.label}
                            </p>
                            <p className="text-[32px] font-bold text-white leading-none">{card.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
