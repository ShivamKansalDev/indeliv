export interface Payment{
    date: string;
    id: string;
    associate: string;
    payment_method: PaymentMethods,
    amount: string; 
}

// also update them in the batch-detail.scss file
export enum PaymentMethods{
    Cash ="Cash",
    Cheque = "Cheque",
    Online = 'Online' 
}