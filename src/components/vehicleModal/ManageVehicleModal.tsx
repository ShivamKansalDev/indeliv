import React, { useState } from "react";
import { Button, Dropdown, Form, InputGroup, Modal } from "react-bootstrap";
import "./vehicleModal.css";
import "bootstrap/dist/css/bootstrap.min.css";

import "./ManageVehicle.css";
const ManageVehicleModal = ({
  showManageModal = false,
  setShowManageModal = () => {},
}) => {
  const handleClose = () => setShowManageModal();

  return (
    <Modal show={showManageModal} onHide={handleClose} centered>
      <div className=" p-3">
        <div className="d-flex justify-content-center w-100">
          <Modal.Title>Manage Vehicle Type</Modal.Title>
        </div>
        <div>
          <hr className="position-relative line" />
          <button className="position-absolute custom-top-10 start-0 translate-middle">
            2 Wheeler
          </button>
          <div className="mb-3  d-flex justify-content-center p-3">
            <div className="d-flex  gap-2">
              <div className="d-flex align-items-center  gap-3 p-2 rounded-2 bg  ">
                <img src="/assets/Icon/Scooter.svg" alt="scooter" />
                <span>Scooter</span>
                <input
                  type="checkbox"
                  aria-label="Checkbox for following text input"
                />
              </div>

              <div className="d-flex align-items-center  gap-3 p-2 rounded-2 bg ">
                <img src="/assets/Icon/Motor Bike.svg" alt="scooter" />
                <span>Motor Bike</span>
                <input
                  type="checkbox"
                  aria-label="Checkbox for following text input"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <hr className="position-relative line" />
          <button className="position-absolute custom-top-20 start-0 translate-middle">
            3 Wheeler
          </button>
          <div className="mb-3  d-flex justify-content-center p-3">
            <div className="d-flex gap-2 ">
              <div className="d-flex align-items-center  gap-3 p-2 rounded-2  bg ">
                <img src="/assets/Icon/Three-wheeled.svg" alt="scooter" />
                <span>Three-wheeled</span>
                <input
                  type="checkbox"
                  aria-label="Checkbox for following text input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3 rd  */}

        <div className="">
          <hr className="position-relative line mb-4" />
          <button className="position-absolute custom-top-30 start-0 translate-middle ">
            Heavy Vehicle
          </button>
          <div className="mb-3    ">
            <div className="d-flex  justify-content-around ">
              <div className="d-flex  align-items-center  gap-2  p-2   rounded-2  bg  ">
                <img src="/assets/Icon/Car.png" alt="scooter" />
                <span>Car</span>
                <input
                  type="checkbox"
                  aria-label="Checkbox for following text input"
                />
              </div>
              <div className="d-flex align-items-center  gap-2  p-2   rounded-2  bg">
                <img src="/assets/Icon/Group.png" alt="scooter" />
                <span>Refrigerated Truck</span>
                <input
                  type="checkbox"
                  aria-label="Checkbox for following text input"
                />
              </div>
              <div className="d-flex align-items-center  gap-2  p-2   rounded-2  bg">
                <img src="/assets/Icon/van.png" alt="scooter" />
                <span>Van</span>
                <input
                  type="checkbox"
                  aria-label="Checkbox for following text input"
                />
              </div>
            </div>

            <div className="d-flex flex-wrap  justify-content-center gap-2  p-2">
              <div className="d-flex align-items-center  gap-3 p-2 rounded-2 bg ">
                <img src="/assets/Icon/Pick-up trucks.png" alt="scooter" />
                <span>Pick-up trucks</span>
                <input
                  type="checkbox"
                  aria-label="Checkbox for following text input"
                />
              </div>
              <div className="d-flex align-items-center  gap-3 p-2 rounded-2  bg">
                <img src="/assets/Icon/_x31_7_Van.png" alt="scooter" />
                <span>Refrigerated vans</span>
                <input
                  type="checkbox"
                  aria-label="Checkbox for following text input"
                />
              </div>
            </div>

            <div className="d-flex flex-wrap  justify-content-center p-2  gap-2">
              <div className="d-flex align-items-center  gap-3 p-2 rounded-2 bg ">
                <img src="/assets/Icon/Mini Truck.png" alt="scooter" />
                <span>Mini Truck</span>
                <input
                  type="checkbox"
                  aria-label="Checkbox for following text input"
                />
              </div>
              <div className="d-flex align-items-center  gap-3 p-2 rounded-2  bg">
                <img src="/assets/Icon/Truck.png" alt="scooter" />
                <span>Truck</span>
                <input
                  type="checkbox"
                  aria-label="Checkbox for following text input"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="search-bar-input">
          {/* <Modal.Footer> */}
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              {"Save"}
            </Button>
          </div>
          {/* </Modal.Footer> */}
        </div>
      </div>
    </Modal>
  );
};

export default ManageVehicleModal;
