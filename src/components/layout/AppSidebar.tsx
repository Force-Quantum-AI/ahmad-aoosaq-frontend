import * as React from "react"
import {
    Compass,
    Info,
    Smartphone,
    Puzzle,
    Settings,
    House
} from "lucide-react"


import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./TeamSwitcher"
import { NavMain } from "./NavMain"
import { NavUser } from "./NavUser"
import { useSelector } from "react-redux"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const user = useSelector((state: any) => state.auth.userNameImg);
    const projectName = useSelector((state: any) => state.projectIdentifier.projectName);
    
    const data = {
    user: {
        name: user?.first_name + " " + user?.last_name || "User name",
        email: user?.email,
        avatar: user?.image || "/avatars/shadcn.jpg",
    },
    teams:
    {
        name: projectName,
    },
    navMain: [
        {
            title: "Home",
            url: "/dashboard",
            icon: House,
        },
        {
            title: "About",
            url: "/dashboard/about",
            icon: Info,
        },
        {
            title: "Business",
            url: "/dashboard/business",
            icon: Compass,
        },
        {
            title: "Phone",
            url: "/dashboard/phone",
            icon: Smartphone,
        },
        // {
        //     title: "Call Logs",
        //     url: "/dashboard/callLogs",
        //     icon: Phone,
        // },
        {
            title: "Integrations",
            url: "/dashboard/integrations",
            icon: Puzzle,
        },
        {
            title: "Settings",
            url: "/dashboard/settings",
            icon: Settings,
        },
    ],
}
    return (
        <Sidebar collapsible="icon" {...props} >
            <SidebarHeader className="bg-black! text-white">
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent className="bg-black! text-white">
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter className="bg-black! text-white">
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
