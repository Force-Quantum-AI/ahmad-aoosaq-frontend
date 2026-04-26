import { toast } from "react-toastify";

export const copyText = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        toast.success("Number copied to clipboard");
    } catch (err) {
        console.error("Copy failed", err);
    }
};