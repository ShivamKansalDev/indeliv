import Invoice from "@/types/Invoice";
import User from "@/types/User";

export interface PaymentItem {
  id: number;
  payment_id: number;
  item_name: string;
  quantity: number;
  price: string; // Consider using number if it's always a numeric value
  created_at: string;
  updated_at: string;
}

export default interface Payment {
  id: number;
  invoice_id: string;////change to Invoice number after getting API
  amount: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  invoice : Invoice;
  user: User;
  payment_date: string;
  method: string,
  tally_company: string;
  collected_by: string;
  invoice_number: string;
  company_name: string;
  buyer_name: string;
  user_name?: string;
}

export const paymentKeyHeadMap: Record<string, { head: string; sortable: boolean; key?: string; }> = {

  id: { head: "ID#", sortable: true,key:"id" },
  created_at: { head: "Date", sortable: true,key:"created_at" },
  tally_company: { head: "Company Name", sortable: true,key:'company_name' },
  collected_by: {head: "Collected By", sortable: true,key:'user_name'},
  invoice_number: { head: "Invoice No.", sortable: true,key:'invoice_id' },//change to Invoice number after getting API
  buyer_name: { head: "Buyer", sortable: true,key:'buyer_name' },
  payment_method: { head: "Payment Method", sortable: true,key:'method' },
  amount: { head: "Amount", sortable: true,key:'amount' },
};

export type paymentHead = (typeof paymentKeyHeadMap)[keyof Payment];
export type PaymentKey = keyof Payment

export const paymentKeys = Object.keys(paymentKeyHeadMap);
export const paymentHeadings = Object.values(paymentKeyHeadMap);

export const getKeyFromHead = (head: string): keyof Payment | undefined => {
  const entry = Object.entries(paymentKeyHeadMap).find(([key, value]) => value.head === head);
  return entry ? entry[0] as keyof Payment : undefined;
};

