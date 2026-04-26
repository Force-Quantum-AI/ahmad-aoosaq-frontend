import { AVRIANCE_CONFIG, CHYR_CONFIG, NOHM_CONFIG } from "@/components/ChyrLandingPage/landingConfig";
import { useSelector } from "react-redux";

export const useBrandConfig = () => {
  const projectName = useSelector(
    (state: any) => state.projectIdentifier.projectName
  );

  if (projectName === "CHYR") return CHYR_CONFIG;
  if (projectName === "AVRIANCE") return AVRIANCE_CONFIG;
  return NOHM_CONFIG;
};