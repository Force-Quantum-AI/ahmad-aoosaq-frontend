import { getStoreConfig } from "@/utils/getStoreConfig";
import { createContext, useContext } from "react";

const StoreContext = createContext<any>(null);

export const StoreProvider = ({ children }: any) => {
    const config = getStoreConfig();

    return (
        <StoreContext.Provider value={config}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
};