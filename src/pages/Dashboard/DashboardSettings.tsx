import React, { useState } from "react";
import {
    X,
    Bell,
    Pencil,
    LogOut
} from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import ChangePasswordDialog from "@/components/dashboard/settings/ChangePasswordDialog";
import TeamMembersDialog from "@/components/dashboard/settings/TeamMembersDialog";
import PageHeader from "@/common/PageHeader";
import TestCallPopup from "@/components/dashboard/TestCallPopup";
import { useGetAllInvitationMemberQuery } from "@/store/features/settings/settings.api";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch } from "react-redux";
import { logout } from "@/store/features/auth/auth.slice";
import Billing from "@/components/dashboard/settings/Billing";
import Account from "@/components/dashboard/settings/Account";
import DeleteAccountModal from "@/components/dashboard/settings/DeleteAccountModal";

// ── Shared primitives  

export const DarkCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-[#111111] border border-white/8 rounded-2xl p-6 ${className}`}>
        {children}
    </div>
);



export const DarkButton = ({
    children,
    onClick,
    className = "",
    variant = "default",
}: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: "default" | "blue" | "danger";
}) => {
    const base = "flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-colors cursor-pointer";
    const variants = {
        default: "bg-[#1e1e1e] hover:bg-[#282828] border border-white/10 text-white",
        blue: "bg-blue-600 hover:bg-blue-500 text-white",
        danger: "bg-transparent border border-red-600/60 hover:bg-red-600/10 text-red-500",
    };
    return (
        <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
};

// ── Toggle  
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <div
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors shrink-0 ${checked ? "bg-blue-600" : "bg-[#333]"}`}
    >
        <div
            className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
    </div>
);



// ── Generate API Key Modal   
const GenerateKeyModal = ({
    open,
    setOpen,
    onGenerate,
}: {
    open: boolean;
    setOpen: (v: boolean) => void;
    onGenerate: (label: string) => void;
}) => {
    const [label, setLabel] = useState("");

    const handleSubmit = () => {
        onGenerate(label || "New Key");
        setLabel("");
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 border-none">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate New API Key</h2>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm text-gray-600 mb-1.5 block">Key Label (optional)</label>
                        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Production" className="w-full border border-gray-200 text-gray-900 placeholder:text-gray-400 text-sm rounded-xl px-4 py-3 outline-none focus:border-gray-400 transition-colors" />
                    </div>
                    <div className="flex gap-3 pt-1">
                        <button onClick={() => setOpen(false)} className="flex-1 bg-white border border-gray-200 text-gray-900 text-sm font-medium rounded-xl py-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} className="flex-1 bg-black hover:bg-gray-900 text-white text-sm font-semibold rounded-xl py-2.5 transition-colors cursor-pointer">
                            Generate
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// ── Confirm Danger Modal   ──
const ConfirmDangerModal = ({
    open,
    setOpen,
    action,
    onConfirm,
}: {
    open: boolean;
    setOpen: (v: boolean) => void;
    action: string;
    onConfirm: () => void;
}) => (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 border-none text-gray-900">
            <h2 className="text-lg font-semibold text-red-600 mb-2">{action}</h2>
            <p className="text-gray-600 text-sm mb-6">
                This action is <span className="text-gray-900 font-medium">irreversible</span>. Are you sure you want to continue?
            </p>
            <div className="flex gap-3">
                <button onClick={() => setOpen(false)} className="flex-1 bg-white border border-gray-200 text-gray-900 text-sm font-medium rounded-xl py-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
                    Cancel
                </button>
                <button
                    onClick={() => { onConfirm(); setOpen(false); toast.error(`${action} completed.`); }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl py-2.5 transition-colors cursor-pointer"
                >
                    Confirm
                </button>
            </div>
        </DialogContent>
    </Dialog>
);


interface ApiKey {
    id: string;
    label: string;
    prefix: string;
    suffix: string;
    visible: boolean;
}

// ── Main Settings Component 
const DashboardSettings: React.FC = () => {
    // Account
    const [isEditing, setIsEditing] = useState(false);

    const dispatch = useDispatch();

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    // Notifications
    const [emailNotifications, setEmailNotifications] = useState(false);

    // Modals
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
    const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
    const [isGenerateKeyModalOpen, setIsGenerateKeyModalOpen] = useState(false);
    const [dangerAction, setDangerAction] = useState<string | null>(null);

    // Team Members
    const { data: teamMembers, isLoading: isLoadingTeamMembers } = useGetAllInvitationMemberQuery({});

    // API Keys
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([
        { id: "1", label: "Live key", prefix: "sk_live_", suffix: "4a8f", visible: false },
        { id: "2", label: "Test key", prefix: "sk_test_", suffix: "4a8f", visible: false },
        { id: "3", label: "Webhook", prefix: "wh_live_", suffix: "4a8f", visible: false },
    ]);

    const handleGenerateKey = (label: string) => {
        const newKey: ApiKey = {
            id: Date.now().toString(),
            label,
            prefix: "sk_live_",
            suffix: Math.random().toString(36).slice(-4),
            visible: false,
        };
        setApiKeys((prev) => [...prev, newKey]);
        console.log(apiKeys);

        toast.success("New API key generated");
        console.log(isEditing);
        setIsEditing(false);
        
    };

    return (
        <div className="min-h-screen bg-black text-white px-4 md:px-6 py-6">
            <PageHeader
                onRefresh={() => console.log("Refreshed")}
                onSave={() => console.log("Saved")}
                actionRows={[
                    // Row 2: Secondary Action
                    <button className="flex items-center justify-center md:justify-start gap-2 text-red-600  bg-red-500/20 hover:bg-red-500/30 px-4 py-2.5 rounded-xl text-sm border border-white/5 w-full md:w-auto"
                     onClick={()=> dispatch(logout())}
                    >
                        <LogOut size={16} /> Sign out
                    </button>,

                    // Row 1: Primary Action
                    <button className="bg-[#1877F2] text-white px-8 py-2.5 rounded-xl font-medium w-full md:w-auto" onClick={() => setIsPopupOpen(true)}>
                        Test Your Agent
                    </button>


                ]}
            >
                {/* Left Side Content */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-semibold text-white tracking-tight">Welcome back, Sazzy</h1>
                    <button className="text-white text-xl font-medium  flex items-center gap-2">
                        Configure <span className="text-yellow-500 underline hover:cursor-pointer hover:text-yellow-400">Luxe Home Services Assistant</span><Pencil size={18} />
                    </button>

                </div>
            </PageHeader>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* ══ LEFT COLUMN     */}
                <div className="flex flex-col gap-4">

                    {/* Account */}
                    <DarkCard>

                        <Account/>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-gray-500 text-xs mb-1.5 block">Security</label>
                                <div className="flex items-center justify-between bg-[#1a1a1a] border border-white/8 rounded-xl px-4 py-3">
                                    <span className="text-white text-sm">Password & MFA</span>
                                    <DarkButton onClick={() => setIsPasswordDialogOpen(true)}>Manage</DarkButton>
                                </div>
                            </div>
                        </div>
                    </DarkCard>

                    {/* Team Members */}
                    <DarkCard>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-white text-lg font-semibold">Team Members</h2>
                            <DarkButton onClick={() => setIsTeamDialogOpen(true)}>Manage</DarkButton>
                        </div>
                        <p className="text-gray-500 text-sm mb-5">
                            Invite team members to collaborate on your agents and manage calls together.
                        </p>

                        <div className="flex flex-col gap-2 mb-4">
                            {isLoadingTeamMembers ? (
                                <div className="space-y-2 p-2">
                                    <Skeleton className="w-full h-12 rounded-xl bg-gray-600"/>
                                    <Skeleton className="w-full h-12 rounded-xl bg-gray-600"/>
                                    <Skeleton className="w-full h-12 rounded-xl bg-gray-600"/>
                                </div>):
                            teamMembers?.map((member: any) => (
                                <div key={member.id} className="flex items-center gap-3 py-3 border-b border-white/6 last:border-0">
                                    {/* Avatar */}
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
                                        {member.email.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {/* <p className="text-white text-sm font-medium truncate">{member.name}</p> */}
                                        <p className="text-gray-500 text-xs truncate">{member.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs bg-[#1e1e1e] border border-white/10 text-gray-300 px-2.5 py-1 rounded-lg">
                                            {member.role}
                                        </span>
                                        {member.role !== "org_member" && (
                                            <button className="text-gray-600 hover:text-red-400 transition-colors">
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DarkCard>

                    {/* API Keys */}
                    {/* <DarkCard>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-white text-lg font-semibold">API Keys</h2>
                            <DarkButton onClick={() => setIsGenerateKeyModalOpen(true)} variant="blue">
                                <RefreshCw size={13} />
                                Generate New
                            </DarkButton>
                        </div>
                        <p className="text-gray-500 text-sm mb-5">Use API Keys to integrate with your systems</p>

                        <div className="flex flex-col gap-2">
                            {apiKeys.map((key) => (
                                <div key={key.id} className="grid items-center gap-3 bg-[#1a1a1a] border border-white/6 rounded-xl px-4 py-3" style={{ gridTemplateColumns: '5rem 1fr auto' }}>
                                    <span className="text-gray-500 text-xs font-medium shrink-0">{key.label}</span>

                                    <span className="text-white text-sm font-mono truncate">
                                        {key.prefix}••••••••••{key.suffix}
                                    </span>

                                    <div className="flex items-center gap-2.5">
                                        <button
                                            onClick={() => toggleKeyVisibility(key.id)}
                                            className="text-gray-500 hover:text-white transition-colors p-1"
                                            title={key.visible ? "Hide" : "Show"}
                                        >
                                            {key.visible ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                        <button
                                            onClick={() => handleCopy(`${key.prefix}••••••••••${key.suffix}`)}
                                            className="text-xs bg-[#252525] border border-white/8 hover:bg-[#2e2e2e] text-gray-300 px-2.5 py-1 rounded-lg transition-colors"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DarkCard> */}
                </div>

                {/* ══ RIGHT COLUMN ═════════════════════════════════════════════════ */}
                <div className="flex flex-col gap-4">

                    {/* Billing */}
                    <Billing />

                    {/* Notifications */}
                    <DarkCard>
                        <h2 className="text-white text-lg font-semibold mb-5">Notifications</h2>

                        <div className="flex flex-col gap-4">
                            {/* Email toggle */}
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-white text-sm font-medium">Email after every call</p>
                                    <p className="text-gray-500 text-xs mt-1 max-w-[280px] leading-relaxed">
                                        Get notified with caller details and intake and after each completed call
                                    </p>
                                </div>
                                <Toggle checked={emailNotifications} onChange={() => setEmailNotifications((v) => !v)} />
                            </div>

                            {/* Coming soon tiles — same width as the email toggle row above */}
                            <div className="grid grid-cols-2 gap-3 mt-1 w-full">
                                {[
                                    { label: "SMS alerts" },
                                    { label: "Weekly summary" },
                                ].map(({ label }) => (
                                    <div key={label} className="bg-[#1a1a1a] border border-white/6 rounded-xl p-4 flex flex-col items-center gap-3">
                                        <div className="flex items-center gap-1.5 text-gray-100 text-sm font-medium">
                                            <Bell size={16} />
                                            {label}
                                        </div>
                                        {/* Neutral gray tag — reads as 'not available yet', not 'warning' */}
                                        <span className="text-gray-500 text-xs font-medium bg-[#1e1e1e] border border-white/10 px-2.5 py-1 rounded-lg">Coming Soon</span>
                                        <button className="text-xs bg-[#1e2a3a] border border-blue-600/30 text-blue-400 hover:bg-blue-600/20 px-3 py-1.5 rounded-lg transition-colors">
                                            Notify me
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DarkCard>

                    {/* Danger Zone */}
                    <DarkCard className="border-red-900/30">
                        <h2 className="text-red-500 text-lg font-semibold mb-1">Danger Zone</h2>
                        <p className="text-red-600/70 text-sm mb-5">Irreversible actions</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setDangerAction("Cancel Subscription")}
                                className="border border-red-600/40 hover:bg-red-600/10 text-red-500 text-sm font-medium py-3 rounded-xl transition-colors"
                            >
                                Cancel Subscription
                            </button>
                            <button
                                onClick={() => setIsDeleteAccountOpen(true)}
                                className="border border-red-600/40 hover:bg-red-600/10 text-red-500 text-sm font-medium py-3 rounded-xl transition-colors"
                            >
                                Delete Account
                            </button>
                        </div>
                    </DarkCard>
                </div>
            </div>

            {/* ── Modals   ──── */}
            <ChangePasswordDialog open={isPasswordDialogOpen} setOpen={setIsPasswordDialogOpen} />
            <TeamMembersDialog open={isTeamDialogOpen} setOpen={setIsTeamDialogOpen} teamMembers={teamMembers} />
            <GenerateKeyModal
                open={isGenerateKeyModalOpen}
                setOpen={setIsGenerateKeyModalOpen}
                onGenerate={handleGenerateKey}
            />
            {dangerAction && (
                <ConfirmDangerModal
                    open={!!dangerAction}
                    setOpen={(v) => !v && setDangerAction(null)}
                    action={dangerAction}
                    onConfirm={() => setDangerAction(null)}
                />
            )}
            {isPopupOpen && <TestCallPopup onClose={() => setIsPopupOpen(false)} />}
            <DeleteAccountModal open={isDeleteAccountOpen} onOpenChange={setIsDeleteAccountOpen} />
        </div>
    );
};

export default DashboardSettings;