import React from "react";
import BaseDialog from "@/common/BaseDialog";

interface RevokeInviteDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setRevokeOpen: (open: boolean) => void;
    email?: string;
}

const RevokeInviteDialog: React.FC<RevokeInviteDialogProps> = ({ open, setOpen, setRevokeOpen, email = "ahsan@gmail.com" }) => {
    return (
        <BaseDialog
            open={open}
            setOpen={setOpen}
            title="Revoke invite?"
            description={
                <span className="text-[#9E9E9E] text-xs md:text-sm ">
                    Are you sure you want to revoke the invite to{" "}
                    <span className="text-[#000] text-xs md:text-sm">{email}</span>? This action is immediate and cannot be undone.
                </span>
            }
            maxWidth="sm"
            className="w-[660px] max-w-[95vw]"
        >
            <div className="flex flex-col gap-8 py-4 w-full">
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <button
                        onClick={() => setOpen(false)}
                        className="w-full sm:w-auto px-12 py-2 border border-[#212121] rounded-xl font-geist text-sm font-normal text-[#000] hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button className="w-full sm:w-auto px-12 py-2 bg-red-500 rounded-xl font-geist text-sm font-normal text-white hover:opacity-90 transition-opacity cursor-pointer"
                        onClick={() => {
                            setOpen(false)
                            setRevokeOpen(false)
                        }}
                    >
                        Revoke
                    </button>
                </div>
            </div>
        </BaseDialog>
    );
};

export default RevokeInviteDialog;
