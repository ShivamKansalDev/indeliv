import React, { ReactNode, useEffect, useState } from "react";
import "./employee-detail.scss";
import ActiveDeactiveModal from "./ActiveDeactiveModal";
import InformationModal from "./InformationModal";
import DeleteModal from "./DeleteModal";
import { API } from "@/api";
import { createUpdateUser, deleteEmployee, getRoles, updateEmployeeStatus } from "@/api/users";
import EmployeeHeader from "./EmployeeHeader";
interface User{
  id: number,
  first_name: string,
  last_name: string,
  phone: string,
  email: string,
  email_verified_at: null | string,
  role_id: number,
  image: null | string,
  is_active: boolean,
  created_at: string,
  updated_at: string,
  name: string,
  role_name: string,
  image_path: string
}

export interface UserRole{
  id: number;
  name: string;
  users: number;
}

export interface UserDetails{
  role_id: number|null,
  first_name: string,
  last_name: string,
  phone: string,
  password: string,
  image: string,
  email: string;
  emailError: boolean;
}

const resetUserDetails = {
  role_id: null,
  first_name: "",
  last_name: "",
  phone: "",
  password: "",
  email: "",
  emailError: true
};

const UserBody: React.FC = () => {
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [informationOpen, setInformationOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  const [selectedUser, setSelectedUser] = useState<User|null>(null);
  const [editSelectedUser, setEditSelectedUser] = useState<User|null>(null);

  const [selectedOption, setSelectedOption] = useState("Select Role");
  const [userDetails, setUserDetails] = useState<UserDetails | null>();

  const handleSelect = (eventKey: string) => {
    const findRole = userRoles.find((item) => item.name === eventKey)
    if(findRole){
      setUserDetails((old: any) => {
        return {
          ...old,
          role_id: findRole.id
        }
      })
    }
  };

  useEffect(() => {
    if(!informationOpen){
      setEditSelectedUser(null);
      const reset: any = resetUserDetails;
      setUserDetails(reset);
    }
  }, [informationOpen])

  useEffect(() => {
    if(editSelectedUser && userDetails){
      setInformationOpen(!informationOpen)
    }
  }, [editSelectedUser])

  useEffect(()=>{
    getUsersList();
    fetchRoles();
  }, []);

  async function deleteUser(id: number){
    try {
      const response = await deleteEmployee(id);
      getUsersList();
    } catch (error) {
      console.log("!!! DELETE USER ERROR: ", error);
    }
  }

  async function getUsersList(){
    try {
      const response = await API.post("users", null)
      setUsersList(response.data);
    } catch (error) {
      console.log("!!! USERS ERROR: ", error);
    }
  }

  async function updateUserStatus(data: string){
    try {
      const response = await updateEmployeeStatus(data);
      getUsersList();
    } catch (error) {
      console.log("!!! UPDATE USER STATUS ERROR: ", error);
    }
  }

  async function fetchRoles(){
    try {
      const response = await getRoles();
      setUserRoles(response.data);
    } catch (error) {
      console.log("!!! FETCH ROLES ERROR: ", error);
    }
  }

  async function createUpdateUserAPI(){
    try {
      const data: string = (editSelectedUser)? `update/${editSelectedUser?.id}?first_name=${userDetails?.first_name}&last_name=${userDetails?.last_name}&phone=${userDetails?.phone}&role_id=${userDetails?.role_id}&password=${userDetails?.password}` 
      : `create?first_name=${userDetails?.first_name}&last_name=${userDetails?.last_name}&email=${userDetails?.email}&phone=${userDetails?.phone}&role_id=${userDetails?.role_id}&password=${userDetails?.password}`;
      console.log("@@@ UPDATE USER: ", data);
      const formData = new FormData();
      const image: any = Object.assign({}, {path: userDetails?.image});
      formData.append("image", image.path);
      const response = await createUpdateUser(data, formData);
      setEditSelectedUser(null);
      setInformationOpen(!informationOpen)
      getUsersList();
    } catch (error) {
      console.log("!!! UPDATE USER ERROR: ", error);
    }
  }
  
  return (
    <>
      <EmployeeHeader setInformationOpen={() => setInformationOpen(!informationOpen)} />
      <div className="employee-detail-page">
        <ActiveDeactiveModal 
          selectedUser={selectedUser}
          deactivateOpen={deactivateOpen}
          setDeactivateOpen={() => setDeactivateOpen(!deactivateOpen)}
          setSelectedUser={() => setSelectedUser(null)}
          updateUserStatus={() => {
            const data = `id=${selectedUser?.id}&status=${!selectedUser?.is_active}`;
            updateUserStatus(data);
          }}
        />
        {(informationOpen || (editSelectedUser && userDetails)) && (
          <InformationModal
            userRoles={userRoles}
            selectedUser={editSelectedUser}
            informationOpen={informationOpen}
            setInformationOpen={setInformationOpen}
            handleSelect={handleSelect}
            selectedOption={selectedOption}
            userDetails={userDetails}
            setUserDetails={(details: UserDetails) => setUserDetails((old) => ({
              ...old,
              ...details
            }))}
            createUpdateUserAPI={createUpdateUserAPI}
          />
        )}
        <DeleteModal 
          selectedUser={selectedUser}
          deleteOpen={deleteOpen}
          setDeleteOpen={() => setDeleteOpen(!deleteOpen)}
          setSelectedUser={() => setSelectedUser(null)}
          deleteUser={() => {
            if(selectedUser?.id){
              deleteUser(selectedUser?.id);
              setDeleteOpen(!deleteOpen);
            }
          }}
        />
        <div className="content">
            {usersList?.map((item: User, index: any): ReactNode => {
              return (
              <div key={`${item?.id}userbody`} className="employee-card">
                <div className="details">
                  <div className="d-flex gap-3">
                    <img src="/assets/image/user.png" alt="user_image" />
                    <div className="name">
                      <span className="name_text">{item.name}</span>
                      <div className="d-flex gap-2"> 
                        <img src="/assets/Icon/Phone Number.svg" alt="phone number" />
                        <span>(+91) {item.phone}</span>
                      </div>
                      <div className="d-flex gap-2"> 
                        <img src="/assets/Icon/Manager.svg" alt="role" />
                        <span>{item.role_name}</span>
                      </div>
                    </div>
                  </div>
                  {/* <span className="suspended">Suspended</span> */}
                  <span className={(item?.is_active)? "active" : "suspended"}>{(item?.is_active)? "Active" : "Suspended"}</span>
                </div>
                <div className="options">
                  <button className="edit" onClick={()=>{
                    setEditSelectedUser(item); 
                    setUserDetails({
                      role_id: item.role_id,
                      first_name: item.first_name,
                      last_name: item.last_name,
                      phone: item.phone,
                      password: "",
                      image: item.image_path,
                      email: item.email,
                      emailError: false
                    })
                  }}>
                      Edit
                  </button>
                  <div className="d-flex gap-2">
                    <button className="delete" onClick={()=>{setSelectedUser(item); setDeleteOpen(!deleteOpen)}}>
                      Delete
                    </button>
                    <button className="activate" onClick={()=>{setSelectedUser(item); setDeactivateOpen(!deactivateOpen)
                    
                    }}>
                      {(item?.is_active)? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>

              </div>
              );
            })}
          </div>
          
          {/* <span>Hello world!</span> */}
      </div>
    </>
  );
};

export default UserBody;
