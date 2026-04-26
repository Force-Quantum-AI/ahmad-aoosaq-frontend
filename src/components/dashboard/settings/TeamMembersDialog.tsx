import { useState, useMemo } from "react";
import { Search, RotateCcw, Trash2, Plus, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useDeleteInvitationMemberMutation, useInviteMemberMutation } from "@/store/features/settings/settings.api";

interface TeamMember {
  id: number;
  email: string;
  role: string;
  token: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  business: number;
}

interface TeamMembersDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  teamMembers: TeamMember[];
  isLoading?: boolean;
  onRemoveMember?: (memberId: number) => Promise<void>;
  onResetPassword?: (memberId: number) => Promise<void>;
  currentUserId?: number;
}

const getRoleLabel = (role: string): string => {
  const roleMap: Record<string, string> = {
    org_admin: "Admin",
    org_member: "Member",
  };
  return roleMap[role] || role;
};

const getRoleColor = (role: string): string => {
  const colorMap: Record<string, string> = {
    org_admin: "bg-purple-50 text-purple-700",
    org_member: "bg-blue-50 text-blue-700",
    org_editor: "bg-green-50 text-green-700",
    org_viewer: "bg-gray-50 text-gray-700",
  };
  return colorMap[role] || "bg-gray-50 text-gray-700";
};

const getInitials = (email: string): string => {
  return email.charAt(0).toUpperCase();
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return "-";
  }
};

const isTokenExpired = (expiresAt: string): boolean => {
  return new Date(expiresAt) < new Date();
};

const getExpiresAt = () => {
  const now = new Date();

  // add 7 days
  now.setDate(now.getDate() + 7);

  // convert to ISO string
  const isoString = now.toISOString();
  //  gives UTC like: 2026-04-15T08:30:00.000Z

  // convert to +06:00 format (Bangladesh)
  const bdOffset = "+06:00";
  const formatted = isoString.replace("Z", bdOffset);

  return formatted;
};

// ── Invite Team Member Modal 
const InviteTeamMemberModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");

  const [inviteMember, { isLoading }] = useInviteMemberMutation();

  const handleSubmit = async () => {
    if (!email.trim()) {
      toast.error("Please fill in email fields");
      return;
    }

    const expires_at = getExpiresAt();

    try {
      await inviteMember({
        email,
        frontend_url: import.meta.env.VITE_INVITE_MEMBER_URL,
        expires_at,
        role,
      }).unwrap();

      setOpen(false);
      toast.success("Team member invited!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to invite member");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 border-none">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Invite Team Member</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1.5 block">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@company.com" className="w-full border border-gray-200 text-gray-900 placeholder:text-gray-400 text-sm rounded-xl px-4 py-3 outline-none focus:border-gray-400 transition-colors" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1.5 block">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 outline-none focus:border-gray-400 transition-colors bg-white"
            >
              <option value="org_admin">Admin</option>
              <option value="org_member">Member</option>
            </select>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={() => setOpen(false)} className="flex-1 bg-white border border-gray-200 text-gray-900 text-sm font-medium rounded-xl py-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
              Cancel
            </button>
            <button onClick={handleSubmit} className="flex-1 bg-black hover:bg-gray-900 text-white text-sm font-semibold rounded-xl py-2.5 transition-colors cursor-pointer" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Invite"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const TeamMembersDialog = ({
  open,
  setOpen,
  teamMembers = [],
  isLoading = false,
  onResetPassword,
  currentUserId,
}: TeamMembersDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [resetConfirmId, setResetConfirmId] = useState<number | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // Filter and search members
  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const matchesSearch =
        member.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole =
        roleFilter === "all" || member.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [teamMembers, searchQuery, roleFilter]);

  // Handle remove member
  const [deleteMember, { isLoading: isDeleting }] = useDeleteInvitationMemberMutation();
  const handleRemoveMember = async (memberId: number) => {
    try {
      await deleteMember(memberId);
      toast.success("Member removed successfully");
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    }
  };

  // Handle reset password
  const handleResetPassword = async (memberId: number) => {
    if (!onResetPassword) {
      toast.error("Reset password functionality not available");
      return;
    }

    setIsResetting(true);
    try {
      await onResetPassword(memberId);
      toast.success("Password reset email sent");
      setResetConfirmId(null);
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to send password reset");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-5xl! bg-white rounded-2xl shadow-xl p-6 lg:p-8 border-none">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Team Members
              </h2>
              <p className="text-sm text-gray-500 pr-6">
                Invite team members to collaborate on your agents and manage
                calls together.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 mt-4">
            {/* Search and Action Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full flex-1">
                {/* Search Input */}
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 flex-1 max-w-md focus-within:border-gray-400 transition-colors">
                  <Search className="text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by email"
                    className="flex-1 bg-transparent border-none outline-none ml-2 text-sm text-gray-900 placeholder:text-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Role Filter */}
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-32 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl h-auto py-2.5 px-4 outline-none focus:ring-0 focus:ring-offset-0 focus:border-gray-400">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 text-gray-900 rounded-xl shadow-lg">
                    <SelectItem
                      value="all"
                      className="focus:bg-gray-100 focus:text-gray-900 cursor-pointer hover:bg-gray-100"
                    >
                      All
                    </SelectItem>
                    <SelectItem
                      value="org_admin"
                      className="focus:bg-gray-100 focus:text-gray-900 cursor-pointer hover:bg-gray-100"
                    >
                      Admin
                    </SelectItem>
                    <SelectItem
                      value="org_member"
                      className="focus:bg-gray-100 focus:text-gray-900 cursor-pointer hover:bg-gray-100"
                    >
                      Member
                    </SelectItem>
                    <SelectItem
                      value="org_editor"
                      className="focus:bg-gray-100 focus:text-gray-900 cursor-pointer hover:bg-gray-100"
                    >
                      Editor
                    </SelectItem>
                    <SelectItem
                      value="org_viewer"
                      className="focus:bg-gray-100 focus:text-gray-900 cursor-pointer hover:bg-gray-100"
                    >
                      Viewer
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <button
                onClick={() => setInviteOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-900 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                <Plus size={16} />
                Invite User
              </button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={32} className="text-gray-400 animate-spin" />
              </div>
            )}

            {/* Empty State */}
            {!isLoading && teamMembers.length === 0 && (
              <div className="bg-gray-50 rounded-xl p-12 text-center">
                <p className="text-gray-500">No team members found</p>
              </div>
            )}

            {/* Member List */}
            {!isLoading && filteredMembers.length === 0 && teamMembers.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-12 text-center">
                <p className="text-gray-500">No members match your search</p>
              </div>
            )}

            {!isLoading && filteredMembers.length > 0 && (
              <div className="flex flex-col gap-2">
                {filteredMembers.map((member) => {
                  const tokenExpired = isTokenExpired(member.expires_at);
                  const isCurrentUser = currentUserId === member.id;

                  return (
                    <div
                      key={member.id}
                      className={`bg-white border rounded-xl p-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 transition-colors ${tokenExpired
                          ? "border-red-200 hover:border-red-300 bg-red-50/30"
                          : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      {/* Email Section */}
                      <div className="flex flex-col gap-1 min-w-[200px] flex-1">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 lg:hidden">
                          Email
                        </p>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold shrink-0"
                          >
                            {getInitials(member.email)}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-900 text-sm font-medium">
                                {member.email}
                              </span>
                              {isCurrentUser && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium uppercase tracking-wider">
                                  You
                                </span>
                              )}
                            </div>
                            {tokenExpired && (
                              <span className="text-red-600 text-xs font-medium">
                                Token expired
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Role Section */}
                      <div className="flex flex-col gap-1 w-24">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 lg:hidden">
                          Role
                        </p>
                        <span
                          className={`text-sm font-medium rounded px-3 py-1 w-fit ${getRoleColor(
                            member.role
                          )}`}
                        >
                          {getRoleLabel(member.role)}
                        </span>
                      </div>

                      {/* Last Active Section */}
                      <div className="flex flex-col gap-1 w-32">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 lg:hidden">
                          Added
                        </p>
                        <span className="text-sm text-gray-700">
                          {formatDate(member.created_at)}
                        </span>
                      </div>

                      {/* Actions Section */}
                      <div className="flex flex-col gap-1">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 lg:hidden">
                          Actions
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setResetConfirmId(member.id)}
                            disabled={isCurrentUser || isResetting}
                            className="p-2 text-gray-500 hover:text-black bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Reset Password"
                          >
                            <RotateCcw size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(member.id)}
                            disabled={isCurrentUser || isDeleting}
                            className="p-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-transparent hover:border-red-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Remove Member"
                          >
                            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent className="w-full max-w-md! bg-white rounded-2xl shadow-xl p-6 lg:p-8 border-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this team member? They will no
              longer have access to your workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirmId) {
                  handleRemoveMember(deleteConfirmId);
                }
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Confirmation Dialog */}
      <AlertDialog
        open={resetConfirmId !== null}
        onOpenChange={(open) => !open && setResetConfirmId(null)}
      >
        <AlertDialogContent className="w-full max-w-md! bg-white rounded-2xl shadow-xl p-6 lg:p-8 border-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Password</AlertDialogTitle>
            <AlertDialogDescription>
              Send a password reset email to this team member?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (resetConfirmId) {
                  handleResetPassword(resetConfirmId);
                }
              }}
              disabled={isResetting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isResetting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Email"
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <InviteTeamMemberModal
        open={inviteOpen}
        setOpen={setInviteOpen}
      />
    </>
  );
};

export default TeamMembersDialog;