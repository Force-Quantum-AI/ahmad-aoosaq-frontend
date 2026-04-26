import React, { useState } from "react";
import BaseDialog from "@/common/BaseDialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import RevokeInviteDialog from "./RevokeInviteDialog";

interface InviteUserDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    revokedUserEmail: string;
    setRevokedUserEmail: (email: string) => void;
}

const InviteUserDialog: React.FC<InviteUserDialogProps> = ({ open, setOpen, revokedUserEmail, setRevokedUserEmail }: {
    open: boolean;
    setOpen: (open: boolean) => void;
    revokedUserEmail: string;
    setRevokedUserEmail: (email: string) => void;
}) => {
    const [revokeOpen, setRevokeOpen] = useState(false);

    return (
        <>
            <BaseDialog
                open={open}
                setOpen={setOpen}
                title="Invite user"
                description={
                    <span className="text-[#9E9E9E] text-xs md:text-sm ">
                        An invitation will be sent to this email address with a link to complete their account.
                    </span>
                }
                maxWidth="md"
                className="w-[660px] max-w-[95vw]"
            >
                <div className="flex flex-col gap-8 py-4 w-full">
                    {/* Email Address */}
                    <div className="flex flex-col gap-3">
                        <label className="text-[#000] font-geist text-sm md:text-base font-normal leading-normal">
                            Email address
                        </label>
                        <input
                            type="email"
                            placeholder="Enter an address"
                            onChange={(e) => setRevokedUserEmail(e.target.value)}
                            className="w-full p-5 bg-[#F2F4F5] rounded-[20px] text-black font-geist text-xl font-normal placeholder:text-[#9E9E9E] outline-none border-none"
                        />
                    </div>

                    {/* Role */}
                    <div className="flex flex-col gap-3">
                        <label className="text-[#000] font-geist text-sm md:text-base font-normal leading-normal">
                            Role
                        </label>
                        <Select defaultValue="member">
                            <SelectTrigger className="w-full bg-[#F2F4F5] border-none rounded-[20px] p-5 h-auto font-geist text-xl font-normal text-black shadow-none focus:ring-0 focus:ring-offset-0 [&>svg]:size-6">
                                <SelectValue placeholder="Member" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[20px] bg-white border-none shadow-xl">
                                {/* <SelectItem value="admin" className="font-geist text-lg cursor-pointer">Admin</SelectItem> */}
                                <SelectItem value="member" className="font-geist text-lg cursor-pointer">Member</SelectItem>
                                <SelectItem value="editor" className="font-geist text-lg cursor-pointer">Editor</SelectItem>
                                <SelectItem value="viewer" className="font-geist text-lg cursor-pointer">Viewer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                        <button
                            onClick={() => setOpen(false)}
                            className="w-full sm:w-auto px-12 py-2 border border-[#212121] rounded-xl font-geist text-sm font-normal text-[#000] hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => setRevokeOpen(true)}
                            className="w-full sm:w-auto px-12 py-2 bg-[#212121] rounded-xl font-geist text-sm font-normal text-white hover:opacity-90 transition-opacity cursor-pointer"
                        >
                            Manage
                        </button>
                    </div>
                </div>
            </BaseDialog>
            <RevokeInviteDialog open={revokeOpen} setOpen={setRevokeOpen} setRevokeOpen={setRevokeOpen} email={revokedUserEmail} />
        </>
    );
};

export default InviteUserDialog;
