import { API } from "./index";

export const deleteEmployee = (id: number) => API.post(`users/delete/${id}`, null);

export const updateEmployeeStatus = (data: string) => API.post(`users/update_status?${data}`, null);