import { avrianceConfig } from "@/config/stores/avriance";
import { chyrConfig } from "@/config/stores/chyr";

export const getStoreConfig = () => {
    const host = window.location.hostname;

    if (host.includes("chyr")) return chyrConfig;
    if (host.includes("avriance")) return avrianceConfig;

    return chyrConfig; // default
};