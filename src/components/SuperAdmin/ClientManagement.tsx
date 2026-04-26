import React, { useState } from "react";
import { ClientManagementItem } from "@/store/features/admin/admin.types";

interface ClientManagementProps {
  clients: ClientManagementItem[];
}

const getPlanStyles = (plan: string) => {
  switch (plan.toLowerCase()) {
    case "starter":
      return "bg-[#10b98115] text-[#10b981] border-[#10b98135]";
    case "pro":
      return "bg-[#06b6d415] text-[#06b6d4] border-[#06b6d435]";
    case "scale":
      return "bg-[#8b5cf615] text-[#8b5cf6] border-[#8b5cf635]";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-[#10b98115] text-[#10b981] border-[#10b98135]";
    case "trial":
      return "bg-[#f59e0b15] text-[#f59e0b] border-[#f59e0b35]";
    case "suspended":
      return "bg-[#ef444415] text-[#ef4444] border-[#ef444435]";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

export const ClientManagement: React.FC<ClientManagementProps> = ({
  clients,
}) => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  const mappedClients = clients.map((c) => ({
    name: c.business,
    ind: c.industry,
    plan: c.plan,
    status: c.status,
    calls: c.calls,
    mins: c.minutes,
    rev: c.subscription_mrr,
    phone: c.phone,
    last: c.last_active,
    td: undefined,
  }));

  const filteredClients = mappedClients.filter((c) => {
    if (statusFilter !== "all" && c.status.toLowerCase() !== statusFilter)
      return false;
    if (planFilter !== "all" && c.plan.toLowerCase() !== planFilter)
      return false;
    return true;
  });

  return (
    <div className="space-y-4 cursor-pointer group">
      {/* HEADER ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Client Management
        </h2>

        <div className="flex flex-wrap gap-3 items-center">
          {/* STATUS FILTER */}
          <div className="flex gap-1.5 flex-wrap">
            {(["All", "Active", "Trial", "Suspended"] as const).map((f) => {
              const val = f.toLowerCase();
              const isActive = statusFilter === val;
              return (
                <button
                  key={f}
                  onClick={() => setStatusFilter(val)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                    isActive
                      ? "bg-[#10b981]/15 text-[#10b981] border-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                      : "bg-transparent text-[#64748B] border-white/10 hover:border-white/20 hover:text-gray-300"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
          <div className="h-5 w-px bg-white/10"></div>
          {/* PLAN FILTER */}
          <div className="flex gap-1.5 flex-wrap">
            {(["All", "Starter", "Pro", "Scale"] as const).map((f) => {
              const val = f.toLowerCase();
              const isActive = planFilter === val;
              return (
                <button
                  key={f}
                  onClick={() => setPlanFilter(val)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                    isActive
                      ? "bg-[#06b6d4]/15 text-[#06b6d4] border-[#06b6d4] shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                      : "bg-transparent text-[#64748B] border-white/10 hover:border-white/20 hover:text-gray-300"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[#0f1423]/60 backdrop-blur-[20px] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-5 py-4 text-[10px] font-bold text-[#64748B] uppercase tracking-[0.12em]">
                  Business
                </th>
                <th className="px-5 py-4 text-[10px] font-bold text-[#64748B] uppercase tracking-[0.12em]">
                  Industry
                </th>
                <th className="px-5 py-4 text-[10px] font-bold text-[#64748B] uppercase tracking-[0.12em]">
                  Plan
                </th>
                <th className="px-5 py-4 text-[10px] font-bold text-[#64748B] uppercase tracking-[0.12em]">
                  Status
                </th>
                <th className="px-5 py-4 text-[10px] font-bold text-[#64748B] uppercase tracking-[0.12em] text-right">
                  Calls
                </th>
                <th className="px-5 py-4 text-[10px] font-bold text-[#64748B] uppercase tracking-[0.12em] text-right">
                  Minutes
                </th>
                <th className="px-5 py-4 text-[10px] font-bold text-[#64748B] uppercase tracking-[0.12em] text-right">
                  Revenue
                </th>
                <th className="px-5 py-4 text-[10px] font-bold text-[#64748B] uppercase tracking-[0.12em]">
                  Phone
                </th>
                <th className="px-5 py-4 text-[10px] font-bold text-[#64748B] uppercase tracking-[0.12em] text-right">
                  Last Active
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredClients.map((c, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  {/* BUSINESS */}
                  <td className="px-5 py-2.5">
                    <span className="text-[13px] font-semibold text-gray-200">
                      {c.name}
                    </span>
                  </td>

                  {/* INDUSTRY */}
                  <td className="px-5 py-2.5">
                    <span className="text-[12px] text-[#64748B]">{c.ind}</span>
                  </td>

                  {/* PLAN */}
                  <td className="px-5 py-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getPlanStyles(c.plan)}`}
                    >
                      {c.plan}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyles(c.status)}`}
                      >
                        {c.status}
                      </span>
                      {c.td && (
                        <span className="text-[10px] text-[#f59e0b] font-medium">
                          {c.td}d left
                        </span>
                      )}
                    </div>
                  </td>

                  {/* CALLS */}
                  <td className="px-5 py-2.5 text-right">
                    <span className="text-[13px] text-gray-300 font-medium">
                      {c.calls.toLocaleString()}
                    </span>
                  </td>

                  {/* MINUTES */}
                  <td className="px-5 py-2.5 text-right">
                    <span className="text-[13px] text-gray-300 font-medium">
                      {c.mins.toLocaleString()}
                    </span>
                  </td>

                  {/* REVENUE */}
                  <td className="px-5 py-2.5 text-right">
                    <span
                      className={`text-[13px] font-bold ${c.rev > 0 ? "text-[#10b981]" : "text-gray-600"}`}
                    >
                      {c.rev > 0 ? `$${c.rev}` : "—"}
                    </span>
                  </td>

                  {/* PHONE */}
                  <td className="px-5 py-2.5">
                    <span className="text-[12px] text-[#64748B] font-mono tracking-tight">
                      {c.phone}
                    </span>
                  </td>

                  {/* LAST ACTIVE */}
                  <td className="px-5 py-2.5 text-right">
                    <span className="text-[12px] text-[#64748B]">{c.last}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
