import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Terminal,
  User,
  Shield,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle,
} from "lucide-react";


interface LogTableProps {
  logs: any;
  onRowClick?: (log: any) => void;
}

const getLevelBadge = (level: any) => {
  switch (level) {
    case "CRITICAL":
      return (
        <Badge
          variant="destructive"
          className="bg-red-900 text-red-100 border-red-700 gap-1"
        >
          <XCircle size={12} /> CRITICAL
        </Badge>
      );
    case "ERROR":
      return (
        <Badge
          variant="destructive"
          className="bg-orange-900 text-orange-100 border-orange-700 gap-1"
        >
          <AlertTriangle size={12} /> ERROR
        </Badge>
      );
    case "WARNING":
      return (
        <Badge className="bg-yellow-900 text-yellow-100 border-yellow-700 gap-1">
          <AlertTriangle size={12} /> WARNING
        </Badge>
      );
    case "INFO":
      return (
        <Badge
          variant="secondary"
          className="bg-blue-900 text-blue-100 border-blue-700 gap-1"
        >
          <Info size={12} /> INFO
        </Badge>
      );
    case "SUCCESS":
      return (
        <Badge className="bg-green-900 text-green-100 border-green-700 gap-1">
          <CheckCircle size={12} /> SUCCESS
        </Badge>
      );
    default:
      return <Badge variant="outline">{level}</Badge>;
  }
};

const getActorIcon = (type: string) => {
  switch (type) {
    case "user":
      return <User size={14} className="text-blue-400" />;
    case "system":
      return <Shield size={14} className="text-purple-400" />;
    default:
      return <Info size={14} className="text-gray-400" />;
  }
};

export function LogTable({ logs, onRowClick }: LogTableProps) {
  return (
    <div className="rounded-md border border-[#142127] bg-[#0A1418]/50 backdrop-blur-sm overflow-x-auto">
      <Table className="min-w-250 lg:min-w-full">
        <TableHeader className="bg-[#142127]/50">
          <TableRow className="hover:bg-transparent border-[#142127]">
            <TableHead className="w-45 text-[#94A3B8] font-mono text-xs uppercase tracking-wider italic">
              Timestamp
            </TableHead>
            <TableHead className="w-30 text-[#94A3B8] font-mono text-xs uppercase tracking-wider italic">
              Level
            </TableHead>
            <TableHead className="text-[#94A3B8] font-mono text-xs uppercase tracking-wider italic">
              Event Name
            </TableHead>
            <TableHead className="text-[#94A3B8] font-mono text-xs uppercase tracking-wider italic">
              Actor
            </TableHead>
            <TableHead className="text-[#94A3B8] font-mono text-xs uppercase tracking-wider italic">
              Business ID
            </TableHead>
            <TableHead className="text-[#94A3B8] font-mono text-xs uppercase tracking-wider italic">
              Service Name
            </TableHead>
            <TableHead className="text-[#94A3B8] font-mono text-xs uppercase tracking-wider italic">
              IP Address
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-24 text-center text-[#94A3B8] italic"
              >
                No logs found matching the current filters.
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log:any) => (
              <TableRow
                key={log.id}
                className="group border-[#142127] hover:bg-[#142127]/50 transition-colors cursor-pointer"
                onClick={() => onRowClick?.(log)}
              >
                <TableCell className="font-mono text-xs text-[#E0F2F1]/80">
                  {format(new Date(log.timestamp), "MMM dd, HH:mm:ss.SSS")}
                </TableCell>
                <TableCell>{getLevelBadge(log.log_level)}</TableCell>
                <TableCell className="font-medium text-[#E0F2F1]">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-[#94A3B8]" />
                    {log.event_name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 text-xs text-[#E0F2F1]/90">
                      {getActorIcon(log.actor_type)}
                      <span className="capitalize">{log.actor_type}</span>
                    </div>
                    {log.actor_email && (
                      <span className="text-[10px] text-[#94A3B8] font-mono">
                        {log.actor_email}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-[#94A3B8]">
                  {log.business_id || "-"}
                </TableCell>
                <TableCell className="font-mono text-xs text-[#94A3B8]">
                  {log.service_name || "-"}
                </TableCell>
                <TableCell className="font-mono text-xs text-[#94A3B8]">
                  {log.ip_address || "-"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
