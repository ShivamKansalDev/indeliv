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
    })
  }),
});

export const { 
  useForgotPasswordMutation,
  useLoginMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useGetUserMutation
} = authApiSlice;
