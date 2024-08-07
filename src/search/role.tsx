import { Role } from "@/pages/dashboard/employees/roles/RolesBody";

 

export const roleSearchFilter = (searchText: string = "", data: Role[]) => {
    return data.filter((item: Role) => {
        const keys = Object.keys(item).filter((subItem) => {
            if((subItem === "name")){
                return true
            }
            return false;
        })
        console.log("@@@ USER KEYS: ", keys);
        return keys.some((subItem) => {
            const searchData: any = Object.assign({}, item);
            const value: string = searchData[subItem];
            return value.toLowerCase().substring(0, searchText.length) === searchText.toLowerCase()
        })
    })
}