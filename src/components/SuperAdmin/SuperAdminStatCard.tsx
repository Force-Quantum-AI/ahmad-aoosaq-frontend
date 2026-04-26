import { TrendingUp } from "lucide-react";
import React from "react";

interface StatCardProps {
    label: string;
    value: string | number;
    trend?: string;
    sub?: string;
}

export const SuperAdminStatCard: React.FC<StatCardProps> = ({
    label,
    value,
    trend,
    sub,
}) => {
    return (
        <div className="bg-[#0f1423]/60 backdrop-blur-[20px] px-5 py-4.5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group shadow-sm">
            <p className="text-xs text-[#64748B] uppercase tracking-wider">{label}</p>
            <h2 className="text-2xl font-bold mt-1.5">{value}</h2>

            <div className="text-xs mt-1.5 flex items-center gap-2">
                {trend && <span className="text-green-400 font-medium flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {trend}</span>}
                <span className="text-gray-500 whitespace-nowrap">{sub}</span>
            </div>
        </div>
    );
};
