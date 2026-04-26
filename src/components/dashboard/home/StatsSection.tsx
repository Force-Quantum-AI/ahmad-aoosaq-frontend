import { Skeleton } from '@/components/ui/skeleton';
import {
    Search,
    RotateCw,
    Download,
    Activity,
    Send,
    ChevronLeft,
    ChevronRight,
    PhoneCall,
    PhoneForwarded,
    Calendar,
    CheckCircle2,
    ExternalLink,
    Repeat2
} from 'lucide-react';

// --- Reusable Stat Card Component ---
const StatCard = ({ data, onClick }: { data: any, onClick: (title: string) => void }) => {
    return (
        <div
            onClick={() => onClick(data.title)}
            className={`relative overflow-hidden rounded-[32px] p-6 h-[280px] flex flex-col justify-between cursor-pointer transition-transform hover:scale-[1.02]`}
            style={{
                background: data.colors.gradient
            }}
        >

            {/* Soft glow overlay */}
            <div className="absolute inset-0 bg-black/10"></div>

            {/* Decorative curve */}
            <svg
                className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
                viewBox="0 0 200 200"
                preserveAspectRatio="none"
            >
                <path
                    d="M -20,100 C 50,200 100,0 220,100"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                />
            </svg>


            {/* TOP SECTION */}
            <div className="flex justify-between items-start relative z-10">

                <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                    style={{ backgroundColor: data.colors.iconBg }}
                >
                    <data.icon size={24} style={{ color: data.colors.iconColor }} strokeWidth={2} />
                </div>

                <div className="text-right">
                    <h3 className="text-white font-medium text-lg">{data.title}</h3>
                    <p className="text-white/70 text-xs mt-1">{data.subtitle}</p>
                </div>

            </div>


            {/* BOTTOM LEFT — stat value is the hero element */}
            <div className="relative z-10 flex flex-col gap-4">

                <button className="text-white/80 hover:text-white transition-colors w-fit">
                    <ExternalLink size={20} strokeWidth={2} />
                </button>

                <div className="text-white text-4xl font-semibold tracking-tight">
                    {data.value}
                </div>

            </div>


            {/* ROTATED OVERLAP CARD — kept as subtle decoration, opacity reduced to 6% so stat number stays dominant */}
            <div
                className="absolute bottom-[-10px] right-[-70px] w-[65%] h-[70%] rounded-[28px]  p-5 flex flex-col justify-between rotate-6 backdrop-blur-md pointer-events-none"
                style={{
                    background: data.colors.darkGradient,
                    opacity: 0.60
                }}
            >
                {/* agent */}
                <div className="mb-2">
                    <div className="absolute top-5 right-5 text-white/80">
                        <div className="border border-white/30 rounded-lg p-1">
                            <Repeat2 size={16} />
                        </div>
                    </div>
                    <h4 className="text-white/20 font-semibold text-lg">
                        {data.agent.name}
                    </h4>

                    <p className="text-white/20 text-[11px] italic mt-0.5">
                        {data.agent.trait}
                    </p>
                </div>

                {/* abilities */}
                <div>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-white/20 mb-1">
                        Abilities
                    </p>

                    <p className="text-white/20 text-[11px]">
                        {data.agent.ability}
                    </p>
                </div>

            </div>

        </div>
    );
};

const StatsSection = ({callToday,callThisWeek,avgHandleTime,answerRate, loading}:{
    callToday:number;
    callThisWeek:number;
    avgHandleTime:number;
    answerRate:string;
    loading:boolean;
}) => {
    // Unified green-toned gradients for all 4 cards — equal visual weight
    const statsData = [
        {
            id: 1,
            title: "Call Today",
            subtitle: "Call handled today",
            value: callToday,
            icon: PhoneCall,
            colors: {
                gradient: "linear-gradient(135deg, #05150fff, #07301eff, #0d7a5c)",
                darkGradient: "linear-gradient(135deg, #063d28, #0a6040)",
                iconBg: "rgba(10, 138, 115, 0.25)",
                iconColor: "#00b36fff"
            },
            agent: { name: "Khalid", trait: "Graceful & Precise", ability: "Lead Qualification" }
        },
        {
            id: 2,
            title: "Call This Week",
            subtitle: "Call handled this week",
            value: callThisWeek,
            icon: PhoneForwarded,
            colors: {
                gradient: "linear-gradient(135deg, #05150fff, #07301eff, #0d7a5c)",
                darkGradient: "linear-gradient(135deg, #063d28, #0a6040)",
                iconBg: "rgba(16, 165, 126, 0.25)",
                iconColor: "#34d399"
            },
            agent: { name: "Khalid", trait: "Graceful & Precise", ability: "Lead Qualification" }
        },
        {
            id: 3,
            title: "Pending Calls",
            subtitle: "Average call duration",
            value: avgHandleTime,
            icon: Calendar,
            colors: {
                gradient: "linear-gradient(135deg, #05150fff, #07301eff, #0d7a5c)",
                darkGradient: "linear-gradient(135deg, #063d28, #0a6040)",
                iconBg: "rgba(13, 122, 92, 0.25)",
                iconColor: "#6ee7b7"
            },
            agent: { name: "Khalid", trait: "Graceful & Precise", ability: "Lead Qualification" }
        },
        {
            id: 4,
            title: "Avg Handle Time",
            subtitle: "Calls successfully answered",
            value: answerRate,
            icon: CheckCircle2,
            colors: {
                gradient: "linear-gradient(135deg, #05150fff, #07301eff, #0d7a5c)",
                darkGradient: "linear-gradient(135deg, #063d28, #0a6040)",
                iconBg: "rgba(15, 144, 104, 0.25)",
                iconColor: "#4ade80"
            },
            agent: { name: "Khalid", trait: "Graceful & Precise", ability: "Lead Qualification" }
        }
    ];
    const callCount = 4;

    // Action handlers
    const handleAction = (action: string) => alert(`${action} clicked!`);
    const handleCardClick = (title: string) => alert(`Card: ${title} clicked!`);

    return (
        <div className="w-full">

            {/* Header Toolbar */}
            <div className="flex flex-wrap justify-between items-center mb-8">
                <div className="flex-1 text-white text-xl xl:text-2xl font-medium ">Your studio handled {callCount} calls today.</div>

                {/* Right Controls */}
                <div className="flex flex-wrap items-center gap-3">
                    <button onClick={() => handleAction('Search')} className="p-2 text-gray-400 hover:text-gray-600 mr-2">
                        <Search size={22} />
                    </button>

                    <div className="flex items-center gap-2 mr-4">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#39FF14]"></span>
                        <span className="text-[#39FF14] font-bold tracking-wide text-sm">LIVE</span>
                    </div>

                    <div className="flex gap-2">
                        {[
                            { icon: RotateCw, name: 'Refresh', color: 'text-[#39FF14]' },
                            { icon: Download, name: 'Download', color: 'text-gray-500' },
                            { icon: Activity, name: 'Activity', color: 'text-gray-500' },
                            { icon: Send, name: 'Send', color: 'text-gray-500' },
                            { icon: ChevronLeft, name: 'Prev', color: 'text-gray-500' },
                            { icon: ChevronRight, name: 'Next', color: 'text-gray-500' }
                        ].map((btn, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAction(btn.name)}
                                className={`w-11 h-11 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors ${btn.color}`}
                            >
                                <btn.icon size={18} strokeWidth={2.5} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {loading ? (
                    [1,2,3,4].map((item) => (
                        <Skeleton key={item} className="w-full h-70 bg-green-900" />
                    ))
                ) : statsData.map((data) => (
                    <StatCard key={data.id} data={data} onClick={handleCardClick} />
                ))}
            </div>

        </div>
    );
};

export default StatsSection;