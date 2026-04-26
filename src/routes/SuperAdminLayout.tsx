import React from "react";
import { Outlet } from "react-router-dom";
import { SuperAdminSidebar } from "@/components/SuperAdmin/SuperAdminSidebar";

const SuperAdminLayout: React.FC = () => {
    return (
        <div className="flex min-h-screen bg-[#080c14] text-gray-200 w-full">
            {/* Fixed Sidebar */}
            <div className="fixed inset-y-0 left-0 z-50">
                <SuperAdminSidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 md:ml-[70px] flex flex-col min-h-screen overflow-x-hidden">
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SuperAdminLayout;
