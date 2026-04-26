import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useChangePasswordMutation } from "@/store/features/auth/auth.api";
import { toast } from "react-toastify";

interface ChangePasswordDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({ open, setOpen }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswords((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        try {
            await changePassword({
                old_password: passwords.oldPassword,
                new_password: passwords.newPassword,
            }).unwrap();
            setOpen(false);
            setPasswords({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            toast.success("Password changed successfully");
        } catch (error: any) {
            toast.error(error.data.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 border-none">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Change Password</h2>
                <p className="text-gray-500 text-sm mb-6">Enter your current and new password to update your account security.</p>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm text-gray-600 mb-1.5 block">Enter your current password</label>
                        <div className="relative flex items-center">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Current password"
                                className="w-full border border-gray-200 text-gray-900 placeholder:text-gray-400 text-sm rounded-xl px-4 py-3 outline-none focus:border-gray-400 transition-colors pr-10"
                                onChange={handleChange}
                                name="oldPassword"
                            />
                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors" type="button">
                                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600 mb-1.5 block">Enter your new password</label>
                        <div className="relative flex items-center">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="New password"
                                className="w-full border border-gray-200 text-gray-900 placeholder:text-gray-400 text-sm rounded-xl px-4 py-3 outline-none focus:border-gray-400 transition-colors pr-10"
                                onChange={handleChange}
                                name="newPassword"
                            />
                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors" type="button">
                                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600 mb-1.5 block">Confirm your new password</label>
                        <div className="relative flex items-center">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                className="w-full border border-gray-200 text-gray-900 placeholder:text-gray-400 text-sm rounded-xl px-4 py-3 outline-none focus:border-gray-400 transition-colors pr-10"
                                onChange={handleChange}
                                name="confirmPassword"
                            />
                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors" type="button">
                                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => setOpen(false)}
                            className="flex-1 bg-white border border-gray-200 text-gray-900 text-sm font-medium rounded-xl py-2.5 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={isLoading} className="flex-1 bg-black hover:bg-gray-900 text-white text-sm font-semibold rounded-xl py-2.5 transition-colors cursor-pointer">
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ChangePasswordDialog;
