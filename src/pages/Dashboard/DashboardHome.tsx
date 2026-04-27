import ActivityFeedChart from "@/components/dashboard/home/ActivityFeedChart";
import MyAgentsPanel from "@/components/dashboard/home/MyAgentsPanel";
import RecentActivity from "@/components/dashboard/home/RecentActivity";
import StatsSection from "@/components/dashboard/home/StatsSection";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetHomePageDataQuery } from "@/store/features/home/home.api";

const DashboardHome = () => {
  const { data, isLoading} = useGetHomePageDataQuery({});
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-black min-h-screen p-4">

        <div className="lg:col-span-2 min-h-[50vh] text-white px-5 rounded-3xl">
          <StatsSection 
          callToday={data?.call_today} 
          callThisWeek={data?.call_this_week} 
          avgHandleTime={data?.pending_calls} 
          answerRate={data?.avg_handle_time} 
          loading={isLoading} />

          {isLoading ? (
            <div className="mt-5 h-full grid grid-cols-1 md:grid-cols-2 gap-3">
              <Skeleton className="w-full h-full rounded-2xl bg-white/15" />
              <Skeleton className="w-full h-full rounded-2xl bg-white/15" />
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            <ActivityFeedChart chartData={data?.activity_feed} />
            <RecentActivity />
          </div>
          )}
        </div>

        <div className="min-h-[50vh] rounded-[40px] ">
          <MyAgentsPanel />
        </div>

      </div>
    </>
  )
};

export default DashboardHome;
