import React from "react";
import { Progress } from "@/components/ui/progress";

export const ProfitabilitySection: React.FC = () => {
    return (
        <div id="profit" className="space-y-6 cursor-pointer group">
            <h2 className="text-xl font-bold text-white tracking-tight">Profitability</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* REVENUE THIS MONTH CARD */}
                <div className="bg-[#0f1423]/60 backdrop-blur-[20px] p-6 rounded-[16px] border border-white/5 hover:border-white/10 transition-all">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#64748B] mb-8">Revenue This Month</p>
                    <h2 className="text-[36px] font-bold text-[#10b981] leading-none mb-3">$71,480</h2>
                    <p className="text-[13px] text-gray-500">Subscriptions + overage</p>
                </div>

                {/* ESTIMATED AI COSTS CARD */}
                <div className="bg-[#0f1423]/60 backdrop-blur-[20px] p-6 rounded-[16px] border border-white/5 hover:border-white/10 transition-all">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#64748B] mb-8">Estimated AI Costs</p>
                    <h2 className="text-[36px] font-bold text-[#f59e0b] leading-none mb-3">$11,240</h2>
                    <p className="text-[13px] text-gray-500 mb-8">Twilio + OpenAI + ElevenLabs</p>

                    <div className="border-t border-white/5 pt-6 space-y-1">
                        <div className="flex justify-between items-center">
                            <span className="text-[12px] text-gray-400">Twilio</span>
                            <span className="text-[12px] text-gray-300">$2,180</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[12px] text-gray-400">OpenAI Realtime</span>
                            <span className="text-[12px] text-gray-300">$4,860</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[12px] text-gray-400">ElevenLabs</span>
                            <span className="text-[12px] text-gray-300">$4,200</span>
                        </div>
                    </div>
                </div>

                {/* GROSS PROFIT CARD */}
                <div className="bg-[#10b98115] backdrop-blur-[20px] p-6 rounded-[16px] border border-[#10b98125] hover:border-[#10b98145] transition-all">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#64748B] mb-8">Gross Profit</p>
                    <h2 className="text-[36px] font-bold text-[#10b981] leading-none mb-3">$60,240</h2>
                    <p className="text-[26px] font-bold text-[#06b6d4] mb-8">84.3% margin</p>

                    <Progress
                        value={84.3}
                        className="h-1.5 rounded-full bg-white/[0.06]"
                        indicatorClassName="bg-[#06b6d4] rounded-full"
                    />
                </div>
            </div>
        </div>
    );
};
