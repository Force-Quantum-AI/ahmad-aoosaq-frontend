import PlanSection from "@/components/SuperAdmin/PlanSection";
import { SuperAdminHeader } from "@/components/SuperAdmin/SuperAdminHeader";

const ManagePlan = () => {


    return (
        <div className="bg-[#080c14] min-h-screen text-slate-200">
            <div className="p-4 md:py-6 md:px-7 space-y-8 md:space-y-10 pb-40 scroll-smooth max-w-full overflow-x-hidden">
                {/* HOME SECTION */}
                <div id="home" className="space-y-6 md:space-y-6 scroll-mt-6 cursor-pointer group">
                    <SuperAdminHeader />
                </div>

                <PlanSection />


            </div>
        </div>
    );
};

export default ManagePlan;
