import { baseAPI } from "@/store/api/baseApi";
import { FeatureDetail, Plan } from "./plan.types";

export const planAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({

    // get feature data
    getFeatures: build.query<FeatureDetail[], void>({
      query: () => `/subscription/manage-features/`,
      providesTags: ["Feature"],
    }),

    // add feature
    addFeature: build.mutation<FeatureDetail, Partial<FeatureDetail>>({
      query: (data) => ({
        url: `/subscription/manage-features/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Feature"],
    }),

    // get single feature
    getFeatureById: build.query<FeatureDetail, number>({
      query: (id) => `/subscription/manage-features/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Feature', id }],
    }),

    // update feature
    updateFeature: build.mutation<FeatureDetail, { id: number; data: Partial<FeatureDetail> }>({
      query: ({ id, data }) => ({
        url: `/subscription/manage-features/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => ["Feature", { type: 'Feature', id }],
    }),

    // delete feature
    deleteFeature: build.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/subscription/manage-features/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Feature"],
    }),



    // get plan data
    getPlan: build.query<Plan[], void>({
      query: () => `/subscription/manage-plans/`,
      providesTags: ["Plan"],
    }),

    // add plan
    addPlan: build.mutation<Plan, Partial<Plan>>({
      query: (data) => ({
        url: `/subscription/manage-plans/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Plan"],
    }),

    // get single plan
    getPlanById: build.query<Plan, number>({
      query: (id) => `/subscription/manage-plans/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Plan', id }],
    }),

    // update plan
    updatePlan: build.mutation<Plan, { id: number; data: Partial<Plan> }>({
      query: ({ id, data }) => ({
        url: `/subscription/manage-plans/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => ["Plan", { type: 'Plan', id }],
    }),

    // delete plan
    deletePlan: build.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/subscription/manage-plans/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Plan"],
    }),





  }),
});

export const {
  useGetFeaturesQuery,
  useGetPlanQuery,
  useAddFeatureMutation,
  useGetFeatureByIdQuery,
  useUpdateFeatureMutation,
  useDeleteFeatureMutation,
  useAddPlanMutation,
  useGetPlanByIdQuery,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = planAPI;
