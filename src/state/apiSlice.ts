// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HOST, TOKEN_STORAGE } from '@/utils/constants';

export const apiSlice = createApi({
  tagTypes: [],
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({
    baseUrl: `${HOST[process.env.NODE_ENV]}/api`,
    prepareHeaders: (headers) => {
      if(localStorage.getItem(TOKEN_STORAGE)){
        headers.set(
          'Authorization',
          `Bearer ${localStorage.getItem(TOKEN_STORAGE)}`
        );
      }else{
        console.log("@@@ NO TOKEN");
      }
    },
  }),

  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
  }),
});

// export const {} = apiSlice;
