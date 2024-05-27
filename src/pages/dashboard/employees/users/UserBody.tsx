import React, { ReactNode, useEffect, useState } from "react";
import "./employee-detail.scss";
import ActiveDeactiveModal from "./ActiveDeactiveModal";
import InformationModal from "./InformationModal";
import DeleteModal from "./DeleteModal";
import { API } from "@/api";
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


// const arrayData: User[] = [
//   {
//     id: 1,
//     image: "/assets/image/user.svg",
//     name: "John Doe 1",
//     mobile: "+91 8708393253",
//     role: "admin",
//     isActive: true,
//     isSuspended: false,
//   },
//   {
//     id: 2,
//     image: "/assets/image/user.svg",
//     name: "John Doe 2",
//     mobile: "+91 8708393253",
//     role: "admin",
//     isActive: true,
//     isSuspended: false,
//   },
//   {
//     id: 3,
//     image: "/assets/image/user.svg",
//     name: "John Doe 3",
//     mobile: "+91 8708393253",
//     role: "admin",
//     isActive: false,
//     isSuspended: true,
//   },
//   {
//     id: 4,
//     image: "/assets/image/user.svg",
//     name: "John Doe 4",
//     mobile: "+91 8708393253",
//     role: "admin",
//     isActive: true,
//     isSuspended: false,
//   },
//   {
//     id: 5,
//     image: "/assets/image/user.svg",
//     name: "John Doe 5",
//     mobile: "+91 8708393253",
//     role: "admin",
//     isActive: true,
//     isSuspended: false,
//   },
// ]

const UserBody: React.FC = () => {
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [informationOpen, setInformationOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [usersList, setUsersList] = useState<User[]>([]);

  const [selectedUser, setSelectedUser] = useState<User|null>(null);

  const [selectedOption, setSelectedOption] = useState("Select Role");
  const handleSelect = (eventKey: any) => {
    setSelectedOption(eventKey);
  };

  useEffect(()=>{
    getUsersList();
  }, [])

  async function getUsersList(){
    try {
      const response = await API.post("users", null)
      setUsersList(response.data);
    } catch (error) {
      console.log("!!! USERS ERROR: ", error);
    }
  }
  
  return (
    <div className="employee-detail-page">
      <ActiveDeactiveModal 
        selectedUser={selectedUser}
        deactivateOpen={deactivateOpen}
        setDeactivateOpen={() => setDeactivateOpen(!deactivateOpen)}
        setSelectedUser={() => setSelectedUser(null)}
      />
      <InformationModal
        selectedUser={selectedUser}
        informationOpen={informationOpen}
        setInformationOpen={setInformationOpen}
        handleSelect={handleSelect}
        selectedOption={selectedOption}
      />
      <DeleteModal 
        selectedUser={selectedUser}
        deleteOpen={deleteOpen}
        setDeleteOpen={() => setDeleteOpen(!deleteOpen)}
        setSelectedUser={() => setSelectedUser(null)}
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
                <button className="edit" onClick={()=>{setSelectedUser(item); setInformationOpen(!informationOpen)}}>Edit</button>
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
  );
};

export default UserBody;
