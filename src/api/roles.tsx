import { API } from "./index";

export const rolesList = () => API.post("roles", null);

export const createRole = (data: string) => API.post(`/roles/create?${data}`, null);

export const permissionList =() => API.post("permissions",null)

export const updateRole =(data: string) => API.post(`roles/update/${data}`,null);

export const viewRole =(id: number) => API.post(`roles/show/${id}`,null);

export const deleteRole =(id: number) => API.post(`roles/delete/${id}`,null);
