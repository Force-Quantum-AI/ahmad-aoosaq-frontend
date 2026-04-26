import { baseAPI } from "@/store/api/baseApi";

export const agentAPI = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getAgent: build.query({
            query: () => `/api/agent/agents/`,
            providesTags: ["Agent"],
        }),
        getAllAgent: build.query({
            query: () => `/api/agent/agent-voices/`,
            providesTags: ["Agent"],
        }),
        selectAgent: build.mutation({
            query: ({ data }) => ({
                url: `/api/agent/agent-voices/${data.id}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Agent"],
        }),
        createAgent: build.mutation({
            query: ({ business_id, data }) => ({
                url: `/api/business/businesses/${business_id}/agents/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Agent"],
        }),
        updateAgent: build.mutation({
            query: ({ business_id, data }) => ({
                url: `/api/business/businesses/${business_id}/agents/${data.id}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Agent"],
        }),
        deleteAgent: build.mutation({
            query: ({ business_id, data }) => ({
                url: `/api/business/businesses/${business_id}/agents/${data.id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Agent"],
        }),
        // language 
        getAllLanguage: build.query({
            query: () => `/api/agent/languages/`,
            providesTags: ["Language"],
        }),
        setLanguage: build.mutation({
            query: ({ data, id }) => ({
                url: `/api/agent/languages/${id}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Language"],
        }),
        // transfer number 
        getTransferNumber: build.query({
            query: () => `/api/agent/transfer-number/`,
            providesTags: ["TransferNumber"],
        }),
        createTransferNumber: build.mutation({
            query: ({ data }) => ({
                url: `/api/agent/transfer-number/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["TransferNumber"],
        }),
        updateTransferNumber: build.mutation({
            query: ({ data }) => ({
                url: `/api/agent/transfer-number/`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["TransferNumber"],
        }),
        // greeting - get and update 
        getGreeting: build.query({
            query: () => `/api/agent/agents/`,
            providesTags: ["Greeting"],
        }),
        updateGreeting: build.mutation({
            query: ({ data }) => ({
                url: `/api/agent/agents/`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Greeting"],
        }),
        // intake question 
        getIntakeQuestion: build.query({
            query: () => `/api/agent/intake-questions/`,
            providesTags: ["IntakeQuestion"],
        }),
        createIntakeQuestion: build.mutation({
            query: ({ data }) => ({
                url: `/api/agent/intake-questions/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["IntakeQuestion"],
        }),
        updateIntakeQuestion: build.mutation({
            query: ({ data }) => ({
                url: `/api/agent/intake-questions/${data.id}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["IntakeQuestion"],
        }),
        deleteIntakeQuestion: build.mutation({
            query: ({ data }) => ({
                url: `/api/agent/intake-questions/${data.id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["IntakeQuestion"],
        }),
    }),
});

export const {
    useGetAgentQuery,
    useGetAllAgentQuery,
    useSelectAgentMutation,
    useCreateAgentMutation,
    useUpdateAgentMutation,
    useDeleteAgentMutation,
    // language 
    useGetAllLanguageQuery,
    useSetLanguageMutation,
    // greeting 
    useGetTransferNumberQuery,
    useUpdateTransferNumberMutation,
    useGetGreetingQuery,
    useUpdateGreetingMutation,
    // agent 
    useGetIntakeQuestionQuery,
    useCreateIntakeQuestionMutation,
    useUpdateIntakeQuestionMutation,
    useDeleteIntakeQuestionMutation,

} = agentAPI;
