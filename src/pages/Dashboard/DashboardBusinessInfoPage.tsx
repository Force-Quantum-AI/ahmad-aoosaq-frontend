import AdditionalInformation from "@/components/dashboard/DashboardComponent/DashboardBusinessInfoPageComponent/AdditionalInformationSection";
import BusinessDetailsSection from "@/components/dashboard/DashboardComponent/DashboardBusinessInfoPageComponent/BusinessDetailsSection";
import BusinessHoursSection from "@/components/dashboard/DashboardComponent/DashboardBusinessInfoPageComponent/BusinessHoursSection";
import BusinessPoliciesSection from "@/components/dashboard/DashboardComponent/DashboardBusinessInfoPageComponent/BusinessPoliciesSection";
import BussinessFAQSection from "@/components/dashboard/DashboardComponent/DashboardBusinessInfoPageComponent/BussinessFAQSection";
import LuxeToolbar from "@/components/dashboard/DashboardComponent/DashboardBusinessInfoPageComponent/LuxeToolbar";
import ServicesSection from "@/components/dashboard/DashboardComponent/DashboardBusinessInfoPageComponent/ServicesSection";
import { useGetUserBusinessQuery } from "@/store/features/business/business.api";

export default function DashboardBusinessInfoPage() {
  const {data} = useGetUserBusinessQuery({});
  const business = data?.[0];
  console.log("busi : ",business);
  
  return (
    <div className="px-6">
      <LuxeToolbar />
      <div className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column — Business Details + Services */}
          <div className="space-y-6">
            <BusinessDetailsSection 
            business_id={business?.id}
            name={business?.name}
            description={business?.description}
            address={business?.address}
            business_website={business?.business_website}
            business_email={business?.business_email}
            />
            <ServicesSection business_id={business?.id} />
          </div>

          {/* Right column — Hours + Policies + FAQ + Additional Information
              Moving AdditionalInformation here balances column heights */}
          <div className="space-y-6">
            <BusinessHoursSection business_id={business?.id} />
            <BusinessPoliciesSection business_id={business?.id} />
            <BussinessFAQSection business_id={business?.id} />
            <AdditionalInformation business_id={business?.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
