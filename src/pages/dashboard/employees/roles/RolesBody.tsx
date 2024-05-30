import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Input from "@/pages/(auth)/components/Input";
import "./RolesBody.css";
import DeleteRoleModal from "./DeleteRoleModel";
import { API } from "@/api";
import { createRole, permissionList, updateRole, viewRole } from "@/api/roles";
import { string } from "yup";

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

interface RoleData{
  id: number;
  name: string;
  users: number;
  permissions: [{
    id: number;
    name: string
  }];
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
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roles2, setRoles2] = useState(roles);
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState<boolean | null>(false);
  const [showEditInput, setShowEditInput] = useState<boolean>(false);
  const [editValue, setEditValue] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rolesList, setRolesList] = useState<Role[]>([]);
  const [screenList, setScreenList] = useState<Permission[]>([]);
  const [roleData, setRoleData] = useState<RoleData | null>();
  const [permissions, setPermissions] = useState<PermissionsList[]>([]);
  const [rolesScreen, setRolesScreen] = useState<EachScreen[]>([]);

  const handleButtonClick = () => {
    setShowInput(!showInput);
  };

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
    event.preventDefault();
    setEditValue(event.target.value);
  };

  const handleAddRole = () => {
    if (inputValue.trim() === "") {
      setShowInput(false);
      return;
    }

    const newRole = `name=${inputValue}`  // api permissions check
    
    createNewRole(newRole);
    setShowInput(false);
    setInputValue("");
  };

  const handleEditClick = () => {
    setShowEditInput(true);
    const find = rolesList.find((item) => item.id === selectedRole?.id) 
    if(find){
      setEditValue(find.name);
    }
  };

  const editRole = (index: number) => {
    let new_roles = Array.from(rolesList);
    new_roles[index].name = editValue;
    const editRoleData = Object.assign({}, roleData);
    const editSelectedRole = Object.assign({}, selectedRole);
    setRoleData({
      ...editRoleData,
      name: editValue
    })
    setSelectedRole({
      ...editSelectedRole,
      name: editValue
    })
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
          // console.log("### INDEX: ", index + 1);
          const splitArray: string[] = permissions[index]['name'].split("_");
          if(splitArray.length === 2){
            const screenName = splitArray[0].replace(/^\w/, (c) => c.toUpperCase());
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
            const nameUpdate: string[] = splitArray.map((itemName) => itemName.replace(/^\w/, (c) => c.toUpperCase()))
            const screenName = nameUpdate.join("-");
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
      setRolesScreen(newData)
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
      const data: Role[] = response.data;
      setRolesList(data);
      if(Array.isArray(data) && data?.length > 0){
        setSelectedRole(data[0]);
        viewRoleAPI(data[0]['id'])
      }
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
      {/* <DeleteRoleModal
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        role={roles2[selectedRole!]}
      /> */}
      <div className="row">
        <div className="col-md-3">
          <div
            className="bg-white p-3 border border-radius overflow-y-scroll"
            style={{}}
          >
            <h5 className="head-font">Roles</h5>
            <div
              className="overflow-y-scroll"
              style={{ minHeight: "510px" }}
            >
              {rolesList.length>0 && rolesList.map((role, index) => {
                if ((selectedRole) && selectedRole.id === role.id) {
                  return (
                    <div key={`userRole${index}`}>
                      {(showEditInput) && (
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
                              disabled={!editValue.trimStart()}
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
                      setSelectedRole(role);
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
                        <li
                          onClick={(e) => {
                            // e.stopPropagation();
                            handleEditClick();
                          }}
                        >
                          <img src="/assets/Icon/Edit.svg" alt="edit" />
                        </li>
                        <li
                          onClick={(e) => {
                            // e.stopPropagation();
                            setDeleteModalOpen(!deleteModalOpen);
                          }}
                        >
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
              <h5 className="head-font">{selectedRole?.name || "--"}</h5>
            </div>
            <div
              className="overflow-y-scroll p-3"
              style={{ minHeight: "575px" }}
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
                    {rolesScreen.map((screen) => {
                      return (
                        <tr key={screen.id} className="">
                          <td className="" scope="row">
                            <p style={{}} className="my-1 py-1">
                              {screen?.name}
                            </p>
                          </td>
                          {screen.permissions.map((checkbox) => {
                            const checked = roleData?.permissions.find((subId) => {
                              return subId.id === checkbox;
                            })
                            return(
                              <td className="text-center">
                                <input
                                  key={`${screen.name}${checkbox}`}
                                  style={{ marginTop: "12px" }}
                                  className="py-1"
                                  type="checkbox"
                                  // disabled={!showEditInput}
                                  name=""
                                  onChange={() => {
                                    const findPermission = permissions.find((item) => {
                                      return item.id === checkbox
                                    })
                                    console.log("@@@ CLICKED: ", findPermission);
                                    if(findPermission){
                                      let editRoleData: RoleData = Object.assign({}, roleData);
                                      const findRoleDataPermission = editRoleData.permissions.find((findId) => {
                                        return findId.id === findPermission.id
                                      })
                                      if(!findRoleDataPermission){
                                        editRoleData.permissions.push(findPermission)
                                      }else{
                                        const findPermissionIndex = editRoleData.permissions.findIndex((findId) => {
                                          return findId.id === findPermission.id
                                        })
                                        if(findPermissionIndex > -1){
                                          editRoleData.permissions.splice(findPermissionIndex, 1)
                                        }
                                      }
                                      setRoleData(editRoleData);
                                    }
                                  }}
                                  checked={(checked?.id === checkbox)}
                                  id={`${checkbox}`}
                                />
                              </td>
                            )
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div>
                  <button
                    onClick={() => {
                      let permissionString = "";
                      roleData?.permissions.forEach((item, index) => {
                        permissionString += `${item.id}${(index < (roleData.permissions.length - 1))? ',' : ''}`
                      })
                      const createNewData = {
                        name: roleData?.name,
                        permissions: permissionString
                      }
                      console.log("@@@ PERMISSION: ", createNewData);
                      const url = `${roleData?.id}?name=${createNewData.name}&permissions=${createNewData.permissions}`;
                      updateRoleAPI(url);
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesBody;
