import React, { useContext, useEffect, useState } from "react";
import "./RolesModalPhone.css";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import { createRole, updateRole, viewRole } from "@/api/roles";
import { getRoles } from "@/api/users";
import { Role } from "./RolesBody";
import { LoginUserContext } from "@/App";
import _ from "lodash";

interface RoleData {
  id: number;
  name: string;
  users: number;
  permissions: PermissionsList[];
}

interface PermissionsList {
  id: number;
  name: string;
}

const RolesModalPhone = (props: any) => {
  const { roleModalOpen = false, setRoleModalOpen = () => {} } = props;
  const [searchItem, setSearchItem] = useState<string>('')

  const [loading, setLoading] = useState<boolean>(true); // State to manage loading
  const [showInput, setShowInput] = useState<boolean | null>(false);
  const [showEditInput, setShowEditInput] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState("");
  const [canCreate, setCanCreate] = useState(false);
  const [rolesList, setRolesList] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const context = useContext(LoginUserContext);
  const [reserveRoleData, setReserveRoleData] = useState<RoleData | null>();
  const [roleData, setRoleData] = useState<RoleData | null>();
  const [add, setAdd] = useState<boolean>(true);
  const [editValue, setEditValue] = useState("");
  const [saveTitle, setSaveTitle] = useState<string>("Save");
  const [changeDetected, setChangeDetected] = useState<boolean>(false);



  const handleSearchChange = (e: any) => { 
    const searchTerm = e.target.value;
    setSearchItem(searchTerm)
  }
  
  const searchData = (listofRoles : Role[]) =>{
    if(Array.isArray(listofRoles)){
      return listofRoles.filter((role : Role) =>{
        const item: any = Object.assign({}, role);
        const searchValue: string[] = Object.keys(item);
        return searchValue.some((parameter: string) => {
          const value: string = item[parameter];
          if(value){
            return value.toString().toLowerCase().includes(searchItem.toLowerCase())
          }
          return false;
        })
      })
    }else{
      return []
    }
  }

  const handleClose = () => {
    setRoleModalOpen();
    setAdd(true);
    setShowEditInput(false);
    setEditValue("");
  };

  const handleButtonClick = () => {
    setShowInput(!showInput);
    setShowEditInput(false);
  };

  const handleAddRole = () => {
    if (inputValue.trim() === "") {
      setShowInput(false);
      setShowEditInput(false);
      return;
    }

    const newRole = `name=${inputValue}`; // api permissions check

    createNewRole(newRole);
    setShowInput(false);
    setShowEditInput(false);
    setInputValue("");
  };

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
    event.preventDefault();
  };

  async function createNewRole(newRole: string) {
    try {
      const response = await createRole(newRole);
      setRolesList(response.data);
      console.log(response);
      getRolesList();
    } catch (error) {
      console.log("!!! USERS ERROR: ", error);
    }
  }

  useEffect(() => {
    getRolesList();
  }, []);

  async function getRolesList(id: number | null = null) {
    try {
      setLoading(true); // Set loading to true before making API call

      const response = await getRoles();
      let data: Role[] = response.data;
      setRolesList(data);
      if (Array.isArray(data) && data?.length > 0) {
        data = data.sort((a, b) => a.id - b.id);
        if (id) {
          const findRole = data.find((item) => item.id === id);
          if (findRole && findRole?.id) {
            setSelectedRole(findRole);
            viewRoleAPI(findRole.id);
          }
        } else {
          setSelectedRole(data[0]);
          viewRoleAPI(data[0]["id"]);
        }
      }
    } catch (error) {
      console.log("!!! USERS ERROR: ", error);
    } finally {
      setLoading(false); // Set loading to false after API call completes
    }
  }

  async function viewRoleAPI(id: number) {
    try {
      const response = await viewRole(id);
      // setRolesList(response.data);
      const data: RoleData = response.data;
      const newData = JSON.stringify(data);
      setRoleData(data);
      setReserveRoleData(JSON.parse(newData));
      // console.log("@@@ VIEW ROLE: ", response.data);
    } catch (error) {
      console.log("!!! VIEW ROLE ERROR: ", error);
    }
  }
  useEffect(() => {
    if (context?.loginUserData) {
      const data = context?.loginUserData?.role?.permissions;
      const filteredData = data.filter((item: any) => item.id === 10);
      if (filteredData.length > 0) {
        setCanCreate(true);
      } else {
        setCanCreate(false);
      }
    }
  }, [context]);

  const editRole = (index: number) => {
    
    let new_roles = Array.from(rolesList);
    new_roles[index].name = editValue;
    const editRoleData = Object.assign({}, roleData);
    const editSelectedRole = Object.assign({}, selectedRole);
    setRoleData({
      ...editRoleData,
      name: editValue,
    });
    setSelectedRole({
      ...editSelectedRole,
      name: editValue,
    });
    setRolesList(new_roles);
    setEditValue("");
    setShowEditInput(false);
    let permissions = "";
    roleData?.permissions.forEach((permission, permissionIndex) => {
      permissions += `${permission.id}${
        roleData.permissions.length - 1 > permissionIndex ? "," : ""
      }`;
    });
    // console.log(selectedRole?.id,'#id',editValue ,'@@@22',permissions ,'@$$$444');
    const url = `${selectedRole?.id}?name=${editValue}&permissions=${permissions}`;
    updateRoleAPI(url);
  };

  async function updateRoleAPI(index: string){
    try {
      const response = await updateRole(index);
      // setRolesList(response.data);
      console.log(response)
      setSaveTitle("Saved");
      getRolesList(selectedRole?.id);
      setChangeDetected(false);
      setSaveTitle("Saved");
    } catch (error) {
      console.log("!!! UPDATE ROLE ERROR: ", error);
    }
  }

  const lookForChanges = () => {
    // console.log("PREV DATA: ", reserveRoleData, "\n\nCURRENT DATA: ", roleData);
    if(!_.isEqual(reserveRoleData, roleData)){
      // console.log("@@@ CHANGE DETECTED ");
      setChangeDetected(true);
      setSaveTitle("Save");
    }
  }

  useEffect(() => {
    if(roleData && reserveRoleData){
      lookForChanges();
    }
  }, [roleData, reserveRoleData]);

  const handleEditClick = () => {
    setShowEditInput(!showEditInput);
    const find = rolesList.map((item) => item) ;
    if(find){
      // setEditValue(find);
    }
  };
  console.log(rolesList,'rolesList')
  return (
    <div className="">
      <Modal
        show={roleModalOpen}
        onHide={handleClose}
        centered
        modal-dialog2
        modal-content2
        className="addVehicle"
      >
        <div className="p-3">
          <Modal.Header
            closeButton
            className="modal-header mx-2 px-0 pt-1 pb-3 mb-3 generic-modal-header"
          >
            <Modal.Title className="generic_modal_title">Roles</Modal.Title>
          </Modal.Header>
        </div>
        {add ? (
          <div className="p-3">
            <div className="position-relative searchRole">
              <Form.Control
                type="text"
                placeholder="Search Roles"
                autoFocus
                className="roleModalInput"
                value={searchItem}
                onChange={handleSearchChange}
              />
              <div className="position-absolute top-0 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M9.58342 17.5003C13.9557 17.5003 17.5001 13.9559 17.5001 9.58366C17.5001 5.2114 13.9557 1.66699 9.58342 1.66699C5.21116 1.66699 1.66675 5.2114 1.66675 9.58366C1.66675 13.9559 5.21116 17.5003 9.58342 17.5003Z"
                    stroke="#475467"
                    stroke-width="1.1875"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M18.3334 18.3337L16.6667 16.667"
                    stroke="#475467"
                    stroke-width="1.1875"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div className="d-flex gap-3 py-3 flex-wrap">
              {searchData(rolesList).length > 0 &&
                searchData(rolesList).map((role: Role, index: number) => {
                  return (
                    <div key={`userRole${index}`}>
                      <div
                        draggable="true"
                        role="button"
                        title="Hover chip"
                        className="d-flex align-items-center  chip px-3 py-2 bg-light text-secondary border border-light shadow-sm"
                      >
                        <span className="ms-2 text-sm fw-medium">
                          {role.name}{" "}
                        </span>
                      </div>
                    </div>
                  );
                })}
              <div>
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
                          <img
                            src="/assets/Icon/close-circle.svg"
                            alt="clear"
                          />
                        </button>
                      )}
                    </div>
                  </>
                )}
                  {/* {canCreate &&
                    (showInput ? (
                      <button
                      style={{border:"1.5px dashed #0080FC",borderRadius:"15px"}}
                        className="btn w-100 mx-auto"
                        onClick={handleAddRole}
                      >
                        {inputValue.trim() === "" ? "Close" : "Save"}
                      </button>
                    ) : (
                      <button
                      style={{border:"1.5px dashed #0080FC",borderRadius:"15px" ,color:"#0080FC"}}
                        className="btn w-100 mx-auto"
                        onClick={handleButtonClick}
                      >
                        + Add new role
                      </button>
                    ))} */}
                          {!showInput && (
                      <button
                      style={{border:"1.5px dashed #0080FC",borderRadius:"15px" ,color:"#0080FC"}}
                        className="btn w-100 mx-auto"
                        onClick={handleButtonClick}
                      >
                        + Add new role
                      </button>
)}
              </div>
            </div>
          </div>
        ) : (

          <>
            <div className="p-3">
              <div className="position-relative searchRole">
          <Form.Control
            type="text"
            placeholder="Search Roles"
            autoFocus
            className="roleModalInput"
            value={searchItem}
            onChange={handleSearchChange}
          />
          <div className="position-absolute top-0 p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M9.58342 17.5003C13.9557 17.5003 17.5001 13.9559 17.5001 9.58366C17.5001 5.2114 13.9557 1.66699 9.58342 1.66699C5.21116 1.66699 1.66675 5.2114 1.66675 9.58366C1.66675 13.9559 5.21116 17.5003 9.58342 17.5003Z"
                stroke="#475467"
                stroke-width="1.1875"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M18.3334 18.3337L16.6667 16.667"
                stroke="#475467"
                stroke-width="1.1875"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
               </div>


          <div className="vehicle-model d-flex gap-3 py-3 flex-wrap p-3">
              
          {searchData(rolesList).length > 0 &&
          searchData(rolesList).map((role: Role, index: number) => {
            let disabled = false;
            if((role?.id === 1) || (role?.id === 2) || (role?.id === 3) || (role?.id === 4)){
              disabled = true;
            }
            return (
              <div key={`userRole${index}`}>
                {showEditInput && (
                  <>
                    <div
                      className="position-relative shadow-md  text-secondary "
                    >

                      {(role?.name) ? (
                        <input
                          disabled={disabled}
                          style={{background:"#F6F6F6", borderRadius:"8px"}}
                          className="form-control mb-1   border-0 mt-1"
                          type="text"
                          defaultValue={editValue || role?.name}
                          onChange={(e) => {
                            if(role?.id !== selectedRole?.id){
                              setSelectedRole(role)
                            }
                            setEditValue(e.target.value)
                          }}
                        />
                      )
                      :
                      (
                        <input
                          className="form-control mb-1    mt-1"
                          style={{background:"#F6F6F6", borderRadius:"8px"}}
                          type="text"
                          value={editValue}
                          onChange={(e) => {
                            if(role?.id !== selectedRole?.id){
                              setSelectedRole(role)
                            }
                            setEditValue(e.target.value)
                          }}
                        />
                      )}
                      {(!disabled) && (
                        <button
                        className="position-absolute top-50  translate-middle-y btn btn-link p-0 m-0"
                          onClick={() => {
                            const newRoleList = rolesList.map((item) => {
                              if(item?.id === role?.id){
                                return {
                                  ...item,
                                  name: ''
                                }
                              }
                              return item;
                            })
                            // console.log("@@@ CLICKED: ", newRoleList);
                            setRolesList(newRoleList);
                          }}
                          style={{ right: "15px" }}
                        >
                          {/* <img src="/assets/Icon/close-circle.svg" alt="clear" /> */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M3.33337 12.6665L12.6666 3.33325" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M12.6666 12.6668L3.33337 3.3335" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                        </button>
                      )}
                      {/* <button
                        className="position-absolute top-50  translate-middle-y btn btn-link p-0 m-0"
                        onClick={() => {
                          editRole(index);
                        }}
                        disabled={editValue? false : true}
                        style={{ right: "15px" }}
                      >
                        <span className="text-primary ">Save</span>
                      </button> */}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        </div>

        </>
        )}

        <div className="d-flex justify-content-end generic-modal-footer generic-modal-footer2 g-6">
                      {add ? (
                <>
                  <Button
                    variant="default"
                    className="edit_cancel_button edit_cancel_button2 border_radius_8"
                    onClick={(e) => {
                      setAdd(false);
                      handleEditClick();
                    }}
                  >
                    Edit Roles
                  </Button>
                  {canCreate && (
                    showInput ? (
                      <button
                        style={{ border: "1.5px dashed #0080FC", borderRadius: "15px" }}
                        // className="btn w-100 mx-auto"
                        className="generic_apply_button border_radius_8 btn btn-primary w-50"
                        onClick={handleAddRole}
                      >
                        {inputValue.trim() === "" ? "Close" : "Save"}
                      </button>
                    ) : (
                      <button
                        style={{ border: "1.5px dashed #0080FC", borderRadius: "15px", color: "#ffff" }}
                        className="generic_apply_button border_radius_8 btn btn-primary w-50"
                        // onClick={handleButtonClick}
                      >
                       Save
                      </button>
                       
                    )
                  )}
                </>
              ) : (
                <Button
                  variant="primary"
                  className="generic_apply_button border_radius_8 w-100"
                  onClick={() => {
                    console.log("@@@ CLICKED: ");
                    const findEmpty = rolesList.find((item) => item.name === "");
                    if (findEmpty) {
                      return;
                    }
                    const findIndex = rolesList.findIndex((item) => item.id === selectedRole?.id);
                    if (findIndex > -1) {
                      editRole(findIndex);
                    }
                    setAdd(true);
                  }}
                >
                  {"Save"}
                </Button>
              )}

        </div>
      </Modal>
    </div>
  );
};

export default RolesModalPhone;