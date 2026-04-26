import { useGetUserBusinessQuery } from "@/store/features/business/business.api";
import { Navigate, Outlet } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton"

const BusinessRoute = () => {
  const { data, isLoading } = useGetUserBusinessQuery({});

  if (isLoading) return(
    <>
    <div className="flex items-center justify-center h-screen bg-black p-10">
      <Skeleton className="w-full h-full bg-white/10 rounded-2xl" />
    </div>
    </>
  );

  let hasBusinessEmail = false;

  if (Array.isArray(data) && data.length > 0) {
    hasBusinessEmail = !!data[0]?.business_email || !!data[0]?.has_business_email || !!data[0]?.id;
  } else if (data && !Array.isArray(data)) {
    hasBusinessEmail = !!data.business_email || !!data.has_business_email || !!data.id;
  }

  //  User has NO business → block dashboard
  if (!hasBusinessEmail) {
    return <Navigate to="/create-agent" replace />;
  }

  return <Outlet />;
};

export default BusinessRoute;

// ---------------------------

// import { useGetUserBusinessQuery } from "@/store/features/business/business.api";
// import { Navigate, Outlet } from "react-router-dom";

// const BusinessRoute = () => {
//   const { data } = useGetUserBusinessQuery(undefined, {
//     refetchOnMountOrArgChange: false, // prevent refetch
//   });

//   const hasBusiness =
//     Array.isArray(data) ? data.length > 0 : !!data?.id;

//   if (!hasBusiness) {
//     return <Navigate to="/create-agent" replace />;
//   }

//   return <Outlet />;
// };

// export default BusinessRoute;