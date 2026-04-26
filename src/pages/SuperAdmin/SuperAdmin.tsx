import { SuperAdminHeader } from "@/components/SuperAdmin/SuperAdminHeader";
import { RevenueAnalytics } from "@/components/SuperAdmin/RevenueAnalytics";
import { ClientManagement } from "@/components/SuperAdmin/ClientManagement";
import { UsageAnalytics } from "@/components/SuperAdmin/UsageAnalytics";
import { TrialConversionFunnel } from "@/components/SuperAdmin/TrialConversionFunnel";
import { SystemHealth } from "@/components/SuperAdmin/SystemHealth";
import { ProfitabilitySection } from "@/components/SuperAdmin/ProfitabilitySection";
import { useAppSelector } from "@/store/hook";
import { selectUser } from "@/store/features/auth/auth.slice";
import { useGetSuperAdminPanelQuery } from "@/store/features/admin/admin.api";

const SuperAdmin = () => {
  const user = useAppSelector(selectUser);
  console.log(user);
  const { data } = useGetSuperAdminPanelQuery();
  const panelData = data?.data;

  // Transform usage analytics data
  const callData =
    panelData?.usage_analytics?.call_volume_this_week?.map((item) => ({
      d: item.day,
      v: item.calls,
    })) || [];
  const minsData =
    panelData?.usage_analytics?.minutes_used_this_week?.map((item) => ({
      d: item.day,
      v: item.minutes,
    })) || [];
  const topBusinesses =
    panelData?.usage_analytics?.top_businesses_by_usage?.map((item) => ({
      name: item.business,
      industry: item.industry,
      calls: item.calls,
      mins: item.minutes,
      rank: item.rank,
    })) || [];

  // Transform trial conversion funnel data
  const trialsStarted = panelData?.trial_conversion_funnel?.trials_started || 0;
  const activated = panelData?.trial_conversion_funnel?.activated_trials || 0;
  const highActivity =
    panelData?.trial_conversion_funnel?.high_activity_trials || 0;
  const converting = panelData?.trial_conversion_funnel?.converted_to_paid || 0;

  const funnelData = [
    {
      name: "Trials Started",
      value: trialsStarted,
      percentage: "100%",
      color: "#3b82f6",
      gradientId: "gradBlue",
    },
    {
      name: "Activated",
      value: activated,
      percentage:
        trialsStarted > 0
          ? `${Math.round((activated / trialsStarted) * 100)}%`
          : "0%",
      color: "#06b6d4",
      gradientId: "gradCyan",
    },
    {
      name: "High Activity",
      value: highActivity,
      percentage:
        activated > 0
          ? `${Math.round((highActivity / activated) * 100)}%`
          : "0%",
      color: "#10b981",
      gradientId: "gradEmerald",
    },
    {
      name: "Converting",
      value: converting,
      percentage:
        highActivity > 0
          ? `${Math.round((converting / highActivity) * 100)}%`
          : "0%",
      color: "#f59e0b",
      gradientId: "gradOrange",
    },
    {
      name: "Paid",
      value: converting,
      percentage:
        trialsStarted > 0
          ? `${Math.round((converting / trialsStarted) * 100)}%`
          : "0%",
      color: "#8b5cf6",
      gradientId: "gradPurple",
    },
  ];

  const funnelStatusCards = [
    {
      label: "Expiring in 3 Days",
      value: panelData?.trial_conversion_funnel?.expiring_in_3_days || 0,
      color: "text-orange-400",
      bg: "bg-orange-500/5",
      border: "border-orange-500/10",
    },
    {
      label: "High Activity Trials",
      value: panelData?.trial_conversion_funnel?.high_activity_trials || 0,
      color: "text-emerald-400",
      bg: "bg-emerald-500/5",
      border: "border-emerald-500/10",
    },
    {
      label: "No Activity Trials",
      value: panelData?.trial_conversion_funnel?.no_activity_trials || 0,
      color: "text-rose-400",
      bg: "bg-rose-500/5",
      border: "border-rose-500/10",
    },
  ];

  return (
    <div className="bg-[#080c14] min-h-screen text-slate-200">
      <div className="p-4 md:py-6 md:px-7 space-y-8 md:space-y-10 pb-40 scroll-smooth max-w-full overflow-x-hidden">
        {/* HOME SECTION */}
        <div
          id="home"
          className="space-y-6 md:space-y-6 scroll-mt-6 cursor-pointer group"
        >
          <SuperAdminHeader />
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="bg-[#0f1423]/60 backdrop-blur-[20px] px-5 py-4.5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group shadow-sm">
                <p className="text-xs text-[#64748B] uppercase tracking-wider">
                  Total Businessess
                </p>
                <h2 className="text-2xl font-bold mt-1.5">
                  {panelData?.overview?.total_businesses}
                </h2>
              </div>
              <div className="bg-[#0f1423]/60 backdrop-blur-[20px] px-5 py-4.5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group shadow-sm">
                <p className="text-xs text-[#64748B] uppercase tracking-wider">
                  Active Businessess
                </p>
                <h2 className="text-2xl font-bold mt-1.5">
                  {panelData?.overview?.active_businesses}
                </h2>
              </div>
              <div className="bg-[#0f1423]/60 backdrop-blur-[20px] px-5 py-4.5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group shadow-sm">
                <p className="text-xs text-[#64748B] uppercase tracking-wider">
                  Free Trial
                </p>
                <h2 className="text-2xl font-bold mt-1.5">
                  {panelData?.overview?.free_trial}
                </h2>
              </div>
              <div className="bg-[#0f1423]/60 backdrop-blur-[20px] px-5 py-4.5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group shadow-sm">
                <p className="text-xs text-[#64748B] uppercase tracking-wider">
                  Paid Businessess
                </p>
                <h2 className="text-2xl font-bold mt-1.5">
                  {panelData?.overview?.paid_businesses}
                </h2>
              </div>
              <div className="bg-[#0f1423]/60 backdrop-blur-[20px] px-5 py-4.5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group shadow-sm">
                <p className="text-xs text-[#64748B] uppercase tracking-wider">
                  MRR
                </p>
                <h2 className="text-2xl font-bold mt-1.5">
                  {panelData?.overview?.mrr}
                </h2>
              </div>
              <div className="bg-[#0f1423]/60 backdrop-blur-[20px] px-5 py-4.5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group shadow-sm">
                <p className="text-xs text-[#64748B] uppercase tracking-wider">
                  Cash Collected This Month
                </p>
                <h2 className="text-2xl font-bold mt-1.5">
                  {panelData?.overview?.cash_collected_this_month}
                </h2>
              </div>
              <div className="bg-[#0f1423]/60 backdrop-blur-[20px] px-5 py-4.5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group shadow-sm">
                <p className="text-xs text-[#64748B] uppercase tracking-wider">
                  Total Call Today
                </p>
                <h2 className="text-2xl font-bold mt-1.5">
                  {panelData?.overview?.total_calls_today}
                </h2>
              </div>
              <div className="bg-[#0f1423]/60 backdrop-blur-[20px] px-5 py-4.5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group shadow-sm">
                <p className="text-xs text-[#64748B] uppercase tracking-wider">
                  Minutes Today
                </p>
                <h2 className="text-2xl font-bold mt-1.5">
                  {panelData?.overview?.minutes_today}
                </h2>
              </div>
              <div className="bg-[#0f1423]/60 backdrop-blur-[20px] px-5 py-4.5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group shadow-sm">
                <p className="text-xs text-[#64748B] uppercase tracking-wider">
                  Average Usage Per Business
                </p>
                <h2 className="text-2xl font-bold mt-1.5">
                  {panelData?.overview?.avg_usage_per_business}
                </h2>
              </div>
              <div className="bg-[#0f1423]/60 backdrop-blur-[20px] px-5 py-4.5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group shadow-sm">
                <p className="text-xs text-[#64748B] uppercase tracking-wider">
                  Trial Conversion Rate
                </p>
                <h2 className="text-2xl font-bold mt-1.5">
                  {panelData?.overview?.trial_conversion_rate}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* REVENUE SECTION */}
        <div id="revenue" className=" scroll-mt-10">
          <RevenueAnalytics />
        </div>

        {/* CLIENTS SECTION */}
        <div
          id="clients"
          className=" scroll-mt-10 text-white overflow-hidden cursor-pointer group"
        >
          <ClientManagement clients={panelData?.client_management || []} />
        </div>

        {/* USAGE SECTION */}
        <div id="usage" className=" scroll-mt-10">
          <UsageAnalytics
            callData={callData}
            minsData={minsData}
            topBusinesses={topBusinesses}
          />
        </div>

        {/* TRIALS SECTION */}
        <div id="trials" className=" scroll-mt-10 cursor-pointer group">
          <TrialConversionFunnel
            data={funnelData}
            statusCards={funnelStatusCards}
          />
        </div>

        {/* SYSTEM SECTION */}
        <div id="system" className=" scroll-mt-10 cursor-pointer group">
          <SystemHealth />
        </div>

        {/* PROFIT SECTION */}
        <div id="profit" className=" scroll-mt-20 cursor-pointer group">
          <ProfitabilitySection />
        </div>
      </div>
    </div>
  );
};

export default SuperAdmin;
