// update code 
import { RootState } from "@/store/store";
import { TUser } from "@/store/storeTypes/user";
import { createSlice } from "@reduxjs/toolkit";

type Tstate = {
  user: TUser | null;
  userNameImg: any;
  accessToken: string | null;
  refreshToken?: string | null;
  is_super_admin?: boolean;
};

const initialState: Tstate = {
  user: null,
  userNameImg: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, refresh, access } = action.payload || {};

      if (!user || !access) {
        console.error("Invalid payload received:", action.payload);
        return;
      }

      state.accessToken = access;
      state.user = user;
      state.userNameImg = user;

      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("accessToken", access);
      
    },
    setUserInfo:(state, action)=>{
      state.userNameImg = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setUser, setUserInfo,logout } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth?.user;
export const selectToken = (state: RootState) => state.auth?.accessToken;

const authReducer = authSlice.reducer;
export default authReducer;
