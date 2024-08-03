import { API } from "./index";

export const getRoles = () => API.post('roles', null);

export const deleteEmployee = (id: number) => API.post(`users/delete/${id}`, null);

export const updateEmployeeStatus = (data: string) => API.post(`users/update_status?${data}`, null);

export const createUpdateUser = (data: string, image: FormData) => API.post(`users/${data}`, image,
{
    headers: {
        "Content-Type": "multipart/form-data"
    }
});