export interface BatchCollectionItem {
    id: number;
    batch_id: number;
    item_name: string;
    quantity: number;
    price: string; // Consider using number if it's always a numeric value
    created_at: string;
    updated_at: string;
}

export default interface BatchCollection {
    id: number;
    name: string;
    time: string;
    avatar: string;
    amount: string;
    status: string;
    totalCount: number;
    completedCount: number;
}

export const batchKeyHeadMap: Record<string, { head: string; sortable: boolean }> = {
    batches: { head: "Batches", sortable: true },
    amount: { head: "Amount", sortable: false },
    status: { head: "Status", sortable: false },
    progress: { head: "Progress", sortable: false },
};

export type batchHead = (typeof batchKeyHeadMap)[keyof BatchCollection];
export type BatchKey = keyof BatchCollection

export const batchKeys = Object.keys(batchKeyHeadMap);
export const batchHeadings = Object.values(batchKeyHeadMap);

export const getKeyFromHead = (head: string): keyof BatchCollection | undefined => {
    const entry = Object.entries(batchKeyHeadMap).find(([key, value]) => value.head === head);
    return entry ? entry[0] as keyof BatchCollection : undefined;
};

