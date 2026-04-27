"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { usePauseAndResumeAndDeleteSubscriptionMutation } from "@/store/features/subscription/subscription.api"
import { toast } from "react-toastify"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscription_id: number | undefined
}

export default function DeleteSubscriptionModal({
  open,
  onOpenChange,
  subscription_id,
}: Props) {
  const [in_period_end, setInPeriodEnd] = useState<"True" | "False">("False")

  const [pauseAndResumeAndDeleteSubscription,{isLoading: isPauseAndResumeAndDeleteSubscriptionLoading}] = usePauseAndResumeAndDeleteSubscriptionMutation();

  const handlePauseAndResumeSubscription = async () => {
          try {
              await pauseAndResumeAndDeleteSubscription({
                  subscription_id: subscription_id,
                  action:"cancel",
                  in_period_end: in_period_end
              }).unwrap();
              toast.success(`Subscription deleted successfully`);
              onOpenChange(false);
          } catch (err) {
              console.error("Pause and resume subscription error:", err);
              toast.error(`Failed to delete subscription`);
          }
      };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 border-none">
        <DialogHeader>
          <DialogTitle>Delete Subscription</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-black">
          Are you sure you want to delete this subscription?
        </p>

        {/* Yes / No Choice */}
        <div className="flex gap-3 mt-4">
          <Button
            variant={in_period_end === "False" ? "default" : "outline"}
            onClick={() => setInPeriodEnd("True")}
          >
            {in_period_end === "True" && <Check/> } Cancel at period end (Yes)
          </Button>

          <Button
            variant={in_period_end === "True" ? "default" : "outline"}
            onClick={() => setInPeriodEnd("False")}
          >
            {in_period_end === "False" && <Check/> } Cancel immediately (No)
          </Button>
        </div>

        {/* Footer */}
        <DialogFooter className="mt-6">
          <Button  className="bg-black text-white hover:bg-gray-900 text-sm font-medium py-2 rounded-xl transition-colors cursor-pointer"  onClick={() => onOpenChange(false)}>
            No, Go Back
          </Button>

          <Button
            variant="destructive"
            className="bg-red-700 text-white hover:bg-red-600 text-sm font-medium py-2 rounded-xl transition-colors cursor-pointer"
            onClick={handlePauseAndResumeSubscription}
            disabled={isPauseAndResumeAndDeleteSubscriptionLoading}
          >
            {isPauseAndResumeAndDeleteSubscriptionLoading ? "Deleting..." : "Yes, Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}