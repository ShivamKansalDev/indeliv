import Batch from "@/types/Batch"
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import BatchDetails from "@/types/BatchDetails";

export interface BatchsState  {
    batchs: Batch[];
    page: number;
    keyword?: string;
    lastPageReached: boolean;
}
export interface BatchsStateSingle  {
    batchs: BatchDetails[];
    page: number;
    keyword?: string;
    lastPageReached: boolean;
}
export interface BatchsDetailsState  {
    batchs: BatchDetails[];
    page: number;
    keyword?: string;
    lastPageReached: boolean;
}
const initialState: BatchsState = {
    batchs: [],
    page: 1,
    keyword:undefined,
    lastPageReached: false
}

export const batchsSlice = createSlice({
    name: 'batchs',
    initialState,
    reducers: {
        setBatchs: (state, action: PayloadAction<Batch[]>) => {
            state.batchs = action.payload;
        },
        setBatchDetails:(state:BatchsDetailsState, action: PayloadAction<Batch[]>) => {
            state.batchs = action.payload;
        },
        updateBatchs: (state, action: PayloadAction<BatchsState>) => {
            console.log(action.payload)
            if((state.keyword??'') !== (action.payload.keyword??'')){
                state.keyword = action.payload.keyword
                state.page = 1;
                state.batchs = [...action.payload.batchs]
            }
            else if(state.page < action.payload.page){
                state.batchs = [...state.batchs, ...action.payload.batchs]
                state.page++;
            }
            else if(!state.batchs.length){
                state.batchs = [...state.batchs, ...action.payload.batchs]
            }
            state.lastPageReached = action.payload.lastPageReached;
        },
        getBatchSingle: (state, action: PayloadAction<BatchsState>) => {
            console.log(action.payload)
            if((state.keyword??'') !== (action.payload.keyword??'')){
                state.keyword = action.payload.keyword
                state.page = 1;
                state.batchs = {...action.payload.batchs}
            }
            else if(state.page < action.payload.page){
                state.batchs = {...state.batchs, ...action.payload.batchs}
                state.page++;
            }
            else if(!state.batchs.length){
                state.batchs = {...state.batchs, ...action.payload.batchs}
            }
            state.lastPageReached = action.payload.lastPageReached;
        },
        updateSingleBatch: (state, action) => {
            const { id, data } = action.payload;
            const index = state.batchs.findIndex(batch => batch.id === id);
            if (index !== -1) {
                state.batchs[index] = { ...state.batchs[index], ...data };
            }
        },
        clearState: (state) => {
            state.batchs = [];
            state.page = 1;
            state.keyword = undefined;
        },
        removeInvoiceFromBatchState: (state, action) => {
            const { batchId, invoiceIds } = action.payload;
            const batchIndex = state.batchs.findIndex(batch => batch.id === batchId);
            if (batchIndex !== -1) {
                // Assuming 'invoices' is an array of invoice IDs in each batch
                state.batchs[batchIndex].invoices = state.batchs[batchIndex].invoices.filter(invoiceId => !invoiceIds.includes(invoiceId));
            }
        },
    }
})

export const {updateBatchs, setBatchs,getBatchSingle, setBatchDetails, clearState,updateSingleBatch, removeInvoiceFromBatchState} = batchsSlice.actions

export default batchsSlice.reducer