import React, { useEffect, useState } from "react";
import { Button, Dropdown, Form, InputGroup, Modal } from "react-bootstrap";
import "./vehicleModal.css";
import "bootstrap/dist/css/bootstrap.min.css";

import "./ManageVehicle.css";

interface CheckVehicle {
  checked: boolean;
}
interface VehicleTypes{
  id: number;
  name: string;
  icon: null|string;
  category: string;
  created_at: string;
  updated_at: string;
  checked: boolean;
}
interface Vehicle{
  id: number;
  name: string;
  icon: null|string;
  category: string;
  created_at: string;
  updated_at: string;
}

const ManageVehicleModal = (props : any) => {
  const {
    showManageModal = false,
    setShowManageModal = () => {},
    setSelectedVehiclesList = (vehicle: VehicleTypes) => {}
  } = props;
  const selectedVehiclesList: VehicleTypes[] = props.selectedVehiclesList;
  const vehicleTypes: Vehicle[] = props.vehicleTypes;
  const handleClose = () => setShowManageModal();
  const [scooter, setScooter] = useState<CheckVehicle>({
    checked: false
  });
  const [motorBike, setMotorBike] = useState<CheckVehicle>({
    checked: false
  });
  const [threeWheeled, setThreeWheeled] = useState<CheckVehicle>({
    checked: false
  });
  const [car, setCar] = useState<CheckVehicle>({
    checked: false
  });
  const [van, setVan] = useState<CheckVehicle>({
    checked: false
  });
  const [refTruck, setRefTruck] = useState<CheckVehicle>({
    checked: false
  });
  const [refVan, setRefVan] = useState<CheckVehicle>({
    checked: false
  });
  const [pickUpTruck, setPickUpTruck] = useState<CheckVehicle>({
    checked: false
  });
  const [miniTruck, setMiniTruck] = useState<CheckVehicle>({
    checked: false
  });
  const [truck, setTruck] = useState<CheckVehicle>({
    checked: false
  });
  const [manageVehicle, setManageVehicle] = useState<VehicleTypes[]>([])

  useEffect(() => {
    console.log("&&& PICK UP TRUCK: ", pickUpTruck);
  }, [pickUpTruck]);

  useEffect(() => {
    if(showManageModal){
      const manageModalList = selectedVehiclesList.map((item) => item);
      setManageVehicle(manageModalList);
      const findScooter = manageModalList.find((item) => item.name === "Scooter")
      const findMotorBike = manageModalList.find((item) => item.name === "Motor Bike")
      const findThreeWheeled= manageModalList.find((item) => item.name === "Three-Wheeled")
      const findCar = manageModalList.find((item) => item.name === "Car")
      const findVan = manageModalList.find((item) => item.name === "Van")
      const findRefTruck = manageModalList.find((item) => item.name === "Refrigerated Truck")
      const findRefVan = manageModalList.find((item) => item.name === "Refrigerated Van")
      const findPickUpTruck = manageModalList.find((item) => item.name === "Pick-up Truck")
      const findMiniTruck = manageModalList.find((item) => item.name === "Mini Truck")
      const findTruck = manageModalList.find((item) => item.name === "Truck")

      // console.log("PICK UP TRUCK: ", findPickUpTruck)

      if(findScooter !== undefined){
        setScooter({
          checked: findScooter.checked
        })
      }
      if(findMotorBike !== undefined){
        setMotorBike({
          checked: findMotorBike.checked
        })
      }
      if(findThreeWheeled !== undefined){
        setThreeWheeled({
          checked: findThreeWheeled.checked
        })
      }
      if(findCar !== undefined){
        setCar({
          checked: findCar.checked
        })
      }
      if(findVan !== undefined){
        setVan({
          checked: findVan.checked
        })
      }
      if(findRefTruck !== undefined){
        setRefTruck({
          checked: findRefTruck.checked
        })
      }
      if(findRefVan !== undefined){
        setRefVan({
          checked: findRefVan.checked
        })
      }
      if(findPickUpTruck !== undefined){
        setPickUpTruck({
          checked: findPickUpTruck.checked
        })
      }
      if(findMiniTruck !== undefined){
        setMiniTruck({
          checked: findMiniTruck.checked
        })
      }
      if(findTruck !== undefined){
        setTruck({
          checked: findTruck.checked
        })
      }
    }else{
      setScooter({checked: false});
      setMotorBike({checked: false})
      setThreeWheeled({checked: false})
      setCar({checked: false})
      setVan({checked: false})
      setRefTruck({checked: false})
      setRefVan({checked: false})
      setPickUpTruck({checked: false})
      setMiniTruck({checked: false})
      setTruck({checked: false});
    }
  }, [showManageModal])

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
              <div 
                className="d-flex align-items-center  gap-3 p-2 rounded-2 bg"     
              >
                <img src="/assets/Icon/Scooter.svg" alt="scooter" />
                <span>Scooter</span>
                <input
                  type="checkbox"
                  checked={scooter.checked}
                  aria-label="Checkbox for following text input"
                  onClick={() => {
                    const updateList = manageVehicle.map((item) => {
                      if(item.name === "Scooter"){
                        return {
                          ...item,
                          checked: !scooter.checked
                        }
                      }else{
                        return item;
                      }
                    })
                    const findVehicle = manageVehicle.find((item) => item.name === "Scooter");
                    if(!findVehicle){
                      let findItem = vehicleTypes.find((subItem) => subItem.name === "Scooter")
                      if(findItem){
                        const addItem: VehicleTypes = Object.assign({}, findItem, {checked: true});
                        updateList.push(addItem);
                      }
                    }
                    setScooter({
                      checked: !scooter.checked
                    })
                    setManageVehicle(updateList)
                  }}
                />
              </div>

              <div className="d-flex align-items-center  gap-3 p-2 rounded-2 bg ">
                <img src="/assets/Icon/Motor Bike.svg" alt="scooter" />
                <span>Motor Bike</span>
                <input
                  type="checkbox"
                  checked={motorBike.checked}
                  onClick={() => {
                    const updateList = manageVehicle.map((item) => {
                      if(item.name === "Motor Bike"){
                        return {
                          ...item,
                          checked: !motorBike.checked
                        }
                      }else{
                        return item;
                      }
                    })
                    const findVehicle = manageVehicle.find((item) => item.name === "Motor Bike");
                    if(!findVehicle){
                      let findItem = vehicleTypes.find((subItem) => subItem.name === "Motor Bike")
                      if(findItem){
                        const addItem: VehicleTypes = Object.assign({}, findItem, {checked: true});
                        updateList.push(addItem);
                      }
                    }
                    setMotorBike({
                      checked: !motorBike.checked
                    })
                    setManageVehicle(updateList)
                  }}
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
                  checked={threeWheeled.checked}
                  onClick={() => {
                    const updateList = manageVehicle.map((item) => {
                      if(item.name === "Three-Wheeled"){
                        return {
                          ...item,
                          checked: !threeWheeled.checked
                        }
                      }else{
                        return item;
                      }
                    })
                    const findVehicle = manageVehicle.find((item) => item.name === "Three-Wheeled");
                    if(!findVehicle){
                      let findItem = vehicleTypes.find((subItem) => subItem.name === "Three-Wheeled")
                      if(findItem){
                        const addItem: VehicleTypes = Object.assign({}, findItem, {checked: true});
                        updateList.push(addItem);
                      }
                    }
                    setThreeWheeled({
                      checked: !threeWheeled.checked
                    })
                    setManageVehicle(updateList)
                  }}
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
                  checked={car.checked}
                  onClick={() => {
                    const updateList = manageVehicle.map((item) => {
                      if(item.name === "Car"){
                        return {
                          ...item,
                          checked: !car.checked
                        }
                      }else{
                        return item;
                      }
                    })
                    const findVehicle = manageVehicle.find((item) => item.name === "Car");
                    if(!findVehicle){
                      let findItem = vehicleTypes.find((subItem) => subItem.name === "Car")
                      if(findItem){
                        const addItem: VehicleTypes = Object.assign({}, findItem, {checked: true});
                        updateList.push(addItem);
                      }
                    }
                    setCar({
                      checked: !car.checked
                    })
                    setManageVehicle(updateList)
                  }}
                  aria-label="Checkbox for following text input"
                />
              </div>
              <div className="d-flex align-items-center  gap-2  p-2   rounded-2  bg">
                <img src="/assets/Icon/Group.png" alt="scooter" />
                <span>Refrigerated Truck</span>
                <input
                  type="checkbox"
                  checked={refTruck.checked}
                  onClick={() => {
                    const updateList = manageVehicle.map((item) => {
                      if(item.name === "Refrigerated Truck"){
                        return {
                          ...item,
                          checked: !refTruck.checked
                        }
                      }else{
                        return item;
                      }
                    })
                    const findVehicle = manageVehicle.find((item) => item.name === "Refrigerated Truck");
                    if(!findVehicle){
                      let findItem = vehicleTypes.find((subItem) => subItem.name === "Refrigerated Truck")
                      if(findItem){
                        const addItem: VehicleTypes = Object.assign({}, findItem, {checked: true});
                        updateList.push(addItem);
                      }
                    }
                    setRefTruck({
                      checked: !refTruck.checked
                    })
                    setManageVehicle(updateList)
                  }}
                  aria-label="Checkbox for following text input"
                />
              </div>
              <div className="d-flex align-items-center  gap-2  p-2   rounded-2  bg">
                <img src="/assets/Icon/van.png" alt="scooter" />
                <span>Van</span>
                <input
                  type="checkbox"
                  checked={van.checked}
                  onClick={() => {
                    const updateList = manageVehicle.map((item) => {
                      // console.log(item)
                      if(item.name === "Van"){
                        return {
                          ...item,
                          checked: !van.checked
                        }
                      }else{
                        return item;
                      }
                    })
                    const findVehicle = manageVehicle.find((item) => item.name === "Van");
                    if(!findVehicle){
                      let findItem = vehicleTypes.find((subItem) => subItem.name === "Van")
                      if(findItem){
                        const addItem: VehicleTypes = Object.assign({}, findItem, {checked: true});
                        updateList.push(addItem);
                      }
                    }
                    setVan({
                      checked: !van.checked
                    })
                    setManageVehicle(updateList)
                  }}
                  aria-label="Checkbox for following text input"
                />
              </div>
            </div>

            <div className="d-flex flex-wrap  justify-content-center gap-2  p-2">
              <div className="d-flex align-items-center  gap-3 p-2 rounded-2 bg ">
                <img src="/assets/Icon/Pick-up trucks.png" alt="scooter" />
                <span>Pick-up Truck</span>
                <input
                  type="checkbox"
                  checked={pickUpTruck.checked}
                  onClick={() => {
                    const updateList = manageVehicle.map((item) => {
                      if(item.name === "Pick-up Truck"){
                        console.log("Pick-up Truck: ", item.name)
                        return {
                          ...item,
                          checked: !pickUpTruck.checked
                        }
                      }else{
                        return item;
                      }
                    })
                    const findVehicle = manageVehicle.find((item) => item.name === "Pick-up Truck");
                    if(!findVehicle){
                      let findItem = vehicleTypes.find((subItem) => subItem.name === "Pick-up Truck")
                      if(findItem){
                        const addItem: VehicleTypes = Object.assign({}, findItem, {checked: true});
                        updateList.push(addItem);
                      }
                    }
                    setPickUpTruck({
                      checked: !pickUpTruck.checked
                    })
                    setManageVehicle(updateList)
                  }}
                  aria-label="Checkbox for following text input"
                />
              </div>
              <div className="d-flex align-items-center  gap-3 p-2 rounded-2  bg">
                <img src="/assets/Icon/_x31_7_Van.png" alt="scooter" />
                <span>Refrigerated Van</span>
                <input
                  type="checkbox"
                  checked={refVan.checked}
                  onClick={() => {
                    const updateList = manageVehicle.map((item) => {
                      // console.log(item)
                      if(item.name === "Refrigerated Van"){
                        return {
                          ...item,
                          checked: !refVan.checked
                        }
                      }else{
                        return item;
                      }
                    })
                    const findVehicle = manageVehicle.find((item) => item.name === "Refrigerated Van");
                    if(!findVehicle){
                      let findItem = vehicleTypes.find((subItem) => subItem.name === "Refrigerated Van")
                      if(findItem){
                        const addItem: VehicleTypes = Object.assign({}, findItem, {checked: true});
                        updateList.push(addItem);
                      }
                    }
                    setRefVan({
                      checked: !refVan.checked
                    })
                    setManageVehicle(updateList)
                  }}
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
                  checked={miniTruck.checked}
                  onClick={() => {
                    const updateList = manageVehicle.map((item) => {
                      // console.log(item)
                      if(item.name === "Mini Truck"){
                        return {
                          ...item,
                          checked: !miniTruck.checked
                        }
                      }else{
                        return item;
                      }
                    })
                    const findVehicle = manageVehicle.find((item) => item.name === "Mini Truck");
                    if(!findVehicle){
                      let findItem = vehicleTypes.find((subItem) => subItem.name === "Mini Truck")
                      if(findItem){
                        const addItem: VehicleTypes = Object.assign({}, findItem, {checked: true});
                        updateList.push(addItem);
                      }
                    }
                    setMiniTruck({
                      checked: !miniTruck.checked
                    })
                    setManageVehicle(updateList)
                  }}
                  aria-label="Checkbox for following text input"
                />
              </div>
              <div className="d-flex align-items-center  gap-3 p-2 rounded-2  bg">
                <img src="/assets/Icon/Truck.png" alt="scooter" />
                <span>Truck</span>
                <input
                  type="checkbox"
                  checked={truck.checked}
                  onClick={() => {
                    const updateList = manageVehicle.map((item) => {
                      // console.log(item)
                      if(item.name === "Truck"){
                        return {
                          ...item,
                          checked: !truck.checked
                        }
                      }else{
                        return item;
                      }
                    })
                    const findVehicle = manageVehicle.find((item) => item.name === "Truck");
                    if(!findVehicle){
                      let findItem = vehicleTypes.find((subItem) => subItem.name === "Truck")
                      if(findItem){
                        const addItem: VehicleTypes = Object.assign({}, findItem, {checked: true});
                        updateList.push(addItem);
                      }
                    }
                    setTruck({
                      checked: !truck.checked
                    })
                    setManageVehicle(updateList)
                    console.log(updateList)
                  }}
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
            <Button variant="primary" onClick={() => {
              setSelectedVehiclesList(manageVehicle);
              handleClose();
            }}>
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
