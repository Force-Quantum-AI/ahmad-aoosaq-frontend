import { baseAPI } from "@/store/api/baseApi";

export const userAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (data: { email: string; password: string }) => ({
        url: "/auth/login/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    registerClient: build.mutation({
      query: (data) => ({
        url: "/auth/register/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    getOTP: build.mutation({
      query: (email: string) => ({
        url: `/otp/get-otp/`,
        method: "POST",
        body: {
          user_identifier: email,
          purpose: "registration"
        },
      }),
      invalidatesTags: ["Auth"],
    }),
    changePassword: build.mutation({
      query: (payload) => ({
        url: "/auth/password/change/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Auth"],
    }),
        getUser: build.query({
      query: () => "/auth/user/update/",
      providesTags: ["Auth"],
    }),

    updateUser: build.mutation({
      query: (payload) => {
        // Check if payload is FormData (contains file)
        const isFormData = payload instanceof FormData;

        return {
          url: "/auth/user/update/",
          method: "PATCH", // Changed from PATCH to PUT for better file upload support
          body: payload,
          // Do NOT set Content-Type header manually when sending FormData
          // fetchBaseQuery will automatically set it with the correct boundary
          ...(isFormData
            ? {}
            : { headers: { "Content-Type": "application/json" } }),
        };
      },
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterClientMutation,
  useGetOTPMutation,
  useChangePasswordMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} = userAPI;
