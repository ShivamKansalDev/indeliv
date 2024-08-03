import {  apiSlice } from '../../apiSlice';
import Payment from '@/types/Payment';
import { userToken } from '@/utils/helper';
import {updatePayments, removePaymentFromState, editPaymentInState} from './paymentsSlice';

// export const paymentsApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getPayments: builder.mutation<{data: Payment[], last_page: number},  {page?: number, keyword?: string}>({
//       query: ({page = 1, keyword = ''})=> ({
//         url: `payments?page=${page}&keyword=${keyword}`,
//         method: "POST",
//         body: { token: userToken()}
//       }),
//       // transformResponse: (res: {data: Payment[]}) => res.data,
//       async onQueryStarted({page = 1, keyword}, {dispatch, queryFulfilled}){
//         try{
//           const { data } = await queryFulfilled;
//           dispatch(updatePayments({ page: page!, keyword , payments: data.data, lastPageReached: data.last_page === page}))
//         } catch {}
//       }
//     })
//   }),
// });



export const paymentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.mutation<{data: Payment[], last_page: number},  {page?: number, keyword?: string, to?:string, from?: string, sort_by?: string,sort_order?: string}>({
      query: ({page = 1, keyword = '', to="", from="", sort_order = 'DESC', sort_by = 'id'})=> ({
        url: `payments?page=${page}&keyword=${keyword}&to=${to}&from=${from}&sort_order=${sort_order}&sort_by=${sort_by}`,
        method: "POST",
        body: {  }
      }),
      async onQueryStarted({page = 1, keyword}, {dispatch, queryFulfilled}){
        try{
          const { data }: any = await queryFulfilled;
          dispatch(updatePayments({ page: page!, keyword, payments: data.data, lastPageReached: data.last_page === page}))
        } catch {}
      }
    }),
    editPayment: builder.mutation<Payment, {payment_id: number | string; amount: number| string}>({
      query: ({payment_id, amount}) => ({
        url: `payments/update?payment_id=${payment_id}&amount=${amount}`,
        method: "POST",
        body: {  }
      }),

    }),
    deletePayment: builder.mutation<{ success: boolean; payment: any }, { payment: any }>({
      query: ({ payment }: any) => ({
          url: payment?.method === 'Product Return' ? `invoices/delete_returns/${payment.id}` : `payments/delete/${payment.id}`,
          method: "POST",
          body: {  }
        }),
      async onQueryStarted({ payment }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Dispatch action to remove the payment from the state
          dispatch(removePaymentFromState(payment?.id));
        } catch (error) {
          // Optionally handle error
        }
      },

    }),
    VerifyPayment: builder.mutation<{ batch_id:string | number, payment_ids:string }, {batch_id:string | number; payment_ids:string}>({
      query: ({batch_id,payment_ids}) => ({
        url: `payments/verify?batch_id=${batch_id}&payment_ids=${payment_ids}`,
        method: "POST",
        body: {  }
      })

    }),
    addPayment: builder.mutation<Payment, { invoice_id: number | string; amount: number | string, method: string }>({
      query: ({ invoice_id, amount, method }) => ({
        url: `payments/add?invoice_id=${invoice_id}&amount=${amount}&method=${method}`,
        method: "POST",
        body: {}
      }),
      
    }),
  }),
});

export const { useGetPaymentsMutation, useEditPaymentMutation, useDeletePaymentMutation, useVerifyPaymentMutation, useAddPaymentMutation } = paymentsApiSlice;


