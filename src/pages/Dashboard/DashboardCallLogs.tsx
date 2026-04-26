import { LogDetail } from "@/components/dashboard/logs/LogDetail";
import { LogFilters } from "@/components/dashboard/logs/LogFilters";
import { LogTable } from "@/components/dashboard/logs/LogTable";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetLogsQuery } from "@/store/features/settings/settings.api";
import { Terminal } from "lucide-react";
import { useMemo, useState } from "react";


const DashboardCallLogs = () => {
    const [pagination, setPagination] = useState({
        page_number: 1,
        page_size: 20,
    });
    const [selectedLog, setSelectedLog] = useState<any >(null);
    const [filters, setFilters] = useState<any>({
        keyword: "",
        log_level: "",
        actor_type: "",
        event: "",
        from_date: "",
        to_date: "",
    });

    const debouncedKeyword = useDebounce(filters.keyword, 400);

    const queryParams = useMemo(
        () => ({
            keyword: debouncedKeyword || undefined,
            from_date: filters.from_date || undefined,
            to_date: filters.to_date || undefined,
            log_level: filters.log_level || undefined,
            actor_type: filters.actor_type || undefined,
            page_number: pagination.page_number,
            page_size: pagination.page_size,
        }),
        [
            debouncedKeyword,
            filters.from_date,
            filters.to_date,
            filters.log_level,
            filters.actor_type,
            pagination.page_number,
            pagination.page_size,
        ],
    );

    const {
        data: logsResponse,
        isLoading,
        isFetching,
    } = useGetLogsQuery(queryParams);

    const logs = useMemo(
        () => logsResponse?.data?.logs?.data ?? [],
        [logsResponse],
    );

    const handleSetFilters = (
        updater: any | ((prev: any) => any),
    ) => {
        setPagination((prev) => ({
            ...prev,
            page_number: 1,
        }));

        setFilters(updater);
    };

    const logsAfterEventFilter = useMemo(() => {
        if (!filters.event) return logs;
        return logs.filter((log:any) => log.event_name === filters.event);
    }, [logs, filters.event]);

    const totalRecords = logsResponse?.data?.total_records ?? 0;
    const totalPages = logsResponse?.data?.total_pages ?? 1;
    const currentPage =
        logsResponse?.data?.current_page ?? pagination.page_number;

    const availableEvents = Array.from(
        new Set(logs.map((l:any) => l.event_name)),
    ).sort() as string[];
    return (
        <div

        //   className="flex flex-col bg-[#060D10] text-[#E0F2F1] selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]"
        >
            <div
                className="  rounded-3xl md:rounded-4xl p-2 md:p-4 flex flex-col  relative z-10 w-full overflow-hidden mt-8"
            >
                <h2 className="text-xl md:text-2xl font-medium text-white mb-6 md:mb-8 pl-4 pt-4">
                    Logs
                </h2>
                {/* Top Filter Bar */}
                <header className="min-h-16 border-b border-[#142127]  flex items-center px-4 lg:px-6 z-10 shrink-0">
                    <div className="flex items-center gap-6 w-full">
                        <LogFilters
                            filters={filters}
                            setFilters={handleSetFilters}
                            availableEvents={availableEvents}
                            logs={logsAfterEventFilter}
                        />
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    {/* Table Area */}
                    <div className="flex-1 overflow-auto p-4 lg:p-6 ">
                        <div>
                            {isLoading || isFetching ? (
                                <div
                                    className="h-full flex flex-col items-center justify-center gap-4"
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full border-2 border-[#142127] border-t-[#00E5FF] animate-spin" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Terminal size={16} className="text-[#94A3B8]" />
                                        </div>
                                    </div>
                                    <p className="text-xs font-mono text-[#94A3B8] animate-pulse italic">
                                        Scanning data clusters...
                                    </p>
                                </div>
                            ) : (
                                <div
                                    className="w-full space-y-4"
                                >
                                    <LogTable
                                        logs={logsAfterEventFilter}
                                        onRowClick={(log) => setSelectedLog(log)}
                                    />

                                    {/* Pagination UI */}
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 border-t border-[#142127]">
                                        <div className="text-xs text-[#94A3B8] font-mono order-2 sm:order-1">
                                            Showing {logsAfterEventFilter.length} of{" "}
                                            {totalRecords} entries
                                        </div>
                                        <div className="flex items-center gap-2 order-1 sm:order-2">
                                            <button
                                                onClick={() =>
                                                    setPagination((prev) => ({
                                                        ...prev,
                                                        page_number: Math.max(prev.page_number - 1, 1),
                                                    }))
                                                }
                                                disabled={currentPage <= 1 || isFetching}
                                                className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#0A1418] border border-[#142127] text-[#E0F2F1] hover:bg-[#142127] hover:border-[#00E5FF]/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                Previous
                                            </button>
                                            <div className="text-xs font-mono text-[#94A3B8] px-2 sm:px-4">
                                                Page {currentPage} of {totalPages}
                                            </div>
                                            <button
                                                onClick={() =>
                                                    setPagination((prev) => ({
                                                        ...prev,
                                                        page_number: Math.min(
                                                            prev.page_number + 1,
                                                            totalPages,
                                                        ),
                                                    }))
                                                }
                                                disabled={currentPage >= totalPages || isFetching}
                                                className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#0A1418] border border-[#142127] text-[#E0F2F1] hover:bg-[#142127] hover:border-[#00E5FF]/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <LogDetail
                        log={selectedLog}
                        isOpen={!!selectedLog}
                        onClose={() => setSelectedLog(null)}
                    />
                </main>
            </div>
        </div>
    )
}

export default DashboardCallLogs