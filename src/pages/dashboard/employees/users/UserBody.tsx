import React, { ReactNode, useEffect, useState } from "react";
import "./employee-detail.scss";
import ActiveDeactiveModal from "./ActiveDeactiveModal";
import InformationModal from "./InformationModal";
import DeleteModal from "./DeleteModal";
interface User{
  id: number;
  image: string;
  name: string;
  mobile: string;
  role: string;
  isActive: boolean;
  isSuspended: boolean;
}


const arrayData: User[] = [
  {
    id: 1,
    image: "/assets/image/user.svg",
    name: "John Doe 1",
    mobile: "+91 8708393253",
    role: "admin",
    isActive: true,
    isSuspended: false,
  },
  {
    id: 2,
    image: "/assets/image/user.svg",
    name: "John Doe 2",
    mobile: "+91 8708393253",
    role: "admin",
    isActive: true,
    isSuspended: false,
  },
  {
    id: 3,
    image: "/assets/image/user.svg",
    name: "John Doe 3",
    mobile: "+91 8708393253",
    role: "admin",
    isActive: false,
    isSuspended: true,
  },
  {
    id: 4,
    image: "/assets/image/user.svg",
    name: "John Doe 4",
    mobile: "+91 8708393253",
    role: "admin",
    isActive: true,
    isSuspended: false,
  },
  {
    id: 5,
    image: "/assets/image/user.svg",
    name: "John Doe 5",
    mobile: "+91 8708393253",
    role: "admin",
    isActive: true,
    isSuspended: false,
  },
]

const UserBody: React.FC = () => {
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [informationOpen, setInformationOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User|null>(null);

  const [selectedOption, setSelectedOption] = useState("Select Role");
  const handleSelect = (eventKey: any) => {
    setSelectedOption(eventKey);
  };

  // useEffect(()=>{
  //   if(selectedUser){
  //     setDeactivateOpen(!deactivateOpen);
  //     console.log("modal open");
  //   }
  // }, [selectedUser])
  
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
          {arrayData?.map((item: User, index: any): ReactNode => {
            return (
            <div key={`${index}userbody`} className="employee-card">
              <div className="details">
                <div className="d-flex gap-3">
                  <img src="/assets/image/user.png" alt="user_image" />
                  <div className="name">
                    <span className="name_text">Satish Singh</span>
                    <div className="d-flex gap-2"> 
                      <img src="/assets/Icon/Phone Number.svg" alt="phone number" />
                      <span>(+91) 8329472932</span>
                    </div>
                    <div className="d-flex gap-2"> 
                      <img src="/assets/Icon/Manager.svg" alt="role" />
                      <span>admin</span>
                    </div>
                  </div>
                </div>
                {/* <span className="suspended">Suspended</span> */}
                <span className="active">Active</span>
              </div>
              <div className="options">
                <button className="edit" onClick={()=>{setSelectedUser(item); setInformationOpen(!informationOpen)}}>Edit</button>
                <div className="d-flex gap-2">
                  <button className="delete" onClick={()=>{setSelectedUser(item); setDeleteOpen(!deleteOpen)}}>
                    Delete
                  </button>
                  <button className="activate" onClick={()=>{setSelectedUser(item); setDeactivateOpen(!deactivateOpen)
                  
                  }}>
                    Activate
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
