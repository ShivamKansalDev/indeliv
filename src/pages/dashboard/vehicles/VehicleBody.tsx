import React, { ReactNode, useEffect, useState } from "react";
import "../employees/users/employee-detail.scss";
import VehicleModal from "@/components/vehicleModal/VehicleModal";
import { Button } from "react-bootstrap";
import ManageVehicleModal from "@/components/vehicleModal/ManageVehicleModal";
import { API } from "@/api";
import { createVehicle, deleteVehicle, listVehicles, updateVehicle, vehiclesTypes } from "@/api/vehicles";
import VehicleHeader from "./VehicleHeader";
import DeleteVehicleModal from "@/components/vehicleModal/deleteVehicleModal";

interface Vehicle {
  id: number;
  name: string;
  vehicle_type_id: number;
  created_at: string;
  updated_at: string;
  vehicle_type: string;
}

interface VehicleTypes{
  id: number;
  name: string;
  icon: null;
  category: string;
  created_at: string;
  updated_at: string;
}

interface NewVehicle {
  type: string;
  licensePlate: string;
}
interface SelectedVehicle{
  id: number;
  name: string;
  icon: null;
  category: string;
  created_at: string;
  updated_at: string;
  checked: boolean;
}

const VehicleBody: React.FC = () => {
  const [addEditModal, setAddEditModal] = React.useState<boolean>(false);
  const [showManageModal, setShowManageModal] = React.useState<boolean>(false);
  const [vehiclesList, setVehiclesList] = useState<Vehicle[]>([]);
  const [addVehicle, setAddVehicle] = useState<boolean>(false);
  const [newVehicleDetails, setNewVehicleDetails] = useState<Vehicle>();
  const [currentSelection, setCurrentSelection] = useState<Vehicle | null>(null);
  const [deleteSelection, setDeleteSelection] = useState<Vehicle | null>(null);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleTypes[]>([]);
  const [selectedVehiclesList, setSelectedVehiclesList] = useState<SelectedVehicle[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if(addEditModal){
      const uniqueNames = new Set();
      let filteredArray = vehiclesList.filter(obj => {
        if (!uniqueNames.has(obj.vehicle_type)) {
          uniqueNames.add(obj.vehicle_type);
          return true;
        }
        return false;
      });
      // setUniqueVehiclesList(filteredArray);
      const selectedList = vehicleTypes.map((item) => {
        const findIndex = filteredArray.findIndex((subItem) => subItem.vehicle_type.toLowerCase() === item.name.toLowerCase());
        return {
          ...item,
          checked: (findIndex > -1)? true : false
        }
      }).filter((item) => {
        return item.checked === true
      })
      setSelectedVehiclesList(selectedList);
    }else{
      setCurrentSelection(null)
    }
  }, [addEditModal]);

  useEffect(() => {
    if(addVehicle){
      setAddEditModal(!addEditModal);
    }
  }, [addVehicle]);

  useEffect(() => {
    if(currentSelection){
      console.log(currentSelection);
      setAddEditModal(!addEditModal);
    }
  }, [currentSelection])

  useEffect(() => {
    if(deleteSelection){
      setDeleteModalOpen(!deleteModalOpen)
    }
  }, [deleteSelection])

  useEffect(() => {
    getVehiclesList();
    getVehicleTypes();
  }, []);

  async function getVehiclesList(){
    try {
      const response = await listVehicles();
      setVehiclesList(response.data);
    } catch (error) {
      console.log("!!! VEHICLES ERROR: ", error);
    }
  }

  async function getVehicleTypes(){
    try {
      const response = await vehiclesTypes();
      setVehicleTypes(response.data);
    } catch (error) {
      console.log("!!! VEHICLES ERROR: ", error);
    }
  }

  async function vehicleUpdate(data: string){
    try {
      const response = await updateVehicle(data);
      getVehiclesList();
    } catch (error) {
      console.log("!!! VEHICLES UPDATE ERROR: ", error);
    }
  }

  async function addNewVehicle(data: string){
    try {
      const response = await createVehicle(data);
      getVehiclesList();
    } catch (error) {
      console.log("!!! VEHICLES UPDATE ERROR: ", error);
    }
  }

  async function deleteVehicleItem(){
    try {
      if(deleteSelection?.id){
        const response = await deleteVehicle(deleteSelection?.id);
        getVehiclesList();
      }
    } catch (error) {
      console.log("!!! VEHICLES DELETE ERROR: ", error);
    }
  }

  return (
    <>
      <VehicleHeader 
        setAddVehicle={() => setAddVehicle(true)}
      />
      <div className="employee-detail-page">
        <DeleteVehicleModal
          deleteModalOpen={deleteModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
          deleteSelection={deleteSelection}
          deleteVehicleItem={deleteVehicleItem}
        />
        <div className="content">
          {vehiclesList?.map((item: Vehicle, index: any): ReactNode => {
            return (
              <div key={`${item.id}userbody`} className="employee-card">
                <div className="details">
                  <div className="d-flex gap-3">
                    {(item.vehicle_type.toLowerCase() === "car")&& (
                      <img src="/assets/Icon/Car.svg" alt="user_image" />
                    )}
                    {(item.vehicle_type.toLowerCase() === "truck")&& (
                      <img src="/assets/Icon/Truck.svg" alt="user_image" />
                    )}
                    {(item.vehicle_type.toLowerCase() === "scooter")&& (
                      <img src="/assets/Icon/Scooter.svg" alt="user_image" />
                    )}
                    {(item.vehicle_type.toLowerCase() === "motor bike")&& (
                      <img src="/assets/Icon/Motor Bike.svg" alt="user_image" />
                    )}
                    {(item.vehicle_type.toLowerCase() === "three-wheeled")&& (
                      <img src="/assets/Icon/Three-wheeled.svg" alt="user_image" />
                    )}
                    {(item.vehicle_type.toLowerCase() === "refrigerated truck")&& (
                      <img src="/assets/Icon/Refrigerated Truck.svg" alt="user_image" />
                    )}
                    {(item.vehicle_type.toLowerCase() === "refrigerated vans")&& (
                      <img src="/assets/Icon/Refrigerated Truck.svg" alt="user_image" />
                    )}
                    {(item.vehicle_type.toLowerCase() === "mini truck")&& (
                      <img src="/assets/Icon/Mini Truck.svg" alt="user_image" />
                    )}
                    {(item.vehicle_type.toLowerCase() === "pick-up truck")&& (
                      <img src="/assets/Icon/Pick-up trucks.svg" alt="user_image" />
                    )}
                    {(item.vehicle_type.toLowerCase() === "vans")&& (
                      <img src="/assets/Icon/Vans.svg" alt="user_image" />
                    )}
                    <div className="name">
                      <span className="name_text">{item.vehicle_type}</span>
                      <div className="d-flex gap-2">
                        License Plate: <span>{item.name}</span>
                      </div>
                    </div>
                  </div>
              
                </div>
                <div className="options d-flex justify-content-end">
                  <div className="d-flex  gap-2">
                    <button 
                      className="activate " 
                      style={{borderColor:"#EAECF0", color:"#1D2939",fontWeight:"600"}} 
                      onClick={() => setCurrentSelection(item)}
                    >
                        Edit
                    </button>
                    <button
                      className="delete"
                      style={{ fontWeight: "600", backgroundColor: "#EE6A5F/8%" }}
                      onClick={()=>{
                        setDeleteSelection(item);
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
        {(addEditModal && (addVehicle || !addVehicle)) && (
          <VehicleModal 
            add={addVehicle}
            selectedVehiclesList={selectedVehiclesList}
            setSelectedVehiclesList={setSelectedVehiclesList}
            currentSelection={currentSelection}
            vehicleTypes={vehicleTypes}
            vehiclesList={vehiclesList}
            addEditModal={addEditModal}
            setAddEditModal={() => {
              setAddEditModal(!addEditModal);
              setAddVehicle(false);
            }}
            showManageModal={showManageModal}
            setShowManageModal={() => setShowManageModal(!showManageModal)}
            setNewVehicleDetails={(value: Vehicle) => {
              if(!addVehicle){
                const data = `${value.id}?name=${value.name}&vehicle_type_id=${value.vehicle_type_id}`
                vehicleUpdate(data);
              }else{
                const data = `name=${value.name}&vehicle_type_id=${value.vehicle_type_id}`;
                addNewVehicle(data);
              }
            }} 
          />
        )}
        <ManageVehicleModal 
          showManageModal={showManageModal}
          setShowManageModal={() => setShowManageModal(!showManageModal)}
          selectedVehiclesList={selectedVehiclesList}
          setSelectedVehiclesList={setSelectedVehiclesList}
          vehicleTypes={vehicleTypes}
        />
      </div>
    </>
  );
};

export default VehicleBody;
