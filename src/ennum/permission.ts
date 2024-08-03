interface PermissionMapping {
    [key: string]: string; // Dynamic keys with string values
}

const permissions: PermissionMapping = {
    role_name: "Delivery",
    role_collection: "Collection",
    delivery: "delivery",
    collection: "collection",
};

export default permissions;
