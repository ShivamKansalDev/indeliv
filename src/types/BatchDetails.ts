import Invoice from "@/types/Invoice";
import { Assignee, Assosiate, Vehicle } from "@/types/Batch";

export interface BatchDetailsItem {
    invoice_number: string;
    date: string;
    buyer_name: string;
    invoice_amount: string;
    status: string;
    payment_amount: string;
    due_amount: string;
    totalCount: number;
    completedCount: number;
    payment?: number;
}

export default interface BatchDetails {
    id: number;
    name: string;
    time: string;
    avatar: string;
    vehicle: Vehicle;
    invoices: Invoice[];
    associate: Assosiate;
    assignee: Assignee;
    amount: string;
    status: string;
    payment?: number;
    due_amount?: number;
    totalCount: number;
    completedCount: number;
    batch_number?: number;
    batch_type?: string;
    buyer_name?: string;
    payments?: any[];
}

export const batchDetailsKeyHeadMap: Record<string, { head: string; sortable: boolean; key?: string; }> = {
    invoice_number: { head: "Invoice No.", sortable: true, key: "invoice_number" },
    invoice_date: { head: "Date", sortable: true, key: "invoice_date" },
    buyer_name: { head: "Buyer", sortable: true, key: "buyer.name" },
    invoice_amount: { head: "Amount", sortable: true, key: "invoice_amount" },
    amount_received: { head: "Payment", sortable: true, key: "amount_received" },
    amount_due: { head: "Due Amount", sortable: true, key: "amount_due" },
    status: { head: "Status", sortable: true, key: "status" },
    action: { head: "Action", sortable: false },
};
export const deliveryDetailsKeyHeadMap: Record<string, { head: string; sortable: boolean }> = {
    number: { head: "#", sortable: true },
    invoice_number: { head: "Invoice No.", sortable: true },
    // date: { head: "Date", sortable: true },
    buyer_name: { head: "Buyer", sortable: true },
    amount: { head: "Amount", sortable: true },
    // payment: { head: "Payment", sortable: true },
    // due_amount: { head: "Due Amount", sortable: false },
    status: { head: "Status", sortable: true },
    // action: { head: "Action", sortable: false },
};
export const CollectionDetailsKeyHeadMap: Record<string, { head: string; sortable: boolean }> = {
    number: { head: "#", sortable: true },
    invoice_number: { head: "Invoice No.", sortable: true },
    buyer_name: { head: "Buyer", sortable: true },
    due_amount: { head: "Due", sortable: true },
    date: { head: "Date", sortable: true },
    payment: { head: "Overdue By", sortable: true },
    amount: { head: "Amount", sortable: true },
    status: { head: "Status", sortable: true },
    // action: { head: "Action", sortable: false },
};

export type batchDetailsHead = (typeof batchDetailsKeyHeadMap)[keyof BatchDetails];
export type BatchDetailsKey = keyof BatchDetails

export const batchDetailsKeys = Object.keys(batchDetailsKeyHeadMap);
export const batchDetailsHeadings = Object.values(batchDetailsKeyHeadMap);
export const deliveryDetailsHeadings = Object.values(deliveryDetailsKeyHeadMap);
export const collectionDetailsHeadings = Object.values(CollectionDetailsKeyHeadMap);

export const getKeyFromHead = (head: string): keyof BatchDetails | undefined => {
    const entry = Object.entries(batchDetailsKeyHeadMap).find(([key, value]) => value.head === head);
    return entry ? entry[0] as keyof BatchDetails : undefined;
};

