import BusinessMiss from "@/components/landingPage/BusinessMiss";
import CustomizeHyln from "@/components/landingPage/CustomizeHyln";
import FAQ from "@/components/landingPage/FAQ";
import ForwardCalls from "@/components/landingPage/ForwardCalls";
import Hero from "@/components/landingPage/Hero";
import HylnSteps from "@/components/landingPage/HylnSteps";
import Integrations from "@/components/landingPage/Integrations";
import ReliableEmployee from "@/components/landingPage/ReliableEmployee";
import RevenueCTA from "@/components/landingPage/RevenueCTA";
import SecurityCompliance from "@/components/landingPage/SecurityCompliance";
import TryLiveDemo from "@/components/landingPage/TryLiveDemo";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      delay: 200
    });
    AOS.refresh();
  }, []);
  return (
    <div>
      <Hero />
      <BusinessMiss />
      <TryLiveDemo />
      <HylnSteps />
      <CustomizeHyln />
      <ForwardCalls />
      <SecurityCompliance />
      <Integrations />
      <FAQ />
      <ReliableEmployee />
      <RevenueCTA />
    </div>
  );
};

export default Home;
