import { apiSlice } from '../../apiSlice'; 
import { updateLogs, updateIsLoading } from './logsSlice';
import Log from "@/types/Log"

export const logsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActivityLogs: builder.mutation<{ data: Log[], last_page: number }, {page?: number, keyword?: string, to?: string, from?: string, sort_by?: string, sort_order?: string}>({
      query: ({ page = 1, keyword = '', sort_order = '', sort_by = '', to = '', from = '' }) => ({
        url: `audit_log?page=${page}&keyword=${keyword}&sort_order=${sort_order}&sort_by=${sort_by}&to=${to}&from=${from}`,
        method: 'POST',
        body: {},
      }),
      async onQueryStarted({ page = 1, keyword }, { dispatch, queryFulfilled }) {
        try {
          dispatch(updateIsLoading(true));
          const { data } = await queryFulfilled;
          const payload = {page: page!, keyword, logs: data.data, lastPageReached: data.last_page === page}
          dispatch(updateLogs(payload));
        } catch {}
        finally {
          dispatch(updateIsLoading(false));
        }
      },
    }),
    getSMSLogs: builder.mutation<{ data: Log[], last_page: number }, {page?: number, keyword?: string, to?: string, from?: string, sort_by?: string, sort_order?: string}>({
      query: ({ page = 1, keyword = '', sort_order = '', sort_by = '', to = '', from = '' }) => ({
        url: `sms_log?page=${page}&keyword=${keyword}&sort_order=${sort_order}&sort_by=${sort_by}&to=${to}&from=${from}`,
        method: 'POST',
        body: {},
      }),
      async onQueryStarted({ page = 1, keyword }, { dispatch, queryFulfilled }) {
        try {
          dispatch(updateIsLoading(true));
          const { data } = await queryFulfilled;
          const payload = {page: page!, keyword, logs: data.data, lastPageReached: data.last_page === page}
          dispatch(updateLogs(payload));
        } catch {}
        finally {
          dispatch(updateIsLoading(false));
        }
      },
    }),
  }),
});

export const { useGetActivityLogsMutation, useGetSMSLogsMutation } = logsApiSlice;
