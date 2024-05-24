import { apiSlice } from '../../apiSlice';
import Batch, { AssociatesAndVehicles, Vehicle } from '@/types/Batch';
import { userToken } from '@/utils/helper';
import { getBatchSingle, removeInvoiceFromBatchState, updateBatchs, updateSingleBatch } from './batchsSlice';
import { Assosiate } from "@/types/Batch";
import { Assignee } from "@/types/Batch";
import BatchDetails from "@/types/BatchDetails";

export const batchsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBatchs: builder.mutation<{ data: Batch[], last_page: number }, { page?: number, keyword?: string, batch_type?: number, to?: string, from?: string, sort_by?: string, sort_order?: string }>({
      query: ({ page = 1, keyword = '', batch_type = 1, to = '', from = '', sort_order = 'DESC', sort_by = 'id' }) => ({
        url: `batches?page=${page}&keyword=${keyword}&batch_type=${batch_type}&to=${to}&from=${from}&sort_order=${sort_order}&sort_by=${sort_by}`,
        method: "POST",
        body: {}
      }),
      // transformResponse: (res: {data: Batch[]}) => res.data,
      async onQueryStarted({ page = 1, keyword }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateBatchs({ page: page!, keyword, batchs: data.data, lastPageReached: data.last_page === page }))
        } catch { }
      }
    }),
    getBatchsSingleData: builder.mutation<{ data: any, last_page: number }, { page?: number, keyword?: string, batch_type?: number, to?: string, from?: string, sort_by?: string, sort_order?: string }>({
      query: ({ page = 1, keyword = '', batch_type = 1, to = '', from = '', sort_order = 'DESC', sort_by = 'id' }) => ({
        url: `batches?page=${page}&keyword=${keyword}&batch_type=${batch_type}&to=${to}&from=${from}&sort_order=${sort_order}&sort_by=${sort_by}`,
        method: "POST",
        body: {}
      }),
      // transformResponse: (res: {data: Batch[]}) => res.data,
      async onQueryStarted({ page = 1, keyword }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // console.log(data, "data===>>>")
          // dispatch(getBatchSingle({ page: page!, keyword, batchs: data.data ? data.data : data, lastPageReached: data.last_page === page }))
        } catch { }
      }
    }),
    addInvoicesToBatch: builder.mutation<void, { id: number; invoices: number[] }>({
      query: ({ id, invoices }) => ({
        url: `batches/add_invoices`,
        method: "POST",
        params: {
          // token: userToken(), // Assuming userToken() is a function that retrieves the current user's token
          id, // The ID of the batch to which invoices are being added
          invoices: invoices.join(','), // Converts the array of invoice IDs to a comma-separated string
        },
      }),
      // Optionally, handle the response or update the state as needed
    }),
    getAssociates: builder.query<AssociatesAndVehicles, void>({
      query: () => ({
        url: `batches/options`,
        method: "POST", // Assuming GET, adjust if it's different
        body: {}

      }),
      transformResponse: (response: { associates: Assosiate[], assignees: Assignee[], vehicles: Vehicle[] }) => ({
        associates: response.associates,
        assignees: response.assignees,
        vehicles: response.vehicles,
      }),
    }),
    updateAssociate: builder.mutation<Batch, { id: number; user_id: number; vehicle_id: number }>({
      query: ({ id, user_id, vehicle_id }) => ({
        url: `batches/update_associate`,
        method: "POST",
        body: {
          // token: userToken(),
          id,
          user_id,
          vehicle_id,
        },
      }),
      onQueryStarted: async ({ id, user_id, vehicle_id }, { dispatch, queryFulfilled }) => {
        try {
          const { data: updatedBatch } = await queryFulfilled;
          // Now dispatch the action correctly with the updated batch data
          dispatch(updateSingleBatch({ id, data: updatedBatch }));
        } catch (error) {
          // Handle error here
        }
      },
    }),
    deleteInvoiceFromBatch: builder.mutation<{ success: boolean; id: number; invoices: number[] }, { batchId: number; invoiceIds: number[] }>({
      query: ({ batchId, invoiceIds }) => ({
        url: `batches/remove_invoices`,
        method: "POST",
        body: {
          //  token: userToken(), // Ensure you have a function to get the current user's token
          id: batchId,
          invoices: invoiceIds.join(',') // Assuming the API expects a comma-separated string of invoice IDs
        },
      }),
      async onQueryStarted({ batchId, invoiceIds }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Dispatch action to remove the invoice from the batch in the state
          // Assuming you have such an action like 'removeInvoiceFromBatchState'
          dispatch(removeInvoiceFromBatchState({ batchId, invoiceIds }));
        } catch (error) {
          // Optionally handle error, e.g., with another dispatch to set error state
        }
      },
    }),
    createBatch: builder.mutation<{ success: boolean; batch_number: string; batch: Batch }, { invoices: number[], batch_type: number }>({
      query: ({ invoices, batch_type }) => ({
        url: `batches/create`,
        method: "POST",
        body: {
          //  token: userToken(), // Assuming userToken() is a function that retrieves the current user's token
          invoices: invoices.join(','), // Converts the array of invoice IDs to a comma-separated string
          batch_type
        },
      }),
      // Optionally, handle the response or update the state as needed, for example:
      async onQueryStarted({ invoices }, { dispatch, queryFulfilled }) {
        try {
          const { data: newBatch } = await queryFulfilled;
          // Dispatch an action to add the new batch to the state, if needed
          // Example: dispatch(addNewBatch(newBatch));
        } catch (error) {
          // Optionally handle error, e.g., with a dispatch to set an error state
        }
      },
    }),
    getBatchDetailById: builder.query<BatchDetails, any>({
      query: (id) => {
        const token = userToken(); // Retrieve the user's token
        return {
          url: `batches/show/${id}`,
          method: "POST",
          body: {
            //token: userToken() // Assuming the API expects a comma-separated string of invoice IDs
          }, // Assuming your API expects the token as a query parameter
        };
      },
      transformResponse: (response: BatchDetails) => response,
    }),

  }),
});

export const { useGetBatchsMutation, useGetBatchsSingleDataMutation, useAddInvoicesToBatchMutation, useGetAssociatesQuery, useUpdateAssociateMutation, useDeleteInvoiceFromBatchMutation, useCreateBatchMutation, useGetBatchDetailByIdQuery } = batchsApiSlice;
