import { useGetSuperAdminPanelQuery } from "@/store/features/admin/admin.api";
import {
  MRRByMonth,
  RevenueByIndustry,
  RevenueByPlan,
} from "@/store/features/admin/admin.types";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Color mappings
const PLAN_COLORS: Record<string, string> = {
  pro: "#3b82f6", // blue
  starter: "#f59e0b", // amber
  enterprise: "#8b5cf6",
  none: "#6b7280",
};

const INDUSTRY_COLORS: Record<string, string> = {
  Restaurant: "#ef4444",
  "Salon & Spa": "#10b981",
  "Travel Agencies": "#06b6d4",
  "Health Clinics": "#f97316",
};

export const RevenueAnalytics: React.FC = () => {
  const { data, isLoading, error } = useGetSuperAdminPanelQuery();

  if (isLoading) {
    return <div className="text-white p-4">Loading revenue analytics...</div>;
  }

  if (error || !data?.data) {
    return <div className="text-red-400 p-4">Failed to load revenue data</div>;
  }

  const { revenue_analytics } = data.data;

  // Transform MRR data
  const mrrData: { m: string; v: number }[] =
    revenue_analytics.mrr_by_month.map((item: MRRByMonth) => ({
      m: item.month,
      v: item.mrr,
    }));

  // Transform plan data
  const planData = revenue_analytics.revenue_by_plan.map(
    (item: RevenueByPlan) => ({
      n: item.plan,
      v: item.revenue,
      c: item.businesses,
      col: PLAN_COLORS[item.plan] || "#a1a1aa",
    }),
  );

  // Transform industry data
  const indData = revenue_analytics.revenue_by_industry.map(
    (item: RevenueByIndustry) => ({
      n: item.industry,
      v: item.revenue,
      col: INDUSTRY_COLORS[item.industry] || "#a1a1aa",
    }),
  );

  const totalMRR = revenue_analytics.monthly_recurring_revenue;
  const formattedMRR = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(totalMRR);

  return (
    <div id="revenue" className="space-y-4 cursor-pointer group">
      <h2 className="text-lg font-semibold text-white">Revenue Analytics</h2>

      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* MRR Area Chart */}
        <div className="bg-[#0f1423]/60 backdrop-blur-[20px] p-4 sm:p-5 rounded-2xl border border-white/5 w-full md:w-2/4">
          <p className="text-sm text-[#64748B] mb-2">
            Monthly Recurring Revenue
          </p>
          <div className="text-2xl font-bold text-[#10b981] mb-6">
            {formattedMRR}
          </div>
          <div className="h-[200px] sm:h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={mrrData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ffffff05"
                  vertical={false}
                />
                <XAxis
                  dataKey="m"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1f2e",
                    border: "1px solid #2a3040",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#f1f5f9" }}
                  formatter={(value: any) => {
                    if (typeof value === "number") {
                      return [`$${value.toLocaleString()}`, "Revenue"];
                    }
                    return [value, "Revenue"];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorMrr)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Plan */}
        <div className="bg-[#0f1423]/60 backdrop-blur-[20px] p-4 sm:p-5 rounded-2xl border border-white/5 w-full md:w-1/4">
          <p className="text-sm text-[#64748B] mb-4">Revenue by Plan</p>
          <div className="h-[120px] sm:h-[140px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="v"
                >
                  {planData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.col}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1f2e",
                    border: "1px solid #2a3040",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {planData.map((p, i) => (
              <div
                key={i}
                className="flex justify-between items-center text-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: p.col }}
                  />
                  <span className="text-[#64748B]">{p.n}</span>
                </div>
                <div className="font-semibold text-gray-200">
                  ${(p.v / 1000).toFixed(1)}K{" "}
                  <span className="text-gray-500 font-normal">({p.c})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Industry */}
        <div className="bg-[#0f1423]/60 backdrop-blur-[20px] p-4 sm:p-5 rounded-2xl border border-white/5 w-full md:w-1/4">
          <p className="text-sm text-[#64748B] mb-4">Revenue by Industry</p>
          <div className="h-[120px] sm:h-[140px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={indData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="v"
                >
                  {indData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.col}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1f2e",
                    border: "1px solid #2a3040",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {indData.map((p, i) => (
              <div
                key={i}
                className="flex justify-between items-center text-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: p.col }}
                  />
                  <span className="text-[#64748B]">{p.n}</span>
                </div>
                <div className="font-semibold text-gray-200">
                  ${(p.v / 1000).toFixed(1)}K
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// import React from "react";
// import {
//     AreaChart,
//     Area,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     ResponsiveContainer,
//     PieChart,
//     Pie,
//     Cell,
// } from "recharts";

// interface RevenueAnalyticsProps {
//     mrrData: { m: string; v: number }[];
//     planData: { n: string; v: number; col: string; c: number }[];
//     indData: { n: string; v: number; col: string }[];
// }

// export const RevenueAnalytics: React.FC<RevenueAnalyticsProps> = ({
//     mrrData,
//     planData,
//     indData,
// }) => {
//     return (
//         <div id="revenue" className="space-y-4 cursor-pointer group">
//             <h2 className="text-lg font-semibold text-white">Revenue Analytics</h2>

//             <div className="flex flex-col md:flex-row gap-4 w-full">
//                 {/* MRR Area Chart */}
//                 <div className="bg-[#0f1423]/60 backdrop-blur-[20px] p-4 sm:p-5 rounded-2xl border border-white/5 lg:col-span-2 w-full md:w-2/4">
//                     <p className="text-sm text-[#64748B] mb-2">Monthly Recurring Revenue</p>
//                     <div className="text-2xl font-bold text-[#10b981] mb-6">$67,200</div>
//                     <div className="h-[200px] sm:h-[250px] w-full">
//                         <ResponsiveContainer width="100%" height="100%">
//                             <AreaChart data={mrrData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                                 <defs>
//                                     <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
//                                         <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
//                                         <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
//                                     </linearGradient>
//                                 </defs>
//                                 <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
//                                 <XAxis
//                                     dataKey="m"
//                                     axisLine={false}
//                                     tickLine={false}
//                                     tick={{ fill: "#64748b", fontSize: 10 }}
//                                     dy={10}
//                                 />
//                                 <YAxis
//                                     axisLine={false}
//                                     tickLine={false}
//                                     tick={{ fill: "#64748b", fontSize: 10 }}
//                                     tickFormatter={(value) => `$${value / 1000}k`}
//                                 />
//                                 <Tooltip
//                                     contentStyle={{ backgroundColor: "#1a1f2e", border: "1px solid #2a3040", borderRadius: "8px" }}
//                                     itemStyle={{ color: "#f1f5f9" }}
//                                     formatter={(value: any) => {
//                                         if (typeof value === "number") {
//                                             return [`$${value.toLocaleString()}`, "Revenue"];
//                                         }
//                                         return [value, "Revenue"];
//                                     }}
//                                 />
//                                 <Area
//                                     type="monotone"
//                                     dataKey="v"
//                                     stroke="#10b981"
//                                     strokeWidth={2}
//                                     fillOpacity={1}
//                                     fill="url(#colorMrr)"
//                                 />
//                             </AreaChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </div>

//                 {/* Plan & Industry Pie Charts */}
//                     <div className="bg-[#0f1423]/60 backdrop-blur-[20px] p-4 sm:p-5 rounded-2xl border border-white/5 w-full md:w-1/4">
//                         <p className="text-sm text-[#64748B] mb-4">Revenue by Plan</p>
//                         <div className="h-[120px] sm:h-[140px] w-full">
//                             <ResponsiveContainer width="100%" height="100%">
//                                 <PieChart>
//                                     <Pie
//                                         data={planData}
//                                         cx="50%"
//                                         cy="50%"
//                                         innerRadius={35}
//                                         outerRadius={50}
//                                         paddingAngle={5}
//                                         dataKey="v"
//                                     >
//                                         {planData.map((entry, index) => (
//                                             <Cell key={`cell-${index}`} fill={entry.col} stroke="none" />
//                                         ))}
//                                     </Pie>
//                                     <Tooltip
//                                         contentStyle={{ backgroundColor: "#1a1f2e", border: "1px solid #2a3040", borderRadius: "8px" }}
//                                     />
//                                 </PieChart>
//                             </ResponsiveContainer>
//                         </div>
//                         <div className="mt-4 space-y-2">
//                             {planData.map((p, i) => (
//                                 <div key={i} className="flex justify-between items-center text-xs">
//                                     <div className="flex items-center gap-2">
//                                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.col }} />
//                                         <span className="text-[#64748B]">{p.n}</span>
//                                     </div>
//                                     <div className="font-semibold text-gray-200">
//                                         ${(p.v / 1000).toFixed(1)}K <span className="text-gray-500 font-normal">({p.c})</span>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
// <div className="bg-[#0f1423]/60 backdrop-blur-[20px] p-4 sm:p-5 rounded-2xl border border-white/5 w-full md:w-1/4">
//                         <p className="text-sm text-[#64748B] mb-4">Revenue by Industry</p>
//                         <div className="h-[120px] sm:h-[140px] w-full">
//                             <ResponsiveContainer width="100%" height="100%">
//                                 <PieChart>
//                                     <Pie
//                                         data={indData}
//                                         cx="50%"
//                                         cy="50%"
//                                         innerRadius={35}
//                                         outerRadius={50}
//                                         paddingAngle={5}
//                                         dataKey="v"
//                                     >
//                                         {indData.map((entry, index) => (
//                                             <Cell key={`cell-${index}`} fill={entry.col} stroke="none" />
//                                         ))}
//                                     </Pie>
//                                     <Tooltip
//                                         contentStyle={{ backgroundColor: "#1a1f2e", border: "1px solid #2a3040", borderRadius: "8px" }}
//                                     />
//                                 </PieChart>
//                             </ResponsiveContainer>
//                         </div>
//                         <div className="mt-4 space-y-2">
//                             {indData.map((p, i) => (
//                                 <div key={i} className="flex justify-between items-center text-xs">
//                                     <div className="flex items-center gap-2">
//                                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.col }} />
//                                         <span className="text-[#64748B]">{p.n}</span>
//                                     </div>
//                                     <div className="font-semibold text-gray-200">${(p.v / 1000).toFixed(1)}K</div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//             </div>
//         </div>
//     );
// };
