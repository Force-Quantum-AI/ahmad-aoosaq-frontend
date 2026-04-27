
import * as React from "react"

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { AVRIANCEIconWithoutText, CHYRIconWithoutText, NOHMIconWithoutText } from "@/assets/logo/BrandLogoNew"
import { useNavigate } from "react-router-dom"

export function TeamSwitcher({
    teams,
}: {
    teams: {
        name: string
    }
}) {
    const [activeTeam,] = React.useState(teams);
    const navigate = useNavigate();

    if (!activeTeam) {
        return null
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mb-5"
                >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground">
                        {activeTeam.name === "CHYR" ? <CHYRIconWithoutText /> : activeTeam.name === "AVRIANCE" ? <AVRIANCEIconWithoutText /> : <NOHMIconWithoutText />}
                    </div>
                    <div className="grid flex-1 text-left text-base md:text-lg xl:text-xl leading-tight" onClick={() => navigate(`/dashboard`)}>
                        <span className="truncate font-medium">{activeTeam.name}</span>
                    </div>
                </SidebarMenuButton>

            </SidebarMenuItem>
        </SidebarMenu>
    )
}
