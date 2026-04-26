import { baseAPI } from "@/store/api/baseApi";

export const businessAPI = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        createBusiness: build.mutation({
            query: (data) => ({
                url: "/api/business/businesses/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Business"],
        }),
        updateBusiness: build.mutation({
            query: ({business_id, data}) => ({
                url: `/api/business/businesses/${business_id}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Business"],
        }),
        getBusiness: build.query({
            query: ({business_id}) => `api/business/businesses/${business_id}/`,
            providesTags: ["Business"],
        }),
        getUserBusiness: build.query({
            query: () => `api/business/businesses/`,
            providesTags: ["Business"],
        }),
        // business hours
        createBusinessHours: build.mutation({
            query: ({business_id, data}) => ({
                url: `/business/businesses/${business_id}/hours/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Business"],
        }),
        updateBusinessHours: build.mutation({
            query: ({business_id, data}) => ({
                url: `/api/business/businesses/${business_id}/hours/${data.id}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Business"],
        }),
        deleteBusinessHours: build.mutation({
            query: ({business_id, data}) => ({
                url: `/api/business/businesses/${business_id}/hours/${data.id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Business"],
        }),
        // service 
        createBusinessServices: build.mutation({
            query: ({business_id, data}) => ({
                url: `/business/businesses/${business_id}/services/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Services"],
        }),
        getServices: build.query({
            query: ({business_id}) => `/api/business/businesses/${business_id}/services/`,
            providesTags: ["Services"],
        }),
        addServices: build.mutation({
            query: ({business_id, data}) => ({
                url: `/api/business/businesses/${business_id}/services/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Services"],
        }),
        updateServices: build.mutation({
            query: ({business_id, data}) => ({
                url: `/api/business/businesses/${business_id}/services/${data.id}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Services"],
        }),
        deleteServices: build.mutation({
            query: ({business_id, service_id}) => ({
                url: `/api/business/businesses/${business_id}/services/${service_id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Services"],
        }),
        // policies 
        getBusinessPolicies: build.query({
            query: ({business_id}) => `api/business/businesses/${business_id}/policies/`,
            providesTags: ["Policies"],
        }),
        addBusinessPolicies: build.mutation({
            query: ({business_id, data}) => ({
                url: `/api/business/businesses/${business_id}/policies/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Policies"],
        }),
        updateBusinessPolicies: build.mutation({
            query: ({business_id, data}) => ({
                url: `/api/business/businesses/${business_id}/policies/${data.id}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Policies"],
        }),
        deleteBusinessPolicies: build.mutation({
            query: ({business_id, policy_id}) => ({
                url: `/api/business/businesses/${business_id}/policies/${policy_id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Policies"],
        }),
        // for FAQ
        getBusinessFAQ: build.query({
            query: ({business_id}) => `/api/business/businesses/${business_id}/faqs/`,
            providesTags: ["FAQ"],
        }),
        addBusinessFAQ: build.mutation({
            query: ({business_id, data}) => ({
                url: `/api/business/businesses/${business_id}/faqs/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["FAQ"],
        }),
        updateBusinessFAQ: build.mutation({
            query: ({business_id, faq_id, data}) => ({
                url: `/api/business/businesses/${business_id}/faqs/${faq_id}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["FAQ"],
        }),
        deleteBusinessFAQ: build.mutation({
            query: ({business_id, faq_id}) => ({
                url: `/api/business/businesses/${business_id}/faqs/${faq_id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["FAQ"],
        }),
        // additional information
        getBusinessAdditionalInformation: build.query({
            query: ({business_id}) => `/api/business/businesses/${business_id}/additional-info/`,
            providesTags: ["AdditionalInformation"],
        }),
        addBusinessAdditionalInformation: build.mutation({
            query: ({business_id, data}) => ({
                url: `/api/business/businesses/${business_id}/additional-info/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["AdditionalInformation"], 
        }),
        updateBusinessAdditionalInformation: build.mutation({
            query: ({business_id, data}) => ({
                url: `/api/business/businesses/${business_id}/additional-info/${data.id}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["AdditionalInformation"],
        }),
        deleteBusinessAdditionalInformation: build.mutation({
            query: ({business_id, data}) => ({
                url: `/api/business/businesses/${business_id}/additional-info/${data.id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["AdditionalInformation"],
        }),
        

    }),
});

export const {
    useCreateBusinessMutation,
    useUpdateBusinessMutation,
    useGetBusinessQuery,
    useGetUserBusinessQuery,
    useLazyGetUserBusinessQuery,
    // business hours 
    useCreateBusinessHoursMutation,
    useUpdateBusinessHoursMutation,
    useDeleteBusinessHoursMutation,
    // services 
    useGetServicesQuery,
    useCreateBusinessServicesMutation,
    useAddServicesMutation,
    useUpdateServicesMutation,
    useDeleteServicesMutation,
    // policies 
    useGetBusinessPoliciesQuery,
    useAddBusinessPoliciesMutation,
    useUpdateBusinessPoliciesMutation,
    useDeleteBusinessPoliciesMutation,
    // faq 
    useGetBusinessFAQQuery,
    useAddBusinessFAQMutation,
    useUpdateBusinessFAQMutation,
    useDeleteBusinessFAQMutation,
    // additional information
    useGetBusinessAdditionalInformationQuery,
    useAddBusinessAdditionalInformationMutation,
    useUpdateBusinessAdditionalInformationMutation,
    useDeleteBusinessAdditionalInformationMutation,
    
    
} = businessAPI;
