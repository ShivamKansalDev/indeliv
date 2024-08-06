import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import _ from "lodash";
import "./RolesBody.css";
import DeleteRoleModal from "./DeleteRoleModal";
import { API } from "@/api";
import { createRole, deleteRole, permissionList, updateRole, viewRole } from "@/api/roles";
import { getRoles } from "@/api/users";
import NewLoader from "@/components/LoadingTd";
import LoadingTd from "@/components/LoadingTd";
import { User } from "../users/UserBody";
import { LoginUserContext } from "@/App";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import RolesModalPhone from "./RolesModalPhone";
import OffcanvasMobile from "@/components/OffcanvasMobile";
import { ReactComponent as List } from "@/assets/svgs/list.svg";
import { useSetOpenNav } from "@pages/dashboard";
 

export interface Role {
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
  permissions: PermissionsList[];
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
  const context = useContext(LoginUserContext);
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roles2, setRoles2] = useState(roles);
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState<boolean | null>(false);
  const [showEditInput, setShowEditInput] = useState<boolean>(false);
  const [editValue, setEditValue] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [roleEditModalOpen, setEditRoleModalOpen] = useState(false);
  const [rolesList, setRolesList] = useState<Role[]>([]);
  const [screenList, setScreenList] = useState<Permission[]>([]);
  const [roleData, setRoleData] = useState<RoleData | null>();
  const [reserveRoleData, setReserveRoleData] = useState<RoleData | null>();
  const [permissions, setPermissions] = useState<PermissionsList[]>([]);
  const [rolesScreen, setRolesScreen] = useState<EachScreen[]>([]);
  const [changeDetected, setChangeDetected] = useState<boolean>(false);
  const [saveTitle, setSaveTitle] = useState<string>("Save");
  const [loginUserData, setLoginUserData] = useState<User | null>(null);
  const [canCreate, setCanCreate] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const { setOpenNav } = useSetOpenNav();  
  const [canManage, setCanManage] = useState(false);

  useEffect(() => {
    if (context?.loginUserData) {
        const data = context?.loginUserData?.role?.permissions;
        const filteredData = data.filter((item: any) => item.id === 16);
        if (filteredData.length > 0) {
            setCanDelete(true);
        } else {
            setCanDelete(false);
        }
    }
}, [context]);


useEffect(() => {
    if (context?.loginUserData) {
        const data = context?.loginUserData?.role?.permissions;
        const filteredData = data.filter((item: any) => item.id === 15);
        if (filteredData.length > 0) {
            setCanEdit(true);
        } else {
          setCanEdit(false);
        }
    }
}, [context]);

useEffect(() => {
  if (context?.loginUserData) {
      const data = context?.loginUserData?.role?.permissions;
      const filteredData = data.filter((item: any) => item.id === 14);
      if (filteredData.length > 0) {
          setCanCreate(true);
      } else {
        setCanCreate(false);
      }
  }
}, [context]);

  useEffect(() => {
    if(roleData && reserveRoleData){
      lookForChanges();
    }
  }, [roleData, reserveRoleData]);
  
  const lookForChanges = () => {
    // console.log("PREV DATA: ", reserveRoleData, "\n\nCURRENT DATA: ", roleData);
    if(!_.isEqual(reserveRoleData, roleData)){
      // console.log("@@@ CHANGE DETECTED ");
      setChangeDetected(true);
      setSaveTitle("Save");
    }
  }

  // const handleManageButtonClick = () => {
  //   setShowInput(!showInput);
  //   setShowEditInput(false)
  // };



  const handleButtonClick = () => {
    setShowInput(!showInput);
    setShowEditInput(false)
  };

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
    event.preventDefault();
  };

  const handleAddRole = () => {
    if (inputValue.trim() === "") {
      setShowInput(false);
      setShowEditInput(false);
      return;
    }

    const newRole = `name=${inputValue}`  // api permissions check
    
    createNewRole(newRole);
    setShowInput(false);
    setShowEditInput(false);
    setInputValue("");
  };

  const handleEditClick = () => {
    setShowEditInput(!showEditInput);
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
    let permissions = '';
    roleData?.permissions.forEach((permission, permissionIndex) => {
      permissions += `${permission.id}${((roleData.permissions.length - 1) > permissionIndex)? "," : ""}`
    })
    const url = `${selectedRole?.id}?name=${editValue}&permissions=${permissions}`;
    updateRoleAPI(url);
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
      // console.log("@@@ PERMISSIONS SCREEN: ", newData);
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

  async function getRolesList(id: number | null = null) {
    try {
      setLoading(true); // Set loading to true before making API call

      const response = await getRoles();
      let data: Role[] = response.data;
      setRolesList(data);
      if(Array.isArray(data) && data?.length > 0){
        data = data.sort((a, b) => a.id - b.id);
        if(id){
          const findRole = data.find((item) => item.id === id)
          if(findRole && findRole?.id){
            setSelectedRole(findRole);
            viewRoleAPI(findRole.id)
          }
        }else{
          setSelectedRole(data[0]);
          viewRoleAPI(data[0]['id'])
        }
      }
    } catch (error) {
      console.log("!!! USERS ERROR: ", error);
    }
    finally {
      setLoading(false); // Set loading to false after API call completes
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
      setSaveTitle("Saved");
      getRolesList(selectedRole?.id);
      setChangeDetected(false);
      setSaveTitle("Saved");
    } catch (error) {
      console.log("!!! UPDATE ROLE ERROR: ", error);
    }
  }

  async function viewRoleAPI(id: number){
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

  const deleteRoleHandler = async()=>{
    try{
      if(selectedRole?.id){
        setDeleteModalOpen(!deleteModalOpen);
        const response = await deleteRole(selectedRole?.id);
        setSelectedRole(null);
        getRolesList();
      }
    } catch(error: any) {
      if(error?.response?.status === 401){
        alert("Users already exist in this role. Please remove them before deleting.");
      }
      console.log("Delete role error: ", error)
    }
  }


  

  // console.log(rolesList)

  return (
    <div 
      className="container-fluid px-0" 
      onClick={() => {
        if(showEditInput){
          // setShowEditInput(false)
        }
      }}
    >

            <div className="py-2 mb-2">
                        <div className="mobile-only">
                          
                              <List
                                className="burger"
                                onClick={() => setOpenNav(true)}
                              />
                        
                        </div>
                      </div>



      <DeleteRoleModal
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        role={selectedRole}
        deleteRoleHandler={deleteRoleHandler}
      />
      {/* <div className="row d-none d-md-block"> */}
      <div className="  ">
        <div className="row">
        <div className="col-md-5 ">
          <div
            className="bg-white   border border-radius "
            style={{}}
          >

      
           <div
              className="p-3 pb-1 border-bottom"
              style={{ backgroundColor: "#F9FAFB" }}
            >
            
              <div style={{display: "flex", justifyContent: "space-between", alignItems:"center" }}>
                    <h5 className="head-font">Roles</h5>
                   

                    {(canCreate && canEdit && canDelete) && (
                        <button 
                            className="btn  d-block d-md-none"
                            style={{color: "#0080FC", fontWeight:"500"}}
                            onClick={(e) => {
                              setRoleModalOpen(!roleModalOpen);
                            }}
                          >
                            Manage
                          </button> 
                    )}

                      <button
                            // className="btn btn-primary w-100 mx-auto"
                            className="btn d-none d-md-block"
                            style={{color: "#0080FC", fontWeight:"500"}}
                            onClick={handleButtonClick}
                          >
                            + Create Role
                          </button>

              </div>
      </div>
      

            {/* {loading && (
            <div className="d-flex justify-content-center mt-4">
              <div className="loading-row newLoaderAnimation" >
                
                <NewLoader cols={5} />
              </div>
            </div>
          )} */}

          {/* //webview */}
            <div
              className= "roleBodyLeft d-none d-md-block"
            >
              {rolesList.length>0 && rolesList.map((role, index) => {
                if ((selectedRole) && selectedRole.id === role.id) {
                  return (
                    <div key={`userRole${index}`}>

            <div className="">
                      {showInput && (
                        <>
                          <div className="position-relative ">
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
                      {(canCreate) && (              
                        showInput ? (
                          <button
                            className="btn btn-primary w-100 mx-auto mb-3"
                            onClick={handleAddRole}
                          >
                            {inputValue.trim() === "" ? "Close" : "Save"}
                          </button>
                        ) : (
                        ""
                        )
                      )}
                    </div>


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
                              onChange={(e) => setEditValue(e.target.value)}
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
                          color:"#0080FC",
                          background: "rgba(236, 247, 255, 1)",
                          border: "1px solid rgba(0, 128, 252, 1)",

                        }}
                        className="d-flex gap-3 justify-content-between align-items-center px-3 rounded py-1 "
                        key={`role${role.id}`}
                        // onClick={() => {
                        //   setShowInput(false);
                        //   setShowEditInput(!showEditInput);
                        // }}
                      >
                        <div className="py-2 lh-1" key={`role${role.id}`} style={{display:"flex", justifyContent:"center", alignItems:"baseline", gap:"7px"}}>
                          <p className="m-0 title-font ">
                            {role.name}
                          </p>
                          <small className="m-0 subTitle-font">
                            ({role.users}) Users
                          </small>
                        </div>
                        {((role?.id === 1) || (role?.id === 2) || (role?.id === 3) || (role?.id === 4)) ? (
                          null
                        )
                        :
                        (
                          <div className="">
                            <ul className="list-unstyled lh-lg d-flex gap-2 m-0">
                              {canEdit && (
                                <li
                                  onClick={(e) => {
                                    // e.stopPropagation();
                                    handleEditClick();
                                  }}
                                >
                                  <img
                                    // src="/assets/Icon/Edit-White.svg"
                                   src="/assets/Icon/Edit.svg"  
                                    className=""
                                    alt="edit"
                                  />
                                </li>
                              )}
                              {canDelete && (
                                <li
                                  onClick={(e) => {
                                    // e.stopPropagation();
                                    setDeleteModalOpen(!deleteModalOpen);
                                  }}
                                >
                                  {/* <img
                                    src="/assets/Icon/trash-white.svg"
                                    alt="trash"
                                  /> */}

                              <img src="/assets/Icon/trash.svg" alt="trash" />
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={`userRole${index}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSaveTitle("Save");
                      setChangeDetected(false);
                      setSelectedRole(role);
                      setShowEditInput(false);
                      viewRoleAPI(role.id)
                    }}
                    className="d-flex gap-3 justify-content-between align-items-center px-3 py-1"
                  >
                        
                    <div className="py-2 lh-1" key={`role${role.id}`} style={{display:"flex", justifyContent:"center", alignItems:"baseline", gap:"7px"}}>
                      <p className="m-0 title-font">{role.name}</p>
                      <small className="m-0 subTitle-font">
                        ({role.users}) Users
                      </small>
                    </div>
                    {((role?.id === 1) || (role?.id === 2) || (role?.id === 3) || (role?.id === 4)) ? (
                      null
                    )
                    :
                    (
                    <div className=" ">
                      <ul className="list-unstyled lh-lg d-flex gap-2 m-0 ">
                        {canEdit && (
                          <li
                            onClick={(e) => {
                              // e.stopPropagation();
                              handleEditClick();
                            }}
                          >
                            <img src="/assets/Icon/Edit.svg" alt="edit" />
                          </li>
                        )}
                        {(canDelete) && (
                          <li
                            onClick={(e) => {
                              // e.stopPropagation();
                              setDeleteModalOpen(!deleteModalOpen);
                            }}
                          >
                            <img src="/assets/Icon/trash.svg" alt="trash" />
                          </li>
                        )}
                      </ul>
                    </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* phone view */}
            <div
              className=" roleBodyLeft  d-md-none"
            >
              {rolesList.length>0 && rolesList.map((role, index) => {
                if ((selectedRole) && selectedRole.id === role.id) {
                  return (
                    <div key={`userRole${index}`}>

            <div className="">
                      {showInput && (
                        <>
                          <div className="position-relative ">
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
                      {(canCreate) && (              
                        showInput ? (
                          <button
                            className="btn btn-primary w-100 mx-auto mb-3"
                            onClick={handleAddRole}
                          >
                            {inputValue.trim() === "" ? "Close" : "Save"}
                          </button>
                        ) : (
                        ""
                        )
                      )}
                    </div>


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
                              onChange={(e) => setEditValue(e.target.value)}
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
                          color:"#0080FC",
                          borderBottom:"2px solid",
                          minWidth:"max-content"

                        }}
                        className="d-flex gap-3 justify-content-between align-items-center px-3   py-1 ws" 
                        key={`role${role.id}`}
                        // onClick={() => {
                        //   setShowInput(false);
                        //   setShowEditInput(!showEditInput);
                        // }}
                      >
                        <div className="py-2 lh-1" key={`role${role.id}`} >
                          <p className="m-0 title-font ">
                            {role.name}
                          </p>
                          <div className='d-flex gap-1 mt-2 '>
                          <small className="m-0 subTitle-font">
                            ({role.users} <small>Users</small>) 
                          </small>
                         
                          </div>
                        </div>
                        {((role?.id === 1) || (role?.id === 2) || (role?.id === 3) || (role?.id === 4)) ? (
                          null
                        )
                        :
                        (
                          <div className="d-none d-md-block">
                            <ul className="list-unstyled lh-lg d-flex gap-2 m-0">
                              {canEdit && (
                                <li
                                  onClick={(e) => {
                                    // e.stopPropagation();
                                    handleEditClick();
                                  }}
                                >
                                  <img
                                    // src="/assets/Icon/Edit-White.svg"
                                   src="/assets/Icon/Edit.svg"  
                                    className=""
                                    alt="edit"
                                  />
                                </li>
                              )}
                              {canDelete && (
                                <li
                                  onClick={(e) => {
                                    // e.stopPropagation();
                                    setDeleteModalOpen(!deleteModalOpen);
                                  }}
                                >
                                  {/* <img
                                    src="/assets/Icon/trash-white.svg"
                                    alt="trash"
                                  /> */}

                              <img src="/assets/Icon/trash.svg" alt="trash" />
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={`userRole${index}`}
                    style={{ cursor: "pointer", minWidth:"fit-content"}}
                    onClick={() => {
                      setSaveTitle("Save");
                      setChangeDetected(false);
                      setSelectedRole(role);
                      setShowEditInput(false);
                      viewRoleAPI(role.id)
                    }}
                    className="d-flex gap-3 justify-content-between align-items-center px-3 py-1 ws"
                  >
                        
                    <div className="py-2 lh-1" key={`role${role.id}`} >
                      <p className="m-0 title-font">{role.name}</p>
                      <div className='d-flex gap-1 mt-2'>
                      <small className="m-0 subTitle-font">
                            ({role.users} <small>Users</small>) 
                          </small>
                      </div>
                    </div>
                    {((role?.id === 1) || (role?.id === 2) || (role?.id === 3) || (role?.id === 4)) ? (
                      null
                    )
                    :
                    (
                    <div className="d-none d-md-block">
                      <ul className="list-unstyled lh-lg d-flex gap-2 m-0 ">
                        {canEdit && (
                          <li
                            onClick={(e) => {
                              // e.stopPropagation();
                              handleEditClick();
                            }}
                          >
                            <img src="/assets/Icon/Edit.svg" alt="edit" />
                          </li>
                        )}
                        {(canDelete) && (
                          <li
                            onClick={(e) => {
                              // e.stopPropagation();
                              setDeleteModalOpen(!deleteModalOpen);
                            }}
                          >
                            <img src="/assets/Icon/trash.svg" alt="trash" />
                          </li>
                        )}
                      </ul>
                    </div>
                    )}
                  </div>
                );
              })}
            </div>


  



            

          </div>
        </div>
        <div className="col-md-7 marginTOp" onClick={() => setShowEditInput(false)}>
          <div
            className="bg-white border"
            style={{ borderRadius: "12px", overflow: "hidden" }}
          >
            <div
              className="p-3 pb-1 border-bottom"
              style={{ backgroundColor: "#F9FAFB", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}
            >
              

              <h5 className="head-font  d-none d-md-block">{selectedRole?.name || "--"}</h5>
              <h5 className="head-font d-block d-md-none">{ selectedRole?.name   || "--"}

                      <small className="m-0 subTitle-font" style={{}}>
                      ({selectedRole?.users || "0"}) Users
                    </small>
                      </h5>
           
                  

              {(canEdit) && (
                <div className="d-none d-md-flex justify-content-end g-6 ">
                  {((selectedRole?.id === 1)|| (selectedRole?.id === 2) || (selectedRole?.id === 3) || (selectedRole?.id === 4))? (
                    <Button variant="light" className="fs-6 lh-lg px-5 border"  
                      onClick={() => {
                        setRoleData(reserveRoleData);
                        setChangeDetected(false);
                      }}
                      disabled={true}
                    >
                      Cancel
                    </Button>
                  )
                  :
                  (
                    <Button variant="light" className="fs-6 lh-lg px-5 border "  
                      onClick={() => {
                        const stringifyData = JSON.stringify(reserveRoleData);
                        setChangeDetected(false);
                        setRoleData(JSON.parse(stringifyData));
                      }}
                      disabled={!changeDetected}
                    >
                      Cancel
                    </Button>
                  )}
                  {((selectedRole?.id === 1)|| (selectedRole?.id === 2) || (selectedRole?.id === 3) || (selectedRole?.id === 4))? (
                    <Button className="primary fs-6 lh-lg px-5" variant="primary"
                      disabled={true}
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
                    </Button>
                  )
                  :
                  (
                    <Button className="primary fs-6 lh-lg px-5" variant="primary" 
                      disabled={!changeDetected}
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
                      {saveTitle}
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div
              className="overflow-y-scroll p-3 bg-pure-white"
            >
              {/* webscreen code */}
              <div className="table-responsive bg-white d-none d-md-block"
                style={{ minHeight: "535px", maxHeight: "535px"}}
              >
                <table className="table  border ">
                  <thead style={{ backgroundColor: "#F9FAFB" }} className="hideHead">
                    
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

 
{/* 
                        {!loading && (
                                      <td className="d-flex justify-content-center">
                                        <td className="loading-row newLoaderAnimation" >
                                          <NewLoader cols={5} />
                                        </td>
                                      </td>
                         )}  */}





                    {rolesScreen.map((screen) => {


                        {!loading && (
                          <td className="d-flex justify-content-center">
                            <td className="loading-row newLoaderAnimation" >
                              <NewLoader cols={5} />
                            </td>
                          </td>
             )} 

    

                      return (
                        <tr key={`${screen.id}`} className="">
                          <td className="" scope="row">
                            <p style={{}} className="my-1 py-1">
                              {screen?.name}
                            </p>
                          </td>
                         
                     
                          {screen.permissions.map((checkbox) => {
                            const checked = roleData?.permissions.find((subId) => {
                              return subId.id === checkbox;
                            })
                            // {{console.log(checked,"checked")}}
                            if((screen.name.toLowerCase() === "invoices") && (checkbox === 2) || (checkbox === 3)){
                              return (
                                <td key={`${screen.name}${checkbox}`} className="text-center  ">
                                  <div className="py-1" style={{ marginTop: "12px" }}/>
                                </td>
                              );
                            } 
                            if((screen.name.toLowerCase() === "audit-log") && (checkbox === 38) || (checkbox === 39) || (checkbox === 40)){
                              return (
                                <td key={`${screen.name}${checkbox}`} className="text-center">
                                  <div className="py-1" style={{ marginTop: "12px" }}/>
                                </td>
                              );
                            }
                            if((screen.name.toLowerCase() === "sms-log") && (checkbox === 42) || (checkbox === 43) ||   (checkbox === 44)){
                              return (
                                <td key={`${screen.name}${checkbox}`} className="text-center">
                                  <div className="py-1" style={{ marginTop: "12px" }}/>
                                </td>
                              );
                            }
                            // let disabled = false;
                            if((selectedRole?.id === 1) || (selectedRole?.id === 2) || (selectedRole?.id === 3) || (selectedRole?.id === 4)){
                              // disabled = true;
                              if(checked?.id === checkbox){
                                return(
                                  <td key={`${screen.name}${checkbox}`} className="text-center">
                                    <img src="/assets/Icon/graycheckbox.svg" alt="graycheckbox" className="py-1" style={{width: "26px", height: "26px", marginTop: "10px"}}/>
                                  </td>
                                )
                              }else{
                                return(
                                  <td key={`${screen.name}${checkbox}`} className="text-center">
                                    <input
                                      disabled={true}
                                      style={{ marginTop: "12px",width: "19px", height: "19px"}}
                                      className="py-1 empty-td"
                                      type="checkbox"
                                      name=""
                                      checked={(checked?.id === checkbox)}
                                      id={`${checkbox}`}
                                    />
                                  </td>
                                )
                              }
                            }
                            return(
                              <td key={`${screen.name}${checkbox}`} className="text-center">
                                <input
                                  disabled={!canEdit}
                                  style={{ marginTop: "12px" ,width:"19px", height:"19px" }}
                                  className="py-1"
                                  type="checkbox"
                                  name=""
                                  onChange={() => {
                                    const findPermission = permissions.find((item) => {
                                      return item.id === checkbox
                                    })
                                    // console.log("@@@ CLICKED: ", findPermission);
                                    if(findPermission){
                                      let editRoleData: RoleData = Object.assign({}, roleData);
                                      const findRoleDataPermission = editRoleData.permissions.find((findId) => {
                                        return findId.id === findPermission.id
                                      })
                                      
                                      if(!findRoleDataPermission){
                                        console.log("@@@ CHECKED: ", findPermission);
                                        const permissionName = findPermission.name.split("_");
                                        (permissionName.length > 2)? permissionName.splice((permissionName.length - 1), 1) : permissionName.splice((permissionName.length - 1), 1);
                                        // console.log("^^^ PERMISSION NAME: ", permissionName.join("_"))
                                        const allSimilarPermissions = permissions.filter((item) => {
                                          return item.name.includes(permissionName.join("_"))
                                        })
                                        let editPermissionsData = editRoleData.permissions.map((item) => item);
                                        if(findPermission?.name.includes("delete")){
                                          editPermissionsData = editPermissionsData.concat(allSimilarPermissions).filter((item,     index, self) =>
                                              index === self.findIndex((t) => (
                                                  t.id === item.id && t.name === item.name
                                              ))
                                          );
                                          setRoleData({
                                            ...roleData,
                                            ...editRoleData,
                                            permissions: editPermissionsData
                                          })
                                        }else if(findPermission?.name.includes("view")){
                                          editRoleData.permissions.push(findPermission);
                                          // console.log("^^^ PERMISSION NAME: ", editRoleData)
                                          setRoleData({
                                            ...roleData,
                                            ...editRoleData,
                                            permissions: editRoleData.permissions.filter((item,     index, self) =>
                                              index === self.findIndex((t) => (
                                                  t.id === item.id && t.name === item.name
                                              ))
                                            )
                                          });
                                        }else{
                                          editRoleData.permissions.push(findPermission);
                                          const newPermissions = allSimilarPermissions.filter((item) => {
                                            if(item?.name.includes("delete") || item?.name.includes(findPermission?.name)){
                                              return false;
                                            }
                                            return true;
                                          });
                                          newPermissions.forEach((item) => {
                                            editRoleData.permissions.push(item);
                                          })
                                          setRoleData({
                                            ...roleData,
                                            ...editRoleData,
                                            permissions: editRoleData.permissions.filter((item,     index, self) =>
                                              index === self.findIndex((t) => (
                                                  t.id === item.id && t.name === item.name
                                              ))
                                            )                                          
                                          })
                                        }
                                        // editRoleData.permissions = editPermissionsData
                                        // console.log("@@@ SIMILAR PERMISSION: ", editRoleData, "\n\n", editPermissionsData);
                                      }else{
                                        const findPermissionIndex = editRoleData.permissions.findIndex((findId) => {
                                          return findId.id === findPermission.id
                                        })
                                        if(findPermissionIndex > -1){
                                          const uncheckPermission = editRoleData.permissions[findPermissionIndex];
                                          if(uncheckPermission?.name.includes("view")){
                                            const permissionName = uncheckPermission.name.split("_");
                                            (permissionName.length > 2)? permissionName.splice((permissionName.length - 1), 1) : permissionName.splice((permissionName.length - 1), 1);
                                            let editPermissionsData = editRoleData.permissions.map((item) => item).filter((item) => !item.name?.includes(permissionName.join("_")));
                                            console.log("@@@ CHECK ALL: ", editPermissionsData);
                                            setRoleData({
                                              ...roleData,
                                              ...editRoleData,
                                              permissions: editPermissionsData
                                            })
                                          }else if(uncheckPermission?.name.includes("delete") || uncheckPermission?.name.includes("edit")){
                                            editRoleData.permissions = editRoleData.permissions.filter((item) => item.id !== uncheckPermission.id);
                                            setRoleData(editRoleData);
                                          }else{
                                            const permissionName = uncheckPermission.name.split("_");
                                            (permissionName.length > 2)? permissionName.splice((permissionName.length - 1), 1) : permissionName.splice((permissionName.length - 1), 1);
                                            const allSimilarPermissions = permissions.filter((item) => {
                                              return item.name.includes(permissionName.join("_"))
                                            })
                                            const onlyViewPermission = allSimilarPermissions.find((item) => item.name.includes("view"));
                                            const newPermissions = editRoleData.permissions.map((item) => item).filter((item) => {
                                              if(item.name?.includes(permissionName.join("_"))){
                                                if(item?.id === onlyViewPermission?.id){
                                                  return true;
                                                }else{
                                                  return false;
                                                }
                                              }else{
                                                return item;
                                              }
                                            });
                                            setRoleData({
                                              ...roleData,
                                              ...editRoleData,
                                              permissions: newPermissions
                                            });
                                          }
                                          // editRoleData.permissions.splice(findPermissionIndex, 1)
                                        }
                                      }
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


                {(canEdit) && (
                <div className="d-block d-md-none d-flex justify-content-between g-6 ">
                  {((selectedRole?.id === 1)|| (selectedRole?.id === 2) || (selectedRole?.id === 3) || (selectedRole?.id === 4))? (
                    <Button variant="light" className="fs-6 lh-lg px-5 border w-50"  
                      onClick={() => {
                        setRoleData(reserveRoleData);
                        setChangeDetected(false);
                      }}
                      disabled={true}
                    >
                      Cancel
                    </Button>
                  )
                  :
                  (
                    <Button variant="light" className="fs-6 lh-lg px-5 border w-50 "  
                      onClick={() => {
                        const stringifyData = JSON.stringify(reserveRoleData);
                        setChangeDetected(false);
                        setRoleData(JSON.parse(stringifyData));
                      }}
                      disabled={!changeDetected}
                    >
                      Cancel
                    </Button>
                  )}
                  {((selectedRole?.id === 1)|| (selectedRole?.id === 2) || (selectedRole?.id === 3) || (selectedRole?.id === 4))? (
                    <Button className="primary fs-6 lh-lg px-5 w-50" variant="primary"
                      disabled={true}
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
                    </Button>
                  )
                  :
                  (
                    <Button className="primary fs-6 lh-lg px-5 w-50" variant="primary" 
                      disabled={!changeDetected}
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
                      {saveTitle}
                    </Button>
                  )}
                </div>
                     )}

              </div>
             
                     {/* mobile screen */}

                     <div className="table-responsive bg-white d-block d-md-none "
                style={{ minHeight: "535px", maxHeight: "535px",}}
              >
                <table className="table  border ">
                  <thead style={{ backgroundColor: "#F9FAFB" }} className="hideHead">
                    
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

 
{/* 
                        {!loading && (
                                      <td className="d-flex justify-content-center">
                                        <td className="loading-row newLoaderAnimation" >
                                          <NewLoader cols={5} />
                                        </td>
                                      </td>
                         )}  */}





                    {rolesScreen.map((screen) => {


                        {!loading && (
                          <td className="d-flex justify-content-center">
                            <td className="loading-row newLoaderAnimation" >
                              <NewLoader cols={5} />
                            </td>
                          </td>
             )} 

    

                      return (
                        <>
                        <tr>
                        <td className="" style={{borderBottom: "none"}} scope="row" colSpan={2} >
                            <p  className="my-1 py-1 p-3" >
                              {screen?.name}
                            </p>
                          </td>    
                            </tr>
                        <tr key={`${screen.id}`} className="">
                          {/* <td className="" scope="row">
                            <p style={{}} className="my-1 py-1">
                              {screen?.name}
                            </p>
                          </td> */}
                         
                     
                          {screen.permissions.map((checkbox, checkboxIndex) => {
                            const checked = roleData?.permissions.find((subId) => {
                              return subId.id === checkbox;
                            })
                            // {{console.log(checked,"checked")}}
                            if((screen.name.toLowerCase() === "invoices") && (checkbox === 2) || (checkbox === 3)){
                              return (
                                <>
                                <td key={`${screen.name}${checkbox}`} className="text-center w-25  ">
                                  <div className="py-1" style={{ marginTop: "12px" }} />
                                  
                                </td>
                                     {/* <p
                                     className=""
                                     style={{ fontSize: "14px", fontWeight: "normal" }}
                                   >
                                     View
                                   </p> */}
                                   </>
                              );
                            } 
                            if((screen.name.toLowerCase() === "audit-log") && (checkbox === 38) || (checkbox === 39) || (checkbox === 40)){
                              return (
                                <td key={`${screen.name}${checkbox}`} className="text-center w-25">
                                  <div className="py-1" style={{ marginTop: "12px" }}/>
                                </td>
                              );
                            }
                            if((screen.name.toLowerCase() === "sms-log") && (checkbox === 42) || (checkbox === 43) ||   (checkbox === 44)){
                              return (
                                <td key={`${screen.name}${checkbox}`} className="text-center w-25">
                                  <div className="py-1" style={{ marginTop: "12px" }}/>
                                </td>
                              );
                            }
                            // let disabled = false;
                            if((selectedRole?.id === 1) || (selectedRole?.id === 2) || (selectedRole?.id === 3) || (selectedRole?.id === 4)){
                              // disabled = true;
                              if(checked?.id === checkbox){
                                return(
                                  <td key={`${screen.name}${checkbox}`} className="text-center w-25">
                                           <div style={{display:"flex", alignItems:"center", justifyContent:"center",gap:"7px"}}>

                                    <img src="/assets/Icon/graycheckbox.svg" alt="graycheckbox" className="py-1" style={{width: "26px", height: "26px"}}/>
                                    {(checkboxIndex === 0)? (<div>View</div>) : 
                                      (checkboxIndex === 1)? (<div>Create</div>) : 
                                        (checkboxIndex === 2)? (<div>Edit</div>) : 
                                          (<div>Delete</div>)
                                    }
                                      </div>
                                  </td>
                                )
                              }else{
                                return(
                                  <td key={`${screen.name}${checkbox}`} 
                                  className="text-center w-25">
                                     <div style={{display:"flex", alignItems:"center", justifyContent:"center",gap:"7px"}}>
                                    <input
                                      disabled={true}
                                      // style={{width: "20px", height: "20px"}}
                                      className="py-1 empty-td"
                                      type="checkbox"
                                      name=""
                                      checked={(checked?.id === checkbox)}
                                      id={`${checkbox}`}
                                    />
                                    {(checkboxIndex === 0)? (<div>View</div>) : 
                                      (checkboxIndex === 1)? (<div>Create</div>) : 
                                        (checkboxIndex === 2)? (<div>Edit</div>) : 
                                          (<div>Delete</div>)
                                    }
                                      </div>
                                  </td>
                                )
                              }
                            }
                            return(
                              <td key={`${screen.name}${checkbox}`} className="text-center w-25">
                                    <div style={{display:"flex", alignItems:"center", justifyContent:"center",gap:"7px"}}>
                                <input
                                  disabled={!canEdit}
                                  style={{ }}
                                  className="py-1"
                                  type="checkbox"
                                  name=""
                                  onChange={() => {
                                    const findPermission = permissions.find((item) => {
                                      return item.id === checkbox
                                    })
                                    // console.log("@@@ CLICKED: ", findPermission);
                                    if(findPermission){
                                      let editRoleData: RoleData = Object.assign({}, roleData);
                                      const findRoleDataPermission = editRoleData.permissions.find((findId) => {
                                        return findId.id === findPermission.id
                                      })
                                      
                                      if(!findRoleDataPermission){
                                        console.log("@@@ CHECKED: ", findPermission);
                                        const permissionName = findPermission.name.split("_");
                                        (permissionName.length > 2)? permissionName.splice((permissionName.length - 1), 1) : permissionName.splice((permissionName.length - 1), 1);
                                        // console.log("^^^ PERMISSION NAME: ", permissionName.join("_"))
                                        const allSimilarPermissions = permissions.filter((item) => {
                                          return item.name.includes(permissionName.join("_"))
                                        })
                                        let editPermissionsData = editRoleData.permissions.map((item) => item);
                                        if(findPermission?.name.includes("delete")){
                                          editPermissionsData = editPermissionsData.concat(allSimilarPermissions).filter((item,     index, self) =>
                                              index === self.findIndex((t) => (
                                                  t.id === item.id && t.name === item.name
                                              ))
                                          );
                                          setRoleData({
                                            ...roleData,
                                            ...editRoleData,
                                            permissions: editPermissionsData
                                          })
                                        }else if(findPermission?.name.includes("view")){
                                          editRoleData.permissions.push(findPermission);
                                          // console.log("^^^ PERMISSION NAME: ", editRoleData)
                                          setRoleData({
                                            ...roleData,
                                            ...editRoleData,
                                            permissions: editRoleData.permissions.filter((item,     index, self) =>
                                              index === self.findIndex((t) => (
                                                  t.id === item.id && t.name === item.name
                                              ))
                                            )
                                          });
                                        }else{
                                          editRoleData.permissions.push(findPermission);
                                          const newPermissions = allSimilarPermissions.filter((item) => {
                                            if(item?.name.includes("delete") || item?.name.includes(findPermission?.name)){
                                              return false;
                                            }
                                            return true;
                                          });
                                          newPermissions.forEach((item) => {
                                            editRoleData.permissions.push(item);
                                          })
                                          setRoleData({
                                            ...roleData,
                                            ...editRoleData,
                                            permissions: editRoleData.permissions.filter((item,     index, self) =>
                                              index === self.findIndex((t) => (
                                                  t.id === item.id && t.name === item.name
                                              ))
                                            )                                           
                                          })
                                        }
                                        // editRoleData.permissions = editPermissionsData
                                        // console.log("@@@ SIMILAR PERMISSION: ", editRoleData, "\n\n", editPermissionsData);
                                      }else{
                                        const findPermissionIndex = editRoleData.permissions.findIndex((findId) => {
                                          return findId.id === findPermission.id
                                        })
                                        if(findPermissionIndex > -1){
                                          const uncheckPermission = editRoleData.permissions[findPermissionIndex];
                                          if(uncheckPermission?.name.includes("view")){
                                            const permissionName = uncheckPermission.name.split("_");
                                            (permissionName.length > 2)? permissionName.splice((permissionName.length - 1), 1) : permissionName.splice((permissionName.length - 1), 1);
                                            let editPermissionsData = editRoleData.permissions.map((item) => item).filter((item) => !item.name?.includes(permissionName.join("_")));
                                            console.log("@@@ CHECK ALL: ", editPermissionsData);
                                            setRoleData({
                                              ...roleData,
                                              ...editRoleData,
                                              permissions: editPermissionsData
                                            })
                                          }else if(uncheckPermission?.name.includes("delete") || uncheckPermission?.name.includes("edit")){
                                            editRoleData.permissions = editRoleData.permissions.filter((item) => item.id !== uncheckPermission.id);
                                            setRoleData(editRoleData);
                                          }else{
                                            const permissionName = uncheckPermission.name.split("_");
                                            (permissionName.length > 2)? permissionName.splice((permissionName.length - 1), 1) : permissionName.splice((permissionName.length - 1), 1);
                                            const allSimilarPermissions = permissions.filter((item) => {
                                              return item.name.includes(permissionName.join("_"))
                                            })
                                            const onlyViewPermission = allSimilarPermissions.find((item) => item.name.includes("view"));
                                            const newPermissions = editRoleData.permissions.map((item) => item).filter((item) => {
                                              if(item.name?.includes(permissionName.join("_"))){
                                                if(item?.id === onlyViewPermission?.id){
                                                  return true;
                                                }else{
                                                  return false;
                                                }
                                              }else{
                                                return item;
                                              }
                                            });
                                            setRoleData({
                                              ...roleData,
                                              ...editRoleData,
                                              permissions: newPermissions
                                            });
                                          }
                                          // editRoleData.permissions.splice(findPermissionIndex, 1)
                                        }
                                      }
                                    }
                                  }}
                                  checked={(checked?.id === checkbox)}
                                  id={`${checkbox}`}
                                />
                                {(checkboxIndex === 0)? (<div>View</div>) : 
                                  (checkboxIndex === 1)? (<div>Create</div>) : 
                                    (checkboxIndex === 2)? (<div>Edit</div>) : 
                                      (<div>Delete</div>)
                                }

                                  </div>
                              </td>
                            )
                          })}
                   
                         
                        </tr>
                        </>
                      );
                    })}

                    
                  </tbody>
                </table>


                {(canEdit) && (
                <div className="d-block d-md-none d-flex justify-content-between g-6 ">
                  {((selectedRole?.id === 1)|| (selectedRole?.id === 2) || (selectedRole?.id === 3) || (selectedRole?.id === 4))? (
                    <Button variant="light" className="fs-6 lh-lg px-5 border w-50"  
                      onClick={() => {
                        setRoleData(reserveRoleData);
                        setChangeDetected(false);
                      }}
                      disabled={true}
                    >
                      Cancel
                    </Button>
                  )
                  :
                  (
                    <Button variant="light" className="fs-6 lh-lg px-5 border w-50 "  
                      onClick={() => {
                        const stringifyData = JSON.stringify(reserveRoleData);
                        setChangeDetected(false);
                        setRoleData(JSON.parse(stringifyData));
                      }}
                      disabled={!changeDetected}
                    >
                      Cancel
                    </Button>
                  )}
                  {((selectedRole?.id === 1)|| (selectedRole?.id === 2) || (selectedRole?.id === 3) || (selectedRole?.id === 4))? (
                    <Button className="primary fs-6 lh-lg px-5 w-50" variant="primary"
                      disabled={true}
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
                    </Button>
                  )
                  :
                  (
                    <Button className="primary fs-6 lh-lg px-5 w-50" variant="primary" 
                      disabled={!changeDetected}
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
                      {saveTitle}
                    </Button>
                  )}
                </div>
                     )}

              </div>
             



                      {/* <div>
                        <p>Invoivces</p>
                        <div className="d-flex justify-content-between">
                        <div className="d-flex gap-3 align-content-center ">
                          <input type="checkbox" /> 
                          <p>View</p>
                        </div>
                        <div className="d-flex gap-3 align-content-center ">
                          <input type="checkbox" /> 
                          <p>Edit</p>
                        </div>
                        <div className="d-flex gap-3 align-content-center ">
                          <input type="checkbox" /> 
                          <p>Create</p>
                        </div>
                        <div className="d-flex gap-3 align-content-center ">
                          <input type="checkbox" /> 
                          <p>Delete</p>
                        </div>
                        </div>
                      </div> */}

                 

            </div>
          </div>
        </div>
        </div>
      </div>
 
          <div>
          <RolesModalPhone 
          roleModalOpen={roleModalOpen}
          setRoleModalOpen={setRoleModalOpen}
          // role={selectedRole}
          // deleteRoleHandler={deleteRoleHandler}
          />
          </div>
    </div>
  );
};

export default RolesBody;