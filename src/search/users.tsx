import { User } from "@/pages/dashboard/employees/users/UserBody";

export const userSearchFilter = (searchText: string = "", data: User[]) => {
    return data.filter((item: User) => {
        const keys = Object.keys(item).filter((subItem) => {
            if((subItem === "first_name") || (subItem === "last_name") || (subItem === "name") || (subItem === "role_name") || (subItem === "phone")){
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