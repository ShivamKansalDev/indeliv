import Payment from "@/types/Payment"
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface PaymentsState  {
    payments: Payment[];
    page: number;
    keyword?: string;
    lastPageReached: boolean;
}

const initialState: PaymentsState = {
    payments: [],
    page: 1,
    keyword:undefined,
    lastPageReached: false
}

export const paymentsSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {
        setPayments: (state, action: PayloadAction<Payment[]>) => {
            state.payments = action.payload;
        },
        updatePayments: (state, action: PayloadAction<PaymentsState>) => {
            if((state.keyword??'') !== (action.payload.keyword??'')){
                state.keyword = action.payload.keyword
                state.page = 1;
                state.payments = [...action.payload.payments]
            }
            else if(state.page < action.payload.page){
                state.payments = [...state.payments, ...action.payload.payments]
                state.page++;
            }
            else if(!state.payments.length){
                state.payments = [...state.payments, ...action.payload.payments]
            }
            state.lastPageReached = action.payload.lastPageReached;
        },
        editPaymentInState: (state, action: PayloadAction<Payment>) => {
            const index = state.payments.findIndex(payment => payment.id === action.payload.id);
            if (index !== -1) {
                state.payments[index] = action.payload;
            }
        },
        clearState: (state) => {
            state.payments = [];
            state.page = 1;
            state.keyword = undefined;
        },
        removePaymentFromState: (state, action: PayloadAction<number | string>) => {
            const id = action.payload;
            state.payments = state.payments.filter(payment => payment.id !== id);
        },
    }
})

export const {updatePayments, setPayments, clearState,editPaymentInState, removePaymentFromState} = paymentsSlice.actions

export default paymentsSlice.reducer