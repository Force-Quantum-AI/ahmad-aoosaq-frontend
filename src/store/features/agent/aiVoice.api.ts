import { aiBaseAPI } from "@/store/api/aiBaseApi";

export const aiVoiceAPI = aiBaseAPI.injectEndpoints({
  endpoints: (build) => ({
    startTestVoice: build.mutation({
      query: ({ agent_id }) => ({
        url: `/api/v1/agent/test-voice/start`,
        method: "POST",
        body: { agent_id },
      }),
      invalidatesTags: ["AiVoice"],
    }),
    testVoiceTurn: build.mutation({
      query: ({ data }) => ({
        url: `/api/v1/agent/test-voice/turn`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AiVoice"],
    }),
    endTestVoice: build.mutation({
      query: ({ data }) => ({
        url: `/api/v1/agent/test-voice/end`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AiVoice"],
    }),

  }),
});

export const {
  useStartTestVoiceMutation,
  useTestVoiceTurnMutation,
  useEndTestVoiceMutation,
} = aiVoiceAPI;