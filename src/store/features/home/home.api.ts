import { baseAPI } from "@/store/api/baseApi";

export const homePageAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getHomePageData: build.query({
      query: () => "/api/calls/dashboard/",
      providesTags: ["Home"],
    }),
  }),
});

export const {
  useGetHomePageDataQuery
} = homePageAPI;