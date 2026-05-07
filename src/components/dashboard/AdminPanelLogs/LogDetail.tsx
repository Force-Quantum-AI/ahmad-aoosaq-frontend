import { format } from "date-fns";
import {
  Terminal,
  User,
  Shield,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Clock,
  Globe,
  Server,
  Code,
  FileText,
  Database,
  Mail,
  X,
} from "lucide-react";
import { useEffect } from "react";

interface LogDetailProps {
  log: any;
  isOpen: boolean;
  onClose: () => void;
}

const LevelBadge = ({ level }: { level: string }) => {
  const config = {
    CRITICAL: {
      bg: "bg-red-900/80",
      text: "text-red-100",
      border: "border-red-700",
      icon: XCircle,
      label: "CRITICAL",
    },
    ERROR: {
      bg: "bg-orange-900/80",
      text: "text-orange-100",
      border: "border-orange-700",
      icon: AlertTriangle,
      label: "ERROR",
    },
    WARNING: {
      bg: "bg-yellow-900/80",
      text: "text-yellow-100",
      border: "border-yellow-700",
      icon: AlertTriangle,
      label: "WARNING",
    },
    INFO: {
      bg: "bg-blue-900/80",
      text: "text-blue-100",
      border: "border-blue-700",
      icon: Info,
      label: "INFO",
    },
    SUCCESS: {
      bg: "bg-green-900/80",
      text: "text-green-100",
      border: "border-green-700",
      icon: CheckCircle,
      label: "SUCCESS",
    },
  };
  const {
    bg,
    text,
    border,
    icon: Icon,
    label,
  } = config[level as keyof typeof config] || {
    bg: "bg-gray-800",
    text: "text-gray-200",
    border: "border-gray-600",
    icon: Info,
    label: level,
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${bg} ${text} border ${border}`}
    >
      <Icon size={12} />
      {label}
    </span>
  );
};

export function LogDetail({ log, isOpen, onClose }: LogDetailProps) {
  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!log || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full h-full bg-[#060D10] text-[#E0F2F1] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="shrink-0 p-4 sm:p-6 border-b border-[#142127] bg-[#0A1418]/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="p-2 rounded-xl bg-[#060D10] border border-[#142127] shrink-0">
                <Terminal size={18} className="text-[#00E5FF] sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#E0F2F1] break-words">
                  {log.event_name}
                </h2>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                  <span className="text-xs font-mono text-[#94A3B8] break-all">
                    ID: {log.id}
                  </span>
                  <span className="text-[#142127] hidden sm:inline">•</span>
                  <LevelBadge level={log.log_level} />
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors shrink-0"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 w-full">
              {/* Left Column: Primary Info - spans 2 columns on large screens */}
              <div className="lg:col-span-2 space-y-5 sm:space-y-6">
                {/* Message Section */}
                <div className="p-4 sm:p-6 rounded-2xl bg-[#0A1418] border border-[#142127] space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 text-[#94A3B8]">
                    <FileText size={16} className="shrink-0" />
                    <h3 className="text-xs font-mono uppercase tracking-widest">
                      Message Payload
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg leading-relaxed text-[#E0F2F1] font-medium break-words">
                    {log.message}
                  </p>
                </div>

                {/* Traceback Section (if exists) */}
                {log.traceback && (
                  <div className="p-4 sm:p-6 rounded-2xl bg-[#0A1418] border border-[#142127] space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 text-red-400">
                      <Code size={16} className="shrink-0" />
                      <h3 className="text-xs font-mono uppercase tracking-widest">
                        Stack Trace
                      </h3>
                    </div>
                    <pre className="p-3 sm:p-4 rounded-xl bg-[#060D10] border border-[#142127] text-xs font-mono text-red-200/80 overflow-x-auto leading-relaxed whitespace-pre-wrap break-words">
                      {log.traceback}
                    </pre>
                  </div>
                )}

                {/* Metadata Section */}
                <div className="p-4 sm:p-6 rounded-2xl bg-[#0A1418] border border-[#142127] space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 text-[#00E5FF]">
                    <Database size={16} className="shrink-0" />
                    <h3 className="text-xs font-mono uppercase tracking-widest">
                      Metadata JSON
                    </h3>
                  </div>
                  <pre className="p-3 sm:p-4 rounded-xl bg-[#060D10] border border-[#142127] text-xs font-mono text-[#00E5FF]/80 overflow-x-auto whitespace-pre-wrap break-words">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Right Column: Sidebar Info */}
              <div className="space-y-5 sm:space-y-6">
                {/* Context Card */}
                <div className="p-4 sm:p-6 rounded-2xl bg-[#0A1418] border border-[#142127] space-y-5 sm:space-y-6">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#94A3B8]">
                    Contextual Data
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#060D10] border border-[#142127] shrink-0">
                        <Clock size={14} className="text-[#94A3B8]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-[#94A3B8] uppercase">
                          Timestamp
                        </p>
                        <p className="text-xs sm:text-sm font-mono text-[#E0F2F1] break-all">
                          {format(
                            new Date(log.timestamp),
                            "yyyy-MM-dd HH:mm:ss.SSS",
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#060D10] border border-[#142127] shrink-0">
                        <Server size={14} className="text-[#94A3B8]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-[#94A3B8] uppercase">
                          Service / Business
                        </p>
                        <p className="text-sm text-[#E0F2F1] break-words">
                          {log.service_name || "N/A"}
                        </p>
                        <p className="text-xs text-[#94A3B8] font-mono break-all">
                          {log.business_id || "No Business ID"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#060D10] border border-[#142127] shrink-0">
                        <Globe size={14} className="text-[#94A3B8]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-[#94A3B8] uppercase">
                          Network Origin
                        </p>
                        <p className="text-xs sm:text-sm font-mono text-[#E0F2F1] break-all">
                          {log.ip_address || "Internal"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actor Card */}
                <div className="p-4 sm:p-6 rounded-2xl bg-[#0A1418] border border-[#142127] space-y-5 sm:space-y-6">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#94A3B8]">
                    Actor Identity
                  </h3>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#060D10] border border-[#142127] flex items-center justify-center shrink-0">
                      {log.actor_type === "system" ? (
                        <Shield
                          size={20}
                          className="text-purple-400 sm:w-6 sm:h-6"
                        />
                      ) : (
                        <User
                          size={20}
                          className="text-blue-400 sm:w-6 sm:h-6"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-bold text-[#E0F2F1] capitalize break-words">
                        {log.actor_type}
                      </p>
                      <p className="text-xs text-[#94A3B8] font-mono break-all">
                        ID: {log.actor_id || "N/A"}
                      </p>
                    </div>
                  </div>

                  {log.actor_email && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-[#060D10] border border-[#142127]">
                      <Mail size={14} className="text-[#94A3B8] shrink-0" />
                      <span className="text-xs text-[#E0F2F1] truncate">
                        {log.actor_email}
                      </span>
                    </div>
                  )}
                </div>

                {/* Code Context */}
                <div className="p-4 sm:p-6 rounded-2xl bg-[#0A1418] border border-[#142127] space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#94A3B8]">
                    Code Execution
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-[#94A3B8] uppercase">
                        File / Module
                      </p>
                      <p className="text-xs font-mono text-[#E0F2F1] truncate break-all">
                        {log.file_name || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#94A3B8] uppercase">
                        Function
                      </p>
                      <p className="text-xs font-mono text-[#00E5FF] break-all">
                        {log.function_name || "anonymous"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#94A3B8] uppercase">
                        Model
                      </p>
                      <p className="text-xs font-mono text-[#E0F2F1] break-all">
                        {log.model_name || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
