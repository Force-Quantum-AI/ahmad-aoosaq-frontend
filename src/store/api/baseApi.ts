import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { logout, setUser } from "../features/auth/auth.slice";

//  Base query (normal requests)
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders(headers, { getState }) {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

//  Wrapper with refresh logic
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  //  If access token expired
  if (result?.error?.status === 401) {
    console.log(" Access token expired, trying refresh...");

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    //  Call refresh API
    const refreshResult = await baseQuery(
      {
        url: "/auth/jwt/refresh/", //  our refresh token api route
        method: "POST",
        body: { refresh: refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      const newAccess = (refreshResult.data as any).access;

      const state = api.getState() as RootState;

      //  Update store with new access token
      api.dispatch(
        setUser({
          user: state.auth.user,
          access: newAccess,
          refresh: refreshToken,
        })
      );

      //  Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log(" Refresh failed, logging out...");
      api.dispatch(logout());
    }
  }

  return result;
};

//  API Slice
export const baseAPI = createApi({
  reducerPath: "baseAPI",
  baseQuery: baseQueryWithReauth, // use wrapped query
  tagTypes: ["Auth", "CreateAgent", "Home", "Overview", "Business", "Services", "Policies", "Agent", "FAQ", "AdditionalInformation", "IntakeQuestion","Greeting","TransferNumber","BusinessHours","Integration","InviteMember","Language","Phone","Subscription","Feature","Plan","AdminPanel"],
  endpoints: () => ({}),
});