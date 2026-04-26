import { AVRIANCEIcon, CHYRIcon, NOHMIcon } from "@/assets/logo/BrandLogoNew";
import { useLandingConfig } from "@/contexts/LandingConfigContext";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const { config } = useLandingConfig();
  const navigate = useNavigate();
  return (
    <footer className="bg-[#212a31] text-white py-2">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center md:justify-between  items-center min-h-16">

          {/* Logo */}
          <div className="flex flex-col md:flex-row items-center gap-3 xl:gap-5">
            <div className="mr-3 md:mr-0" onClick={() => navigate("/")}>
              {/* <img src={config.assets.phoneUILogo} alt="Logo" className="h-full w-full object-contain" /> */}
              {config.brandName === "Chyr" && <CHYRIcon />}
              {config.brandName === "Avriance" && <AVRIANCEIcon />}
              {config.brandName === "Nohm" && <NOHMIcon />}
            </div>
            <span className="hidden md:block text-[10px] md:text-xs ">Smart voice agents for your business.</span>
          </div>


          {/* Desktop Menu */}
          <div className="mb-1 flex flex-col md:flex-row items-center gap-1 md:gap-4 2xl:gap-8 text-white text-xs md:text-sm">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms of Services</Link>
            <Link to="/login">@ 2026 {config.brandName}. All rights reserved.</Link>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
