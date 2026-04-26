import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    projectName: "CHYR"
}

const projectIdentifierSlice = createSlice({
    name: "projectIdentifier",
    initialState,
    reducers: {
        setProjectName: (state, action) => {
            state.projectName = action.payload;
        }
    },
});

export const { setProjectName } = projectIdentifierSlice.actions;
export default projectIdentifierSlice.reducer;
            