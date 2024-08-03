// import IUser from '../../models/IUser';
import {
  // IS_ADMIN_STORAGE,
  TOKEN_STORAGE,
  // USER_STORAGE,
} from '@/utils/constants';
import {  apiSlice } from '../apiSlice';
import { logout, userToken } from '@/utils/helper';
import User from '@/types/User';



export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      { token: string},
      { email: string; password: string }
    >({
      query: (data) => ({
        url: 'login',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        try {
        const { data: res } = await queryFulfilled;
        localStorage.setItem(TOKEN_STORAGE, res.token)
        } catch (err) {
        }
      },
    }),
    sendOTP: builder.mutation<{ token: string }, { phoneOrEmail: string }>({
      query: ({phoneOrEmail}) => ({
        url: `send_otp?phone=${phoneOrEmail}`,
        method: 'POST',
        body: { }
      }),
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        try {
        const { data: res } = await queryFulfilled;
        } catch (err) {
        }
      },
    }),
    checkOTP: builder.mutation<{ token: string }, { otp: string, phone: string | undefined }>({
      query: ({ otp, phone }) => ({
        url: `check_otp?phone=${phone}&code=${otp}`,
        method: 'POST',
        body: { }
      }),
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        try {
        const { data: res } = await queryFulfilled;
        console.log('res', res)
        localStorage.setItem(TOKEN_STORAGE, res.token)
        } catch (err) {
        }
      },
    }),
    logout: builder.mutation<void, void>({
      query: (data) => ({
        url: 'logout',
        method: 'POST',
        body: { },
      }),
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
      
        try {
          await queryFulfilled;
         dispatch(() => logout())
        } catch (err) {
          // console.log(err,"this is error");
          dispatch(() => logout())
        }
    }
    }),
    forgotPassword: builder.mutation<{reset_token: string, email: string}, {email: string, }>({
      query: (data) => ({
        url: 'forgot_password',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<{message: string},  {
      reset_token: string;
      password: string;
      password_confirmation: string,
    }>({
      query: (data) => ({
        url: 'reset_password',
        method: 'POST',
        body: data,
      }),
    }),
    getUser: builder.mutation<User, void>({
      query: (data) => ({
        url: 'user',
        method: 'POST',
        body: {token: userToken()},
      }),
    }),
    resetPasswordValidation: builder.mutation<{reset_token: any}, any>({
      query: ({ reset_token }: any) => ({
        url: `check_reset_token?reset_token=${reset_token}`,
        method: 'POST',
        body: {},
      }),
    }),
    validateDomain: builder.query<void ,void>({
      query: () => ({
        url: 'validate',
        method: 'POST',
      }),
    })
  }),
});

export const { 
  useForgotPasswordMutation,
  useLoginMutation,
  useCheckOTPMutation,
  useSendOTPMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useGetUserMutation,
  useResetPasswordValidationMutation,
  useValidateDomainQuery
} = authApiSlice;
