import { Vehicle } from "@/pages/dashboard/vehicles/VehicleBody";

export const vehicleSearchFilter = (searchText: string = "", data: Vehicle[]) => {
    return data.filter((item: Vehicle) => {
        const keys = Object.keys(item).filter((subItem) => {
            if((subItem === "name") || (subItem === "vehicle_type")){
                return true
            }
            return false;
        })
        return keys.some((subItem) => {
            const searchData: any = Object.assign({}, item);
            const value: string = searchData[subItem];
            return value.toLowerCase().substring(0, searchText.length) === searchText.toLowerCase()
        })
    })
}