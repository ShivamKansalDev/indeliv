import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "./vehicleModal.css";
// import "bootstrap/dist/css/bootstrap.min.css";

import "./ManageVehicle.css";

interface CheckVehicle {
  checked: boolean;
}
interface VehicleTypes {
  id: number;
  name: string;
  icon: null | string;
  category: string;
  created_at: string;
  updated_at: string;
  checked: boolean;
}
interface Vehicle {
  id: number;
  name: string;
  icon: null | string;
  category: string;
  created_at: string;
  updated_at: string;
}

const ManageVehicleModal = (props: any) => {
  const {
    showManageModal = false,
    setShowManageModal = () => {},
    setSelectedVehiclesList = (vehicle: VehicleTypes) => {},
  } = props;
  const selectedVehiclesList: VehicleTypes[] = props.selectedVehiclesList;
  const vehicleTypes: Vehicle[] = props.vehicleTypes;
  const handleClose = () => setShowManageModal();
  const [manageVehicle, setManageVehicle] = useState<VehicleTypes[]>([]);
  const [categoryOne, setCategoryOne] = useState<boolean>(false);
  const [categoryTwo, setCategoryTwo] = useState<boolean>(false);
  const [categoryThree, setCategoryThree] = useState<boolean>(false);

  useEffect(() => {
    const uniqueNames = new Set();
    let filteredArray = vehicleTypes.filter((obj) => {
      if (!uniqueNames.has(obj.category)) {
        uniqueNames.add(obj.category);
        return true;
      }
      return false;
    });
    let cat1 = false;
    let cat2 = false;
    let cat3 = false;
    filteredArray.forEach((item) => {
      if (item.category === "2 Wheeler") {
        cat1 = true;
      } else if (item.category === "3 Wheeler") {
        cat2 = true;
      } else if (item.category === "Heavy Vehicles") {
        cat3 = true;
      }
    });
    setCategoryOne(cat1);
    setCategoryTwo(cat2);
    setCategoryThree(cat3);
  }, [showManageModal]);

  useEffect(() => {
    if (showManageModal) {
      const updateCheck: VehicleTypes[] = vehicleTypes.map((item) => {
        const findIndex = selectedVehiclesList.findIndex(
          (subItem) => subItem.id === item.id
        );
        return {
          ...item,
          checked:
            findIndex > -1 ? selectedVehiclesList[findIndex]["checked"] : false,
        };
      });
      setManageVehicle(updateCheck);
    } else {
      setManageVehicle([]);
      setCategoryOne(false);
      setCategoryTwo(false);
      setCategoryThree(false);
    }
  }, [showManageModal]);

  return (
    <Modal show={showManageModal} onHide={handleClose} centered>
      <div className=" p-3">
        <div className="d-flex justify-content-center w-100">
          <Modal.Title
            className="generic_modal_title"
            style={{ fontSize: "24px", fontWeight: "600", color: "#1D2939" }}
          >
            Manage Vehicle Type
          </Modal.Title>
        </div>
        {categoryOne && (
          <div className="mt-3">
            <div className="line-container">
              <span className="line-text">2 Wheeler</span>
            </div>
            <div className="mb-3  d-flex justify-content-center p-3">
              <div className="d-flex  gap-2">
                {manageVehicle.map((item) => {
                  if (item.category === "2 Wheeler") {
                    return (
                      <div className="d-flex align-items-center  gap-3 p-2 rounded-2 bg">
                        <img
                          src={`/assets/Icon/${item.name}.svg`}
                          alt="scooter"
                        />
                        <span>{item.name}</span>
                        <input
                          type="checkbox"
                          checked={item.checked}
                          aria-label="Checkbox for following text input"
                          onChange={() => {
                            const updateList = manageVehicle.map((subItem) => {
                              return {
                                ...subItem,
                                checked:
                                  item.id === subItem.id
                                    ? !subItem.checked
                                    : subItem.checked,
                              };
                            });
                            setManageVehicle(updateList);
                          }}
                        />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        )}
        {categoryTwo && (
          <div>
            <div className="line-container">
              <span className="line-text">3 Wheeler</span>
            </div>
            <div className="mb-3  d-flex justify-content-center p-3">
              <div className="d-flex gap-2 ">
                {manageVehicle.map((item) => {
                  if (item.category === "3 Wheeler") {
                    return (
                      <div className="d-flex align-items-center  gap-3 p-2 rounded-2 bg">
                        <img
                          src={`/assets/Icon/Three-wheeled.svg`}
                          alt="scooter"
                        />
                        <span>{item.name}</span>
                        <input
                          type="checkbox"
                          checked={item.checked}
                          aria-label="Checkbox for following text input"
                          onChange={() => {
                            const updateList = manageVehicle.map((subItem) => {
                              return {
                                ...subItem,
                                checked:
                                  item.id === subItem.id
                                    ? !subItem.checked
                                    : subItem.checked,
                              };
                            });
                            setManageVehicle(updateList);
                          }}
                        />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        )}
        {/* 3 rd  */}
        {categoryThree && (
          <div className="">
            <div className="line-container">
              <span className="line-text">Heavy Vehicle</span>
            </div>
            <div className="mb-3    ">
              <div className="d-flex flex-wrap  justify-content-center p-2  gap-2">
                {manageVehicle.map((item) => {
                  if (item.category === "Heavy Vehicles") {
                    return (
                      <div className="d-flex align-items-center  gap-3 p-2 rounded-2 bg">
                        {item.name.toLowerCase() === "car" && (
                          <img src="/assets/Icon/Car.svg" alt="user_image" />
                        )}
                        {item.name.toLowerCase() === "truck" && (
                          <img src="/assets/Icon/Truck.svg" alt="user_image" style={{width:"32px", height:"32px"}} />
                        )}
                        {item.name.toLowerCase() === "refrigerated truck" && (
                          <img
                            src="/assets/Icon/Refrigerated Truck.svg"
                            alt="user_image"
                            style={{width:"32px", height:"32px"}}
                          />
                        )}
                        {item.name.toLowerCase() === "refrigerated van" && (
                          <img
                            src="/assets/Icon/Refrigerated vans.svg"
                            alt="user_image"
                            style={{width:"32px", height:"32px"}}
                          />
                        )}
                        {item.name.toLowerCase() === "mini truck" && (
                          <img
                            src="/assets/Icon/Mini Truck.svg"
                            alt="user_image"
                          />
                        )}
                        {item.name.toLowerCase() === "pick-up truck" && (
                          <img
                            src="/assets/Icon/Pick-up trucks.svg"
                            alt="user_image"
                          />
                        )}
                        {item.name.toLowerCase() === "van" && (
                          <img src="/assets/Icon/Van.svg" alt="user_image" />
                        )}
                        <span>{item.name}</span>
                        <input
                          type="checkbox"
                          id={`${item.id}`}
                          checked={item.checked}
                          aria-label="Checkbox for following text input"
                          onChange={() => {
                            console.log("@@@@@ TARGET: ", item);
                            const updateList = manageVehicle.map((subItem) => {
                              return {
                                ...subItem,
                                checked:
                                  item.id === subItem.id
                                    ? !subItem.checked
                                    : subItem.checked,
                              };
                            });
                            setManageVehicle(updateList);
                          }}
                        />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="search-bar-input">
        {/* <Modal.Footer> */}
        <div className="d-flex justify-content-end gap-2 generic-modal-footer">
          <Button
            className="edit_cancel_button border_radius_8"
            variant="light"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="generic_apply_button border_radius_8"
            style={{ padding: "8px 25px" }}
            onClick={() => {
              setSelectedVehiclesList(manageVehicle);
              handleClose();
            }}
          >
            {"Save"}
          </Button>
        </div>
        {/* </Modal.Footer> */}
      </div>
    </Modal>
  );
};

export default ManageVehicleModal;
