import { baseAPI } from "@/store/api/baseApi";

export const settingsAPI = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        // inviteMember
        getAllInvitationMember: build.query({
            query: () => `/auth/member-invitation/`,
            providesTags: ["InviteMember"],
        }),
        inviteMember: build.mutation({
            query: (data: { email: string, frontend_url: any, expires_at: string, role: string }) => ({
                url: `/auth/member-invitation/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["InviteMember"],
        }),
        deleteInvitationMember: build.mutation({
            query: (id: number) => ({
                url: `/auth/member-invitation/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["InviteMember"],
        }),
        getLogs: build.query({
            query: (params) => ({
                url: "/logs/",
                method: "GET",
                params,
            }),
        }),
    }),
});

export const {
    useGetAllInvitationMemberQuery,
    useInviteMemberMutation,
    useDeleteInvitationMemberMutation,
    useGetLogsQuery
} = settingsAPI;
