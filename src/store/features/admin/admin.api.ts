// admin.api.ts
import { baseAPI } from "@/store/api/baseApi";
import type { SuperAdminPanelResponse } from "./admin.types";

export const adminApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getSuperAdminPanel: builder.query<SuperAdminPanelResponse, void>({
      query: () => "/api/super-admin/panel/",
      // Optionally provide tags for cache invalidation
      providesTags: ["AdminPanel"],
    }),
  }),
});

export const { useGetSuperAdminPanelQuery } = adminApi;
