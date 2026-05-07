import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Calendar as CalendarIcon,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import type { Dispatch, SetStateAction } from "react";

export interface LogsFilterState {
  keyword: string;
  log_level: any;
  actor_type: "user" | "system" | "anonymous" | "";
  event: string;
  from_date: string;
  to_date: string;
}

interface LogFiltersProps {
  filters: LogsFilterState;
  setFilters: Dispatch<SetStateAction<LogsFilterState>>;
  availableEvents: string[];
  logs: any;
}

type FilterDropdownProps = {
  title: string;
  items: string[];
  current: string;
  filterKey: "log_level" | "actor_type" | "event";
  updateFilter: (key: "log_level" | "actor_type" | "event", value: string) => void;
};

function FilterDropdown({
  title,
  items,
  current,
  filterKey,
  updateFilter,
}: FilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 border-[#142127] bg-[#0A1418]/50 text-[#E0F2F1] text-xs gap-2 px-3 hover:bg-[#142127] hover:text-[#00E5FF] transition-all w-full sm:w-auto justify-between",
            current && "border-[#00E5FF]/50 bg-[#00E5FF]/10 text-[#00E5FF]",
          )}
        >
          <div className="flex items-center gap-2">
            <Filter
              size={12}
              className={current ? "text-[#00E5FF]" : "text-[#94A3B8]"}
            />
            <span className="text-[#94A3B8]">By {title}:</span>
            <span className="font-medium">{current || "All"}</span>
          </div>
          <ChevronDown size={12} className="text-[#94A3B8]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="bg-[#0A1418] border-[#142127] text-[#E0F2F1] min-w-40"
      >
        <DropdownMenuItem
          onClick={() => updateFilter(filterKey, "")}
          className="text-xs focus:bg-[#142127] focus:text-[#00E5FF] cursor-pointer"
        >
          All
        </DropdownMenuItem>
        {items.map((item) => (
          <DropdownMenuItem
            key={item}
            onClick={() => updateFilter(filterKey, item)}
            className={cn(
              "text-xs focus:bg-[#142127] focus:text-[#00E5FF] cursor-pointer",
              current === item && "bg-[#142127] text-[#00E5FF]",
            )}
          >
            {item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LogFilters({
  filters,
  setFilters,
  availableEvents,
  logs,
}: LogFiltersProps) {
  const logLevels: any = [
    "CRITICAL",
    "ERROR",
    "WARNING",
    "INFO",
    "SUCCESS",
  ];
  const actorTypes: Array<"user" | "system" | "anonymous"> = [
    "user",
    "system",
    "anonymous",
  ];

  const updateFilter = (
    key: "log_level" | "actor_type" | "event",
    value: string,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === prev[key] ? "" : value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      keyword: "",
      log_level: "",
      actor_type: "",
      event: "",
      from_date: "",
      to_date: "",
    });
  };

  const exportCSV = () => {
    if (logs.length === 0) return;

    const headers = [
      "ID",
      "Timestamp",
      "Level",
      "Event Name",
      "Message",
      "Actor Type",
      "Actor Email",
      "Business ID",
      "Service Name",
      "IP Address",
    ];

    const rows = logs.map((log:any) => [
      log.id,
      format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss"),
      log.log_level,
      `"${log.event_name.replace(/"/g, '""')}"`,
      `"${log.message.replace(/"/g, '""')}"`,
      log.actor_type,
      log.actor_email || "",
      log.business_id || "",
      log.service_name || "",
      log.ip_address || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row:any) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nexus-logs-export-${format(new Date(), "yyyyMMdd-HHmmss")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const hasActiveFilters = !!(
    filters.keyword ||
    filters.log_level ||
    filters.actor_type ||
    filters.event ||
    filters.from_date ||
    filters.to_date
  );

  return (
    <div className="flex flex-wrap items-center gap-2 w-full py-2">
      {/* Search input – full width on mobile, flexible on larger screens */}
      <div className="relative w-full sm:w-auto sm:flex-1 sm:min-w-50 lg:min-w-65">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#94A3B8]" />
        <Input
          placeholder="Search logs..."
          className="pl-9 bg-[#0A1418]/50 border-[#142127] text-[#E0F2F1] text-xs h-9 focus-visible:ring-[#00E5FF]/50 placeholder:text-[#94A3B8]/50 w-full"
          value={filters.keyword}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, keyword: e.target.value }))
          }
        />
      </div>

      {/* Filter dropdowns – full width on mobile, auto on larger */}
      <FilterDropdown
        title="Level"
        items={logLevels}
        current={filters.log_level}
        filterKey="log_level"
        updateFilter={updateFilter}
      />
      <FilterDropdown
        title="Actor"
        items={actorTypes}
        current={filters.actor_type}
        filterKey="actor_type"
        updateFilter={updateFilter}
      />
      <FilterDropdown
        title="Event"
        items={availableEvents}
        current={filters.event}
        filterKey="event"
        updateFilter={updateFilter}
      />

      {/* Date range picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-9 border-[#142127] bg-[#0A1418]/50 text-[#E0F2F1] text-xs gap-2 px-3 hover:bg-[#142127] hover:text-[#00E5FF] transition-all w-full sm:w-auto justify-between",
              (filters.from_date || filters.to_date) &&
                "border-[#00E5FF]/50 bg-[#00E5FF]/10 text-[#00E5FF]",
            )}
          >
            <div className="flex items-center gap-2">
              <CalendarIcon
                size={12}
                className={
                  filters.from_date || filters.to_date
                    ? "text-[#00E5FF]"
                    : "text-[#94A3B8]"
                }
              />
              <span className="text-[#94A3B8]">Date:</span>
              <span className="font-medium">
                {filters.from_date
                  ? filters.to_date
                    ? `${format(new Date(filters.from_date), "MMM dd")} - ${format(new Date(filters.to_date), "MMM dd")}`
                    : `From ${format(new Date(filters.from_date), "MMM dd")}`
                  : filters.to_date
                    ? `Until ${format(new Date(filters.to_date), "MMM dd")}`
                    : "All Time"}
              </span>
            </div>
            <ChevronDown size={12} className="text-[#94A3B8]" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-4 bg-[#0A1418] border-[#142127] text-[#E0F2F1]"
          align="start"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-mono">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[9px] text-[#94A3B8]">From</span>
                  <Input
                    type="date"
                    className="h-8 bg-[#060D10] border-[#142127] text-[#E0F2F1] text-[10px] scheme-dark"
                    value={filters.from_date}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        from_date: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-[#94A3B8]">To</span>
                  <Input
                    type="date"
                    className="h-8 bg-[#060D10] border-[#142127] text-[#E0F2F1] text-[10px] scheme-dark"
                    value={filters.to_date}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        to_date: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#142127]">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-[10px] text-[#94A3B8] hover:text-[#E0F2F1]"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    from_date: "",
                    to_date: "",
                  }))
                }
              >
                Reset Range
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear filters button – only shown when filters are active */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-9 text-xs text-[#94A3B8] hover:text-[#00E5FF] hover:bg-transparent px-2 transition-colors w-full sm:w-auto"
        >
          <X size={14} className="mr-1" />
          <span className="sm:inline">Clear Filters</span>
        </Button>
      )}

      {/* Export CSV button */}
      <Button
        variant="outline"
        size="sm"
        onClick={exportCSV}
        className="h-9 border-[#142127] bg-[#0A1418]/50 text-[#E0F2F1] text-xs gap-2 px-3 hover:bg-[#142127] hover:text-[#00E5FF] transition-all w-full sm:w-auto"
      >
        <FileText size={14} className="text-[#00E5FF]" />
        <span>Export CSV</span>
      </Button>
    </div>
  );
}
