import { useContext, useEffect, useMemo, useState } from "react";
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
import { LoginUserContext } from "@/App";

export default function EmployeeHeader(props: any) {
  const {
    setInformationOpen = () => {},
    setSearchText = (text: string) => {}
  } = props;
  const searchText: string = props.searchText; 
  const [loading, setLoading] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const context = useContext(LoginUserContext);

  const { setOpenNav } = useSetOpenNav();
  const navigate = useNavigate();
  const handleSubmit = async () => {
    setInformationOpen();
  };


  useEffect(() => {
    if (context?.loginUserData) {
        const data = context?.loginUserData?.role?.permissions;
        const filteredData = data.filter((item: any) => item.id === 20);
        if (filteredData.length > 0) {
          setCanCreate(true);
        } else {
          setCanCreate(false);
        }
    }
}, [context]);


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

            {(canCreate) && (
              <>
              {/* <div className="bg-dark p-2 position-absolute bottom-0 w-100 d-flex align-items-center justify-content-center position-fixed ">
                <button onClick={handleSubmit} className="employee-create-batch">
                      <img src={"/assets/Icon/Add.svg"} alt="User Avatar" />
                      <span>{
                      "Add Employee"
                      }</span>
                  </button>
              </div> */}
                <button onClick={handleSubmit} className="employee-create-batch d-none d-md-block">
                    <img src={"/assets/Icon/Add.svg"} alt="User Avatar" />
                    <span>{
                    "Add Employee"
                    }</span>
                </button>
              </>
            )}
        </div>
      </div>
      <div className="addEmployeee  p-4 position-absolute bottom-0 w-100 d-flex align-items-center justify-content-center position-fixed left-0 d-block d-md-none" style={{marginLeft:"-16px"}}>
        <button onClick={handleSubmit} className="employee-create-batch w-100">
              <img src={"/assets/Icon/Add.svg"} alt="User Avatar" />
              <span>{
              "Add Employee"
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
