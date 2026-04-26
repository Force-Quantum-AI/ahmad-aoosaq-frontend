import ChyrHero from "@/components/ChyrLandingPage/ChyrHero";

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import ChyrBusinessMiss from "@/components/ChyrLandingPage/ChyrBusinessMiss";
import ChyrTryLiveDemo from "@/components/ChyrLandingPage/ChyrTryLiveDemo";
import ChyrHylnSteps from "@/components/ChyrLandingPage/ChyrHylnSteps";
import ChyrCustomizeHyln from "@/components/ChyrLandingPage/ChyrCustomizeHyln";
import ChyrForwardCalls from "@/components/ChyrLandingPage/ChyrForwardCalls";

import ChyrIntegrations from "@/components/ChyrLandingPage/ChyrIntegrations";
import ChyrFAQ from "@/components/ChyrLandingPage/ChyrFAQ";
import ChyrReliableEmployee from "@/components/ChyrLandingPage/ChyrReliableEmployee";
import ChyrRevenueCTA from "@/components/ChyrLandingPage/ChyrRevenueCTA";
import ChyrSecurityCompliance from "@/components/ChyrLandingPage/ChyrSecurityCompliance";
export default function ChyrHome() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      delay: 200,
    });
    AOS.refresh();
  }, []);
  return (
    <div className="overflow-x-hidden bg-black">
      <ChyrHero />
      <ChyrBusinessMiss />
      <ChyrTryLiveDemo />
      <ChyrHylnSteps />
      <ChyrCustomizeHyln />
      <ChyrForwardCalls />
      <ChyrSecurityCompliance />
      <ChyrIntegrations />
      <ChyrFAQ />
      <ChyrReliableEmployee />
      <ChyrRevenueCTA />
    </div>
  );
}
