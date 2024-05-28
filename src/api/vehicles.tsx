import { API } from "./index";

export const listVehicles = () => API.post("vehicles", null);

export const vehiclesTypes = () => API.post("vehicletypes", null);

export const updateVehicle = (data: string) => API.post(`/vehicles/update/${data}`, null);

export const createVehicle = (data: string) => API.post(`/vehicles/create?${data}`, null);