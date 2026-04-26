import FeatureSection from "@/components/SuperAdmin/FeaturesSection";
import { SuperAdminHeader } from "@/components/SuperAdmin/SuperAdminHeader";
// import { SuperAdminStatCard } from "@/components/SuperAdmin/SuperAdminStatCard";
// import { RevenueAnalytics } from "@/components/SuperAdmin/RevenueAnalytics";
// import { ClientManagement } from "@/components/SuperAdmin/ClientManagement";
// import { UsageAnalytics } from "@/components/SuperAdmin/UsageAnalytics";
// import { TrialConversionFunnel } from "@/components/SuperAdmin/TrialConversionFunnel";
// import { SystemHealth } from "@/components/SuperAdmin/SystemHealth";
// import { ProfitabilitySection } from "@/components/SuperAdmin/ProfitabilitySection";

const ManageFeature = () => {


    return (
        <div className="bg-[#080c14] min-h-screen text-slate-200">
            <div className="p-4 md:py-6 md:px-7 space-y-8 md:space-y-10 pb-40 scroll-smooth max-w-full overflow-x-hidden">
                {/* HOME SECTION */}
                <div id="home" className="space-y-6 md:space-y-6 scroll-mt-6 cursor-pointer group">
                    <SuperAdminHeader />
                </div>

                <FeatureSection />


            </div>
        </div>
    );
};

export default ManageFeature;
