import { baseAPI } from "@/store/api/baseApi";

export const integrationAPI = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getAllIntegrationData: build.query({
            query: () => `/integrations/`,
            providesTags: ["Integration"],
        }),
        connectGoogleCalendar: build.query({
            query: () => `/integrations/google-calendar/auth-url/`,
            providesTags: ["Integration"],
        }),
        disconnectGoogleCalendar: build.mutation({
            query: () => ({
                url: `/integrations/google-calendar/disconnect/`,
                method: "POST",
            }),
            invalidatesTags: ["Integration"],
        }),
        connectCalendly: build.query({
            query: () => `/integrations/calendly/auth-url/`,
            providesTags: ["Integration"],
        }),
        disconnectCalendly: build.mutation({
            query: () => ({
                url: `/integrations/calendly/disconnect/`,
                method: "POST",
            }),
            invalidatesTags: ["Integration"],
        }),
        connectMindBodyCalender: build.mutation({
            query: (data:{site_id:string,username:string,password:string}) => ({
                url: `/integrations/mindbody/connect/staff/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Integration"],
        }),
        disconnectMindBodyCalender: build.mutation({
            query: () => ({
                url: `/integrations/mindbody/disconnect/`,
                method: "POST",
            }),
            invalidatesTags: ["Integration"],
        }),
    }),
});

export const {
    useGetAllIntegrationDataQuery,
    useConnectGoogleCalendarQuery,
    useDisconnectGoogleCalendarMutation,
    useConnectCalendlyQuery,
    useDisconnectCalendlyMutation,
    useConnectMindBodyCalenderMutation,
    useDisconnectMindBodyCalenderMutation,
} = integrationAPI;
