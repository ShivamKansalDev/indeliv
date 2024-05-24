import React, { useState } from "react";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import "./vehicleModal.css";
import "bootstrap/dist/css/bootstrap.min.css";

const ManageVehicleModal = ({
  showManageModal = false,
  setShowManageModal = () => {}
}) => {

  const handleClose = () => setShowManageModal();

  return (
    <Modal show={showManageModal}  onHide={handleClose} centered>
      <div className=" p-3">


        <Modal.Header closeButton>
          <Modal.Title >Manage Vehicle Type</Modal.Title>
        </Modal.Header>

        <div className="search-bar-input">
               <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            {'Save'}
          </Button>
        </Modal.Footer>
        </div>
      </div>
    </Modal>
  );
};

export default ManageVehicleModal;
