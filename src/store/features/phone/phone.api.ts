import { baseAPI } from "@/store/api/baseApi";

export const phoneAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getPhonePageAllInfo: build.query({
      query: () => `/api/phone-numbers/phone/answer/`,
      providesTags: ["Phone"],
    }),
    updatePhonePageInfo: build.mutation({
      query: ({ data, id }) => ({
        url: `/api/phone-numbers/phone/answer/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Phone"],
    }),
    updatePhonePageInfoFromProvisionModal: build.mutation({
      query: ({ data }) => ({
        url: `/api/phone-numbers/phone/answer/`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Phone"],
    }),
    setCallForwardingNumber: build.mutation({
      query: ({ current_number}) => ({
        url: `/api/phone-numbers/phone/call-forwarding/`,
        method: "POST",
        body: {
          current_number: current_number,
        },
      }),
      invalidatesTags: ["Phone"],
    }),
    updateCallForwardingSetupWithNumber: build.mutation({
      query: ({ call_forwarding_number, id }) => ({
        url: `/api/phone-numbers/phone/call-forwarding/${id}/`,
        method: "PUT",
        body: {
          call_forwarding: call_forwarding_number,
        },
      }),
      invalidatesTags: ["Phone"],
    }),
    updateCallForwardingSetupWithNumberWithWhenToAnswer: build.mutation({
      query: ({ call_forwarding_number, id }) => ({
        url: `/api/phone-numbers/phone/answer/${id}/`,
        method: "PUT",
        body: {
          call_forwarding: {
            current_number: call_forwarding_number,
          },
          when_to_answer: "when i don't answer",
        },
      }),
      invalidatesTags: ["Phone"],
    }),
    deleteCallForwording: build.mutation({
      query: (id) => ({
        url: `/api/phone-numbers/phone/call-forwarding/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Phone"],
    })
  }),
});

export const {
  useGetPhonePageAllInfoQuery,
  useUpdatePhonePageInfoMutation,
  useUpdatePhonePageInfoFromProvisionModalMutation,
  useUpdateCallForwardingSetupWithNumberMutation,
  useSetCallForwardingNumberMutation,
  useUpdateCallForwardingSetupWithNumberWithWhenToAnswerMutation,
  useDeleteCallForwordingMutation
} = phoneAPI;