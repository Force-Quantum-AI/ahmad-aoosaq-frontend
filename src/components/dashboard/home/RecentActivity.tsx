import { Plus, Search, ChevronLeft, ChevronRight, ExternalLink, ArrowRight } from 'lucide-react';

const RecentActivity = () => {
    // Dummy dataset for contacts and groups
    const data = {
        actionCount: 174,
        pendingCount: 0,
        contacts: [
            { id: 1, img: "https://i.pravatar.cc/150?u=1" },
            { id: 2, img: "https://i.pravatar.cc/150?u=2" },
            { id: 3, img: "https://i.pravatar.cc/150?u=3" },
            { id: 4, img: "https://i.pravatar.cc/150?u=4" },
        ],
        groupActivity: {
            name: "Aiko",
            time: "12:40 PM",
            duration: "3:24",
            userImg: "https://i.pravatar.cc/150?u=4",
            targetImg: "https://i.pravatar.cc/150?u=1",
            groupMembers: [
                "https://i.pravatar.cc/150?u=1",
                "https://i.pravatar.cc/150?u=2",
                "https://i.pravatar.cc/150?u=3",
                "https://i.pravatar.cc/150?u=4",
            ],
            extraMembers: 4
        }
    };

    const handleAction = (label: string) => console.log(`${label} clicked`);

    return (
        <div className="bg-[#0A0A0B] text-white p-5 rounded-[32px] w-full border border-white/5">

            {/* ── Action Item Section ─────────────────────────────────────────── */}
            <div className="mb-8">
                {/* Header row */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-lg lg:text-2xl 2xl:text-3xl font-medium">Action Item</h2>
                        <p className="text-gray-500 text-sm mt-1">{data.actionCount} call today</p>
                    </div>

                    {/* + Create button in header */}
                    <button
                        onClick={() => handleAction('Create')}
                        className="px-4 py-2 bg-[#101926] text-[#3b82f6] rounded-full text-sm font-medium border border-blue-900/30 flex items-center gap-1 hover:bg-[#16253d] transition-colors"
                    >
                        <Plus size={16} /> Create
                    </button>
                </div>

                {/* Pending hero badge — the primary status indicator, visually dominant */}
                <div className="flex items-center gap-3">
                    <div className="flex items-baseline gap-1.5 bg-[#0a1e38] border border-blue-900/40 rounded-2xl px-5 py-3">
                        <span className="text-3xl font-bold text-[#3b82f6]">{data.pendingCount}</span>
                        <span className="text-blue-400/80 text-sm font-medium">Pending</span>
                    </div>
                    <p className="text-gray-600 text-xs">No actions require attention right now.</p>
                </div>
            </div>

            {/* ── Popular Contacts Section ────────────────────────────────────── */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-medium">Popular Contacts</h3>
                    <button
                        onClick={() => handleAction('Add Contact')}
                        className="flex items-center gap-1 text-[#3b82f6] bg-[#101926] px-3 py-1.5 rounded-xl text-sm border border-blue-900/20"
                    >
                        <Plus size={16} /> Add
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {data.contacts.map((contact) => (
                            <img
                                key={contact.id}
                                src={contact.img}
                                alt="contact"
                                className="w-12 h-12 rounded-full border-2 border-black object-cover"
                            />
                        ))}
                    </div>
                    <button className="w-12 h-12 rounded-full bg-[#1C1C1E] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                        <Search size={20} />
                    </button>
                </div>
            </div>

            {/* ── My Groups Section ───────────────────────────────────────────── */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-medium">My Groups</h3>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 text-[#3b82f6] bg-[#101926] px-3 py-1.5 rounded-xl text-sm border border-blue-900/20">
                            <Plus size={16} /> New
                        </button>
                        <div className="flex gap-1 ml-2">
                            <button className="w-9 h-9 rounded-full bg-[#1C1C1E] flex items-center justify-center text-gray-500 hover:bg-[#2C2C2E]"><ChevronLeft size={18} /></button>
                            <button className="w-9 h-9 rounded-full bg-[#1C1C1E] flex items-center justify-center text-gray-500 hover:bg-[#2C2C2E]"><ChevronRight size={18} /></button>
                        </div>
                    </div>
                </div>

                {/* Group Card */}
                <div className="bg-[#111112] rounded-[28px] p-5 border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center">
                            <div className="flex -space-x-3">
                                {data.groupActivity.groupMembers.map((m, i) => (
                                    <img key={i} src={m} alt="member" className="w-10 h-10 rounded-full border-2 border-[#111112] object-cover" />
                                ))}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#1e2536] border-2 border-[#111112] flex items-center justify-center text-[#3b82f6] text-xs font-bold">
                                +{data.groupActivity.extraMembers}
                            </div>
                        </div>
                        <ChevronRight className="text-gray-600" size={20} />
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <img src={data.groupActivity.userImg} alt="Aiko" className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <h4 className="font-medium text-lg">{data.groupActivity.name}</h4>
                                <p className="text-gray-500 text-xs">{data.groupActivity.time}</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-1 text-[#3b82f6] text-sm font-medium">
                            <ExternalLink size={16} /> Modify
                        </button>
                    </div>

                    <button className="text-[#3b82f6] text-sm flex items-center gap-2 mb-4 hover:underline">
                        View Transcript <ArrowRight size={14} />
                    </button>

                    {/* Time Display Bar */}
                    <div className="bg-[#1C1C1E] rounded-2xl p-3 flex items-center justify-between">
                        <ExternalLink className="text-[#3b82f6]" size={20} />
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-semibold tracking-wider">{data.groupActivity.duration}</span>
                            <ArrowRight className="text-gray-500" size={20} />
                        </div>
                        <img src={data.groupActivity.targetImg} alt="target" className="w-10 h-10 rounded-full border-2 border-yellow-500 object-cover" />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default RecentActivity;