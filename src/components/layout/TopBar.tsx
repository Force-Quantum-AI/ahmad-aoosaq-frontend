import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Clock, ChevronDown, Phone } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "@/store/features/auth/auth.slice"
import { Link, useNavigate } from "react-router-dom"

export default function TopBar() {
    const navigate = useNavigate();
    const userInfo = useSelector((state: any) => state.auth.userNameImg);

    const user = {
        name: userInfo?.first_name + " " + userInfo?.last_name || "loading...",
        avatar: userInfo?.image || "https://i.pravatar.cc/40",
        lastActive: "44 mins ago",
        newMessages: 19
    }
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(logout());
    }  

    return (
        <div className="w-full flex items-center justify-between">

            {/* LEFT SECTION */}
            <div className="flex items-center gap-3 sm:gap-2 md:gap-4 xl:gap-12 2xl:gap-14">

                {/* USER */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer transition-colors hover:text-gray-300">
                            <Avatar className="h-8 w-8 lg:h-9 lg:w-9">
                                <AvatarImage src={user.avatar} className="object-cover"/>
                                <AvatarFallback>Me</AvatarFallback>
                            </Avatar>

                            <span className="font-medium hidden sm:inline-block">{user.name}</span>

                            <ChevronDown size={16} className="hidden sm:inline-block text-gray-400" />
                        </div>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="bg-black text-white border-neutral-800">
                        {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
                        <DropdownMenuItem onClick={() => navigate("/dashboard/settings")} className="cursor-pointer hover:bg-gray-800">Settings</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-gray-800">Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* LAST ACTIVE */}
                <div className="flex items-center text-sm text-gray-400 gap-2 cursor-pointer" title={user.lastActive}>
                    <Clock size={16} className="shrink-0" />
                    <span className="hidden lg:inline-block whitespace-nowrap">{user.lastActive}</span>
                </div>

                {/* FLAGGED SESSION */}
                {/* <Button
                    variant="secondary"
                    size="icon"
                    className="md:hidden flex h-8 w-8 shrink-0 items-center justify-center hover:bg-neutral-700 text-gray-400 rounded-md"
                    title="Flagged Session"
                >
                    <Flag size={16} />
                </Button>
                <Button
                    variant="secondary"
                    className="hidden md:flex items-center gap-2 hover:bg-neutral-700 text-gray-400"
                >
                    <Flag size={16} />
                    <span className="hidden lg:inline-block whitespace-nowrap">Flagged Session</span>
                </Button> */}

            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-4 sm:gap-6 xl:gap-12 2xl:gap-54">

                {/* SEARCH */}
                {/* <div className="relative flex items-center">
                    <button className="md:hidden flex h-8 w-8 shrink-0 items-center justify-center text-gray-400 hover:text-white rounded-md transition-colors">
                        <Search size={18} />
                    </button>
                    <div className="hidden md:block relative">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <Input
                            placeholder="Search"
                            className="pl-9 w-[160px] xl:w-[260px] bg-neutral-900 border-neutral-800 text-sm focus-visible:ring-1 focus-visible:ring-gray-600 focus-visible:ring-offset-0"
                        />
                    </div>
                </div> */}

                {/* MESSAGES — pill badge so it reads as a real clickable notification */}
                <Link to="/dashboard/callLogs" className="flex items-center gap-2 shrink-0">
                    {/* Mobile: icon-only with dot indicator */}
                    <div
                        className="relative md:hidden flex items-center justify-center h-8 w-8 rounded-md hover:bg-neutral-800/50 text-blue-400 cursor-pointer"
                        title={`+${user.newMessages} New Messages`}
                    >
                        <Phone size={18} />
                        <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-blue-500"></span>
                    </div>
                    {/* Desktop: styled pill badge */}
                    <button
                        className="hidden md:flex items-center gap-2 bg-blue-950/60 border border-blue-800/50 hover:bg-blue-900/60 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium px-3 py-1.5 rounded-full"
                        title="Open Messages"
                    >
                        <Phone size={16} />
                        <span className="whitespace-nowrap">Call Logs</span>
                    </button>
                </Link>
                {/* <div className="flex items-center gap-2 shrink-0">
       
                    <div
                        className="relative md:hidden flex items-center justify-center h-8 w-8 rounded-md hover:bg-neutral-800/50 text-blue-400 cursor-pointer"
                        title={`+${user.newMessages} New Messages`}
                    >
                        <Mail size={18} />
                        <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-blue-500"></span>
                    </div>
 
                    <button
                        className="hidden md:flex items-center gap-2 bg-blue-950/60 border border-blue-800/50 hover:bg-blue-900/60 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium px-3 py-1.5 rounded-full"
                        title="Open Messages"
                    >
                        <Mail size={16} />
                        <span className="whitespace-nowrap">+{user.newMessages} New Messages</span>
                    </button>
                </div> */}

            </div>

        </div>
    )
}