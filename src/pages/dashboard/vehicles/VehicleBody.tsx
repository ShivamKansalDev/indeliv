import React, { ReactNode, useState } from "react";
import "../employees/users/employee-detail.scss";
import VehicleModal from "@/components/vehicleModal/VehicleModal";
import { Button } from "react-bootstrap";
import ManageVehicleModal from "@/components/vehicleModal/ManageVehicleModal";
import DeleteVehicleModal from "@/components/vehicleModal/deleteVehicleModal";

interface User {
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
    image: "/assets/image/truck.svg",
    name: "Truck",
    mobile: "+91 8708393253",
    role: "admin",
    isActive: true,
    isSuspended: false,
  },
  {
    id: 2,
    image: "/assets/image/user.svg",
    name: "Truck",
    mobile: "+91 8708393253",
    role: "admin",
    isActive: true,
    isSuspended: false,
  },
  {
    id: 3,
    image: "/assets/image/user.svg",
    name: "Motor Bike",
    mobile: "+91 8708393253",
    role: "admin",
    isActive: false,
    isSuspended: true,
  },
  {
    id: 4,
    image: "/assets/image/user.svg",
    name: "Truck",
    mobile: "+91 8708393253",
    role: "admin",
    isActive: true,
    isSuspended: false,
  },
  {
    id: 5,
    image: "/assets/image/user.svg",
    name: "Motor Bike",
    mobile: "+91 8708393253",
    role: "admin",
    isActive: true,
    isSuspended: false,
  },
  {
    id: 5,
    image: "/assets/image/user.svg",
    name: "Mini Truck",
    mobile: "+91 8708393253",
    role: "admin",
    isActive: true,
    isSuspended: false,
  },
];

const VehicleBody: React.FC = () => {
  const [addEditModal, setAddEditModal] = React.useState<boolean>(false);
  const [showManageModal, setShowManageModal] = React.useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  return (
    <div className="employee-detail-page">
      <DeleteVehicleModal
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        role = {arrayData[0]}
      />
      <div className="content">
        {arrayData?.map((item: object, index: any): ReactNode => {
          return (
            <div key={`${index}userbody`} className="employee-card">
              <div className="details">
                <div className="d-flex gap-3">
                  <img src="/assets/image/truck.svg" alt="user_image" />
                  <div className="name">
                    <span className="name_text">Truck</span>
                    <div className="d-flex gap-2">
                      License Plate: <span>UK07TA9307</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="options d-flex justify-content-end">
                <div className="d-flex  gap-2">
                  <button
                    className="activate "
                    style={{
                      borderColor: "#EAECF0",
                      color: "#1D2939",
                      fontWeight: "600",
                    }}
                    onClick={() => setAddEditModal(!addEditModal)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete"
                    style={{ fontWeight: "600", backgroundColor: "#EE6A5F/8%" }}
                    onClick={()=>{
                      setDeleteModalOpen(!deleteModalOpen)
                    }}
                 >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* <span>Hello world!</span> */}
      <VehicleModal
        add={false}
        addEditModal={addEditModal}
        setAddEditModal={() => setAddEditModal(!addEditModal)}
        showManageModal={showManageModal}
        setShowManageModal={() => setShowManageModal(!showManageModal)}
      />
      <ManageVehicleModal
        showManageModal={showManageModal}
        setShowManageModal={() => setShowManageModal(!showManageModal)}
      />
    </div>
  );
};

export default VehicleBody;
