import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, selectUser } from "@/store/features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import CommonWrapper from "@/common/CommonWrapper";
import BookDemoModal from "@/pages/BookDemoModal";
import { useLandingConfig } from "@/contexts/LandingConfigContext";
import { AVRIANCEIcon, CHYRIcon, NOHMIcon } from "@/assets/logo/BrandLogoNew";


const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isBookModalOpen, setIsBookModalOpen] = useState(false);
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const { config } = useLandingConfig();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <>
            <nav
                style={{
                    borderBottom: "1px solid #2F2F2F",
                    backdropFilter: "blur(6px)",
                    width: "100%",
                }}
                className="fixed top-0 left-0 z-50"
            >
                <CommonWrapper className="!py-0">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                        className="h-14 md:h-18"
                    >
                        {/* Logo */}
                        <Link
                            to="/"
                            className=""
                        >
                            {/* <img src={config.assets.phoneUILogo} alt="logo" className={
                                config.brandName === "AVRIANCE" ? "h-18" : "h-14"
                            } /> */}

                            {config.brandName === "Chyr" && <CHYRIcon />}
                            {config.brandName === "Avriance" && <AVRIANCEIcon />}
                            {config.brandName === "Nohm" && <NOHMIcon />}

                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex" style={{ alignItems: "center", gap: "32px" }}>
                            <Link
                                to="/contact"
                                style={{
                                    color: "#FFF",
                                    fontFamily: "Geist, sans-serif",
                                    fontSize: "16px",
                                    fontWeight: 400,
                                    textDecoration: "none",
                                    lineHeight: "normal",
                                    opacity: 0.85,
                                }}
                                className="hover:opacity-100 hover:text-blue-100! transition-all duration-500!"
                            >
                                Contact Us
                            </Link>

                            {user ? (
                                <div className="flex items-center gap-8">
                                    <button
                                        onClick={() => navigate("/dashboard")}
                                        style={{
                                            color: "#FFF",
                                            fontFamily: "Geist, sans-serif",
                                            fontSize: "16px",
                                            fontWeight: 400,
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            lineHeight: "normal",
                                            opacity: 0.85,
                                        }}
                                        className="hover:opacity-100 hover:text-blue-100! transition-all duration-500!"
                                    >
                                        Dashboard
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            color: "#FFF",
                                            fontFamily: "Geist, sans-serif",
                                            fontSize: "16px",
                                            fontWeight: 400,
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            lineHeight: "normal",
                                            opacity: 0.85,
                                        }}
                                        className="hover:opacity-100 hover:text-blue-100! transition-all duration-500!"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    style={{
                                        color: "#FFF",
                                        fontFamily: "Geist, sans-serif",
                                        fontSize: "16px",
                                        fontWeight: 400,
                                        textDecoration: "none",
                                        lineHeight: "normal",
                                        opacity: 0.85,
                                    }}
                                    className="hover:opacity-100 hover:text-blue-100! transition-all duration-500!"
                                >
                                    Login
                                </Link>
                            )}

                            {/* Book a Demo Button */}
                            <button
                                onClick={() => setIsBookModalOpen(true)}
                                style={{
                                    padding: "10px 20px",
                                    borderRadius: "14px",
                                    background: "#FFF",
                                    boxShadow: "0 4px 6px 0 rgba(255, 255, 255, 0.19)",
                                    color: "#000",
                                    fontFamily: "Geist, sans-serif",
                                    fontSize: "16px",
                                    fontWeight: 500,
                                    textDecoration: "none",
                                    lineHeight: "normal",
                                    display: "inline-block",
                                }}
                                className="hover:opacity-100 hover:bg-blue-100! hover:cursor-pointer transition-all duration-500!"
                            >
                                Book a Demo
                            </button>
                        </div>

                        {/* Mobile Hamburger */}
                        <div className="md:hidden">
                            <button
                                // onClick={() => setIsOpen((prev) => !prev)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#FFF",
                                    padding: "4px",
                                }}
                            >
                                {/* <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                    )}
                                </svg> */}
                                <button
                                    onClick={() => setIsBookModalOpen(true)}
                                    className={`${config.colors.brandColor} hover:opacity-90`}
                                    style={{
                                        padding: "5px 14px",
                                        borderRadius: "10px",
                                        color: "#FFF",
                                        fontFamily: "Geist, sans-serif",
                                        fontSize: "13px",
                                        fontWeight: 500,
                                        textDecoration: "none",
                                        textAlign: "center",
                                        display: "block",
                                    }}
                                >
                                    Book a Demo
                                </button>
                            </button>
                        </div>
                    </div>
                </CommonWrapper>

                {/* Mobile Menu */}
                {isOpen && (
                    <div
                        style={{
                            borderTop: "1px solid #2F2F2F",
                            padding: "16px 20px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                            background: "#000",
                        }}
                    >
                        <Link
                            to="/contact"
                            onClick={() => setIsOpen(false)}
                            style={{
                                color: "#FFF",
                                fontFamily: "Geist, sans-serif",
                                fontSize: "16px",
                                fontWeight: 400,
                                textDecoration: "none",
                            }}
                        >
                            Contact Us
                        </Link>
                        {user ? (
                            <button
                                onClick={handleLogout}
                                style={{
                                    color: "#FFF",
                                    fontFamily: "Geist, sans-serif",
                                    fontSize: "16px",
                                    fontWeight: 400,
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    padding: 0,
                                }}
                            >
                                Logout
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                style={{
                                    color: "#FFF",
                                    fontFamily: "Geist, sans-serif",
                                    fontSize: "16px",
                                    fontWeight: 400,
                                    textDecoration: "none",
                                }}
                            >
                                Login
                            </Link>
                        )}
                        <button
                            onClick={() => setIsBookModalOpen(true)}
                            className="hover:bg-gray-200"
                            style={{
                                padding: "10px 20px",
                                borderRadius: "14px",
                                background: "#FFF",
                                boxShadow: "0 4px 6px 0 rgba(255, 255, 255, 0.19)",
                                color: "#000",
                                fontFamily: "Geist, sans-serif",
                                fontSize: "16px",
                                fontWeight: 500,
                                textDecoration: "none",
                                textAlign: "center",
                                display: "block",
                            }}
                        >
                            Book a Demo
                        </button>
                    </div>
                )}
            </nav>
            <BookDemoModal open={isBookModalOpen} setOpen={setIsBookModalOpen} />
        </>
    );
};

export default Navbar;
