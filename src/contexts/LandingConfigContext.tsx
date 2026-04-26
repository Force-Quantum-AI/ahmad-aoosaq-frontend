import React, { createContext, useContext, useState } from "react";
import { CHYR_CONFIG, AVRIANCE_CONFIG, NOHM_CONFIG, BaseBrandVariables, setBrand as setGlobalBrand } from "../components/ChyrLandingPage/landingConfig";

export type BrandType = "CHYR" | "AVRIANCE" | "NOHM";

interface LandingConfigContextType {
  brand: BrandType;
  config: BaseBrandVariables;
  setBrand: (brand: BrandType) => void;
}

const LandingConfigContext = createContext<LandingConfigContextType | undefined>(undefined);

export const LandingConfigProvider: React.FC<{
  children: React.ReactNode;
  initialBrand: BrandType;
}> = ({ children, initialBrand }) => {
  const [brand, setBrand] = useState<BrandType>(initialBrand);

  React.useEffect(() => {
    setBrand(initialBrand);
  }, [initialBrand]);

  React.useEffect(() => {
    setGlobalBrand(brand);
  }, [brand]);

  const config = brand === "CHYR" ? CHYR_CONFIG : brand === "AVRIANCE" ? AVRIANCE_CONFIG : NOHM_CONFIG;

  return (
    <LandingConfigContext.Provider value={{ brand, config, setBrand }}>
      {children}
    </LandingConfigContext.Provider>
  );
};

export const useLandingConfig = () => {
  const context = useContext(LandingConfigContext);
  if (!context) {
    throw new Error("useLandingConfig must be used within a LandingConfigProvider");
  }
  return context;
};
