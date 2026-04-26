import React, { useState, useEffect } from "react";
import { Activity, ChevronDown, DollarSign, House, LogOut, Menu, Phone, TrendingUp, TvMinimal, Users, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hook";
import { logout } from "@/store/features/auth/auth.slice";

const navLinks = [
    { scrollTo: "home", label: "Overview", icon: <House size={20} /> },
    { scrollTo: "revenue", label: "Revenue", icon: <DollarSign size={20} /> },
    { scrollTo: "clients", label: "Clients", icon: <Users size={20} /> },
    { scrollTo: "usage", label: "Usage", icon: <Phone size={20} /> },
    { scrollTo: "trials", label: "Trials", icon: <Activity size={20} /> },
    { scrollTo: "system", label: "System", icon: <TvMinimal size={20} /> },
    { scrollTo: "profit", label: "Profit", icon: <TrendingUp size={20} /> },
];

export const SuperAdminSidebar: React.FC = () => {
    const [activeTab, setActiveTab] = useState("home");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        setIsMobileMenuOpen(false);
        navigate("/login");
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setActiveTab(id);
            setIsMobileMenuOpen(false); // Close mobile menu after selection
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveTab(entry.target.id);
                    }
                });
            },
            { threshold: 0.3, rootMargin: "-100px 0px -50% 0px" }
        );

        navLinks.forEach(({ scrollTo }) => {
            const el = document.getElementById(scrollTo);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const activeLabel = navLinks.find(l => l.scrollTo === activeTab)?.label || "Menu";

    return (
        <>
            {/* MOBILE HEADER */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0f1423]/60 backdrop-blur-[20px] border-b border-white/5 z-100 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <Link to="/super-admin" className="w-8 h-8 rounded-lg bg-linear-to-br from-[#10b981] to-[#06b6d4] flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-[#10b98110]">
                        S
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="flex items-center gap-2 text-gray-200 font-medium text-sm cursor-pointer"
                    >
                        {activeLabel}
                        <ChevronDown size={16} className={`transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-[#64748B] hover:text-white cursor-pointer"
                >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* MOBILE DROPDOWN MENU */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-16 bg-[#0f1423]/60 backdrop-blur-[20px] z-90 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <button
                                key={link.scrollTo}
                                onClick={() => scrollToSection(link.scrollTo)}
                                className={`flex items-center gap-2 p-2 rounded-2xl transition-all cursor-pointer ${activeTab === link.scrollTo
                                    ? "bg-[#10b98115] text-[#10b981] font-semibold"
                                    : "text-[#64748B] hover:text-gray-200 hover:bg-white/5"
                                    }`}
                            >
                                <span className="text-xl">{link.icon}</span>
                                <span>{link.label}</span>
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="mt-4 flex items-center gap-2 p-2 rounded-2xl text-[#f87171] hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}

            {/* DESKTOP SIDEBAR */}
            <div className="hidden lg:flex w-17.5 bg-[#0f1423]/60 backdrop-blur-[20px] border-r border-white/5 flex-col items-center py-6 h-screen fixed left-0 top-0 z-50">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#10b981] to-[#06b6d4] flex items-center justify-center font-bold text-white shadow-lg shadow-[#10b98120] mb-10">
                    S
                </div>

                <div className="flex flex-col gap-2 flex-1 w-full items-center">
                    {navLinks.map((link) => {
                        const isActive = activeTab === link.scrollTo;
                        return (
                            <button
                                key={link.scrollTo}
                                onClick={() => scrollToSection(link.scrollTo)}
                                title={link.label}
                                className={`relative p-3 rounded-xl transition-all duration-300 group cursor-pointer text-xl ${isActive
                                    ? "bg-[#10B98126] text-[#10B981]"
                                    : "opacity-60 hover:opacity-100 hover:bg-white/5"
                                    }`}
                            >
                                <span>{link.icon}</span>
                                {/* 
                                {isActive && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#10b981] rounded-l-full shadow-[0_0_8px_#10b981]" />
                                )} */}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-auto pb-2">
                    <button
                        type="button"
                        onClick={handleLogout}
                        title="Logout"
                        className="p-3 rounded-xl text-[#f87171] opacity-80 hover:opacity-100 hover:bg-red-500/10 transition-all cursor-pointer"
                    >
                        <LogOut size={22} />
                    </button>
                </div>
            </div>
        </>
    );
};
