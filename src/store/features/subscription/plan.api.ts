import { baseAPI } from "@/store/api/baseApi";

export const planAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({

    // get feature data
    getFeatures: build.query({
      query: () => `/subscription/manage-features/`,
      providesTags: ["Feature","Subscription"],
    }),

    // add feature
    addFeature: build.mutation({
      query: (data) => ({
        url: `/subscription/manage-features/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Feature","Subscription"],
    }),

    // get single feature
    getFeatureById: build.query({
      query: (id) => `/subscription/manage-features/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Feature', id }],
    }),

    // update feature
    updateFeature: build.mutation({
      query: ({ id, data }) => ({
        url: `/subscription/manage-features/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Feature","Subscription"],
    }),

    // delete feature
    deleteFeature: build.mutation({
      query: (id) => ({
        url: `/subscription/manage-features/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Feature","Subscription"],
    }),
  }),
});

export const {
  useGetFeaturesQuery,
  useAddFeatureMutation,
  useGetFeatureByIdQuery,
  useUpdateFeatureMutation,
  useDeleteFeatureMutation,
} = planAPI;
