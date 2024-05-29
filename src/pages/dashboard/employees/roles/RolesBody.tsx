import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Input from "@/pages/(auth)/components/Input";
import "./RolesBody.css";
import DeleteRoleModal from "./DeleteRoleModel";
import { API } from "@/api";
import { createRole, permissionList, updateRole, viewRole } from "@/api/roles";

interface Role {
  id: number;
  name: string;
  users: number;
}
interface Permission {
  id: number;
  name: string;
}

const roles = [
  {
    id: "1",
    title: "Admin",
    subTitle: "8 Users",
  },
  {
    id: "2",
    title: "Manager",
    subTitle: "8 Users",
  },
  {
    id: "3",
    title: "Sales Associate",
    subTitle: "8 Users",
  },
  {
    id: "4",
    title: "Delivery Associate",
    subTitle: "8 Users",
  },
];

const screens = [
  {
    id: "table1",
    name: "Invoices",
  },
  {
    id: "table2",
    name: "Batches",
  },
  {
    id: "table3",
    name: "Payments",
  },
  {
    id: "table4",
    name: "Employees-Users",
  },
  {
    id: "table5",
    name: "Employees-Roles",
  },
  {
    id: "table6",
    name: "Vehicles",
  },
];

interface RoleData{
  id: number;
  name: string;
  users: number;
  permissions: [];
}

interface PermissionsList{
  id: number;
  name: string;
}

interface EachScreen{
  id: number;
  name: string;
  permissions: number[];
}

const RolesBody = () => {
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [roles2, setRoles2] = useState(roles);
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState<boolean | null>(false);
  const [showEditInput, setShowEditInput] = useState<boolean | null>(false);
  const [editValue, setEditValue] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rolesList, setRolesList] = useState<Role[]>([]);
  const [screenList, setScreenList] = useState<Permission[]>([]);
  const [roleData, setRoleData] = useState<RoleData | null>();
  const [permissions, setPermissions] = useState<PermissionsList[]>([]);
  const [rolesScreen, setRolesScreen] = useState([]);

  const handleButtonClick = () => {
    setShowInput(!showInput);
  };

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
    event.preventDefault();
    console.log(inputValue);
    setEditValue(event.target.value);
  };

  const handleAddRole = () => {
    if (inputValue.trim() === "") {
      setShowInput(false);
      return;
    }

    const newRole = `name=${inputValue}&permissions=1`  // api permissions check
    
    createNewRole(newRole);
    setShowInput(false);
    setInputValue("");
  };

  const handleEditClick = () => {
    setShowEditInput(!showEditInput);
    setEditValue(rolesList[selectedRole!].name);
  };

  const editRole = (index: number) => {
    let new_roles = rolesList;
    new_roles[index].name = editValue;
    setRolesList(new_roles);
    setEditValue("");
    setShowEditInput(false);
  };

  useEffect(() => {
    getPermissions();
    getRolesList();
  }, []);

  useEffect(() => {
    if(permissions.length > 0){
      let newData: EachScreen[] = [];
      for (let index: number = 0; index < permissions.length; index++) {
        if((index+1) % 4 === 0){
          console.log("### INDEX: ", index + 1);
          const splitArray: string[] = permissions[index]['name'].split("_");
          // const splitArray: string[] = "invoice_view".split("_");
          if(splitArray.length === 2){
            const screenName = splitArray[0];
            let permissionIDs: number[] = [];
            const startIndex: number = (index + 1) - 4;
            for(let i: number = startIndex; i < (index + 1); i++){
              const id: number = permissions[i]['id'];
              permissionIDs.push(id)
            }
            const eachScreen: EachScreen = {
              id: startIndex + 1,
              name: screenName,
              permissions: permissionIDs
            }
            newData.push(eachScreen)
          }else if(splitArray.length > 2){
            splitArray.pop();
            const screenName = splitArray.join("-");
            let permissionIDs: number[] = [];
            const startIndex: number = (index + 1) - 4;
            for(let i: number = startIndex; i < (index + 1); i++){
              const id: number = permissions[i]['id'];
              permissionIDs.push(id)
            }
            const eachScreen: EachScreen = {
              id: startIndex + 1,
              name: screenName,
              permissions: permissionIDs
            }
            newData.push(eachScreen)
          }
        }
      }
      console.log("@@@ PERMISSIONS SCREEN: ", newData);
    }
  }, [permissions]);

  async function getPermissions() {
    try {
      const response = await permissionList();
      const data = response.data;
      setPermissions(data);
    } catch (error) {
      console.log("!!! PERMISSIONS ERROR: ", error);
    }
  }

  async function getRolesList() {
    try {
      const response = await API.post("roles", null);
      setRolesList(response.data);
    } catch (error) {
      console.log("!!! USERS ERROR: ", error);
    }
  }

  async function createNewRole(newRole: string){
    try {
      const response = await createRole(newRole);
      // setRolesList(response.data);
      console.log(response)
      getRolesList();
    } catch (error) {
      console.log("!!! USERS ERROR: ", error);
    }
  }

  async function updateRoleAPI(newRole: string){
    try {
      const response = await updateRole(newRole);
      // setRolesList(response.data);
      console.log(response)
      getRolesList();
    } catch (error) {
      console.log("!!! UPDATE ROLE ERROR: ", error);
    }
  }

  async function viewRoleAPI(id: number){
    try {
      const response = await viewRole(id);
      // setRolesList(response.data);
      setRoleData(response.data);
      console.log("@@@ VIEW ROLE: ", response.data);
    } catch (error) {
      console.log("!!! VIEW ROLE ERROR: ", error);
    }
  }

  // console.log(rolesList)

  return (
    <div className="container-fluid px-0">
      <DeleteRoleModal
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        role={roles2[selectedRole!]}
      />
      <div className="row">
        <div className="col-md-3">
          <div
            className="bg-white p-3 border border-radius overflow-y-scroll"
            style={{}}
          >
            <h5 className="head-font">Roles</h5>
            <div
              className="overflow-y-scroll"
              style={{ maxHeight: "510px", minHeight: "510px" }}
            >
              {rolesList.length>0 && rolesList.map((role, index) => {
                if (selectedRole === index) {
                  return (
                    <div key={`userRole${index}`}>
                      {showEditInput && (
                        <>
                          <div
                            className="position-relative "
                            style={{
                              border: "1px solid rgb(0, 128, 252)",
                              borderRadius: "7px",
                              marginBottom: "5px",
                            }}
                          >
                            <input
                              className="form-control mb-1 w-75 border-0 mt-1"
                              type="text"
                              placeholder={role?.name}
                              value={editValue}
                              onChange={handleInputChange}
                            />
                            <button
                              className="position-absolute top-50  translate-middle-y btn btn-link p-0 m-0"
                              onClick={() => {
                                editRole(index);
                              }}
                              style={{ right: "15px" }}
                            >
                              <span className="text-primary ">Save</span>
                            </button>
                          </div>
                        </>
                      )}

                      <div
                        style={{
                          cursor: "pointer",
                          backgroundColor: "#0080FC",
                        }}
                        className="d-flex gap-3 justify-content-between align-items-center px-2 rounded py-1 "
                        key={`role${role.id}`}
                      >
                        <div className="py-2 lh-1" key={`role${role.id}`}>
                          <p className="m-0 title-font text-white">
                            {role.name}
                          </p>
                          <small className="m-0 subTitle-font text-white">
                            ({role.users}) Users
                          </small>
                        </div>
                        <div>
                          <ul className="list-unstyled lh-lg d-flex gap-2 m-0">
                            <li
                              onClick={(e) => {
                                // e.stopPropagation();
                                handleEditClick();
                              }}
                            >
                              <img
                                src="/assets/Icon/Edit-White.svg"
                                className="text-white"
                                alt="edit"
                              />
                            </li>
                            <li
                              onClick={(e) => {
                                // e.stopPropagation();
                                setDeleteModalOpen(!deleteModalOpen);
                              }}
                            >
                              <img
                                src="/assets/Icon/trash-white.svg"
                                alt="trash"
                              />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={`userRole${index}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedRole(index);
                      setShowEditInput(false);
                      viewRoleAPI(role.id)
                    }}
                    className="d-flex gap-3 justify-content-between align-items-center px-2 py-1"
                  >
                    <div className="py-2 lh-1" key={`role${role.id}`}>
                      <p className="m-0 title-font">{role.name}</p>
                      <small className="m-0 subTitle-font">
                        ({role.users}) Users
                      </small>
                    </div>
                    <div>
                      <ul className="list-unstyled lh-lg d-flex gap-2 m-0">
                        <li>
                          <img src="/assets/Icon/Edit.svg" alt="edit" />
                        </li>
                        <li>
                          <img src="/assets/Icon/trash.svg" alt="trash" />
                        </li>
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3">
              {showInput && (
                <>
                  <div className="position-relative">
                    <input
                      className="form-control mb-3"
                      type="text"
                      placeholder="Role Name"
                      value={inputValue}
                      onChange={handleInputChange}
                    />
                    {inputValue && (
                      <button
                        className="position-absolute top-50  translate-middle-y btn btn-link p-0 m-0"
                        onClick={() => setInputValue("")}
                        style={{ right: "15px" }}
                      >
                        <img src="/assets/Icon/close-circle.svg" alt="clear" />
                      </button>
                    )}
                  </div>
                </>
              )}
              {showInput ? (
                <button
                  className="btn btn-primary w-100 mx-auto"
                  onClick={handleAddRole}
                >
                  {inputValue.trim() === "" ? "Close" : "Save"}
                </button>
              ) : (
                <button
                  className="btn btn-primary w-100 mx-auto"
                  onClick={handleButtonClick}
                >
                  {" "}
                  + Add new role
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <div
            className="bg-white border"
            style={{ borderRadius: "12px", overflow: "hidden" }}
          >
            <div
              className="p-3 pb-1 border-bottom"
              style={{ backgroundColor: "#F9FAFB" }}
            >
              <h5 className="head-font">Manager</h5>
            </div>
            <div
              className="overflow-y-scroll p-3"
              style={{ maxHeight: "575px", minHeight: "575px" }}
            >
              <div className="table-responsive">
                <table className="table  border">
                  <thead style={{ backgroundColor: "#F9FAFB" }}>
                    <tr>
                      <th style={{ backgroundColor: "#F9FAFB" }} scope="col">
                        <p
                          className="m-0 py-1"
                          style={{ fontSize: "14px", fontWeight: "normal" }}
                        >
                          Module
                        </p>
                      </th>
                      <th
                        className="text-center"
                        style={{ backgroundColor: "#F9FAFB" }}
                        scope="col"
                      >
                        <p
                          className="m-0 py-1"
                          style={{ fontSize: "14px", fontWeight: "normal" }}
                        >
                          View
                        </p>
                      </th>
                      <th
                        className="text-center"
                        style={{ backgroundColor: "#F9FAFB" }}
                        scope="col"
                      >
                        <p
                          className="m-0 py-1"
                          style={{ fontSize: "14px", fontWeight: "normal" }}
                        >
                          Create
                        </p>
                      </th>
                      <th
                        className="text-center"
                        style={{ backgroundColor: "#F9FAFB" }}
                        scope="col"
                      >
                        <p
                          className="m-0 py-1"
                          style={{ fontSize: "14px", fontWeight: "normal" }}
                        >
                          Edit
                        </p>
                      </th>
                      <th
                        className="text-center"
                        style={{ backgroundColor: "#F9FAFB" }}
                        scope="col"
                      >
                        <p
                          className="m-0 py-1"
                          style={{ fontSize: "14px", fontWeight: "normal" }}
                        >
                          Delete
                        </p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {screens.map((screen) => {
                      return (
                        <tr key={screen.id} className="">
                          <td className="" scope="row">
                            <p style={{}} className="my-1 py-1">
                              {screen?.name}
                            </p>
                          </td>
                          <td className="text-center">
                            <input
                              style={{ marginTop: "12px" }}
                              className="py-1"
                              type="checkbox"
                              name=""
                              id=""
                            />
                          </td>
                          <td className="text-center">
                            <input
                              style={{ marginTop: "12px" }}
                              className="py-1"
                              type="checkbox"
                              name=""
                              id=""
                            />
                          </td>
                          <td className="text-center">
                            <input
                              style={{ marginTop: "12px" }}
                              className="py-1"
                              type="checkbox"
                              name=""
                              id=""
                            />
                          </td>
                          <td className="text-center">
                            <input
                              style={{ marginTop: "12px" }}
                              className="py-1"
                              type="checkbox"
                              name=""
                              id=""
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesBody;
