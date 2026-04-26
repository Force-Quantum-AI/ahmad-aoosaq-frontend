import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bell, Search, LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { logout, selectUser } from "@/store/features/auth/auth.slice";
import CommonWrapper from "@/common/CommonWrapper";
import logo from "/logo.png";

const DashboardNavbar: React.FC = () => {
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const navLinks = [
        { to: "/dashboard/home", label: "Home" },
        { to: "/dashboard/about", label: "About" },
        { to: "/dashboard/business", label: "Business Info" },
        { to: "/dashboard/phone", label: "Phone" },
        { to: "/dashboard/integrations", label: "Integrations" },
        { to: "/dashboard/settings", label: "Settings" },
    ];

    return (
        <div className="w-full px-4 pt-4">
            <CommonWrapper>
                <nav className="bg-[#111111] rounded-[40px] px-6 py-3 flex items-center justify-between shadow-2xl">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-3 no-underline group">
                        <img className="w-[55px] h-[68px]" src={logo} alt="" />
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden lg:flex items-center gap-2 bg-[#1a1a1a] rounded-full p-1.5 border border-white/5">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 no-underline font-geist ${isActive
                                        ? "bg-gradient-to-r from-[#2B478B] to-[#3B5998] text-white shadow-lg shadow-blue-900/20"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-white transition-colors">
                            <Bell size={20} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-white transition-colors">
                            <Search size={20} />
                        </button>

                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="cursor-pointer ring-2 ring-transparent hover:ring-[#00E6F6]/50 rounded-full transition-all duration-300">
                                    <Avatar className="h-10 w-10 border border-white/10">
                                        <AvatarImage src={user?.profilePhoto} alt={user?.fullName} />
                                        <AvatarFallback className="bg-[#1a1a1a] text-[#00E6F6]">
                                            {user?.fullName?.[0] || <User size={20} />}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 bg-[#111111] border-white/10 p-2 mt-4 rounded-2xl shadow-2xl">
                                <div className="p-3 border-bottom border-white/5 mb-2">
                                    <p className="text-white font-semibold text-sm font-geist truncate">{user?.fullName}</p>
                                    <p className="text-gray-500 text-xs font-geist truncate">{user?.email}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5 rounded-xl gap-3"
                                    onClick={() => navigate("/dashboard/settings")}
                                >
                                    <Settings size={18} />
                                    <span>Account Settings</span>
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="w-full justify-start bg-red-600 hover:bg-red-700 text-white rounded-xl gap-3 mt-1"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={18} />
                                    <span>Sign Out</span>
                                </Button>
                            </PopoverContent>
                        </Popover>
                    </div>
                </nav>
            </CommonWrapper>
        </div>
    );
};

export default DashboardNavbar;
