// import CommonWrapper from "@/common/CommonWrapper"
import { AppSidebar } from "@/components/layout/AppSidebar"
import TopBar from "@/components/layout/TopBar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"

export default function DashboardLayout() {
  return (
    <div className="bg-black text-white">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 items-center px-4 border-b border-neutral-800">
            <SidebarTrigger className="mr-3" />

            <Separator
              orientation="vertical"
              className="mx-3 h-4"
            />

            <TopBar />
          </header>
          <div className="flex flex-1 flex-col gap-4">
            <main className="grow w-full mx-auto">
              {/* <CommonWrapper> */}
              <Outlet />
              {/* </CommonWrapper> */}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
