

import { useEffect, useState } from 'react';
import {
    Search,
    MoreHorizontal,
    Plus,
    Bot,
    ExternalLink,
    Trash2,
    Star,
    ArrowRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import TestCallPopup from '../TestCallPopup';
import { useNavigate } from 'react-router-dom';
import { useGetAllAgentQuery } from '@/store/features/agent/agent.api';
import { Skeleton } from '@/components/ui/skeleton';

const MyAgentsPanel = () => {
    const { data: agentData = [], isLoading } = useGetAllAgentQuery({});
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const navigate = useNavigate();

    //  Transform API → UI shape (NO UI CHANGE)
    const formattedAgents = agentData.map((item: any, index: number) => ({
        id: item.id,
        name: item.voice.name,
        status: item.is_active ? "active" : "inactive",
        trait: item.voice.description,
        abilities: item.voice.provider,
        languages: [item.voice.language?.toUpperCase() || "EN"],
        gradient: [
            "bg-gradient-to-br from-[#f26c9f] via-[#e63f6a] to-[#9955d4]",
            "bg-gradient-to-br from-[#1de8c8] via-[#10a3d8] to-[#1d4fd8]",
            "bg-gradient-to-br from-[#f6c844] via-[#f08030] to-[#e85520]",
            "bg-gradient-to-br from-[#8e44ad] via-[#6c5ce7] to-[#341f97]",
        ][index % 4],
        starred: false,
        preview: item.voice.preview_url
    }));

    //  Split active & inactive
    const activeAgent = formattedAgents.find((a: any) => a.status === "active");
    const inactiveAgents = formattedAgents.filter((a: any) => a.status !== "active");

    const [agents, setAgents] = useState(inactiveAgents);

    const handleDelete = (id: number) => {
        setAgents((prev: any) => prev.filter((agent: any) => agent.id !== id));
    };

    const handleStar = (id: number) => {
        setAgents((prev: any) =>
            prev.map((agent: any) =>
                agent.id === id ? { ...agent, starred: !agent.starred } : agent
            )
        );
    };

    const handleAction = (actionName: string) => {
        toast(`${actionName} action clicked!`);
    };
    useEffect(() => {
        setAgents(inactiveAgents);
    }, [agentData]);



    return (
        <div className="bg-[#121214] w-full rounded-[32px] p-4 sm:p-6 font-sans">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-1">
                        My agents
                    </h2>
                    <p className="text-gray-500 text-sm">
                        {formattedAgents.length} active agents
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => handleAction('Search input box opened for searching agents')}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#232325] flex items-center justify-center text-[#8e8e93] hover:text-white hover:bg-[#2c2c2e]"
                    >
                        <Search size={18} />
                    </button>

                    <button
                        onClick={() => handleAction('More options')}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#232325] flex items-center justify-center text-[#8e8e93] hover:text-white hover:bg-[#2c2c2e]"
                    >
                        <MoreHorizontal size={18} />
                    </button>

                    <button
                        onClick={() => navigate('/create-agent')}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#1877F2] flex items-center justify-center text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20"
                    >
                        <Plus size={22} />
                    </button>
                </div>
            </div>

            {/*  ACTIVE AGENT (TOP PANEL) */}
            <h2 className="text-base md:text-lg font-semibold text-white tracking-tight mb-1">
                Active agent
            </h2>
            {isLoading ? <Skeleton className="w-full h-40 rounded-xl bg-white/15 mb-6" /> : 
            activeAgent && (
                <div className="bg-[#1C1C1E] rounded-[24px] p-4 mb-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#2A2A2E] flex items-center justify-center">
                                <Bot size={22} className="text-white" />
                            </div>

                            <div>
                                <h3 className="text-white font-medium text-[16px] sm:text-[17px]">
                                    {activeAgent.name}
                                </h3>
                                <p className="text-[#1877F2] text-xs mt-0.5">
                                    {activeAgent.trait}
                                </p>
                            </div>
                        </div>

                        {/* <button
                            onClick={() => handleAction('Save Changes')}
                            className="flex items-center justify-center gap-2 bg-[#2A2A2E] text-[#8e8e93] hover:text-white px-3.5 py-2.5 rounded-xl text-sm font-medium"
                        >
                            <Save size={16} /> Save Changes
                        </button> */}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => setIsPopupOpen(true)}
                            className="flex-1 bg-[#1877F2] hover:bg-blue-600 text-white py-3.5 rounded-[14px] font-medium text-[15px] shadow-lg shadow-blue-500/20"
                        >
                            Test agent
                        </button>

                        <button
                            onClick={() => navigate('/create-agent')}
                            className="flex-1 bg-[#2D3243] hover:bg-[#383e53] text-white py-3.5 rounded-[14px] font-medium text-[15px]"
                        >
                            New agent
                        </button>
                    </div>
                </div>
            )}

            {/* INACTIVE AGENTS LIST */}
            <h2 className="text-base md:text-lg font-semibold text-white tracking-tight mb-2">
                Choose another agent
            </h2>
            {isLoading ? (
                <div className='flex flex-col gap-'>
                    <Skeleton className="w-full h-40 rounded-xl bg-white/15 mb-6" />
                    <Skeleton className="w-full h-40 rounded-xl bg-white/15 mb-6" />
                    <Skeleton className="w-full h-40 rounded-xl bg-white/15 mb-6" />
                </div>
            ) : (
            <div className="flex flex-col gap-4">
                {agents.map((agent: any) => (
                    <div
                        key={agent.id}
                        className={`p-5 rounded-[28px] ${agent.gradient} relative overflow-hidden flex flex-col md:flex-row lg:justify-between gap-6 shadow-lg`}
                    >
                        {/* Left */}
                        <div className="flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className={`w-2.5 h-2.5 rounded-full ${agent.status === 'active' ? 'bg-[#39FF14]' : 'bg-gray-100'}`}></span>
                                    <h3 className="text-white font-bold text-lg tracking-wide">
                                        {agent.name}
                                    </h3>
                                </div>

                                <p className="text-white/90 italic text-[13px]">
                                    {agent.trait}
                                </p>
                            </div>

                            <div className="mt-6">
                                <p className="text-[8px] font-bold uppercase tracking-widest text-white/70 mb-1.5">
                                    Abilities
                                </p>
                                <p className="text-white text-xs font-semibold">
                                    {agent.abilities}
                                </p>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
                            <div className="flex flex-col items-start sm:items-center">
                                <p className="text-[8px] font-bold uppercase tracking-widest text-white/70 mb-2">
                                    Languages
                                </p>

                                <div className="flex gap-1.5">
                                    {agent.languages.map((lang: any) => (
                                        <span
                                            key={lang}
                                            className="bg-white text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded-[4px]"
                                        >
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex sm:flex-col gap-4 items-center justify-center sm:border-l border-white/20 sm:pl-4">

                                <button
                                    onClick={() => handleAction(`Open ${agent.name}`)}
                                    className="text-white/80 hover:text-white"
                                >
                                    <ExternalLink size={20} />
                                </button>

                                <button
                                    onClick={() => handleDelete(agent.id)}
                                    className="text-white/80 hover:text-[#ff4444]"
                                >
                                    <Trash2 size={20} />
                                </button>

                                <button
                                    onClick={() => handleStar(agent.id)}
                                    className={agent.starred ? 'text-yellow-400' : 'text-white/90'}
                                >
                                    <Star size={20} fill={agent.starred ? 'currentColor' : 'none'} />
                                </button>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
)}

            {/*  REDIRECT FIX */}
            <button
                onClick={() => navigate('/dashboard/about')}
                className="w-full mt-5 bg-[#2D3243] hover:bg-[#383e53] text-white py-4 rounded-[16px] font-medium text-[15px] flex items-center justify-center gap-2"
            >
                Show all <ArrowRight size={18} />
            </button>

            {isPopupOpen && <TestCallPopup onClose={() => setIsPopupOpen(false)} />}
        </div>
    );
};

export default MyAgentsPanel;