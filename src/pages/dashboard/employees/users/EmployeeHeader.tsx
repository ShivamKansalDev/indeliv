import { useEffect, useMemo, useState } from "react";
import "./employees-list.scss";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { useSetOpenNav } from "../../index";
import { ReactComponent as BurgerSvg } from "@/assets/svgs/burger.svg";

export default function EmployeeHeader(props: any) {
  const {
    setInformationOpen = () => {},
    setSearchText = (text: string) => {}
  } = props;
  const searchText: string = props.searchText; 
  const [loading, setLoading] = useState(false);
  const { setOpenNav } = useSetOpenNav();
  const navigate = useNavigate();
  const handleSubmit = async () => {
    setInformationOpen();
  };

  return (
    <div className="employees-list-component">
      <div className="nav-header">
        <div
          onClick={() => setSearchText("")}
          className="nav-links d-flex justify-content-between align-items-center w-md-100 g-0  m-0 text-12"
        >
            <span className="navbar-link">Employees</span>
        </div>
        <div className="employee-right-bar">
            <div className="search-bar-input">
                <BurgerSvg className="burger" onClick={() => setOpenNav(true)} />
                <img src={"/assets/Icon/Search.svg"} alt="User Avatar" />
                <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                type="search"
                placeholder="Search By Name or Invoice Number"
                />
            </div>
            <button onClick={handleSubmit} className="employee-create-batch">
                <img src={"/assets/Icon/Add.svg"} alt="User Avatar" />
                <span>{
                "Add Employee"
                }</span>
            </button>
        </div>
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
