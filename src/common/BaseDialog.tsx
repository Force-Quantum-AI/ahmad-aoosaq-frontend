"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type DialogSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
type DialogHeight = "sm" | "md" | "lg" | "xl";

interface BaseDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    description: React.ReactNode;
    children: React.ReactNode;

    /** Preset width */
    maxWidth?: DialogSize;

    /** Preset height */
    maxHeight?: DialogHeight;

    /** Extra Tailwind classes */
    className?: string;

    /** Full width modal */
    fullWidth?: boolean;

    /** Optional element to show on the right side of the header */
    headerAction?: React.ReactNode;
}

const widthMap: Record<DialogSize, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
};

const heightMap: Record<DialogHeight, string> = {
    sm: "max-h-[50vh]",
    md: "max-h-[65vh]",
    lg: "max-h-[80vh]",
    xl: "max-h-[90vh]",
};

const BaseDialog = ({
    open,
    setOpen,
    title,
    description,
    children,
    maxWidth = "2xl",
    maxHeight = "lg",
    className,
    fullWidth = false,
    headerAction,
}: BaseDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className={cn(
                    "flex flex-col overflow-hidden !rounded-[30px] bg-white border-1 border-gray-500 p-5 shadow-2xl",
                    heightMap[maxHeight],
                    fullWidth ? "w-full max-w-none" : widthMap[maxWidth],
                    className
                )}
            >
                {/* Header */}
                <DialogHeader className="pb-4 flex flex-row items-center justify-between">
                    <div>
                        <DialogTitle className="text-xl xl:text-2xl font-medium font-geist text-[#000]">
                            {title}
                        </DialogTitle>
                        <DialogDescription asChild>
                            <div className="">{description}</div>
                        </DialogDescription>
                    </div>
                    {headerAction && (
                        <div className="flex-shrink-0">
                            {headerAction}
                        </div>
                    )}
                </DialogHeader>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pr-2">
                    <div className="space-y-4">{children}</div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BaseDialog;
