import React, { ReactNode } from "react";
import "./employee-detail.scss";

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
    name: "John Doe",
    mobile: "+91 8708393253",
    role: "admin",
    isActive: true,
    isSuspended: false,
  },
  {
    id: 2,
    image: "/assets/image/user.svg",
    name: "John Doe",
    mobile: "+91 8708393253",
    role: "admin",
    isActive: true,
    isSuspended: false,
  },
  {
    id: 3,
    image: "/assets/image/user.svg",
    name: "John Doe",
    mobile: "+91 8708393253",
    role: "admin",
    isActive: false,
    isSuspended: true,
  },
  {
    id: 4,
    image: "/assets/image/user.svg",
    name: "John Doe",
    mobile: "+91 8708393253",
    role: "admin",
    isActive: true,
    isSuspended: false,
  },
  {
    id: 5,
    image: "/assets/image/user.svg",
    name: "John Doe",
    mobile: "+91 8708393253",
    role: "admin",
    isActive: true,
    isSuspended: false,
  },
]

const UserBody: React.FC = () => {
  return (
    <div className="employee-detail-page">
      <div className="content">
          {arrayData?.map((item: object, index: any): ReactNode => {
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
                <button className="edit">Edit</button>
                <div className="d-flex gap-2">
                  <button className="delete">Delete</button>
                  <button className="activate">Activate</button>
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
