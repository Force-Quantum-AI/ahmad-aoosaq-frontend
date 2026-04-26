import React from "react";
import { Bell } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

export const SuperAdminHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* LEFT: Title + date */}
      <div>
        <Link to="/super-admin">
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            BLYVO Admin
          </h1></Link>
        <p className="text-[#64748B] text-xs sm:text-sm">
          Platform Overview —{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* RIGHT: Controls row */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* ALERTS */}
        <div className="flex items-center gap-2 bg-[#0f1423]/60 backdrop-blur-[20px] px-4 py-2 rounded-full border border-white/8 cursor-pointer hover:border-white/15 transition-colors">

          <Link to="/super-admin/manage-feature" className="text-[#64748B] text-xs font-semibold">Manage Features</Link>
        </div>
        <div className="flex items-center gap-2 bg-[#0f1423]/60 backdrop-blur-[20px] px-4 py-2 rounded-full border border-white/8 cursor-pointer hover:border-white/15 transition-colors">

          <Link to="/super-admin/manage-plan" className="text-[#64748B] text-xs font-semibold">Manage Plan</Link>
        </div>
        {/* VIEWING AS + Select */}
        <div className="flex items-center gap-3 bg-[#0f1423]/60 backdrop-blur-[20px] px-3 py-1 rounded-[14px] border border-white/8">
          <span className="text-[12px] uppercase text-[#64748B] whitespace-nowrap">
            Viewing As
          </span>
          <Select defaultValue="owner">
            <SelectTrigger className="h-auto bg-[#080c14] border border-white/10 rounded-[14px] px-3 py-1.5 text-white text-xs font-semibold shadow-none focus:ring-0 focus-visible:ring-0 gap-2 [&>svg]:text-white [&>svg]:size-3.5 min-w-37 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              position="popper"
              side="bottom"
              className="bg-[#141820] border-white/10 text-white rounded-lg mt-1"
            >
              <SelectItem
                value="owner"
                className="text-xs focus:bg-white/10 focus:text-white cursor-pointer"
              >
                Owner (Full Access)
              </SelectItem>
              <SelectItem
                value="admin"
                className="text-xs focus:bg-white/10 focus:text-white cursor-pointer"
              >
                Admin (Manage Only)
              </SelectItem>
              <SelectItem
                value="viewer"
                className="text-xs font-medium focus:bg-white/5 focus:text-white cursor-pointer"
              >
                Viewer (Read Only)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ALL SYSTEMS OPERATIONAL */}
        <div className="flex items-center gap-2 bg-[#0f1423]/60 backdrop-blur-[20px] px-4 py-2 rounded-full border border-white/8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />
          </span>
          <span className="text-[#10b981] text-xs font-semibold whitespace-nowrap">
            All Systems Operational
          </span>
        </div>

        {/* ALERTS */}
        <div className="flex items-center gap-2 bg-[#0f1423]/60 backdrop-blur-[20px] px-4 py-2 rounded-full border border-white/8 cursor-pointer hover:border-white/15 transition-colors">
          <Bell className="h-3.5 w-3.5 text-[#64748B]" />
          <span className="text-[#64748B] text-xs font-semibold">3 Alerts</span>
        </div>
      </div>
    </div>
  );
};
