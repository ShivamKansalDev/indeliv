import React, { useState } from "react";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import "./vehicleModal.css";
import "bootstrap/dist/css/bootstrap.min.css";

const VehicleModal = ({
  add = true,
  addEditModal = false,
  setAddEditModal = () => {},
  showManageModal = false,
  setShowManageModal = () => {}
}) => {
  const [selectedOption, setSelectedOption] = useState("Select Vehicle");

  const handleSelect = (eventKey: any) => {
    setSelectedOption(eventKey);
  };

  const handleClose = () => setAddEditModal();

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
            <Dropdown.Item eventKey="Truck">Truck</Dropdown.Item>
            <Dropdown.Item eventKey="Motor Bike">Motor Bike</Dropdown.Item>
            <Dropdown.Item eventKey="Car">Car</Dropdown.Item>
            <Dropdown.Item eventKey="Refrigerated Van">Refrigerated Van</Dropdown.Item>
            <Dropdown.Item eventKey="Refrigerated Truck">Refrigerated Truck</Dropdown.Item>
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
                type="email"
                placeholder="XXXXXXXXX"
                autoFocus
              />
               <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            {(add)? 'Save Changes' : "Apply Changes"}
          </Button>
        </Modal.Footer>
        </div>
      </div>
    </Modal>
  );
};

export default VehicleModal;
