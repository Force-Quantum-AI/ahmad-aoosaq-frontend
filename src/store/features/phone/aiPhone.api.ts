import { aiBaseAPI } from "@/store/api/aiBaseApi";

export const aiPhoneAPI = aiBaseAPI.injectEndpoints({
  endpoints: (build) => ({
    searchPhoneNumbers: build.mutation({
      query: ({ data }) => ({
        url: `/api/v1/agent/phone-numbers/search`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Phone"],
    }),
    
  }),
});

export const {
  useSearchPhoneNumbersMutation
} = aiPhoneAPI;