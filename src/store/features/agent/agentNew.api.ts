import { baseAPI } from "@/store/api/baseApi";
import { FormOptionsResponse,IntakeQuestion} from "@/types/aget.type";


export const agentAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createIntakeQuestionNew: build.mutation({
      query: (data) => ({
        url: "/api/agent/intake-questions/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["IntakeQuestion"],
    }),
    getIntakeFormOptionsNew: build.query<FormOptionsResponse, void>({
      query: () => `/api/agent/intake-questions/form-options/`,
      providesTags: ["IntakeQuestion"],
    }),
    getIntakeQuestionsNew: build.query<IntakeQuestion[], void>({
      query: () => "/api/agent/intake-questions/",
      providesTags: ["IntakeQuestion"],
    }),
  }),
});

export const {
  useCreateIntakeQuestionNewMutation,
  useGetIntakeFormOptionsNewQuery,
  useGetIntakeQuestionsNewQuery,
} = agentAPI;
