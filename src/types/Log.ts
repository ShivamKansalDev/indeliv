export default interface Log {
  id: number;
  user_id: number;
  activity_type: string;
  activity_log: string;
  created_at: string;
  updated_at: string;
  message: string;
  phone: string;
  username: string;
}

export const logKeyHeadMap: Record<keyof Log, {head: string, sortable: boolean, key?: string}> = {
    id: {head: "", sortable: false},
    created_at: {head: "Time", sortable: true, key: 'created_at'},
    user_id: {head: "User", sortable: true, key: 'user_id'},
    activity_type: {head: "", sortable: false},
    activity_log: {head: "Log", sortable: true, key: 'activity_log'},
    updated_at: {head: "", sortable: false},
    message: {head: "Log", sortable: false,  },
    phone: {head: "", sortable: false},
    username: {head: "User", sortable: false,  },
}

export type LogHead = (typeof logKeyHeadMap)[keyof Log];
export type LogKey = keyof Log
export const logKeys = Object.keys(logKeyHeadMap);
export const logHeadings = Object.values(logKeyHeadMap);

export const getKeyFromHead = (head: string): keyof Log | undefined => {
    const entry = Object.entries(logKeyHeadMap).find(([key, value]) => value.head === head);
    return entry ? entry[0] as keyof Log : undefined;
};

