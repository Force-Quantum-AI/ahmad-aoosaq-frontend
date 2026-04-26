import { baseAPI } from "@/store/api/baseApi";

export const subscriptionAPI = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getUserCurrentSubscription: build.query({
            query: () => `/subscription/check/`,
            providesTags: ["Subscription"],
        }),
        getAllPlans: build.query({
            query: () => `/subscription/plans/`,
            providesTags: ["Subscription"],
        }),
        getFinalPlanModalInfo: build.query({
            query: ({
                eligible_for,
                id
            }: {
                eligible_for?: string;
                id?: number | string;
            }) => ({
                url: `/subscription/eligible-features/`,
                params: {
                    eligible_for,
                    id
                },
            }),
            providesTags: ["Subscription"],
        }),
        addOnsFeatures: build.mutation({
            query: (data: { subscription_id: number | string, provider: string, add_on_ids: number[] }) => ({
                url: `/subscription/add-ons/add/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Subscription"],
        }),
        removeAddOnsFeatures: build.mutation({
            query: (data: { subscription_id: number | string, add_on_ids: number[] }) => ({
                url: `/subscription/add-ons/remove/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Subscription"],
        }),
        createSubscription: build.mutation({
            query: (data) => ({
                url: `/subscription/manage-subscriptions/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Subscription"],
        }),
    }),
});

export const {
    useGetUserCurrentSubscriptionQuery,
    useGetAllPlansQuery,
    useGetFinalPlanModalInfoQuery,
    useAddOnsFeaturesMutation,
    useRemoveAddOnsFeaturesMutation,
    useCreateSubscriptionMutation
} = subscriptionAPI;
