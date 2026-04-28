import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLazyGetOTPForDeleteUserAccountQuery, useVerifyDeleteUserAccountMutation } from "@/store/features/auth/auth.api";

const DeleteAccountModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));

  const [triggerOTP, { isLoading: sendingOTP }] =
    useLazyGetOTPForDeleteUserAccountQuery();

  const [verifyDeleteUser, { isLoading: deleting }] =
    useVerifyDeleteUserAccountMutation();

  // Send OTP when modal opens
  useEffect(() => {
    if (open) {
      triggerOTP({})
        .unwrap()
        .then((res: any) => {
          if (res?.success) {
            toast.success(res?.message);
          } else {
            toast.error(res?.message);
          }
        })
        .catch(() => {
          toast.error("Failed to send OTP");
        });
    }
  }, [open]);

  // Handle OTP input
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // auto focus next
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  // Paste support
  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(paste)) return;

    const newOtp = paste.split("");
    setOtp(newOtp);
  };

  // Delete account
  const handleDelete = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    try {
      await verifyDeleteUser({ otp: finalOtp }).unwrap();
      toast.success("Account deleted");

      onOpenChange(false);
      navigate("/login");
    } catch (error) {
      toast.error("Invalid OTP or failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl bg-white">
        <div className="text-center space-y-4">
          <h2 className="text-lg font-semibold">Delete Account</h2>
          <p className="text-sm text-gray-500">
            Enter the 6-digit OTP sent to your email
          </p>

          {/* OTP Inputs */}
          <div
            className="flex justify-center gap-2"
            onPaste={handlePaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                value={digit}
                onChange={(e) =>
                  handleChange(e.target.value, i)
                }
                maxLength={1}
                className="w-10 h-12 text-center border rounded-lg text-lg"
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="w-1/2"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              className="w-1/2 bg-red-600 text-white"
              onClick={handleDelete}
              disabled={deleting || sendingOTP}
            >
              {deleting ? "Deleting..." : "Delete Now"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountModal;