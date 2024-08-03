import {  apiSlice } from '../../apiSlice';
import Invoice from '@/types/Invoice';
import { userToken } from '@/utils/helper';
import { updateInvoices} from './invoicesSlice';

export const invoicesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.mutation<{data: Invoice[], last_page: number},  {page?: number, keyword?: string, status?: number, sort_by?: string,sort_order?: string, from?: string, to? :string}>({
      query: ({page = 1, keyword = '', status = 1, to = '', from = '', sort_order = window.location.pathname?.includes("completed") ? 'DESC' : '', sort_by = window.location.pathname.includes('batch') ? 'invoice_number' : 'invoice_date'})=> ({
        url: `invoices?page=${page}&keyword=${keyword}&status=${status}&to=${to}&from=${from}&sort_order=${sort_order}&sort_by=${sort_by}`,
        method: "POST",
        body: { }
      }),
      // transformResponse: (res: {data: Invoice[]}) => res.data,
      async onQueryStarted({page = 1, keyword}, {dispatch, queryFulfilled}){
        try{
          const { data } = await queryFulfilled;
          dispatch(updateInvoices({ page: page!, keyword , invoices: data.data, lastPageReached: data.last_page === page})) 
        } catch {}
      }
    }),
    getInvoiceDetails: builder.query<Invoice, any>({
      query: (id)=> ({
        url: `invoices/show/${id}`,
        method: "POST",
        body: { }
      }),
      transformResponse: (response: Invoice) => response
    }),
    deleteInvoices: builder.mutation<Invoice, any>({
      query: (id)=> ({
        url: `invoices/delete`,
        method: "POST",
        body: { id }
      }),
      transformResponse: (response: Invoice) => response
    }),
    getUnpaidInvoice: builder.mutation<Invoice, any>({
      query: ({ page = 1, keyword }) => ({
        url: `invoices/unpaid?page=${page}&keyword=${keyword}`,
        method: "POST",
        body: { }
      }),
      transformResponse: (response: Invoice) => response
    }),
    resendOTP: builder.mutation<any, any>({
      query: ({ id }) => ({
        url: `resend_otp?invoice_id=${id}`,
        method: "POST",
        body: { }
      }),
      transformResponse: (response: any) => response
    }),
    VerifyInvoiceReturn: builder.mutation<{ batch_id:string | number, return_ids:string }, {batch_id:string | number; return_ids:string}>({
      query: ({batch_id,return_ids}) => ({
        url: `invoices/verify_returns?batch_id=${batch_id}&return_ids=${return_ids}`,
        method: "POST",
        body: {  }
      })

    }),
  }),

});

export const { useGetInvoicesMutation, useGetInvoiceDetailsQuery, useDeleteInvoicesMutation, useGetUnpaidInvoiceMutation, useResendOTPMutation, useVerifyInvoiceReturnMutation} = invoicesApiSlice;
