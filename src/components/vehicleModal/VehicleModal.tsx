import React, { useEffect, useState } from "react";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import "./vehicleModal.css";
// import "bootstrap/dist/css/bootstrap.min.css";

interface Vehicle {
  id: number;
  name: string;
  vehicle_type_id: number;
  created_at: string;
  updated_at: string;
  vehicle_type: string;
}

interface SelectedVehicle {
  id: number;
  name: string;
  vehicle_type_id: number;
  created_at: string;
  updated_at: string;
  vehicle_type: string;
  checked: boolean;
}

interface VehicleTypes{
  id: number;
  name: string;
  icon: null;
  category: string;
  created_at: string;
  updated_at: string;
  checked: boolean;
}
interface NewVehicle {
  type: string;
  licensePlate: string;
}

const VehicleModal = (props : any) => {
  const {
    add = true,
    addEditModal = false,
    setAddEditModal = () => {},
    showManageModal = false,
    setShowManageModal = () => {},
    setNewVehicleDetails = (vehicle: Vehicle) => {},
    setSelectedVehiclesList = () => {}
  } = props;
  const currentSelection: Vehicle = props.currentSelection;
  const vehicleTypes: VehicleTypes[] = props.vehicleTypes;
  const vehiclesList: Vehicle[] = props.vehiclesList;
  const selectedVehiclesList: VehicleTypes[] = props.selectedVehiclesList;
  const [selectedOption, setSelectedOption] = useState("Select Vehicle");
  const [licensePlate, setLicensePlate] = useState<string>();
  const [uniqueVehiclesList, setUniqueVehiclesList] = useState<Vehicle[]>([]);

  const handleSelect = (eventKey: any) => {
    setSelectedOption(eventKey);
  };

  function rearrangeSelectedVehiclesList() {
    console.log("^^^^^^^ findVehicleIndex: ", selectedVehiclesList);
    const findVehicleIndex = selectedVehiclesList.findIndex((item) => {
      return (item.name === selectedOption)    
    });
    if(findVehicleIndex > -1){
      const newData = Array.from(selectedVehiclesList)
      const initialIndexData = newData[0];
      newData[0] = newData[findVehicleIndex];
      newData[findVehicleIndex] = initialIndexData;
      setSelectedVehiclesList(newData);
    }
  }

  const handleClose = () => {
    setAddEditModal();
  };

  useEffect(() => {
    if(selectedOption){
      // rearrangeSelectedVehiclesList();
    }
  }, [selectedOption])

  useEffect(() => {
    if(!add){
      const selection = vehicleTypes.find((item) => {
        // console.log(item.name.toLowerCase() , currentSelection.vehicle_type.toLowerCase());
        return item.name.toLowerCase() === currentSelection.vehicle_type.toLowerCase()
      });
      console.log("@@@ EDIT: ", selection?.name);
      if(selection){
        setSelectedOption(selection.name);
        setLicensePlate(currentSelection.name);
      }
    }
  }, [addEditModal])

  return (
<div className="">
<Modal show={addEditModal}  onHide={handleClose} centered modal-dialog2 modal-content2  className="addVehicle" >
      <div className=" p-3">
        {/* <div className="border-bottom-gray mb-2 d-flex justify-content-between">
          <p className="fw-bold">Add Vehicle</p>
          <img
            src="/assets/Icon/Close.svg"
            alt="Close"
            width={24}
            height={24}
          />
        </div> */}


        <Modal.Header closeButton className="modal-header mx-2 px-0 pt-1 pb-3 mb-3 generic-modal-header">
          <Modal.Title className="generic_modal_title" style={{fontWeight:"600"}}>{add? 'Add Vehicle' : 'Edit Vehicle'}</Modal.Title>
        </Modal.Header>
        <div className="d-flex justify-content-between">
          <p className="p-1" style={{fontSize:"14px", fontWeight:"400"}}>Vehicle Type</p>
          <p className="fw-bold" style={{ color: "#0080FC", cursor: "pointer", fontSize: "14px", fontWeight: "500" }} onClick={() => setShowManageModal()}>
            Manage
          </p>
        </div>

        <Dropdown onSelect={handleSelect} >
          <Dropdown.Toggle
            variant="secondary"
            id="dropdown-basic"
            className="custom-dropdown-toggle res too" 
          >
            {selectedOption}
            <svg
                    className="logout-arrow"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.5999 7.4585L11.1666 12.8918C10.5249 13.5335 9.4749 13.5335 8.83324 12.8918L3.3999 7.4585"
                      stroke="#667085"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
          </Dropdown.Toggle>

          <Dropdown.Menu className="custom-dropdown-menu">
            {(selectedOption) && (
                <div className="d-flex justify-content-between position-relative">

                <Dropdown.Item key={'selectRole1'}        style={{color:"#0080FC",fontWeight:"500",fontSize:"14px"}} className={"bgClass"} eventKey={selectedOption}>{selectedOption}</Dropdown.Item>
                <div className="position-absolute top-0 end-0" >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none"> <path d="M1.33325 5.4165L3.99992 8.08317L10.6666 1.4165" stroke="#0095FF" stroke-width="1.50035" stroke-linecap="round" stroke-linejoin="round"/> </svg>
                </div>
                </div>
            )}
            {selectedVehiclesList?.map((vehicle) => {
              if(!vehicle.checked){
                return null;
              }
              if(vehicle.name === selectedOption){
                return null;
              }
              return (
                <Dropdown.Item key={`type${vehicle.id}`}        style={{color:"rgb(102, 112, 133)", fontWeight:"400",fontSize:"14px"}} eventKey={vehicle.name}>{vehicle.name}</Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>

        <p className="m-2 mt-3 mb-3" style={{fontSize:"14px", fontWeight:"400"}}>License Plate</p>
        <div className="search-bar-input">
            {/* <input
              // value={searchTxt}
              // onChange={(e) => setSearchTxt(e.target.value)}
              type="search"
              placeholder="UK07TA9074"
              className="w-100 p-2 bor"
            /> */}

         {/* <Form.Label>Email address</Form.Label> */}
              <Form.Control
                type="text"
                value={licensePlate}
                style={{color:"rgb(102, 112, 133)"}}
                placeholder="XXXXXXXXX"
                autoFocus
                onChange={(e) => {
                  const regex = /[^a-zA-Z0-9]/g;
                  setLicensePlate(e.target.value.replace(regex, ''));
                }}
              />
        </div>
      </div>
      <div className="d-flex justify-content-end generic-modal-footer generic-modal-footer4  generic-modal-footer2 g-6">
        <Button variant="default" className="edit_cancel_button edit_cancel_button2 border_radius_8" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" className="generic_apply_button generic_apply_button2  border_radius_8" onClick={() => {
          if((selectedOption === "Select Vehicle") || !licensePlate){
            return;
          }
          const findVehicle = vehicleTypes.find((item) => item.name === selectedOption);
          setNewVehicleDetails({
            ...currentSelection,
            name: licensePlate,
            vehicle_type_id: findVehicle?.id,
            vehicle_type: findVehicle?.name
          })
          handleClose();
        }}>
          {(add)? 'Save ' : "Apply Changes"}
        </Button>
      </div>
    </Modal>
</div>
  );
};

export default VehicleModal;
