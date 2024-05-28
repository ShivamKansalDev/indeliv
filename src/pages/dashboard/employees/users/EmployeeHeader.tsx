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

export default function EmployeeHeader() {
  const location = useLocation();
  const [searchTxt, setSearchTxt] = useState("");
  const [loading, setLoading] = useState(false);
  const { setOpenNav } = useSetOpenNav();
  const navigate = useNavigate();
  const handleSubmit = async () => {

    // if (selectedInvoiceIds.length === 0) {
    //   // Perhaps show an error or message indicating no invoices are selected
    //   // // console.log("No invoices selected.");
    //   return;
    // }
    // setLoading(true);
    // try {
    //   const res = await createBatch({ invoices: selectedInvoiceIds, batch_type: batchType }).unwrap();
    //   //  // console.log(res);
    //   // navigate(`/dashboard/batch/${res.batch_number}/${res.batch.id}`);
    //   navigate(location?.pathname?.includes("collections") ? `/dashboard/batches/collections/${res.batch_number}/${res.batch.id}`
    //     : `/dashboard/batch/${res.batch_number}/${res.batch.id}`);
    //   //// console.log("Batch created successfully:", batchData);
    //   // Optionally, reset selected invoice IDs and selected count here
    //   setSelectedInvoiceIds([]);
    //   setSelectedCount(0);
    //   setLoading(false);
    // } catch (err: any) {
    //   console.error("Failed to create batch:", err);

    //   alert(err?.data?.message)
    //   // Handle error here

    //   setLoading(false);
    // }
  };

  return (
    <div className="employees-list-component">
      <div className="nav-header">
        <div
          onClick={() => setSearchTxt("")}
          className="nav-links d-flex justify-content-between align-items-center w-md-100 g-0  m-0 text-12"
        >
            <span className="navbar-link">Employees</span>
        </div>
        <div className="employee-right-bar">
            <div className="search-bar-input">
                <BurgerSvg className="burger" onClick={() => setOpenNav(true)} />
                <img src={"/assets/Icon/Search.svg"} alt="User Avatar" />
                <input
                value={searchTxt}
                onChange={(e) => setSearchTxt(e.target.value)}
                type="search"
                placeholder="Search By Name or Invoice Number"
                />
            </div>
            <button className="employee-create-batch" disabled={loading}>
                <img src={"/assets/Icon/Add.svg"} alt="User Avatar" />
                <span onClick={handleSubmit} >{
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
