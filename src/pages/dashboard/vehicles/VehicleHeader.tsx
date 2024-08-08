import { useEffect, useMemo, useState } from "react";
import "../employees/users/employees-list.scss";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { ReactComponent as BurgerSvg } from "@/assets/svgs/burger.svg";
import { useSetOpenNav } from "../index";
import VehicleModal from "@/components/vehicleModal/VehicleModal";
import ManageVehicleModal from "@/components/vehicleModal/ManageVehicleModal";

export default function VehicleHeader(props: any) {
  const {
    setAddVehicle = () => {},
    setNewVehicleDetails = () => {},
    setSearchText = (text: string) => {}
  } = props;
  const searchText: string = props.searchText; 
  const location = useLocation();
  const [addEditModal, setAddEditModal] = useState<boolean>(false);
  const [showManageModal, setShowManageModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const { setOpenNav } = useSetOpenNav();
  const navigate = useNavigate();
  const handleSubmit = async () => {
    setAddVehicle();
  };

  useEffect(() => {
    console.log("@@@ MANAGE MODAL: ", showManageModal);
  }, [showManageModal])

  return (
    <div className="employees-list-component">
      <div className="nav-header">
        <div
          onClick={() => setSearchText("")}
          className="nav-links d-flex justify-content-between align-items-center w-md-100 g-0  m-0 text-12"
        >
            <span className="navbar-link" style={{fontSize:"18px"}}>Vehicles</span>
        </div>
        <div className="employee-right-bar">
            <div className="search-bar-input">
                <BurgerSvg className="burger" onClick={() => setOpenNav(true)} />
                <img src={"/assets/Icon/Search.svg"} alt="User Avatar" />
                <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                type="search"
                placeholder="Search Vehicles"
                />
            </div>
            <button className="employee-create-batch d-none d-md-block" disabled={loading}>
                <img src={"/assets/Icon/Add.svg"} alt="User Avatar" />
                <span onClick={handleSubmit}>{
                "Add Vehicle"
                }</span>
            </button>
        </div>
      </div>
      <div className="addEmployeee  p-4 position-absolute bottom-0 w-100 d-flex align-items-center justify-content-center position-fixed left-0 d-block d-md-none" style={{marginLeft:"-16px"}}>
        <button onClick={handleSubmit} className="employee-create-batch w-100">
              <img src={"/assets/Icon/Add.svg"} alt="User Avatar" />
              <span>{
              "Add Vehicle"
              }</span>
          </button>
      </div>
      {/* <div className="invoices-list-content">
        <Outlet
          context={{
            setSelectedCount,
            searchTxt,
            setSelectedInvoiceIds,
            selectedInvoiceIds,
            // setSearchTxt,
            setBatchType
          }}
        />
      </div> */}
    </div>
  );
}
