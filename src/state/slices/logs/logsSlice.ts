import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Log from '@/types/Log';

export interface LogsState {
  logs: Log[];
  page: number;
  keyword?: string;
  lastPageReached: boolean;
  isLoading?: boolean;
}
const initialState: LogsState = {
  logs: [],
  page: 1,
  keyword: undefined,
  lastPageReached: false,
  isLoading: false,
};

export const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    setLogs: (state, action: PayloadAction<Log[]>) => {
      state.logs = action.payload;
    },
    updateIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateLogs: (state, action: PayloadAction<LogsState>) => {
      if ((state.keyword ?? '') !== (action.payload.keyword ?? '')) {
        state.keyword = action.payload.keyword;
        state.page = 1;
        state.logs = [...action.payload.logs];
      } else if (state.page < action.payload.page) {
        state.logs = [...state.logs, ...action.payload.logs];
        state.page++;
      } else if (!state.logs.length) {
        state.logs = [...state.logs, ...action.payload.logs];
      }
      state.lastPageReached = action.payload.lastPageReached;
    },
    clearState: (state) => {
      state.logs = [];
      state.page = 1;
      state.keyword = undefined;
    },
  },
});

export const { setLogs, updateLogs, clearState, updateIsLoading } =
  logsSlice.actions;

export default logsSlice.reducer;
