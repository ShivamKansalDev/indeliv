import { useContext, useEffect, useMemo, useState } from "react";
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
import { ReactComponent as Delete_icon } from "@/assets/svgs/Delete_icon.svg";
import { useGetInvoicesMutation } from "@/state/slices/invoices/invoicesApiSlice";
import { useCreateBatchMutation, useGetAssociatesQuery } from "@/state/slices/batchs/batchsApiSlice";
import { useLogoutMutation } from "@/state/slices/authApiSlice";
import Invoice from "@/types/Invoice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import useDebounce from "@/utils/hooks/debounce";
import { DateRange, Range } from "react-date-range";
import { ReactComponent as Calender } from '@/assets/svgs/calendar-2.svg'
import { ReactComponent as Calender_White } from '@/assets/svgs/calendar-white.svg'
import { ChevronDown, DeleteIcon } from 'lucide-react';
import { ReactComponent as CircleRed } from "@/assets/svgs/delete-circle.svg";
import { clearState } from "@/state/slices/invoices/invoicesSlice";
import moment from "moment";
import { Button, Modal } from "react-bootstrap";
import { LoginUserContext } from "@/App";

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
  fromDate: string;
  toDate: string;
  setDeleteInvoice: React.Dispatch<React.SetStateAction<Boolean>>;
  deleteInvoice: Boolean;
  setShowDelete: React.Dispatch<React.SetStateAction<Boolean>>;
  showDelete: any;
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
  const [dateStart, setDateStart] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: undefined,
      key: 'selection',
    },
  ]);
  const dispatch = useAppDispatch();
  const [viewCalender, setViewCalender] = useState(false);
  const [deleteInvoice, setDeleteInvoice] = useState(false)
  const [showDelete, setShowDelete] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [batchType, setBatchType] = useState<number>(1);
  const [searchTxt, setSearchTxt] = useState("");
  const [loading, setLoading] = useState(false);
  const { setOpenNav } = useSetOpenNav();
  const navigate = useNavigate();
  const context = useContext(LoginUserContext)
  const hasDeletePermission = context?.loginUserData.role.permissions?.some((permission: { id: number; }) => permission.id === 4);


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

  const [isMobileView, setIsMobileView] = useState(window.innerWidth >= 900);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 900);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onTabChange = () => {
    dispatch(clearState())
    setFromDate('')
    setToDate('')
    setDateStart([
      {
        startDate: new Date(),
        endDate: undefined,
        key: 'selection',
      }
    ])
  }

  return (
    <div className="invoices-list-component">
      <div className="nav-header">
        <div
          onClick={() => setSearchTxt("")}
          className="bg-pure-white nav-links d-flex justify-content-between align-items-center w-md-100 g-0  m-0 text-12"
        >
          {tabs.map((tab, index) => (
            <NavLink
              to={tab.link}
              key={index}
              className={"text-decoration-none nav-link-cont"}
              onClick={() => onTabChange()}
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
          {
            (!window.location.pathname.includes('completed') && hasDeletePermission) && (
              <div onClick={() => setDeleteInvoice(true)} className="delete_btn">
                <button style={{ backgroundColor: '#fafafd' }}>
                  <Delete_icon className="delete" />
                </button>
              </div>
            )
          }
          <div className="search-bar-input">
            <BurgerSvg className="burger" onClick={() => setOpenNav(true)} />
            <img src={"/assets/Icon/Search.svg"} alt="User Avatar" />
            <input
              value={searchTxt}
              onChange={(e) => setSearchTxt(e.target.value)}
              type="search"
              placeholder={`Search`}
            />
          </div>
          <div className="date-range-picker">
            <button
              type="button"
              className="btn btn-light btn-date-range Desktop_Date_Picker"
              onClick={() => setViewCalender(!viewCalender)}>
              <Calender />
              <span>{dateStart[0].startDate ? moment(dateStart[0].startDate).format(moment(dateStart[0].endDate).isSame(dateStart[0].startDate, 'day') ? 'DD MMM, YYYY' : 'DD MMM') : ''}</span>
              {(dateStart[0].endDate && !moment(dateStart[0].endDate).isSame(dateStart[0].startDate, 'day')) ?
                <span style={{ paddingLeft: 0 }}>- {moment(dateStart[0].endDate).format('DD MMM, YYYY')}</span> : null}
              <ChevronDown className="fs-6" />
            </button>
            <button
              type="button"
              className="Mobile_Date_Picker"
              onClick={() => setViewCalender(!viewCalender)}>
              <Calender_White />
            </button>

            {viewCalender && (
              <div className="drp_popover">
                <DateRange
                  editableDateInputs={false}
                  onChange={(item) => {
                    setDateStart([item.selection]);
                    // console.log(item)
                  }}
                  moveRangeOnFirstSelection={false}
                  showMonthAndYearPickers={true}
                  ranges={dateStart}
                />
                <div className="drp-btn-wrap">
                  <button
                    type="button"
                    onClick={() => setDateStart([
                      {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection',
                      }
                    ])}
                    className="btn btn-today">
                    Today
                  </button>
                </div>
                <hr className="drp-hr" />
                <div className="btn-row">
                  <button
                    type="button"
                    onClick={() => setViewCalender(false)}
                    className="btn btn-cancel">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const startDate = dateStart[0].startDate ? dateStart[0].startDate : '';
                      const endDate = dateStart[0].endDate ? dateStart[0].endDate : '';
                      //// console.log(startDate, endDate);
                      setFromDate(moment(startDate).format("YYYY-MM-DD"));
                      setToDate(moment(endDate).format("YYYY-MM-DD"));
                      setViewCalender(false);
                    }}
                    type="button"
                    className="btn flex-grow-1 btn-apply">
                    Apply
                  </button>
                </div>
              </div>
            )}
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
      <div className="invoices-list-content bg-pure-white">
        <Outlet
          context={{
            setSelectedCount,
            searchTxt,
            setSelectedInvoiceIds,
            selectedInvoiceIds,
            // setSearchTxt,
            setBatchType,
            fromDate,
            toDate,
            setDeleteInvoice,
            deleteInvoice,
            setShowDelete,
            showDelete
          }}
        />
      </div>
    </div>
  );
}

export function useInvoicesListState() {
  return useOutletContext<ContextType>();
}
