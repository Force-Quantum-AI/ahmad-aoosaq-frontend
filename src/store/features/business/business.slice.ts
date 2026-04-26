import { createSlice } from "@reduxjs/toolkit";

interface BusinessState {
    id?: number | null | string;
    business_name?: string;
    business_email?: string;
    business_website?: string;
    business_type?: string;
    business_description?: string;
}

const initialState: BusinessState = {
    id: null,
    business_name: "",
    business_email: "",
    business_website: "",
    business_type: "salon & spa",
    business_description: "",
}

const businessSlice = createSlice({
    name: "business",
    initialState,
    reducers: {
        setBusinessEmailAndWebsite: (state, action) => {
            state.business_email = action.payload.business_email;   
            state.business_website = action.payload.business_website;
        },
        setBusinessNameAndDescription: (state, action) => {
            state.business_name = action.payload.business_name;
            state.business_description = action.payload.business_description;
        },
        setBusinessId: (state, action) => {
            state.id = action.payload;
        },
    },
});

export const { setBusinessEmailAndWebsite, setBusinessNameAndDescription, setBusinessId } = businessSlice.actions;
export default businessSlice.reducer;
            