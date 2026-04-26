import { useGetHomePageDataQuery } from "@/store/features/home/home.api";
import { Download, PhoneIncoming, PhoneMissed } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const RecentCalls = () => {
    const { data, isLoading } = useGetHomePageDataQuery({});

    //  Transform API → UI
    const formatCalls = (calls:any) => {
        return calls.map((call:any) => {
            const isMissed = call.status !== "Successful";

            return {
                id: call.id,
                number: call.caller_phone_number || "Unknown Number",
                type: isMissed ? "Missed" : "Incoming",
                missed: isMissed,
                duration: call.duration !== "0:00" ? call.duration : null,
                timeAgo: formatDistanceToNow(new Date(call.created_at), {
                    addSuffix: true,
                }),
                handler: call.title || null,
                status: call.status,
            };
        });
    };

    const formattedCalls = formatCalls(data?.recent_calls || []);

    //  PDF Export Function
    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Recent Calls Report", 14, 15);

        const tableData = formattedCalls.map((call:any) => [
            call.number,
            call.type,
            call.handler || "-",
            call.duration || "-",
            call.timeAgo,
        ]);

        autoTable(doc, {
            startY: 25,
            head: [["Number", "Type", "Handler", "Duration", "Time"]],
            body: tableData,
        });

        doc.save("recent-calls.pdf");
    };


    return (
        <div className="bg-[#111111] border border-white/8 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <h3 className="text-white text-lg font-semibold">
                        Recent Calls
                    </h3>
                    <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-full font-medium">
                        {data?.recent_calls_total || 0} today
                    </span>
                </div>

                <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-xl transition-colors"
                >
                    <Download size={14} />
                    Export
                </button>
            </div>

            <p className="text-gray-500 text-sm mb-5">
                Call handled by your AI assistant
            </p>

            {/* Calls List */}
            <div className="flex flex-col divide-y divide-white/6">
                {
                isLoading ? (
                    <div className="space-y-2">
                    <Skeleton className="w-full h-20  rounded-xl bg-gray-700" />
                    <Skeleton className="w-full h-20  rounded-xl bg-gray-700" />
                    <Skeleton className="w-full h-20  rounded-xl bg-gray-700" />
                    </div>
                ) : formattedCalls.map((call:any) => (
                    <div
                        key={call.id}
                        className={`flex items-center justify-between py-4 gap-4 pl-3 border-l-2 ${
                            call.missed
                                ? "border-l-red-500/70"
                                : "border-l-emerald-500/70"
                        }`}
                    >
                        {/* Left */}
                        <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                    call.missed
                                        ? "bg-red-500/10"
                                        : "bg-emerald-500/10"
                                }`}
                            >
                                {call.missed ? (
                                    <PhoneMissed
                                        size={16}
                                        className="text-red-400"
                                    />
                                ) : (
                                    <PhoneIncoming
                                        size={16}
                                        className="text-emerald-400"
                                    />
                                )}
                            </div>

                            {/* Info */}
                            <div>
                                <p className="text-white text-sm font-medium">
                                    {call.number}
                                </p>

                                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                                    <span
                                        className={
                                            call.missed
                                                ? "text-red-400 font-medium"
                                                : "text-emerald-400 font-medium"
                                        }
                                    >
                                        {call.type}
                                    </span>

                                    {call.handler && (
                                        <>
                                            <span className="text-gray-600">
                                                •
                                            </span>
                                            <span>
                                                {call.handler} handled
                                            </span>
                                        </>
                                    )}

                                    {call.missed && (
                                        <>
                                            <span className="text-gray-600">
                                                •
                                            </span>
                                            <span>
                                                No agent available
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="text-right shrink-0">
                            {call.duration && (
                                <p className="text-white text-base font-bold tracking-tight">
                                    {call.duration}
                                </p>
                            )}

                            {call.missed && (
                                <span className="text-red-400/60 text-sm font-medium">
                                    —
                                </span>
                            )}

                            <p className="text-gray-500 text-xs mt-0.5">
                                {call.timeAgo}
                            </p>
                        </div>
                    </div>
                ))
                }
            </div>
        </div>
    );
};

export default RecentCalls;