import React, { ReactNode, useEffect, useState } from "react";
import _ from "lodash";
import "../employees/users/employee-detail.scss";
import VehicleModal from "@/components/vehicleModal/VehicleModal";
import { Button } from "react-bootstrap";
import ManageVehicleModal from "@/components/vehicleModal/ManageVehicleModal";
import { API } from "@/api";
import { createVehicle, deleteVehicle, listVehicles, updateVehicle, vehiclesTypes } from "@/api/vehicles";
import VehicleHeader from "./VehicleHeader";
import DeleteVehicleModal from "@/components/vehicleModal/deleteVehicleModal";
import useDebounce from "@/utils/hooks/debounce";
import { vehicleSearchFilter } from "@/search/vehicle";
import NewLoader from "@/components/NewLoader";

export interface Vehicle {
  id: number;
  name: string;
  vehicle_type_id: number;
  created_at: string;
  updated_at: string;
  vehicle_type: string;
  loading:boolean
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
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading
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
  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Vehicle[]>([]);

  const debouncedSearch = useDebounce(searchText, 1000);

  useEffect(() => {
    if(debouncedSearch){
      const result = vehicleSearchFilter(debouncedSearch, vehiclesList)
      setSearchResults(result);
      // console.log("#### SEARCH RESULTS: ", result);
    }
  }, [debouncedSearch])

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
      });
      const map1 = _.keyBy(selectedList, 'id');
      selectedVehiclesList.forEach(item => {
        map1[item.id] = item;
      });
      const updatedArray = _.values(map1);
      setSelectedVehiclesList(updatedArray);
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

  async function getVehiclesList(changedVehicle: Vehicle | null = null){
    try {
      setLoading(true); // Set loading to true before making API call
      const response = await listVehicles();
      const data: Vehicle[] | [] = response.data;
      setVehiclesList(response.data);
      if(searchText && changedVehicle){
        const extractUpdatedVehicle = data.find((item) => item.id === changedVehicle.id);
        if(extractUpdatedVehicle){
          const updateSearchResult: Vehicle[] | [] = searchResults.map((item) => {
            if(item.id === changedVehicle.id){
              return extractUpdatedVehicle
            }
            return item;
          })
          if(updateSearchResult.length > 0){
            setSearchResults(updateSearchResult)
          }
        }
      }
    } catch (error) {
      console.log("!!! VEHICLES ERROR: ", error);
    }
    finally {
      setLoading(false); // Set loading to false after API call completes
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

  async function vehicleUpdate(data: string, value: Vehicle){
    try {
      const response = await updateVehicle(data);
      getVehiclesList(value);
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
        setSearchText("");
        setSearchResults([]);
        getVehiclesList();
      }
    } catch (error) {
      console.log("!!! VEHICLES DELETE ERROR: ", error);
    }
  }

  function renderItem(item: Vehicle){
    return (
      <div key={`${item.id}userbody`} className="employee-card">
        <div className="details">
          <div className="d-flex gap-3" >
            {(item.vehicle_type.toLowerCase() === "scooter")&& (
              <div style={{boxShadow: "0px 0px 24px 4px #0D99FF14 inset", borderRadius:"8px"}} className="px-3 py-2">
                <img src="/assets/Icon/Scooter.svg" alt="user_image" />
              </div>
            )}
            {(item.vehicle_type.toLowerCase() === "motor bike")&& (
                <div style={{boxShadow: "0px 0px 24px 4px #0D99FF14 inset", borderRadius:"8px"}} className="px-3 py-2">
              <img src="/assets/Icon/Motor Bike.svg" alt="user_image" />
              </div>
            )}
            {(item.vehicle_type.toLowerCase() === "three-wheeled")&& (
                <div style={{boxShadow: "0px 0px 24px 4px #0D99FF14 inset", borderRadius:"8px"}} className="px-3 py-2">
              <img src="/assets/Icon/Three-wheeled.svg" alt="user_image" />
              </div>
            )}
            {(item.vehicle_type.toLowerCase() === "car")&& (
                <div style={{boxShadow: "0px 0px 24px 4px #0D99FF14 inset", borderRadius:"8px"}} className="px-3 py-2">
              <img src="/assets/Icon/Car.svg" alt="user_image" />
            </div>
            )}
            {(item.vehicle_type.toLowerCase() === "truck")&& (
                <div style={{boxShadow: "0px 0px 24px 4px #0D99FF14 inset", borderRadius:"8px"}} className="px-3 py-2">
              <img src="/assets/Icon/Truck.svg" alt="user_image" />
            </div>
            )}
            {(item.vehicle_type.toLowerCase() === "refrigerated truck")&& (
                <div style={{boxShadow: "0px 0px 24px 4px #0D99FF14 inset", borderRadius:"8px"}} className="px-3 py-2">
              <img src="/assets/Icon/Refrigerated Truck.svg" alt="user_image" />
            </div>
            )}
            {(item.vehicle_type.toLowerCase() === "refrigerated van")&& (
                <div style={{boxShadow: "0px 0px 24px 4px #0D99FF14 inset", borderRadius:"8px"}} className="px-3 py-2">
              <img src="/assets/Icon/Refrigerated vans.svg" alt="user_image" />
            </div>
            )}
            {(item.vehicle_type.toLowerCase() === "mini truck")&& (
                <div style={{boxShadow: "0px 0px 24px 4px #0D99FF14 inset", borderRadius:"8px"}} className="px-3 py-2">
              <img src="/assets/Icon/Mini Truck.svg" alt="user_image" />
            </div>
            )}
            {(item.vehicle_type.toLowerCase() === "pick-up truck")&& (
                <div style={{boxShadow: "0px 0px 24px 4px #0D99FF14 inset", borderRadius:"8px"}} className="px-3 py-2">
              <img src="/assets/Icon/Pick-up trucks.svg" alt="user_image" />
            </div>
            )}
            {(item.vehicle_type.toLowerCase() === "van")&& (
                <div style={{boxShadow: "0px 0px 24px 4px #0D99FF14 inset", borderRadius:"8px"}} className="px-3 py-2">
              <img src="/assets/Icon/Van.svg" alt="user_image" />
            </div>
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
              style={{borderColor:"#EAECF0", color:"#1D2939",fontWeight:"600", backgroundColor:"white"}} 
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
  }

  return (
    <>
      <VehicleHeader 
        setAddVehicle={() => setAddVehicle(true)}
        searchText={searchText}
        setSearchText={(text: string) => setSearchText(text)}
      />
      <div className="employee-detail-page bg-pure-white">
        <DeleteVehicleModal
          deleteModalOpen={deleteModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
          deleteSelection={deleteSelection}
          setDeleteSelection={setDeleteSelection}
          deleteVehicleItem={deleteVehicleItem}
        />

        {loading && (
          <div className="d-flex justify-content-center mt-4">
            <div className="loading-row newLoaderAnimation" >
              
              <NewLoader cols={5} />
            </div>
          </div>
        )}

        <div className="content" style={{padding:"16px 0px"}}>
          {!(debouncedSearch)? (vehiclesList?.map((item: Vehicle): ReactNode => renderItem(item)))
          :
          (
            searchResults?.map((item: Vehicle): ReactNode => renderItem(item))
          )}
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
                const data = `${value.id}?name=${value.name.toUpperCase()}&vehicle_type_id=${value.vehicle_type_id}`
                vehicleUpdate(data, value);
              }else{
                const data = `name=${value.name.toUpperCase()}&vehicle_type_id=${value.vehicle_type_id}`;
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