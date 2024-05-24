import Invoice from "@/types/Invoice"
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface InvoicesState  {
    invoices: Invoice[];
    page: number;
    keyword?: string;
    lastPageReached: boolean;
}

const initialState: InvoicesState = {
    invoices: [],
    page: 1,
    keyword:undefined,
    lastPageReached: false
}

export const invoicesSlice = createSlice({
    name: 'invoices',
    initialState,
    reducers: {
        setInvoices: (state, action: PayloadAction<Invoice[]>) => {
            state.invoices = action.payload;
        },
        updateInvoices: (state, action: PayloadAction<InvoicesState>) => {
            if((state.keyword??'') !== (action.payload.keyword??'')){
                state.keyword = action.payload.keyword
                state.page = 1;
                state.invoices = [...action.payload.invoices]
            }
            else if(state.page < action.payload.page){
                state.invoices = [...state.invoices, ...action.payload.invoices]
                state.page++;
            }
            else if(!state.invoices.length){
                state.invoices = [...state.invoices, ...action.payload.invoices]
            }
            state.lastPageReached = action.payload.lastPageReached;
        },
        clearState: (state) => {
            state.invoices = [];
            state.page = 1;
            state.keyword = undefined;
        }
    }
})

export const {updateInvoices, setInvoices, clearState} = invoicesSlice.actions

export default invoicesSlice.reducer