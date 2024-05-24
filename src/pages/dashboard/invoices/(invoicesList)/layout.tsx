import { useEffect, useMemo, useState } from "react";
import "./invoices-list.scss";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { useSetOpenNav } from "../..";
import { ReactComponent as BurgerSvg } from "@/assets/svgs/burger.svg";
import { useGetInvoicesMutation } from "@/state/slices/invoices/invoicesApiSlice";
import { useCreateBatchMutation, useGetAssociatesQuery } from "@/state/slices/batchs/batchsApiSlice";
import { useLogoutMutation } from "@/state/slices/authApiSlice";
import Invoice from "@/types/Invoice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import useDebounce from "@/utils/hooks/debounce";

type ContextType = {
  setSelectedCount: React.Dispatch<React.SetStateAction<number>>;
  setSearchTxt: React.Dispatch<React.SetStateAction<string>>;
  searchTxt: string;
  invoices: Invoice[];
  isLoading: boolean;
  loadMoreInvoices: (page: number) => void;
  setSelectedInvoiceIds: React.Dispatch<React.SetStateAction<number[]>>;
  selectedInvoiceIds: number[];
  setBatchType: React.Dispatch<React.SetStateAction<number>>;
};

export default function InvoicesList() {
  const tabs = [
    {
      name: "Deliveries",
      icon: (active: boolean) => {
        return active
          ? "/assets/Icon/Deliveries-blue.svg"
          : "/assets/Icon/Deliveries.svg";
      },
      link: "/dashboard/invoices/deliveries",
    },
    {
      name: "Collections",
      icon: (active: boolean) => {
        return active
          ? "/assets/Icon/Collections-blue.svg"
          : "/assets/Icon/Collections.svg";
      },
      link: "/dashboard/invoices/collections",
    },
    {
      name: "Completed",
      icon: (active: boolean) => {
        return active
          ? "/assets/Icon/Completed-blue.svg"
          : "/assets/Icon/Completed.svg";
      },
      link: "/dashboard/invoices/completed",
    },
  ];
  const [createBatch] = useCreateBatchMutation();
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<number[]>([]);

  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [batchType, setBatchType] = useState<number>(1);
  const [searchTxt, setSearchTxt] = useState("");
  const [loading, setLoading] = useState(false);
  const { setOpenNav } = useSetOpenNav();
  const navigate = useNavigate();
  const handleSubmit = async () => {

    if (selectedInvoiceIds.length === 0) {
      // Perhaps show an error or message indicating no invoices are selected
      // // console.log("No invoices selected.");
      return;
    }
    setLoading(true);
    try {
      const res = await createBatch({ invoices: selectedInvoiceIds, batch_type: batchType }).unwrap();
      //  // console.log(res);
      // navigate(`/dashboard/batch/${res.batch_number}/${res.batch.id}`);
      navigate(location?.pathname?.includes("collections") ? `/dashboard/batches/collections/${res.batch_number}/${res.batch.id}`
        : `/dashboard/batch/${res.batch_number}/${res.batch.id}`);
      //// console.log("Batch created successfully:", batchData);
      // Optionally, reset selected invoice IDs and selected count here
      setSelectedInvoiceIds([]);
      setSelectedCount(0);
      setLoading(false);
    } catch (err: any) {
      console.error("Failed to create batch:", err);

      alert(err?.data?.message)
      // Handle error here

      setLoading(false);
    }
  };

  return (
    <div className="invoices-list-component">
      <div className="nav-header">
        <div
          onClick={() => setSearchTxt("")}
          className="nav-links d-flex justify-content-between align-items-center w-md-100 g-0  m-0 text-12"
        >
          {tabs.map((tab, index) => (
            <NavLink
              to={tab.link}
              key={index}
              className={"text-decoration-none nav-link-cont"}
            >
              <li className={`navbar-link`}>
                <img
                  src={tab.icon(location.pathname === tab.link)}
                  alt={tab.name}
                />
                <span>{tab.name}</span>
              </li>
            </NavLink>
          ))}
        </div>
        <div className="invoice-right-bar">
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
          {lastSegment !== "completed" && (
            <button className="invoice-create-batch" disabled={loading}>
              {selectedCount > 0 ? (
                <div className="selected-count">
                  <span>{selectedCount}</span>
                </div>
              ) : (
                <img src={"/assets/Icon/Add.svg"} alt="User Avatar" />
              )}
              <span onClick={handleSubmit}>{
                loading ? "Creating..." : "Create Batch"
              }</span>
            </button>
          )}
        </div>
      </div>
      <div className="invoices-list-content">
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
      </div>
    </div>
  );
}

export function useInvoicesListState() {
  return useOutletContext<ContextType>();
}
