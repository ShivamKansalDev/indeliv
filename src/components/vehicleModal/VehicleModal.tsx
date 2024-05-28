import React, { useEffect, useState } from "react";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import "./vehicleModal.css";
import "bootstrap/dist/css/bootstrap.min.css";

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
    setNewVehicleDetails = (vehicle: Vehicle) => {}
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

  const handleClose = () => {
    setAddEditModal();
  };

  useEffect(() => {
    if(!add){
      const selection = vehicleTypes.find((item) => {
        // console.log(item.name.toLowerCase() , currentSelection.vehicle_type.toLowerCase());
        return item.name.toLowerCase() === currentSelection.vehicle_type.toLowerCase()
      });
      // console.log("@@@ EDIT: ", selection);
      if(selection){
        setSelectedOption(selection.name);
        setLicensePlate(currentSelection.name);
      }
    }
  }, [addEditModal])

  return (
    <Modal show={addEditModal}  onHide={handleClose} centered>
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


        <Modal.Header closeButton>
          <Modal.Title>{add? 'Add Vehicle' : 'Edit Vehicle'}</Modal.Title>
        </Modal.Header>
        <div className=" d-flex justify-content-between">
          <p className="p-1">Vehicle Type</p>
          <p className="fw-bold" style={{ color: "#0080FC", cursor: "pointer" }} onClick={() => setShowManageModal()}>
            Manage
          </p>
        </div>

        <Dropdown onSelect={handleSelect}>
          <Dropdown.Toggle
            variant="secondary"
            id="dropdown-basic"
            className="custom-dropdown-toggle res"
          >
            {selectedOption}
          </Dropdown.Toggle>

          <Dropdown.Menu className="custom-dropdown-menu">
            {selectedVehiclesList?.map((vehicle) => {
              if(!vehicle.checked){
                return null;
              }
              return (
                <Dropdown.Item key={`type${vehicle.id}`} eventKey={vehicle.name}>{vehicle.name}</Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>

        <p className="m-2">License Plate</p>
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
                placeholder="XXXXXXXXX"
                autoFocus
                onChange={(e) => {
                  const regex = /[^A-Z0-9]/g;
                  setLicensePlate(e.target.value.replace(regex, ''));
                }}
              />
               <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            if(!selectedOption || !licensePlate){
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
            {(add)? 'Save Changes' : "Apply Changes"}
          </Button>
        </Modal.Footer>
        </div>
      </div>
    </Modal>
  );
};

export default VehicleModal;
