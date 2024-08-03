import { configureStore } from '@reduxjs/toolkit';
// import authTokenSlice, { resetToken } from './slices/authTokenSlice';
// import userSlice, { resetUser } from './slices/userSlice';
import { apiSlice } from './apiSlice';
import invoicesReducer from './slices/invoices/invoicesSlice'
import paymentsReducer from './slices/payments/paymentsSlice'
import batchsReducer from "./slices/batchs/batchsSlice"
import logsReducer from './slices/logs/logsSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    invoices: invoicesReducer,
    payments: paymentsReducer,
    batchs: batchsReducer,
    logs: logsReducer
    // authToken: authTokenSlice,
    // user: userSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
