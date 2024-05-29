import { API } from "./index";

export const rolesList = () => API.post("roles", null);

export const createRole = (data: string) => API.post(`/roles/create?${data}`, null);

export const permissionList =()=>API.post("permissions",null)
