import GreetingAndLiveTransfer from "@/components/dashboard/DashboardComponent/AboutPageComponent/GreetingAndLiveTransfer";
import LanguageSettingsSection from "@/components/dashboard/DashboardComponent/AboutPageComponent/LanguageSettingsSection";
import VoiceSection from "@/components/dashboard/DashboardComponent/AboutPageComponent/VoiceSection";

export default function DashboardAboutPage() {
  return (
    <div className="">
      <VoiceSection />
      <LanguageSettingsSection />
      <GreetingAndLiveTransfer />
    </div>
  );
}
