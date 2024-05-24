import Invoice from "@/types/Invoice";

export interface Vehicle {
    id: number;
    name: number;
    type: any;
    vehicle_type: any;
    created_at: string;
    updated_at: string;
}
export interface AssociatesAndVehicles {
    associates: Assosiate[];
    assignees: Assignee[];
    vehicles: Vehicle[];
}
export interface Assosiate {
    id: number;
    name: string;
    phone: string;
    email: string;
    email_verified_at: number;
    role: string;
    created_at: string;
    updated_at: string;
    role_name?: string;
}
export interface Assignee {
    id: number;
    name: string;
    phone: string;
    email: string;
    email_verified_at: number;
    role: string;
    created_at: string;
    updated_at: string;
    image: string;
    first_name: string;
    last_name: string;
    role_name?: string;
    image_path?: string;
}

export default interface Batch {
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
    totalCount: number;
    completedCount: number;
    payment?: number;
    due_amount?: number;
    batch_number?: number;
    updated_at?: any;
    delivered_invoices?: number;
    complete_invoices?: number;
    total_invoices?: number;
}

export const batchKeyHeadMap: Record<string, { head: string; sortable: boolean; key?: string; }> = {
    id: { head: "Batches", sortable: true, key: "batch_number" },
    vehicleType: { head: "Vehicle type", sortable: true, key: "vehicle_type" },
    amount: { head: "Amount", sortable: true, key: "batch_amount" },
    status: { head: "Status", sortable: true, key: "status" },
    progress: { head: "Progress", sortable: false },
};

export type batchHead = (typeof batchKeyHeadMap)[keyof Batch];
export type BatchKey = keyof Batch

export const batchKeys = Object.keys(batchKeyHeadMap);
export const batchHeadings = Object.values(batchKeyHeadMap);

export const getKeyFromHead = (head: string): keyof Batch | undefined => {
    const entry = Object.entries(batchKeyHeadMap).find(([key, value]) => value.head === head);
    return entry ? entry[0] as keyof Batch : undefined;
};

