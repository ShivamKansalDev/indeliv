import Batch from "./Batch";

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  item_name: string;
  item_id: number;
  quantity: number;
  price: string; // Consider using number if it's always a numeric value
  created_at: string;
  updated_at: string;
  unit_price: number;
  reference_id?: number;
}

export default interface Invoice {
  id: number;
  invoice_number: string;
  invoice_date: string;
  preview: any;
  buyer_name: string;
  buyer_address: string;
  contact_number: string;
  invoice_amount: string; // Consider using number if it's always a numeric value
  tally_company: string;
  created_at: string;
  updated_at: string;
  items: InvoiceItem[];
  overdueBy?: string;
  due: string;
  checked?: boolean;
  batch_id?: number;
  company_name: string;
  buyer: {
    name: string;
    address: string;
    phone: string;
  }
  status?: string;
  amount_received?: string;
  payments?: any[];
  returns?: any[];
  amount_due?: any;
  is_verified?: boolean;
  items_quantity?: string;
  amount_returned?: number;
  returns_quantity?: any;
  batch? : Batch[];
  batch_number?: string;
}

export const invoiceKeyHeadMap: Record<keyof Invoice, { head: string; sortable: boolean, key?: string }> = {
  invoice_number: { head: "Invoice No.", sortable: true, key: "invoice_number" },
  invoice_date: { head: "Date", sortable: true, key: "invoice_date" },
  buyer_name: { head: "Buyer", sortable: true, key: "buyers.name" },
  preview: { head: "Items", sortable: false, key: "preview.name" },
  company_name: { head: "Company", sortable: true, key: "company_name" },
  tally_company: { head: "", sortable: true, },
  invoice_amount: { head: "Amount", sortable: true, key: "invoice_amount" },
  due: { head: "Due", sortable: false, },
  overdueBy: { head: "Overdue By", sortable: false, },
  buyer_address: { head: "", sortable: false, },
  checked: { head: "", sortable: false, },
  contact_number: { head: "", sortable: false, },
  created_at: { head: "", sortable: false, },
  id: { head: "", sortable: false, },
  items: { head: "", sortable: false, },
  updated_at: { head: "", sortable: false, },
  batch_id: { head: "", sortable: false, },
  buyer: { head: "", sortable: false, },
  status: { head: "", sortable: false, },
  amount_received: { head: "", sortable: false, },
  payments: { head: "", sortable: false, },
  returns: { head: "", sortable: false, },
  amount_due: { head: "", sortable: false, },
  is_verified: { head: "", sortable: false, },
  items_quantity: { head: "", sortable: false, },
  amount_returned: { head: "", sortable: false, },
  returns_quantity: { head: "", sortable: false, },
  batch: { head: "", sortable: false, },
  batch_number: { head: "", sortable: false, },
};

export type InvoiceHead = (typeof invoiceKeyHeadMap)[keyof Invoice];
export type InvoiceKey = keyof Invoice

export const invoiceKeys = Object.keys(invoiceKeyHeadMap);
export const invoiceHeadings = Object.values(invoiceKeyHeadMap);

export const getKeyFromHead = (head: string): keyof Invoice | undefined => {
  const entry = Object.entries(invoiceKeyHeadMap).find(([key, value]) => value.head === head);
  return entry ? entry[0] as keyof Invoice : undefined;
};